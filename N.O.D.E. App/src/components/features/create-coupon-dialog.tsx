import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const CreateCouponDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="btn-retro">[CREATE_NEW_COUPON]</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-glow">Create New Coupon</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="code">Code</Label>
            <Input id="code" placeholder="e.g., SUMMER2024" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="e.g., 20% off on all products" />
          </div>
        </div>
        <Button type="submit" className="btn-retro w-full">[CREATE_COUPON]</Button>
      </DialogContent>
    </Dialog>
  );
};
