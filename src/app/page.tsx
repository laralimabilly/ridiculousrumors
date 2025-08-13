// app/page.tsx
'use client';

import React from 'react';
import MainLayout from '@/components/layout/main-layout';
import ConspiracyGenerator from '@/components/conspiracy/conspiracy-generator';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

export default function HomePage() {
  const handleTheoryGenerated = (theory: ConspiracyTheory) => {
    // Handle theory generation analytics, saving to local storage, etc.
    console.log('Theory generated:', theory);
    
    // You can add tracking, local storage, or API calls here
    // Example: saveToLocalStorage(theory);
    // Example: trackAnalytics('theory_generated', { category: theory.category });
  };

  const handleTheoryShared = (theory: ConspiracyTheory, platform: SharePlatform) => {
    // Handle sharing analytics
    console.log('Theory shared:', { theory: theory.id, platform });
    
    // Example: trackAnalytics('theory_shared', { 
    //   theory_id: theory.id, 
    //   platform, 
    //   category: theory.category 
    // });
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
      />
    </MainLayout>
  );
}