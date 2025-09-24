import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock Data (remains the same)
const mockData = {
  fundOverview: {
    totalMembers: 2048,
    totalValueLocked: '1.2M HBAR',
    averageReturn: '5%',
    projectsFunded: 42,
  },
  user: {
      walletBalance: '15,000 HBAR',
      investedBalance: '5,000 HBAR'
  },
  fundInfo: {
      title: 'How the N.O.D.E. Fund Works',
      content: 'The N.O.D.E. (Network of Decentralized Equity) Fund is a community-governed investment vehicle built on the Hedera Hashgraph. It allows members to pool their HBAR to invest in community-focused projects, such as small businesses and green energy initiatives. All returns are distributed proportionally to the members based on their investment. The entire process is transparent, with all transactions and governance decisions recorded on-chain.'
  },
  fundPerformance: {
    currentFundSize: '1,250,000 HBAR',
    expectedYield: '5.2%',
    actualYield: '5.1%',
    tvlHistory: [
      { name: 'Jan', value: 500000 },
      { name: 'Feb', value: 650000 },
      { name: 'Mar', value: 800000 },
      { name: 'Apr', value: 1000000 },
      { name: 'May', value: 1200000 },
    ],
    yieldHistory: [
      { name: 'Jan', value: 4.8 },
      { name: 'Feb', value: 5.0 },
      { name: 'Mar', value: 5.1 },
      { name: 'Apr', value: 5.2 },
      { name: 'May', value: 5.1 },
    ],
    distribution: [
      { name: 'Small Businesses', value: 40 },
      { name: 'Community Projects', value: 35 },
      { name: 'Reserves', value: 25 },
    ],
  },
  investmentPools: [
    {
      name: 'Small Business Lending Pool',
      returns: '~6%',
      risk: 'Medium',
      size: '500K HBAR',
      members: 800,
      apy: 0.06,
    },
    {
      name: 'Green Energy Pool',
      returns: '~4.5%',
      risk: 'Low',
      size: '300K HBAR',
      members: 500,
      apy: 0.045,
    },
    {
      name: 'General Community Pool',
      returns: '~5%',
      risk: 'Low',
      size: '400K HBAR',
      members: 1200,
      apy: 0.05,
    },
  ],
  communityStats: {
    totalMembers: 2048,
    newMembers: 128,
    leaderboard: [
      { avatar: 'AV1', contribution: '50K HBAR' },
      { avatar: 'AV2', contribution: '45K HBAR' },
      { avatar: 'AV3', contribution: '42K HBAR' },
    ],
    goal: 2000000,
    funded: 1200000,
    testimonials: [
      'This fund helped my bakery get a new oven!',
      'Proud to be earning and supporting local projects.',
    ],
  },
  news: [
    { title: 'Local Gym Renovated with Fund Support', content: 'The downtown gym has new equipment thanks to a loan from the N.O.D.E. fund. The renovation includes a new weight room and cardio machines, all funded by community investments. The gym owner, a long-time resident, expressed gratitude for the fund\'s support.' },
    { title: 'How Community Lending Works', content: 'Learn the basics of our blockchain-based lending model and how it benefits everyone. We connect investors with local projects, creating a cycle of growth and return. All transactions are transparent and recorded on the Hedera Hashgraph.' },
  ],
  proposals: [
      {
          id: 1,
          title: 'Renewable Energy for Schools',
          description: 'This proposal aims to fund the installation of solar panels on three local schools, reducing their carbon footprint and energy costs.',
          requestedAmount: '150,000 HBAR',
          recipient: '0.0.987654',
          status: 'Active',
          recipientInfo: {
              name: 'Local Schools Foundation',
              description: 'A non-profit dedicated to improving educational infrastructure in the community.',
              verified: true,
              pastProjects: 3
          }
      },
      {
          id: 2,
          title: 'Affordable Housing Initiative',
          description: 'A proposal to allocate funds towards a new affordable housing project in the city center, in partnership with a local non-profit.',
          requestedAmount: '250,000 HBAR',
          recipient: '0.0.112233',
          status: 'Active',
          recipientInfo: {
              name: 'City Housing Partners',
              description: 'A public-private partnership focused on developing affordable housing solutions.',
              verified: true,
              pastProjects: 5
          }
      }
  ]
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`window-panel ${className}`}>
        <div className="window-panel-title">{title}</div>
        <div className="pt-2">
            {children}
        </div>
    </div>
);

const FundOverview: React.FC<{ onDeposit: () => void; onWithdraw: () => void; onLearnMore: () => void; }> = ({ onDeposit, onWithdraw, onLearnMore }) => (
  <div className="text-center py-12 window-panel">
    <h1 className="text-4xl font-terminal text-glow">Invest in Your Community, Earn While You Help</h1>
    <p className="text-muted-foreground mt-2 font-code">Transparent, blockchain-based lending fund for local growth.</p>
    <div className="flex justify-center gap-4 mt-6">
      <button className="btn-retro" onClick={onDeposit}>Deposit HBAR</button>
      <button className="btn-retro" onClick={onWithdraw}>Withdraw</button>
      <button className="btn-retro" onClick={onLearnMore}>Learn More</button>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
      <MetricBadge label="Total Members" value={mockData.fundOverview.totalMembers} />
      <MetricBadge label="Total Value Locked" value={mockData.fundOverview.totalValueLocked} />
      <MetricBadge label="Average Return" value={mockData.fundOverview.averageReturn} />
      <MetricBadge label="Projects Funded" value={mockData.fundOverview.projectsFunded} />
    </div>
  </div>
);

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border border-border/50 rounded p-4 bg-black/20">
    <div className="font-terminal text-2xl text-primary text-glow">{value}</div>
    <div className="font-code text-sm text-muted-foreground uppercase">{label}</div>
  </div>
);

const FundPerformanceDashboard: React.FC = () => (
    <Section title="Fund Performance">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Total Value Locked (TVL)</h3>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.fundPerformance.tvlHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}/>
                    <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }}/>
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Yield / APY</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData.fundPerformance.yieldHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                        <YAxis stroke="hsl(var(--muted-foreground))" domain={['dataMin - 0.1', 'dataMax + 0.1']} tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}/>
                        <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }}/>
                        <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <MetricBadge label="Current Fund Size" value={mockData.fundPerformance.currentFundSize} />
                <MetricBadge label="Expected Yield" value={mockData.fundPerformance.expectedYield} />
                <MetricBadge label="Actual Yield" value={mockData.fundPerformance.actualYield} />
            </div>
            <div className="md:col-span-2">
                <h3 className="font-terminal text-lg text-glow mb-2 text-center">Current Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={mockData.fundPerformance.distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="hsl(var(--primary))"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            stroke="hsl(var(--background))"
                        >
                            {mockData.fundPerformance.distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}/>
                        <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    </Section>
);

const InvestmentOptions: React.FC<{ onInvest: (pool: any) => void }> = ({ onInvest }) => (
    <Section title="Investment Options">
        <div className="grid md:grid-cols-3 gap-4">
        {mockData.investmentPools.map(pool => (
            <div key={pool.name} className="border border-border/50 rounded p-4 bg-black/20 flex flex-col">
                <h4 className="font-terminal text-xl text-glow">{pool.name}</h4>
                <div className="font-code text-sm text-muted-foreground flex-grow my-4 space-y-1">
                    <p>RETURNS: {pool.returns}</p>
                    <p>RISK: {pool.risk}</p>
                    <p>SIZE: {pool.size}</p>
                    <p>MEMBERS: {pool.members}</p>
                </div>
                <button className="btn-retro w-full mt-auto" onClick={() => onInvest(pool)}>Invest Now</button>
            </div>
        ))}
        </div>
    </Section>
);

const MemberAndCommunityStats: React.FC = () => (
    <Section title="Community Stats">
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <MetricBadge label="Total Members" value={mockData.communityStats.totalMembers} />
                <MetricBadge label="New Members" value={mockData.communityStats.newMembers} />
            </div>
            <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Leaderboard</h3>
                <div className="flex space-x-4">
                    {mockData.communityStats.leaderboard.map((p, i) => (
                        <div key={i} className="text-center font-code">
                            <div className="w-16 h-16 border-2 border-primary rounded-full flex items-center justify-center font-bold mb-1 bg-primary/10 text-glow">{p.avatar}</div>
                            <p className="text-sm">{p.contribution}</p>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Community Goal: {mockData.communityStats.goal / 1000000}M HBAR</h3>
                <Progress value={(mockData.communityStats.funded / mockData.communityStats.goal) * 100} className="w-full" />
                <p className="text-sm text-muted-foreground mt-1 text-right font-code">{((mockData.communityStats.funded / mockData.communityStats.goal) * 100).toFixed(0)}% Funded</p>
            </div>
            <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Testimonials</h3>
                <div className="space-y-2 font-code">
                {mockData.communityStats.testimonials.map((t, i) => (
                    <blockquote key={i} className="border-l-2 border-primary pl-4 italic text-muted-foreground">"{t}"</blockquote>
                ))}
                </div>
            </div>
        </div>
    </Section>
);

const TransparencySection: React.FC = () => (
    <Section title="Transparency">
        <div className="space-y-4 font-code">
            <button className="btn-retro btn-sm">View On-Chain Transactions</button>
            <div>
                <p className="text-sm">Smart Contract: 0.0.123456789</p>
                <p className="text-sm text-green-400">✓ Audit Passed</p>
            </div>
            <div className="space-y-2">
                <details className="bg-black/20 p-2 rounded border border-border/50">
                    <summary className="cursor-pointer font-terminal">How is my investment secured?</summary>
                    <p className="mt-2 text-sm text-muted-foreground">Your investment is secured by the smart contract and diversified across multiple community projects...</p>
                </details>
                 <details className="bg-black/20 p-2 rounded border border-border/50">
                    <summary className="cursor-pointer font-terminal">How do I withdraw my HBAR?</summary>
                    <p className="mt-2 text-sm text-muted-foreground">You can withdraw your HBAR at any time through the dashboard, subject to the fund's withdrawal policy...</p>
                </details>
            </div>
        </div>
    </Section>
);

const GovernanceSection: React.FC<{ onSubmitProposal: () => void; onVote: (proposal: any) => void; votes: { [key: number]: string } }> = ({ onSubmitProposal, onVote, votes }) => (
    <Section title="Governance">
        <div className="space-y-4">
            <div>
                <h3 className="font-terminal text-lg text-glow">Active Proposals</h3>
                <div className="space-y-2 mt-2">
                    {mockData.proposals.map(p => (
                        <button key={p.id} className="btn-retro w-full text-left justify-between" onClick={() => onVote(p)} disabled={!!votes[p.id]}>
                            <span>{p.title}</span>
                            {votes[p.id] && <span className="text-primary text-glow">Voted: {votes[p.id]}</span>}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-terminal text-lg text-glow">Recent Results</h3>
                <ul className="list-disc list-inside text-muted-foreground text-sm font-code">
                    <li>Proposal #102: Fund Local Art Festival - <span className="text-green-400">Passed</span></li>
                    <li>Proposal #101: Increase Reserve Allocation - <span className="text-red-400">Failed</span></li>
                </ul>
            </div>
            <button onClick={onSubmitProposal} className="btn-retro">Submit a Proposal</button>
        </div>
    </Section>
);

const NewsAndUpdates: React.FC<{ onReadMore: (news: any) => void }> = ({ onReadMore }) => (
    <Section title="News & Updates">
        <div className="space-y-4">
            {mockData.news.map((item, index) => (
                <div key={index} className="border-b border-border/50 pb-2">
                    <h4 className="font-terminal text-lg text-glow">{item.title}</h4>
                    <p className="text-sm text-muted-foreground truncate font-code">{item.content}</p>
                    <button className="text-primary hover:text-glow font-bold font-terminal" onClick={() => onReadMore(item)}>{'Read More >>'}</button>
                </div>
            ))}
        </div>
    </Section>
);

const Footer: React.FC = () => (
    <footer className="text-center text-muted-foreground text-sm space-y-2 py-8 font-terminal">
        <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-glow hover:bg-primary/10 p-1">About N.O.D.E. Fund</a>
            <a href="#" className="hover:text-glow hover:bg-primary/10 p-1">Legal & Compliance</a>
            <a href="#" className="hover:text-glow hover:bg-primary/10 p-1">Contact & Support</a>
        </div>
    </footer>
);

const StyledDialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <DialogContent className={`font-terminal window-panel bg-background ${className}`}>
        {children}
    </DialogContent>
);

const InvestDialog: React.FC<{ pool: any; open: boolean; onClose: () => void }> = ({ pool, open, onClose }) => {
    const [amount, setAmount] = useState('');

    const yearlyReturn = useMemo(() => {
        const numericAmount = parseFloat(amount);
        if (!numericAmount || !pool) return 0;
        return (numericAmount * pool.apy).toFixed(2);
    }, [amount, pool]);

    if (!pool) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">{`Invest in ${pool.name}`}</DialogTitle>
                    <DialogDescription className="font-code">
                        <p>EXPECTED RETURN: {pool.returns}</p>
                        <p>RISK LEVEL: {pool.risk}</p>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 font-code">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Investment Amount (HBAR)</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1000" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Based on the amount, you can expect:</p>
                        <p className="text-glow">~{yearlyReturn} HBAR in yearly returns.</p>
                    </div>
                </div>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Cancel</button>
                    <button className="btn-retro" onClick={() => { /* Handle investment logic */ alert(`Investing ${amount} HBAR in ${pool.name}`); onClose(); }}>Confirm Investment</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const ProposalDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [proposalType, setProposalType] = useState('');

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Submit a Governance Proposal</DialogTitle>
                    <DialogDescription className="font-code">Your proposal will be reviewed and voted on by the community. Ensure all details are clear and concise.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 font-code">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-title" className="text-right">Title</Label>
                        <Input id="proposal-title" placeholder="e.g., Fund a New Community Garden" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-type" className="text-right">Type</Label>
                        <Select onValueChange={setProposalType}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a proposal type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="new-pool">New Investment Pool</SelectItem>
                                <SelectItem value="grant">Community Project Grant</SelectItem>
                                <SelectItem value="param-change">Parameter Change</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {proposalType === 'grant' && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="requested-amount" className="text-right">Requested Amount (HBAR)</Label>
                                <Input id="requested-amount" type="number" placeholder="e.g., 50000" className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="recipient-address" className="text-right">Recipient Address</Label>
                                <Input id="recipient-address" placeholder="0.0.xxxxxx" className="col-span-3" />
                            </div>
                        </>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-link" className="text-right">Supporting Link</Label>
                        <Input id="proposal-link" placeholder="https://your-document.link" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-details" className="text-right">Details</Label>
                        <Textarea id="proposal-details" placeholder="Describe your proposal in detail..." className="col-span-3 min-h-[100px]" />
                    </div>
                </div>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Cancel</button>
                    <button className="btn-retro" onClick={() => { /* Handle submission logic */ alert('Proposal Submitted!'); onClose(); }}>Submit Proposal</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const NewsDialog: React.FC<{ news: any; open: boolean; onClose: () => void }> = ({ news, open, onClose }) => {
    if (!news) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">{news.title}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground whitespace-pre-wrap font-code">{news.content}</p>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Close</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const RecipientInfoDialog: React.FC<{ info: any; open: boolean; onClose: () => void }> = ({ info, open, onClose }) => {
    if (!info) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Recipient Information</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 font-code">
                    <p><strong>Name:</strong> {info.name}</p>
                    <p><strong>Description:</strong> {info.description}</p>
                    <p><strong>Past Projects Funded:</strong> {info.pastProjects}</p>
                    {info.verified && <p className="text-green-400 font-semibold">✓ Verified Recipient</p>}
                </div>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Close</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const VoteDialog: React.FC<{ proposal: any; open: boolean; onClose: () => void; onConfirmVote: (vote: string) => void; onShowRecipientInfo: (info: any) => void }> = ({ proposal, open, onClose, onConfirmVote, onShowRecipientInfo }) => {
    if (!proposal) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Vote on: {proposal.title}</DialogTitle>
                    <DialogDescription className="font-code">{proposal.description}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 font-code">
                    <p><strong>Requested Amount:</strong> {proposal.requestedAmount}</p>
                    <div className="flex items-center gap-2">
                        <strong>Recipient:</strong> {proposal.recipient}
                        <button className="border rounded-full h-6 w-6 text-sm" onClick={() => onShowRecipientInfo(proposal.recipientInfo)}>
                            i
                        </button>
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                    <button className="btn-retro border-red-500 text-red-500 hover:bg-red-500/20 hover:text-red-400" onClick={() => onConfirmVote('Against')}>Vote Against</button>
                    <button className="btn-retro border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-400" onClick={() => onConfirmVote('For')}>Vote For</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const DepositDialog: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Deposit HBAR</DialogTitle>
                    <DialogDescription className="font-code">Your Wallet Balance: {mockData.user.walletBalance}</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 font-code">
                    <Label htmlFor="deposit-amount">Amount to Deposit</Label>
                    <Input id="deposit-amount" type="number" placeholder="e.g., 1000" />
                </div>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Cancel</button>
                    <button className="btn-retro" onClick={onClose}>Confirm Deposit</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const WithdrawDialog: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Withdraw HBAR</DialogTitle>
                    <DialogDescription className="font-code">Your Invested Balance: {mockData.user.investedBalance}</DialogDescription>
                </DialogHeader>
                <div className="space-y-2 font-code">
                    <Label htmlFor="withdraw-amount">Amount to Withdraw</Label>
                    <Input id="withdraw-amount" type="number" placeholder="e.g., 500" />
                </div>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Cancel</button>
                    <button className="btn-retro" onClick={onClose}>Confirm Withdraw</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const LearnMoreDialog: React.FC<{ open: boolean, onClose: () => void }> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">{mockData.fundInfo.title}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground whitespace-pre-wrap font-code">{mockData.fundInfo.content}</p>
                <DialogFooter>
                    <button className="btn-retro" onClick={onClose}>Close</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const UserNodeFund: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [isProposalDialogOpen, setProposalDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [votes, setVotes] = useState<{ [key: number]: string }>({});
  const [recipientInfo, setRecipientInfo] = useState<any>(null);
  const [isDepositOpen, setDepositOpen] = useState(false);
  const [isWithdrawOpen, setWithdrawOpen] = useState(false);
  const [isLearnMoreOpen, setLearnMoreOpen] = useState(false);

  const handleVote = (vote: string) => {
      if(selectedProposal) {
          setVotes(prev => ({...prev, [selectedProposal.id]: vote}));
          setSelectedProposal(null);
      }
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <FundOverview onDeposit={() => setDepositOpen(true)} onWithdraw={() => setWithdrawOpen(true)} onLearnMore={() => setLearnMoreOpen(true)} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <FundPerformanceDashboard />
            <InvestmentOptions onInvest={setSelectedPool} />
            <NewsAndUpdates onReadMore={setSelectedNews} />
        </div>
        <div className="space-y-8">
            <MemberAndCommunityStats />
            <TransparencySection />
            <GovernanceSection onSubmitProposal={() => setProposalDialogOpen(true)} onVote={setSelectedProposal} votes={votes} />
        </div>
      </div>
      <Footer />
      <InvestDialog pool={selectedPool} open={!!selectedPool} onClose={() => setSelectedPool(null)} />
      <ProposalDialog open={isProposalDialogOpen} onClose={() => setProposalDialogOpen(false)} />
      <NewsDialog news={selectedNews} open={!!selectedNews} onClose={() => setSelectedNews(null)} />
      <VoteDialog proposal={selectedProposal} open={!!selectedProposal} onClose={() => setSelectedProposal(null)} onConfirmVote={handleVote} onShowRecipientInfo={setRecipientInfo} />
      <RecipientInfoDialog info={recipientInfo} open={!!recipientInfo} onClose={() => setRecipientInfo(null)} />
      <DepositDialog open={isDepositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawDialog open={isWithdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <LearnMoreDialog open={isLearnMoreOpen} onClose={() => setLearnMoreOpen(false)} />
    </div>
  );
};

export default UserNodeFund;
