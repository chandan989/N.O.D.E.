import React, { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/user-store';
import { Link } from 'react-router-dom';


export const UserTypeSelector: React.FC = () => {
  const { setUserType } = useUserStore();
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 2000);

    // Intersection Observer for fade-in animations
    const sections = document.querySelectorAll('.section-fade-in');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));

    return () => {
      clearTimeout(bootTimer);
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "'VT323', monospace",
      }}
      className="text-2xl bg-white text-black overflow-x-hidden"
    >
      {/* Preloader */}
      <div
        id="preloader-container"
        className={`fixed top-0 left-0 w-full h-full bg-black flex items-center justify-center z-[9999] transition-opacity duration-1000 ease-out ${isBooting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="preloader-logo">N</div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between border-2 border-black bg-white px-6 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-black font-bold text-3xl" style={{ color: '#00FF00' }}>N</div>
              <span className="text-3xl font-bold tracking-wider">N.O.D.E.</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#protocols" className="hover:text-green-500 transition-colors">PROTOCOLS</a>
              <a href="#architecture" className="hover:text-green-500 transition-colors">ARCHITECTURE</a>
              <a href="#roadmap" className="hover:text-green-500 transition-colors">ROADMAP</a>
            </nav>
            <a href="#join" className="hidden md:block btn-pixel !py-2 !px-5">JOIN_NETWORK</a>
          </div>
        </div>
      </header>

      <main className={`transition-opacity duration-700 ease-in ${isBooting ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 bg-grid-pattern">
          <div className="container mx-auto px-6 text-center z-10">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-4">
              NEIGHBORHOOD <br /> IS THE <span className="text-glow">NETWORK</span>.
            </h1>
            <p className="max-w-3xl mx-auto md:text-3xl mb-8">
              &gt; A protocol for a Neighborhood Operated Decentralized Economy, built on Hedera Hashgraph.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setUserType('user')}
                className="btn-pixel btn-pixel-primary"
              >
                USER_ACCESS
              </button>
              <Link
                to="/business-login"
                className="btn-pixel text-center"
              >
                BUSINESS_ACCESS
              </Link>
            </div>
          </div>
        </section>

        {/* Directive Section */}
        <section id="directive" className="py-20 md:py-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center section-fade-in pixel-card p-8">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">RECLAIM_YOUR_ECONOMY.EXE</h2>
              <p className="text-2xl">
                Centralized megacorps have siphoned our communities' lifeblood. N.O.D.E. severs those chains.
                It's a living economic organism for self-sovereign communities to build, share, and prosper together.
              </p>
            </div>
          </div>
        </section>

        {/* Core Protocols Section */}
        <section id="protocols" className="py-20 md:py-24 border-y-2 border-black" style={{ backgroundColor: '#F8F9FA' }}>
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 md:mb-16 section-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">CORE_PROTOCOLS</h2>
              <p className="text-2xl mt-2">// Foundational pillars of the N.O.D.E. ecosystem.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="pixel-card p-8 section-fade-in">
                <h3 className="text-4xl font-bold mb-2">GHOST_PAYMENTS</h3>
                <p className="text-xl">
                  Instant, direct, and virtually cost-free transactions that keep value circulating within the neighborhood.
                </p>
              </div>
              <div className="pixel-card p-8 section-fade-in">
                <h3 className="text-4xl font-bold mb-2">COLLECTIVE_ASSETS</h3>
                <p className="text-xl">
                  Tokenize real-world assets, fractionalize ownership, and democratize community access to capital goods.
                </p>
              </div>
              <div className="pixel-card p-8 section-fade-in">
                <h3 className="text-4xl font-bold mb-2">AUTONOMOUS_VAULT</h3>
                <p className="text-xl">
                  The community becomes the bank. Powered by liquidity pools offering fair yields and capital for entrepreneurs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* System Architecture Section */}
        <section id="architecture" className="py-20 md:py-32 bg-grid-pattern">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 md:mb-16 section-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                SYSTEM <span className="text-glow">ARCHITECTURE</span>
              </h2>
              <p className="text-2xl mt-2">// A multi-layered, decentralized trust fabric.</p>
            </div>
            <div className="max-w-5xl mx-auto section-fade-in">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="w-full max-w-lg p-4 border-2 border-black bg-white/80 backdrop-blur-sm">
                  <p className="text-lg font-bold tracking-widest" style={{ color: '#00FF00' }}>[ APPLICATION LAYER ]</p>
                  <h3 className="text-3xl font-semibold">SOCIAL_FABRIC_AGENTS</h3>
                </div>
                <div className="text-4xl font-black text-glow">V</div>
                <div className="w-full max-w-2xl p-4 border-2 border-black bg-white/80 backdrop-blur-sm">
                  <p className="text-lg font-bold tracking-widest" style={{ color: '#00FF00' }}>[ PROTOCOL LAYER ]</p>
                  <h3 className="text-3xl font-semibold mb-4">N.O.D.E._CORE_CONTRACTS</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xl font-semibold">
                    <div className="border-2 border-black p-2">GHOST_PAYMENTS</div>
                    <div className="border-2 border-black p-2">COLLECTIVE_ASSETS</div>
                    <div className="border-2 border-black p-2">AUTONOMOUS_VAULT</div>
                  </div>
                </div>
                <div className="text-4xl font-black text-glow">V</div>
                <div className="w-full max-w-lg p-4 border-2 border-black bg-white/80 backdrop-blur-sm">
                  <p className="text-lg font-bold tracking-widest" style={{ color: '#00FF00' }}>[ CONSENSUS LAYER ]</p>
                  <h3 className="text-3xl font-semibold">HEDERA_HASHGRAPH</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="py-20 md:py-24 border-y-2 border-black bg-gray-100">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 md:mb-16 section-fade-in">
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tight">ACTIVATION_SEQUENCE.LOG</h2>
                    <p className="text-2xl mt-2">// Strategic rollout for building the network.</p>
                </div>
                <div className="max-w-7xl mx-auto section-fade-in">
                    <div className="relative">
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-green-500/50 -translate-y-1/2"></div>
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-green-500/50 -translate-y-1/2 animate-pulse"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                            <div className="text-center pixel-card p-6 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-green-500 border-2 border-black rotate-45"></div>
                                <p className="text-xl font-semibold text-green-400 mb-2 mt-4">PHASE 1</p>
                                <h3 className="text-2xl font-bold mb-2">GENESIS</h3>
                                <p className="text-lg mb-2">(Q4 2025)</p>
                                <p className="text-base">Core contracts deployed, wallet integrated, first founding nodes onboarded.</p>
                                <div className="mt-4"><span className="py-1 px-3 bg-green-500 text-black text-sm font-bold">COMPLETE</span></div>
                            </div>
                            <div className="text-center pixel-card p-6 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-700 border-2 border-black rotate-45"></div>
                                <p className="text-xl font-semibold text-green-400 mb-2 mt-4">PHASE 2</p>
                                <h3 className="text-2xl font-bold mb-2">SYMBIOSIS</h3>
                                <p className="text-lg mb-2">(Q1-Q2 2026)</p>
                                <p className="text-base">N.O.D.E. Vault launch, adaptive lending active, first CAO live.</p>
                                <div className="mt-4"><span className="py-1 px-3 bg-gray-700 text-white text-sm font-bold">UPCOMING</span></div>
                            </div>
                            <div className="text-center pixel-card p-6 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-700 border-2 border-black rotate-45"></div>
                                <p className="text-xl font-semibold text-green-400 mb-2 mt-4">PHASE 3</p>
                                <h3 className="text-2xl font-bold mb-2">EXPANSION</h3>
                                <p className="text-lg mb-2">(Q3-Q4 2026)</p>
                                <p className="text-base">Rapid onboarding tools, cross-neighborhood transfers, and transition to full DAO governance.</p>
                                <div className="mt-4"><span className="py-1 px-3 bg-gray-700 text-white text-sm font-bold">UPCOMING</span></div>
                            </div>
                            <div className="text-center pixel-card p-6 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-700 border-2 border-black rotate-45"></div>
                                <p className="text-xl font-semibold text-green-400 mb-2 mt-4">PHASE 4</p>
                                <h3 className="text-2xl font-bold mb-2">EMERGENCE</h3>
                                <p className="text-lg mb-2">(2027+)</p>
                                <p className="text-base">Autonomous inter-N.O.D.E. trade, AI optimization, and a global federation of communities.</p>
                                <div className="mt-4"><span className="py-1 px-3 bg-gray-700 text-white text-sm font-bold">FUTURE</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Call to Action */}
        <section id="join" className="py-20 md:py-32">
            <div className="container mx-auto px-6 text-center section-fade-in">
                <h2 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">JOIN_THE_MOVEMENT</h2>
                <p className="max-w-2xl mx-auto mb-8 text-2xl">This is a paradigm shift. We call the architects of tomorrow, the digital artisans, the decentralized dreamers to build with us.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="#" className="btn-pixel btn-pixel-primary">GET_WHITELISTED</a>
                    <a href="#" className="btn-pixel">REGISTER_A_NODE</a>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-black mt-16 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-3xl font-semibold">N.O.D.E. PROTOCOL</p>
              <p className="text-xl">// Forged by the collective. Owned by the community.</p>
            </div>
            <div className="flex gap-6 text-xl">
              <a href="#" className="hover:text-green-500 transition-colors">DISCORD</a>
              <a href="https://github.com/chandan989/N.O.D.E." target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">GITHUB</a>
              <a href="#" className="hover:text-green-500 transition-colors">WHITEPAPER</a>
            </div>
          </div>
          <div className="text-center mt-8 text-lg">
            <p>
              Powered by <a href="https://hedera.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">Hedera Hashgraph</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
