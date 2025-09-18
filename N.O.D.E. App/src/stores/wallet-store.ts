import { create } from 'zustand';
import { WalletState, initialWalletState, connectWallet, disconnectWallet } from '@/lib/wallet';

interface WalletStore extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  ...initialWalletState,

  connect: async () => {
    set({ isLoading: true });
    try {
      const { accountId, balance } = await connectWallet();
      set({
        isConnected: true,
        accountId,
        balance,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      set({ isLoading: false });
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

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));