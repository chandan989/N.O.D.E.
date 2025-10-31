import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useWalletStore } from '@/stores/wallet-store';
import { useToast } from '@/hooks/use-toast';
import { Wallet, Globe, Loader2 } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ isOpen, onClose }) => {
  const { connect, isLoading } = useWalletStore();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected your wallet via WalletConnect.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="pixel-card max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-glow">
            CONNECT_WALLET
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 p-4">
          <p className="text-center text-gray-600 font-terminal">
            Connect your wallet to access N.O.D.E. Protocol
          </p>
          
          {/* WalletConnect Option */}
          <button
            onClick={handleWalletConnect}
            disabled={isLoading || isConnecting}
            className="w-full wallet-option flex items-center gap-4 p-6"
          >
            {isConnecting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Globe className="w-6 h-6" />
            )}
            <div className="text-left flex-1">
              <div className="font-bold text-xl">WalletConnect</div>
              <div className="text-sm opacity-75 font-terminal">
                Connect HashPack, MetaMask, or any compatible wallet
              </div>
            </div>
          </button>

          {/* Info Section */}
          <div className="mt-6 p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded">
            <div className="flex items-start gap-2">
              <Wallet className="w-4 h-4 mt-1 text-gray-500" />
              <div className="text-xs text-gray-600">
                <p className="font-semibold mb-1">Supported Wallets:</p>
                <p>
                  HashPack (recommended for Hedera), MetaMask, Trust Wallet, 
                  and 300+ other WalletConnect compatible wallets.
                </p>
              </div>
            </div>
          </div>

          {/* HashPack Download Link */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Don't have a Hedera wallet?</p>
            <a 
              href="https://www.hashpack.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm font-terminal"
            >
              Download HashPack →
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};