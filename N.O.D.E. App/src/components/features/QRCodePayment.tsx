import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useWalletStore } from '@/stores/wallet-store';
import { WindowPanel } from '@/components/ui/window-panel';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock balance for demonstration
const MOCK_BALANCE = '1,234.56 HBAR';

const QRCodePayment: React.FC = () => {
  const [isScanDialogOpen, setScanDialogOpen] = useState(false);
  const [isReceiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const { isConnected, accountId } = useWalletStore();

  if (!isConnected || !accountId) {
    return (
        <WindowPanel title="P2P PAYMENTS">
            <div className="text-center p-4">
                 <p className="text-muted-foreground font-code">Connect your wallet to make and receive payments.</p>
            </div>
        </WindowPanel>
    )
  }

  return (
    <>
      <WindowPanel title="P2P PAYMENTS">
        <div className="p-4 space-y-4">
            <div className='text-center'>
                <p className="font-code text-muted-foreground">Your Balance</p>
                <p className="text-3xl text-glow font-terminal">{MOCK_BALANCE}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => setScanDialogOpen(true)} className="w-full">Scan to Pay</Button>
                <Button onClick={() => setReceiveDialogOpen(true)} variant="outline" className="w-full">Receive</Button>
            </div>
        </div>
      </WindowPanel>

      {/* Scan QR Code Dialog (Simulated Camera) */}
      <Dialog open={isScanDialogOpen} onOpenChange={setScanDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan QR Code to Pay</DialogTitle>
            <DialogDescription>
              Center the QR code within the frame. The recipient and amount will be filled automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center p-4 bg-black rounded-lg my-4">
            {/* Simulated camera view */}
            <div className="relative w-64 h-64 bg-gray-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-dashed border-cyan-500 animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-muted-foreground font-code">
                    <p>CAMERA SIMULATION</p>
                    <p className='text-xs'>(No actual camera access)</p>
                </div>
            </div>
          </div>
           <div className="space-y-2 font-code">
                <Label htmlFor="recipient-id">Recipient Account ID</Label>
                <Input id="recipient-id" placeholder="0.0.xxxxx" defaultValue="0.0.12345"/>
            </div>
            <div className="space-y-2 font-code">
                <Label htmlFor="amount">Amount (HBAR)</Label>
                <Input id="amount" type="number" placeholder="e.g., 50" />
            </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScanDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setScanDialogOpen(false)}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Receive Payment Dialog */}
      <Dialog open={isReceiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Receive Payment</DialogTitle>
            <DialogDescription>
              Show this QR code to receive HBAR. The code contains your account ID.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center items-center p-8 bg-white rounded-lg">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${accountId}`} alt="QR Code" />
          </div>
          <p className="text-center text-muted-foreground font-code">Your Account ID: {accountId}</p>
          <DialogFooter>
            <Button onClick={() => setReceiveDialogOpen(false)} className="w-full">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default QRCodePayment;
