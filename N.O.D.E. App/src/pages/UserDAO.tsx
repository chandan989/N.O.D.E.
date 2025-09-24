
import React from 'react';
import { Users, Zap, BarChart, CheckSquare, PieChart, Landmark, Vote, ShieldCheck, FileText, MessageSquare } from 'lucide-react';

const UserDAO = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md z-10 p-4 flex justify-between items-center">
        <div>
          <span className="text-xl font-bold">N.O.D.E. Collective</span>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a href="#" className="hover:text-gray-300">Marketplace</a>
          <a href="#" className="hover:text-gray-300">My Assets</a>
          <a href="#" className="hover:text-gray-300">Proposals</a>
          <a href="#" className="hover:text-gray-300">Governance</a>
          <a href="#" className="hover:text-gray-300">Community</a>
        </div>
        <div className="flex items-center space-x-4">
          <input type="search" placeholder="Search assets..." className="bg-gray-800 rounded-full px-4 py-2 focus:outline-none" />
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">Connect Wallet</button>
        </div>
      </nav>

      <main className="pt-20">
        {/* 2. DAO Overview Section */}
        <section className="text-center p-10">
          <h1 className="text-5xl font-bold">Own Assets Together, Build the Future Collectively</h1>
          <p className="text-lg mt-4">Invest in community infrastructure and decide together what to fund through DAO voting.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-center">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
              <Users className="mx-auto text-cyan-400" size={48} />
              <p className="text-3xl font-bold mt-4">1,234</p>
              <p className="text-gray-400">Members in DAO</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-green-500/50 transition-shadow duration-300">
              <Zap className="mx-auto text-green-400" size={48} />
              <p className="text-3xl font-bold mt-4">42</p>
              <p className="text-gray-400">Assets Owned</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-yellow-500/50 transition-shadow duration-300">
              <BarChart className="mx-auto text-yellow-400" size={48} />
              <p className="text-3xl font-bold mt-4">$5.6M</p>
              <p className="text-gray-400">Total Value Locked</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300">
              <CheckSquare className="mx-auto text-purple-400" size={48} />
              <p className="text-3xl font-bold mt-4">89</p>
              <p className="text-gray-400">Proposals Voted On</p>
            </div>
          </div>
          <div className="mt-10">
            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full mr-4">Join DAO & Contribute</button>
            <button className="bg-transparent border border-white hover:bg-white hover:text-black text-white font-bold py-3 px-6 rounded-full">Explore Marketplace</button>
          </div>
        </section>

        {/* 3. Community Asset Marketplace */}
        <section className="p-10">
          <h2 className="text-3xl font-bold mb-6">Community Asset Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-blue-500/50 transition-shadow duration-300">
              <h3 className="text-xl font-bold mb-2">Community Solar Generator</h3>
              <p className="text-gray-400 mb-4">A solar generator to provide backup power to the local market.</p>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-400">Raised</span>
                  <span className="text-sm font-medium text-green-400">75%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full">View Details</button>
                <span className="text-sm text-gray-400">12 days left</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Asset Detail View */}
        <section className="p-10 bg-gray-800">
          <h2 className="text-3xl font-bold mb-6">Asset Detail: Community Solar Generator</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Purpose & Benefits</h3>
                <p className="text-gray-400">This asset will provide reliable, clean energy to the local farmer's market, ensuring operations can continue during power outages. It also reduces the community's carbon footprint.</p>
                <div className="mt-6">
                  <h4 className="text-xl font-bold mb-2">Documents</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="flex items-center text-blue-400 hover:underline"><FileText size={20} className="mr-2"/> Business Plan.pdf</a>
                    <a href="#" className="flex items-center text-blue-400 hover:underline"><FileText size={20} className="mr-2"/> Transparency Report.pdf</a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Funding Status</h3>
                <p className="text-3xl font-bold text-green-400">$15,000 / $20,000</p>
                <p className="text-gray-400">75% Funded</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 my-4">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-gray-400">125 Contributors</p>
                <p className="text-gray-400">Funding ends in 12 days</p>
                <button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full">Contribute</button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. DAO Governance Dashboard */}
        <section className="p-10">
          <h2 className="text-3xl font-bold mb-6">DAO Governance Dashboard</h2>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl">Active Proposals</h3>
            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full">Create Proposal</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg hover:shadow-indigo-500/50 transition-shadow duration-300">
              <h4 className="text-lg font-bold">Purchase Backup Generator for Local Market</h4>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm bg-yellow-500 text-black font-semibold px-2 py-1 rounded-full">Voting Open</span>
                <span className="text-sm text-gray-400">Closes in 3 days</span>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-green-400">Yes: 82%</span>
                  <span className="text-red-400">No: 15%</span>
                  <span className="text-gray-400">Abstain: 3%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              <button className="w-full mt-6 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full">Vote Now</button>
            </div>
          </div>
        </section>

        {/* 6. Voting & Decision-Making Panel */}
        <section className="p-10 bg-gray-800">
          <h2 className="text-3xl font-bold mb-6">Vote on Proposal</h2>
          <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-6 shadow-lg">
            <h3 className="text-2xl font-bold">Purchase Backup Generator for Local Market</h3>
            <p className="text-gray-400 mt-2">Submitted by: @CommunityMember</p>
            <p className="mt-4">This proposal requests $5,000 to purchase a backup generator for the local market to ensure it remains open during power outages.</p>
            <div className="mt-6">
              <p className="mb-2">Your Voting Power: <span className="font-bold text-purple-400">1,200 Votes</span></p>
              <div className="flex space-x-4">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full">Vote Yes</button>
                <button className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full">Vote No</button>
                <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-full">Abstain</button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. My Assets / Portfolio Section */}
        <section className="p-10">
          <h2 className="text-3xl font-bold mb-6">My Assets / Portfolio</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-4">My Contributions</h3>
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <div>
                    <p className="font-bold">Community Solar Generator</p>
                    <p className="text-sm text-gray-400">Ownership: 0.5%</p>
                  </div>
                  <p className="text-green-400 font-bold">$1,200</p>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg text-center">
                <Landmark className="mx-auto text-green-400" size={48} />
                <p className="text-3xl font-bold mt-4">$1,200</p>
                <p className="text-gray-400">Total Value</p>
                <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full">Claim Rewards</button>
              </div>
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg text-center mt-6">
                <Vote className="mx-auto text-purple-400" size={48} />
                <p className="text-3xl font-bold mt-4">1,200</p>
                <p className="text-gray-400">Voting Power</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Community & Social Layer */}
        <section className="p-10 bg-gray-800">
          <h2 className="text-3xl font-bold mb-6">Community & Social Layer</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Recent Discussions</h3>
              <div className="flex items-start space-x-4 py-3 border-b border-gray-700">
                <MessageSquare className="text-cyan-400"/>
                <div>
                  <p className="font-bold">New Proposal Idea: Community Gym</p>
                  <p className="text-sm text-gray-400">Posted by @ActiveUser - 2 hours ago</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
              {/* Leaderboard items */}
            </div>
          </div>
        </section>

        {/* 9. Transparency & Trust Panel */}
        <section className="p-10">
          <h2 className="text-3xl font-bold mb-6">Transparency & Trust</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">On-Chain Proof</h3>
              <ShieldCheck className="mx-auto text-green-400 mb-4" size={48}/>
              <p className="text-center text-gray-400">All asset ownership is recorded as NFTs on the blockchain.</p>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Smart Contract Audits</h3>
              <div className="flex justify-center space-x-4 mt-4">
                <p className="text-green-400 font-bold">CertiK</p>
                <p className="text-green-400 font-bold">Quantstamp</p>
              </div>
            </div>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Live Transactions</h3>
              {/* Transaction feed */}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default UserDAO;
