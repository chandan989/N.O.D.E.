import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Button } from '@/components/ui/button';

const Governance: React.FC = () => {
  return (
    <div className="space-y-6">
      <WindowPanel title="DAO Governance System">
        <div className="text-center py-12">
          <div className="font-terminal text-accent text-2xl mb-4">
            GOVERNANCE.BAT
          </div>
          <div className="font-code text-muted-foreground mb-8 max-w-2xl mx-auto">
            The Decentralized Autonomous Organization governance system is currently
            under development. This module will enable community-driven decision making
            for protocol upgrades and neighborhood policies.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="border border-border rounded p-6">
              <div className="font-terminal text-primary mb-2">VOTING RIGHTS</div>
              <div className="font-code text-sm text-muted-foreground">
                Token-based voting system for protocol decisions
              </div>
            </div>
            <div className="border border-border rounded p-6">
              <div className="font-terminal text-primary mb-2">PROPOSALS</div>
              <div className="font-code text-sm text-muted-foreground">
                Community-submitted governance proposals
              </div>
            </div>
            <div className="border border-border rounded p-6">
              <div className="font-terminal text-primary mb-2">TREASURY</div>
              <div className="font-code text-sm text-muted-foreground">
                Collective fund management and allocation
              </div>
            </div>
          </div>

          <div className="bg-accent/10 border border-accent rounded p-6 mb-8">
            <div className="font-terminal text-accent mb-2">DEVELOPMENT ROADMAP</div>
            <div className="font-code text-sm text-left space-y-2">
              <div>&gt; Phase 2 (Q1-Q2 2026): Basic voting mechanisms</div>
              <div>&gt; Phase 3 (Q3-Q4 2026): Full DAO implementation</div>
              <div>&gt; Future: Cross-neighborhood governance protocols</div>
            </div>
          </div>

          <Button disabled className="font-code">
            COMING SOON - PHASE 2
          </Button>
        </div>
      </WindowPanel>
    </div>
  );
};

export default Governance;