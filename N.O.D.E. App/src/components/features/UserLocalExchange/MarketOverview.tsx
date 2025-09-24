
import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from '@/components/ui/button';

// --- Mock Data ---
const mockMarketData = {
  topGainers: [{ ticker: 'LCAFE', change: 5.2, price: 26.75 }, { ticker: 'CFARM', change: 4.8, price: 44.10 }],
  topLosers: [{ ticker: 'TSA', change: -3.1, price: 145.80 }, { ticker: 'IBOOK', change: -2.5, price: 15.25 }],
  mostActive: [{ ticker: 'LBREW', volume: '250K' }, { ticker: 'MVEN', volume: '210K' }],
};

const generateMarketHistory = () => {
    const data = [];
    let price = 50;
    for (let i = 0; i < 90; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (90 - i));
        price += (Math.random() - 0.5) * 3;
        price = Math.max(price, 10);
        data.push({ date: date.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
    }
    return data;
};

const marketHistory = generateMarketHistory();

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(173 95% 50%)",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];


// --- Components ---

const MarketChart = () => (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <AreaChart accessibilityLayer data={marketHistory} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-white/10" />
            <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                className="fill-white/50"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <defs>
                <linearGradient id="fillPriceMarket" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
                </linearGradient>
            </defs>
            <Area dataKey="price" type="natural" fill="url(#fillPriceMarket)" stroke="var(--color-price)" stackId="a" />
        </AreaChart>
    </ChartContainer>
);

const QuickStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-sm">
        <div>
            <h3 className="text-base font-semibold text-green-400">Top Gainers</h3>
            {mockMarketData.topGainers.map(g => <p key={g.ticker} className="font-mono">{g.ticker}: +{g.change}%</p>)}
        </div>
        <div>
            <h3 className="text-base font-semibold text-red-400">Top Losers</h3>
            {mockMarketData.topLosers.map(l => <p key={l.ticker} className="font-mono">{l.ticker}: {l.change}%</p>)}
        </div>
        <div>
            <h3 className="text-base font-semibold text-cyan-400">Most Active</h3>
            {mockMarketData.mostActive.map(a => <p key={a.ticker} className="font-mono">{a.ticker}: {a.volume}</p>)}
        </div>
    </div>
);


export const MarketOverview = ({ isExpandable, isExpanded, onToggleExpand }) => {
  return (
    <div className="space-y-4">
      <QuickStats />

      {isExpanded && (
        <div className="space-y-6 pt-4 border-t border-cyan-900/50">
          <MarketChart />
          <div className="flex justify-center space-x-4">
            <Button>Start Trading</Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </div>
      )}

      {isExpandable && (
        <div className="mt-4 text-center">
          <button
            onClick={onToggleExpand}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold text-sm"
          >
            {isExpanded ? 'Hide Chart' : 'Show Chart'}
          </button>
        </div>
      )}
    </div>
  );
};
