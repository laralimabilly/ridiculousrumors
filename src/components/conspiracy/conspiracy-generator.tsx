// components/conspiracy/conspiracy-generator.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText, Zap, Clock, User, Eye, Globe, MessageCircle, Share2, Copy, Check, Download, EyeOff, AlertTriangle, Wifi, ExternalLink } from 'lucide-react';
import { theoryService } from '@/lib/theoryService';
import { geminiService } from '@/lib/gemini';
import { useRouter } from 'next/navigation';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

// TypeScript interfaces inline
interface Category {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

// Inline CategoryCard component
interface CategoryCardProps {
  category: Category;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  animationDelay?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  isSelected, 
  onSelect, 
  disabled = false,
  animationDelay = 0 
}) => (
  <button
    onClick={onSelect}
    disabled={disabled}
    className={`
      relative group border-2 bg-gray-900/80 backdrop-blur-sm rounded-none p-6
      transition-all duration-300 hover:scale-105 font-mono
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
      ${isSelected 
        ? 'border-green-400 bg-green-900/30 shadow-green-400/50 shadow-lg' 
        : 'border-green-400/30 hover:border-green-400 hover:bg-green-900/20'
      }
    `}
    style={{ animationDelay: `${animationDelay}ms` }}
  >
    <div className="absolute inset-0 pointer-events-none text-green-400/50 text-xs">
      <div className="absolute top-1 left-1">┌</div>
      <div className="absolute top-1 right-1">┐</div>
      <div className="absolute bottom-1 left-1">└</div>
      <div className="absolute bottom-1 right-1">┘</div>
    </div>

    <div className="flex flex-col items-center text-center relative z-10">
      <div className={`mb-4 p-3 border border-current rounded bg-gradient-to-r text-black font-bold transition-transform duration-300 group-hover:scale-110 ${category.color}`}>
        {category.icon}
      </div>

      <div className="text-green-300 font-bold text-sm mb-2 tracking-wider">
        [ {category.label.replace(/\s/g, '_').toUpperCase()} ]
      </div>

      <div className="text-green-400/70 text-xs">
        {isSelected ? '> ACTIVATED' : '> SELECT_TO_ACTIVATE'}
      </div>

      <div className="text-green-400/30 text-xs mt-1 font-mono">
        ID: {category.id.toUpperCase()}
      </div>
    </div>

    {isSelected && (
      <>
        <div className="absolute inset-0 border-2 border-green-400 rounded-none animate-pulse" />
        <div className="absolute top-2 right-2 text-green-400 text-xs font-bold animate-blink">
          ACTIVE
        </div>
        <div className="absolute inset-0 bg-green-400/5 rounded-none" />
      </>
    )}

    <div className="absolute inset-0 border-2 border-green-400 rounded-none opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

    {disabled && (
      <div className="absolute inset-0 bg-gray-900/80 rounded-none flex items-center justify-center">
        <div className="text-yellow-400 text-xs animate-pulse">
          PROCESSING...
        </div>
      </div>
    )}
  </button>
);

// Inline TheoryDisplay component
interface TheoryDisplayProps {
  theory: ConspiracyTheory;
  onShare: (platform: SharePlatform) => void;
  onSave?: () => void;
}

const TheoryDisplay: React.FC<TheoryDisplayProps> = ({ theory, onShare, onSave }) => {
  const [copied, setCopied] = useState(false);
  const [isRedacted, setIsRedacted] = useState(false);
  const router = useRouter();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(theory.content);
      setCopied(true);
      
      // Track copy event
      if (theory.id) {
        await theoryService.trackCopy(theory.id);
      }
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'TOP SECRET':
        return 'border-red-400 bg-red-400/5 text-red-400';
      case 'SECRET':
        return 'border-orange-400 bg-orange-400/5 text-orange-400';
      case 'CONFIDENTIAL':
        return 'border-yellow-400 bg-yellow-400/5 text-yellow-400';
      default:
        return 'border-green-400 bg-green-400/5 text-green-400';
    }
  };

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const shareButtons = [
    { id: 'facebook' as SharePlatform, label: 'FACEBOOK_LEAK', color: 'blue' },
    { id: 'twitter' as SharePlatform, label: 'TWITTER_DUMP', color: 'sky' },
    { id: 'reddit' as SharePlatform, label: 'REDDIT_POST', color: 'orange' }
  ];

  return (
    <div className={`bg-black border-2 rounded-none p-6 relative font-mono animate-fadeIn ${getClassificationColor(theory.classification)}`}>
      <div className={`absolute top-0 left-0 right-0 text-center py-1 border-b text-xs font-bold tracking-widest ${theory.classification === 'TOP SECRET' ? 'bg-red-900/50 border-red-400' : 'bg-orange-900/50 border-orange-400'}`}>
        {theory.classification} - UNAUTHORIZED DISCLOSURE PROHIBITED - RIDICULOUS RUMORS COMEDY DIVISION
      </div>
      
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-lg font-bold tracking-wider mb-2">
              &gt;&gt; INTELLIGENCE REPORT DECLASSIFIED &lt;&lt;
            </div>
            <div className="text-xs opacity-70 space-y-1">
              <div>ORIGIN: DEEP_THROAT_7 | CLEARANCE: COMEDY</div>
              <div>DATE: {formatDate(theory.createdAt)} | CATEGORY: {theory.category.toUpperCase()}</div>
              <div>DOCUMENT_ID: {theory.id || 'UNASSIGNED'}</div>
            </div>
          </div>
          
          <button
            onClick={() => setIsRedacted(!isRedacted)}
            className="flex items-center gap-2 px-3 py-1 border border-current rounded-none text-xs hover:bg-current hover:text-black transition-colors"
          >
            {isRedacted ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {isRedacted ? 'UNREDACT' : 'REDACT'}
          </button>
        </div>
        
        <div className="border-t border-current/30 pt-4">
          <div className="text-green-300 leading-relaxed text-lg whitespace-pre-wrap text-center font-bold">
            {isRedacted ? (
              <div className="flex items-center justify-center gap-2">
                <div className="bg-black text-black select-none">
                  {'█'.repeat(Math.min(theory.content.length, 30))}
                </div>
                <span className="text-red-400 text-sm">[REDACTED]</span>
              </div>
            ) : (
              `"${theory.content}"`
            )}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-900/20 border border-yellow-400/50 rounded-none p-3 mb-4">
        <div className="flex items-center gap-2 text-yellow-400 text-xs font-bold mb-1">
          <AlertTriangle className="w-3 h-3" />
          SATIRICAL CONTENT WARNING
        </div>
        <div className="text-yellow-300 text-xs">
          This theory is completely fictional and generated for entertainment purposes only. 
          It does not represent real beliefs or facts. Ridiculous Rumors creates comedy content only.
        </div>
      </div>

      <div className="border-t border-current/30 pt-4 space-y-4">
        <div className="flex justify-between items-center">
          <button
            onClick={handleCopyToClipboard}
            className="flex items-center gap-2 px-4 py-2 border border-current rounded-none text-xs hover:bg-current hover:text-black transition-colors"
          >
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'COPIED!' : 'COPY_TO_CLIPBOARD'}
          </button>
          
          {onSave && (
            <button
              onClick={onSave}
              className="flex items-center gap-2 px-4 py-2 border border-current rounded-none text-xs hover:bg-current hover:text-black transition-colors"
            >
              <Download className="w-3 h-3" />
              SAVE_TO_ARCHIVE
            </button>
          )}
          
          {/* View Full Theory Button */}
          {theory.id && (
            <button
              onClick={() => router.push(`/theory/${theory.id}`)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-green-400 bg-green-900/20 text-green-400 hover:bg-green-900/40 transition-colors rounded-none text-xs font-bold"
            >
              <ExternalLink className="w-3 h-3" />
              VIEW_FULL_REPORT
            </button>
          )}
        </div>


        <div>
          <div className="font-bold mb-4 flex items-center gap-2 text-sm">
            <Share2 className="w-4 h-4" />
            INITIATE_PUBLIC_LEAK_PROTOCOL
          </div>
          <div className="flex flex-wrap gap-3">
            {shareButtons.map((platform) => (
              <button
                key={platform.id}
                onClick={() => onShare(platform.id)}
                className={`flex items-center gap-2 px-4 py-2 border-2 rounded-none font-mono text-xs hover:scale-105 transition-all duration-300 border-${platform.color}-400 text-${platform.color}-400 bg-${platform.color}-900/20 hover:bg-${platform.color}-900/40`}
              >
                <MessageCircle className="w-4 h-4" />
                {platform.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 text-center py-1 border-t border-current/30 text-xs opacity-50">
        HANDLE VIA {theory.classification} CHANNELS ONLY
      </div>

      <div className="absolute top-2 left-2 text-current/30 text-xs">╔</div>
      <div className="absolute top-2 right-2 text-current/30 text-xs">╗</div>
      <div className="absolute bottom-2 left-2 text-current/30 text-xs">╚</div>
      <div className="absolute bottom-2 right-2 text-current/30 text-xs">╝</div>
    </div>
  );
};

interface ConspiracyGeneratorProps {
  onTheoryGenerated?: (theory: ConspiracyTheory) => void;
  onTheoryShared?: (theory: ConspiracyTheory, platform: SharePlatform) => void;
}

const ConspiracyGenerator: React.FC<ConspiracyGeneratorProps> = ({
  onTheoryGenerated,
  onTheoryShared
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentTheory, setCurrentTheory] = useState<ConspiracyTheory | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    gemini: boolean;
    supabase: boolean;
    checking: boolean;
  }>({
    gemini: false,
    supabase: false,
    checking: true
  });

  const categories: Category[] = [
    { 
      id: 'absurd-science', 
      label: 'Absurd Science', 
      icon: <Zap className="w-5 h-5" />, 
      color: 'from-green-400 to-emerald-600' 
    },
    { 
      id: 'historical-lies', 
      label: 'Historical Lies', 
      icon: <Clock className="w-5 h-5" />, 
      color: 'from-amber-400 to-orange-600' 
    },
    { 
      id: 'celebrity-secrets', 
      label: 'Celebrity Secrets', 
      icon: <User className="w-5 h-5" />, 
      color: 'from-pink-400 to-rose-600' 
    },
    { 
      id: 'paranormal-nonsense', 
      label: 'Paranormal Nonsense', 
      icon: <Eye className="w-5 h-5" />, 
      color: 'from-purple-400 to-violet-600' 
    },
    { 
      id: 'government-filth', 
      label: 'Government Filth', 
      icon: <FileText className="w-5 h-5" />, 
      color: 'from-red-400 to-red-600' 
    },
    { 
      id: 'random', 
      label: 'Complete Random', 
      icon: <Globe className="w-5 h-5" />, 
      color: 'from-blue-400 to-indigo-600' 
    }
  ];

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      setApiStatus(prev => ({ ...prev, checking: true }));
      
      try {
        const [geminiStatus, supabaseStatus] = await Promise.all([
          geminiService.testConnection(),
          theoryService.testConnection()
        ]);
        
        setApiStatus({
          gemini: geminiStatus,
          supabase: supabaseStatus,
          checking: false
        });
      } catch (error) {
        console.error('Error checking API status:', error);
        setApiStatus({
          gemini: false,
          supabase: false,
          checking: false
        });
      }
    };

    checkApiStatus();
  }, []);

  useEffect(() => {
    if (isGenerating) {
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(progressInterval);
    }
  }, [isGenerating]);

  const generateTheory = async () => {
    if (!selectedCategory || isGenerating) return;
    
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentTheory(null);
    setError(null);
    
    try {
      // Generate and save theory using the new service
      const theory = await theoryService.generateAndSaveTheory({
        category: selectedCategory,
        classification: 'TOP SECRET'
      });
      
      setCurrentTheory(theory);
      onTheoryGenerated?.(theory);
      
    } catch (error) {
      console.error('Failed to generate theory:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate theory. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const handleShare = async (platform: SharePlatform) => {
    if (!currentTheory) return;
    
    try {
      // Track the share
      if (currentTheory.id) {
        await theoryService.trackShare(currentTheory.id, platform);
      }
      
      const text = encodeURIComponent(
        `🕵️ CLASSIFIED LEAK: ${currentTheory.content.substring(0, 180)}... #ConspiracyTheory #Classified #DeepState`
      );
      const url = encodeURIComponent(window.location.href);
      
      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
        reddit: `https://reddit.com/submit?url=${url}&title=${text}`
      };
      
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
      onTheoryShared?.(currentTheory, platform);
    } catch (error) {
      console.error('Error tracking share:', error);
      // Continue with sharing even if tracking fails
    }
  };

  const getSelectedCategoryInfo = () => {
    return categories.find(cat => cat.id === selectedCategory);
  };

  return (
    <div className="space-y-8">
      {/* API Status Indicator */}
      <div className="border border-green-400/30 rounded-none p-4 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="text-green-400 font-mono text-sm font-bold">
            SYSTEM STATUS
          </div>
          {apiStatus.checking && (
            <div className="text-yellow-400 text-xs animate-pulse">
              CHECKING...
            </div>
          )}
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.gemini ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={apiStatus.gemini ? 'text-green-400' : 'text-red-400'}>
              GEMINI_API: {apiStatus.gemini ? 'ONLINE' : 'OFFLINE'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${apiStatus.supabase ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className={apiStatus.supabase ? 'text-green-400' : 'text-red-400'}>
              DATABASE: {apiStatus.supabase ? 'CONNECTED' : 'DISCONNECTED'}
            </span>
          </div>
        </div>
        
        {(!apiStatus.gemini || !apiStatus.supabase) && !apiStatus.checking && (
          <div className="mt-2 text-red-400/70 text-xs">
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            Some services are unavailable. Check your API keys and configuration.
          </div>
        )}
      </div>

      <div className="text-center mb-8">
        <div className="text-green-400 font-bold text-xl mb-2 tracking-wider font-mono">
          &gt; SELECT_INVESTIGATION_PROTOCOL
        </div>
        <div className="text-green-400/70 text-sm font-mono">
          CHOOSE TARGET FOR DECLASSIFICATION
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.id}
            onSelect={() => setSelectedCategory(category.id)}
            disabled={isGenerating || !apiStatus.gemini || !apiStatus.supabase}
            animationDelay={index * 100}
          />
        ))}
      </div>

      {selectedCategory && !isGenerating && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 border border-green-400/50 bg-green-900/20 rounded-none font-mono">
            <div className="text-green-400 font-bold text-sm">
              PROTOCOL SELECTED:
            </div>
            <div className="text-green-300">
              {getSelectedCategoryInfo()?.label.toUpperCase()}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="border border-red-400 bg-red-900/20 rounded-none p-4 mb-6">
          <div className="flex items-center gap-2 text-red-400 font-mono text-sm">
            <AlertTriangle className="w-4 h-4" />
            OPERATION FAILED
          </div>
          <div className="text-red-300 text-xs mt-2 font-mono">
            {error}
          </div>
        </div>
      )}

      <div className="text-center mb-8">
        <button
          onClick={generateTheory}
          disabled={!selectedCategory || isGenerating || !apiStatus.gemini || !apiStatus.supabase}
          className={`
            relative px-8 py-4 font-bold border-2 rounded-none font-mono text-sm tracking-wider
            transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
            ${isGenerating 
              ? 'border-yellow-400 bg-yellow-900/20 text-yellow-400' 
              : 'border-green-400 bg-green-900/20 text-green-400 hover:bg-green-900/40'
            }
          `}
        >
          <div className="flex items-center justify-center gap-3">
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                ACCESSING_CLASSIFIED_FILES...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                EXECUTE_DECLASSIFICATION_PROTOCOL
              </>
            )}
          </div>
          
          {isGenerating && (
            <div className="absolute bottom-0 left-0 h-1 bg-yellow-400 transition-all duration-300"
                 style={{ width: `${generationProgress}%` }} />
          )}
        </button>

        {isGenerating && (
          <div className="mt-4 text-yellow-400/70 text-xs font-mono">
            DECRYPTION PROGRESS: {Math.round(generationProgress)}%
          </div>
        )}
      </div>

      {currentTheory && (
        <div className="mt-8">
          <TheoryDisplay 
            theory={currentTheory} 
            onShare={handleShare}
            onSave={() => {
              console.log('Saving theory:', currentTheory);
              // Could implement favorite toggle here
            }}
          />
        </div>
      )}

      {!selectedCategory && !currentTheory && (
        <div className="text-center text-green-400/50 font-mono text-sm border border-green-400/30 p-6 rounded-none">
          <div className="mb-2">AWAITING PROTOCOL SELECTION</div>
          <div className="text-xs">
            Select an investigation category to begin declassification process
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConspiracyGenerator;