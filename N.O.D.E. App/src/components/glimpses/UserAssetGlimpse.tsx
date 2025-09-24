import React from 'react';
import { Progress } from "@/components/ui/progress";
import { WindowPanel } from '@/components/ui/window-panel';

// Mock data for community assets based on UserDAO.tsx
const communityAssets = [
  { name: 'Community Solar Generator', progress: 75 },
  { name: 'Local WiFi Mesh Network', progress: 45 },
  { name: 'Tool Lending Library', progress: 90 },
];

const UserAssetGlimpse: React.FC = () => {
  return (
    <WindowPanel title="Community Assets">
      <div className="p-4">
        <div className="space-y-4">
          {communityAssets.map((asset) => (
            <div key={asset.name}>
              <div className="flex justify-between items-center mb-1">
                <p className="font-semibold">{asset.name}</p>
                <p className="text-sm text-primary">{asset.progress}% Funded</p>
              </div>
              <Progress value={asset.progress} />
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <a href="/community-assets" className="text-primary hover:text-glow font-bold">Explore Assets &gt;</a>
        </div>
      </div>
    </WindowPanel>
  );
};

export default UserAssetGlimpse;
