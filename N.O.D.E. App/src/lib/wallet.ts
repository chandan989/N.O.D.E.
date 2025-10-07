import { WalletConnectModal } from "@walletconnect/modal";
import { SessionTypes } from "@walletconnect/types";

export interface WalletState {
  isConnected: boolean;
  accountId: string;
  balance: string;
  isLoading: boolean;
}

export const initialWalletState: WalletState = {
  isConnected: false,
  accountId: "",
  balance: "",
  isLoading: false,
};

const projectId = "YOUR_PROJECT_ID"; // Replace with your actual project ID

const modal = new WalletConnectModal({
  projectId,
  chains: ["hedera:testnet"],
});

export const connectWallet = async (): Promise<{ accountId: string }> => {
  const session = await modal.connect({
    requiredNamespaces: {
      hedera: {
        methods: ["hedera_signAndExecuteTransaction", "hedera_signMessage"],
        chains: ["hedera:testnet"],
        events: [],
      },
    },
  });

  const accountId = session.namespaces.hedera.accounts[0].split(":")[2];

  // Note: WalletConnect does not directly provide account balance.
  // You would need to query a mirror node or use another service to get the balance.

  return { accountId };
};

export const disconnectWallet = async () => {
  await modal.disconnect();
};
