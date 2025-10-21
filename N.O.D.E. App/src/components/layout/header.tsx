import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Power } from 'lucide-react';

interface HeaderProps {
  isConnected: boolean;
  accountId?: string;
  balance?: string;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  accountId,
  balance,
  onConnect,
  onDisconnect
}) => {
  const { userType, setUserType } = useUserStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const handleSignOut = () => {
    onDisconnect();
    setUserType(null);
    setIsSheetOpen(false);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'hover:text-green-500 transition-colors',
      isActive && 'text-green-500'
    );

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'text-2xl w-full text-left p-4 hover:text-green-500 rounded-md transition-colors',
      isActive ? 'text-green-500' : 'text-black'
    );

  const businessLinks = [
    { to: "/business/dashboard", label: "DASHBOARD" },
    { to: "/business/local-exchange", label: "LOCAL_EXCHANGE" },
    { to: "/business/node-funds", label: "NODE_FUND" },
  ];

  const userLinks = [
    { to: "/dashboard", label: "HOME" },
    { to: "/dashboard/local-exchange", label: "LOCAL_EXCHANGE" },
    { to: "/dashboard/node-funds", label: "NODE_FUND" },
    { to: "/dashboard/dao", label: "ASSETS" }
  ];

  const links = userType === 'user' ? userLinks : businessLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between border-2 border-black bg-white px-6 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" onClick={() => setIsSheetOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-black text-green-400 font-bold text-3xl">N</div>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xl">
              {links.map(link => (
                <NavLink key={link.to} to={link.to} className={navLinkClass}>
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <>
                <div className="hidden sm:flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs sm:text-sm text-gray-500 truncate max-w-[100px] sm:max-w-none">{accountId}</div>
                    <div className="font-bold text-black">{balance} HBAR</div>
                  </div>
                  {userType && (
                    <div className="hidden sm:block btn-pixel !bg-transparent !text-black !py-2 !px-4 cursor-default">
                      {userType.toUpperCase()}
                    </div>
                  )}
                  <button onClick={handleSignOut} className="btn-pixel !py-2 !px-2 group">
                    <Power className="h-5 w-5 text-black group-hover:text-white" />
                  </button>
                </div>
                <div className="md:hidden">
                   <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <button className="btn-pixel !py-2 !px-2">
                        <Menu className="h-6 w-6" />
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-screen h-screen bg-white border-r-2 border-black text-black">
                      <SheetHeader>
                        <SheetTitle className="text-4xl text-left">[MENU]</SheetTitle>
                      </SheetHeader>
                      <nav className="flex flex-col gap-4 my-8">
                        {links.map(link => (
                          <NavLink key={link.to} to={link.to} className={mobileNavLinkClass} onClick={() => setIsSheetOpen(false)}>
                            {link.label}
                          </NavLink>
                        ))}
                      </nav>
                      <div className="absolute bottom-6 left-6 right-6 border-t-2 border-black pt-6">
                        <div className="text-left mb-4">
                          <div className="text-sm text-gray-500 truncate">{accountId}</div>
                          <div className="font-bold text-black text-lg">{balance} HBAR</div>
                        </div>
                        <button onClick={handleSignOut} className="btn-pixel btn-pixel-primary w-full flex items-center justify-center gap-2 group">
                          <span>DISCONNECT</span>
                          <Power className="h-5 w-5" />
                        </button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <button onClick={onConnect} className="btn-pixel !py-2 !px-5">JOIN_NETWORK</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
