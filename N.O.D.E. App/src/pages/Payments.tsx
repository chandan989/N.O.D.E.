import React, { useState, useEffect, useMemo } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { useWalletStore } from '@/stores/wallet-store';
// import { getTransactionHistory } from '@/lib/hedera'; // Commented out as we are using mock data
import { useToast } from '@/hooks/use-toast';

const Payments: React.FC = () => {
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
      // NOTE: This is using mock data for demonstration purposes.
      // To use real data, uncomment the getTransactionHistory import and the call below.

      // const history = await getTransactionHistory(accountId);

      const mockTransactions = Array.from({ length: 25 }).map((_, index) => {
        const isReceived = Math.random() > 0.5;
        const amount = parseFloat((Math.random() * (isReceived ? 500 : 150)).toFixed(2));
        // Create a more realistic, scattered timeline over the last month
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

        return {
          id: `0.0.12345-mock-${index}-${timestamp.getTime()}`,
          timestamp: timestamp,
          amount: isReceived ? amount : -amount,
          from: isReceived ? `0.0.5432${index}` : accountId,
          to: isReceived ? accountId : `0.0.9876${index}`,
        };
      });

      // Sort transactions by date, newest first
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
            Connect your wallet to access your spending insights and transaction history.
          </div>
        </div>
      </WindowPanel>
    );
  }

  return (
    <div className="space-y-6">
      <WindowPanel title="Spending Insights & History">
        <div className="space-y-8">
          {/* Spending Insights Section */}
          <div>
            <div className="font-terminal text-accent mb-4">SPENDING INSIGHTS</div>
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
          </div>

          {/* Transaction History Section */}
          <div>
            <div className="font-terminal text-accent mb-4">TRANSACTION HISTORY</div>
            <div className="space-y-2 max-h-96 overflow-y-auto border border-border rounded p-4">
              {transactions.length === 0 ? (
                <div className="text-center text-muted-foreground font-code py-8">
                  No transactions found
                </div>
              ) : (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="border border-border rounded p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-code text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                      <div className={`font-code text-sm ${
                        tx.amount > 0 ? 'text-primary' : 'text-accent'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} HBAR
                      </div>
                    </div>
                    <div className="font-code text-xs text-muted-foreground">
                      {tx.amount > 0 ? 'FROM' : 'TO'}: {tx.amount > 0 ? tx.from : tx.to}
                    </div>
                    <div className="font-code text-xs text-primary opacity-60">
                      {tx.id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </WindowPanel>
    </div>
  );
};

export default Payments;
