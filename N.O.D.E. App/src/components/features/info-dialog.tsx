import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

interface InfoDialogProps {
  title: string;
  description: React.ReactNode;
}

export const InfoDialog: React.FC<InfoDialogProps> = ({ title, description }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-2">
          <Info className="h-4 w-4 text-glow" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-glow">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4 text-base text-gray-400">{description}</div>
      </DialogContent>
    </Dialog>
  );
};
