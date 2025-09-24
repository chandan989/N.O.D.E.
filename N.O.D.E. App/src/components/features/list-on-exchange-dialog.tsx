import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const ListOnExchangeDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-retro w-full">[LIST_ON_EXCHANGE]</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-glow">List on Local Exchange</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-doc">Registration Doc</Label>
            <Input id="reg-doc" type="file" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tax-returns">Tax Returns</Label>
            <Input id="tax-returns" type="file" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="domain">Domain (Optional)</Label>
            <Input id="domain" placeholder="e.g., elykid.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tokens">Number of Tokens</Label>
            <Input id="tokens" type="number" placeholder="e.g., 1000000" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="percentage">% to List</Label>
            <Input id="percentage" type="number" placeholder="e.g., 25" />
          </div>
        </div>
        <Button type="submit" className="btn-retro w-full">[SUBMIT_FOR_VERIFICATION]</Button>
      </DialogContent>
    </Dialog>
  );
};
