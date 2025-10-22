
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

const QuickStats = () => (
    <div className="space-y-4">
        {/*<h4 className="text-2xl font-bold mb-4 text-black">QUICK STATS</h4>*/}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
                <h5 className="text-xl font-bold text-green-400 mb-2">Top Gainers</h5>
                {mockMarketData.topGainers.map(g => (
                    <div key={g.ticker} className="flex justify-between items-baseline py-1 border-b-2 border-dashed border-black/20 last:border-b-0">
                        <span className="text-base text-gray-500 uppercase">{g.ticker}</span>
                        <span className="font-bold text-lg text-green-400">+{g.change}%</span>
                    </div>
                ))}
            </div>
            <div>
                <h5 className="text-xl font-bold text-black mb-2">Top Losers</h5>
                {mockMarketData.topLosers.map(l => (
                    <div key={l.ticker} className="flex justify-between items-baseline py-1 border-b-2 border-dashed border-black/20 last:border-b-0">
                        <span className="text-base text-gray-500 uppercase">{l.ticker}</span>
                        <span className="font-bold text-lg text-black">{l.change}%</span>
                    </div>
                ))}
            </div>
            <div>
                <h5 className="text-xl font-bold text-black mb-2">Most Active</h5>
                {mockMarketData.mostActive.map(a => (
                    <div key={a.ticker} className="flex justify-between items-baseline py-1 border-b-2 border-dashed border-black/20 last:border-b-0">
                        <span className="text-base text-gray-500 uppercase">{a.ticker}</span>
                        <span className="font-bold text-lg text-black">{a.volume}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);


export const MarketOverview = ({ isExpandable, isExpanded, onToggleExpand }) => {
  return (
    <div className="pixel-card p-6 space-y-6">
      {/*<h3 className="text-xl font-bold text-black">MARKET OVERVIEW</h3>*/}
      <QuickStats />
        
    </div>
  );
};
