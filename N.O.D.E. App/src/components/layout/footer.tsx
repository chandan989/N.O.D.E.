import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {

  return (
    <footer className="border-t-2 border-black mt-16 bg-white">
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                     <p className="text-3xl font-semibold">N.O.D.E. PROTOCOL</p>
                     <p className="text-xl">// Forged by the collective. Owned by the community.</p>
                </div>
                <div className="flex gap-6 text-xl">
                    <a href="#" className="hover:text-green-500 transition-colors">DISCORD</a>
                    <a href="https://github.com/chandan989/N.O.D.E." target="_blank" className="hover:text-green-500 transition-colors">GITHUB</a>
                    <a href="#" className="hover:text-green-500 transition-colors">WHITEPAPER</a>
                </div>
            </div>
             <div className="text-center mt-8 text-lg">
                 <p>Powered by <a href="https://hedera.com/" target="_blank" rel="noopener noreferrer" className="hover:text-green-500">Hedera Hashgraph</a></p>
            </div>
        </div>
    </footer>
  );
};
