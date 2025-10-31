import { create } from 'zustand';
import { 
  WalletState, 
  initialWalletState, 
  connectWallet, 
  connectWalletConnect, 
  disconnectWallet, 
  getAccountBalance,
  isWalletConnectAvailable 
} from '@/lib/wallet';

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  connectWalletConnect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  isWalletConnectAvailable: () => boolean;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  ...initialWalletState,

  connect: async () => {
    set({ isLoading: true });
    try {
      const { accountId, walletType } = await connectWallet();
      
      // Get balance
      const balance = await getAccountBalance(accountId);
      
      set({
        isConnected: true,
        accountId,
        balance,
        walletType,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  connectWalletConnect: async () => {
    set({ isLoading: true });
    try {
      const { accountId } = await connectWalletConnect();
      const balance = await getAccountBalance(accountId);
      
      set({
        isConnected: true,
        accountId,
        balance,
        walletType: 'walletconnect',
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to connect WalletConnect:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  disconnect: async () => {
    set({ isLoading: true });
    try {
      await disconnectWallet();
      set({
        ...initialWalletState,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      set({ isLoading: false });
    }
  },

  refreshBalance: async () => {
    const { accountId, isConnected } = get();
    if (!isConnected || !accountId) return;
    
    try {
      const balance = await getAccountBalance(accountId);
      set({ balance });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  isWalletConnectAvailable: () => isWalletConnectAvailable(),
}));

// Expose store to window for demo script (development only)
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).__WALLET_STORE__ = useWalletStore;
}