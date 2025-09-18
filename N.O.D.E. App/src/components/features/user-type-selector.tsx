
import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';

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
          setTimeout(type, 5); // Faster typing speed
        } else {
          bootLog.innerHTML += '<br />';
          lineIndex++;
          charIndex = 0;
          setTimeout(type, 50); // Faster line break speed
        }
      } else {
        setTimeout(() => {
          setShowBootloader(false);
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
          }
        }, 250); // Faster transition to main content
      }
    };

    type();
  }, []);

  return (
    <div>
      {showBootloader && (
        <div id="bootloader">
          <img src="/logo.svg" alt="N.O.D.E. Logo" className="w-32 h-32 mb-8 text-glow" />
          <div className="w-full max-w-3xl">
            <div id="boot-log" className="text-xl h-48 overflow-y-hidden text-left"></div>
          </div>
          <span className="blinking-cursor text-xl mt-4">█</span>
        </div>
      )}

      <div id="main-content">
        <div className="container mx-auto px-6 py-16 text-xl"> {/* Increased vertical padding */}
          <section id="join" className="text-center py-16"> {/* Increased vertical padding */}
            <h2 className="text-5xl uppercase text-glow mb-8" data-type-effect> {/* Increased font size and margin */}
              &gt; AUTHENTICATION REQUIRED
            </h2>
            <p className="max-w-3xl mx-auto mb-12 text-2xl" data-type-effect> {/* Increased max-width, margin and font-size*/}
              Select your access level to interface with the Neighborhood Operated Decentralized Economy.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8"> {/* Increased gap */}
              <button onClick={() => setUserType('user')} className="btn-retro text-3xl px-8 py-4">[ USER ACCESS ]</button> {/* Increased font size and padding */}
              <button onClick={() => setUserType('business')} className="btn-retro text-3xl px-8 py-4">[ BUSINESS ACCESS ]</button> {/* Increased font size and padding */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
