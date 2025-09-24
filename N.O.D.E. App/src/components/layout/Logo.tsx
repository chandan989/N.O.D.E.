import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img 
      src="/logo.svg" 
      alt="N.O.D.E. Logo" 
      className={className}
    />
  );
};
