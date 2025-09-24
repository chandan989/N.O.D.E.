import React, { useState } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { ApplyForLoanDialog } from '@/components/features/apply-for-loan-dialog';
import { InfoTrigger } from '@/components/features/info-trigger';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Define interfaces for our data structures
interface Loan {
  id: string;
  amount: string;
  interestRate: string;
  status: 'Active' | 'Paid Off';
  repaymentProgress: number;
  nextPayment?: string;
  dueDate?: string;
}

interface News {
  title: string;
  content: string;
}

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
    { title: 'N.O.D.E. Fund Empowers Local Tech Startup', content: 'A promising tech startup secured a 100,000 HBAR loan to scale their operations...' },
    { title: 'Understanding Our Daily Repayment Model', content: 'Learn how our innovative daily micro-repayment system helps businesses manage cash flow effectively...' },
  ],
};

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <WindowPanel title={title} className={className}>
        <div className="pt-2">
            {children}
        </div>
    </WindowPanel>
);

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border border-border/50 rounded p-4 bg-black/20">
    <div className="font-terminal text-2xl text-primary text-glow">{value}</div>
    <div className="font-code text-sm text-muted-foreground uppercase">{label}</div>
  </div>
);

const FundHeader: React.FC = () => (
    <div className="flex items-center justify-center mb-4 text-center">
        <div>
            <h1 className="text-5xl uppercase text-glow">[N.O.D.E._FUND.EXE]</h1>
            <p className="text-muted-foreground mt-2 font-code">Capital for Networked Businesses. Unique Daily Repayment Options.</p>
        </div>
        <InfoTrigger
            title="N.O.D.E. Business Fund"
            description="The N.O.D.E. Fund provides access to capital for businesses on the network. It features a unique repayment option, allowing you to pay back small amounts daily, making it easier to manage your cash flow."
        />
    </div>
);

const FundOverview: React.FC = () => (
  <div className="text-center py-8 window-panel">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
      <MetricBadge label="Total Loaned" value={mockData.fundOverview.totalLoaned} />
      <MetricBadge label="Active Loans" value={mockData.fundOverview.activeLoans} />
      <MetricBadge label="Interest Earned" value={mockData.fundOverview.interestEarned} />
      <MetricBadge label="Repayment Rate" value={mockData.fundOverview.repaymentRate} />
    </div>
  </div>
);

const MyLoans: React.FC<{ onManageLoan: (loan: Loan) => void }> = ({ onManageLoan }) => (
    <Section title="MY_LOANS.DAT">
        <div className="space-y-4">
            {mockData.userLoans.map(loan => (
                <div key={loan.id} className="border border-border/50 rounded p-4 bg-black/20 space-y-2 font-code">
                    <div className="flex justify-between items-center">
                        <h4 className="font-terminal text-xl text-glow">{loan.id} - {loan.amount}</h4>
                        <span className={`px-2 py-1 text-xs rounded ${loan.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>{loan.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Interest Rate: {loan.interestRate}</p>
                    {loan.status === 'Active' && (
                        <>
                            <div>
                                <Label className="text-xs">Repayment Progress</Label>
                                <Progress value={loan.repaymentProgress} className="w-full h-2 mt-1" />
                                <p className="text-xs text-muted-foreground mt-1 text-right">{loan.repaymentProgress}%</p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <p>Next Payment: <span className="text-glow">{loan.nextPayment}</span></p>
                                <p>Due: <span className="text-glow">{loan.dueDate}</span></p>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => onManageLoan(loan)}>Manage Loan</Button>
                        </>
                    )}
                </div>
            ))}
            {mockData.userLoans.length === 0 && <p className="text-center text-muted-foreground">You have no active or past loans.</p>}
        </div>
    </Section>
);

const FundPerformanceDashboard: React.FC = () => (
    <Section title="FUND_PERFORMANCE.CHRT">
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Loan Volume (HBAR)</h3>
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData.fundPerformance.loanVolumeHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}/>
                    <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }}/>
                    <Line type="monotone" dataKey="value" name="Volume" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
                </ResponsiveContainer>
            </div>
            <div>
                <h3 className="font-terminal text-lg text-glow mb-2">Repayment Success Rate (%)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockData.fundPerformance.repaymentSuccessHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/>
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                        <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }}/>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--card-foreground))' }}/>
                        <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }}/>
                        <Line type="monotone" dataKey="value" name="Success Rate" stroke="hsl(var(--accent))" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </Section>
);

const NewsAndUpdates: React.FC<{ onReadMore: (news: News) => void }> = ({ onReadMore }) => (
    <Section title="NEWS.TXT">
        <div className="space-y-4">
            {mockData.news.map((item, index) => (
                <div key={index} className="border-b border-border/50 pb-2">
                    <h4 className="font-terminal text-lg text-glow">{item.title}</h4>
                    <p className="text-sm text-muted-foreground truncate font-code">{item.content}</p>
                    <button className="text-primary hover:text-glow font-bold font-terminal text-sm" onClick={() => onReadMore(item)}>{'Read More >>'}</button>
                </div>
            ))}
        </div>
    </Section>
);

const StyledDialogContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <DialogContent className={`font-terminal window-panel bg-background ${className}`}>
        {children}
    </DialogContent>
);

const NewsDialog: React.FC<{ news: News | null; open: boolean; onClose: () => void }> = ({ news, open, onClose }) => {
    if (!news) return null;
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <StyledDialogContent>
                <DialogHeader>
                    <DialogTitle className="text-glow text-2xl">{news.title}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground whitespace-pre-wrap font-code py-4">{news.content}</p>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};

const ManageLoanDialog: React.FC<{ loan: Loan | null; open: boolean; onClose: () => void }> = ({ loan, open, onClose }) => {
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
                    <Button variant="outline" onClick={onClose}>Close</Button>
                    <Button>Make Manual Payment</Button>
                </DialogFooter>
            </StyledDialogContent>
        </Dialog>
    );
};


const BusinessNodeFund: React.FC = () => {
  const [selectedNews, setSelectedNews] = useState<News | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  return (
    <div className="container mx-auto px-6 py-8 text-xl space-y-8">
        <FundHeader />
        <FundOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <WindowPanel title="APPLY_FOR_LOAN.MOD">
                    <div className="space-y-4">
                        <h3 className="text-xl text-glow">START_A_NEW_LOAN_APPLICATION</h3>
                        <p className="text-base text-gray-400">
                            Get access to capital with a unique repayment option of paying back small amounts daily.
                        </p>
                        <ApplyForLoanDialog />
                    </div>
                </WindowPanel>
                <FundPerformanceDashboard />
            </div>
            <div className="space-y-8">
                <MyLoans onManageLoan={setSelectedLoan} />
                <NewsAndUpdates onReadMore={setSelectedNews} />
            </div>
        </div>

        <NewsDialog news={selectedNews} open={!!selectedNews} onClose={() => setSelectedNews(null)} />
        <ManageLoanDialog loan={selectedLoan} open={!!selectedLoan} onClose={() => setSelectedLoan(null)} />
    </div>
  );
};

export default BusinessNodeFund;
