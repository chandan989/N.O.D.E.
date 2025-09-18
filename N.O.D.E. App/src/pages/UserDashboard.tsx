import React, { useState, useEffect } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWalletStore } from '@/stores/wallet-store';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Percent, Gift, Search } from 'lucide-react';

// Mock data for coupons and offers
const mockOffers = [
  {
    id: 1,
    businessName: "Joe's Coffee Shop",
    title: "20% Off Morning Coffee",
    description: "Valid for all coffee drinks before 11 AM",
    discount: 20,
    validUntil: "2025-12-31",
    location: "Downtown District",
    category: "Food & Beverage",
    available: true,
    code: "MORNING20"
  },
  {
    id: 2,
    businessName: "Tech Repair Hub", 
    title: "Free Screen Protector",
    description: "With any phone repair service",
    discount: 0,
    validUntil: "2025-11-30",
    location: "Tech Quarter",
    category: "Services",
    available: true,
    code: "FREESCREEN"
  },
  {
    id: 3,
    businessName: "Green Grocery",
    title: "Buy 2 Get 1 Free",
    description: "On all organic vegetables",
    discount: 33,
    validUntil: "2025-10-15",
    location: "Market Street",
    category: "Grocery",
    available: false,
    code: "ORGANIC3"
  },
];

const UserDashboard: React.FC = () => {
  const { isConnected, accountId, balance } = useWalletStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredOffers, setFilteredOffers] = useState(mockOffers);

  const categories = ['All', 'Food & Beverage', 'Services', 'Grocery', 'Retail'];

  useEffect(() => {
    let filtered = mockOffers;
    
    if (searchTerm) {
      filtered = filtered.filter(offer => 
        offer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }
    
    setFilteredOffers(filtered);
  }, [searchTerm, selectedCategory]);

  const claimOffer = (offerId: number) => {
    console.log('Claiming offer:', offerId);
    // Here you would integrate with the blockchain to claim the offer
  };

  return (
    <div className="space-y-6">
      <WindowPanel title="Consumer Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <div className="font-terminal text-accent">WALLET STATUS</div>
            <div className="font-code text-sm">
              STATUS: <span className={isConnected ? "text-primary" : "text-destructive"}>
                {isConnected ? "CONNECTED" : "DISCONNECTED"}
              </span>
            </div>
            {isConnected && (
              <>
                <div className="font-code text-sm">
                  BALANCE: <span className="text-primary">{balance} HBAR</span>
                </div>
                <div className="font-code text-xs text-muted-foreground">
                  ID: {accountId}
                </div>
              </>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="font-terminal text-accent">ACTIVE COUPONS</div>
            <div className="font-code text-2xl text-primary glow-text">
              {filteredOffers.filter(o => o.available).length}
            </div>
            <div className="font-code text-xs text-muted-foreground">
              Available in your area
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="font-terminal text-accent">SAVINGS POTENTIAL</div>
            <div className="font-code text-2xl text-accent">
              {Math.round(filteredOffers.reduce((acc, offer) => acc + offer.discount, 0) / filteredOffers.length)}%
            </div>
            <div className="font-code text-xs text-muted-foreground">
              Average discount available
            </div>
          </div>
        </div>
      </WindowPanel>

      <WindowPanel title="Local Offers & Coupons">
        <div className="space-y-4">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers or businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="terminal-input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "terminal-button" : "font-code"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className={`border rounded p-4 transition-all hover:border-primary ${
                  offer.available ? 'border-border' : 'border-muted opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-terminal text-primary text-lg">
                      {offer.businessName}
                    </div>
                    <div className="font-code text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {offer.location}
                    </div>
                  </div>
                  <Badge variant={offer.available ? "default" : "secondary"} className="font-code text-xs">
                    {offer.category}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="font-code font-medium">{offer.title}</div>
                  <div className="font-code text-sm text-muted-foreground">
                    {offer.description}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  {offer.discount > 0 ? (
                    <div className="flex items-center gap-1 text-accent">
                      <Percent className="w-4 h-4" />
                      <span className="font-code font-medium">{offer.discount}% OFF</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-primary">
                      <Gift className="w-4 h-4" />
                      <span className="font-code font-medium">FREE ITEM</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground text-xs font-code">
                    <Clock className="w-3 h-3" />
                    Until {new Date(offer.validUntil).toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-code text-xs text-muted-foreground">
                    Code: <span className="text-primary">{offer.code}</span>
                  </div>
                  <Button
                    onClick={() => claimOffer(offer.id)}
                    disabled={!offer.available || !isConnected}
                    className={offer.available ? "terminal-button w-full" : "w-full font-code"}
                    size="sm"
                  >
                    {!isConnected ? 'CONNECT WALLET' : 
                     offer.available ? 'CLAIM OFFER' : 'EXPIRED'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-8">
              <div className="font-terminal text-muted-foreground text-xl mb-2">
                NO OFFERS FOUND
              </div>
              <div className="font-code text-sm text-muted-foreground">
                Try adjusting your search or category filter
              </div>
            </div>
          )}
        </div>
      </WindowPanel>
    </div>
  );
};

export default UserDashboard;