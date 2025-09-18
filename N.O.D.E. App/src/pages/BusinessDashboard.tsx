import React, { useState } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useWalletStore } from '@/stores/wallet-store';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, TrendingUp, Users, DollarSign, Package, Percent, Eye, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock business data
const mockBusinessData = {
  performance: {
    totalSales: 15420.50,
    totalCustomers: 847,
    averageOrder: 18.20,
    activeOffers: 5,
    monthlyGrowth: 12.5,
    customerRetention: 78
  },
  listings: [
    {
      id: 1,
      title: "Premium Coffee Blend",
      price: 24.99,
      category: "Products",
      status: "active",
      views: 156,
      sales: 23
    },
    {
      id: 2,
      title: "Laptop Repair Service", 
      price: 89.99,
      category: "Services",
      status: "active",
      views: 89,
      sales: 7
    }
  ],
  offers: [
    {
      id: 1,
      title: "20% Off Morning Coffee",
      discount: 20,
      claimed: 45,
      maxClaims: 100,
      validUntil: "2025-12-31",
      status: "active"
    },
    {
      id: 2,
      title: "Free Screen Protector",
      discount: 0,
      claimed: 12,
      maxClaims: 50,
      validUntil: "2025-11-30", 
      status: "active"
    }
  ]
};

const BusinessDashboard: React.FC = () => {
  const { isConnected, accountId, balance } = useWalletStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Form states
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Products'
  });
  
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discount: '',
    maxClaims: '',
    validUntil: ''
  });

  const handleCreateListing = () => {
    console.log('Creating listing:', newListing);
    toast({
      title: "Listing Created",
      description: "Your new listing has been added to the local exchange.",
    });
    setNewListing({ title: '', description: '', price: '', category: 'Products' });
  };

  const handleCreateOffer = () => {
    console.log('Creating offer:', newOffer);
    toast({
      title: "Offer Created", 
      description: "Your new offer is now live for customers to claim.",
    });
    setNewOffer({ title: '', description: '', discount: '', maxClaims: '', validUntil: '' });
  };

  if (!isConnected) {
    return (
      <WindowPanel title="Access Denied">
        <div className="text-center py-8">
          <div className="font-terminal text-destructive text-xl mb-4">
            &gt; AUTHENTICATION REQUIRED
          </div>
          <div className="font-code text-muted-foreground">
            Connect your wallet to access business dashboard features.
          </div>
        </div>
      </WindowPanel>
    );
  }

  return (
    <div className="space-y-6">
      <WindowPanel title="Business Control Center">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview" className="font-code">OVERVIEW</TabsTrigger>
            <TabsTrigger value="listings" className="font-code">LISTINGS</TabsTrigger>
            <TabsTrigger value="offers" className="font-code">OFFERS</TabsTrigger>
            <TabsTrigger value="analytics" className="font-code">ANALYTICS</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="border border-border rounded p-4 text-center">
                <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-code text-xs text-muted-foreground">TOTAL SALES</div>
                <div className="font-terminal text-primary text-lg">
                  ${mockBusinessData.performance.totalSales.toLocaleString()}
                </div>
              </div>
              
              <div className="border border-border rounded p-4 text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-code text-xs text-muted-foreground">CUSTOMERS</div>
                <div className="font-terminal text-accent text-lg">
                  {mockBusinessData.performance.totalCustomers}
                </div>
              </div>
              
              <div className="border border-border rounded p-4 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-code text-xs text-muted-foreground">AVG ORDER</div>
                <div className="font-terminal text-primary text-lg">
                  ${mockBusinessData.performance.averageOrder}
                </div>
              </div>
              
              <div className="border border-border rounded p-4 text-center">
                <Package className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-code text-xs text-muted-foreground">ACTIVE LISTINGS</div>
                <div className="font-terminal text-accent text-lg">
                  {mockBusinessData.listings.length}
                </div>
              </div>
              
              <div className="border border-border rounded p-4 text-center">
                <Percent className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="font-code text-xs text-muted-foreground">GROWTH</div>
                <div className="font-terminal text-primary text-lg">
                  +{mockBusinessData.performance.monthlyGrowth}%
                </div>
              </div>
              
              <div className="border border-border rounded p-4 text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="font-code text-xs text-muted-foreground">RETENTION</div>
                <div className="font-terminal text-accent text-lg">
                  {mockBusinessData.performance.customerRetention}%
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-border rounded p-4">
                <div className="font-terminal text-primary mb-4">QUICK ACTIONS</div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setActiveTab('listings')}
                    className="terminal-button w-full justify-start"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Listing
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('offers')}
                    className="terminal-button w-full justify-start bg-accent hover:bg-accent/80"
                    size="sm"
                  >
                    <Percent className="w-4 h-4 mr-2" />
                    Create New Offer
                  </Button>
                </div>
              </div>
              
              <div className="border border-border rounded p-4">
                <div className="font-terminal text-accent mb-4">WALLET INFO</div>
                <div className="space-y-2 font-code text-sm">
                  <div>BALANCE: <span className="text-primary">{balance} HBAR</span></div>
                  <div>ACCOUNT: <span className="text-muted-foreground">{accountId}</span></div>
                  <div>STATUS: <span className="text-primary">VERIFIED BUSINESS</span></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Listing */}
              <div>
                <div className="font-terminal text-accent mb-4">CREATE NEW LISTING</div>
                <div className="space-y-4">
                  <Input
                    placeholder="Listing title"
                    value={newListing.title}
                    onChange={(e) => setNewListing({...newListing, title: e.target.value})}
                    className="terminal-input"
                  />
                  <Textarea
                    placeholder="Listing description"
                    value={newListing.description}
                    onChange={(e) => setNewListing({...newListing, description: e.target.value})}
                    className="terminal-input"
                  />
                  <div className="flex gap-4">
                    <Input
                      placeholder="Price (HBAR)"
                      type="number"
                      value={newListing.price}
                      onChange={(e) => setNewListing({...newListing, price: e.target.value})}
                      className="terminal-input"
                    />
                    <select 
                      value={newListing.category}
                      onChange={(e) => setNewListing({...newListing, category: e.target.value})}
                      className="terminal-input"
                    >
                      <option value="Products">Products</option>
                      <option value="Services">Services</option>
                      <option value="Digital">Digital</option>
                    </select>
                  </div>
                  <Button 
                    onClick={handleCreateListing}
                    className="terminal-button w-full"
                    disabled={!newListing.title || !newListing.price}
                  >
                    CREATE LISTING
                  </Button>
                </div>
              </div>

              {/* Active Listings */}
              <div>
                <div className="font-terminal text-accent mb-4">ACTIVE LISTINGS</div>
                <div className="space-y-3">
                  {mockBusinessData.listings.map((listing) => (
                    <div key={listing.id} className="border border-border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-code font-medium">{listing.title}</div>
                        <Badge variant="secondary" className="font-code text-xs">
                          {listing.category}
                        </Badge>
                      </div>
                      <div className="font-code text-sm text-primary mb-2">
                        {listing.price} HBAR
                      </div>
                      <div className="flex justify-between text-xs font-code text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {listing.views} views
                        </span>
                        <span>{listing.sales} sales</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="offers" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create New Offer */}
              <div>
                <div className="font-terminal text-accent mb-4">CREATE NEW OFFER</div>
                <div className="space-y-4">
                  <Input
                    placeholder="Offer title"
                    value={newOffer.title}
                    onChange={(e) => setNewOffer({...newOffer, title: e.target.value})}
                    className="terminal-input"
                  />
                  <Textarea
                    placeholder="Offer description"
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                    className="terminal-input"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Discount %"
                      type="number"
                      value={newOffer.discount}
                      onChange={(e) => setNewOffer({...newOffer, discount: e.target.value})}
                      className="terminal-input"
                    />
                    <Input
                      placeholder="Max claims"
                      type="number"
                      value={newOffer.maxClaims}
                      onChange={(e) => setNewOffer({...newOffer, maxClaims: e.target.value})}
                      className="terminal-input"
                    />
                  </div>
                  <Input
                    placeholder="Valid until"
                    type="date"
                    value={newOffer.validUntil}
                    onChange={(e) => setNewOffer({...newOffer, validUntil: e.target.value})}
                    className="terminal-input"
                  />
                  <Button 
                    onClick={handleCreateOffer}
                    className="terminal-button w-full"
                    disabled={!newOffer.title || !newOffer.discount}
                  >
                    CREATE OFFER
                  </Button>
                </div>
              </div>

              {/* Active Offers */}
              <div>
                <div className="font-terminal text-accent mb-4">ACTIVE OFFERS</div>
                <div className="space-y-3">
                  {mockBusinessData.offers.map((offer) => (
                    <div key={offer.id} className="border border-border rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-code font-medium">{offer.title}</div>
                        <Badge className="font-code text-xs">
                          {offer.discount}% OFF
                        </Badge>
                      </div>
                      <div className="font-code text-sm text-muted-foreground mb-2">
                        Claims: {offer.claimed}/{offer.maxClaims}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 mb-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{width: `${(offer.claimed / offer.maxClaims) * 100}%`}}
                        />
                      </div>
                      <div className="flex justify-between text-xs font-code text-muted-foreground">
                        <span>Valid until {new Date(offer.validUntil).toLocaleDateString()}</span>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <Edit3 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-primary mx-auto mb-4" />
              <div className="font-terminal text-accent text-xl mb-4">
                ANALYTICS.EXE
              </div>
              <div className="font-code text-muted-foreground mb-6 max-w-2xl mx-auto">
                Advanced analytics and performance insights coming in Phase 2.
                Track customer engagement, conversion rates, and revenue optimization.
              </div>
              <Button disabled className="font-code">
                COMING SOON
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </WindowPanel>
    </div>
  );
};

export default BusinessDashboard;