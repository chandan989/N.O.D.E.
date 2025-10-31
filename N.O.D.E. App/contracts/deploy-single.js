/**
 * Deploy a single contract (for retrying failed deployments)
 */
import { 
    Client, 
    ContractCreateFlow, 
    PrivateKey, 
    AccountId, 
    AccountBalanceQuery,
    Hbar 
} from "@hashgraph/sdk";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NETWORK = process.env.HEDERA_NETWORK || 'testnet';
const OPERATOR_ID = process.env.OPERATOR_ID;
const OPERATOR_KEY = process.env.OPERATOR_PRIVATE_KEY;

function getClient() {
    const client = Client.forTestnet();
    client.setRequestTimeout(120000);
    
    const privateKey = PrivateKey.fromString(OPERATOR_KEY);
    const accountId = AccountId.fromString(OPERATOR_ID);
    client.setOperator(accountId, privateKey);
    
    return client;
}

async function deploySingle(contractName) {
    console.log(`🚀 Deploying ${contractName}...\n`);
    
    const client = getClient();
    
    // Read bytecode
    const contractPath = path.join(__dirname, `../artifacts/contracts/${contractName}.sol/${contractName}.json`);
    const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    let bytecode = contractJson.bytecode.replace(/^0x/, '');
    
    // Remove metadata
    const metadataPattern = /a2646970667358[\da-f]*$/i;
    bytecode = bytecode.replace(metadataPattern, '');
    
    const bytecodeSizeBytes = bytecode.length / 2;
    console.log(`   Bytecode size: ${bytecodeSizeBytes.toLocaleString()} bytes`);
    
    // Try different gas amounts
    const gasAmounts = [14000000, 14500000, 15000000, 15500000];
    
    for (const gas of gasAmounts) {
        console.log(`\n   Trying with ${gas.toLocaleString()} gas...`);
        try {
            const flow = new ContractCreateFlow()
                .setBytecode(bytecode)
                .setGas(gas);
            
            const contractId = await flow.execute(client);
            const contractIdStr = typeof contractId === 'string' ? contractId : contractId.toString();
            
            console.log(`\n✅ Success! Contract deployed with ${gas.toLocaleString()} gas`);
            console.log(`   Contract ID: ${contractIdStr}`);
            
            // Update deployment info
            const infoPath = path.join(__dirname, '../deployment-info.json');
            let deploymentInfo = {};
            if (fs.existsSync(infoPath)) {
                deploymentInfo = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
            }
            if (!deploymentInfo.contracts) deploymentInfo.contracts = {};
            deploymentInfo.contracts[contractName] = contractIdStr;
            fs.writeFileSync(infoPath, JSON.stringify(deploymentInfo, null, 2));
            
            client.close();
            return contractIdStr;
        } catch (error) {
            console.log(`   ❌ Failed: ${error.message.substring(0, 100)}`);
            if (!error.message.includes('BUSY') && !error.message.includes('INSUFFICIENT_GAS')) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
    
    client.close();
    throw new Error('All gas amounts failed');
}

const contractName = process.argv[2];
if (!contractName) {
    console.error('Usage: node deploy-single.js <ContractName>');
    process.exit(1);
}

deploySingle(contractName).catch(console.error);

