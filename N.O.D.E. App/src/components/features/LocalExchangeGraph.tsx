import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
    label: "Price (HBAR)",
    color: "#000000",
  },
};

const LocalExchangeGraph: React.FC = () => {
  return (
    <div className="pixel-card p-6">
        <h3 className="text-3xl font-bold mb-4 text-black">LOCAL_EXCHANGE_PERFORMANCE</h3>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full font-sans">
            <AreaChart accessibilityLayer data={marketHistory} margin={{ left: 12, right: 12, top: 10, bottom: 10 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    className="fill-black"
                    interval={7}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value} H`}/>
                <Tooltip
                    cursor={{ stroke: 'black', strokeWidth: 1, strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent indicator="line" labelClassName="font-bold" className="bg-white/80 backdrop-blur-sm border-2 border-black shadow-lg" />}
                />
                <defs>
                    <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartConfig.price.color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={chartConfig.price.color} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <Area dataKey="price" type="natural" fill="url(#fillPrice)" stroke={chartConfig.price.color} strokeWidth={2} stackId="a" />
            </AreaChart>
        </ChartContainer>
    </div>
  );
};

export default LocalExchangeGraph;