import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { CreateOfferDialog } from '@/components/features/create-offer-dialog';
import { InfoTrigger } from '@/components/features/info-trigger';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const BusinessOffers: React.FC = () => {
  const offers = [
    { id: 1, title: "10% off on all services", description: "Use code 'SAVE10' at checkout." },
    { id: 2, title: "Free consultation", description: "Book a free 30-minute consultation." },
  ];

  return (
    <div className="container mx-auto px-6 py-8 text-xl space-y-8">
        <div className="flex items-center justify-center mb-4">
            <h1 className="text-5xl uppercase text-glow text-center">[OFFERS.EXE]</h1>
            <InfoTrigger
                title="Offers"
                description="This section allows you to create and manage special offers for your customers. Offers can be used to promote your services and attract new clients."
            />
        </div>
        <SectionDivider />
        <WindowPanel title="CURRENT_OFFERS.DAT">
            <div className="space-y-4">
                {offers.map(offer => (
                    <div key={offer.id}>
                        <h3 className="text-xl text-glow">{offer.title}</h3>
                        <p className="text-base text-gray-400">{offer.description}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <CreateOfferDialog />
            </div>
        </WindowPanel>
    </div>
  );
};

export default BusinessOffers;
