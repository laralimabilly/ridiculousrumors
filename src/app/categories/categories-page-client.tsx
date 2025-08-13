// src/app/categories/categories-page-client.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft, BarChart3, Clock, FileText, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';

interface CategoryStat {
  category: string;
  count: number;
  latest: Date;
}

interface CategoriesPageClientProps {
  initialStats: CategoryStat[];
}

const CATEGORY_INFO = {
  'absurd-science': {
    title: 'Absurd Science',
    description: 'Fictional scientific conspiracy theories that blend ridiculous pseudo-science with comedy.',
    icon: '⚗️',
    color: 'from-green-400 to-emerald-600',
    borderColor: 'border-green-400',
    bgColor: 'bg-green-900/20',
    examples: [
      'WiFi routers are actually quantum flux generators',
      'Scientists discovered gravity is just peer pressure from Earth',
      'Lab mice are secretly running the experiments on humans'
    ]
  },
  'historical-lies': {
    title: 'Historical Lies', 
    description: 'Comedic reinterpretations of historical events with absurd explanations.',
    icon: '📜',
    color: 'from-amber-400 to-orange-600',
    borderColor: 'border-amber-400',
    bgColor: 'bg-amber-900/20',
    examples: [
      'The Titanic sank because of too many time travelers',
      'Napoleon was short due to country-invasion shrinkage',
      'Ancient pyramids were actually alien parking garages'
    ]
  },
  'celebrity-secrets': {
    title: 'Celebrity Secrets',
    description: 'Hilarious fictional conspiracy theories about celebrities and their secret activities.',
    icon: '🎭',
    color: 'from-pink-400 to-rose-600',
    borderColor: 'border-pink-400',
    bgColor: 'bg-pink-900/20',
    examples: [
      'Taylor Swift tours are weather control experiments',
      'Gordon Ramsay hears what food is thinking',
      'Celebrity chefs are actually interdimensional beings'
    ]
  },
  'paranormal-nonsense': {
    title: 'Paranormal Nonsense',
    description: 'Supernatural conspiracy theories with mundane and ridiculous explanations.',
    icon: '👻',
    color: 'from-purple-400 to-violet-600',
    borderColor: 'border-purple-400',
    bgColor: 'bg-purple-900/20',
    examples: [
      'Bigfoot is just really hairy park rangers',
      'UFOs are interdimensional food trucks',
      'Ghosts are just WiFi signals with commitment issues'
    ]
  },
  'government-filth': {
    title: 'Government Filth',
    description: 'Satirical takes on government activities and political conspiracy theories.',
    icon: '🏛️',
    color: 'from-red-400 to-red-600',
    borderColor: 'border-red-400',
    bgColor: 'bg-red-900/20',
    examples: [
      'Traffic lights are synchronized by road rage-eating AI',
      'Politicians are secretly interdimensional squirrel whisperers',
      'Government buildings are just really elaborate escape rooms'
    ]
  },
  'random': {
    title: 'Complete Random',
    description: 'Completely random conspiracy theories combining unrelated concepts for maximum absurdity.',
    icon: '🎲',
    color: 'from-blue-400 to-indigo-600',
    borderColor: 'border-blue-400',
    bgColor: 'bg-blue-900/20',
    examples: [
      'Coffee shops harvest dreams through steam frequencies',
      'Rubber ducks control the economy via strategic squeaking',
      'Escalators are training humans for eventual treadmill takeover'
    ]
  }
};

const CategoriesPageClient: React.FC<CategoriesPageClientProps> = ({ initialStats }) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getStatForCategory = (categorySlug: string) => {
    return initialStats.find(stat => stat.category === categorySlug);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <MainLayout 
      systemName="RIDICULOUS_RUMORS"
      classification="TOP SECRET"
      showTelemetry={false}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            &lt; RETURN_TO_GENERATOR
          </button>

          <div className="text-center space-y-4">
            <h1 className="text-green-400 font-bold text-3xl font-mono tracking-wider">
              &gt;&gt; CONSPIRACY CATEGORY ARCHIVE &lt;&lt;
            </h1>
            <div className="text-green-400/70 text-sm font-mono">
              BROWSE CLASSIFIED COMEDY COLLECTIONS // ALL CONTENT FICTIONAL
            </div>
            <p className="text-green-300 text-lg leading-relaxed max-w-4xl mx-auto">
              Explore our comprehensive database of fictional conspiracy theories organized by theme. 
              Each category contains AI-generated comedic content designed purely for entertainment.
            </p>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="border border-green-400/30 rounded-none p-6 bg-gray-900/50">
          <div className="text-green-400 font-mono text-sm font-bold mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            ARCHIVE OVERVIEW:
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="text-center">
              <div className="text-green-400/70">TOTAL_CATEGORIES:</div>
              <div className="text-green-400 font-bold text-lg">{Object.keys(CATEGORY_INFO).length}</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">TOTAL_THEORIES:</div>
              <div className="text-green-400 font-bold text-lg">
                {initialStats.reduce((sum, stat) => sum + stat.count, 0)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">CLASSIFICATION:</div>
              <div className="text-red-400 font-bold text-lg">FICTIONAL</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">PURPOSE:</div>
              <div className="text-yellow-400 font-bold text-lg">COMEDY</div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Object.entries(CATEGORY_INFO).map(([slug, info]) => {
            const stat = getStatForCategory(slug);
            const isSelected = selectedCategory === slug;
            
            return (
              <div
                key={slug}
                className={`relative group border-2 rounded-none p-6 cursor-pointer transition-all duration-300 hover:scale-105 font-mono ${info.borderColor} ${info.bgColor} ${
                  isSelected ? 'shadow-lg shadow-current/50' : ''
                }`}
                onClick={() => router.push(`/category/${slug}`)}
                onMouseEnter={() => setSelectedCategory(slug)}
                onMouseLeave={() => setSelectedCategory(null)}
              >
                {/* ASCII Border Corners */}
                <div className="absolute inset-0 pointer-events-none text-current/50 text-xs">
                  <div className="absolute top-1 left-1">┌</div>
                  <div className="absolute top-1 right-1">┐</div>
                  <div className="absolute bottom-1 left-1">└</div>
                  <div className="absolute bottom-1 right-1">┘</div>
                </div>

                {/* Category Header */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{info.icon}</div>
                  <h3 className="text-current font-bold text-lg tracking-wider mb-2">
                    [ {info.title.toUpperCase()} ]
                  </h3>
                  <div className="text-current/70 text-xs">
                    CATEGORY_ID: {slug.toUpperCase()}
                  </div>
                </div>

                {/* Description */}
                <p className="text-current/80 text-sm leading-relaxed mb-4 text-center">
                  {info.description}
                </p>

                {/* Statistics */}
                <div className="space-y-2 mb-4 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-current/70">THEORIES:</span>
                    <span className="text-current font-bold">
                      {stat?.count || 0}
                    </span>
                  </div>
                  {stat && (
                    <div className="flex justify-between items-center">
                      <span className="text-current/70">LATEST:</span>
                      <span className="text-current font-bold">
                        {formatDate(new Date(stat.latest))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-current/70">STATUS:</span>
                    <span className="text-green-400 font-bold animate-pulse">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Example Theories (shown on hover) */}
                {isSelected && (
                  <div className="absolute inset-0 bg-black/95 rounded-none p-4 flex flex-col justify-center">
                    <div className="text-current font-bold text-sm mb-3 text-center">
                      SAMPLE THEORIES:
                    </div>
                    <div className="space-y-2 text-xs">
                      {info.examples.map((example, index) => (
                        <div key={index} className="text-current/90 italic">
                          &quot;{example}&quot;
                        </div>
                      ))}
                    </div>
                    <div className="text-current/60 text-xs text-center mt-3">
                      Click to explore full archive
                    </div>
                  </div>
                )}

                {/* Action Indicators */}
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1 text-current/60">
                    <FileText className="w-3 h-3" />
                    <span>ARCHIVE</span>
                  </div>
                  <div className="flex items-center gap-1 text-current/60">
                    <TrendingUp className="w-3 h-3" />
                    <span>ACTIVE</span>
                  </div>
                </div>

                {/* Hover Border Animation */}
                <div className="absolute inset-0 border-2 border-current rounded-none opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="border border-green-400/30 rounded-none p-6 bg-gray-900/30">
          <div className="text-green-400 font-mono text-sm font-bold mb-4">
            QUICK ACTIONS:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-400 bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors font-mono text-sm"
            >
              <FileText className="w-4 h-4" />
              GENERATE_NEW_THEORY
            </button>
            
            <button
              onClick={() => router.push('/trending')}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-blue-400 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition-colors font-mono text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              VIEW_TRENDING
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-400 bg-purple-900/20 text-purple-400 hover:bg-purple-900/40 transition-colors font-mono text-sm"
            >
              <Clock className="w-4 h-4" />
              REFRESH_STATS
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border border-yellow-400/50 bg-yellow-900/20 rounded-none p-4">
          <div className="text-yellow-400 text-sm font-bold mb-2 text-center">
            ⚠️ CATEGORY ARCHIVE DISCLAIMER ⚠️
          </div>
          <div className="text-yellow-300 text-xs text-center">
            All categories contain completely fictional conspiracy theories generated for entertainment purposes only. 
            No actual classified information, real conspiracy theories, or factual content is present in any category. 
            Ridiculous Rumors is a comedy platform that creates satirical content only.
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoriesPageClient;