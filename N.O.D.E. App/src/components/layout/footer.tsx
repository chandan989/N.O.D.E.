import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Twitter, MessageSquare, Wifi, WifiOff } from 'lucide-react';
import { useWalletStore } from '@/stores/wallet-store';

export const Footer: React.FC = () => {
  const { isConnected, accountId } = useWalletStore();

  return (
    <footer className="window-panel mt-12 !p-4 flex flex-col items-center justify-between gap-6 text-xs sm:text-sm">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center">
        <p className="whitespace-nowrap">&copy; {new Date().getFullYear()} N.O.D.E. Protocol.</p>
        <div className="hidden sm:block h-4 w-px bg-primary/20"></div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/privacy" className="hover:text-secondary">[Privacy Policy]</Link>
          <Link to="/terms" className="hover:text-secondary">[Terms of Service]</Link>
          <Link to="/docs" className="hover:text-secondary">[Documentation]</Link>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 flex-wrap justify-center">
        {isConnected ? (
            <div className="flex items-center gap-2 text-glow">
                <Wifi className="w-4 h-4" />
                <span className="truncate max-w-[120px]">{accountId}</span>
            </div>
        ) : (
            <div className="flex items-center gap-2 text-red-500">
                <WifiOff className="w-4 h-4" />
                <span>[OFFLINE]</span>
            </div>
        )}
        <div className="hidden sm:block h-4 w-px bg-primary/20"></div>
        <p>NETWORK: <span className="text-glow">HEDERA_MAINNET</span></p>
        <div className="hidden sm:block h-4 w-px bg-primary/20"></div>
        <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-secondary">
            <GitBranch className="w-4 h-4" />
            <span>v1.1-GENESIS</span>
        </a>
        <div className="hidden sm:block h-4 w-px bg-primary/20"></div>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer" className="hover:text-secondary">
              <Twitter className="w-5 h-5" />
          </a>
          <a href="https://discord.gg/yourinvite" target="_blank" rel="noopener noreferrer" className="hover:text-secondary">
              <MessageSquare className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};
