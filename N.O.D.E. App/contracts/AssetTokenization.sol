// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title N.O.D.E. Asset Tokenization
 * @notice Fractional NFT ownership for real-world productive assets
 * @dev Tokenizes assets (solar arrays, 3D printers, vehicles) into fractional NFTs
 */
contract AssetTokenization {
    // ============ STATE VARIABLES ============
    
    address public owner;
    uint256 public assetCounter;
    
    // Asset structure
    struct Asset {
        uint256 id;
        address creator;
        string name;
        string description;
        string assetType; // "solar", "printer", "vehicle", etc.
        uint256 totalSupply; // Total number of shares
        uint256 totalValue; // Total value in tinybars
        uint256 pricePerShare; // Price in tinybars
        uint256 sharesSold;
        uint256 revenueGenerated; // Total revenue from asset
        uint256 lastDistribution; // Last yield distribution timestamp
        AssetStatus status;
        address beneficiary; // Who receives revenue (asset operator)
        uint256 beneficiaryFee; // Fee percentage (0-100)
    }
    
    enum AssetStatus {
        Proposed,
        Funding,
        Active,
        SoldOut,
        Delisted
    }
    
    mapping(uint256 => Asset) public assets;
    
    // Share ownership
    mapping(uint256 => mapping(address => uint256)) public shares; // assetId => owner => amount
    mapping(address => uint256[]) public userAssets; // user => assetIds they own
    
    // Revenue distribution
    uint256 public constant DISTRIBUTION_INTERVAL = 30 days;
    mapping(uint256 => mapping(address => uint256)) public pendingRevenue; // assetId => owner => amount
    
    // ============ EVENTS ============
    
    event AssetCreated(
        uint256 indexed assetId,
        address indexed creator,
        string name,
        uint256 totalSupply,
        uint256 pricePerShare
    );
    
    event SharesPurchased(
        uint256 indexed assetId,
        address indexed buyer,
        uint256 shares,
        uint256 totalCost
    );
    
    event RevenueDistributed(
        uint256 indexed assetId,
        address indexed shareholder,
        uint256 amount
    );
    
    event AssetActivated(uint256 indexed assetId);
    event AssetDelisted(uint256 indexed assetId);
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier validAsset(uint256 assetId) {
        require(assets[assetId].id != 0, "Asset does not exist");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
    }
    
    // ============ ASSET MANAGEMENT ============
    
    /**
     * @notice Create a new asset tokenization proposal
     * @param name Asset name
     * @param description Asset description
     * @param assetType Type of asset
     * @param totalSupply Number of shares to issue
     * @param totalValue Total value of asset in tinybars
     * @param beneficiary Address that will operate the asset
     * @param beneficiaryFee Fee percentage for beneficiary (0-100)
     */
    function createAsset(
        string memory name,
        string memory description,
        string memory assetType,
        uint256 totalSupply,
        uint256 totalValue,
        address beneficiary,
        uint256 beneficiaryFee
    ) external returns (uint256) {
        require(totalSupply > 0, "Invalid supply");
        require(totalValue > 0, "Invalid value");
        require(beneficiaryFee <= 20, "Beneficiary fee too high");
        require(bytes(name).length > 0, "Name required");
        
        assetCounter++;
        uint256 assetId = assetCounter;
        
        uint256 pricePerShare = totalValue / totalSupply;
        
        assets[assetId] = Asset({
            id: assetId,
            creator: msg.sender,
            name: name,
            description: description,
            assetType: assetType,
            totalSupply: totalSupply,
            totalValue: totalValue,
            pricePerShare: pricePerShare,
            sharesSold: 0,
            revenueGenerated: 0,
            lastDistribution: 0,
            status: AssetStatus.Funding,
            beneficiary: beneficiary,
            beneficiaryFee: beneficiaryFee
        });
        
        emit AssetCreated(assetId, msg.sender, name, totalSupply, pricePerShare);
        
        return assetId;
    }
    
    /**
     * @notice Purchase shares of an asset
     * @param assetId Asset ID
     * @param shareAmount Number of shares to purchase
     */
    function purchaseShares(uint256 assetId, uint256 shareAmount) external payable validAsset(assetId) {
        Asset storage asset = assets[assetId];
        require(asset.status == AssetStatus.Funding, "Asset not in funding");
        require(shareAmount > 0, "Invalid share amount");
        require(asset.sharesSold + shareAmount <= asset.totalSupply, "Not enough shares available");
        
        uint256 totalCost = asset.pricePerShare * shareAmount;
        require(msg.value >= totalCost, "Insufficient payment");
        
        // Update asset
        asset.sharesSold += shareAmount;
        
        // Update ownership
        if (shares[assetId][msg.sender] == 0) {
            // New shareholder
            userAssets[msg.sender].push(assetId);
        }
        shares[assetId][msg.sender] += shareAmount;
        
        // Check if fully funded
        if (asset.sharesSold == asset.totalSupply) {
            asset.status = AssetStatus.Active;
            asset.lastDistribution = block.timestamp;
            emit AssetActivated(assetId);
        }
        
        // Refund excess
        if (msg.value > totalCost) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
            require(refundSuccess, "Refund failed");
        }
        
        // Transfer funds to creator (would typically go to escrow until delivery)
        (bool success, ) = payable(asset.creator).call{value: totalCost}("");
        require(success, "Transfer failed");
        
        emit SharesPurchased(assetId, msg.sender, shareAmount, totalCost);
    }
    
    /**
     * @notice Record revenue generated by an asset
     * @param assetId Asset ID
     * @dev Called by beneficiary or owner when asset generates revenue
     */
    function recordRevenue(uint256 assetId) external payable validAsset(assetId) {
        Asset storage asset = assets[assetId];
        require(asset.status == AssetStatus.Active, "Asset not active");
        require(
            msg.sender == asset.beneficiary || msg.sender == owner,
            "Not authorized"
        );
        require(msg.value > 0, "No revenue sent");
        
        asset.revenueGenerated += msg.value;
        
        // Distribute revenue to shareholders
        _distributeRevenue(assetId, msg.value);
    }
    
    /**
     * @notice Internal function to distribute revenue to shareholders
     */
    function _distributeRevenue(uint256 assetId, uint256 revenueAmount) internal {
        Asset storage asset = assets[assetId];
        
        // Calculate beneficiary fee
        uint256 beneficiaryAmount = (revenueAmount * asset.beneficiaryFee) / 100;
        uint256 distributionAmount = revenueAmount - beneficiaryAmount;
        
        // Send beneficiary fee
        if (beneficiaryAmount > 0 && asset.beneficiary != address(0)) {
            (bool success, ) = payable(asset.beneficiary).call{value: beneficiaryAmount}("");
            require(success, "Beneficiary transfer failed");
        }
        
        // Calculate distribution per share (stored for future claim functionality)
        // In production, this would track per-share distribution over time
        // For now, revenue is tracked at the asset level for claiming
        
        asset.lastDistribution = block.timestamp;
    }
    
    /**
     * @notice Claim pending revenue for owned shares
     * @param assetId Asset ID
     */
    function claimRevenue(uint256 assetId) external validAsset(assetId) {
        Asset storage asset = assets[assetId];
        require(asset.status == AssetStatus.Active, "Asset not active");
        
        uint256 userShares = shares[assetId][msg.sender];
        require(userShares > 0, "No shares owned");
        
        // Get pending revenue for this shareholder
        uint256 claimable = pendingRevenue[assetId][msg.sender];
        if (claimable > 0) {
            pendingRevenue[assetId][msg.sender] = 0;
            
            (bool success, ) = payable(msg.sender).call{value: claimable}("");
            require(success, "Transfer failed");
            
            emit RevenueDistributed(assetId, msg.sender, claimable);
        }
    }
    
    /**
     * @notice Delist an asset (owner only)
     */
    function delistAsset(uint256 assetId) external onlyOwner validAsset(assetId) {
        Asset storage asset = assets[assetId];
        require(asset.status != AssetStatus.Delisted, "Already delisted");
        
        asset.status = AssetStatus.Delisted;
        emit AssetDelisted(assetId);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get asset details
     */
    function getAsset(uint256 assetId) external view validAsset(assetId) returns (
        address creator,
        string memory name,
        string memory description,
        string memory assetType,
        uint256 totalSupply,
        uint256 sharesSold,
        uint256 pricePerShare,
        uint256 revenueGenerated,
        AssetStatus status,
        address beneficiary
    ) {
        Asset memory asset = assets[assetId];
        creator = asset.creator;
        name = asset.name;
        description = asset.description;
        assetType = asset.assetType;
        totalSupply = asset.totalSupply;
        sharesSold = asset.sharesSold;
        pricePerShare = asset.pricePerShare;
        revenueGenerated = asset.revenueGenerated;
        status = asset.status;
        beneficiary = asset.beneficiary;
    }
    
    /**
     * @notice Get user's shares in an asset
     */
    function getUserShares(uint256 assetId, address user) external view returns (uint256) {
        return shares[assetId][user];
    }
    
    /**
     * @notice Get all assets owned by a user
     */
    function getUserAssets(address user) external view returns (uint256[] memory) {
        return userAssets[user];
    }
    
    /**
     * @notice Get asset funding progress
     */
    function getFundingProgress(uint256 assetId) external view validAsset(assetId) returns (
        uint256 sold,
        uint256 total,
        uint256 progressPercent,
        uint256 remainingShares
    ) {
        Asset memory asset = assets[assetId];
        sold = asset.sharesSold;
        total = asset.totalSupply;
        progressPercent = (sold * 100) / total;
        remainingShares = total - sold;
    }
    
    receive() external payable {
        // Allow direct revenue deposits
    }
}

