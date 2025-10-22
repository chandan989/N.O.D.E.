import React from 'react';

const communityAssets = [
  { name: 'Community Solar Generator', progress: 75 },
  { name: 'Local WiFi Mesh Network', progress: 45 },
  { name: 'Tool Lending Library', progress: 90 },
];

const AssetProgress: React.FC<{ name: string; progress: number }> = ({ name, progress }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="font-bold text-lg">{name}</p>
        <p className="text-sm font-bold text-black">{progress}%</p>
      </div>
      <div className="w-full bg-gray-200 border-2 border-black">
        <div style={{ width: `${progress}%`}} className="h-4 bg-[#00FF00]"></div>
      </div>
    </div>
);

const UserAssetGlimpse: React.FC = () => {
  return (
    <div className="pixel-card p-6">
      <h3 className="text-3xl font-bold mb-4 text-black">COMMUNITY_ASSETS</h3>
      <div className="space-y-5 mb-6">
        {communityAssets.map((asset) => (
          <AssetProgress key={asset.name} name={asset.name} progress={asset.progress} />
        ))}
      </div>
      <div className="text-center">
        <a href="/dashboard/dao" className="btn-pixel">EXPLORE_ASSETS</a>
      </div>
    </div>
  );
};

export default UserAssetGlimpse;