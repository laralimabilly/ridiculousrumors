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
      systemName="CONSPIRACY_NET"
      classification="TOP SECRET"
      showTelemetry={true}
    >
      <ConspiracyGenerator 
        onTheoryGenerated={handleTheoryGenerated}
        onTheoryShared={handleTheoryShared}
      />
    </MainLayout>
  );
}