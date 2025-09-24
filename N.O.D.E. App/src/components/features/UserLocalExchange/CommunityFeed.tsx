import React from 'react';
import { Button } from '@/components/ui/button';

// --- Mock Data ---
const mockPosts = [
    {
        id: 1, user: 'TraderJoe', content: 'LCAFE is going to the moon! Their new cold brew is a game changer.',
        likes: 15, comments: 4, ticker: 'LCAFE'
    },
    {
        id: 2, user: 'ValueInvestor', content: 'IBOOK seems undervalued. Solid fundamentals and loyal customer base.',
        likes: 8, comments: 2, ticker: 'IBOOK'
    },
    {
        id: 3, user: 'CryptoKing', content: 'Just bought my first community NFT! The process was seamless. #LBREW',
        likes: 22, comments: 9, ticker: 'LBREW'
    },
];

const mockPoll = {
    question: "Which sector are you most bullish on?",
    options: ["Food & Bev", "Tech", "Retail"],
    votes: [45, 35, 20]
};

// --- Components ---

const PostCard = ({ post }) => (
    <div className="bg-gray-800/50 p-3 rounded-lg">
        <div className="flex items-center mb-2">
            <p className="font-semibold text-cyan-400">@{post.user}</p>
            {post.ticker && <span className="mx-2 text-gray-500">·</span>}
            {post.ticker && <p className="text-sm text-gray-500 font-mono">${post.ticker}</p>}
        </div>
        <p className="text-white/90 text-sm">{post.content}</p>
        <div className="flex items-center text-xs text-gray-400 mt-2">
            <span>{post.likes} Likes</span>
            <span className="mx-2">·</span>
            <span>{post.comments} Comments</span>
        </div>
    </div>
)

const PollCard = ({ poll }) => (
    <div className="bg-gray-800/50 p-4 rounded-lg">
        <p className="font-semibold mb-3 text-center">{poll.question}</p>
        <div className="space-y-2">
            {poll.options.map((option, index) => (
                 <Button variant="outline" className="w-full justify-between">
                    {option} <span className="font-bold">{poll.votes[index]}%</span>
                </Button>
            ))}
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">1,204 votes</p>
    </div>
)

export const CommunityFeed = ({ isExpandable, isExpanded, onToggleExpand }) => {
  const postsToShow = isExpanded ? mockPosts : mockPosts.slice(0, 1);

  return (
    <div className="space-y-4">
        <div className="space-y-4">
            {postsToShow.map(post => <PostCard key={post.id} post={post} />)}
        </div>
        
        {isExpanded && (
            <div className="space-y-4 pt-4 border-t border-cyan-900/50">
                <PollCard poll={mockPoll} />
                <div>
                    <h4 className="font-semibold mb-2">Trending</h4>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-cyan-900/50 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-cyan-800">#LocalInvesting</span>
                        <span className="bg-cyan-900/50 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-cyan-800">#Community</span>
                        <span className="bg-cyan-900/50 px-2 py-1 rounded-full text-sm cursor-pointer hover:bg-cyan-800">#NFTs</span>
                    </div>
                </div>
            </div>
        )}

        {isExpandable && (
            <div className="mt-4 text-center">
                <button
                    onClick={onToggleExpand}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold text-sm"
                >
                    {isExpanded ? 'Show Less' : 'Expand Feed'}
                </button>
            </div>
        )}
    </div>
  );
};
