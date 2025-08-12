// components/ui/scan-line.tsx
'use client';

import React from 'react';

const ScanLine: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-30 animate-scan z-50 pointer-events-none" />
  );
};

export default ScanLine;