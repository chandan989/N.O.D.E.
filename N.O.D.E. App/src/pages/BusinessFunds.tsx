import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { ApplyForLoanDialog } from '@/components/features/apply-for-loan-dialog';
import { InfoTrigger } from '@/components/features/info-trigger';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const BusinessFunds: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 text-xl space-y-8">
        <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl sm:text-5xl uppercase text-glow text-center">[FUNDS.EXE]</h1>
            <InfoTrigger
                title="Funds"
                description="The Funds section provides access to capital for businesses on the network. It features a unique repayment option, allowing you to pay back small amounts daily, making it easier to manage your cash flow."
            />
        </div>
        <SectionDivider />
        <WindowPanel title="APPLY_FOR_LOAN.MOD">
            <div className="space-y-4">
                <h3 className="text-lg sm:text-xl text-glow">APPLY_FOR_A_LOAN</h3>
                <p className="text-base text-gray-400">
                    Get access to capital with a unique repayment option of paying back small amounts daily.
                </p>
                <ApplyForLoanDialog />
            </div>
        </WindowPanel>
    </div>
  );
};

export default BusinessFunds;
