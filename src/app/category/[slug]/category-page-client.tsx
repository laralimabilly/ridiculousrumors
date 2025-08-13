// src/app/category/[slug]/category-page-client.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft, RefreshCw, Plus, Clock, Share2, Eye, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { theoryService } from '@/lib/theoryService';
import type { ConspiracyTheory } from '@/types/conspiracy';

interface CategoryPageClientProps {
  category: {
    slug: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  };
  initialTheories: ConspiracyTheory[];
  error: string | null;
}

type SortOption = 'newest' | 'oldest' | 'popular';

const CategoryPageClient: React.FC<CategoryPageClientProps> = ({ 
  category, 
  initialTheories,
  error: initialError 
}) => {
  const router = useRouter();
  const [theories, setTheories] = useState<ConspiracyTheory[]>(initialTheories);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(initialError);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showStats, setShowStats] = useState<boolean>(false);

  const loadMoreTheories = async (): Promise<void> => {
    if (loading) return;
    
    setLoading(true);
    try {
      const newTheories: ConspiracyTheory[] = await theoryService.getTheoriesByCategory(category.slug, 20);
      setTheories(newTheories);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load theories');
    } finally {
      setLoading(false);
    }
  };

  const generateNewTheory = (): void => {
    router.push(`/?category=${category.slug}`);
  };

  const sortedTheories = React.useMemo((): ConspiracyTheory[] => {
    const sorted: ConspiracyTheory[] = [...theories];
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'popular':
        return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default:
        return sorted;
    }
  }, [theories, sortBy]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getClassificationColor = (classification: string): string => {
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          {/* Navigation */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-mono text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            &lt; RETURN_TO_GENERATOR
          </button>

          {/* Category Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-6xl">{category.icon}</div>
              <div>
                <h1 className="text-green-400 font-bold text-3xl font-mono tracking-wider">
                  {category.title.toUpperCase()}
                </h1>
                <div className="text-green-400/70 text-sm font-mono mt-2">
                  CATEGORY_ARCHIVE // CLASSIFICATION: FICTIONAL
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <p className="text-green-300 text-lg leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <button
                onClick={generateNewTheory}
                className="flex items-center gap-2 px-6 py-3 border-2 border-green-400 bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors font-mono text-sm"
              >
                <Plus className="w-4 h-4" />
                GENERATE_NEW_{category.title.replace(/\s/g, '_').toUpperCase()}
              </button>

              <button
                onClick={loadMoreTheories}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 border-2 border-blue-400 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition-colors font-mono text-sm disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                REFRESH_ARCHIVE
              </button>

              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-6 py-3 border-2 border-purple-400 bg-purple-900/20 text-purple-400 hover:bg-purple-900/40 transition-colors font-mono text-sm"
              >
                <Eye className="w-4 h-4" />
                {showStats ? 'HIDE_STATS' : 'VIEW_STATS'}
              </button>
            </div>
          </div>
        </div>

        {/* Category Stats */}
        {showStats && (
          <div className="border border-green-400/30 rounded-none p-6 bg-gray-900/50">
            <div className="text-green-400 font-mono text-sm font-bold mb-4">
              ARCHIVE STATISTICS:
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="text-center">
                <div className="text-green-400/70">TOTAL_THEORIES:</div>
                <div className="text-green-400 font-bold text-lg">{theories.length}</div>
              </div>
              <div className="text-center">
                <div className="text-green-400/70">LAST_UPDATED:</div>
                <div className="text-green-400 font-bold text-lg">
                  {theories.length > 0 ? formatDate(theories[0].createdAt).split(',')[0] : 'N/A'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-400/70">CLASSIFICATION:</div>
                <div className="text-red-400 font-bold text-lg">FICTIONAL</div>
              </div>
              <div className="text-center">
                <div className="text-green-400/70">SECURITY_LEVEL:</div>
                <div className="text-yellow-400 font-bold text-lg">COMEDY</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="border border-red-400 bg-red-900/20 rounded-none p-4">
            <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
              <AlertTriangle className="w-4 h-4" />
              ARCHIVE ACCESS ERROR
            </div>
            <div className="text-red-300 text-xs mt-2 font-mono">
              {error}
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-green-400/30 rounded-none bg-gray-900/30">
          <div className="flex items-center gap-4">
            <div className="text-green-400 font-mono text-sm">
              SORT_BY:
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-black border border-green-400/50 text-green-400 font-mono text-xs px-3 py-1 rounded-none"
            >
              <option value="newest">NEWEST_FIRST</option>
              <option value="oldest">OLDEST_FIRST</option>
              <option value="popular">MOST_SHARED</option>
            </select>
          </div>

          <div className="text-green-400/70 font-mono text-xs">
            DISPLAYING: {sortedTheories.length} THEORIES
          </div>
        </div>

        {/* Theories Grid */}
        {sortedTheories.length > 0 ? (
          <div className="grid gap-6">
            {sortedTheories.map((theory: ConspiracyTheory, index: number) => (
              <div
                key={theory.id || index}
                className={`border-2 rounded-none p-6 relative font-mono transition-all duration-300 hover:shadow-lg cursor-pointer ${getClassificationColor(theory.classification)}`}
                onClick={() => theory.id && router.push(`/theory/${theory.id}`)}
              >
                {/* Classification Banner */}
                <div className={`absolute top-0 left-0 right-0 text-center py-1 border-b text-xs font-bold tracking-widest ${
                  theory.classification === 'TOP SECRET' ? 'bg-red-900/50 border-red-400' :
                  theory.classification === 'SECRET' ? 'bg-orange-900/50 border-orange-400' :
                  'bg-yellow-900/50 border-yellow-400'
                }`}>
                  {theory.classification} - FICTIONAL CONTENT - COMEDY ARCHIVE #{index + 1}
                </div>

                {/* Theory Content */}
                <div className="mt-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-xs opacity-70 space-y-1">
                      <div>GENERATED: {formatDate(theory.createdAt)}</div>
                      <div>DOCUMENT_ID: {theory.id || 'UNASSIGNED'}</div>
                      <div>CATEGORY: {category.title.toUpperCase()}</div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(theory.createdAt).split(',')[1]?.trim()}</span>
                    </div>
                  </div>
                  
                  <blockquote className="text-lg leading-relaxed text-center border-l-4 border-current/30 pl-4 bg-current/5 py-4 italic">
                    &quot;{theory.content}&quot;
                  </blockquote>

                  <div className="mt-4 flex justify-between items-center text-xs">
                    <div className="text-current/70">
                      Click to view full report and sharing options
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Share2 className="w-3 h-3" />
                        <span>SHAREABLE</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>VIEW_FULL</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Corner decorations */}
                <div className="absolute top-2 left-2 text-current/30 text-xs">╔</div>
                <div className="absolute top-2 right-2 text-current/30 text-xs">╗</div>
                <div className="absolute bottom-2 left-2 text-current/30 text-xs">╚</div>
                <div className="absolute bottom-2 right-2 text-current/30 text-xs">╝</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-green-400/30 rounded-none bg-gray-900/30">
            <div className="text-green-400/70 font-mono mb-4">
              NO THEORIES FOUND IN ARCHIVE
            </div>
            <button
              onClick={generateNewTheory}
              className="flex items-center justify-center gap-2 mx-auto px-6 py-3 border-2 border-green-400 bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors font-mono text-sm"
            >
              <Plus className="w-4 h-4" />
              GENERATE_FIRST_THEORY
            </button>
          </div>
        )}

        {/* Load More */}
        {theories.length >= 20 && (
          <div className="text-center">
            <button
              onClick={loadMoreTheories}
              disabled={loading}
              className="px-8 py-4 border-2 border-blue-400 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 transition-colors font-mono text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                  ACCESSING_ARCHIVES...
                </>
              ) : (
                'LOAD_MORE_THEORIES'
              )}
            </button>
          </div>
        )}

        {/* Footer Info */}
        <div className="border border-yellow-400/50 bg-yellow-900/20 rounded-none p-4">
          <div className="text-yellow-400 text-sm font-bold mb-2 text-center">
            ⚠️ ARCHIVE DISCLAIMER ⚠️
          </div>
          <div className="text-yellow-300 text-xs text-center">
            All theories in this archive are completely fictional and generated for entertainment purposes only. 
            The &quot;{category.title}&quot; classification refers to content category, not actual security clearance.
            Ridiculous Rumors creates comedy content only.
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CategoryPageClient;