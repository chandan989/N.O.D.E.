import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { ListOnExchangeDialog } from '@/components/features/list-on-exchange-dialog';
import { InfoTrigger } from '@/components/features/info-trigger';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const LocalExchange: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 text-xl space-y-8">
        <div className="flex items-center justify-center mb-4">
            <h1 className="text-3xl sm:text-5xl uppercase text-glow text-center">[LOCAL_EXCHANGE.EXE]</h1>
            <InfoTrigger
                title="Local Exchange"
                description="This section allows you to tokenize your business by converting your company's registration documents into NFTs. These tokens can then be listed on the Local Exchange, allowing people to own a stake in your business. To get started, you'll need to submit your company's registration documents, tax returns, and optionally, your domain. Based on these, we'll verify your business and calculate its valuation."
            />
        </div>
        <SectionDivider />
        <WindowPanel title="LIST_ON_EXCHANGE.MOD">
            <div className="space-y-4">
                <h3 className="text-lg sm:text-xl text-glow">TOKENIZE_YOUR_BUSINESS</h3>
                <p className="text-base text-gray-400">
                    Convert your company's registration documents into NFTs and list them on the Local Exchange. This allows people to own a stake in your business.
                </p>
                <p className="text-base text-gray-400">
                    To get started, you'll need to submit your company's registration documents, tax returns, and optionally, your domain. Based on these, we'll verify your business and calculate its valuation.
                </p>
                <ListOnExchangeDialog />
            </div>
        </WindowPanel>
    </div>
  );
};

export default LocalExchange;
