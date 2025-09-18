import React from 'react';
import { cn } from '@/lib/utils';

interface WindowPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}

export const WindowPanel: React.FC<WindowPanelProps> = ({
  title,
  children,
  className,
  actions
}) => {
  return (
    <div className={cn("terminal-window", className)}>
      <div className="terminal-header">
        <div className="terminal-title flicker">
          &gt; {title.toUpperCase()}.EXE
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="terminal-content">
        {children}
      </div>
    </div>
  );
};