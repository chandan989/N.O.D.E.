import React, { useState, useMemo, useEffect } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { InfoTrigger } from '@/components/features/info-trigger';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

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
    { id: 1, title: 'Local Gym Renovated with Fund Support', content: "The downtown gym has new equipment thanks to a loan from the N.O.D.E. fund. The renovation includes a new weight room and cardio machines, all funded by community investments. The gym owner, a long-time resident, expressed gratitude for the fund's support.", image: '/placeholder.svg', source: 'N.O.D.E. Community News' },
    { id: 2, title: 'How Community Lending Works', content: 'Learn the basics of our blockchain-based lending model and how it benefits everyone. We connect investors with local projects, creating a cycle of growth and return. All transactions are transparent and recorded on the Hedera Hashgraph.', image: '/placeholder.svg', source: 'N.O.D.E. Insights' },
  ],
  learning: [
    { id: 1, title: "DeFi Investing 101: A Beginner's Guide", category: 'Basics' },
    { id: 2, title: 'Understanding Smart Contracts on Hedera', category: 'Advanced' },
    { id: 3, title: 'How The N.O.D.E. Fund Governance Works', category: 'Community' },
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
  ],
  transparencyItems: [
    {
      title: 'On-Chain Transactions',
      description: 'All fund activities are recorded on the Hedera Hashgraph for full transparency. View every deposit, withdrawal, and investment in real-time.',
      buttonText: 'View On-Chain Data',
    },
    {
      title: 'Smart Contract Audit',
      description: 'The fund\'s logic is governed by a smart contract audited for security and correctness. Contract: 0.0.123456789',
      buttonText: 'View Audit Report',
    },
    {
      title: 'Governance Records',
      description: 'Review all community proposals, voting results, and implementation details. Your voice shapes the fund.',
      buttonText: 'Explore Governance',
    },
  ]
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Removed Section component

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border-2 border-black p-4 text-center bg-white">
    <div className="text-3xl font-bold text-black">{value}</div>
    <div className="text-sm uppercase tracking-wider text-gray-500">{label}</div>
  </div>
);

const FundOverviewHeader: React.FC<{ onDeposit: () => void; onWithdraw: () => void; onLearnMore: () => void; }> = ({ onDeposit, onWithdraw, onLearnMore }) => (
  <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">N.O.D.E. <span className="text-glow">FUND</span></h1>
      <p className="text-2xl mt-2 text-gray-500">// Invest in Community Projects</p>
      {/*<div className="flex justify-center mt-4">*/}
      {/*    <InfoTrigger title="N.O.D.E. Fund" description="The N.O.D.E. Fund is a community-governed investment vehicle built on the Hedera Hashgraph. It allows members to pool their HBAR to invest in community-focused projects, such as small businesses and green energy initiatives. All returns are distributed proportionally to the members based on their investment. The entire process is transparent, with all transactions and governance decisions recorded on-chain."/>*/}
      {/*</div>*/}
      <div className="flex justify-center gap-4 mt-6">
        <button className="btn-pixel" onClick={onDeposit}>Deposit HBAR</button>
        <button className="btn-pixel" onClick={onWithdraw}>Withdraw</button>
        <button className="btn-pixel" onClick={onLearnMore}>Learn More</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
        <MetricBadge label="Total Members" value={mockData.fundOverview.totalMembers} />
        <MetricBadge label="Total Value Locked" value={mockData.fundOverview.totalValueLocked} />
        <MetricBadge label="Average Return" value={mockData.fundOverview.averageReturn} />
        <MetricBadge label="Projects Funded" value={mockData.fundOverview.projectsFunded} />
      </div>
  </div>
);

const chartConfigTVL = {
  value: {
    label: "TVL (HBAR)",
    color: "hsl(var(--primary))",
  },
};

const chartConfigYield = {
  value: {
    label: "Yield (%)",
    color: "hsl(var(--accent))",
  },
};

const FundPerformanceDashboard: React.FC = () => (
    <div className="pixel-card p-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-terminal text-lg text-black mb-2">Total Value Locked (TVL)</h4>
                <ChartContainer config={chartConfigTVL} className="min-h-[300px] w-full font-sans">
                    <AreaChart accessibilityLayer data={mockData.fundPerformance.tvlHistory} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="fill-black"
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value / 1000}K HBAR`} className="fill-black"/>
                        <Tooltip
                            cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
                        />
                        <defs>
                            <linearGradient id="fillTvl" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfigTVL.value.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartConfigTVL.value.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area dataKey="value" type="natural" fill="url(#fillTvl)" stroke={chartConfigTVL.value.color} strokeWidth={2} stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </div>
            <div>
                <h4 className="font-terminal text-lg text-black mb-2">Yield / APY</h4>
                <ChartContainer config={chartConfigYield} className="min-h-[300px] w-full font-sans">
                    <AreaChart accessibilityLayer data={mockData.fundPerformance.yieldHistory} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="fill-black"
                        />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} className="fill-black"/>
                        <Tooltip
                            cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
                        />
                        <defs>
                            <linearGradient id="fillYield" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfigYield.value.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartConfigYield.value.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area dataKey="value" type="natural" fill="url(#fillYield)" stroke={chartConfigYield.value.color} strokeWidth={2} stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </div>
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <MetricBadge label="Current Fund Size" value={mockData.fundPerformance.currentFundSize} />
                <MetricBadge label="Expected Yield" value={mockData.fundPerformance.expectedYield} />
                <MetricBadge label="Actual Yield" value={mockData.fundPerformance.actualYield} />
            </div>
            <div className="md:col-span-2">
                <h4 className="font-terminal text-lg text-black mb-2 text-center">Current Distribution</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={mockData.fundPerformance.distribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
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
    </div>
);

const InvestmentOptions: React.FC<{ onInvest: (pool: any) => void }> = ({ onInvest }) => (
    <div className="pt-2">
        <div className="grid md:grid-cols-3 gap-6">
        {mockData.investmentPools.map(pool => (
            <div key={pool.name} className="pixel-card p-4 flex flex-col justify-between">
                <h4 className="font-terminal text-xl font-bold text-center mb-4 text-black">{pool.name}</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-center mb-4">
                    <div>
                        <div className="font-bold text-lg text-black">{pool.returns}</div>
                        <div className="text-xs uppercase text-gray-500">Returns</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-black">{pool.risk}</div>
                        <div className="text-xs uppercase text-gray-500">Risk</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-black">{pool.size}</div>
                        <div className="text-xs uppercase text-gray-500">Size</div>
                    </div>
                    <div>
                        <div className="font-bold text-lg text-black">{pool.members}</div>
                        <div className="text-xs uppercase text-gray-500">Members</div>
                    </div>
                </div>
                <button className="btn-pixel w-full" onClick={() => onInvest(pool)}>Invest Now</button>
            </div>
        ))}
        </div>
    </div>
);

const MemberAndCommunityStats: React.FC<{
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    isExpandable?: boolean;
    onViewLeaderboard: () => void;
}> = ({ isExpanded, onToggleExpand, isExpandable, onViewLeaderboard }) => {
    const contributorsToShow = isExpanded ? mockData.communityStats.leaderboard : mockData.communityStats.leaderboard.slice(0, 1);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <MetricBadge label="Total Members" value={mockData.communityStats.totalMembers} />
                <MetricBadge label="New Members" value={mockData.communityStats.newMembers} />
            </div>
            <div>
                <h4 className="font-terminal text-lg text-black mb-2">Community Goal: {mockData.communityStats.goal / 1000000}M HBAR</h4>
                <Progress value={(mockData.communityStats.funded / mockData.communityStats.goal) * 100} className="w-full" />
                <div className="flex justify-between text-sm font-code mt-1">
                    <span>{`${(mockData.communityStats.funded / 1000000).toFixed(2)}M HBAR Raised`}</span>
                    <span>{`${((mockData.communityStats.funded / mockData.communityStats.goal) * 100).toFixed(0)}% Funded`}</span>
                </div>
            </div>

            <div className="space-y-2">
                 <h4 className="font-terminal text-lg text-black">Top Contributors</h4>
                {contributorsToShow.map((p, i) => (
                    <div key={i} className="flex items-center justify-between pixel-card-sm p-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 border-2 border-black flex items-center justify-center font-bold bg-primary/10 text-glow">{p.avatar}</div>
                            <span className="font-code text-lg font-semibold">Contributor #{i + 1}</span>
                        </div>
                        <span className="font-code font-bold text-lg text-primary text-glow">{p.contribution}</span>
                    </div>
                ))}
            </div>

            {isExpanded && (
                 <div className="pt-4 border-t-2 border-dashed border-black/20 space-y-3">
                    <h4 className="font-terminal text-lg text-black font-bold">From the Community</h4>
                     <div className="space-y-3">
                        {mockData.communityStats.testimonials.map((t, i) => (
                            <blockquote key={i} className="border-l-4 border-black pl-4 text-lg italic text-gray-600 font-sans">
                                "{t}"
                            </blockquote>
                        ))}
                    </div>
                 </div>
            )}

            <div className="mt-4 flex flex-col items-center gap-4">
                 <button onClick={onViewLeaderboard} className="btn-pixel w-full">Community Hub</button>
                {isExpandable && onToggleExpand && (
                     <button
                        onClick={onToggleExpand}
                        className="btn-pixel !py-1 !px-2 text-sm"
                    >
                        {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
                    </button>
                )}
            </div>
        </div>
    );
};

const TransparencyCard: React.FC<{ item: any; }> = ({ item }) => (
    <div className="p-3 border-2 border-dashed border-black/20 rounded-lg">
        <h4 className="font-terminal text-lg text-black font-bold">{item.title}</h4>
        <p className="font-code text-sm text-gray-600 my-3">{item.description}</p>
        <button className="btn-pixel !py-1 !px-3 text-sm w-full">
            {item.buttonText}
        </button>
    </div>
);

const TransparencySection: React.FC<{
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    isExpandable?: boolean;
}> = ({ isExpanded, onToggleExpand, isExpandable }) => {
    const itemsToShow = isExpanded ? mockData.transparencyItems : mockData.transparencyItems.slice(0, 1);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {itemsToShow.map((item, index) => (
                    <TransparencyCard key={index} item={item} />
                ))}
            </div>

            {isExpandable && onToggleExpand && (
                <div className="mt-4 flex flex-col items-center">
                     <button
                        onClick={onToggleExpand}
                        className="btn-pixel !py-1 !px-2 text-sm"
                    >
                        {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
                    </button>
                </div>
            )}
        </div>
    );
};

const ProposalCard: React.FC<{ proposal: any; onVote: (proposal: any) => void; votes: { [key: number]: string } }> = ({ proposal, onVote, votes }) => (
    <div className="p-3 border-2 border-dashed border-black/20 rounded-lg">
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-terminal text-lg text-black font-bold">{proposal.title}</h4>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${proposal.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                {proposal.status}
            </span>
        </div>
        <p className="font-code text-sm text-gray-600 mb-3">{proposal.description}</p>
        <div className="flex items-center justify-between">
            <div className="text-xs font-code text-gray-500">
                <span>Requested: {proposal.requestedAmount}</span>
            </div>
            <button
                className="btn-pixel !py-1 !px-3 text-sm"
                onClick={() => onVote(proposal)}
                disabled={!!votes[proposal.id]}
            >
                {votes[proposal.id] ? `Voted: ${votes[proposal.id]}` : 'Vote'}
            </button>
        </div>
    </div>
);

const GovernanceSection: React.FC<{
    onSubmitProposal: () => void;
    onVote: (proposal: any) => void;
    votes: { [key: number]: string };
    isExpanded?: boolean;
    onToggleExpand?: () => void;
    isExpandable?: boolean;
}> = ({ onSubmitProposal, onVote, votes, isExpanded, onToggleExpand, isExpandable }) => {
    const proposalsToShow = isExpanded ? mockData.proposals : mockData.proposals.slice(0, 1);

    return (
        <div className="space-y-4">
            <div className="space-y-4">
                {proposalsToShow.map(p => (
                    <ProposalCard key={p.id} proposal={p} onVote={onVote} votes={votes} />
                ))}
            </div>

            {isExpanded && (
                 <div className="pt-4 border-t-2 border-dashed border-black/20 space-y-3">
                    <h4 className="font-terminal text-lg text-black font-bold">Recent Results</h4>
                     <ul className="list-disc list-inside text-muted-foreground text-sm font-code space-y-1">
                        <li>Proposal #102: Fund Local Art Festival - <span className="font-bold text-green-600">Passed</span></li>
                        <li>Proposal #101: Increase Reserve Allocation - <span className="font-bold text-red-600">Failed</span></li>
                    </ul>
                 </div>
            )}

            <div className="mt-4 flex flex-col items-center gap-4">
                 <button onClick={onSubmitProposal} className="btn-pixel w-full">Submit a Proposal</button>
                {isExpandable && onToggleExpand && (
                     <button
                        onClick={onToggleExpand}
                        className="btn-pixel !py-1 !px-2 text-sm"
                    >
                        {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
                    </button>
                )}
            </div>
        </div>
    );
};


const NewsCard: React.FC<{ article: any; onClick: () => void }> = ({ article, onClick }) => (
    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-black/5 cursor-pointer" onClick={onClick}>
        <img src={article.image} alt="News" className="w-24 h-16 object-cover rounded flex-shrink-0 border-2 border-black" />
        <div>
            <p className="font-semibold text-black text-xl">{article.title}</p>
            <p className="text-lg text-gray-500">{article.source}</p>
        </div>
    </div>
);

const LearningItem: React.FC<{ resource: any }> = ({ resource }) => (
    <div className="p-2 rounded-lg hover:bg-black/5 cursor-pointer">
        <p className="font-semibold text-xl text-black">{resource.title}</p>
        <p className="text-lg text-gray-500">{resource.category}</p>
    </div>
);

interface NewsAndUpdatesProps {
  onReadMore: (news: any) => void;
  isExpanded?: boolean;
}

const NewsAndUpdates: React.FC<NewsAndUpdatesProps> = ({ onReadMore, isExpanded }) => {
    const newsToShow = isExpanded ? mockData.news : mockData.news.slice(0, 1);
    const learningToShow = isExpanded ? mockData.learning : mockData.learning.slice(0, 1);

    return (
        <div className="pt-2">
            <div className="space-y-6">
                <div>
                    <h4 className="text-lg font-bold mb-4 text-black font-terminal text-glow">LATEST NEWS</h4>
                    <div className="space-y-2">
                        {newsToShow.map(article => (
                            <NewsCard key={article.id} article={article} onClick={() => onReadMore(article)} />
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-black/20">
                    <h4 className="text-lg font-bold mb-4 text-black font-terminal text-glow">LEARNING HUB</h4>
                    <div className="space-y-1">
                        {learningToShow.map(res => <LearningItem key={res.id} resource={res} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

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
                </DialogHeader>
                <DialogDescription className="font-code">
                        <p>EXPECTED RETURN: {pool.returns}</p>
                        <p>RISK LEVEL: {pool.risk}</p>
                    </DialogDescription>
                <div className="space-y-4 font-code">
                    <div className="space-y-2">
                        <Label htmlFor="amount" className="font-code">Investment Amount (HBAR)</Label>
                        <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1000" className="font-code" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Based on the amount, you can expect:</p>
                        <p className="text-glow">~{yearlyReturn} HBAR in yearly returns.</p>
                    </div>
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Cancel</button>
                    <button className="btn-pixel" onClick={() => { /* Handle investment logic */ alert(`Investing ${amount} HBAR in ${pool.name}`); onClose(); }}>Confirm Investment</button>
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
                        <Label htmlFor="proposal-title" className="text-right font-code">Title</Label>
                        <Input id="proposal-title" placeholder="e.g., Fund a New Community Garden" className="col-span-3 font-code" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-type" className="text-right font-code">Type</Label>
                        <Select onValueChange={setProposalType}>
                            <SelectTrigger className="col-span-3 font-code">
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
                                <Label htmlFor="requested-amount" className="text-right font-code">Requested Amount (HBAR)</Label>
                                <Input id="requested-amount" type="number" placeholder="e.g., 50000" className="col-span-3 font-code" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="recipient-address" className="text-right font-code">Recipient Address</Label>
                                <Input id="recipient-address" placeholder="0.0.xxxxxx" className="col-span-3 font-code" />
                            </div>
                        </>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-link" className="text-right font-code">Supporting Link</Label>
                        <Input id="proposal-link" placeholder="https://your-document.link" className="col-span-3 font-code" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="proposal-details" className="text-right font-code">Details</Label>
                        <Textarea id="proposal-details" placeholder="Describe your proposal in detail..." className="col-span-3 min-h-[100px] font-code" />
                    </div>
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Cancel</button>
                    <button className="btn-pixel" onClick={() => { /* Handle submission logic */ alert('Proposal Submitted!'); onClose(); }}>Submit Proposal</button>
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
                    <button className="btn-pixel" onClick={onClose}>Close</button>
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
                    <button className="btn-pixel" onClick={onClose}>Close</button>
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
                </DialogHeader>
                <DialogDescription className="font-code">{proposal.description}</DialogDescription>
                <div className="space-y-4 py-4 font-code">
                    <p><strong>Requested Amount:</strong> {proposal.requestedAmount}</p>
                    <div className="flex items-center gap-2">
                        <strong>Recipient:</strong> {proposal.recipient}
                        <button className="btn-pixel !h-6 !w-6 !text-sm !rounded-full" onClick={() => onShowRecipientInfo(proposal.recipientInfo)}>
                            i
                        </button>
                    </div>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-4">
                    <button className="btn-pixel border-red-500 text-red-500 hover:bg-red-500/20 hover:text-red-400" onClick={() => onConfirmVote('Against')}>Vote Against</button>
                    <button className="btn-pixel border-green-500 text-green-500 hover:bg-green-500/20 hover:text-green-400" onClick={() => onConfirmVote('For')}>Vote For</button>
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
                </DialogHeader>
                <DialogDescription className="font-code">Your Wallet Balance: {mockData.user.walletBalance}</DialogDescription>
                <div className="space-y-2 font-code">
                    <Label htmlFor="deposit-amount" className="font-code">Amount to Deposit</Label>
                    <Input id="deposit-amount" type="number" placeholder="e.g., 1000" className="font-code" />
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Cancel</button>
                    <button className="btn-pixel" onClick={onClose}>Confirm Deposit</button>
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
                </DialogHeader>
                <DialogDescription className="font-code">Your Invested Balance: {mockData.user.investedBalance}</DialogDescription>
                <div className="space-y-2 font-code">
                    <Label htmlFor="withdraw-amount" className="font-code">Amount to Withdraw</Label>
                    <Input id="withdraw-amount" type="number" placeholder="e.g., 500" className="font-code" />
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Cancel</button>
                    <button className="btn-pixel" onClick={onClose}>Confirm Withdraw</button>
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
                    <button className="btn-pixel" onClick={onClose}>Close</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

// --- COMPONENT REGISTRY ---
const componentRegistry = {
  FundPerformanceDashboard, InvestmentOptions, MemberAndCommunityStats, TransparencySection, GovernanceSection, NewsAndUpdates
};

const generateDefaultLayout = () => [
    // Main Column
    { id: 'fundPerformance', title: 'Fund Performance', component: 'FundPerformanceDashboard', column: 'main', isExpandable: true, isExpanded: true },
    { id: 'investmentOptions', title: 'Investment Options', component: 'InvestmentOptions', column: 'main', isExpandable: true, isExpanded: true },
    { id: 'newsAndUpdates', title: 'News & Updates', component: 'NewsAndUpdates', column: 'main', isExpandable: true, isExpanded: true },

    // Sidebar Column
    { id: 'communityStats', title: 'Community Stats', component: 'MemberAndCommunityStats', column: 'sidebar', isExpandable: true, isExpanded: true },
    { id: 'transparency', title: 'Transparency', component: 'TransparencySection', column: 'sidebar', isExpandable: true, isExpanded: true },
    { id: 'governance', title: 'Governance', component: 'GovernanceSection', column: 'sidebar', isExpandable: true, isExpanded: true },
];

// --- SETTINGS PANEL COMPONENT ---
const LayoutSettingsPanel = ({ layout, onLayoutChange, onClose }) => {
  const handleMove = (index, direction) => {
    const newLayout = [...layout];
    const [item] = newLayout.splice(index, 1);
    newLayout.splice(index + direction, 0, item);
    onLayoutChange(newLayout);
  };

  const handleColumnChange = (id, column) => {
    const newLayout = layout.map(item => item.id === id ? { ...item, column } : item);
    onLayoutChange(newLayout);
  };

  const handleToggle = (id, key) => {
    const newLayout = layout.map(item => item.id === id ? { ...item, [key]: !item[key] } : item);
    onLayoutChange(newLayout);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
      <div className="pixel-card p-6 w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-glow">CUSTOMIZE_LAYOUT</h2>
          <button onClick={onClose} className="btn-pixel">CLOSE</button>
        </div>
        <div className="space-y-4">
          {layout.map((widget, index) => (
            <div key={widget.id} className="pixel-card-sm flex flex-col sm:flex-row items-center justify-between p-3">
              <div className="font-semibold text-black mb-2 sm:mb-0">{widget.title}</div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-end">
                <div className="relative inline-block">
                  <select value={widget.column} onChange={(e) => handleColumnChange(widget.id, e.target.value)} className="appearance-none bg-gray-900 border-2 border-black text-white py-1 px-2 pr-8 rounded-none text-sm focus:outline-none focus:ring-0 focus:border-cyan-400">
                    <option value="main">MAIN</option>
                    <option value="sidebar">SIDEBAR</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-black">EXPANDABLE</label>
                  <Switch checked={widget.isExpandable} onCheckedChange={() => handleToggle(widget.id, 'isExpandable')} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-black">EXPANDED</label>
                  <Switch checked={widget.isExpanded} onCheckedChange={() => handleToggle(widget.id, 'isExpanded')} disabled={!widget.isExpandable} />
                </div>
                <div className="flex gap-1">
                  <button className="btn-pixel !py-1 !px-2 text-sm" onClick={() => handleMove(index, -1)} disabled={index === 0}>UP</button>
                  <button className="btn-pixel !py-1 !px-2 text-sm" onClick={() => handleMove(index, 1)} disabled={index === layout.length - 1}>DOWN</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState(() => {
    let finalLayout = generateDefaultLayout();
    try {
      const savedLayoutJSON = localStorage.getItem('userNodeFundLayout');
      if (savedLayoutJSON) {
        const savedLayout = JSON.parse(savedLayoutJSON);
        const initialIds = new Set(finalLayout.map(w => w.id));

        const migratedSavedLayout = savedLayout.filter(w => initialIds.has(w.id)).map(w => {
          let newColumn = w.column;
          if (w.column === 'left' || w.column === 'center') {
            newColumn = 'main';
          }
          return { ...w, column: newColumn };
        });

        const savedIds = new Set(migratedSavedLayout.map(w => w.id));
        const newWidgets = finalLayout.filter(w => !savedIds.has(w.id));

        finalLayout = [...migratedSavedLayout, ...newWidgets];
      } else {
        localStorage.setItem('userNodeFundLayout', JSON.stringify(finalLayout));
      }
    } catch (error) {
      console.error("Failed to parse or migrate layout from localStorage", error);
      localStorage.setItem('userNodeFundLayout', JSON.stringify(finalLayout));
    }
    return finalLayout;
  });

  useEffect(() => {
    try {
      localStorage.setItem('userNodeFundLayout', JSON.stringify(layoutConfig));
    } catch (error) {
      console.error("Failed to save layout to localStorage", error);
    }
  }, [layoutConfig]);

  const handleWidgetToggle = (widgetId: string) => {
    const newLayout = layoutConfig.map(widget =>
      widget.id === widgetId ? { ...widget, isExpanded: !widget.isExpanded } : widget
    );
    setLayoutConfig(newLayout);
  };

  const renderWidget = (widget) => {
    const Component = componentRegistry[widget.component];
    if (!Component) {
        return null;
    }

    let props: any = {
      isExpandable: widget.isExpandable,
      isExpanded: widget.isExpanded,
      onToggleExpand: () => handleWidgetToggle(widget.id),
    };

    // Pass specific props to components that need them
    if (widget.component === 'InvestmentOptions') {
      props.onInvest = setSelectedPool;
    }
    if (widget.component === 'NewsAndUpdates') {
      props.onReadMore = setSelectedNews;
    }
    if (widget.component === 'GovernanceSection') {
      props.onSubmitProposal = () => setProposalDialogOpen(true);
      props.onVote = setSelectedProposal;
      props.votes = votes;
    }
    if (widget.component === 'MemberAndCommunityStats') {
      props.onViewLeaderboard = () => alert('Community Hub coming soon!');
    }

    return (
      <WindowPanel key={widget.id} title={widget.title} {...props}>
        <Component {...props} />
      </WindowPanel>
    );
  };

  const columns = useMemo(() => {
    return {
      main: layoutConfig.filter(w => w.column === 'main'),
      sidebar: layoutConfig.filter(w => w.column === 'sidebar'),
    };
  }, [layoutConfig]);

  const handleVote = (vote: string) => {
      if(selectedProposal) {
          setVotes(prev => ({...prev, [selectedProposal.id]: vote}));
          setSelectedProposal(null);
      }
  }

  return (
    <div className="space-y-8 py-8 px-4 mt-10"> {/* Adjusted padding and margin */}
      {isSettingsOpen && <LayoutSettingsPanel layout={layoutConfig} onLayoutChange={setLayoutConfig} onClose={() => setIsSettingsOpen(false)} />}
      
      <FundOverviewHeader onDeposit={() => setDepositOpen(true)} onWithdraw={() => setWithdrawOpen(false)} onLearnMore={() => setLearnMoreOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Adjusted gap */}
        <div className="lg:col-span-2 space-y-6">
          {columns.main.map(renderWidget)}
        </div>
        <div className="lg:col-span-1 space-y-6">
          {columns.sidebar.map(renderWidget)}
        </div>
      </div>
      {/*<Footer />*/}
      <InvestDialog pool={selectedPool} open={!!selectedPool} onClose={() => setSelectedPool(null)} />
      <ProposalDialog open={isProposalDialogOpen} onClose={() => setProposalDialogOpen(false)} />
      <NewsDialog news={selectedNews} open={!!selectedNews} onClose={() => setSelectedNews(null)} />
      <VoteDialog proposal={selectedProposal} open={!!selectedProposal} onClose={() => setSelectedProposal(null)} onConfirmVote={handleVote} onShowRecipientInfo={setRecipientInfo} />
      <RecipientInfoDialog info={recipientInfo} open={!!recipientInfo} onClose={() => setRecipientInfo(null)} />
      <DepositDialog open={isDepositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawDialog open={isWithdrawOpen} onClose={() => setWithdrawOpen(false)} />
      <LearnMoreDialog open={isLearnMoreOpen} onClose={() => setLearnMoreOpen(false)} />

      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => setIsSettingsOpen(true)} 
          className="btn-pixel"
        >
            CUSTOMIZE_VIEW
        </button>
      </div>
    </div>
  );
};

export default UserNodeFund;
