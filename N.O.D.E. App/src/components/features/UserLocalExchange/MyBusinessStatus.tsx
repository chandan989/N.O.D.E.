
import React from 'react';
import { Button } from '@/components/ui/button';

// This component now only shows the status for an already-listed business.
// The logic for listing a new business has been moved to ListYourBusiness.tsx

const ListedView: React.FC = () => (
  <div className="space-y-3 text-sm p-4 bg-gray-800/50 rounded-lg">
    <h4 className="text-md font-bold text-glow">Your Business Performance</h4>
    <div className="flex justify-between">
      <span className="text-gray-400">Token Price:</span>
      <span className="text-green-400">$12.50 (+2.1%)</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-400">24h Volume:</span>
      <span>$45,000</span>
    </div>
    <div className="flex justify-between">
      <span className="text-gray-400">Market Cap:</span>
      <span>$1.25M</span>
    </div>
    <Button variant="outline" size="sm" className="w-full mt-2">Manage Your Listing</Button>
  </div>
);

export const MyBusinessStatus: React.FC = () => {
  return <ListedView />;
};
