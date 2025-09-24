import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { WindowPanel } from '@/components/ui/window-panel';

// --- Mock Data ---
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


const LocalExchangeGraph: React.FC = () => {
  return (
    <WindowPanel title="Local Exchange Performance">
      <div className="p-4">
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
                    <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
                    </linearGradient>
                </defs>
                <Area dataKey="price" type="natural" fill="url(#fillPrice)" stroke="var(--color-price)" stackId="a" />
            </AreaChart>
        </ChartContainer>
      </div>
    </WindowPanel>
  );
};

export default LocalExchangeGraph;
