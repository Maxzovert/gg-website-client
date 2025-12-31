import React from 'react';

const Loader = ({ size = 'md', text = '' }) => {
  // Size variants
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  // Text size variants
  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Simple Spiritual Loader */}
      <div className={`relative ${sizeClasses[size] || sizeClasses.md}`}>
        {/* Simple spinning circle */}
        <div 
          className="absolute inset-0 border-2 border-primary/30 border-t-primary rounded-full animate-spin"
          style={{ 
            animationDuration: '1s',
          }}
        ></div>
        
        {/* Center GG text - subtle pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className={`${textSizes[size] || textSizes.md} font-bold text-primary`}
            style={{ 
              letterSpacing: '0.1em',
              opacity: 0.9
            }}
          >
            GG
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
