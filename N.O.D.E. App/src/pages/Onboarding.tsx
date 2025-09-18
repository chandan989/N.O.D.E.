import React, { useState } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Onboarding: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    businessName: '',
    contactEmail: '',
    location: '',
    businessType: '',
    description: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // For Phase 1, just log to console
    console.log('Business Node Registration:', formData);
    toast({
      title: "Registration Submitted",
      description: "Your business node application has been logged for review.",
    });
    
    // Reset form
    setFormData({
      businessName: '',
      contactEmail: '',
      location: '',
      businessType: '',
      description: '',
    });
  };

  return (
    <div className="space-y-6">
      <WindowPanel title="Business Node Registration">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="font-terminal text-accent text-center mb-2">
              WELCOME TO N.O.D.E. PROTOCOL
            </div>
            <div className="font-code text-sm text-muted-foreground text-center">
              Register your business to join the neighborhood decentralized economy.
              Complete the form below to begin the onboarding process.
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-code text-sm text-muted-foreground mb-2">
                  BUSINESS NAME *
                </label>
                <Input
                  type="text"
                  placeholder="Enter business name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  className="terminal-input"
                />
              </div>
              <div>
                <label className="block font-code text-sm text-muted-foreground mb-2">
                  CONTACT EMAIL *
                </label>
                <Input
                  type="email"
                  placeholder="business@example.com"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="terminal-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-code text-sm text-muted-foreground mb-2">
                  LOCATION
                </label>
                <Input
                  type="text"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="terminal-input"
                />
              </div>
              <div>
                <label className="block font-code text-sm text-muted-foreground mb-2">
                  BUSINESS TYPE
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Restaurant, Retail, Service"
                  value={formData.businessType}
                  onChange={(e) => handleInputChange('businessType', e.target.value)}
                  className="terminal-input"
                />
              </div>
            </div>

            <div>
              <label className="block font-code text-sm text-muted-foreground mb-2">
                BUSINESS DESCRIPTION
              </label>
              <Textarea
                placeholder="Describe your business and how you'd like to participate in the N.O.D.E. Protocol..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="terminal-input min-h-[100px]"
              />
            </div>

            <div className="border border-border rounded p-4 bg-primary/5">
              <div className="font-terminal text-accent mb-2">PHASE 1 NOTICE</div>
              <div className="font-code text-sm text-muted-foreground">
                Currently in Genesis phase. Registration data will be logged for future
                implementation of automated onboarding and DAO governance systems.
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="terminal-button w-full"
              disabled={!formData.businessName || !formData.contactEmail}
            >
              SUBMIT REGISTRATION
            </Button>
          </div>
        </div>
      </WindowPanel>
    </div>
  );
};

export default Onboarding;