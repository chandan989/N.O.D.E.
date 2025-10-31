/**
 * Simplified WalletConnect implementation for HashPack
 * Uses SignClient instead of Web3Wallet for better compatibility
 */

import { WalletConnectModal } from "@walletconnect/modal";
import { SignClient } from "@walletconnect/sign-client";

export interface WalletState {
  isConnected: boolean;
  accountId: string;
  balance: string;
  isLoading: boolean;
  walletType?: 'walletconnect' | 'hashpack';
}

let walletConnectModal: WalletConnectModal | null = null;
let signClient: SignClient | null = null;

// Initialize WalletConnect Modal
const initWalletConnectModal = () => {
  if (walletConnectModal) return walletConnectModal;
  
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "6ef1bda914f4ea32a5b3f820bc8940c1";
  
  walletConnectModal = new WalletConnectModal({
    projectId,
    chains: ["hedera:testnet"],
    metadata: {
      name: "N.O.D.E. Protocol",
      description: "Network of Decentralized Economy",
      url: window.location.origin,
      icons: [`${window.location.origin}/logo.png`],
    },
    features: {
      email: false,
      socials: false,
    },
  });
  
  return walletConnectModal;
};

// Initialize SignClient
const initSignClient = async () => {
  if (signClient) return signClient;
  
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "6ef1bda914f4ea32a5b3f820bc8940c1";
  
  signClient = await SignClient.init({
    projectId,
    metadata: {
      name: "N.O.D.E. Protocol",
      description: "Network of Decentralized Economy",
      url: window.location.origin,
      icons: [`${window.location.origin}/logo.png`],
    },
  });
  
  return signClient;
};

// Connect via WalletConnect
export const connectWalletConnect = async (): Promise<{ accountId: string }> => {
  try {
    const modal = initWalletConnectModal();
    const client = await initSignClient();
    
    // Create pairing URI
    const { uri } = await client.core.pairing.create();
    
    if (!uri) {
      throw new Error("Failed to create pairing URI");
    }
    
    // Open modal with URI
    await modal.openModal({ uri });
    
    // Wait for session proposal
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        modal.closeModal();
        reject(new Error("Connection timeout. Please try again."));
      }, 300000);
      
      client.on("session_proposal", async (proposal) => {
        try {
          clearTimeout(timeout);
          
          // Approve session
          const session = await client.approve({
            id: proposal.id,
            namespaces: {
              hedera: {
                accounts: proposal.params.requiredNamespaces.hedera?.chains?.map(c => `${c}:*`) || ["hedera:testnet:*"],
                methods: proposal.params.requiredNamespaces.hedera?.methods || [],
                events: proposal.params.requiredNamespaces.hedera?.events || [],
              },
            },
          });
          
          modal.closeModal();
          
          const accounts = session.namespaces?.hedera?.accounts || [];
          if (accounts.length === 0) {
            reject(new Error("No Hedera account found"));
            return;
          }

          const accountId = accounts[0].split(":").pop() || "";
          if (!accountId.startsWith("0.0.")) {
            reject(new Error(`Invalid account ID: ${accountId}`));
            return;
          }

          resolve({ accountId });
        } catch (error) {
          modal.closeModal();
          reject(error);
        }
      });
      
      client.on("session_reject", () => {
        clearTimeout(timeout);
        modal.closeModal();
        reject(new Error("Connection rejected"));
      });
    });
  } catch (error) {
    console.error("WalletConnect error:", error);
    throw error;
  }
};

