import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { CreateListingDialog } from '@/components/features/create-listing-dialog';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const BusinessListing: React.FC = () => {
  return (
    <div className="container mx-auto px-6 py-8 text-xl space-y-8">
        <h1 className="text-5xl uppercase text-glow text-center mb-4">[LISTING.EXE]</h1>
        <SectionDivider />
        <WindowPanel title="LISTING_STATUS.SYS">
            <div className="space-y-4">
                <h3 className="text-xl text-glow">CREATE_OR_UPDATE_LISTING</h3>
                <p className="text-base text-gray-400">Create or update your business listing on the N.O.D.E. network.</p>
                <CreateListingDialog />
            </div>
        </WindowPanel>
    </div>
  );
};

export default BusinessListing;
