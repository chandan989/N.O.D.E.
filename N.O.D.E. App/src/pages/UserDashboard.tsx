import React from 'react';
import UserLocalExchangeGlimpse from '@/components/glimpses/UserLocalExchangeGlimpse';
import UserNodeFundGlimpse from '@/components/glimpses/UserNodeFundGlimpse';
import LocalExchangeGraph from '@/components/features/LocalExchangeGraph';
import UserAssetGlimpse from '@/components/glimpses/UserAssetGlimpse';

const UserDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, here's what's new in your N.O.D.E. account.</p>
      </header>

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
