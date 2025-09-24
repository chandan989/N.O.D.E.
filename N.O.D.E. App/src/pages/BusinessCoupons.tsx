import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { CreateCouponDialog } from '@/components/features/create-coupon-dialog';
import { InfoTrigger } from '@/components/features/info-trigger';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const BusinessCoupons: React.FC = () => {
  const coupons = [
    { id: 1, code: "SUMMER2024", description: "20% off on all products." },
  ];

  return (
    <div className="container mx-auto px-6 py-8 text-xl space-y-8">
        <div className="flex items-center justify-center mb-4">
            <h1 className="text-5xl uppercase text-glow text-center">[COUPONS.EXE]</h1>
            <InfoTrigger
                title="Coupons"
                description="This section allows you to create and manage discount coupons for your products or services. Coupons are a great way to incentivize purchases and reward loyal customers."
            />
        </div>
        <SectionDivider />
        <WindowPanel title="CURRENT_COUPONS.DAT">
            <div className="space-y-4">
                {coupons.map(coupon => (
                    <div key={coupon.id}>
                        <h3 className="text-xl text-glow">{coupon.code}</h3>
                        <p className="text-base text-gray-400">{coupon.description}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <CreateCouponDialog />
            </div>
        </WindowPanel>
    </div>
  );
};

export default BusinessCoupons;
