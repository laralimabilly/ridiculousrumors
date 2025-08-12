// components/ui/crt-screen.tsx
'use client';

import React from 'react';

interface CRTScreenProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

const CRTScreen: React.FC<CRTScreenProps> = ({ children, intensity = 'medium' }) => {
  const intensityClasses = {
    low: 'opacity-5',
    medium: 'opacity-10',
    high: 'opacity-20'
  };

  return (
    <div className="relative">
      {/* CRT Curvature Effect */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div 
          className="w-full h-full" 
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%)',
            boxShadow: 'inset 0 0 300px rgba(0,0,0,0.3)'
          }}
        />
      </div>
      
      {/* Scanlines */}
      <div 
        className={`fixed inset-0 pointer-events-none z-30 ${intensityClasses[intensity]}`}
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34, 197, 94, 0.05) 2px, rgba(34, 197, 94, 0.05) 4px)',
        }}
      />
      
      {/* Phosphor Glow */}
      <div className="fixed inset-0 pointer-events-none z-25 opacity-30">
        <div 
          className="w-full h-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Content with CRT flicker */}
      <div className="relative z-20 animate-flicker">
        {children}
      </div>
    </div>
  );
};

export default CRTScreen;