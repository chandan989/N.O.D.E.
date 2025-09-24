import React from 'react';
import { WindowPanel } from '@/components/ui/window-panel';
import { Link } from 'react-router-dom';
import { useWalletStore } from '@/stores/wallet-store';

const SectionDivider: React.FC = () => (
    <div className="section-divider py-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
    </div>
);

const Dashboard: React.FC = () => {
  const { isConnected, accountId } = useWalletStore();

  return (
    <div className="container mx-auto px-6 py-8 text-xl space-y-8">
        <h1 className="text-5xl uppercase text-glow text-center mb-4">[DASHBOARD.EXE]</h1>

        <SectionDivider />

        <section id="system-status">
            <h2 className="text-4xl uppercase text-glow mb-12 text-center">// SYSTEM_DIAGNOSTICS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <WindowPanel title="CONNECTION.SYS">
                    <div className="space-y-2 min-h-[90px]">
                        <h3 className="text-xl text-glow">CONNECTION_STATUS</h3>
                        <p className="text-base">
                        STATUS: <span className={isConnected ? "text-glow" : "text-red-500"}>
                            {isConnected ? "[ONLINE]" : "[OFFLINE]"}
                        </span>
                        </p>
                        {isConnected && (
                        <p className="text-sm text-gray-400">NODE_ID: {accountId}</p>
                        )}
                    </div>
                </WindowPanel>
                
                <WindowPanel title="NETWORK.DAT">
                    <div className="space-y-2 min-h-[90px]">
                        <h3 className="text-xl text-glow">NETWORK_STATUS</h3>
                        <p className="text-base">NETWORK: <span className="text-glow">HEDERA_MAINNET</span></p>
                        <p className="text-base">LATENCY: <span className="text-glow">~2.8s</span></p>
                    </div>
                </WindowPanel>
                
                <WindowPanel title="PROTOCOL.CFG">
                    <div className="space-y-2 min-h-[90px]">
                        <h3 className="text-xl text-glow">PROTOCOL_VERSION</h3>
                        <p className="text-base">BUILD: <span className="text-glow">N.O.D.E.v1.1-GENESIS</span></p>
                        <p className="text-base">PHASE: <span className="text-glow">GENESIS Q4 2025</span></p>
                    </div>
                </WindowPanel>
            </div>
        </section>

        <SectionDivider />

        <section id="available-modules">
            <h2 className="text-4xl uppercase text-glow mb-12 text-center">// AVAILABLE_MODULES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <WindowPanel title="PAYMENTS.DLL">
                    <div className="flex flex-col justify-between h-full min-h-[120px]">
                        <p className="text-base text-gray-400 mb-4">
                            Anonymous HBAR payment system for the neighborhood network.
                        </p>
                        <Link to="/dashboard/payments">
                            <button className="btn-retro w-full">[INITIALIZE]</button>
                        </Link>
                    </div>
                </WindowPanel>

                <div className="opacity-60">
                    <WindowPanel title="VAULT.BAT">
                        <div className="flex flex-col justify-between h-full min-h-[120px]">
                            <p className="text-base text-gray-400 mb-4">
                                Autonomous vault for yield generation and collective staking.
                            </p>
                            <button disabled className="btn-retro w-full">[PHASE_2]</button>
                        </div>
                    </WindowPanel>
                </div>
            </div>
        </section>

        {!isConnected && (
            <>
                <SectionDivider />
                <section id="security-alert" className="max-w-3xl mx-auto text-left">
                    <h2 className="text-4xl uppercase text-red-500 mb-12 text-center">// SECURITY_ALERT</h2>
                    <WindowPanel title="ALERT.LOG">
                        <div className="log-item text-red-500">
                            <h3 className="text-2xl">WALLET NOT CONNECTED</h3>
                            <p className="mt-2 text-lg">
                            Connect your HashPack wallet to access N.O.D.E. Protocol features. All transactions are secured by Hedera Hashgraph.
                            </p>
                        </div>
                    </WindowPanel>
                </section>
            </>
        )}
    </div>
  );
};

export default Dashboard;
