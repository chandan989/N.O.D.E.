/**
 * Contract Configuration
 * Loads deployed contract addresses from deployment-info.json
 */

// Direct contract addresses (from latest deployment)
// NodeVault: 0.0.5
// AssetTokenization: 0.0.4
// LendingProtocol and NodeGovernance: Not yet deployed (network gas issues)

let contractAddresses = {
    NodeVault: import.meta.env.VITE_NODE_VAULT_CONTRACT || '0.0.5',
    LendingProtocol: import.meta.env.VITE_LENDING_CONTRACT || '',
    NodeGovernance: import.meta.env.VITE_GOVERNANCE_CONTRACT || '',
    AssetTokenization: import.meta.env.VITE_ASSET_CONTRACT || '0.0.4',
};

export const CONTRACT_ADDRESSES = contractAddresses;

export const NETWORK = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';

// Load contracts from deployment-info.json asynchronously
import { loadContractAddresses } from './load-contracts';

// Update addresses when loaded
loadContractAddresses().then((contracts) => {
    contractAddresses.NodeVault = contracts.NodeVault || contractAddresses.NodeVault;
    contractAddresses.LendingProtocol = contracts.LendingProtocol || contractAddresses.LendingProtocol;
    contractAddresses.NodeGovernance = contracts.NodeGovernance || contractAddresses.NodeGovernance;
    contractAddresses.AssetTokenization = contracts.AssetTokenization || contractAddresses.AssetTokenization;
    console.log('📋 Contract Addresses Updated:', contractAddresses);
}).catch((err) => {
    console.warn('Could not load contract addresses:', err);
});

console.log('📋 Initial Contract Addresses:', contractAddresses);
