// Update to src/app/page.tsx to handle category pre-selection
'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import ConspiracyGenerator from '@/components/conspiracy/conspiracy-generator';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

export default function HomePage() {
  const searchParams = useSearchParams();
  const preSelectedCategory = searchParams.get('category');

  const handleTheoryGenerated = (theory: ConspiracyTheory) => {
    console.log('Theory generated:', theory);
  };

  const handleTheoryShared = (theory: ConspiracyTheory, platform: SharePlatform) => {
    console.log('Theory shared:', { theory: theory.id, platform });
  };

  return (
    <MainLayout 
      systemName="RIDICULOUS_RUMORS"
      classification="TOP SECRET"
      showTelemetry={true}
    >
      {/* Welcome Message */}
      <div className="mb-8 text-center">
        <div className="bg-green-900/20 border border-green-400/50 rounded-none p-6">
          <div className="text-green-400 font-bold text-lg mb-3 font-mono">
            WELCOME TO RIDICULOUS RUMORS
          </div>
          <div className="text-green-300 text-sm leading-relaxed font-mono">
            Your premier destination for completely fictional and hilariously absurd conspiracy theories. 
            Our AI-powered comedy generator creates outrageous theories for your entertainment. 
            Remember: Everything here is FAKE, FUNNY, and FOR LAUGHS ONLY!
          </div>
          <div className="mt-4 text-yellow-400 text-xs font-mono animate-pulse">
            ⚠️ SATIRE MODE ACTIVATED ⚠️
          </div>
        </div>
      </div>

      <ConspiracyGenerator 
        onTheoryGenerated={handleTheoryGenerated}
        onTheoryShared={handleTheoryShared}
        preSelectedCategory={preSelectedCategory || undefined}
      />
    </MainLayout>
  );
}