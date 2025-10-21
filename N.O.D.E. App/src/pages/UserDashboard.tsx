import React from 'react';
import UserLocalExchangeGlimpse from '@/components/glimpses/UserLocalExchangeGlimpse';
import UserNodeFundGlimpse from '@/components/glimpses/UserNodeFundGlimpse';
import LocalExchangeGraph from '@/components/features/LocalExchangeGraph';
import UserAssetGlimpse from '@/components/glimpses/UserAssetGlimpse';

const UserDashboard: React.FC = () => {
  return (
    <div className="space-y-8 py-8 p-8 mt-10">
        <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">USER <span className="text-glow">DASHBOARD</span></h1>
            <p className="text-2xl mt-2 text-gray-500">// Welcome back, operator. All systems nominal.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <main className="lg:col-span-2 space-y-8">
                <LocalExchangeGraph />
                <UserNodeFundGlimpse />
            </main>
            <aside className="space-y-8">
                <UserLocalExchangeGlimpse />
                <UserAssetGlimpse />
            </aside>
        </div>
    </div>
  );
};

export default UserDashboard;
