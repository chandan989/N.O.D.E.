/**
 * Contract Integration with WalletConnect
 * 
 * This module handles signing and executing smart contract transactions
 * through WalletConnect (HashPack, Blade, etc.)
 */

import {
    ContractExecuteTransaction,
    ContractFunctionParameters,
    Hbar,
    AccountId,
    Transaction,
} from "@hashgraph/sdk";
import { getClient, CONTRACTS } from './contracts';

/**
 * Sign and execute a contract transaction via WalletConnect
 * 
 * @param contractId Contract address
 * @param functionName Function to call
 * @param params Function parameters
 * @param accountId User's account ID
 * @param network Network (testnet/mainnet)
 * @param value Optional HBAR amount to send
 * @param signTransaction Function to sign transaction (from WalletConnect)
 */
export async function executeContractWithWallet(
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    accountId: string,
    network: 'testnet' | 'mainnet',
    value: number | undefined,
    signTransaction: (transaction: Transaction) => Promise<Uint8Array>
): Promise<string> {
    try {
        const client = getClient(network);
        const contractAddress = AccountId.fromString(contractId);

        // Build transaction
        const transaction = new ContractExecuteTransaction()
            .setContractId(contractAddress)
            .setFunction(functionName, params)
            .setGas(1000000);

        if (value !== undefined && value > 0) {
            transaction.setPayableAmount(Hbar.fromTinybars(value));
        }

        // Freeze transaction
        const frozenTx = await transaction.freezeWith(client);

        // Sign with wallet
        const signedTxBytes = await signTransaction(frozenTx);

        // Execute signed transaction
        const txResponse = await Transaction.fromBytes(signedTxBytes).execute(client);
        const receipt = await txResponse.getReceipt(client);

        if (receipt.status.toString() !== 'SUCCESS') {
            throw new Error(`Transaction failed: ${receipt.status}`);
        }

        return receipt.transactionId.toString();
    } catch (error) {
        console.error('Error executing contract transaction:', error);
        throw error;
    }
}

/**
 * Call a view/query function (doesn't require signing)
 */
export async function queryContractFunction(
    contractId: string,
    functionName: string,
    params: ContractFunctionParameters,
    network: 'testnet' | 'mainnet' = 'testnet'
): Promise<any> {
    try {
        const client = getClient(network);
        const contractAddress = AccountId.fromString(contractId);

        // Use ContractCallQuery for read-only functions
        const { ContractCallQuery } = await import("@hashgraph/sdk");
        
        const query = new ContractCallQuery()
            .setContractId(contractAddress)
            .setFunction(functionName, params)
            .setGas(100000);

        const response = await query.execute(client);
        
        return response.getResult();
    } catch (error) {
        console.error('Error querying contract:', error);
        throw error;
    }
}

/**
 * Vault Service with Wallet Integration
 */
export const vaultServiceWithWallet = {
    async stake(
        amount: number,
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters();
        return executeContractWithWallet(
            CONTRACTS.NodeVault,
            'stake',
            params,
            accountId,
            network,
            amount, // Send amount as value
            signTransaction
        );
    },

    async claimYield(
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters();
        return executeContractWithWallet(
            CONTRACTS.NodeVault,
            'claimYield',
            params,
            accountId,
            network,
            undefined,
            signTransaction
        );
    },

    async getStakerInfo(stakerAddress: string, network: 'testnet' | 'mainnet') {
        const params = new ContractFunctionParameters()
            .addAddress(stakerAddress);
        return queryContractFunction(
            CONTRACTS.NodeVault,
            'getStakerInfo',
            params,
            network
        );
    },
};

/**
 * Lending Service with Wallet Integration
 */
export const lendingServiceWithWallet = {
    async requestLoan(
        amount: number,
        revenueShare: number,
        communityScore: number,
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addUint256(amount)
            .addUint256(revenueShare)
            .addUint256(communityScore);
        
        return executeContractWithWallet(
            CONTRACTS.LendingProtocol,
            'requestLoan',
            params,
            accountId,
            network,
            undefined,
            signTransaction
        );
    },

    async makeRevenueSharePayment(
        loanId: number,
        dailyRevenue: number,
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addUint256(loanId)
            .addUint256(dailyRevenue);
        
        // Calculate payment amount (revenueShare * dailyRevenue / 100)
        // Note: This is simplified - the contract handles the calculation
        const estimatedPayment = (dailyRevenue * 5) / 100; // Assuming 5% revenue share
        
        return executeContractWithWallet(
            CONTRACTS.LendingProtocol,
            'makeRevenueSharePayment',
            params,
            accountId,
            network,
            estimatedPayment,
            signTransaction
        );
    },
};

/**
 * Governance Service with Wallet Integration
 */
export const governanceServiceWithWallet = {
    async createProposal(
        title: string,
        description: string,
        targetContract: string | null,
        callData: string | null,
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addString(title)
            .addString(description)
            .addAddress(targetContract || "0x0000000000000000000000000000000000000000")
            .addBytes(callData ? Buffer.from(callData) : Buffer.alloc(0));
        
        return executeContractWithWallet(
            CONTRACTS.NodeGovernance,
            'createProposal',
            params,
            accountId,
            network,
            undefined,
            signTransaction
        );
    },

    async vote(
        proposalId: number,
        vote: 'For' | 'Against' | 'Abstain',
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const voteValue = vote === 'For' ? 1 : vote === 'Against' ? 2 : 3;
        
        const params = new ContractFunctionParameters()
            .addUint256(proposalId)
            .addUint8(voteValue);
        
        return executeContractWithWallet(
            CONTRACTS.NodeGovernance,
            'vote',
            params,
            accountId,
            network,
            undefined,
            signTransaction
        );
    },
};

/**
 * Asset Service with Wallet Integration
 */
export const assetServiceWithWallet = {
    async createAsset(
        name: string,
        description: string,
        assetType: string,
        totalSupply: number,
        totalValue: number,
        beneficiary: string,
        beneficiaryFee: number,
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addString(name)
            .addString(description)
            .addString(assetType)
            .addUint256(totalSupply)
            .addUint256(totalValue)
            .addAddress(beneficiary)
            .addUint256(beneficiaryFee);
        
        return executeContractWithWallet(
            CONTRACTS.AssetTokenization,
            'createAsset',
            params,
            accountId,
            network,
            undefined,
            signTransaction
        );
    },

    async purchaseShares(
        assetId: number,
        shareAmount: number,
        pricePerShare: number,
        accountId: string,
        network: 'testnet' | 'mainnet',
        signTransaction: (tx: Transaction) => Promise<Uint8Array>
    ): Promise<string> {
        const params = new ContractFunctionParameters()
            .addUint256(assetId)
            .addUint256(shareAmount);
        
        const totalCost = shareAmount * pricePerShare;
        
        return executeContractWithWallet(
            CONTRACTS.AssetTokenization,
            'purchaseShares',
            params,
            accountId,
            network,
            totalCost,
            signTransaction
        );
    },
};

