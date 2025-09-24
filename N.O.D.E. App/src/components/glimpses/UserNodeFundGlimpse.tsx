import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';

const mockData = {
  fundOverview: {
    totalMembers: 2048,
    totalValueLocked: '1.2M HBAR',
    averageReturn: '5%',
    projectsFunded: 42,
  },
};

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border border-border/50 rounded p-3 bg-black/20 text-center">
    <div className="font-terminal text-xl text-primary text-glow">{value}</div>
    <div className="font-code text-xs text-muted-foreground uppercase">{label}</div>
  </div>
);

const UserNodeFundGlimpse: React.FC = () => {
  return (
    <WindowPanel title="N.O.D.E. Fund Overview">
        <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <MetricBadge label="Members" value={mockData.fundOverview.totalMembers} />
                <MetricBadge label="TVL" value={mockData.fundOverview.totalValueLocked} />
                <MetricBadge label="Avg. Return" value={mockData.fundOverview.averageReturn} />
                <MetricBadge label="Projects" value={mockData.fundOverview.projectsFunded} />
            </div>
            <div className="text-center">
                <a href="/user-node-fund" className="text-primary hover:text-glow font-bold">Explore the Fund &gt;</a>
            </div>
        </div>
    </WindowPanel>
  );
};

export default UserNodeFundGlimpse;
