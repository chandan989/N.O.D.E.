import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/user-store';
import { Button } from '@/components/ui/button';

const userNavItems = [
  { path: '/dashboard', label: 'DASHBOARD', description: 'USER.EXE' },
  { path: '/dashboard/payments', label: 'PAYMENTS', description: 'PAYMENTS.DLL' },
  { path: '/governance', label: 'GOVERNANCE', description: 'COUNCIL.BAT' },
];

const businessNavItems = [
  { path: '/business', label: 'BUSINESS', description: 'BUSINESS.EXE' },
  { path: '/dashboard/payments', label: 'PAYMENTS', description: 'PAYMENTS.DLL' },
  { path: '/onboarding', label: 'REGISTER', description: 'REGISTER.SYS' },
  { path: '/governance', label: 'GOVERNANCE', description: 'COUNCIL.BAT' },
];

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { userType, setUserType } = useUserStore();

  if (!userType) {
    return null; // Don't show navigation until user type is selected
  }

  const navItems = userType === 'business' ? businessNavItems : userNavItems;

  return (
    <nav className="terminal-window mb-6">
      <div className="terminal-header">
        <div className="terminal-title">
          {userType === 'business' ? 'BUSINESS NAVIGATION.EXE' : 'USER NAVIGATION.EXE'}
        </div>
        <Button
          onClick={() => setUserType(null)}
          variant="outline"
          size="sm"
          className="font-code text-xs"
        >
          SWITCH MODE
        </Button>
      </div>
      <div className="terminal-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "block p-4 rounded border-2 transition-all duration-200 group",
                "border-border hover:border-primary hover:shadow-glow",
                location.pathname === item.path 
                  ? "border-primary bg-primary/10 shadow-glow" 
                  : "hover:bg-primary/5"
              )}
            >
              <div className={cn(
                "font-terminal group-hover:glow-text",
                userType === 'business' ? "text-accent" : "text-primary"
              )}>
                {item.label}
              </div>
              <div className="font-code text-xs text-muted-foreground mt-1">
                {item.description}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};