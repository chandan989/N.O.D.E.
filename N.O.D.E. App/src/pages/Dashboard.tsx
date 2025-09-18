import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useWalletStore } from '@/stores/wallet-store';

const Dashboard: React.FC = () => {
  const { isConnected, accountId } = useWalletStore();

  return (
    <div className="space-y-6">
      <WindowPanel title="System Status">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="font-terminal text-accent">CONNECTION STATUS</div>
            <div className="font-code text-sm">
              STATUS: <span className={isConnected ? "text-primary" : "text-destructive"}>
                {isConnected ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            {isConnected && (
              <div className="font-code text-sm">
                NODE: <span className="text-primary">{accountId}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="font-terminal text-accent">NETWORK STATUS</div>
            <div className="font-code text-sm">
              NETWORK: <span className="text-primary">HEDERA MAINNET</span>
            </div>
            <div className="font-code text-sm">
              LATENCY: <span className="text-primary">~3.2s</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="font-terminal text-accent">PROTOCOL VERSION</div>
            <div className="font-code text-sm">
              BUILD: <span className="text-primary">N.O.D.E.v1.0-GENESIS</span>
            </div>
            <div className="font-code text-sm">
              PHASE: <span className="text-accent">GENESIS Q4 2025</span>
            </div>
          </div>
        </div>
      </WindowPanel>

      <WindowPanel title="Available Modules">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="border border-border rounded p-4 hover:border-primary transition-colors group">
              <div className="flex items-center justify-between mb-2">
                <div className="font-terminal text-primary group-hover:glow-text">
                  PAYMENTS.DLL
                </div>
                <div className="text-xs font-code text-accent">ACTIVE</div>
              </div>
              <div className="text-sm font-code text-muted-foreground mb-3">
                Ghost payment system for anonymous HBAR transfers within the neighborhood network.
              </div>
              <Link to="/dashboard/payments">
                <Button className="terminal-button w-full">
                  INITIALIZE MODULE
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-border rounded p-4 opacity-50">
              <div className="flex items-center justify-between mb-2">
                <div className="font-terminal text-muted-foreground">
                  VAULT.BAT
                </div>
                <div className="text-xs font-code text-muted-foreground">PHASE 2</div>
              </div>
              <div className="text-sm font-code text-muted-foreground mb-3">
                Autonomous vault system for yield generation and collective staking.
              </div>
              <Button disabled className="w-full font-code">
                COMING SOON
              </Button>
            </div>
          </div>
        </div>
      </WindowPanel>

      {!isConnected && (
        <WindowPanel title="Security Alert">
          <div className="bg-destructive/10 border border-destructive rounded p-4">
            <div className="font-terminal text-destructive mb-2">
              &gt; WALLET NOT CONNECTED
            </div>
            <div className="font-code text-sm text-foreground">
              Connect your HashPack wallet to access N.O.D.E. Protocol features.
              All transactions are secured by Hedera Hashgraph consensus.
            </div>
          </div>
        </WindowPanel>
      )}
    </div>
  );
};

export default Dashboard;