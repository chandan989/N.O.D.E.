
import React from 'react';
import { Area, AreaChart } from 'recharts';

// --- Type Definitions ---
interface Company {
  id: number;
  name: string;
  ticker: string;
  price: number;
  change: number;
  marketCap: string;
}

// --- Mock Data ---
const mockTopCompanies: Company[] = [
  { id: 1, name: 'Local Cafe', ticker: 'LCAFE', price: 25.50, change: 1.25, marketCap: '1.2M' },
  { id: 2, name: 'Indie Bookstore', ticker: 'IBOOK', price: 15.75, change: -0.50, marketCap: '800K' },
  { id: 3, name: 'Community Farm', ticker: 'CFARM', price: 42.10, change: 2.15, marketCap: '3.5M' },
  { id: 4, name: 'Tech Startup A', ticker: 'TSA', price: 150.00, change: -5.20, marketCap: '25M' },
  { id: 5, name: 'Local Brewery', ticker: 'LBREW', price: 78.90, change: 3.45, marketCap: '5.2M' },
  { id: 6, name: 'Eco-Friendly Cleaners', ticker: 'EFC', price: 12.30, change: 0.15, marketCap: '500K' },
  { id: 7, name: 'Handmade Crafts Co.', ticker: 'HCC', price: 8.50, change: 0.75, marketCap: '350K' },
  { id: 8, name: 'Gourmet Food Truck', ticker: 'GFT', price: 33.00, change: -1.10, marketCap: '1.8M' },
  { id: 9, name: 'Local Gym', ticker: 'LGYM', price: 55.20, change: 2.80, marketCap: '4.1M' },
  { id: 10, name: 'Music Venue', ticker: 'MVEN', price: 95.00, change: 4.50, marketCap: '7.8M' },
];

const generateSparkline = () => {
    const data = [];
    let price = Math.random() * 10 + 5;
    for (let i = 0; i < 20; i++) {
        price += (Math.random() - 0.5) * 2;
        data.push({ v: Math.max(price, 1) });
    }
    return data;
}

// --- Component ---

export const MarketList = ({ onSelectCompany, isExpandable, isExpanded, onToggleExpand }) => {
  const companiesToShow = isExpanded ? mockTopCompanies : mockTopCompanies.slice(0, 5);

  return (
    <div className="pixel-card p-6">
      {/*<h3 className="text-3xl font-bold mb-4 text-black">MARKET_LIST</h3>*/}
      <ul className={`pr-2 ${!isExpanded ? 'max-h-[400px] overflow-y-auto' : ''}`}>
        {companiesToShow.map(company => {
          const sparklineData = generateSparkline();
          return (
            <li
              key={company.id}
              onClick={() => onSelectCompany(company)}
              className="flex justify-between items-center py-2 border-b-2 border-dashed border-black/20 hover:bg-black/5 cursor-pointer transition-colors"
            >
              <div className="flex-1">
                <p className="font-bold text-lg text-black">{company.ticker}</p>
                <p className="text-xs text-gray-500 uppercase">{company.name}</p>
              </div>
              <div className="w-24 h-8 mx-4">
                  <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                      <defs>
                          <linearGradient id={`sparkline-color-${company.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={company.change >= 0 ? "#10B981" : "#F43F5E"} stopOpacity={0.4}/>
                              <stop offset="95%" stopColor={company.change >= 0 ? "#10B981" : "#F43F5E"} stopOpacity={0}/>
                          </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke={company.change >= 0 ? "#10B981" : "#F43F5E"} fill={`url(#sparkline-color-${company.id})`} />
                  </AreaChart>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-black">${company.price.toFixed(2)}</p>
                <p className={company.change >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {company.change.toFixed(2)}%
                </p>
              </div>
            </li>
          )
        })}
      </ul>
      {isExpandable && mockTopCompanies.length > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={onToggleExpand}
            className="btn-pixel"
          >
            {isExpanded ? 'SHOW_LESS' : 'VIEW_ALL'}
          </button>
        </div>
      )}
    </div>
  );
};
