// components/ui/classification-banner.tsx
'use client';

import React from 'react';
import { clsx } from 'clsx';

interface ClassificationBannerProps {
  level?: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL' | 'UNCLASSIFIED';
  additionalMarkings?: string[];
  position?: 'top' | 'bottom' | 'both';
  animate?: boolean;
}

const ClassificationBanner: React.FC<ClassificationBannerProps> = ({ 
  level = 'TOP SECRET',
  additionalMarkings = ['NOFORN', 'ORCON', 'IMCON'],
  position = 'both',
  animate = true
}) => {
  const getColorClasses = (classification: string) => {
    switch (classification) {
      case 'TOP SECRET':
        return 'text-red-400 bg-red-900/20 border-red-400';
      case 'SECRET':
        return 'text-orange-400 bg-orange-900/20 border-orange-400';
      case 'CONFIDENTIAL':
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-400';
      default:
        return 'text-green-400 bg-green-900/20 border-green-400';
    }
  };

  const colorClasses = getColorClasses(level);
  const markingsText = additionalMarkings.join(' // ');

  const BannerContent = () => (
    <div className={clsx(
      'w-full text-center py-2 border-y font-mono font-bold text-sm tracking-widest',
      colorClasses,
      animate && 'animate-blink'
    )}>
      {level} // {markingsText}
    </div>
  );

  if (position === 'both') {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50">
          <BannerContent />
        </div>
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <BannerContent />
        </div>
      </>
    );
  }

  const positionClasses = position === 'top' 
    ? 'fixed top-0 left-0 right-0 z-50' 
    : 'fixed bottom-0 left-0 right-0 z-50';

  return (
    <div className={positionClasses}>
      <BannerContent />
    </div>
  );
};

export default ClassificationBanner;