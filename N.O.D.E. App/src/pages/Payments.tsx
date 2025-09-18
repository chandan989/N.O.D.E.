import React, { useState, useEffect } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWalletStore } from '@/stores/wallet-store';
import { sendHbarTransfer, getTransactionHistory } from '@/lib/hedera';
import { useToast } from '@/hooks/use-toast';

const Payments: React.FC = () => {
  const { isConnected, accountId, balance } = useWalletStore();
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (isConnected && accountId) {
      loadTransactionHistory();
    }
  }, [isConnected, accountId]);

  const loadTransactionHistory = async () => {
    if (!accountId) return;
    
    try {
      const history = await getTransactionHistory(accountId);
      setTransactions(history);
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  };

  const handleSendPayment = async () => {
    if (!isConnected || !accountId || !recipient || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please fill in all fields and connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendHbarTransfer({
        fromAccountId: accountId,
        toAccountId: recipient,
        amount: parseFloat(amount),
      });

      if (result.success) {
        toast({
          title: "Payment Sent",
          description: `Transaction ID: ${result.transactionId}`,
        });
        setRecipient('');
        setAmount('');
        loadTransactionHistory();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Failed to send payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <WindowPanel title="Access Denied">
        <div className="text-center py-8">
          <div className="font-terminal text-destructive text-xl mb-4">
            &gt; AUTHENTICATION REQUIRED
          </div>
          <div className="font-code text-muted-foreground">
            Connect your wallet to access the payment system.
          </div>
        </div>
      </WindowPanel>
    );
  }

  return (
    <div className="space-y-6">
      <WindowPanel title="Ghost Payment System">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="font-terminal text-accent mb-4">SEND HBAR</div>
              <div className="space-y-4">
                <div>
                  <label className="block font-code text-sm text-muted-foreground mb-2">
                    RECIPIENT ACCOUNT ID
                  </label>
                  <Input
                    type="text"
                    placeholder="0.0.123456"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="terminal-input"
                  />
                </div>
                <div>
                  <label className="block font-code text-sm text-muted-foreground mb-2">
                    AMOUNT (HBAR)
                  </label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="terminal-input"
                  />
                </div>
                <Button
                  onClick={handleSendPayment}
                  disabled={isLoading}
                  className="terminal-button w-full"
                >
                  {isLoading ? 'PROCESSING...' : 'SEND PAYMENT'}
                </Button>
              </div>
            </div>

            <div className="border border-border rounded p-4">
              <div className="font-terminal text-accent mb-2">ACCOUNT BALANCE</div>
              <div className="font-code text-2xl text-primary glow-text">
                {balance} HBAR
              </div>
            </div>
          </div>

          <div>
            <div className="font-terminal text-accent mb-4">TRANSACTION HISTORY</div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {transactions.length === 0 ? (
                <div className="text-center text-muted-foreground font-code py-8">
                  No transactions found
                </div>
              ) : (
                transactions.map((tx, index) => (
                  <div
                    key={tx.id}
                    className="border border-border rounded p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-code text-xs text-muted-foreground">
                        {tx.timestamp.toLocaleString()}
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