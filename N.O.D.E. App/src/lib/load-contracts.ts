/**
 * Load contract addresses asynchronously from deployment-info.json
 */

export interface ContractAddresses {
    NodeVault: string;
    LendingProtocol: string;
    NodeGovernance: string;
    AssetTokenization: string;
}

// Extract contract ID from Hedera response object
function extractContractId(contractData: string | any): string {
    if (!contractData) return '';
    
    if (typeof contractData === 'string') {
        try {
            const parsed = JSON.parse(contractData);
            if (parsed.nodeId) return parsed.nodeId;
            return parsed;
        } catch {
            return contractData;
        }
    }
    if (contractData && typeof contractData === 'object') {
        if (contractData.nodeId) return contractData.nodeId;
        if (contractData.toString) return contractData.toString();
    }
    return String(contractData || '');
}

let cachedContracts: ContractAddresses | null = null;

export async function loadContractAddresses(): Promise<ContractAddresses> {
    if (cachedContracts) return cachedContracts;
    
    try {
        const response = await fetch('/deployment-info.json');
        if (response.ok) {
            const deploymentInfo = await response.json();
            cachedContracts = {
                NodeVault: extractContractId(deploymentInfo.contracts?.NodeVault || ''),
                LendingProtocol: extractContractId(deploymentInfo.contracts?.LendingProtocol || ''),
                NodeGovernance: extractContractId(deploymentInfo.contracts?.NodeGovernance || ''),
                AssetTokenization: extractContractId(deploymentInfo.contracts?.AssetTokenization || ''),
            };
            console.log('📋 Loaded Contract Addresses:', cachedContracts);
            return cachedContracts;
        }
    } catch (error) {
        console.warn('Could not load deployment-info.json:', error);
    }
    
    // Fallback to environment variables
    cachedContracts = {
        NodeVault: import.meta.env.VITE_NODE_VAULT_CONTRACT || '',
        LendingProtocol: import.meta.env.VITE_LENDING_CONTRACT || '',
        NodeGovernance: import.meta.env.VITE_GOVERNANCE_CONTRACT || '',
        AssetTokenization: import.meta.env.VITE_ASSET_CONTRACT || '',
    };
    
    return cachedContracts;
}

