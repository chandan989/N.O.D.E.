import React from 'react';
import { cn } from '@/lib/utils';

interface WindowPanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const WindowPanel: React.FC<WindowPanelProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div className={cn("window-panel", className)}>
        {title && <div className="window-panel-title">{title}</div>}
        {children}
    </div>
  );
};
