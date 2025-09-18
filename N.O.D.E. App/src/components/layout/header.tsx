import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/stores/user-store';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isConnected: boolean;
  accountId?: string;
  balance?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  accountId,
  balance,
  onConnect,
  onDisconnect
}) => {
  const { userType } = useUserStore();

  return (
    <header className="terminal-window mb-6">
      <div className="terminal-header">
        <div className="flex items-center gap-4">
          <div className="terminal-title">
            N.O.D.E.
          </div>
          <div className="font-code text-accent text-sm">
            [NEIGHBORHOOD OPERATED DECENTRALIZED ECONOMY]
          </div>
          {userType && (
            <div className={cn(
              "font-code text-xs px-2 py-1 rounded border",
              userType === 'business' 
                ? "text-accent border-accent" 
                : "text-primary border-primary"
            )}>
              {userType.toUpperCase()} MODE
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isConnected ? (
            <div className="flex items-center gap-3">
              <div className="font-code text-xs">
                <div className="text-muted-foreground">ACCOUNT:</div>
                <div className="glow-text">{accountId}</div>
              </div>
              <div className="font-code text-xs">
                <div className="text-muted-foreground">BALANCE:</div>
                <div className="text-accent">{balance} HBAR</div>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={onDisconnect}
                className="font-code text-xs"
              >
                DISCONNECT
              </Button>
            </div>
          ) : (
            <Button 
              onClick={onConnect}
              className="terminal-button"
            >
              CONNECT WALLET
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};