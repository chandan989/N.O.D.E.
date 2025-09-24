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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {showBootloader && (
        <div id="bootloader" className="w-full h-full flex flex-col items-center justify-center">
          <img src="/logo.svg" alt="N.O.D.E. Logo" className="w-32 h-32 mb-8 animate-pulse" />
          <WindowPanel title="SYSTEM_BOOT.LOG" className="w-full max-w-3xl">
            <div id="boot-log" className="text-lg h-48 overflow-y-hidden text-left font-mono"></div>
          </WindowPanel>
          <span className="blinking-cursor text-2xl mt-4">█</span>
        </div>
      )}

      <div id="main-content" className="w-full h-full flex items-center justify-center" style={{ visibility: 'hidden', opacity: 0, transition: 'opacity 0.5s ease-in-out' }}>
        <div className="container mx-auto px-6 text-xl flex items-center justify-center">
            <WindowPanel title="SYSTEM.AUTH" className="w-full max-w-5xl">
                <div className="p-8 grid md:grid-cols-2 gap-8">
                    <div className="hidden h-full md:flex flex-col justify-center relative  p-4 rounded-md">
                        <pre className="text-glow" style={{ fontSize: '0.4rem', lineHeight: '1.1' }}>
                            {`
              _____                   _______                       _____                       _____
             /\\    \\               /::\\    \\                  /\\    \\                   /\\    \\
            /::\\____\\             /::::\\    \\                /::\\    \\                 /::\\    \\
           /::::|   |              /::::::\\    \\              /::::\\    \\               /::::\\    \\
          /:::::|   |             /::::::::\\    \\            /::::::\\    \\             /::::::\\    \\
         /::::::|   |            /:::/~~\\:::\\    \\         /:::/\\:::\\    \\          /:::/\\:::\\    \\
        /:::/|::|   |           /:::/    \\:::\\    \\       /:::/  \\:::\\    \\        /:::/__\\:::\\    \\
       /:::/ |::|   |          /:::/    / \\:::\\    \\     /:::/    \\:::\\    \\      /::::\\   \\:::\\    \\
      /:::/  |::|   | _____   /:::/____/   \\:::\\____\\   /:::/    / \\:::\\    \\    /::::::\\   \\:::\\    \\
     /:::/   |::|   |/\\    \\ |:::|    |     |:::|    | /:::/    /   \\:::\\ ___\  /:::/\\:::\\   \\:::\\    \\
    /:: /    |::|   /::\\____\\|:::|____|     |:::|    |/:::/____/     \\:::|    |/:::/__\\:::\\   \\:::\\____\\
    \\::/    /|::|  /:::/    / \\:::\\    \\   /:::/    / \\:::\\    \\     /:::|____|\\:::\\   \\:::\\   \\::/    /
     \\/____/ |::| /:::/    /   \\:::\\    \\ /:::/    /   \\:::\\    \\   /:::/    /  \\:::\\   \\:::\\   \\/____/
             |::|/:::/    /     \\:::\\    /:::/    /     \\:::\\    \\ /:::/    /    \\:::\\   \\:::\\    \\
             |::::::/    /       \\:::\\__/:::/    /       \\:::\\    /:::/    /      \\:::\\   \\:::\\____\\
             |:::::/    /         \\::::::::/    /         \\:::\\  /:::/    /        \\:::\\   \\::/    /
             |::::/    /           \\::::::/    /           \\:::\\/:::/    /          \\:::\\   \\/____/
             /:::/    /             \\::::/    /             \\::::::/    /            \\:::\\    \\
            /:::/    /               \\::/____/               \\::::/    /              \\:::\\____\\
            \\::/    /                 ~~                      \\::/____/                \\::/    /
             \\/____/                                           ~~                       \\/____/
                            `}
                        </pre>
                        <div className="mt-4 text-base text-center text-glow">
                            &gt; CONNECTION: [SECURE]<br/>
                            &gt; STATUS: [AWAITING AUTHENTICATION]
                        </div>
                    </div>
                    <section id="join" className="text-center md:text-left flex flex-col justify-center h-full">
                        <h2 className="text-3xl uppercase text-glow mb-6">
                            // AUTHENTICATION
                        </h2>
                        <p className="max-w-2xl mx-auto md:mx-0 mb-10 text-gray-400">
                            Select your access level to interface with the Neighborhood Operated Decentralized Economy.
                        </p>
                        <div className="flex flex-col items-center md:items-start gap-6">
                            <button onClick={() => setUserType('user')} className="btn-retro text-xl w-full md:w-auto">[USER ACCESS]</button>
                            <Link to="/business-login" className="btn-retro text-xl w-full md:w-auto text-center">[BUSINESS ACCESS]</Link>
                        </div>
                    </section>
                </div>
            </WindowPanel>
        </div>
      </div>
    </div>
  );
};
