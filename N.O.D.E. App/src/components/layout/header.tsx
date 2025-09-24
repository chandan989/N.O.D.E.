import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
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
      'btn-retro text-sm px-4 py-2',
      isActive ? 'bg-secondary text-background' : 'hover:bg-secondary/20'
    );

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'btn-retro text-lg px-4 py-3 w-full text-left',
      isActive ? 'bg-secondary text-background' : 'hover:bg-secondary/20'
    );

  const businessLinks = [
    { to: "/business/dashboard", label: "[DASHBOARD]" },
    { to: "/business/offers-and-coupons", label: "[OFFERS_&_COUPONS]" },
    { to: "/business/local-exchange", label: "[LOCAL_EXCHANGE]" },
    { to: "/business/funds", label: "[FUNDS]" },
    { to: "/business/modules", label: "[MODULES]" },
  ];

  const userLinks = [
    { to: "/dashboard", label: "[HOME]" },
    { to: "/dashboard/offers-and-coupons", label: "[OFFERS_&_COUPONS]" },
    { to: "/dashboard/local-exchange", label: "[LOCAL_EXCHANGE]" },
    { to: "/dashboard/payments", label: "[PAYMENTS]" },
    { to: "/dashboard/node-fund", label: "[NODE_FUND]" },
    { to: "/dashboard/dao", label: "[DAO]" }
  ];

  const links = userType === 'user' ? userLinks : businessLinks;

  return (
    <header className="window-panel mb-6 !p-2 sm:!p-4 flex items-center justify-between">
      <div className="flex items-center gap-4 sm:gap-6">
        <Link to="/" onClick={() => setIsSheetOpen(false)}>
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {links.map(link => (
            <NavLink key={link.to} to={link.to} className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {isConnected ? (
          <div className="hidden sm:flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs sm:text-sm text-gray-400 truncate max-w-[100px] sm:max-w-none">{accountId}</div>
              <div className="text-primary font-bold">{balance} HBAR</div>
            </div>
            {userType && (
              <div className="hidden sm:block btn-retro !px-4 !py-2 text-sm cursor-default">
                {userType.toUpperCase()}
              </div>
            )}
            <Button onClick={handleSignOut} size="icon" className="btn-retro !p-0 h-10 w-10 group">
              <Power className="h-5 w-5 text-primary/80 transition-colors" />
            </Button>
          </div>
        ) : (
          <button onClick={onConnect} className="btn-retro">[CONNECT WALLET]</button>
        )}

        {isConnected && userType && (
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-screen h-screen bg-background/95 backdrop-blur-sm">
                <SheetHeader>
                  <SheetTitle className="text-glow text-2xl">[NAVIGATION]</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 my-8">
                  {links.map(link => (
                    <NavLink key={link.to} to={link.to} className={mobileNavLinkClass} onClick={() => setIsSheetOpen(false)}>
                      {link.label}
                    </NavLink>
                  ))}
                </nav>
                <div className="absolute bottom-4 left-4 right-4 border-t border-primary/20 pt-4">
                  <div className="text-left mb-4">
                    <div className="text-xs text-gray-400 truncate">{accountId}</div>
                    <div className="text-primary font-bold">{balance} HBAR</div>
                  </div>
                  <Button onClick={handleSignOut} className="btn-retro w-full flex items-center justify-center gap-2 group">
                    <Power className="h-4 w-4 text-primary/80 group-hover:text-red-500 transition-colors" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </header>
  );
};
