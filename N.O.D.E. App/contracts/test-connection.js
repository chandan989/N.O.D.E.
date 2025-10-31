/**
 * Test Hedera Connection
 * Quick test to verify network connectivity
 */
import { Client, AccountBalanceQuery, PrivateKey, AccountId } from "@hashgraph/sdk";
import dotenv from 'dotenv';

dotenv.config();

const OPERATOR_ID = process.env.OPERATOR_ID;
const OPERATOR_KEY = process.env.OPERATOR_PRIVATE_KEY;

async function testConnection() {
    console.log('Testing Hedera connection...\n');
    
    try {
        const client = Client.forTestnet();
        const privateKey = PrivateKey.fromString(OPERATOR_KEY);
        const accountId = AccountId.fromString(OPERATOR_ID);
        client.setOperator(accountId, privateKey);
        
        console.log('✓ Client created');
        
        // Test balance query (this works)
        const balanceQuery = new AccountBalanceQuery().setAccountId(OPERATOR_ID);
        const balance = await balanceQuery.execute(client);
        console.log(`✓ Balance query works: ${balance.hbars.toString()} HBAR\n`);
        
        console.log('✅ Connection test PASSED - Network is reachable');
        console.log('⚠️  Issue: Contract transactions fail (likely gRPC firewall)');
        console.log('\n💡 Solutions:');
        console.log('   1. Check Windows Firewall for port 50211');
        console.log('   2. Try from different network (mobile hotspot)');
        console.log('   3. Check VPN/proxy settings');
        console.log('   4. Try deploying from Linux/WSL');
        
        client.close();
    } catch (error) {
        console.error('❌ Connection test FAILED:', error.message);
    }
}

testConnection();

