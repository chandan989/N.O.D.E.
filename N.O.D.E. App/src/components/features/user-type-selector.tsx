import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { WindowPanel } from '@/components/ui/window-panel';
import { Link } from 'react-router-dom';

export const UserTypeSelector: React.FC = () => {
  const { setUserType } = useUserStore();
  const [showBootloader, setShowBootloader] = useState(true);

  useEffect(() => {
    const bootLog = document.getElementById('boot-log');
    if (!bootLog) return;

    const lines = [
      'INITIALIZING N.O.D.E. PROTOCOL...',
      'QUANTUM LINK ESTABLISHED.',
      'DECRYPTING LOCAL ECONOMIC DATA...',
      'ACCESSING HEDERA HASHGRAPH...',
      'CONSENSUS REACHED.',
      'SYSTEM READY.',
      'AWAITING USER DIRECTIVE...',
    ];

    let lineIndex = 0;
    let charIndex = 0;

    const type = () => {
      if (lineIndex < lines.length) {
        const line = lines[lineIndex];
        if (charIndex < line.length) {
          bootLog.innerHTML += line.charAt(charIndex);
          charIndex++;
          setTimeout(type, 10);
        } else {
          bootLog.innerHTML += '<br />';
          lineIndex++;
          charIndex = 0;
          setTimeout(type, 50);
        }
      } else {
        setTimeout(() => {
          setShowBootloader(false);
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
          }
        }, 500);
      }
    };

    type();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-grid-pattern text-2xl">
      {showBootloader && (
        <div id="bootloader" className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center bg-black text-green-400 font-bold text-5xl mb-8">N</div>
          <WindowPanel title="SYSTEM_BOOT.LOG" className="w-full max-w-3xl">
            <div id="boot-log" className="text-lg h-48 overflow-y-auto text-left font-mono p-4"></div>
          </WindowPanel>
          <span className="blinking-cursor text-2xl mt-4">█</span>
        </div>
      )}

      <div id="main-content" className="w-full h-full flex items-center justify-center" style={{ visibility: 'hidden', opacity: 0, transition: 'opacity 0.5s ease-in-out' }}>
        <div className="container mx-auto px-6 text-xl flex items-center justify-center">
            <div className="pixel-card p-8 md:p-12 text-center max-w-4xl">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">AUTHENTICATION REQUIRED</h2>
                <p className="text-2xl mb-8">
                    Select your access level to interface with the Neighborhood Operated Decentralized Economy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={() => setUserType('user')} className="btn-pixel btn-pixel-primary">USER_ACCESS</button>
                    <Link to="/business-login" className="btn-pixel text-center">BUSINESS_ACCESS</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
