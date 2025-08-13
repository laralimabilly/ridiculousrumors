// src/components/navigation/main-navigation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Folder, TrendingUp, FileText, BarChart3, Menu, X, ChevronRight } from 'lucide-react';

interface MainNavigationProps {
  className?: string;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ className = '' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      id: 'home',
      label: 'GENERATOR',
      icon: <Home className="w-4 h-4" />,
      path: '/',
      description: 'Generate new theories'
    },
    {
      id: 'categories',
      label: 'CATEGORIES',
      icon: <Folder className="w-4 h-4" />,
      path: '/categories',
      description: 'Browse by category'
    },
    // {
    //   id: 'trending',
    //   label: 'TRENDING',
    //   icon: <TrendingUp className="w-4 h-4" />,
    //   path: '/trending',
    //   description: 'Popular theories'
    // },
    // {
    //   id: 'recent',
    //   label: 'RECENT',
    //   icon: <FileText className="w-4 h-4" />,
    //   path: '/recent',
    //   description: 'Latest theories'
    // },
    // {
    //   id: 'stats',
    //   label: 'ANALYTICS',
    //   icon: <BarChart3 className="w-4 h-4" />,
    //   path: '/analytics',
    //   description: 'Site statistics'
    // }
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); // Close menu after navigation
  };

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed top-12 right-4 z-50 p-3 border-2 border-green-400 bg-black/90 text-green-400 
          hover:bg-green-900/40 transition-all duration-300 font-mono text-sm backdrop-blur-sm
          ${isOpen ? 'border-red-400 text-red-400' : 'hover:scale-105'}
        `}
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        <span className="sr-only">
          {isOpen ? 'Close menu' : 'Open menu'}
        </span>
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sliding Menu Panel */}
      <nav 
        className={`
          fixed top-0 left-0 h-full w-80 bg-black border-r-2 border-green-400 z-50
          transform transition-transform duration-300 ease-in-out font-mono
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${className}
        `}
        aria-hidden={!isOpen}
      >
        {/* Menu Header */}
        <div className="p-6 border-b border-green-400/30">
          <div className="flex items-center justify-between mb-4">
            <div className="text-green-400 font-bold text-lg tracking-wider">
              NAVIGATION
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-green-400/70 hover:text-red-400 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-green-400/70 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            TERMINAL_NAVIGATION_v2.1
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`
                w-full flex items-center gap-4 p-4 border-2 rounded-none transition-all duration-300
                font-mono text-left group hover:scale-[1.02]
                ${isActive(item.path)
                  ? 'border-green-400 bg-green-900/30 text-green-400'
                  : 'border-green-400/30 text-green-400/70 hover:border-green-400 hover:text-green-400 hover:bg-green-900/20'
                }
              `}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 transition-transform duration-300 group-hover:scale-110
                ${isActive(item.path) ? 'text-green-400' : ''}
              `}>
                {item.icon}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="font-bold tracking-wider text-sm">
                  {item.label}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {item.description}
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className={`
                flex-shrink-0 transition-transform duration-300
                ${isActive(item.path) ? 'text-green-400' : 'text-green-400/30 group-hover:text-green-400'}
                ${isActive(item.path) ? 'animate-pulse' : 'group-hover:translate-x-1'}
              `}>
                <ChevronRight className="w-4 h-4" />
              </div>

              {/* Active Indicator */}
              {isActive(item.path) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Quick Stats Footer */}
        <div className="p-4 border-t border-green-400/30 bg-gray-900/50">
          <div className="text-green-400/70 text-xs mb-3 font-bold">
            SYSTEM STATUS:
          </div>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-green-400/70">SESSION:</div>
              <div className="text-green-400 font-bold">ACTIVE</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">MODE:</div>
              <div className="text-yellow-400 font-bold">COMEDY</div>
            </div>
            <div className="text-center">
              <div className="text-green-400/70">STATUS:</div>
              <div className="text-green-400 font-bold animate-pulse">ONLINE</div>
            </div>
          </div>

          {/* Current Location */}
          <div className="mt-4 pt-3 border-t border-green-400/30">
            <div className="text-green-400/70 text-xs mb-1">CURRENT_LOCATION:</div>
            <div className="text-green-400 font-mono text-xs truncate">
              {pathname === '/' ? 'GENERATOR' : pathname.toUpperCase().replace(/\//g, ' > ')}
            </div>
          </div>
        </div>

        {/* Terminal Decoration */}
        <div className="absolute top-0 right-0 bottom-0 w-1 bg-gradient-to-b from-green-400/50 via-green-400/20 to-green-400/50" />
      </nav>
    </>
  );
};

export default MainNavigation;