
import React, { useState, useMemo, useEffect } from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { InfoTrigger } from '@/components/features/info-trigger';
import { MarketOverview } from '@/components/features/UserLocalExchange/MarketOverview';
import { MarketList } from '@/components/features/UserLocalExchange/MarketList';
import { AssetDetailView } from '@/components/features/UserLocalExchange/AssetDetailView';
import { CommunityFeed } from '@/components/features/UserLocalExchange/CommunityFeed';
import { NewsAndLearning } from '@/components/features/UserLocalExchange/NewsAndLearning';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ExchangeDataTable } from '@/components/features/exchange-data-table';

// --- MOCK DATA & COMPONENT REGISTRY ---
const mockTopCompanies = [
  { id: 1, name: 'Local Cafe', ticker: 'LCAFE', price: 25.50, change: 1.25, marketCap: '1.2M' },
  { id: 2, name: 'Indie Bookstore', ticker: 'IBOOK', price: 15.75, change: -0.50, marketCap: '800K' },
  { id: 3, name: 'Community Farm', ticker: 'CFARM', price: 42.10, change: 2.15, marketCap: '3.5M' },
];

const AdvancedAnalytics: React.FC = () => (
    <div className="space-y-4">
        <h3 className="text-lg sm:text-xl text-glow">Advanced Analytics</h3>
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-md text-glow mb-2">Market Sentiment</h4>
            <div className="flex items-center justify-between text-sm mb-1">
                <span>LCAFE</span>
                <span className="text-green-400">Bullish (78%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '78%' }}></div>
            </div>
            <div className="flex items-center justify-between text-sm mt-2 mb-1">
                <span>IBOOK</span>
                <span className="text-red-400">Bearish (62%)</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-red-500 h-1.5 rounded-full" style={{ width: '62%' }}></div>
            </div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-md text-glow mb-2">Top Movers</h4>
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">Top Gainer:</span>
                <span className="text-green-400">CFARM +5.1%</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">Top Loser:</span>
                <span className="text-red-400">IBOOK -3.2%</span>
            </div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
            <h4 className="text-md text-glow mb-2">Trading Volume (24h)</h4>
            <div className="flex justify-between text-sm">
                <span className="text-gray-400">LCAFE:</span>
                <span>$150,000</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">IBOOK:</span>
                <span>$75,000</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-400">CFARM:</span>
                <span>$320,000</span>
            </div>
        </div>
        <p className="text-xs text-gray-500 text-center">
            Analytics are based on mock data and community sentiment analysis.
        </p>
    </div>
);

const componentRegistry = {
  MarketList, MarketOverview, AssetDetailView, CommunityFeed, NewsAndLearning, ExchangeDataTable, AdvancedAnalytics
};

const initialLayout = [
    // Left Column: Navigation
    { id: 'marketList', title: 'Market List', component: 'MarketList', column: 'left', isExpandable: true, isExpanded: true },
    
    // Center Column: Focused Asset
    { id: 'assetDetails', title: 'Asset Details', component: 'AssetDetailView', column: 'center', isExpandable: true, isExpanded: true },
    { id: 'marketData', title: 'Order Book & Trades', component: 'ExchangeDataTable', column: 'center', isExpandable: true, isExpanded: true },

    // Right Column: Market & Social
    { id: 'marketOverview', title: 'Market Overview', component: 'MarketOverview', column: 'right', isExpandable: true, isExpanded: true },
    { id: 'advancedAnalytics', title: 'Advanced Analytics', component: 'AdvancedAnalytics', column: 'right', isExpandable: true, isExpanded: false },
    { id: 'communityFeed', title: 'Community Feed', component: 'CommunityFeed', column: 'right', isExpandable: true, isExpanded: true },
    { id: 'newsAndLearning', title: 'News & Learning', component: 'NewsAndLearning', column: 'right', isExpandable: true, isExpanded: false },
];

// --- SETTINGS PANEL COMPONENT ---
const LayoutSettingsPanel = ({ layout, onLayoutChange, onClose }) => {
  const handleMove = (index, direction) => {
    const newLayout = [...layout];
    const [item] = newLayout.splice(index, 1);
    newLayout.splice(index + direction, 0, item);
    onLayoutChange(newLayout);
  };

  const handleColumnChange = (id, column) => {
    const newLayout = layout.map(item => item.id === id ? { ...item, column } : item);
    onLayoutChange(newLayout);
  };

  const handleToggle = (id, key) => {
    const newLayout = layout.map(item => item.id === id ? { ...item, [key]: !item[key] } : item);
    onLayoutChange(newLayout);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center p-4">
      <div className="bg-gray-900 border border-cyan-700 rounded-lg p-6 w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-glow">Customize Layout</h2>
          <Button onClick={onClose} variant="ghost">Close</Button>
        </div>
        <div className="space-y-4">
          {layout.map((widget, index) => (
            <div key={widget.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="font-semibold text-white/90">{widget.title}</div>
              <div className="flex items-center gap-4">
                <select value={widget.column} onChange={(e) => handleColumnChange(widget.id, e.target.value)} className="bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm">
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Expandable</label>
                  <Switch checked={widget.isExpandable} onCheckedChange={() => handleToggle(widget.id, 'isExpandable')} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Expanded</label>
                  <Switch checked={widget.isExpanded} onCheckedChange={() => handleToggle(widget.id, 'isExpanded')} disabled={!widget.isExpandable} />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleMove(index, -1)} disabled={index === 0}>Up</Button>
                  <Button size="sm" variant="outline" onClick={() => handleMove(index, 1)} disabled={index === layout.length - 1}>Down</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const UserLocalExchange: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState(mockTopCompanies[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSettingsHovered, setIsSettingsHovered] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState(() => {
    try {
      const savedLayoutJSON = localStorage.getItem('userLocalExchangeLayout');
      if (savedLayoutJSON) {
        const savedLayout = JSON.parse(savedLayoutJSON);
        const savedIds = new Set(savedLayout.map(w => w.id));
        const newWidgets = initialLayout.filter(w => !savedIds.has(w.id));
        const initialIds = new Set(initialLayout.map(w => w.id));
        const finalSavedLayout = savedLayout.filter(w => initialIds.has(w.id));
        return [...finalSavedLayout, ...newWidgets];
      }
      return initialLayout;
    } catch (error) {
      console.error("Failed to parse layout from localStorage", error);
      return initialLayout;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('userLocalExchangeLayout', JSON.stringify(layoutConfig));
    } catch (error) {
      console.error("Failed to save layout to localStorage", error);
    }
  }, [layoutConfig]);

  const handleWidgetToggle = (widgetId: string) => {
    const newLayout = layoutConfig.map(widget =>
      widget.id === widgetId ? { ...widget, isExpanded: !widget.isExpanded } : widget
    );
    setLayoutConfig(newLayout);
  };

  const renderWidget = (widget) => {
    const Component = componentRegistry[widget.component];
    if (!Component) {
        return null;
    }

    let props: any = {
      isExpandable: widget.isExpandable,
      isExpanded: widget.isExpanded,
      onToggleExpand: () => handleWidgetToggle(widget.id),
    };

    if (widget.component === 'MarketList') {
      props.onSelectCompany = setSelectedCompany;
    }
    if (widget.component === 'AssetDetailView') {
      props.company = selectedCompany;
    }

    return (
      <WindowPanel key={widget.id} title={widget.title}>
        <Component {...props} />
      </WindowPanel>
    );
  };

  const columns = useMemo(() => {
    return {
      left: layoutConfig.filter(w => w.column === 'left'),
      center: layoutConfig.filter(w => w.column === 'center'),
      right: layoutConfig.filter(w => w.column === 'right'),
    };
  }, [layoutConfig]);

  return (
    <div className="pb-24">
      <div className="container mx-auto px-4 py-8 text-base space-y-8">
        {isSettingsOpen && <LayoutSettingsPanel layout={layoutConfig} onLayoutChange={setLayoutConfig} onClose={() => setIsSettingsOpen(false)} />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl uppercase text-glow">Local Exchange</h1>
                <p className="text-lg text-cyan-300/70 tracking-widest">Your Community Marketplace</p>
              </div>
              <InfoTrigger title="N.O.D.E. Local Exchange" description="This is a data and analytics platform to analyze how local businesses and community projects are performing."/>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-6">{columns.left.map(renderWidget)}</div>
          <div className="lg:col-span-6 space-y-6">{columns.center.map(renderWidget)}</div>
          <div className="lg:col-span-3 space-y-6">{columns.right.map(renderWidget)}</div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-40">
        <Button 
          onClick={() => setIsSettingsOpen(true)} 
          onMouseEnter={() => setIsSettingsHovered(true)}
          onMouseLeave={() => setIsSettingsHovered(false)}
          className={`group transition-all duration-300 ease-in-out rounded-full flex items-center justify-center bg-gray-900/80 hover:bg-gray-900/80 backdrop-blur-sm border border-cyan-700/50 text-cyan-400 shadow-lg shadow-cyan-500/20 ${isSettingsHovered ? 'w-48 h-16' : 'w-16 h-16'}`}
        >
            <div className={`absolute transition-all duration-300 ease-in-out ${isSettingsHovered ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.438.995s.145.755.438.995l1.003.827c.424.35.534.954.26 1.431l-1.296 2.247a1.125 1.125 0 01-1.37.49l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.127c-.331.183-.581.495-.644.87l.213 1.281c-.09.543-.56.94-1.11.94h-2.593c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.063-.374-.313.686-.645-.87a6.52 6.52 0 01-.22-.127c-.324-.196-.72-.257-1.075-.124l-1.217.456a1.125 1.125 0 01-1.37-.49l-1.296-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.437-.995s-.145-.755-.437-.995l-1.004-.827a1.125 1.125 0 01-.26-1.431l1.296-2.247a1.125 1.125 0 011.37-.49l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.127.331-.183.581.495.644-.87l.213-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </div>
            <div className={`absolute transition-all duration-300 ease-in-out ${isSettingsHovered ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}>
                 <span className="text-base font-semibold">Customize View</span>
            </div>
        </Button>
      </div>
    </div>
  );
};

export default UserLocalExchange;
