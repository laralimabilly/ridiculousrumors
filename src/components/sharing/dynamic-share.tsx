// components/sharing/dynamic-share.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Link, Copy, Check } from 'lucide-react';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

interface DynamicShareProps {
  theory: ConspiracyTheory;
  onShare?: (platform: SharePlatform) => void;
  showPreview?: boolean;
}

const DynamicShare: React.FC<DynamicShareProps> = ({ 
  theory, 
  onShare,
  showPreview = true 
}) => {
  const [copied, setCopied] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    // Generate dynamic preview URL for this theory
    if (theory.id) {
      setPreviewUrl(`${window.location.origin}/theory/${theory.id}`);
    }
  }, [theory.id]);

  const generateShareContent = (platform: SharePlatform) => {
    const baseUrl = previewUrl || window.location.href;
    const theoryText = theory.content.length > 100 
      ? `${theory.content.substring(0, 100)}...`
      : theory.content;

    const shareTexts = {
      facebook: `😂 BOMBASTIC NEWS: "${theoryText}"`,
      twitter: `😂 RIDICULOUS RUMOR: "${theoryText}" 

                #Comedy #Satire #Fictional #AI`,
      reddit: `CONSPIRACY LEAK: "${theoryText}"`,
    };

    return {
      text: shareTexts[platform],
      url: baseUrl,
      hashtags: ['Comedy', 'Satire', 'Fictional', 'RidiculousRumors'],
    };
  };

  const handleShare = async (platform: SharePlatform) => {
    const shareContent = generateShareContent(platform);
    const encodedText = encodeURIComponent(shareContent.text);
    const encodedUrl = encodeURIComponent(shareContent.url);

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=${shareContent.hashtags.join(',')}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,
    };

    // Open sharing window
    const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
    window.open(shareUrls[platform], '_blank', windowFeatures);

    // Call parent callback
    onShare?.(platform);
  };

  const handleCopyLink = async () => {
    try {
      const shareContent = generateShareContent('twitter');
      const fullShareText = `${shareContent.text}\n\n${shareContent.url}`;
      
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const shareContent = generateShareContent('twitter');
        await navigator.share({
          title: 'Ridiculous Rumors - Comedy Theory',
          text: shareContent.text,
          url: shareContent.url,
        });
      } catch (error) {
        console.error('Native share failed:', error);
      }
    }
  };

  const shareButtons = [
    {
      id: 'facebook' as SharePlatform,
      label: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      color: 'bg-blue-600 hover:bg-blue-700 border-blue-500',
      action: () => handleShare('facebook'),
    },
    {
      id: 'twitter' as SharePlatform,
      label: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'bg-black hover:bg-gray-800 border-gray-700',
      action: () => handleShare('twitter'),
    },
    {
      id: 'reddit' as SharePlatform,
      label: 'Reddit',
      icon: <MessageCircle className="w-4 h-4" />,
      color: 'bg-orange-600 hover:bg-orange-700 border-orange-500',
      action: () => handleShare('reddit'),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Share Preview Card */}
      {showPreview && (
        <div className="border border-green-400/30 rounded-none p-4 bg-gray-900/50">
          <div className="text-green-400 text-sm font-bold mb-2 font-mono">
            SHARE PREVIEW:
          </div>
          <div className="bg-black border border-green-400/20 rounded p-3 text-xs">
            <div className="text-green-300 font-bold mb-1">
              Ridiculous Rumors - Comedy Theory Generator
            </div>
            <div className="text-green-400/70 mb-2">
              "{theory.content.substring(0, 120)}{theory.content.length > 120 ? '...' : ''}"
            </div>
            <div className="text-green-400/50 text-xs">
              ridiculousrumors.com • Fictional content for entertainment
            </div>
          </div>
        </div>
      )}

      {/* Share Buttons */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Share2 className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-mono text-sm font-bold">
            SPREAD_THE_COMEDY:
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {shareButtons.map((button) => (
            <button
              key={button.id}
              onClick={button.action}
              className={`
                flex items-center justify-center gap-2 px-4 py-3 rounded-none
                border-2 text-white font-mono text-xs transition-all duration-300
                hover:scale-105 ${button.color}
              `}
            >
              {button.icon}
              <span className="hidden sm:inline">{button.label}</span>
            </button>
          ))}

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="
              flex items-center justify-center gap-2 px-4 py-3 rounded-none
              border-2 border-green-500 bg-green-600 hover:bg-green-700 text-white
              font-mono text-xs transition-all duration-300 hover:scale-105
            "
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          </button>
        </div>

        {/* Native Share (Mobile) */}
        {typeof navigator !== 'undefined' && (
          <button
            onClick={handleNativeShare}
            className="
              w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-none
              border-2 border-purple-500 bg-purple-600 hover:bg-purple-700 text-white
              font-mono text-xs transition-all duration-300 hover:scale-105
            "
          >
            <Share2 className="w-4 h-4" />
            Share via Device
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-green-400/60 font-mono">
        * All shares include disclaimer that content is fictional and for entertainment only
      </div>
    </div>
  );
};

export default DynamicShare;