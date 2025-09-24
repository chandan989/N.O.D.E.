
import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// --- Type Definitions ---
interface PriceData {
  date: string;
  price: number;
}

// --- Mock Data & Helpers ---
const generatePriceHistory = (basePrice: number, days: number): PriceData[] => {
  const data: PriceData[] = [];
  let price = basePrice;
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i));
    price += (Math.random() - 0.5) * (basePrice / 20); // Fluctuation relative to base price
    price = Math.max(price, 1);
    data.push({ date: date.toISOString().split('T')[0], price: parseFloat(price.toFixed(2)) });
  }
  return data;
};

const fullPriceHistories = {
    '1D': (price: number) => generatePriceHistory(price, 1),
    '1W': (price: number) => generatePriceHistory(price, 7),
    '1M': (price: number) => generatePriceHistory(price, 30),
    '1Y': (price: number) => generatePriceHistory(price, 365),
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(173 95% 50%)",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

// --- Components ---

const PriceHistoryChart = ({ history }) => (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <AreaChart accessibilityLayer data={history} margin={{ left: 0, right: 12, top: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-white/10" />
            <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                className="fill-white/50 text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <defs>
                <linearGradient id="fillPriceDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
                </linearGradient>
            </defs>
            <Area dataKey="price" type="natural" fill="url(#fillPriceDetail)" stroke="var(--color-price)" stackId="a" />
        </AreaChart>
    </ChartContainer>
);

const KeyStatistics = ({ company }) => (
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="text-gray-400">Market Cap:</span> ${company.marketCap}</div>
        <div><span className="text-gray-400">Volume:</span> 150K</div>
        <div><span className="text-gray-400">P/E Ratio:</span> 18.5</div>
        <div><span className="text-gray-400">Div. Yield:</span> 2.1%</div>
        <div><span className="text-gray-400">Supply:</span> 10M</div>
    </div>
);

const CommunitySentiment = () => (
    <div>
        <h4 className="font-semibold mb-2">Community Sentiment</h4>
        <div className="flex items-center justify-between">
            <span className="text-green-400">Bullish: 72%</span>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mx-4">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '72%' }}></div>
            </div>
            <span className="text-red-400">Bearish: 28%</span>
        </div>
    </div>
)

export const AssetDetailView = ({ company }) => {
  const [timeRange, setTimeRange] = useState('1M');

  if (!company) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-400">Select an asset to view details</p>
      </div>
    );
  }

  const priceHistory = fullPriceHistories[timeRange](company.price);

  return (
    <div className="space-y-6 p-4 bg-gray-900/50 rounded-lg">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {/* <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12" /> */}
        <div>
            <h2 className="text-2xl font-bold text-glow">{company.name} ({company.ticker})</h2>
            <p className="text-3xl text-glow">${company.price.toFixed(2)}</p>
            <p className={company.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                {company.change.toFixed(2)} ({((company.change / company.price) * 100).toFixed(2)}%)
            </p>
        </div>
      </div>

      {/* Chart & Time Range */}
      <div>
          <div className="flex justify-end mb-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="Range" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="1D">1D</SelectItem>
                      <SelectItem value="1W">1W</SelectItem>
                      <SelectItem value="1M">1M</SelectItem>
                      <SelectItem value="1Y">1Y</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <PriceHistoryChart history={priceHistory} />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button className="bg-green-600 hover:bg-green-700">Buy / Invest</Button>
        <Button className="bg-red-600 hover:bg-red-700">Sell</Button>
      </div>

      {/* Details */}
      <KeyStatistics company={company} />
      <CommunitySentiment />
    </div>
  );
};
