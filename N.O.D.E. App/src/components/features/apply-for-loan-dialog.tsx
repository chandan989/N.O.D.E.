import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const ApplyForLoanDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-retro w-full">[APPLY_FOR_LOAN]</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-glow">Apply for a Loan</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="amount">Amount (HBAR)</Label>
            <Input id="amount" type="number" placeholder="e.g., 5000" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="purpose">Purpose</Label>
            <Textarea id="purpose" placeholder="Briefly describe the purpose of the loan" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tax-returns">Tax Returns</Label>
            <Input id="tax-returns" type="file" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="other-docs">Other Documents</Label>
            <Input id="other-docs" type="file" />
          </div>
          <p className="text-sm text-gray-400 text-center mt-2">
            Your application will be reviewed, and you will be notified of the decision. Approved loans feature a unique repayment option of paying back small amounts daily.
          </p>
        </div>
        <Button type="submit" className="btn-retro w-full">[SUBMIT_APPLICATION]</Button>
      </DialogContent>
    </Dialog>
  );
};
