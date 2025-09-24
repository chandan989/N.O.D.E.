
import React from 'react';

// --- Mock Data ---
const mockNews = [
    {
        id: 1, headline: 'Local Markets Surge as New Community Projects Launch',
        source: 'Local Business Times', tickers: ['LCAFE', 'CFARM'], image: '/placeholder.svg'
    },
    {
        id: 2, headline: 'Is Tech Startup A the Next Big Thing? Analysts Weigh In',
        source: 'TechInvest Daily', tickers: ['TSA'], image: '/placeholder.svg'
    },
    {
        id: 3, headline: 'Brewery Expansion Boosts Local Economy',
        source: 'Community Herald', tickers: ['LBREW'], image: '/placeholder.svg'
    },
];

const mockLearning = [
    { id: 1, title: 'Investing 101: A Beginner\'s Guide', category: 'Basics' },
    { id: 2, title: 'Understanding Market Caps & P/E Ratios', category: 'Advanced' },
    { id: 3, title: 'How NFTs Power Local Exchange', category: 'Community' },
];

// --- Components ---

const NewsCard = ({ article }) => (
    <div className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800/50">
        <img src={article.image} alt="News" className="w-24 h-16 object-cover rounded flex-shrink-0" />
        <div>
            <p className="font-semibold text-white/90 text-sm">{article.headline}</p>
            <p className="text-xs text-gray-400">{article.source} - <span className="text-cyan-400 font-mono">{article.tickers.join(', ')}</span></p>
        </div>
    </div>
);

const LearningItem = ({ resource }) => (
    <div className="p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer">
        <p className="font-semibold text-sm">{resource.title}</p>
        <p className="text-xs text-cyan-500">{resource.category}</p>
    </div>
)

export const NewsAndLearning = ({ isExpandable, isExpanded, onToggleExpand }) => {
  const newsToShow = isExpanded ? mockNews : mockNews.slice(0, 1);
  const learningToShow = isExpanded ? mockLearning : mockLearning.slice(0, 1);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-glow mb-2">Latest News</h3>
        <div className="space-y-2">
          {newsToShow.map(article => <NewsCard key={article.id} article={article} />)}
        </div>
      </div>

      <div className="pt-4 border-t border-cyan-900/50">
        <h3 className="text-lg font-bold text-glow mb-2">Learning Hub</h3>
        <div className="space-y-1">
          {learningToShow.map(res => <LearningItem key={res.id} resource={res} />)}
        </div>
      </div>

      {isExpandable && (
        <div className="mt-4 text-center">
          <button
            onClick={onToggleExpand}
            className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold text-sm"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};
