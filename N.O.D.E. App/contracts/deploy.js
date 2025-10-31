/**
 * N.O.D.E. Smart Contract Deployment Script
 * 
 * This script deploys all N.O.D.E. contracts to Hedera network.
 * 
 * Prerequisites:
 * - Hedera account with sufficient HBAR for deployment
 * - Private key in .env file
 * - @hashgraph/sdk installed
 * 
 * Usage:
 * node contracts/deploy.js
 */

import { 
   Client, 
   ContractCreateTransaction, 
   ContractFunctionParameters, 
   PrivateKey, 
   AccountId, 
   AccountBalanceQuery,
   Hbar,
   FileCreateTransaction,
   FileAppendTransaction,
   ContractCreateFlow
} from "@hashgraph/sdk";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hedera network configuration
const NETWORK = process.env.HEDERA_NETWORK || 'testnet';
const OPERATOR_ID = process.env.OPERATOR_ID;
const OPERATOR_KEY = process.env.OPERATOR_PRIVATE_KEY;

if (!OPERATOR_ID || !OPERATOR_KEY) {
    throw new Error('OPERATOR_ID and OPERATOR_PRIVATE_KEY must be set in .env file');
}

// Initialize Hedera client
function getClient() {
    let client;
    
    if (NETWORK === 'mainnet') {
        client = Client.forMainnet();
    } else {
        // Use testnet
        client = Client.forTestnet();
        
        // Configure timeouts and node settings
        client.setRequestTimeout(120000); // 2 minutes
        client.setNodeMinReadmitPeriod(60);
        client.setNodeMaxReadmitPeriod(300);
    }
    
    // Hedera supports both ED25519 and ECDSA
    // ED25519 is recommended (native Hedera format)
    let privateKey;
    
    try {
        // Try parsing as string (DER format) - ED25519
        privateKey = PrivateKey.fromString(OPERATOR_KEY);
    } catch (error) {
        // If string fails, try as ECDSA
        try {
            privateKey = PrivateKey.fromStringECDSA(OPERATOR_KEY);
        } catch (e) {
            throw new Error(`Failed to parse private key: ${e.message}`);
        }
    }
    
    try {
        const accountId = AccountId.fromString(OPERATOR_ID);
        client.setOperator(accountId, privateKey);
    } catch (error) {
        throw new Error(`Failed to set operator: ${error.message}`);
    }
    
    return client;
}

/**
 * Deploy a contract from Solidity bytecode
 */
async function deployContract(client, contractName, constructorParams = null) {
    console.log(`\n📄 Deploying ${contractName}...`);
    
    try {
        // Read compiled bytecode from Hardhat artifacts
        const contractPath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
        
        if (!fs.existsSync(contractPath)) {
            console.warn(`⚠️  Contract bytecode not found at ${contractPath}`);
            console.warn(`   Please compile contracts first using: npm run compile`);
            return null;
        }
        
        const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
        
        // Use full bytecode (includes constructor code) for deployment
        let bytecode = contractJson.bytecode;
        
        if (!bytecode || bytecode === '0x') {
            throw new Error(`Empty bytecode for ${contractName}`);
        }
        
        // Remove 0x prefix
        let cleanBytecode = bytecode.startsWith('0x') ? bytecode.slice(2) : bytecode;
        
        // Remove Solidity metadata if present (the IPFS hash at the end)
        // Metadata typically starts with 'a2646970667358' (which is 'ipfs' in hex)
        const metadataPattern = /a2646970667358[\da-f]*$/i;
        cleanBytecode = cleanBytecode.replace(metadataPattern, '');
        
        const bytecodeSizeBytes = cleanBytecode.length / 2;
        console.log(`   Bytecode size: ${bytecodeSizeBytes.toLocaleString()} bytes`);
        
        // Try using ContractCreateFlow (simpler, handles file upload automatically)
        console.log('   Submitting transaction...');
        let contractId;
        const maxRetries = 5; // More retries for difficult contracts
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                // Gas estimation - contract-specific amounts
                // NodeVault (6.5KB): 11M
                // AssetTokenization (8KB): 12M  
                // LendingProtocol (6.8KB) & NodeGovernance (7.2KB): need 13M
                let estimatedGas;
                if (contractName === 'NodeVault') {
                    estimatedGas = 11000000;
                } else if (contractName === 'AssetTokenization') {
                    estimatedGas = 12000000;
                } else {
                    // LendingProtocol and NodeGovernance - try 15.2M (between 15M insufficient and 15.5M busy)
                    estimatedGas = 15200000;
                }
                console.log(`   Estimated gas: ${estimatedGas.toLocaleString()}`);
                
                const contractCreateFlow = new ContractCreateFlow()
                    .setBytecode(cleanBytecode)
                    .setGas(estimatedGas);
                
                // Only set constructor parameters if provided
                if (constructorParams && constructorParams instanceof ContractFunctionParameters) {
                    contractCreateFlow.setConstructorParameters(constructorParams);
                }
                
                contractId = await contractCreateFlow.execute(client);
                console.log(`   ✓ Transaction submitted`);
                break; // Success
            } catch (error) {
                retryCount++;
                const isRetryable = error.message.includes('UNKNOWN') || 
                                  error.message.includes('timeout') ||
                                  error.message.includes('Network') ||
                                  error.message.includes('BUSY') ||
                                  error.message.includes('EXPIRED') ||
                                  error.message.includes('INSUFFICIENT_GAS') ||
                                  error.code === 2 ||
                                  error.code === 14; // UNAVAILABLE
                
                if (isRetryable && retryCount < maxRetries) {
                    // Much longer wait for BUSY/EXPIRED errors to let nodes recover
                    let waitTime;
                    if (error.message.includes('BUSY') || error.message.includes('EXPIRED')) {
                        waitTime = 60000 * retryCount; // 60s, 120s, 180s, 240s, 300s
                        console.log(`   💤 Waiting ${waitTime/1000}s for network to recover...`);
                    } else {
                        waitTime = 3000 * retryCount; // 3s, 6s, 9s, 12s, 15s
                    }
                    console.log(`   ⚠️  Retrying in ${waitTime/1000}s (${retryCount}/${maxRetries})...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    continue;
                }
                throw error;
            }
        }
        
        if (!contractId) {
            throw new Error('Failed to get contract ID');
        }
        
        console.log(`✅ ${contractName} deployed successfully!`);
        console.log(`   Contract ID: ${contractId.toString()}`);
        
        return contractId.toString();
        
    } catch (error) {
        console.error(`❌ Error deploying ${contractName}:`, error.message);
        if (error.status) {
            console.error(`   Status: ${error.status.toString()}`);
        }
        throw error;
    }
}

/**
 * Deploy all N.O.D.E. contracts
 */
async function deployAll() {
    console.log('🚀 Starting N.O.D.E. Contract Deployment');
    console.log(`Network: ${NETWORK}`);
    console.log(`Operator: ${OPERATOR_ID}\n`);
    
    const client = getClient();
    
    // Check account balance first
    try {
        console.log('📊 Checking account balance...');
        const balanceQuery = new AccountBalanceQuery()
            .setAccountId(OPERATOR_ID);
        const balance = await balanceQuery.execute(client);
        console.log(`   Balance: ${balance.hbars.toString()} HBAR`);
        
        if (balance.hbars.toTinybars() < 1000000000) { // Less than 10 HBAR
            console.warn('   ⚠️  Low balance! Deployment may fail. Need at least 10 HBAR.');
        }
    } catch (error) {
        console.warn(`   ⚠️  Could not check balance: ${error.message}`);
    }
    
    const deploymentInfo = {
        network: NETWORK,
        operator: OPERATOR_ID,
        timestamp: new Date().toISOString(),
        contracts: {}
    };
    
    try {
        // 1. Deploy NodeVault (no constructor params)
        const vaultId = await deployContract(client, 'NodeVault');
        if (vaultId) deploymentInfo.contracts.NodeVault = vaultId;
        
        // 2. Deploy LendingProtocol (requires vault address)
        // Note: For now, deploy without constructor - vault can be set later via admin function
        if (vaultId) {
            try {
                // Wait a bit to avoid network congestion
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                console.log('\n⚠️  Note: Deploying LendingProtocol without vault link');
                console.log('   You can set the vault address later using setNodeVault() admin function');
                const lendingId = await deployContract(client, 'LendingProtocol');
                if (lendingId) deploymentInfo.contracts.LendingProtocol = lendingId;
            } catch (error) {
                console.warn(`   ⚠️  Could not deploy LendingProtocol: ${error.message}`);
            }
        }
        
        // 3. Deploy NodeGovernance (requires vault address)
        if (vaultId) {
            try {
                // Wait a bit longer before deploying the largest contract
                await new Promise(resolve => setTimeout(resolve, 10000));
                
                console.log('\n⚠️  Note: Deploying NodeGovernance without vault link');
                console.log('   You can set the vault address later using setNodeVault() admin function');
                const governanceId = await deployContract(client, 'NodeGovernance');
                if (governanceId) deploymentInfo.contracts.NodeGovernance = governanceId;
            } catch (error) {
                console.warn(`   ⚠️  Could not deploy NodeGovernance: ${error.message}`);
            }
        }
        
        // 4. Deploy AssetTokenization (no constructor params)
        const assetId = await deployContract(client, 'AssetTokenization');
        if (assetId) deploymentInfo.contracts.AssetTokenization = assetId;
        
        // Save deployment info
        const infoPath = path.join(__dirname, '../deployment-info.json');
        fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
        
        console.log('\n✅ Deployment Complete!');
        console.log(`📝 Deployment info saved to: ${infoPath}`);
        
    } catch (error) {
        console.error('\n❌ Deployment failed:', error);
        throw error;
    } finally {
        client.close();
    }
}

// Run deployment
deployAll().catch(console.error);
