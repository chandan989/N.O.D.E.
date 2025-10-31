// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title N.O.D.E. Governance
 * @notice DAO governance contract for community decision-making
 * @dev Voting mechanism for protocol changes and proposals
 */
contract NodeGovernance {
    // ============ STATE VARIABLES ============
    
    address public owner;
    uint256 public proposalCounter;
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public constant MIN_VOTING_POWER = 1e8; // 1 HBAR staked minimum
    uint256 public quorumThreshold = 10; // 10% of total stake required
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 abstainVotes;
        uint256 startTime;
        uint256 endTime;
        ProposalStatus status;
        bytes callData; // For executable proposals
        address targetContract; // Contract to call if proposal passes
        uint256 executionThreshold; // Minimum votes needed for execution
    }
    
    enum ProposalStatus {
        Pending,
        Active,
        Succeeded,
        Defeated,
        Executed,
        Cancelled
    }
    
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => Vote)) public votes; // proposalId => voter => vote
    
    enum Vote {
        None,
        For,
        Against,
        Abstain
    }
    
    // Voting power from staking
    address public nodeVault;
    mapping(address => uint256) public votingPower; // Based on staked amount
    uint256 public totalVotingPower;
    
    // ============ EVENTS ============
    
    event ProposalCreated(
        uint256 indexed proposalId,
        address indexed proposer,
        string title,
        uint256 startTime,
        uint256 endTime
    );
    
    event VoteCast(
        uint256 indexed proposalId,
        address indexed voter,
        Vote vote,
        uint256 votingPower
    );
    
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    event VotingPowerUpdated(address indexed voter, uint256 newPower);
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier validProposal(uint256 proposalId) {
        require(proposals[proposalId].id != 0, "Proposal does not exist");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _nodeVault) {
        owner = msg.sender;
        nodeVault = _nodeVault;
    }
    
    // ============ PROPOSAL FUNCTIONS ============
    
    /**
     * @notice Create a new governance proposal
     * @param title Proposal title
     * @param description Detailed description
     * @param targetContract Address of contract to call if passed (optional)
     * @param callData Function call data (optional)
     */
    function createProposal(
        string memory title,
        string memory description,
        address targetContract,
        bytes memory callData
    ) external returns (uint256) {
        require(votingPower[msg.sender] >= MIN_VOTING_POWER, "Insufficient voting power");
        require(bytes(title).length > 0, "Title required");
        require(bytes(description).length > 0, "Description required");
        
        proposalCounter++;
        uint256 proposalId = proposalCounter;
        
        proposals[proposalId] = Proposal({
            id: proposalId,
            proposer: msg.sender,
            title: title,
            description: description,
            forVotes: 0,
            againstVotes: 0,
            abstainVotes: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + VOTING_PERIOD,
            status: ProposalStatus.Active,
            callData: callData,
            targetContract: targetContract,
            executionThreshold: (totalVotingPower * quorumThreshold) / 100
        });
        
        emit ProposalCreated(proposalId, msg.sender, title, block.timestamp, proposals[proposalId].endTime);
        
        return proposalId;
    }
    
    /**
     * @notice Vote on a proposal
     * @param proposalId Proposal ID
     * @param voteChoice Vote choice (For, Against, Abstain)
     */
    function vote(uint256 proposalId, Vote voteChoice) external validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        require(voteChoice != Vote.None, "Invalid vote");
        
        uint256 power = votingPower[msg.sender];
        require(power > 0, "No voting power");
        
        hasVoted[proposalId][msg.sender] = true;
        votes[proposalId][msg.sender] = voteChoice;
        
        if (voteChoice == Vote.For) {
            proposal.forVotes += power;
        } else if (voteChoice == Vote.Against) {
            proposal.againstVotes += power;
        } else if (voteChoice == Vote.Abstain) {
            proposal.abstainVotes += power;
        }
        
        emit VoteCast(proposalId, msg.sender, voteChoice, power);
    }
    
    /**
     * @notice Execute a successful proposal
     */
    function executeProposal(uint256 proposalId) external validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        require(block.timestamp > proposal.endTime, "Voting still active");
        
        // Check if proposal succeeded
        uint256 totalVotes = proposal.forVotes + proposal.againstVotes + proposal.abstainVotes;
        bool succeeded = proposal.forVotes > proposal.againstVotes && 
                         totalVotes >= proposal.executionThreshold;
        
        if (succeeded) {
            proposal.status = ProposalStatus.Succeeded;
            
            // Execute proposal if it has a target contract
            if (proposal.targetContract != address(0) && proposal.callData.length > 0) {
                (bool success, ) = proposal.targetContract.call(proposal.callData);
                require(success, "Proposal execution failed");
                proposal.status = ProposalStatus.Executed;
            }
            
            emit ProposalExecuted(proposalId);
        } else {
            proposal.status = ProposalStatus.Defeated;
        }
    }
    
    /**
     * @notice Cancel a proposal (only proposer or owner)
     */
    function cancelProposal(uint256 proposalId) external validProposal(proposalId) {
        Proposal storage proposal = proposals[proposalId];
        require(
            msg.sender == proposal.proposer || msg.sender == owner,
            "Not authorized"
        );
        require(proposal.status == ProposalStatus.Active, "Proposal not active");
        
        proposal.status = ProposalStatus.Cancelled;
        emit ProposalCancelled(proposalId);
    }
    
    // ============ VOTING POWER MANAGEMENT ============
    
    /**
     * @notice Update voting power for an address (called by vault when staking)
     * @dev This should be called by the NodeVault contract when users stake/unstake
     */
    function updateVotingPower(address voter, uint256 stakedAmount) external {
        require(msg.sender == nodeVault || msg.sender == owner, "Not authorized");
        
        uint256 oldPower = votingPower[voter];
        votingPower[voter] = stakedAmount;
        
        totalVotingPower = totalVotingPower - oldPower + stakedAmount;
        
        emit VotingPowerUpdated(voter, stakedAmount);
    }
    
    /**
     * @notice Get voting power for an address
     */
    function getVotingPower(address voter) external view returns (uint256) {
        return votingPower[voter];
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get proposal details
     */
    function getProposal(uint256 proposalId) external view validProposal(proposalId) returns (
        address proposer,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 abstainVotes,
        uint256 startTime,
        uint256 endTime,
        ProposalStatus status,
        bool canExecute
    ) {
        Proposal memory proposal = proposals[proposalId];
        proposer = proposal.proposer;
        title = proposal.title;
        description = proposal.description;
        forVotes = proposal.forVotes;
        againstVotes = proposal.againstVotes;
        abstainVotes = proposal.abstainVotes;
        startTime = proposal.startTime;
        endTime = proposal.endTime;
        status = proposal.status;
        
        uint256 totalVotes = forVotes + againstVotes + abstainVotes;
        canExecute = block.timestamp > proposal.endTime &&
                     proposal.forVotes > proposal.againstVotes &&
                     totalVotes >= proposal.executionThreshold &&
                     proposal.status == ProposalStatus.Active;
    }
    
    /**
     * @notice Check if user has voted on a proposal
     */
    function hasUserVoted(uint256 proposalId, address user) external view returns (bool) {
        return hasVoted[proposalId][user];
    }
    
    /**
     * @notice Get user's vote on a proposal
     */
    function getUserVote(uint256 proposalId, address user) external view returns (Vote) {
        return votes[proposalId][user];
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function setQuorumThreshold(uint256 newThreshold) external onlyOwner {
        require(newThreshold > 0 && newThreshold <= 50, "Invalid threshold");
        quorumThreshold = newThreshold;
    }
    
    function setNodeVault(address newVault) external onlyOwner {
        nodeVault = newVault;
    }
}

