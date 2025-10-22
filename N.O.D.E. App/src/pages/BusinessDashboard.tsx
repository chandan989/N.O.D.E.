import React, { useState, useMemo, useEffect } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Link } from 'react-router-dom';
import { useWalletStore } from '@/stores/wallet-store';
import { useUserStore } from '@/stores/user-store';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { InfoTrigger } from '@/components/features/info-trigger';
import { Switch } from '@/components/ui/switch';

// Mock Data - combining existing data into a single object
const mockData = {
  businessInfo: {
    name: "Elykid Private Limited",
    foundedBy: "Chandan",
    memberSince: "2024",
  },
  localExchangeData: {
      tokensListed: 1000000,
      tokenPrice: 0.5,
      marketCap: 500000,
      volume24h: 12500,
  },
  nodeFundData: {
      activeLoan: 50000,
      interestRate: '5%',
      dailyRepayment: 100,
      nextPayment: '2024-08-01',
      totalNodeFundValue: 10000000,
      maxLoanAmount: 250000,
  },
  performanceData: [
    { month: "January", engagement: 186 },
    { month: "February", engagement: 305 },
    { month: "March", engagement: 237 },
    { month: "April", engagement: 280 },
    { month: "May", engagement: 209 },
    { month: "June", engagement: 314 },
    { month: "July", engagement: 345 },
    { month: "August", engagement: 305 },
    { month: "September", engagement: 400 },
    { month: "October", engagement: 380 },
    { month: "November", engagement: 420 },
    { month: "December", engagement: 450 },
  ],
};

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "hsl(var(--primary))",
  },
};

// --- Reusable Components from UserNodeFund's design system ---

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="border-2 border-black p-4 text-center bg-white">
    <div className="text-3xl font-bold text-black">{value}</div>
    <div className="text-sm uppercase tracking-wider text-gray-500">{label}</div>
  </div>
);

const DashboardHeader: React.FC = () => (
    <div className="text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">BUSINESS <span className="text-glow">DASHBOARD</span></h1>
        <p className="text-2xl mt-2 text-gray-500">// Your Business Control Panel</p>
        <div className="flex justify-center mt-4">
            <InfoTrigger
                title="Business Dashboard"
                description="This is your main control panel. It provides a snapshot of your business's performance, including key metrics and summaries of your active offers, coupons, and loans. Click on any summary panel to navigate to the respective section."
            />
        </div>
    </div>
);

// --- Dashboard Widget Components ---

const BusinessDataWidget: React.FC = () => {
    const { verificationStatus } = useUserStore();
    const renderVerificationStatus = () => {
        switch (verificationStatus) {
          case 'verified':
            return <span className='text-green-400 font-bold'>[VERIFIED]</span>;
          case 'pending':
            return <span className='text-yellow-400 font-bold'>[PENDING]</span>;
          case 'unverified':
          default:
            return <Link to='/business/verify' className='text-red-400 hover:underline font-bold'>[UNVERIFIED]</Link>;
        }
    };

    return (
        <div className="pixel-card p-4 space-y-3">
            <div className="font-terminal text-lg text-black">NAME: <span className="font-bold">{mockData.businessInfo.name}</span></div>
            <div className="font-terminal text-lg text-black">FOUNDED: <span className="font-bold">{mockData.businessInfo.foundedBy}</span></div>
            <div className="font-terminal text-lg text-black">MEMBER_SINCE: <span className="font-bold">{mockData.businessInfo.memberSince}</span></div>
            <div className="font-terminal text-lg text-black">VERIFIED: {renderVerificationStatus()}</div>
        </div>
    );
};

const LocalExchangeWidget: React.FC = () => (
    <Link to="/business/local-exchange" className="block">
        <div className="pixel-card p-4 h-full">
            <div className="grid grid-cols-2 gap-4 text-center">
                <MetricBadge label="Tokens Listed" value={mockData.localExchangeData.tokensListed.toLocaleString()} />
                <MetricBadge label="Token Price" value={`$${mockData.localExchangeData.tokenPrice.toFixed(2)}`} />
                <MetricBadge label="Market Cap" value={`$${mockData.localExchangeData.marketCap.toLocaleString()}`} />
                <MetricBadge label="24h Volume" value={`$${mockData.localExchangeData.volume24h.toLocaleString()}`} />
            </div>
        </div>
    </Link>
);

const NodeFundWidget: React.FC = () => (
    <Link to="/business/funds" className="block">
        <div className="pixel-card p-4 h-full">
             <div className="space-y-2 text-left">
                <p className="font-terminal text-lg">Active Loan: <span className="font-bold text-primary text-glow">${mockData.nodeFundData.activeLoan.toLocaleString()}</span></p>
                <p className="font-terminal text-lg">Interest: <span className="font-bold">{mockData.nodeFundData.interestRate}</span></p>
                <p className="font-terminal text-lg">Daily Repayment: <span className="font-bold">${mockData.nodeFundData.dailyRepayment.toLocaleString()}</span></p>
                <p className="font-terminal text-lg">Next Payment: <span className="font-bold">{mockData.nodeFundData.nextPayment}</span></p>
                <hr className="border-black/20 my-3 border-dashed" />
                <p className="font-terminal text-sm text-gray-500">Max Loan: <span className="font-bold">${mockData.nodeFundData.maxLoanAmount.toLocaleString()}</span></p>
                <p className="font-terminal text-sm text-gray-500">Total Fund Value: <span className="font-bold">${mockData.nodeFundData.totalNodeFundValue.toLocaleString()}</span></p>
            </div>
        </div>
    </Link>
);

const PerformanceGraphWidget: React.FC = () => (
    <div className="pixel-card p-6">
        <h4 className="font-terminal text-lg text-black mb-2">Engagement Performance</h4>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full font-sans">
            <AreaChart accessibilityLayer data={mockData.performanceData} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    className="fill-black"
                />
                <ChartTooltip
                    cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
                />
                <defs>
                    <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={"hsl(var(--primary))"} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={"hsl(var(--primary))"} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area dataKey="engagement" type="natural" fill="url(#fillEngagement)" stroke={"hsl(var(--primary))"} strokeWidth={2} stackId="a" />
            </AreaChart>
        </ChartContainer>
    </div>
);

const SecurityAlertWidget: React.FC = () => (
    <div className="pixel-card-alert p-6 text-center">
        <h3 className="text-2xl font-bold text-red-500 mb-2 font-terminal">// SECURITY_ALERT //</h3>
        <p className="text-lg text-black">
            WALLET NOT CONNECTED. Connect your HashPack wallet to access all N.O.D.E. Protocol features.
        </p>
    </div>
);


// --- COMPONENT REGISTRY & LAYOUT ---
const componentRegistry = {
  BusinessDataWidget,
  LocalExchangeWidget,
  NodeFundWidget,
  PerformanceGraphWidget,
};

const generateDefaultLayout = () => [
    { id: 'performanceGraph', title: 'Performance Graph', component: 'PerformanceGraphWidget', column: 'main', isExpandable: false, isExpanded: true },
    { id: 'localExchange', title: 'Local Exchange', component: 'LocalExchangeWidget', column: 'main', isExpandable: false, isExpanded: true },
    { id: 'businessData', title: 'Business Data', component: 'BusinessDataWidget', column: 'sidebar', isExpandable: false, isExpanded: true },
    { id: 'nodeFund', title: 'N.O.D.E. Fund', component: 'NodeFundWidget', column: 'sidebar', isExpandable: false, isExpanded: true },
];

// --- SETTINGS PANEL ---
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


// --- Main Dashboard Component ---
const BusinessDashboard: React.FC = () => {
  const { isConnected } = useWalletStore();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState(() => {
    try {
      const savedLayout = localStorage.getItem('businessDashboardLayout');
      if (savedLayout) {
        return JSON.parse(savedLayout);
      }
    } catch (e) {
      console.error("Could not parse layout from localStorage", e);
    }
    return generateDefaultLayout();
  });

  useEffect(() => {
    try {
      localStorage.setItem('businessDashboardLayout', JSON.stringify(layoutConfig));
    } catch (e) {
      console.error("Could not save layout to localStorage", e);
    }
  }, [layoutConfig]);

  const renderWidget = (widget) => {
    const Component = componentRegistry[widget.component];
    if (!Component) return null;

    return (
      <WindowPanel key={widget.id} title={widget.title}>
        <Component />
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
      {isSettingsOpen && <LayoutSettingsPanel layout={layoutConfig} onLayoutChange={setLayoutConfig} onClose={() => setIsSettingsOpen(false)} />}
      
      <DashboardHeader />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {columns.main.map(renderWidget)}
        </div>
        <div className="lg:col-span-1 space-y-6">
          {columns.sidebar.map(renderWidget)}
        </div>
      </div>

      {!isConnected && (
        <div className="mt-8">
            <SecurityAlertWidget />
        </div>
      )}

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

export default BusinessDashboard;
