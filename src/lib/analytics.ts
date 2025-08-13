// lib/analytics.ts
export interface AnalyticsEvent {
    action: string;
    category: string;
    label?: string;
    value?: number;
    theory_id?: string;
    platform?: string;
    custom_parameters?: CustomParameters;
  }

  interface CustomParameters {
    [key: string]: string | number | boolean | null | undefined;
  }
  
  export class Analytics {
    private isEnabled: boolean;
  
    constructor() {
      this.isEnabled = typeof window !== 'undefined' && !this.isDevelopment();
    }
  
    private isDevelopment(): boolean {
      return process.env.NODE_ENV === 'development' || 
             (typeof window !== 'undefined' && window.location.hostname === 'localhost');
    }
  
    // Google Analytics 4 tracking
    track(event: AnalyticsEvent): void {
      if (!this.isEnabled) {
        console.log('Analytics (dev mode):', event);
        return;
      }
  
    //   // Google Analytics 4
    //   if (typeof gtag !== 'undefined') {
    //     gtag('event', event.action, {
    //       event_category: event.category,
    //       event_label: event.label,
    //       value: event.value,
    //       theory_id: event.theory_id,
    //       platform: event.platform,
    //       ...event.custom_parameters,
    //     });
    //   }
  
    //   // Facebook Pixel (if implemented)
    //   if (typeof fbq !== 'undefined') {
    //     fbq('track', 'CustomEvent', {
    //       action: event.action,
    //       category: event.category,
    //       content_id: event.theory_id,
    //     });
    //   }
  
      // Custom analytics endpoint (optional)
      this.trackCustom(event);
    }
  
    private async trackCustom(event: AnalyticsEvent): Promise<void> {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...event,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
          }),
        });
      } catch (error) {
        console.error('Custom analytics tracking failed:', error);
      }
    }
  
    // Specific tracking methods
    trackTheoryGenerated(theoryId: string, category: string): void {
      this.track({
        action: 'theory_generated',
        category: 'engagement',
        label: category,
        theory_id: theoryId,
      });
    }
  
    trackTheoryViewed(theoryId: string, category: string): void {
      this.track({
        action: 'theory_viewed',
        category: 'engagement',
        label: category,
        theory_id: theoryId,
      });
    }
  
    trackTheoryShared(theoryId: string, platform: string, category: string): void {
      this.track({
        action: 'theory_shared',
        category: 'social',
        label: category,
        theory_id: theoryId,
        platform: platform,
      });
    }
  
    trackTheoryCopied(theoryId: string, category: string): void {
      this.track({
        action: 'theory_copied',
        category: 'engagement',
        label: category,
        theory_id: theoryId,
      });
    }
  
    trackCategorySelected(category: string): void {
      this.track({
        action: 'category_selected',
        category: 'navigation',
        label: category,
      });
    }
  
    trackPageView(path: string): void {
      this.track({
        action: 'page_view',
        category: 'navigation',
        label: path,
        custom_parameters: {
          page_path: path,
        },
      });
    }
  
    trackError(error: string, context?: string): void {
      this.track({
        action: 'error',
        category: 'system',
        label: error,
        custom_parameters: {
          context: context,
        },
      });
    }
  
    // Conversion tracking
    trackConversion(type: 'share' | 'favorite' | 'return_visit'): void {
      this.track({
        action: 'conversion',
        category: 'business',
        label: type,
        value: 1,
      });
    }
  }
  
  // Global analytics instance
  export const analytics = new Analytics();
  
  // React hook for analytics
  import { useEffect } from 'react';
  import { usePathname } from 'next/navigation';
  
  export function useAnalytics() {
    const pathname = usePathname();
  
    useEffect(() => {
      analytics.trackPageView(pathname);
    }, [pathname]);
  
    return analytics;
  }