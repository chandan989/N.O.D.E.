import React from 'react';

const mockData = {
  fundOverview: {
    totalMembers: 2048,
    totalValueLocked: '1.2M HBAR',
    averageReturn: '5%',
    projectsFunded: 42,
  },
};

const MetricDisplay: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border-2 border-black p-4 text-center bg-white">
    <div className="text-3xl font-bold text-black">{value}</div>
    <div className="text-sm uppercase tracking-wider text-gray-500">{label}</div>
  </div>
);

const UserNodeFundGlimpse: React.FC = () => {
  return (
    <div className="pixel-card p-6">
        <h3 className="text-3xl font-bold mb-4 text-black">N.O.D.E._FUND_OVERVIEW</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricDisplay label="Members" value={mockData.fundOverview.totalMembers} />
            <MetricDisplay label="TVL" value={mockData.fundOverview.totalValueLocked} />
            <MetricDisplay label="Avg. Return" value={mockData.fundOverview.averageReturn} />
            <MetricDisplay label="Projects" value={mockData.fundOverview.projectsFunded} />
        </div>
        <div className="text-center">
            <a href="/dashboard/node-funds" className="btn-pixel">EXPLORE_FUND</a>
        </div>
    </div>
  );
};

export default UserNodeFundGlimpse;