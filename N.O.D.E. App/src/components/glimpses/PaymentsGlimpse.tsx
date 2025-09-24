import React, { useState, useEffect, useMemo } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { useWalletStore } from '@/stores/wallet-store';
import { useToast } from '@/hooks/use-toast';

const PaymentsGlimpse: React.FC = () => {
  const { isConnected, accountId } = useWalletStore();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected && accountId) {
      loadTransactionHistory();
    }
  }, [isConnected, accountId]);

  const loadTransactionHistory = async () => {
    if (!accountId) return;
    
    try {
      const mockTransactions = Array.from({ length: 25 }).map((_, index) => {
        const isReceived = Math.random() > 0.5;
        const amount = parseFloat((Math.random() * (isReceived ? 500 : 150)).toFixed(2));
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

        return {
          id: `0.0.12345-mock-${index}-${timestamp.getTime()}`,
          timestamp: timestamp,
          amount: isReceived ? amount : -amount,
          from: isReceived ? `0.0.5432${index}` : accountId,
          to: isReceived ? accountId : `0.0.9876${index}`,
        };
      });

      mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to generate mock transaction history:', error);
      toast({
        title: "Error",
        description: "Failed to load mock transaction history.",
        variant: "destructive",
      });
    }
  };

  const { totalSent, totalReceived, totalTransactions } = useMemo(() => {
    let sent = 0;
    let received = 0;
    transactions.forEach(tx => {
      if (tx.amount < 0) {
        sent += Math.abs(tx.amount);
      } else {
        received += tx.amount;
      }
    });
    return {
      totalSent: sent.toFixed(2),
      totalReceived: received.toFixed(2),
      totalTransactions: transactions.length,
    };
  }, [transactions]);

  if (!isConnected) {
    return (
      <WindowPanel title="Access Denied">
        <div className="text-center py-8">
          <div className="font-terminal text-destructive text-xl mb-4">
            &gt; AUTHENTICATION REQUIRED
          </div>
          <div className="font-code text-muted-foreground">
            Connect your wallet to access your spending insights.
          </div>
        </div>
      </WindowPanel>
    );
  }

  return (
    <WindowPanel title="Spending Insights">
      <div className="space-y-4">
        <div className="border border-border rounded p-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-code text-muted-foreground">Total Transactions:</span>
            <span className="font-code text-primary text-lg">{totalTransactions}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-code text-muted-foreground">Total Sent:</span>
            <span className="font-code text-accent text-lg">{totalSent} HBAR</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-code text-muted-foreground">Total Received:</span>
            <span className="font-code text-primary text-lg">{totalReceived} HBAR</span>
          </div>
        </div>
        <div className="text-center">
          <a href="/payments" className="text-primary hover:text-glow font-bold">View Full History &gt;</a>
        </div>
      </div>
    </WindowPanel>
  );
};

export default PaymentsGlimpse;
