import React from 'react';
import PaymentsGlimpse from '@/components/glimpses/PaymentsGlimpse';
import UserOffersAndCouponsGlimpse from '@/components/glimpses/UserOffersAndCouponsGlimpse';
import UserLocalExchangeGlimpse from '@/components/glimpses/UserLocalExchangeGlimpse';
import UserNodeFundGlimpse from '@/components/glimpses/UserNodeFundGlimpse';
import QRCodePayment from '@/components/features/QRCodePayment';

const UserDashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">User Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, here's what's new in your N.O.D.E. account.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <main className="lg:col-span-2 space-y-8">
          <PaymentsGlimpse />
          <UserLocalExchangeGlimpse />
        </main>

        {/* Sidebar */}
        <aside className="space-y-8">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <QRCodePayment />
          </div>
          <UserNodeFundGlimpse />
          <UserOffersAndCouponsGlimpse />
        </aside>
      </div>
    </div>
  );
};

export default UserDashboard;
