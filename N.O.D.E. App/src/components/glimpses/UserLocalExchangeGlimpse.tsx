import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';

// Mock data for the glimpse
const mockPortfolio = {
  portfolioValue: '2,345.67 HBAR',
  totalInvestment: '2,000.00 HBAR',
  overallGainLoss: '+345.67 HBAR',
  gainLossPercentage: '+17.28%',
};

const UserLocalExchangeGlimpse: React.FC = () => {
  return (
    <WindowPanel title="Local Exchange Snapshot">
      <div className="space-y-4 p-4">
        <div className="flex justify-between items-center">
          <span className="font-code text-muted-foreground">Portfolio Value:</span>
          <span className="font-code text-primary text-lg">{mockPortfolio.portfolioValue}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-code text-muted-foreground">Total Investment:</span>
          <span className="font-code text-white">{mockPortfolio.totalInvestment}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-code text-muted-foreground">Overall Gain/Loss:</span>
          <span className={`font-code text-lg ${mockPortfolio.gainLossPercentage.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {mockPortfolio.overallGainLoss} ({mockPortfolio.gainLossPercentage})
          </span>
        </div>
        <div className="text-center mt-4">
          <a href="/user-local-exchange" className="text-primary hover:text-glow font-bold">Go to Exchange &gt;</a>
        </div>
      </div>
    </WindowPanel>
  );
};

export default UserLocalExchangeGlimpse;
