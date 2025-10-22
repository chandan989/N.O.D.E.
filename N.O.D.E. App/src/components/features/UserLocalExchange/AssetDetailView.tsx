
import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
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
const generatePriceHistory = (basePrice: number, points: number, duration: 'day' | 'hour'): PriceData[] => {
  const data: PriceData[] = [];
  let price = basePrice;
  for (let i = 0; i < points; i++) {
    const date = new Date();
    if (duration === 'day') {
      date.setDate(date.getDate() - (points - i));
    } else { // hour
      date.setHours(date.getHours() - (points - i));
    }
    price += (Math.random() - 0.5) * (basePrice / 20); // Fluctuation relative to base price
    price = Math.max(price, 1);
    data.push({ date: date.toISOString(), price: parseFloat(price.toFixed(2)) });
  }
  return data;
};

const fullPriceHistories = {
    '1D': (price: number) => generatePriceHistory(price, 24, 'hour'),
    '1W': (price: number) => generatePriceHistory(price, 7, 'day'),
    '1M': (price: number) => generatePriceHistory(price, 30, 'day'),
    '1Y': (price: number) => generatePriceHistory(price, 365, 'day'),
}

const chartConfig = {
  price: {
    label: "Price (HBAR)",
    color: "#000000",
  },
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

// --- Components ---

const PriceHistoryChart = ({ history, timeRange }) => {
    const getChartConfig = (range) => {
        switch (range) {
            case '1Y':
                return {
                    tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short' }),
                    interval: Math.floor(history.length / 12),
                };
            case '1M':
                return {
                    tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { day: 'numeric' }),
                    interval: Math.floor(history.length / 4),
                };
            case '1W':
                 return {
                    tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' }),
                    interval: 1,
                };
            case '1D':
                return {
                    tickFormatter: (value) => new Date(value).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                    interval: Math.floor(history.length / 4),
                };
            default:
                return {
                    tickFormatter: (value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    interval: 7,
                };
        }
    };

    const { tickFormatter, interval } = getChartConfig(timeRange);

    return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full font-sans">
        <AreaChart accessibilityLayer data={history} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
            <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={tickFormatter}
                className="fill-black"
                interval={interval}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value} H`}/>
            <Tooltip
                cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
            />
            <defs>
                <linearGradient id="fillPriceDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartConfig.price.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartConfig.price.color} stopOpacity={0} />
                </linearGradient>
            </defs>
            <Area dataKey="price" type="natural" fill="url(#fillPriceDetail)" stroke={chartConfig.price.color} strokeWidth={2} stackId="a" />
        </AreaChart>
    </ChartContainer>
)};

const StatisticItem: React.FC<{ label: string; value: string | number; }> = ({ label, value }) => (
    <div className="flex justify-between items-baseline py-2 border-b-2 border-dashed border-black/20">
      <span className="text-gray-500 uppercase text-sm">{label}</span>
      <span className="font-bold text-lg text-black">{value}</span>
    </div>
);

const KeyStatistics = ({ company }) => (
    <div>
        <h4 className="text-xl font-bold mb-2 text-black">KEY_STATISTICS</h4>
        <div className="space-y-2">
            <StatisticItem label="Market Cap" value={`$${company.marketCap}`} />
            <StatisticItem label="Volume" value="150K" />
            <StatisticItem label="P/E Ratio" value={18.5} />
            <StatisticItem label="Div. Yield" value="2.1%" />
            <StatisticItem label="Supply" value="10M" />
        </div>
    </div>
);

const SentimentDisplay: React.FC<{ sentiment: string; percentage: number; className: string; barClassName: string; }> = ({ sentiment, percentage, className, barClassName }) => (
    <div>
        <div className="flex justify-between items-center mb-2">
            <p className={`font-bold text-lg ${className}`}>{sentiment}</p>
            <p className="text-sm font-bold text-black">{percentage}%</p>
        </div>
        <div className="w-full bg-gray-200 border-2 border-black">
            <div style={{ width: `${percentage}%`}} className={`h-4 ${barClassName}`}></div>
        </div>
    </div>
);

const CommunitySentiment = () => (
    <div>
        <h4 className="text-xl font-bold mb-4 text-black">COMMUNITY_SENTIMENT</h4>
        <div className="space-y-4">
            <SentimentDisplay sentiment="Bullish" percentage={72} className="text-black" barClassName="bg-[#00FF00]" />
            <SentimentDisplay sentiment="Bearish" percentage={28} className="text-black" barClassName="bg-red-600" />
        </div>
    </div>
);


export const AssetDetailView = ({ company }) => {
  const [timeRange, setTimeRange] = useState('1M');

  if (!company) {
    return (
      <div className="h-full flex items-center justify-center pixel-card p-6">
        <p className="text-gray-700">Select an asset to view details</p>
      </div>
    );
  }

  const priceHistory = fullPriceHistories[timeRange](company.price);

  return (
    <div className="pixel-card p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-4">
        {/* <img src={company.logo} alt={`${company.name} logo`} className="w-12 h-12" /> */}
        <div>
            <h2 className="text-3xl font-bold text-black">{company.name} ({company.ticker})</h2>
            <p className="text-3xl font-bold text-black">${company.price.toFixed(2)}</p>
            <p className={company.change >= 0 ? 'text-[#00FF00]' : 'text-red-600'}>
                {company.change.toFixed(2)} ({((company.change / company.price) * 100).toFixed(2)}%)
            </p>
        </div>
      </div>

      {/* Chart & Time Range */}
      <div>
          <div className="flex justify-end mb-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[80px] border-black bg-white text-black">
                      <SelectValue placeholder="Range" />
                  </SelectTrigger>
                  <SelectContent className="border-black bg-white text-black">
                      <SelectItem value="1D">1D</SelectItem>
                      <SelectItem value="1W">1W</SelectItem>
                      <SelectItem value="1M">1M</SelectItem>
                      <SelectItem value="1Y">1Y</SelectItem>
                  </SelectContent>
              </Select>
          </div>
          <PriceHistoryChart history={priceHistory} timeRange={timeRange} />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button className="btn-pixel ">BUY / INVEST</Button>
        <Button className="btn-pixel">SELL</Button>
      </div>

      {/* Details */}
      <div className="space-y-6 mt-6">
        <KeyStatistics company={company} />
        {/*<CommunitySentiment />*/}
      </div>
    </div>
  );
};
