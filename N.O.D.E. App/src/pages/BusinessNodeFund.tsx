import React, { useState, useMemo, useEffect } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { InfoTrigger } from '@/components/features/info-trigger';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { ApplyForLoanDialog } from '@/components/features/apply-for-loan-dialog';

// Mock Data for BusinessNodeFund
const mockData = {
  fundOverview: {
    totalLoaned: '2.5M HBAR',
    activeLoans: 128,
    interestEarned: '125K HBAR',
    repaymentRate: '98.5%',
  },
  userLoans: [
    {
      id: 'LN001',
      amount: '50,000 HBAR',
      interestRate: '8%',
      status: 'Active' as const,
      repaymentProgress: 60,
      nextPayment: '1,500 HBAR',
      dueDate: '2024-08-01',
    },
    {
      id: 'LN002',
      amount: '25,000 HBAR',
      interestRate: '9%',
      status: 'Paid Off' as const,
      repaymentProgress: 100,
    },
  ],
  fundPerformance: {
    loanVolumeHistory: [
      { name: 'Jan', value: 300000 },
      { name: 'Feb', value: 450000 },
      { name: 'Mar', value: 600000 },
      { name: 'Apr', value: 800000 },
      { name: 'May', value: 1100000 },
    ],
    repaymentSuccessHistory: [
      { name: 'Jan', value: 97.2 },
      { name: 'Feb', value: 98.0 },
      { name: 'Mar', value: 98.1 },
      { name: 'Apr', value: 98.4 },
      { name: 'May', value: 98.5 },
    ],
  },
  news: [
    { id: 1, title: 'N.O.D.E. Fund Empowers Local Tech Startup', content: 'A promising tech startup secured a 100,000 HBAR loan to scale their operations...', image: '/placeholder.svg', source: 'N.O.D.E. Business News' },
    { id: 2, title: 'Understanding Our Daily Repayment Model', content: 'Learn how our innovative daily micro-repayment system helps businesses manage cash flow effectively...', image: '/placeholder.svg', source: 'N.O.D.E. Insights' },
  ],
};

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border-2 border-black p-4 text-center bg-white">
    <div className="text-3xl font-bold text-black">{value}</div>
    <div className="text-sm uppercase tracking-wider text-gray-500">{label}</div>
  </div>
);

const FundHeader: React.FC<{ onApply: () => void; }> = ({ onApply }) => (
  <div className="text-center">
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">N.O.D.E. <span className="text-glow">BUSINESS</span></h1>
      <p className="text-2xl mt-2 text-gray-500">{'// Capital for Networked Businesses'}</p>
      <div className="flex justify-center gap-4 mt-6">
        <button className="btn-pixel" onClick={onApply}>Apply for Loan</button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
        <MetricBadge label="Total Loaned" value={mockData.fundOverview.totalLoaned} />
        <MetricBadge label="Active Loans" value={mockData.fundOverview.activeLoans} />
        <MetricBadge label="Interest Earned" value={mockData.fundOverview.interestEarned} />
        <MetricBadge label="Repayment Rate" value={mockData.fundOverview.repaymentRate} />
      </div>
  </div>
);

const chartConfigLoanVolume = {
  value: {
    label: "Volume (HBAR)",
    color: "hsl(var(--primary))",
  },
};

const chartConfigRepayment = {
  value: {
    label: "Rate (%)",
    color: "hsl(var(--accent))",
  },
};

const FundPerformanceDashboard: React.FC = () => (
    <div className="pixel-card p-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h4 className="font-terminal text-lg text-black mb-2">Loan Volume (HBAR)</h4>
                <ChartContainer config={chartConfigLoanVolume} className="min-h-[300px] w-full font-sans">
                    <AreaChart accessibilityLayer data={mockData.fundPerformance.loanVolumeHistory} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} className="fill-black" />
                        <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value / 1000}K`} className="fill-black"/>
                        <Tooltip
                            cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
                        />
                        <defs>
                            <linearGradient id="fillLoanVolume" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfigLoanVolume.value.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartConfigLoanVolume.value.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area dataKey="value" type="natural" fill="url(#fillLoanVolume)" stroke={chartConfigLoanVolume.value.color} strokeWidth={2} stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </div>
            <div>
                <h4 className="font-terminal text-lg text-black mb-2">Repayment Success Rate</h4>
                <ChartContainer config={chartConfigRepayment} className="min-h-[300px] w-full font-sans">
                    <AreaChart accessibilityLayer data={mockData.fundPerformance.repaymentSuccessHistory} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} className="fill-black" />
                        <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}%`} className="fill-black"/>
                        <Tooltip
                            cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                            content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
                        />
                        <defs>
                            <linearGradient id="fillRepayment" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={chartConfigRepayment.value.color} stopOpacity={0.2} />
                                <stop offset="95%" stopColor={chartConfigRepayment.value.color} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area dataKey="value" type="natural" fill="url(#fillRepayment)" stroke={chartConfigRepayment.value.color} strokeWidth={2} stackId="a" />
                    </AreaChart>
                </ChartContainer>
            </div>
        </div>
    </div>
);

const MyLoans: React.FC<{ onManageLoan: (loan: any) => void }> = ({ onManageLoan }) => (
    <div className="space-y-4">
        {mockData.userLoans.map(loan => (
            <div key={loan.id} className="pixel-card-sm p-4 space-y-3">
                <div className="flex justify-between items-center">
                    <h4 className="font-terminal text-xl text-black">{loan.id} - {loan.amount}</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${loan.status === 'Active' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>{loan.status}</span>
                </div>
                <p className="text-sm text-gray-500 font-code">Interest Rate: {loan.interestRate}</p>
                {loan.status === 'Active' && (
                    <>
                        <div>
                            <Label className="text-xs font-code">Repayment Progress</Label>
                            <Progress value={loan.repaymentProgress} className="w-full h-2 mt-1" />
                            <p className="text-xs text-gray-500 mt-1 text-right font-code">{loan.repaymentProgress}%</p>
                        </div>
                        <div className="flex justify-between text-sm font-code">
                            <p>Next Payment: <span className="text-glow text-black">{loan.nextPayment}</span></p>
                            <p>Due: <span className="text-glow text-black">{loan.dueDate}</span></p>
                        </div>
                        <button className="btn-pixel w-full !py-1" onClick={() => onManageLoan(loan)}>Manage Loan</button>
                    </>
                )}
            </div>
        ))}
        {mockData.userLoans.length === 0 && <p className="text-center text-gray-500 font-code">You have no active or past loans.</p>}
    </div>
);

const NewsCard: React.FC<{ article: any; onClick: () => void }> = ({ article, onClick }) => (
    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-black/5 cursor-pointer" onClick={onClick}>
        <img src={article.image} alt="News" className="w-24 h-16 object-cover rounded flex-shrink-0 border-2 border-black" />
        <div>
            <p className="font-semibold text-black text-xl">{article.title}</p>
            <p className="text-lg text-gray-500">{article.source}</p>
        </div>
    </div>
);

const NewsAndUpdates: React.FC<{ onReadMore: (news: any) => void }> = ({ onReadMore }) => (
    <div className="pt-2 space-y-2">
        {mockData.news.map(article => (
            <NewsCard key={article.id} article={article} onClick={() => onReadMore(article)} />
        ))}
    </div>
);

const StyledDialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <DialogContent className={`font-terminal window-panel bg-background ${className}`}>
        {children}
    </DialogContent>
);

const NewsDialog: React.FC<{ news: any; open: boolean; onClose: () => void }> = ({ news, open, onClose }) => {
    if (!news) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">{news.title}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground whitespace-pre-wrap font-code py-4">{news.content}</p>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Close</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const ManageLoanDialog: React.FC<{ loan: any; open: boolean; onClose: () => void }> = ({ loan, open, onClose }) => {
    if (!loan) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">Manage Loan: {loan.id}</DialogTitle>
                    <DialogDescription className="font-code">
                        Amount: {loan.amount} @ {loan.interestRate}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4 font-code">
                    <p><strong>Status:</strong> {loan.status}</p>
                    {loan.status === 'Active' && (
                        <>
                            <p><strong>Next Payment Due:</strong> {loan.dueDate}</p>
                            <p><strong>Next Payment Amount:</strong> {loan.nextPayment}</p>
                        </>
                    )}
                    <div>
                        <Label>Repayment Progress</Label>
                        <Progress value={loan.repaymentProgress} className="w-full h-2 mt-1" />
                    </div>
                    <p className="text-sm text-muted-foreground">Our daily repayment system automatically deducts small amounts from your connected wallet. You can also make a manual payment.</p>
                </div>
                <DialogFooter>
                    <button className="btn-pixel" onClick={onClose}>Close</button>
                    <button className="btn-pixel">Make Manual Payment</button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const componentRegistry = {
  FundPerformanceDashboard,
  MyLoans,
  NewsAndUpdates,
};

const generateDefaultLayout = () => [
    { id: 'fundPerformance', title: 'Fund Performance', component: 'FundPerformanceDashboard', column: 'main', isExpandable: false, isExpanded: true },
    { id: 'myLoans', title: 'My Loans', component: 'MyLoans', column: 'sidebar', isExpandable: false, isExpanded: true },
    { id: 'newsAndUpdates', title: 'News & Updates', component: 'NewsAndUpdates', column: 'sidebar', isExpandable: false, isExpanded: true },
];

const BusinessNodeFund: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<any | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [isApplyLoanOpen, setApplyLoanOpen] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState(() => {
    try {
      const savedLayout = localStorage.getItem('businessNodeFundLayout');
      return savedLayout ? JSON.parse(savedLayout) : generateDefaultLayout();
    } catch {
      return generateDefaultLayout();
    }
  });

  useEffect(() => {
    localStorage.setItem('businessNodeFundLayout', JSON.stringify(layoutConfig));
  }, [layoutConfig]);

  const renderWidget = (widget: any) => {
    const Component = componentRegistry[widget.component];
    if (!Component) return null;

    let props: any = {};
    if (widget.component === 'MyLoans') {
      props.onManageLoan = setSelectedLoan;
    }
    if (widget.component === 'NewsAndUpdates') {
      props.onReadMore = setSelectedNews;
    }

    return (
      <WindowPanel key={widget.id} title={widget.title}>
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

  return (
    <div className="space-y-8 py-8 px-4 mt-10">
      <FundHeader onApply={() => setApplyLoanOpen(true)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {columns.main.map(renderWidget)}
        </div>
        <div className="lg:col-span-1 space-y-6">
          {columns.sidebar.map(renderWidget)}
        </div>
      </div>

      <NewsDialog news={selectedNews} open={!!selectedNews} onClose={() => setSelectedNews(null)} />
      <ManageLoanDialog loan={selectedLoan} open={!!selectedLoan} onClose={() => setSelectedLoan(null)} />
      
      {/* We assume ApplyForLoanDialog is already styled correctly or we can wrap it if needed */}
      <Dialog open={isApplyLoanOpen} onOpenChange={setApplyLoanOpen}>
        <ApplyForLoanDialog onClose={() => setApplyLoanOpen(false)} />
      </Dialog>
    </div>
  );
};

export default BusinessNodeFund;
