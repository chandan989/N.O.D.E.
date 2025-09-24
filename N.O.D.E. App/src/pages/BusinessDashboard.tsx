import React from 'react';
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

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const chartData = [
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
];

const chartConfig = {
  engagement: {
    label: "Engagement",
    color: "hsl(173 95% 50%)",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

const BusinessDashboard: React.FC = () => {
  const { isConnected } = useWalletStore();
  const { verificationStatus } = useUserStore();

  const businessInfo = {
    name: "Elykid Private Limited",
    foundedBy: "Chandan",
    memberSince: "2024",
  };

  const localExchangeData = {
      tokensListed: 1000000,
      tokenPrice: 0.5,
      marketCap: 500000,
      volume24h: 12500,
  };

  const nodeFundData = {
      activeLoan: 50000,
      interestRate: '5%',
      dailyRepayment: 100,
      nextPayment: '2024-08-01',
      totalNodeFundValue: 10000000, // Mock data for total NODE fund value
      maxLoanAmount: 250000, // Mock data for maximum loan amount a business can apply for
  };

  const renderVerificationStatus = () => {
    switch (verificationStatus) {
      case 'verified':
        return <span className='text-glow'>[TRUE]</span>;
      case 'pending':
        return <span className='text-yellow-500'>[UNDER REVIEW]</span>;
      case 'unverified':
      default:
        return <Link to='/business/verify' className='text-red-500 hover:underline'>[FALSE]</Link>;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 text-xl space-y-8">
        <div className="flex items-center justify-center mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-5xl uppercase text-glow text-center">[BUSINESS_DASHBOARD.EXE]</h1>
            <InfoTrigger
                title="Business Dashboard"
                description="This is your main control panel. It provides a snapshot of your business's performance, including key metrics and summaries of your active offers, coupons, and loans. Click on any summary panel to navigate to the respective section."
            />
        </div>

        <SectionDivider />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
                <WindowPanel title="BUSINESS_DATA.SYS">
                    <div className="space-y-2">
                        <p className="text-base">NAME: <span className="text-glow">{businessInfo.name}</span></p>
                        <p className="text-base">FOUNDED_BY: <span className="text-glow">{businessInfo.foundedBy}</span></p>
                        <p className="text-base">MEMBER_SINCE: <span className="text-glow">{businessInfo.memberSince}</span></p>
                        <p className="text-base">VERIFIED: {renderVerificationStatus()}</p>
                    </div>
                </WindowPanel>
                <Link to="/business/local-exchange">
                    <WindowPanel title="LOCAL_EXCHANGE.DAT" className="cursor-pointer">
                        <h3 className="text-lg sm:text-xl text-glow">LOCAL_EXCHANGE</h3>
                        <div className="space-y-2 mt-2 text-base">
                            <p>Tokens Listed: <span className="text-glow">{localExchangeData.tokensListed.toLocaleString()}</span></p>
                            <p>Token Price: <span className="text-glow">${localExchangeData.tokenPrice.toFixed(2)}</span></p>
                            <p>Market Cap: <span className="text-glow">${localExchangeData.marketCap.toLocaleString()}</span></p>
                            <p>24h Volume: <span className="text-glow">${localExchangeData.volume24h.toLocaleString()}</span></p>
                        </div>
                    </WindowPanel>
                </Link>
                <Link to="/business/funds">
                    <WindowPanel title="NODE_FUND.DAT" className="cursor-pointer">
                        <h3 className="text-lg sm:text-xl text-glow">NODE_FUND</h3>
                        <div className="space-y-2 mt-2 text-base">
                            <p>Active Loan: <span className="text-glow">${nodeFundData.activeLoan.toLocaleString()}</span></p>
                            <p>Interest Rate: <span className="text-glow">{nodeFundData.interestRate}</span></p>
                            <p>Daily Repayment: <span className="text-glow">${nodeFundData.dailyRepayment.toLocaleString()}</span></p>
                            <p>Total Fund Value: <span className="text-glow">${nodeFundData.totalNodeFundValue.toLocaleString()}</span></p>
                            <p>Max Loan Amount: <span className="text-glow">${nodeFundData.maxLoanAmount.toLocaleString()}</span></p>
                            <p>Next Payment: <span className="text-glow">{nodeFundData.nextPayment}</span></p>
                        </div>
                    </WindowPanel>
                </Link>
            </div>
            <div className="lg:col-span-2">
                <WindowPanel title="PERFORMANCE_GRAPH.SYS">
                    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-white/10" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                                className="fill-white/50"
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                            />
                            <defs>
                                <linearGradient id="fillEngagement" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-engagement)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-engagement)"
                                    stopOpacity={0.1}
                                />
                                </linearGradient>
                            </defs>
                            <Area
                                dataKey="engagement"
                                type="natural"
                                fill="url(#fillEngagement)"
                                stroke="var(--color-engagement)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                </WindowPanel>
            </div>
        </div>

        {!isConnected && (
            <>
                <SectionDivider />
                <section id="security-alert" className="max-w-3xl mx-auto text-left">
                    <h2 className="text-4xl uppercase text-red-500 mb-12 text-center">// SECURITY_ALERT</h2>
                    <WindowPanel title="ALERT.LOG">
                        <div className="log-item text-red-500">
                            <h3 className="text-2xl">WALLET NOT CONNECTED</h3>
                            <p className="mt-2 text-lg">
                            Connect your HashPack wallet to access N.O.D.E. Protocol features. All transactions are secured by Hedera Hashgraph.
                            </p>
                        </div>
                    </WindowPanel>
                </section>
            </>
        )}
    </div>
  );
};

export default BusinessDashboard;
