// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title N.O.D.E. Vault
 * @notice Community-powered liquidity pool for staking HBAR with yield distribution
 * @dev Built for Hedera Hashgraph
 */
contract NodeVault {
    // ============ STATE VARIABLES ============
    
    address public owner;
    uint256 public totalStaked;
    uint256 public totalYieldGenerated;
    uint256 public constant MIN_STAKE = 1e8; // 1 HBAR (in tinybars, 1 HBAR = 100,000,000 tinybars)
    uint256 public constant YIELD_RATE = 5; // 5% annual yield
    
    // Staker information
    struct Staker {
        uint256 amount;           // Amount staked
        uint256 timestamp;        // When they staked
        uint256 lastClaim;        // Last yield claim timestamp
        uint256 pendingYield;    // Accumulated yield not yet claimed
    }
    
    mapping(address => Staker) public stakers;
    address[] public stakerAddresses;
    
    // Yield distribution pools
    struct Pool {
        string name;
        uint256 allocation;       // Percentage of yield (0-100)
        uint256 totalInvested;     // Total HBAR invested in this pool
        bool active;
    }
    
    mapping(uint256 => Pool) public pools;
    uint256 public poolCount;
    
    // ============ EVENTS ============
    
    event Staked(address indexed staker, uint256 amount, uint256 timestamp);
    event Unstaked(address indexed staker, uint256 amount, uint256 timestamp);
    event YieldClaimed(address indexed staker, uint256 yieldAmount);
    event YieldDistributed(uint256 totalYield, uint256 timestamp);
    event PoolCreated(uint256 indexed poolId, string name, uint256 allocation);
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier validStaker() {
        require(stakers[msg.sender].amount > 0, "Not a staker");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
        
        // Initialize default pools
        _createPool("Small Business Lending", 40);
        _createPool("Green Energy Projects", 35);
        _createPool("Reserves", 25);
    }
    
    // ============ CORE FUNCTIONS ============
    
    /**
     * @notice Stake HBAR into the vault
     */
    function stake() external payable {
        require(msg.value >= MIN_STAKE, "Minimum stake is 1 HBAR");
        
        if (stakers[msg.sender].amount == 0) {
            // New staker
            stakerAddresses.push(msg.sender);
            stakers[msg.sender] = Staker({
                amount: msg.value,
                timestamp: block.timestamp,
                lastClaim: block.timestamp,
                pendingYield: 0
            });
        } else {
            // Existing staker - add to existing stake
            _updateYield(msg.sender);
            stakers[msg.sender].amount += msg.value;
        }
        
        totalStaked += msg.value;
        emit Staked(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @notice Unstake HBAR from the vault
     * @param amount Amount to unstake (in tinybars)
     */
    function unstake(uint256 amount) external validStaker {
        Staker storage staker = stakers[msg.sender];
        require(amount <= staker.amount, "Insufficient staked amount");
        
        _updateYield(msg.sender);
        
        // Claim pending yield first
        if (staker.pendingYield > 0) {
            uint256 yieldToClaim = staker.pendingYield;
            staker.pendingYield = 0;
            staker.lastClaim = block.timestamp;
            
            (bool success, ) = payable(msg.sender).call{value: yieldToClaim}("");
            require(success, "Yield transfer failed");
            emit YieldClaimed(msg.sender, yieldToClaim);
        }
        
        // Unstake
        staker.amount -= amount;
        totalStaked -= amount;
        
        if (staker.amount == 0) {
            // Remove from staker list
            _removeStaker(msg.sender);
            delete stakers[msg.sender];
        }
        
        (bool success2, ) = payable(msg.sender).call{value: amount}("");
        require(success2, "Unstake transfer failed");
        
        emit Unstaked(msg.sender, amount, block.timestamp);
    }
    
    /**
     * @notice Claim accumulated yield
     */
    function claimYield() external validStaker {
        _updateYield(msg.sender);
        
        Staker storage staker = stakers[msg.sender];
        uint256 yieldToClaim = staker.pendingYield;
        
        require(yieldToClaim > 0, "No yield to claim");
        
        staker.pendingYield = 0;
        staker.lastClaim = block.timestamp;
        
        (bool success, ) = payable(msg.sender).call{value: yieldToClaim}("");
        require(success, "Yield transfer failed");
        
        emit YieldClaimed(msg.sender, yieldToClaim);
    }
    
    /**
     * @notice Distribute yield from pool investments
     * @dev Called by owner when pools generate returns
     */
    function distributeYield() external payable {
        require(msg.value > 0, "No yield to distribute");
        require(totalStaked > 0, "No stakers");
        
        totalYieldGenerated += msg.value;
        
        // Calculate yield per staker based on their stake and time
        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            address stakerAddr = stakerAddresses[i];
            if (stakers[stakerAddr].amount > 0) {
                _updateYield(stakerAddr);
                
                // Add proportional share
                uint256 share = (msg.value * stakers[stakerAddr].amount) / totalStaked;
                stakers[stakerAddr].pendingYield += share;
            }
        }
        
        emit YieldDistributed(msg.value, block.timestamp);
    }
    
    // ============ POOL MANAGEMENT ============
    
    /**
     * @notice Create a new investment pool
     */
    function createPool(string memory name, uint256 allocation) external onlyOwner {
        require(allocation <= 100, "Allocation cannot exceed 100%");
        _createPool(name, allocation);
    }
    
    function _createPool(string memory name, uint256 allocation) internal {
        pools[poolCount] = Pool({
            name: name,
            allocation: allocation,
            totalInvested: 0,
            active: true
        });
        emit PoolCreated(poolCount, name, allocation);
        poolCount++;
    }
    
    /**
     * @notice Invest vault funds into a pool
     */
    function investInPool(uint256 poolId, uint256 amount) external onlyOwner {
        require(pools[poolId].active, "Pool not active");
        require(address(this).balance >= amount, "Insufficient vault balance");
        
        pools[poolId].totalInvested += amount;
        // In production, this would transfer to actual investment contracts
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get staker information
     */
    function getStakerInfo(address stakerAddr) external view returns (
        uint256 amount,
        uint256 pendingYield,
        uint256 stakedSince,
        uint256 estimatedAnnualYield
    ) {
        Staker memory staker = stakers[stakerAddr];
        amount = staker.amount;
        pendingYield = _calculatePendingYield(staker);
        stakedSince = staker.timestamp;
        estimatedAnnualYield = (staker.amount * YIELD_RATE) / 100;
    }
    
    /**
     * @notice Get total number of stakers
     */
    function getStakerCount() external view returns (uint256) {
        return stakerAddresses.length;
    }
    
    /**
     * @notice Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 _totalStaked,
        uint256 _totalYieldGenerated,
        uint256 _stakerCount,
        uint256 _vaultBalance
    ) {
        _totalStaked = totalStaked;
        _totalYieldGenerated = totalYieldGenerated;
        _stakerCount = stakerAddresses.length;
        _vaultBalance = address(this).balance;
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @notice Update yield for a staker
     */
    function _updateYield(address stakerAddr) internal {
        Staker storage staker = stakers[stakerAddr];
        uint256 pending = _calculatePendingYield(staker);
        staker.pendingYield += pending;
        staker.lastClaim = block.timestamp;
    }
    
    /**
     * @notice Calculate pending yield for a staker
     */
    function _calculatePendingYield(Staker memory staker) internal view returns (uint256) {
        if (staker.amount == 0 || staker.lastClaim == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - staker.lastClaim;
        uint256 secondsPerYear = 365 days;
        
        // Calculate yield: (amount * rate * time) / (100 * secondsPerYear)
        uint256 yield = (staker.amount * YIELD_RATE * timeElapsed) / (100 * secondsPerYear);
        
        return yield;
    }
    
    /**
     * @notice Remove a staker from the addresses array
     */
    function _removeStaker(address stakerAddr) internal {
        for (uint256 i = 0; i < stakerAddresses.length; i++) {
            if (stakerAddresses[i] == stakerAddr) {
                stakerAddresses[i] = stakerAddresses[stakerAddresses.length - 1];
                stakerAddresses.pop();
                break;
            }
        }
    }
    
    // ============ RECEIVE FUNCTION ============
    
    receive() external payable {
        // Allow direct deposits - automatically stake
        // This allows simple HBAR transfers to the contract
        if (msg.value > 0) {
            // Call stake logic directly
            if (stakers[msg.sender].amount == 0) {
                stakerAddresses.push(msg.sender);
                stakers[msg.sender] = Staker({
                    amount: msg.value,
                    timestamp: block.timestamp,
                    lastClaim: block.timestamp,
                    pendingYield: 0
                });
            } else {
                _updateYield(msg.sender);
                stakers[msg.sender].amount += msg.value;
            }
            
            totalStaked += msg.value;
            emit Staked(msg.sender, msg.value, block.timestamp);
        }
    }
}

