import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';

const mockOffers = [
  {
    id: 1,
    title: 'Cyber Monday Special',
    description: 'Get a 25% discount on all cybernetic implants.',
    discount: '25%',
    business: 'Chrome & Steel Inc.',
  },
  {
    id: 2,
    title: 'Synth-Soul Food',
    description: 'Buy one nutrient paste, get one free.',
    discount: 'BOGO',
    business: 'NutriSynth Corp.',
  },
  {
    id: 3,
    title: 'Data Heist Discount',
    description: '50% off your next data encryption service.',
    discount: '50%',
    business: 'Ghost Data Security',
  },
];

const UserOffersAndCouponsGlimpse: React.FC = () => {
  return (
    <WindowPanel title="Offers & Coupons">
      <div className="space-y-4">
        {mockOffers.slice(0, 2).map((offer) => (
          <div key={offer.id} className="border border-border/50 rounded p-3">
            <h3 className="text-lg text-glow uppercase truncate">{offer.title}</h3>
            <p className="text-muted-foreground truncate text-sm">{offer.description}</p>
            <div className="text-right">
                <span className="inline-block bg-primary/10 border border-primary text-primary font-bold text-lg px-3 py-1 rounded-md">{offer.discount}</span>
            </div>
          </div>
        ))}
         <div className="text-center">
          <a href="/user-offers-and-coupons" className="text-primary hover:text-glow font-bold">View All Offers &gt;</a>
        </div>
      </div>
    </WindowPanel>
  );
};

export default UserOffersAndCouponsGlimpse;
