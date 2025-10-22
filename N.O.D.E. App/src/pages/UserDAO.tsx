
import React, { useState, useMemo } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { InfoTrigger } from '@/components/features/info-trigger';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

// Mock Data for UserDAO
const mockDAOData = {
  overview: {
    members: 1234,
    assetsOwned: 42,
    tvl: '$5.6M',
    proposalsVoted: 89,
  },
  marketplace: [
    {
      id: 1,
      name: 'Community Solar Generator',
      description: 'A solar generator to provide backup power to the local market, ensuring uninterrupted service during outages.',
      raised: 75,
      daysLeft: 12,
      totalValue: '20,000 HBAR',
      expectedReturn: '5% APY',
    },
    {
      id: 2,
      name: 'Public Art Installation',
      description: 'A beautiful mural to be painted by a local artist in the town square, fostering community pride.',
      raised: 40,
      daysLeft: 30,
      totalValue: '10,000 HBAR',
      expectedReturn: 'N/A (Community Good)',
    },
  ],
  governance: {
    activeProposals: [
      {
        id: 101,
        title: 'Purchase Backup Generator for Local Market',
        status: 'Voting Open',
        closesIn: '3 days',
        votes: { yes: 82, no: 15, abstain: 3 },
        description: 'This proposal is to approve the purchase of a 50kW backup generator for the main community market. This will ensure that vendors can continue to operate during power failures, which have become more frequent in the last year. The total cost is estimated at 15,000 HBAR.',
      },
    ],
  },
  portfolio: {
    totalValue: '$1,200',
    votingPower: 1200,
    contributions: [
      {
        name: 'Community Solar Generator',
        ownership: '0.5%',
        value: '$1,200',
      },
    ],
  },
};

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border-2 border-black p-4 text-center bg-white">
    <div className="text-3xl font-bold text-black">{value}</div>
    <div className="text-sm uppercase tracking-wider text-gray-500">{label}</div>
  </div>
);

const DAOOverviewHeader: React.FC<{ onJoin: () => void; }> = ({ onJoin }) => (
  <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">COMMUNITY <span className="text-glow">DAO</span></h1>
      <p className="text-2xl mt-2 text-gray-500">// Own Assets Together, Build the Future Collectively</p>
      {/*<div className="flex justify-center mt-4">*/}
      {/*    <InfoTrigger title="Community DAO" description="The N.O.D.E. DAO allows members to collectively own assets and govern community projects. All decisions are made through a transparent, on-chain voting process."/>*/}
      {/*</div>*/}
      <div className="flex justify-center gap-4 mt-6">
        <button className="btn-pixel" onClick={onJoin}>Join DAO & Contribute</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
        <MetricBadge label="Total Members" value={mockDAOData.overview.members} />
        <MetricBadge label="Assets Owned" value={mockDAOData.overview.assetsOwned} />
        <MetricBadge label="Total Value Locked" value={mockDAOData.overview.tvl} />
        <MetricBadge label="Proposals Voted" value={mockDAOData.overview.proposalsVoted} />
      </div>
  </div>
);

const AssetCard: React.FC<{ asset: any; onInvest: (asset: any) => void }> = ({ asset, onInvest }) => (
    <div className="pixel-card p-4 flex flex-col justify-between">
        <h4 className="font-terminal text-xl font-bold text-center mb-4 text-black">{asset.name}</h4>
        <p className="font-code text-sm text-gray-600 mb-4 flex-grow">{asset.description}</p>
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-muted-foreground">Raised</span>
                <span className="text-sm font-medium text-primary">{asset.raised}%</span>
            </div>
            <Progress value={asset.raised} className="w-full" />
        </div>
        <div className="flex justify-between items-center text-sm font-code text-gray-500 mb-4">
            <span>{asset.daysLeft} days left</span>
            <span>{asset.totalValue}</span>
        </div>
        <button className="btn-pixel w-full" onClick={() => onInvest(asset)}>View & Invest</button>
    </div>
);

const AssetMarketplace: React.FC<{ onInvest: (asset: any) => void }> = ({ onInvest }) => (
    <div className="pt-2">
        <div className="grid md:grid-cols-2 gap-6">
            {mockDAOData.marketplace.map(asset => (
                <AssetCard key={asset.id} asset={asset} onInvest={onInvest} />
            ))}
        </div>
    </div>
);

const ProposalCard: React.FC<{ proposal: any; onVote: (proposal: any) => void; }> = ({ proposal, onVote }) => (
    <div className="p-3 border-2 border-dashed border-black/20 rounded-lg">
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-terminal text-lg text-black font-bold">{proposal.title}</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-yellow-200 text-yellow-800`}>
                {proposal.status}
            </span>
        </div>
        <div className="space-y-2 my-3">
            <div className="flex justify-between text-sm font-code">
                <span className="text-green-500">Yes: {proposal.votes.yes}%</span>
                <span className="text-red-500">No: {proposal.votes.no}%</span>
                <span className="text-gray-500">Abstain: {proposal.votes.abstain}%</span>
            </div>
            <Progress value={proposal.votes.yes} />
        </div>
        <div className="flex items-center justify-between">
            <div className="text-xs font-code text-gray-500">
                <span>Closes in {proposal.closesIn}</span>
            </div>
            <button className="btn-pixel !py-1 !px-3 text-sm" onClick={() => onVote(proposal)}>
                Vote Now
            </button>
        </div>
    </div>
);

const Governance: React.FC<{ onVote: (p: any) => void; onCreateProposal: () => void; }> = ({ onVote, onCreateProposal }) => (
    <div className="space-y-4">
        {mockDAOData.governance.activeProposals.map(p => (
            <ProposalCard key={p.id} proposal={p} onVote={onVote} />
        ))}
        <button onClick={onCreateProposal} className="btn-pixel w-full">Create Proposal</button>
    </div>
);

const MyPortfolio: React.FC = () => (
    <div className="space-y-4">
        <MetricBadge label="Total Value" value={mockDAOData.portfolio.totalValue} />
        <MetricBadge label="Voting Power" value={mockDAOData.portfolio.votingPower} />
        <div className="pixel-card-sm p-3">
            <h4 className="font-terminal text-lg text-black mb-2">My Contributions</h4>
            <div className="space-y-2">
                {mockDAOData.portfolio.contributions.map((c, i) => (
                    <div key={i} className="flex justify-between items-center font-code text-sm">
                        <div>
                            <p className="font-semibold text-black">{c.name}</p>
                            <p className="text-xs text-gray-500">Ownership: {c.ownership}</p>
                        </div>
                        <p className="font-bold text-primary text-glow">{c.value}</p>
                    </div>
                ))}
            </div>
        </div>
        <button className="btn-pixel w-full">Claim Rewards</button>
    </div>
);

// Dialogs
const StyledDialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <DialogContent className={`font-terminal window-panel bg-background ${className}`}>
        {children}
    </DialogContent>
);

const InvestDialog: React.FC<{ asset: any; open: boolean; onClose: () => void }> = ({ asset, open, onClose }) => {
    if (!asset) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">{`Invest in ${asset.name}`}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="font-code">{asset.description}</DialogDescription>
                <div className="space-y-4 py-4 font-code">
                    <p><strong>Total Value:</strong> {asset.totalValue}</p>
                    <p><strong>Expected Return:</strong> {asset.expectedReturn}</p>
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="font-code">Investment Amount (HBAR)</Label>
                        <Input id="amount" type="number" placeholder="e.g., 500" className="font-code" />
                    </div>
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Cancel</button>
                    <button className="btn-pixel" onClick={() => { alert('Investment logic goes here!'); onClose(); }}>Confirm Investment</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const VoteDialog: React.FC<{ proposal: any; open: boolean; onClose: () => void; }> = ({ proposal, open, onClose }) => {
    if (!proposal) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Vote on: {proposal.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="font-code">{proposal.description}</DialogDescription>
                <DialogFooter className="grid grid-cols-3 gap-4 mt-4">
                    <button className="btn-pixel border-green-500 text-green-500 hover:bg-green-500/20" onClick={() => { alert('Voted For!'); onClose(); }}>Vote For</button>
                    <button className="btn-pixel border-red-500 text-red-500 hover:bg-red-500/20" onClick={() => { alert('Voted Against!'); onClose(); }}>Vote Against</button>
                    <button className="btn-pixel" onClick={() => { alert('Voted Abstain!'); onClose(); }}>Abstain</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const CreateProposalDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Create a Governance Proposal</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4 font-code">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-title" className="text-right font-code">Title</Label>
                        <Input id="proposal-title" placeholder="e.g., Fund a New Community Garden" className="col-span-3 font-code" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-details" className="text-right font-code">Details</Label>
                        <Textarea id="proposal-details" placeholder="Describe your proposal in detail..." className="col-span-3 min-h-[100px] font-code" />
                    </div>
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Cancel</button>
                    <button className="btn-pixel" onClick={() => { alert('Proposal Submitted!'); onClose(); }}>Submit Proposal</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};


const UserDAO: React.FC = () => {
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [selectedProposal, setSelectedProposal] = useState<any>(null);
    const [isProposalDialogOpen, setProposalDialogOpen] = useState(false);

    return (
        <div className="space-y-8 py-8 px-4 mt-10">
            <DAOOverviewHeader onJoin={() => alert('Joining DAO...')} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <WindowPanel title="Community Asset Marketplace">
                        <AssetMarketplace onInvest={setSelectedAsset} />
                    </WindowPanel>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <WindowPanel title="My Portfolio">
                        <MyPortfolio />
                    </WindowPanel>
                    <WindowPanel title="DAO Governance">
                        <Governance onVote={setSelectedProposal} onCreateProposal={() => setProposalDialogOpen(true)} />
                    </WindowPanel>
                </div>
            </div>

            {/* Dialogs */}
            <InvestDialog asset={selectedAsset} open={!!selectedAsset} onClose={() => setSelectedAsset(null)} />
            <VoteDialog proposal={selectedProposal} open={!!selectedProposal} onClose={() => setSelectedProposal(null)} />
            <CreateProposalDialog open={isProposalDialogOpen} onClose={() => setProposalDialogOpen(false)} />
        </div>
    );
};

export default UserDAO;
