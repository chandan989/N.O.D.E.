import { WalletConnectModal } from "@walletconnect/modal";
import { SignClient } from "@walletconnect/sign-client";

export interface WalletState {
  isConnected: boolean;
  accountId: string;
  balance: string;
  isLoading: boolean;
  walletType?: 'walletconnect' | 'hashpack';
}

export const initialWalletState: WalletState = {
  isConnected: false,
  accountId: "",
  balance: "",
  isLoading: false,
};

let walletConnectModal: WalletConnectModal | null = null;
let signClient: SignClient | null = null;

// Initialize WalletConnect Modal (UI only)
const initWalletConnectModal = () => {
  if (walletConnectModal) return walletConnectModal;
  
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "6ef1bda914f4ea32a5b3f820bc8940c1";
  
  try {
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
  } catch (error) {
    console.error("Failed to initialize WalletConnect Modal:", error);
    throw new Error("WalletConnect initialization failed");
  }
  
  return walletConnectModal;
};

// Initialize SignClient (handles actual connections)
const initSignClient = async () => {
  if (signClient) return signClient;
  
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "6ef1bda914f4ea32a5b3f820bc8940c1";
  
  try {
    signClient = await SignClient.init({
      projectId,
      metadata: {
        name: "N.O.D.E. Protocol",
        description: "Network of Decentralized Economy",
        url: window.location.origin,
        icons: [`${window.location.origin}/logo.png`],
      },
    });
  } catch (error) {
    console.error("Failed to initialize SignClient:", error);
    throw new Error("SignClient initialization failed");
  }
  
  return signClient;
};

// Connect via WalletConnect (supports HashPack and other Hedera wallets)
export const connectWalletConnect = async (): Promise<{ accountId: string }> => {
  try {
    // Initialize SignClient first (handles connections)
    const client = await initSignClient();
    
    // Check for existing active sessions first
    const existingSessions = client.session.getAll();
    if (existingSessions.length > 0) {
      console.log("Found existing session, using it...");
      const session = existingSessions[0];
      const accounts = session.namespaces?.hedera?.accounts || [];
      if (accounts.length > 0) {
        const accountString = accounts[0];
        const parts = accountString.split(":");
        const accountId = parts.length >= 3 ? parts[2] : accountString;
        if (accountId && accountId.startsWith("0.0.")) {
          console.log("✅ Reusing existing session:", accountId);
          return { accountId };
        }
      }
    }
    
    // Set up event listeners BEFORE creating pairing
    return new Promise((resolve, reject) => {
      let timeout: NodeJS.Timeout | null = null;
      let proposalHandler: ((proposal: any) => Promise<void>) | null = null;
      let rejectHandler: (() => void) | null = null;
      let modal: WalletConnectModal | null = null;
      
      const cleanup = () => {
        if (timeout) clearTimeout(timeout);
        if (proposalHandler) {
          client.off("session_proposal", proposalHandler);
        }
        if (rejectHandler) {
          client.off("session_reject", rejectHandler);
        }
        if (modal) {
          modal.closeModal();
        }
      };
      
      // Listen for session proposal - set up BEFORE creating pairing
      proposalHandler = async (proposal: any) => {
        try {
          console.log("📱 Session proposal received:", proposal.id);
          
          if (timeout) clearTimeout(timeout);
          
          // Approve the session with Hedera namespace
          const approvedSession = await client.approve({
            id: proposal.id,
            namespaces: {
        hedera: {
                accounts: proposal.params.requiredNamespaces.hedera?.chains?.map((chain: string) => `${chain}:*`) || ["hedera:testnet:*"],
                methods: proposal.params.requiredNamespaces.hedera?.methods || ["hedera_signAndExecuteTransaction", "hedera_signMessage"],
                events: proposal.params.requiredNamespaces.hedera?.events || [],
        },
      },
    });

          cleanup();
          
          // Get accounts from approved session
          const accounts = approvedSession.namespaces?.hedera?.accounts || [];
          if (accounts.length === 0) {
            reject(new Error("No Hedera account found in session"));
            return;
          }

          // Extract account ID from format: hedera:testnet:0.0.XXXXX
          const accountString = accounts[0];
          const parts = accountString.split(":");
          const accountId = parts.length >= 3 ? parts[2] : accountString;
          
          if (!accountId || !accountId.startsWith("0.0.")) {
            reject(new Error(`Invalid account ID format: ${accountId}`));
            return;
          }

          console.log("✅ Connected to wallet:", accountId);
          resolve({ accountId });
        } catch (error) {
          cleanup();
          console.error("Error approving session:", error);
          reject(error instanceof Error ? error : new Error("Failed to approve session"));
        }
      };
      
      // Handle rejection
      rejectHandler = () => {
        console.log("❌ Session rejected by wallet");
        cleanup();
        reject(new Error("Connection rejected by wallet."));
      };
      
      // Register event handlers
      client.on("session_proposal", proposalHandler);
      client.on("session_reject", rejectHandler);
      
      // Now create pairing and open modal
      (async () => {
        try {
          const { uri } = await client.core.pairing.create();
          
          if (!uri) {
            cleanup();
            reject(new Error("Failed to create pairing URI"));
            return;
          }
          
          console.log("🔗 Pairing URI created, opening modal...");
          
          // Initialize and open modal with the URI
          modal = initWalletConnectModal();
          await modal.openModal({ uri });
          
          // Set timeout for pairing (2 minutes)
          timeout = setTimeout(() => {
            console.log("⏰ Pairing timeout");
            cleanup();
            reject(new Error("Connection timeout. Please scan the QR code within 2 minutes and approve the connection in your wallet."));
          }, 120000); // 2 minutes
          
        } catch (error) {
          cleanup();
          console.error("Error creating pairing:", error);
          reject(error instanceof Error ? error : new Error("Failed to create pairing"));
        }
      })();
    });
  } catch (error) {
    console.error("WalletConnect connection error:", error);
    if (error instanceof Error) {
      if (error.message.includes("rejected") || error.message.includes("cancelled")) {
        throw new Error("Connection cancelled. Please try again.");
      }
      if (error.message.includes("timeout")) {
        throw error; // Pass through timeout errors
      }
    throw error;
    }
    throw new Error("Failed to connect wallet. Please ensure HashPack is installed and try again.");
  }
};

// Generic connect function using WalletConnect
export const connectWallet = async (): Promise<{ accountId: string; walletType: 'walletconnect' }> => {
  try {
    const result = await connectWalletConnect();
    return { ...result, walletType: 'walletconnect' };
  } catch (error) {
    console.error("Wallet connection failed:", error);
    throw new Error("Failed to connect wallet. Please try again or check if your wallet supports WalletConnect.");
  }
};

// Disconnect wallet
export const disconnectWallet = async () => {
  try {
    if (signClient && signClient.session) {
      const sessions = signClient.session.getAll();
      for (const session of sessions) {
        await signClient.disconnect({
          topic: session.topic,
          reason: { code: 6000, message: "User disconnected" }
        });
      }
    }
    if (walletConnectModal) {
      walletConnectModal.closeModal();
    }
  } catch (error) {
    console.error("Disconnect error:", error);
  }
};

// Get account balance from Hedera Mirror Node
export const getAccountBalance = async (accountId: string): Promise<string> => {
  try {
    // Query Hedera Mirror Node API
    const network = import.meta.env.VITE_HEDERA_NETWORK || 'testnet';
    const mirrorUrl = network === 'mainnet' 
      ? 'https://mainnet-public.mirrornode.hedera.com'
      : 'https://testnet.mirrornode.hedera.com';
    
    const response = await fetch(`${mirrorUrl}/api/v1/accounts/${accountId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch balance: ${response.statusText}`);
    }
    
    const data = await response.json();
    // Balance is in tinybars, convert to HBAR (1 HBAR = 100,000,000 tinybars)
    const balanceInTinybars = data.balance?.balance || 0;
    const balanceInHbar = (balanceInTinybars / 100000000).toFixed(2);
    
    return balanceInHbar;
  } catch (error) {
    console.error("Error fetching balance:", error);
    // Fallback to 0 if API call fails
    return "0.00";
  }
};

// Check if we can connect to wallets via WalletConnect
export const isWalletConnectAvailable = (): boolean => {
  return typeof window !== 'undefined';
};
