
import React from 'react';
import { Users, Zap, BarChart, CheckSquare, PieChart, Landmark, Vote, ShieldCheck, FileText, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WindowPanel } from '@/components/ui/window-panel';
import { InfoTrigger } from '@/components/features/info-trigger';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const UserDAO: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. DAO Overview Section */}
      <header className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-glow">Own Assets Together, Build the Future Collectively</h1>
        <div className="flex items-center justify-center">
            <p className="text-muted-foreground mt-2 md:text-lg">Invest in community infrastructure and decide together what to fund through DAO voting.</p>
            <InfoTrigger title="N.O.D.E. Local Exchange" description="Invest in local businesses and community projects..." />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-6">
            <WindowPanel title='Members'>
                <Users className="mx-auto text-primary" size={40} />
                <p className="text-3xl font-bold mt-2">1,234</p>
            </WindowPanel>
        </div>
        <div className="lg:col-span-3 space-y-6">
            <WindowPanel title='Assets Owned'>
                <Zap className="mx-auto text-primary" size={40} />
                <p className="text-3xl font-bold mt-2">42</p>
            </WindowPanel>
        </div>
        <div className="lg:col-span-3 space-y-6">
            <WindowPanel title='TVL'>
                <BarChart className="mx-auto text-primary" size={40} />
                <p className="text-3xl font-bold mt-2">$5.6M</p>
            </WindowPanel>
        </div>
        <div className="lg:col-span-3 space-y-6">
            <WindowPanel title='Proposals Voted'>
                <CheckSquare className="mx-auto text-primary" size={40} />
                <p className="text-3xl font-bold mt-2">89</p>
            </WindowPanel>
        </div>
      </div>

      <div className="text-center">
        <Button size="lg" className="mr-4">Join DAO & Contribute</Button>
        {/*<Button size="lg" variant="outline">Explore Marketplace</Button>*/}
      </div>

      {/* 2. Community Asset Marketplace */}
      <section>
        <h2 className="text-3xl font-bold text-glow mb-6">Community Asset Marketplace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WindowPanel title='Community Solar Generator'>
                <p>A solar generator to provide backup power to the local market.</p>
                <div className="mb-4">
                    <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-muted-foreground">Raised</span>
                    <span className="text-sm font-medium text-primary">75%</span>
                    </div>
                    <Progress value={75} />
                </div>
                <div className="flex justify-between items-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>View Details</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Community Solar Generator</DialogTitle>
                                <DialogDescription>
                                    A solar generator to provide backup power to the local market.
                                </DialogDescription>
                            </DialogHeader>
                            {/* Add more details here */}
                        </DialogContent>
                    </Dialog>
                    <span className="text-sm text-muted-foreground">12 days left</span>
                </div>
            </WindowPanel>
          {/* Add more asset cards here */}
        </div>
      </section>

      {/* 3. DAO Governance Dashboard */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-glow">DAO Governance</h2>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="secondary">Create Proposal</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a New Proposal</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to create a new proposal for the DAO to vote on.
                        </DialogDescription>
                    </DialogHeader>
                    {/* Add form here */}
                </DialogContent>
            </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WindowPanel title='Purchase Backup Generator for Local Market'>
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm bg-yellow-400 text-black font-semibold px-2 py-1 rounded-full">Voting Open</span>
                    <span className="text-sm text-muted-foreground">Closes in 3 days</span>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-green-500">Yes: 82%</span>
                        <span className="text-red-500">No: 15%</span>
                        <span className="text-muted-foreground">Abstain: 3%</span>
                    </div>
                    <Progress value={82} />
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="w-full mt-6">Vote Now</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Vote on Proposal</DialogTitle>
                            <DialogDescription>
                                Cast your vote for the proposal to purchase a backup generator for the local market.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-around mt-4">
                            <Button variant="outline">Yes</Button>
                            <Button variant="outline">No</Button>
                            <Button variant="outline">Abstain</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </WindowPanel>
          {/* Add more proposal cards here */}
        </div>
      </section>

      {/* 4. My Assets / Portfolio Section */}
      <section>
        <h2 className="text-3xl font-bold text-glow mb-6">My Portfolio</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WindowPanel title='My Contributions'>
                <div className="flex justify-between items-center py-3 border-b">
                    <div>
                        <p className="font-semibold">Community Solar Generator</p>
                        <p className="text-sm text-muted-foreground">Ownership: 0.5%</p>
                    </div>
                    <p className="font-semibold text-primary">$1,200</p>
                </div>
                {/* Add more contributions here */}
            </WindowPanel>
          </div>
          <div className="space-y-6">
            <WindowPanel title='Total Value'>
                <Landmark className="mx-auto text-primary" size={40} />
                <p className="text-3xl font-bold mt-2">$1,200</p>
                <Button className="mt-4" size="sm">Claim Rewards</Button>
            </WindowPanel>
            <WindowPanel title='Voting Power'>
                <Vote className="mx-auto text-primary" size={40} />
                <p className="text-3xl font-bold mt-2">1,200</p>
            </WindowPanel>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserDAO;
