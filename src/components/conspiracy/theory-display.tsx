// components/conspiracy/theory-display.tsx
'use client';

import React, { useState } from 'react';
import { Share2, Facebook, MessageCircle, Copy, Check, Download, Eye, EyeOff } from 'lucide-react';
import { clsx } from 'clsx';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

interface TheoryDisplayProps {
  theory: ConspiracyTheory;
  onShare: (platform: SharePlatform) => void;
  onSave?: () => void;
  className?: string;
}

const TheoryDisplay: React.FC<TheoryDisplayProps> = ({ 
  theory, 
  onShare, 
  onSave,
  className 
}) => {
  const [copied, setCopied] = useState(false);
  const [isRedacted, setIsRedacted] = useState(false);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(theory.content);
      setCopied(true);
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

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const shareButtons = [
    { 
      id: 'facebook' as SharePlatform, 
      label: 'FACEBOOK_LEAK', 
      icon: <Facebook className="w-4 h-4" />, 
      color: 'blue' 
    },
    { 
      id: 'twitter' as SharePlatform, 
      label: 'TWITTER_DUMP', 
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ), 
      color: 'sky' 
    },
    { 
      id: 'reddit' as SharePlatform, 
      label: 'REDDIT_POST', 
      icon: <MessageCircle className="w-4 h-4" />, 
      color: 'orange' 
    }
  ];

  return (
    <div className={clsx(
      'bg-black border-2 rounded-none p-6 relative font-mono animate-fadeIn',
      getClassificationColor(theory.classification),
      className
    )}>
      {/* Top Classification Banner */}
      <div className={clsx(
        'absolute top-0 left-0 right-0 text-center py-1 border-b text-xs',
        'font-bold tracking-widest',
        theory.classification === 'TOP SECRET' ? 'bg-red-900/50 border-red-400' :
        theory.classification === 'SECRET' ? 'bg-orange-900/50 border-orange-400' :
        'bg-yellow-900/50 border-yellow-400'
      )}>
        {theory.classification} - UNAUTHORIZED DISCLOSURE PROHIBITED
      </div>
      
      {/* Document Header */}
      <div className="mt-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-lg font-bold tracking-wider mb-2">
              &gt;&gt; INTELLIGENCE REPORT DECLASSIFIED &lt;&lt;
            </div>
            <div className="text-xs opacity-70 space-y-1">
              <div>ORIGIN: DEEP_THROAT_7 | CLEARANCE: COSMIC</div>
              <div>DATE: {formatDate(theory.createdAt)} | CATEGORY: {theory.category.toUpperCase()}</div>
              <div>DOCUMENT_ID: {theory.id || 'UNASSIGNED'}</div>
            </div>
          </div>
          
          {/* Redaction Toggle */}
          <button
            onClick={() => setIsRedacted(!isRedacted)}
            className="flex items-center gap-2 px-3 py-1 border border-current rounded-none text-xs hover:bg-current hover:text-black transition-colors"
          >
            {isRedacted ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            {isRedacted ? 'UNREDACT' : 'REDACT'}
          </button>
        </div>
        
        {/* Content */}
        <div className="border-t border-current/30 pt-4">
          <div className="text-green-300 leading-relaxed text-sm whitespace-pre-wrap">
            {isRedacted ? (
              <div className="space-y-2">
                {theory.content.split('.').map((sentence, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="bg-black text-black select-none">
                      {'█'.repeat(Math.min(sentence.length, 50))}
                    </div>
                    <span className="text-red-400 text-xs">[REDACTED]</span>
                  </div>
                ))}
              </div>
            ) : (
              theory.content
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-current/30 pt-4 space-y-4">
        {/* Copy and Save */}
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
        </div>

        {/* Share Interface */}
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
                className={clsx(
                  'flex items-center gap-2 px-4 py-2 border-2 rounded-none',
                  'font-mono text-xs hover:scale-105 transition-all duration-300',
                  `border-${platform.color}-400 text-${platform.color}-400 bg-${platform.color}-900/20 hover:bg-${platform.color}-900/40`
                )}
              >
                {platform.icon}
                {platform.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="absolute bottom-0 left-0 right-0 text-center py-1 border-t border-current/30 text-xs opacity-50">
        HANDLE VIA {theory.classification} CHANNELS ONLY
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-2 left-2 text-current/30 text-xs">╔</div>
      <div className="absolute top-2 right-2 text-current/30 text-xs">╗</div>
      <div className="absolute bottom-2 left-2 text-current/30 text-xs">╚</div>
      <div className="absolute bottom-2 right-2 text-current/30 text-xs">╝</div>
    </div>
  );
};

export default TheoryDisplay;