import React, { useState } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  {
    id: 4,
    title: 'Droid Repair Rebate',
    description: '10% back on all droid maintenance and repairs.',
    discount: '10%',
    business: 'Tin Can Alley',
  },
];

type Offer = (typeof mockOffers)[0];

const UserOffersAndCoupons: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsDialogOpen(true);
  };

  const handleClaimOffer = () => {
    if (selectedOffer) {
      console.log('Claiming offer:', selectedOffer.title);
      // Here you would typically handle the logic for claiming the offer,
      // such as making an API call, updating user data, etc.
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl uppercase text-glow mb-4">// OFFERS & COUPONS</h2>
      <p className="text-muted-foreground mb-8">
        Exclusive offers and coupons from local businesses in the N.O.D.E. network.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOffers.map((offer) => (
          <div key={offer.id} onClick={() => handleOfferClick(offer)} className="cursor-pointer">
            <WindowPanel title={offer.business}>
              <div className="p-4">
                <h3 className="text-xl text-glow uppercase mb-2">{offer.title}</h3>
                <p className="text-muted-foreground mb-4">{offer.description}</p>
                <div className="text-center">
                  <div className="inline-block bg-primary/10 border border-primary text-primary font-bold text-2xl px-4 py-2 rounded-lg">
                    {offer.discount}
                  </div>
                </div>
              </div>
            </WindowPanel>
          </div>
        ))}
      </div>

      {selectedOffer && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedOffer.title}</DialogTitle>
              <DialogDescription>
                {selectedOffer.description}
              </DialogDescription>
            </DialogHeader>
            <div className="text-center my-4">
              <div className="inline-block bg-primary/10 border border-primary text-primary font-bold text-4xl px-6 py-4 rounded-lg">
                {selectedOffer.discount}
              </div>
            </div>
            <p className="text-center text-muted-foreground">
              From: {selectedOffer.business}
            </p>
            <DialogFooter>
              <Button onClick={handleClaimOffer} className="w-full">Claim Offer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UserOffersAndCoupons;
