// components/conspiracy/category-card.tsx
'use client';

import React from 'react';
import { clsx } from 'clsx';
import type { Category } from '@/types/conspiracy';

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
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={clsx(
        'relative group border-2 bg-gray-900/80 backdrop-blur-sm rounded-none p-6',
        'transition-all duration-300 hover:scale-105 font-mono',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        isSelected 
          ? 'border-green-400 bg-green-900/30 shadow-green-400/50 shadow-lg' 
          : 'border-green-400/30 hover:border-green-400 hover:bg-green-900/20'
      )}
      style={{
        animationDelay: `${animationDelay}ms`
      }}
    >
      {/* ASCII Art Border Corners */}
      <div className="absolute inset-0 pointer-events-none text-green-400/50 text-xs">
        <div className="absolute top-1 left-1">┌</div>
        <div className="absolute top-1 right-1">┐</div>
        <div className="absolute bottom-1 left-1">└</div>
        <div className="absolute bottom-1 right-1">┘</div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center text-center relative z-10">
        {/* Icon */}
        <div className={clsx(
          'mb-4 p-3 border border-current rounded bg-gradient-to-r text-black font-bold',
          'transition-transform duration-300 group-hover:scale-110',
          category.color
        )}>
          {category.icon}
        </div>

        {/* Label */}
        <div className="text-green-300 font-bold text-sm mb-2 tracking-wider">
          [ {category.label.replace(/\s/g, '_').toUpperCase()} ]
        </div>

        {/* Status */}
        <div className="text-green-400/70 text-xs">
          {isSelected ? '&gt; ACTIVATED' : '&gt; SELECT_TO_ACTIVATE'}
        </div>

        {/* Category ID for debugging */}
        <div className="text-green-400/30 text-xs mt-1 font-mono">
          ID: {category.id.toUpperCase()}
        </div>
      </div>

      {/* Selection Border Animation */}
      {isSelected && (
        <>
          <div className="absolute inset-0 border-2 border-green-400 rounded-none animate-pulse" />
          <div className="absolute top-2 right-2 text-green-400 text-xs font-bold animate-blink">
            ACTIVE
          </div>
          <div className="absolute inset-0 bg-green-400/5 rounded-none" />
        </>
      )}

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-green-400 rounded-none opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px'
        }}
      />

      {/* Loading State for when generating */}
      {disabled && (
        <div className="absolute inset-0 bg-gray-900/80 rounded-none flex items-center justify-center">
          <div className="text-yellow-400 text-xs animate-pulse">
            PROCESSING...
          </div>
        </div>
      )}
    </button>
  );
};

export default CategoryCard;