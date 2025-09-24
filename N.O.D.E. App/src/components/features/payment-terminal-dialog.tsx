import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/stores/wallet-store';

const QrCodeDisplay: React.FC<{ value: string }> = ({ value }) => {
  // Using a reliable external API to generate a standard black & white QR code for maximum compatibility.
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    value
  )}&size=220x220&q=H&margin=10&bgcolor=f0f8ff`; // AliceBlue background

  return (
    <div className="p-2 rounded-lg bg-cyan-500/10 border-2 border-cyan-500/30 shadow-[0_0_20px_theme(colors.cyan.500/0.5)]">
      <img src={qrCodeUrl} alt={`QR Code for ${value}`} className="rounded-md w-48 h-48 sm:w-56 sm:h-56" />
    </div>
  );
};

export const PaymentTerminalDialog: React.FC = () => {
  const { accountId } = useWalletStore();

  // The correct format for a Hedera payment request without a specified amount.
  const qrValue = accountId ? `hedera:${accountId}` : '[WALLET_NOT_CONNECTED]';

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-retro w-full">[OPEN_TERMINAL]</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-glow">Payment Terminal</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <p className="text-base text-gray-400">Scan to pay with HBAR</p>
          {accountId ? (
            <QrCodeDisplay value={qrValue} />
          ) : (
            <p className="text-red-500">[WALLET_NOT_CONNECTED]</p>
          )}
          <p className="text-sm text-glow mt-2 bg-black/50 px-4 py-1 rounded-md border border-white/10 break-all">{accountId}</p>
          <p className="text-xs text-center text-gray-500 px-8">The payer will need to enter the amount to be transferred.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
