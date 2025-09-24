
import React from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

// --- Mock Data ---
const mockUserHoldings = [
  { name: 'LCAFE', value: 1275, shares: 50 },
  { name: 'CFARM', value: 842, shares: 20 },
  { name: 'LBREW', value: 7890, shares: 100 },
  { name: 'TSA', value: 3000, shares: 20 },
];

const totalValue = mockUserHoldings.reduce((sum, holding) => sum + holding.value, 0);
const todaysGainLoss = 125.70;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// --- Components ---

const HoldingsPieChart = () => (
    <ResponsiveContainer width="100%" height={200}>
        <PieChart>
            <Pie
                data={mockUserHoldings}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
                {mockUserHoldings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    </ResponsiveContainer>
);

const HoldingsList = () => (
    <ul className="space-y-2">
        {mockUserHoldings.map(h => (
            <li key={h.name} className="flex justify-between items-center py-1 text-sm">
                <span>{h.name} ({h.shares} shares)</span>
                <span className="font-mono">${h.value.toLocaleString()}</span>
            </li>
        ))}
    </ul>
)

export const PortfolioSnapshot = ({ isExpandable, isExpanded, onToggleExpand }) => {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-400">Total Value</p>
        <h2 className="text-3xl font-bold text-glow">${totalValue.toLocaleString()}</h2>
        <p className={todaysGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}>
          Today: ${todaysGainLoss.toFixed(2)}
        </p>
      </div>
      
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t border-cyan-900/50">
          <HoldingsPieChart />
          
          <h3 className="font-semibold text-lg">Your Holdings</h3>
          <HoldingsList />

          <div className="flex space-x-2 pt-4">
            <Button size="sm" className="flex-1">Deposit</Button>
            <Button size="sm" variant="outline" className="flex-1">Withdraw</Button>
            <Button size="sm" variant="secondary" className="flex-1">Trade</Button>
          </div>
        </div>
      )}

      {isExpandable && (
        <div className="mt-4 text-center">
          <button
            onClick={onToggleExpand}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold text-sm"
          >
            {isExpanded ? 'Show Less' : 'View Details'}
          </button>
        </div>
      )}
    </div>
  );
};
