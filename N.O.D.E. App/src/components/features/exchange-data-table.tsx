import React from 'react';
import { Sparkline } from '@/components/ui/sparkline';

const exchangeData = [
    {
        token: 'ELYKID',
        price: '$1,200.50',
        change: '+5.25%',
        marketCap: '$1.2B',
        volume: '$50.5M',
        trend: [5, 10, 5, 16, 8, 15, 12],
    },
    {
        token: 'NODE',
        price: '$850.75',
        change: '-2.10%',
        marketCap: '$850M',
        volume: '$25.2M',
        trend: [10, 8, 12, 10, 7, 8, 9],
    },
    {
        token: 'PIXEL',
        price: '$450.25',
        change: '+8.75%',
        marketCap: '$450M',
        volume: '$15.8M',
        trend: [3, 5, 8, 6, 9, 12, 15],
    },
    {
        token: 'QUANTUM',
        price: '$2,500.00',
        change: '+1.50%',
        marketCap: '$2.5B',
        volume: '$100.7M',
        trend: [12, 15, 14, 18, 20, 19, 22],
    },
];

export const ExchangeDataTable: React.FC = () => {
    return (
        <div className="pixel-card p-6">
            <table className="w-full">
                <thead>
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-base font-bold text-black">TOKEN</th>
                        <th scope="col" className="px-4 py-3 text-left text-base font-bold text-black">PRICE</th>
                        <th scope="col" className="px-4 py-3 text-left text-base font-bold text-black">CHANGE (24H)</th>
                        <th scope="col" className="px-4 py-3 text-left text-base font-bold text-black">TREND (7D)</th>
                        <th scope="col" className="px-4 py-3 text-left text-base font-bold text-black">MARKET CAP</th>
                        <th scope="col" className="px-4 py-3 text-left text-base font-bold text-black">VOLUME (24H)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black/20">
                    {exchangeData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-100 transition-colors duration-200">
                            <td className="px-4 py-4 whitespace-nowrap text-base font-medium text-black">{item.token}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-base text-black">{item.price}</td>
                            <td className={`px-4 py-4 whitespace-nowrap text-base ${item.change.startsWith('+') ? 'text-[#00FF00]' : 'text-red-600'}`}>{item.change}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-base">
                                <Sparkline data={item.trend} />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-base text-black">{item.marketCap}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-base text-black">{item.volume}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};