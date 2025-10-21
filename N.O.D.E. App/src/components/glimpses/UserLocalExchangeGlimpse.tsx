import React from 'react';

const mockPortfolio = {
  portfolioValue: '2,345.67 HBAR',
  totalInvestment: '2,000.00 HBAR',
  overallGainLoss: '+345.67 HBAR',
  gainLossPercentage: '+17.28%',
};

const PortfolioItem: React.FC<{ label: string; value: string; valueClass?: string }> = ({ label, value, valueClass }) => (
    <div className="flex justify-between items-baseline py-2 border-b-2 border-dashed border-black/20">
      <span className="text-gray-500 uppercase text-sm">{label}</span>
      <span className={`font-bold text-lg ${valueClass}`}>{value}</span>
    </div>
);

const UserLocalExchangeGlimpse: React.FC = () => {
  return (
    <div className="pixel-card p-6">
      <h3 className="text-3xl font-bold mb-4 text-black">EXCHANGE_SNAPSHOT</h3>
      <div className="space-y-3 mb-6">
        <PortfolioItem label="Portfolio Value" value={mockPortfolio.portfolioValue} valueClass="text-black" />
        <PortfolioItem label="Total Investment" value={mockPortfolio.totalInvestment} />
        <PortfolioItem 
            label="Overall Gain/Loss" 
            value={`${mockPortfolio.overallGainLoss} (${mockPortfolio.gainLossPercentage})`} 
            valueClass={mockPortfolio.gainLossPercentage.startsWith('+') ? 'text-black' : 'text-red-500'}
        />
      </div>
      <div className="text-center">
        <a href="/dashboard/local-exchange" className="btn-pixel">GO_TO_EXCHANGE</a>
      </div>
    </div>
  );
};

export default UserLocalExchangeGlimpse;