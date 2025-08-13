// lib/utils.ts

/**
 * Simple class name utility (replaces clsx + tailwind-merge)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  /**
   * Generate a random theory ID
   */
  export function generateTheoryId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `theory_${timestamp}_${random}`;
  }
  
  /**
   * Format date for display in terminal style
   */
  export function formatTerminalDate(date: Date): string {
    return date.toISOString().split('T')[0].replace(/-/g, '.');
  }
  
  /**
   * Sanitize text for sharing on social platforms
   */
  export function sanitizeForSharing(text: string, maxLength: number = 280): string {
    const cleaned = text
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (cleaned.length <= maxLength) {
      return cleaned;
    }
    
    return cleaned.substring(0, maxLength - 3) + '...';
  }
  
  /**
   * Copy text to clipboard with fallback
   */
  export async function copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }
  
  /**
   * Generate random telemetry data for simulation
   */
  export function generateTelemetryData() {
    return {
      latitude: 40.7128 + (Math.random() - 0.5) * 0.01,
      longitude: -74.0060 + (Math.random() - 0.5) * 0.01,
      altitude: Math.round(1340 + (Math.random() - 0.5) * 200),
      bearing: Math.round(Math.random() * 360),
      velocity: Math.round(Math.random() * 10 * 100) / 100,
      signalStrength: Math.round(-20 - Math.random() * 60)
    };
  }
  
  /**
   * Simple localStorage utilities with SSR safety
   */
  export const storage = {
    save: <T>(key: string, data: T): void => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(data));
        }
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
    },
    
    load: <T>(key: string): T | null => {
      try {
        if (typeof window !== 'undefined') {
          const item = window.localStorage.getItem(key);
          return item ? JSON.parse(item) as T : null;
        }
        return null;
      } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return null;
      }
    },
    
    remove: (key: string): void => {
      try {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Failed to remove from localStorage:', error);
      }
    }
  };
  
  /**
   * Sleep utility for async operations
   */
  export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Check if device is mobile
   */
  export function isMobile(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768;
  }
  
  /**
   * Generate random hex string for data streams
   */
  export function generateHexStream(length: number = 16): string {
    return Array.from({ length }, () => 
      Math.floor(Math.random() * 16).toString(16).toUpperCase()
    ).join('');
  }