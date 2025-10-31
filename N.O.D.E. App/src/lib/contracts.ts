/**
 * N.O.D.E. Smart Contract Integration
 * 
 * Provides functions to interact with deployed N.O.D.E. smart contracts on Hedera
 */

import {
    Client,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    Hbar,
    AccountId,
} from "@hashgraph/sdk";

// Import contract addresses from config
import { CONTRACT_ADDRESSES } from './contract-config';

// Contract addresses (loaded from deployment-info.json or environment)
const CONTRACTS = {
    NodeVault: CONTRACT_ADDRESSES.NodeVault,
    LendingProtocol: CONTRACT_ADDRESSES.LendingProtocol,
    NodeGovernance: CONTRACT_ADDRESSES.NodeGovernance,
    AssetTokenization: CONTRACT_ADDRESSES.AssetTokenization,
};

// Network configuration
const getClient = (network: 'testnet' | 'mainnet' = 'testnet') => {
    return network === 'mainnet' 
        ? Client.forMainnet() 
        : Client.forTestnet();
};

/**
 * Execute a contract function with wallet signing
 */
async function executeContractFunction(
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    accountId: string,
    network: 'testnet' | 'mainnet' = 'testnet',
    value?: number // Optional HBAR amount to send with transaction
): Promise<string> {
    try {
        const client = getClient(network);
        const contractAddress = AccountId.fromString(contractId);

        const transaction = new ContractExecuteTransaction()
            .setContractId(contractAddress)
            .setFunction(functionName, params)
            .setGas(1000000); // Increased gas limit for contract calls

        // Add HBAR value if specified (for payable functions like stake())
        if (value !== undefined && value > 0) {
            transaction.setPayableAmount(Hbar.fromTinybars(value));
        }

        // Sign and execute via WalletConnect
        // This requires wallet integration - see wallet-connect-modal.tsx
        // For now, return the transaction object for wallet signing
        
        // TODO: Integrate with WalletConnect to sign and execute
        // The wallet should sign the transaction and return the transaction ID
        
        throw new Error("Contract execution requires wallet signing integration");
    } catch (error) {
        console.error(`Error executing contract function ${functionName}:`, error);
        throw error;
    }
}

/**
 * Prepare a contract transaction for wallet signing
 * Returns transaction bytes that can be signed by WalletConnect
 */
export async function prepareContractTransaction(
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    network: 'testnet' | 'mainnet' = 'testnet',
    value?: number
): Promise<any> {
    try {
        const client = getClient(network);
        const contractAddress = AccountId.fromString(contractId);

        const transaction = new ContractExecuteTransaction()
            .setContractId(contractAddress)
            .setFunction(functionName, params)
            .setGas(1000000);

        if (value !== undefined && value > 0) {
            transaction.setPayableAmount(Hbar.fromTinybars(value));
        }

        // Freeze the transaction to get bytes for signing
        const frozenTx = await transaction.freezeWith(client);
        
        return {
            transaction: frozenTx,
            transactionBytes: await frozenTx.toBytes(),
        };
    } catch (error) {
        console.error(`Error preparing contract transaction:`, error);
        throw error;
    }
}

// ============ NODE VAULT FUNCTIONS ============

export const vaultService = {
    /**
     * Stake HBAR into the vault
     */
    async stake(amount: number, accountId: string): Promise<string> {
        const params = new ContractFunctionParameters();
        // No parameters needed - amount sent via msg.value
        
        // For Hedera, you'd send HBAR with the transaction
        // This is a placeholder - actual implementation needs wallet signing
        return executeContractFunction(
            CONTRACTS.NodeVault,
            "stake",
            params,
            accountId
        );
    },

    /**
     * Get staker information
     */
    async getStakerInfo(stakerAddress: string, accountId: string): Promise<any> {
        // This would be a view function call
        // Hedera view functions use ContractCallQuery
        throw new Error("View function calls not yet implemented");
    },

    /**
     * Claim yield
     */
    async claimYield(accountId: string): Promise<string> {
        const params = new ContractFunctionParameters();
        return executeContractFunction(
            CONTRACTS.NodeVault,
            "claimYield",
            params,
            accountId
        );
    },
};

// ============ LENDING PROTOCOL FUNCTIONS ============

export const lendingService = {
    /**
     * Request a loan
     */
    async requestLoan(
        amount: number,
        revenueShare: number,
        communityScore: number,
        accountId: string
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addUint256(amount)
            .addUint256(revenueShare)
            .addUint256(communityScore);
        
        return executeContractFunction(
            CONTRACTS.LendingProtocol,
            "requestLoan",
            params,
            accountId
        );
    },

    /**
     * Make a revenue-share payment
     */
    async makeRevenueSharePayment(
        loanId: number,
        dailyRevenue: number,
        accountId: string
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addUint256(loanId)
            .addUint256(dailyRevenue);
        
        return executeContractFunction(
            CONTRACTS.LendingProtocol,
            "makeRevenueSharePayment",
            params,
            accountId
        );
    },
};

// ============ GOVERNANCE FUNCTIONS ============

export const governanceService = {
    /**
     * Create a proposal
     */
    async createProposal(
        title: string,
        description: string,
        targetContract: string | null,
        callData: string | null,
        accountId: string
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addString(title)
            .addString(description)
            .addAddress(targetContract || "0x0000000000000000000000000000000000000000")
            .addBytes(callData ? Buffer.from(callData) : Buffer.alloc(0));
        
        return executeContractFunction(
            CONTRACTS.NodeGovernance,
            "createProposal",
            params,
            accountId
        );
    },

    /**
     * Vote on a proposal
     */
    async vote(
        proposalId: number,
        vote: 'For' | 'Against' | 'Abstain',
        accountId: string
    ): Promise<string> {
        const voteValue = vote === 'For' ? 1 : vote === 'Against' ? 2 : 3;
        
        const params = new ContractFunctionParameters()
            .addUint256(proposalId)
            .addUint8(voteValue);
        
        return executeContractFunction(
            CONTRACTS.NodeGovernance,
            "vote",
            params,
            accountId
        );
    },
};

// ============ ASSET TOKENIZATION FUNCTIONS ============

export const assetService = {
    /**
     * Create a new asset
     */
    async createAsset(
        name: string,
        description: string,
        assetType: string,
        totalSupply: number,
        totalValue: number,
        beneficiary: string,
        beneficiaryFee: number,
        accountId: string
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addString(name)
            .addString(description)
            .addString(assetType)
            .addUint256(totalSupply)
            .addUint256(totalValue)
            .addAddress(beneficiary)
            .addUint256(beneficiaryFee);
        
        return executeContractFunction(
            CONTRACTS.AssetTokenization,
            "createAsset",
            params,
            accountId
        );
    },

    /**
     * Purchase shares
     */
    async purchaseShares(
        assetId: number,
        shareAmount: number,
        accountId: string
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addUint256(assetId)
            .addUint256(shareAmount);
        
        return executeContractFunction(
            CONTRACTS.AssetTokenization,
            "purchaseShares",
            params,
            accountId
        );
    },
};

/**
 * Initialize contract addresses from deployment info
 */
export function initializeContracts(deploymentInfo: any) {
    if (deploymentInfo.contracts) {
        if (deploymentInfo.contracts.NodeVault) {
            CONTRACTS.NodeVault = deploymentInfo.contracts.NodeVault;
        }
        if (deploymentInfo.contracts.LendingProtocol) {
            CONTRACTS.LendingProtocol = deploymentInfo.contracts.LendingProtocol;
        }
        if (deploymentInfo.contracts.NodeGovernance) {
            CONTRACTS.NodeGovernance = deploymentInfo.contracts.NodeGovernance;
        }
        if (deploymentInfo.contracts.AssetTokenization) {
            CONTRACTS.AssetTokenization = deploymentInfo.contracts.AssetTokenization;
        }
    }
}

export { CONTRACTS };

