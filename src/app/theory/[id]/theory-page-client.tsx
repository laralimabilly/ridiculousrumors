// app/theory/[id]/theory-page-client.tsx
'use client';

import React from 'react';
import { ArrowLeft, Clock, Tag, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import DynamicShare from '@/components/sharing/dynamic-share';
import type { ConspiracyTheory } from '@/types/conspiracy';

interface TheoryPageClientProps {
  theory: ConspiracyTheory;
}

const TheoryPageClient: React.FC<TheoryPageClientProps> = ({ theory }) => {
  const router = useRouter();

  const handleShare = (platform: string) => {
    // Track sharing analytics
    console.log(`Theory ${theory.id} shared on ${platform}`);
    
    // You can add analytics tracking here
    // if (typeof gtag !== 'undefined') {
    //   gtag('event', 'share', {
    //     method: platform,
    //     content_type: 'theory',
    //     content_id: theory.id,
    //   });
    // }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'TOP SECRET':
        return 'text-red-400 border-red-400 bg-red-400/5';
      case 'SECRET':
        return 'text-orange-400 border-orange-400 bg-orange-400/5';
      case 'CONFIDENTIAL':
        return 'text-yellow-400 border-yellow-400 bg-yellow-400/5';
      default:
        return 'text-green-400 border-green-400 bg-green-400/5';
    }
  };

  return (
    <MainLayout 
      systemName="RIDICULOUS_RUMORS"
      classification="TOP SECRET"
      showTelemetry={false}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Navigation */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          &lt; RETURN_TO_GENERATOR
        </button>

        {/* Theory Header */}
        <div className="text-center space-y-4">
          <h1 className="text-green-400 font-bold text-2xl font-mono tracking-wider">
            &gt;&gt; DECLASSIFIED COMEDY REPORT &lt;&lt;
          </h1>
          <div className="text-green-400/70 text-sm font-mono">
            INDIVIDUAL THEORY ANALYSIS - ENTERTAINMENT PURPOSES ONLY
          </div>
        </div>

        {/* Theory Details Card */}
        <div className={`border-2 rounded-none p-6 relative font-mono ${getClassificationColor(theory.classification)}`}>
          {/* Classification Banner */}
          <div className={`absolute top-0 left-0 right-0 text-center py-1 border-b text-xs font-bold tracking-widest ${
            theory.classification === 'TOP SECRET' ? 'bg-red-900/50 border-red-400' :
            theory.classification === 'SECRET' ? 'bg-orange-900/50 border-orange-400' :
            'bg-yellow-900/50 border-yellow-400'
          }`}>
            {theory.classification} FICTIONAL CONTENT - RIDICULOUS RUMORS COMEDY DIVISION
          </div>

          {/* Theory Metadata */}
          <div className="mt-8 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <div>
                <div className="text-current/70">GENERATED:</div>
                <div>{formatDate(theory.createdAt)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <div>
                <div className="text-current/70">CATEGORY:</div>
                <div className="uppercase">{theory.category.replace('-', '_')}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <div>
                <div className="text-current/70">CLASSIFICATION:</div>
                <div>{theory.classification}</div>
              </div>
            </div>
          </div>

          {/* Main Theory Content */}
          <div className="border-t border-current/30 pt-6">
            <div className="text-center mb-4">
              <div className="text-sm font-bold mb-2 tracking-wider">
                DECLASSIFIED INTELLIGENCE REPORT:
              </div>
            </div>
            
            <blockquote className="text-lg leading-relaxed text-center text-green-400 p-6 border-l-4 border-green-900/50 bg-green-900/5 italic">
              "{theory.content}"
            </blockquote>
            
            <div className="text-center mt-4 text-xs text-current/70">
              Document ID: {theory.id || 'UNASSIGNED'} | Source: RIDICULOUS_RUMORS_AI
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 border border-yellow-400/50 bg-yellow-900/20 rounded-none">
            <div className="text-yellow-400 text-sm font-bold mb-2 text-center">
              ⚠️ SATIRICAL CONTENT WARNING ⚠️
            </div>
            <div className="text-yellow-300 text-xs text-center">
              This theory is completely fictional and generated for entertainment purposes only. 
              It does not represent real beliefs, facts, or the views of Ridiculous Rumors or its creators.
              Any resemblance to actual events or persons is purely coincidental.
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-2 left-2 text-current/30 text-xs">╔</div>
          <div className="absolute top-2 right-2 text-current/30 text-xs">╗</div>
          <div className="absolute bottom-2 left-2 text-current/30 text-xs">╚</div>
          <div className="absolute bottom-2 right-2 text-current/30 text-xs">╝</div>
        </div>

        {/* Sharing Section */}
        <div className="border border-green-400/30 rounded-none p-6 bg-gray-900/50">
          <DynamicShare 
            theory={theory} 
            onShare={handleShare}
            showPreview={true}
          />
        </div>

        {/* Related Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-400 bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors font-mono text-sm"
          >
            GENERATE_NEW_THEORY
          </button>
          
          <button
            onClick={() => router.push(`/category/${theory.category}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-400 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition-colors font-mono text-sm"
          >
            VIEW_CATEGORY: {theory.category.toUpperCase()}
          </button>
        </div>

        {/* Theory Stats (Optional) */}
        <div className="border border-green-400/30 rounded-none p-4 bg-gray-900/30">
          <div className="text-green-400 font-mono text-sm font-bold mb-3">
            THEORY ANALYTICS:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="text-center">
              <div className="text-green-400/70">VIEWS:</div>
              <div className="text-green-400 font-bold">---</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">SHARES:</div>
              <div className="text-green-400 font-bold">---</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">LAUGHS:</div>
              <div className="text-green-400 font-bold">INFINITE</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">REALITY:</div>
              <div className="text-red-400 font-bold">0%</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TheoryPageClient;