
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Governance: React.FC = () => {
  // Placeholder data
  const proposal = {
    title: 'Purchase Backup Generator for Local Market',
    submittedBy: '0x123...abc',
    purpose: 'This proposal is to approve the purchase of a 5kW backup generator for the local market to ensure business continuity during power outages. The funds will be used to cover the cost of the generator, installation, and initial fuel supply.',
    votingPower: 42,
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Governance & Voting</h2>

      <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Voting Panel</CardTitle>
          <p className="text-sm text-muted-foreground">Your Voting Power: <span className="font-bold text-purple-400">{proposal.votingPower} Votes</span></p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">{proposal.title}</h3>
            <p className="text-sm text-muted-foreground">Submitted by: {proposal.submittedBy}</p>
          </div>
          <p>{proposal.purpose}</p>
          
          <div className="flex justify-center items-center space-x-4 p-4 rounded-lg bg-gray-800/50">
            <Button className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">Vote Yes</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-lg px-8 py-4">Vote No</Button>
            <Button variant="outline" className="text-lg px-8 py-4">Abstain</Button>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Live Results</h4>
            {/* Replace with actual chart component */}
            <div className="w-full bg-gray-700 rounded-lg p-4">
              <p className="text-center text-muted-foreground">[Pie Chart Visualization Here]</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Transparency & Trust</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-md">
              <span role="img" aria-label="badge">🛡️</span>
              <p>Smart Contract Audits: <span className="font-bold text-green-400">Passed</span></p>
            </div>
            <div className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-md">
              <span role="img" aria-label="nft">📄</span>
              <p>On-Chain Proof of Ownership (NFTs)</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Live Transactions</h4>
              <div className="text-xs space-y-2 text-muted-foreground h-24 overflow-y-auto">
                <p>> 0xabc...def funded 2.5 ETH to Community Solar Generator</p>
                <p>> Proposal #45 passed</p>
                <p>> 0x123...xyz claimed 0.1 ETH yield</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>DAO Treasury</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">[Treasury Breakdown Pie Chart Here]</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Governance;
