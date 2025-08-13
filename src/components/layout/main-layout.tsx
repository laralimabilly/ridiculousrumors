// components/layout/main-layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import TerminalHeader from '@/components/ui/terminal-header';
import ClassificationBanner from '@/components/ui/classification-banner';
import ScanLine from '@/components/ui/scan-line';
import CRTScreen from '@/components/ui/crt-screen';
import TelemetryDisplay from '@/components/ui/telemetry-display';

interface MainLayoutProps {
  children: React.ReactNode;
  showTelemetry?: boolean;
  systemName?: string;
  classification?: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showTelemetry = true,
  systemName = 'RIDICULOUS_RUMORS',
  classification = 'TOP SECRET'
}) => {
  const [systemBooted, setSystemBooted] = useState(false);
  const [bootSequence, setBootSequence] = useState(0);

  useEffect(() => {
    // Boot sequence animation
    const bootTimer = setTimeout(() => setSystemBooted(true), 2000);
    
    // Boot progress
    const progressTimer = setInterval(() => {
      setBootSequence(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    return () => {
      clearTimeout(bootTimer);
      clearInterval(progressTimer);
    };
  }, []);

  if (!systemBooted) {
    return (
      <div className="min-h-screen bg-black text-green-400 flex items-center justify-center font-mono">
        <div className="text-center max-w-2xl">
          {/* ASCII Art Boot Logo */}
          <pre className="text-green-400 text-xs mb-8 leading-tight">
{`
██████╗ ██╗██████╗ ██╗ ██████╗██╗   ██╗██╗      ██████╗ ██╗   ██╗███████╗
██╔══██╗██║██╔══██╗██║██╔════╝██║   ██║██║     ██╔═══██╗██║   ██║██╔════╝
██████╔╝██║██║  ██║██║██║     ██║   ██║██║     ██║   ██║██║   ██║███████╗
██╔══██╗██║██║  ██║██║██║     ██║   ██║██║     ██║   ██║██║   ██║╚════██║
██║  ██║██║██████╔╝██║╚██████╗╚██████╔╝███████╗╚██████╔╝╚██████╔╝███████║
╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚══════╝

██████╗ ██╗   ██╗███╗   ███╗ ██████╗ ██████╗ ███████╗
██╔══██╗██║   ██║████╗ ████║██╔═══██╗██╔══██╗██╔════╝
██████╔╝██║   ██║██╔████╔██║██║   ██║██████╔╝███████╗
██╔══██╗██║   ██║██║╚██╔╝██║██║   ██║██╔══██╗╚════██║
██║  ██║╚██████╔╝██║ ╚═╝ ██║╚██████╔╝██║  ██║███████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                    CONSPIRACY MAINFRAME INITIALIZATION
`}
          </pre>

          {/* Boot Messages */}
          <div className="space-y-2 text-left text-xs mb-8">
            <div className="animate-pulse">LOADING CONSPIRACY DATABASES...</div>
            <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>
              ESTABLISHING SATIRE CONNECTION...
            </div>
            <div className="animate-pulse" style={{ animationDelay: '1s' }}>
              INITIALIZING HUMOR PROTOCOLS...
            </div>
            <div className="animate-pulse" style={{ animationDelay: '1.5s' }}>
              VERIFYING FICTIONAL CLEARANCE...
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-800 h-2 mb-4">
            <div 
              className="bg-green-400 h-2 transition-all duration-300"
              style={{ width: `${bootSequence}%` }}
            />
          </div>
          <div className="text-sm">
            BOOT PROGRESS: {Math.round(bootSequence)}%
          </div>

          {/* Spinning Indicator */}
          <div className="mt-8">
            <div className="animate-spin text-4xl">⟲</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CRTScreen>
      <div className="min-h-screen bg-gray-950 text-green-400 font-mono relative">
        <ScanLine />
        
        {/* Classification Banners */}
        <ClassificationBanner 
          level={classification}
          additionalMarkings={['FICTIONAL', 'SATIRE', 'COMEDY']}
          position="top"
        />
        
        {/* Terminal Header */}
        <TerminalHeader systemName={systemName} />
        
        {/* ASCII Art Title */}
        <div className="text-center py-8 border-b border-green-400/30">
          <pre className="text-green-400 text-xs md:text-sm font-mono leading-tight">
{`
██████╗ ██╗██████╗ ██╗ ██████╗██╗   ██╗██╗      ██████╗ ██╗   ██╗███████╗
██╔══██╗██║██╔══██╗██║██╔════╝██║   ██║██║     ██╔═══██╗██║   ██║██╔════╝
██████╔╝██║██║  ██║██║██║     ██║   ██║██║     ██║   ██║██║   ██║███████╗
██╔══██╗██║██║  ██║██║██║     ██║   ██║██║     ██║   ██║██║   ██║╚════██║
██║  ██║██║██████╔╝██║╚██████╗╚██████╔╝███████╗╚██████╔╝╚██████╔╝███████║
╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝ ╚══════╝

██████╗ ██╗   ██╗███╗   ███╗ ██████╗ ██████╗ ███████╗
██╔══██╗██║   ██║████╗ ████║██╔═══██╗██╔══██╗██╔════╝
██████╔╝██║   ██║██╔████╔██║██║   ██║██████╔╝███████╗
██╔══██╗██║   ██║██║╚██╔╝██║██║   ██║██╔══██╗╚════██║
██║  ██║╚██████╔╝██║ ╚═╝ ██║╚██████╔╝██║  ██║███████║
╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                      CONSPIRACY THEORY GENERATOR v2.1 - PROJECT DEEPTHROAT
`}
          </pre>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-yellow-900/20 border-y border-yellow-400/50 py-3 px-4 text-center">
          <div className="text-yellow-400 text-sm font-bold mb-1">
            ⚠️ FICTIONAL CONTENT DISCLAIMER ⚠️
          </div>
          <div className="text-yellow-300 text-xs max-w-4xl mx-auto">
            All conspiracy theories generated by this system are completely fictional, humorous, and for entertainment purposes only. 
            These theories do not represent real beliefs, facts, or the views of Ridiculous Rumors or its creators. 
            Any resemblance to actual events, persons, or organizations is purely coincidental and unintentional.
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className={`grid gap-6 ${showTelemetry ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {/* Left Sidebar - Telemetry */}
              {showTelemetry && (
                <div className="lg:col-span-1">
                  <TelemetryDisplay />
                </div>
              )}

              {/* Main Content */}
              <div className={showTelemetry ? 'lg:col-span-3' : 'col-span-1'}>
                {children}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Classification */}
        <ClassificationBanner 
          level={classification}
          additionalMarkings={['FICTIONAL', 'SATIRE', 'COMEDY']}
          position="bottom"
        />

        {/* Footer Disclaimer */}
        <div className="bg-gray-900/50 border-t border-green-400/30 py-4 px-6 text-center">
          <div className="text-green-400/70 text-xs space-y-2">
            <div>
              © 2024 Ridiculous Rumors. All generated content is fictional and for entertainment purposes only.
            </div>
            <div>
              No actual conspiracy theories were harmed in the making of this website. 
              Please consult your local reality for actual facts.
            </div>
          </div>
        </div>

        {/* Corner Markings */}
        <div className="fixed bottom-4 left-4 text-green-400/50 text-xs">
          FICTIONAL // COMEDY // FOR ENTERTAINMENT
        </div>
        <div className="fixed bottom-4 right-4 text-green-400/50 text-xs">
          EST. 2024 // RIDICULOUS RUMORS
        </div>
      </div>
    </CRTScreen>
  );
};

export default MainLayout;