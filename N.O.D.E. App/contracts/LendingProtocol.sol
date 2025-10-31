// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title N.O.D.E. Lending Protocol
 * @notice Community-powered micro-loans with revenue-share repayment model
 * @dev Adaptive lending based on community standing, no fixed monthly payments
 */
contract LendingProtocol {
    // ============ STATE VARIABLES ============
    
    address public owner;
    address public nodeVault; // Reference to N.O.D.E. Vault
    
    uint256 public constant MIN_LOAN = 10e8; // 10 HBAR minimum
    uint256 public constant MAX_LOAN = 1000000e8; // 1M HBAR maximum
    uint256 public totalLoansIssued;
    uint256 public totalLoansOutstanding;
    uint256 public defaultRate = 2; // 2% default rate
    
    // Loan structure
    struct Loan {
        uint256 id;
        address borrower;
        address lender; // Vault or individual lender
        uint256 principal; // Original loan amount
        uint256 amountPaid; // Total amount paid back
        uint256 interestRate; // Annual percentage (e.g., 6 = 6%)
        uint256 revenueShare; // Percentage of daily revenue (e.g., 5 = 5%)
        uint256 issuedAt;
        uint256 dueDate; // Optional, for fixed-term loans
        LoanStatus status;
        uint256 lastPaymentDate;
        uint256 communityScore; // Trust score from community
    }
    
    enum LoanStatus {
        Pending,
        Active,
        Repaid,
        Defaulted,
        Cancelled
    }
    
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public borrowerLoans;
    mapping(address => uint256) public borrowerDefaultCount;
    
    uint256 public loanCounter;
    
    // Lender information
    mapping(address => uint256) public lenderBalance; // Total funds provided by lender
    mapping(address => uint256) public lenderReturns; // Total returns earned
    
    // ============ EVENTS ============
    
    event LoanRequested(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 revenueShare,
        uint256 communityScore
    );
    
    event LoanIssued(
        uint256 indexed loanId,
        address indexed borrower,
        address indexed lender,
        uint256 principal,
        uint256 interestRate
    );
    
    event PaymentMade(
        uint256 indexed loanId,
        address indexed borrower,
        uint256 amount,
        uint256 remainingBalance
    );
    
    event LoanRepaid(uint256 indexed loanId, address indexed borrower);
    event LoanDefaulted(uint256 indexed loanId, address indexed borrower);
    
    // ============ MODIFIERS ============
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier validLoan(uint256 loanId) {
        require(loans[loanId].id != 0, "Loan does not exist");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _nodeVault) {
        owner = msg.sender;
        nodeVault = _nodeVault;
    }
    
    // ============ LOAN FUNCTIONS ============
    
    /**
     * @notice Request a loan from the protocol
     * @param amount Loan amount in tinybars
     * @param revenueShare Percentage of daily revenue to repay (0-100)
     * @param communityScore Borrower's community trust score
     */
    function requestLoan(
        uint256 amount,
        uint256 revenueShare,
        uint256 communityScore
    ) external returns (uint256) {
        require(amount >= MIN_LOAN && amount <= MAX_LOAN, "Invalid loan amount");
        require(revenueShare > 0 && revenueShare <= 20, "Revenue share must be 1-20%");
        require(communityScore >= 0 && communityScore <= 100, "Invalid community score");
        
        // Calculate interest rate based on community score and default history
        uint256 baseRate = 6; // Base 6% APR
        uint256 defaultPenalty = borrowerDefaultCount[msg.sender] * 2; // +2% per default
        uint256 scoreDiscount = (100 - communityScore) / 10; // Lower score = higher rate
        
        uint256 interestRate = baseRate + defaultPenalty + scoreDiscount;
        if (interestRate > 15) interestRate = 15; // Cap at 15%
        
        loanCounter++;
        uint256 loanId = loanCounter;
        
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            lender: address(0),
            principal: amount,
            amountPaid: 0,
            interestRate: interestRate,
            revenueShare: revenueShare,
            issuedAt: 0,
            dueDate: 0,
            status: LoanStatus.Pending,
            lastPaymentDate: 0,
            communityScore: communityScore
        });
        
        borrowerLoans[msg.sender].push(loanId);
        totalLoansIssued++;
        
        emit LoanRequested(loanId, msg.sender, amount, revenueShare, communityScore);
        
        return loanId;
    }
    
    /**
     * @notice Issue a pending loan (from vault or individual lender)
     * @param loanId Loan ID to issue
     */
    function issueLoan(uint256 loanId) external payable validLoan(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Pending, "Loan not pending");
        require(msg.value >= loan.principal, "Insufficient funds");
        
        loan.status = LoanStatus.Active;
        loan.issuedAt = block.timestamp;
        loan.lastPaymentDate = block.timestamp;
        loan.lender = msg.sender;
        
        lenderBalance[msg.sender] += loan.principal;
        totalLoansOutstanding += loan.principal;
        
        // Transfer funds to borrower
        (bool success, ) = payable(loan.borrower).call{value: loan.principal}("");
        require(success, "Transfer failed");
        
        emit LoanIssued(loanId, loan.borrower, msg.sender, loan.principal, loan.interestRate);
    }
    
    /**
     * @notice Make a revenue-share payment on a loan
     * @param loanId Loan ID
     * @param dailyRevenue Borrower's daily revenue (used to calculate payment)
     */
    function makeRevenueSharePayment(uint256 loanId, uint256 dailyRevenue) external payable validLoan(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.sender == loan.borrower, "Only borrower can pay");
        
        // Calculate payment based on revenue share percentage
        uint256 payment = (dailyRevenue * loan.revenueShare) / 100;
        
        // Ensure payment is sent with the transaction
        require(msg.value >= payment, "Insufficient payment");
        
        // Calculate total owed (principal + interest)
        uint256 timeElapsed = block.timestamp - loan.issuedAt;
        uint256 interestAccrued = (loan.principal * loan.interestRate * timeElapsed) / (100 * 365 days);
        uint256 totalOwed = loan.principal + interestAccrued;
        
        uint256 remainingBalance = totalOwed > loan.amountPaid ? totalOwed - loan.amountPaid : 0;
        
        if (payment > remainingBalance) {
            payment = remainingBalance;
        }
        
        loan.amountPaid += payment;
        loan.lastPaymentDate = block.timestamp;
        
        // Calculate lender return (payment minus protocol fee)
        uint256 protocolFee = payment * 1 / 100; // 1% protocol fee
        uint256 lenderReturn = payment - protocolFee;
        
        // Distribute to lender
        if (loan.lender != address(0)) {
            lenderReturns[loan.lender] += lenderReturn;
            (bool success, ) = payable(loan.lender).call{value: lenderReturn}("");
            require(success, "Lender transfer failed");
        }
        
        // Refund excess if any
        if (msg.value > payment) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - payment}("");
            require(refundSuccess, "Refund failed");
        }
        
        // Check if loan is fully repaid
        if (loan.amountPaid >= totalOwed) {
            loan.status = LoanStatus.Repaid;
            totalLoansOutstanding -= loan.principal;
            emit LoanRepaid(loanId, loan.borrower);
        }
        
        emit PaymentMade(loanId, loan.borrower, payment, remainingBalance - payment);
    }
    
    /**
     * @notice Make a direct payment (not revenue-share based)
     */
    function makeDirectPayment(uint256 loanId) external payable validLoan(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        require(msg.value > 0, "No payment sent");
        
        uint256 timeElapsed = block.timestamp - loan.issuedAt;
        uint256 interestAccrued = (loan.principal * loan.interestRate * timeElapsed) / (100 * 365 days);
        uint256 totalOwed = loan.principal + interestAccrued;
        uint256 remainingBalance = totalOwed > loan.amountPaid ? totalOwed - loan.amountPaid : 0;
        
        uint256 payment = msg.value > remainingBalance ? remainingBalance : msg.value;
        
        loan.amountPaid += payment;
        loan.lastPaymentDate = block.timestamp;
        
        // Calculate lender return
        uint256 protocolFee = payment * 1 / 100;
        uint256 lenderReturn = payment - protocolFee;
        
        if (loan.lender != address(0)) {
            lenderReturns[loan.lender] += lenderReturn;
            (bool success, ) = payable(loan.lender).call{value: lenderReturn}("");
            require(success, "Lender transfer failed");
        }
        
        if (loan.amountPaid >= totalOwed) {
            loan.status = LoanStatus.Repaid;
            totalLoansOutstanding -= loan.principal;
            emit LoanRepaid(loanId, loan.borrower);
        }
        
        emit PaymentMade(loanId, loan.borrower, payment, remainingBalance - payment);
    }
    
    /**
     * @notice Mark a loan as defaulted (called after grace period)
     */
    function markAsDefaulted(uint256 loanId) external onlyOwner validLoan(loanId) {
        Loan storage loan = loans[loanId];
        require(loan.status == LoanStatus.Active, "Loan not active");
        
        // Check if payment is overdue (e.g., 90 days without payment)
        require(
            block.timestamp > loan.lastPaymentDate + 90 days,
            "Loan not yet defaultable"
        );
        
        loan.status = LoanStatus.Defaulted;
        borrowerDefaultCount[loan.borrower]++;
        totalLoansOutstanding -= loan.principal;
        
        emit LoanDefaulted(loanId, loan.borrower);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get loan details
     */
    function getLoan(uint256 loanId) external view validLoan(loanId) returns (
        address borrower,
        address lender,
        uint256 principal,
        uint256 amountPaid,
        uint256 interestRate,
        uint256 revenueShare,
        LoanStatus status,
        uint256 remainingBalance
    ) {
        Loan memory loan = loans[loanId];
        borrower = loan.borrower;
        lender = loan.lender;
        principal = loan.principal;
        amountPaid = loan.amountPaid;
        interestRate = loan.interestRate;
        revenueShare = loan.revenueShare;
        status = loan.status;
        
        if (loan.status == LoanStatus.Active) {
            uint256 timeElapsed = block.timestamp - loan.issuedAt;
            uint256 interestAccrued = (loan.principal * loan.interestRate * timeElapsed) / (100 * 365 days);
            uint256 totalOwed = loan.principal + interestAccrued;
            remainingBalance = totalOwed > loan.amountPaid ? totalOwed - loan.amountPaid : 0;
        } else {
            remainingBalance = 0;
        }
    }
    
    /**
     * @notice Get all loans for a borrower
     */
    function getBorrowerLoans(address borrower) external view returns (uint256[] memory) {
        return borrowerLoans[borrower];
    }
    
    /**
     * @notice Get protocol statistics
     */
    function getProtocolStats() external view returns (
        uint256 _totalLoansIssued,
        uint256 _totalLoansOutstanding,
        uint256 _defaultRate,
        uint256 _totalLenderBalance,
        uint256 _totalLenderReturns
    ) {
        _totalLoansIssued = totalLoansIssued;
        _totalLoansOutstanding = totalLoansOutstanding;
        _defaultRate = defaultRate;
        _totalLenderBalance = address(this).balance;
        _totalLenderReturns = 0; // Would need to track this
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    function setDefaultRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10, "Rate too high");
        defaultRate = newRate;
    }
    
    receive() external payable {
        // Allow direct deposits for lending
    }
}

