
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
import { MyBusinessStatus } from '@/components/features/UserLocalExchange/MyBusinessStatus';
import ListYourBusiness from '@/components/features/UserLocalExchange/ListYourBusiness';

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

const HistoricalPerformanceChart: React.FC<{ ticker?: string }> = ({ ticker }) => (
    <div className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-lg h-48 flex items-center justify-center">
            <p className="text-gray-500">[Chart for {ticker || 'selected asset'} will be displayed here]</p>
        </div>
        <div className="flex justify-around">
            <button className="btn-pixel !py-1 !px-2 text-sm">1D</button>
            <button className="btn-pixel !py-1 !px-2 text-sm">7D</button>
            <button className="btn-pixel !py-1 !px-2 text-sm">1M</button>
            <button className="btn-pixel !py-1 !px-2 text-sm">1Y</button>
            <button className="btn-pixel !py-1 !px-2 text-sm">ALL</button>
        </div>
    </div>
);

const componentRegistry = {
  MarketList, MarketOverview, AssetDetailView, CommunityFeed, NewsAndLearning, ExchangeDataTable, AdvancedAnalytics, HistoricalPerformanceChart, MyBusinessStatus, ListYourBusiness
};

const initialLayout = [
    // Main Column
    { id: 'marketList', title: 'Market List', component: 'MarketList', column: 'main', isExpandable: true, isExpanded: true },
    { id: 'assetDetails', title: 'Asset Details', component: 'AssetDetailView', column: 'main', isExpandable: true, isExpanded: true },
    { id: 'historicalPerformance', title: 'Historical Performance', component: 'HistoricalPerformanceChart', column: 'main', isExpandable: true, isExpanded: true },
    { id: 'marketData', title: 'Order Book & Trades', component: 'ExchangeDataTable', column: 'main', isExpandable: true, isExpanded: true },

    // Sidebar Column
    { id: 'listYourBusiness', title: 'List Your Business', component: 'ListYourBusiness', column: 'sidebar', isExpandable: false, isExpanded: true },
    { id: 'myBusinessStatus', title: 'My Business', component: 'MyBusinessStatus', column: 'sidebar', isExpandable: false, isExpanded: true },
    { id: 'marketOverview', title: 'Market Overview', component: 'MarketOverview', column: 'sidebar', isExpandable: true, isExpanded: true },
    { id: 'advancedAnalytics', title: 'Advanced Analytics', component: 'AdvancedAnalytics', column: 'sidebar', isExpandable: true, isExpanded: false },
    { id: 'communityFeed', title: 'Community Feed', component: 'CommunityFeed', column: 'sidebar', isExpandable: true, isExpanded: true },
    { id: 'newsAndLearning', title: 'News & Learning', component: 'NewsAndLearning', column: 'sidebar', isExpandable: true, isExpanded: false },
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
      <div className="pixel-card p-6 w-full max-w-3xl max-h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-glow">CUSTOMIZE_LAYOUT</h2>
          <button onClick={onClose} className="btn-pixel">CLOSE</button>
        </div>
        <div className="space-y-4">
          {layout.map((widget, index) => (
            <div key={widget.id} className="pixel-card-sm flex flex-col sm:flex-row items-center justify-between p-3">
              <div className="font-semibold text-black mb-2 sm:mb-0">{widget.title}</div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center sm:justify-end">
                <div className="relative inline-block">
                  <select value={widget.column} onChange={(e) => handleColumnChange(widget.id, e.target.value)} className="appearance-none bg-gray-900 border-2 border-black text-white py-1 px-2 pr-8 rounded-none text-sm focus:outline-none focus:ring-0 focus:border-cyan-400">
                    <option value="main">MAIN</option>
                    <option value="sidebar">SIDEBAR</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-black">EXPANDABLE</label>
                  <Switch checked={widget.isExpandable} onCheckedChange={() => handleToggle(widget.id, 'isExpandable')} />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-black">EXPANDED</label>
                  <Switch checked={widget.isExpanded} onCheckedChange={() => handleToggle(widget.id, 'isExpanded')} disabled={!widget.isExpandable} />
                </div>
                <div className="flex gap-1">
                  <button className="btn-pixel !py-1 !px-2 text-sm" onClick={() => handleMove(index, -1)} disabled={index === 0}>UP</button>
                  <button className="btn-pixel !py-1 !px-2 text-sm" onClick={() => handleMove(index, 1)} disabled={index === layout.length - 1}>DOWN</button>
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
const LocalExchange: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState(mockTopCompanies[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isListed, setIsListed] = useState(false); // Mock state for business listing

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

    if (widget.component === 'MyBusinessStatus' && !isListed) {
      return null;
    }
    if (widget.component === 'ListYourBusiness' && isListed) {
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
    if (widget.component === 'HistoricalPerformanceChart') {
      props.ticker = selectedCompany?.ticker;
    }

    return (
      <WindowPanel key={widget.id} title={widget.title} {...props}>
        <Component {...props} />
      </WindowPanel>
    );
  };

  const columns = useMemo(() => {
    return {
      main: layoutConfig.filter(w => w.column === 'main'),
      sidebar: layoutConfig.filter(w => w.column === 'sidebar'),
    };
  }, [layoutConfig]);

  return (
    <div className="space-y-8 py-8 px-4 mt-10">
        {isSettingsOpen && <LayoutSettingsPanel layout={layoutConfig} onLayoutChange={setLayoutConfig} onClose={() => setIsSettingsOpen(false)} />}
        
        <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">LOCAL <span className="text-glow">EXCHANGE</span></h1>
            <p className="text-2xl mt-2 text-gray-500">// Your Community Marketplace</p>
            <div className="flex justify-center mt-4">
                <InfoTrigger title="N.O.D.E. Local Exchange" description="This is a data and analytics platform. You can list your business for tokenization and analyze how other businesses are performing."/>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">{columns.main.map(renderWidget)}</div>
          <div className="lg:col-span-1 space-y-6">{columns.sidebar.map(renderWidget)}</div>
        </div>

      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={() => setIsSettingsOpen(true)} 
          className="btn-pixel"
        >
            CUSTOMIZE_VIEW
        </button>
      </div>
    </div>
  );
};

export default LocalExchange;
