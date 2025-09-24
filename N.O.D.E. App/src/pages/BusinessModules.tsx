import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { PaymentTerminalDialog } from '@/components/features/payment-terminal-dialog';
import { InfoTrigger } from '@/components/features/info-trigger';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const BusinessModules: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 text-xl space-y-8">
        <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl sm:text-5xl uppercase text-glow text-center">[MODULES.EXE]</h1>
            <InfoTrigger
                title="Business Modules"
                description="This section contains various modules and tools to help you manage your business operations on the N.O.D.E. network. Each module provides specific functionality, such as accepting payments."
            />
        </div>
        <SectionDivider />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <WindowPanel title="PAYMENT_TERMINAL.MOD">
                <div className="flex flex-col justify-between h-full min-h-[120px]">
                    <p className="text-base text-gray-400 mb-4">
                        Accept HBAR payments from users.
                    </p>
                    <PaymentTerminalDialog />
                </div>
            </WindowPanel>
        </div>
    </div>
  );
};

export default BusinessModules;
