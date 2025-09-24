
import React from 'react';
import { ListOnExchangeDialog } from '@/components/features/list-on-exchange-dialog';

const ListYourBusiness: React.FC = () => (
  <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg text-center">
    <h4 className="text-md font-bold text-glow">Tokenize Your Business</h4>
    <p className="text-sm text-gray-300">
      Convert your business equity into tradable digital tokens. Gain access to community funding, increase liquidity, and unlock new growth opportunities on the N.O.D.E. exchange.
    </p>
    <ListOnExchangeDialog />
  </div>
);

export default ListYourBusiness;
