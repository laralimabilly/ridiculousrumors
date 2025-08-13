// src/lib/theoryService.ts (Updated with debugging)
import { DatabaseMetadata, supabase, type ConspiracyTheoryInsert, type ConspiracyTheoryRow, type TheoryAnalyticsInsert } from './supabase';
import { geminiService, type GenerateTheoryOptions } from './gemini';
import { generateTheoryId } from './utils';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

// Define allowed event types to match database constraint
const ALLOWED_EVENT_TYPES = ['generated', 'shared', 'saved', 'copied', 'viewed'] as const;
type AllowedEventType = typeof ALLOWED_EVENT_TYPES[number];

interface TheoryAnalyticsData {
  id: string;
  theory_id: string;
  event_type: string;
  platform: string | null;
  created_at: string;
  user_id: string | null;
  metadata: DatabaseMetadata | null;
}

export class TheoryService {
  // Generate and save a new theory
  async generateAndSaveTheory(options: GenerateTheoryOptions): Promise<ConspiracyTheory> {
    try {
      // Generate theory using Gemini
      const generatedTheory = await geminiService.generateConspiracyTheory(options);
      
      // Prepare data for database
      const theoryData: ConspiracyTheoryInsert = {
        id: generateTheoryId(),
        content: generatedTheory.content,
        category: generatedTheory.category,
        classification: generatedTheory.classification,
        prompt_used: generatedTheory.promptUsed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_favorite: false,
        share_count: 0
      };

      // Save to database
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .insert([theoryData])
        .select()
        .single();

      if (error) {
        console.error('Error saving theory to database:', error);
        throw new Error(`Failed to save theory: ${error.message}`);
      }

      // Log analytics with proper event type
      await this.logAnalytics({
        theory_id: data.id,
        event_type: 'generated', // Ensure this matches constraint
        metadata: {
          category: options.category,
          classification: options.classification,
          generated_at: new Date().toISOString()
        }
      });

      // Convert to our ConspiracyTheory type
      return this.convertRowToTheory(data);
    } catch (error) {
      console.error('Error in generateAndSaveTheory:', error);
      throw error;
    }
  }

  // Get a single theory by ID
  async getTheoryById(id: string): Promise<ConspiracyTheory | null> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned
          return null;
        }
        console.error('Error fetching theory by ID:', error);
        throw new Error(`Failed to fetch theory: ${error.message}`);
      }

      // Log view analytics with proper event type
      await this.logAnalytics({
        theory_id: id,
        event_type: 'viewed', // Ensure this matches constraint
        metadata: {
          viewed_at: new Date().toISOString()
        }
      });

      return this.convertRowToTheory(data);
    } catch (error) {
      console.error('Error in getTheoryById:', error);
      throw error;
    }
  }

  // Get recent theories
  async getRecentTheories(limit: number = 10): Promise<ConspiracyTheory[]> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching recent theories:', error);
        throw new Error(`Failed to fetch theories: ${error.message}`);
      }

      return data.map(this.convertRowToTheory);
    } catch (error) {
      console.error('Error in getRecentTheories:', error);
      throw error;
    }
  }

  // Get theories by category
  async getTheoriesByCategory(category: string, limit: number = 10): Promise<ConspiracyTheory[]> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching theories by category:', error);
        throw new Error(`Failed to fetch theories: ${error.message}`);
      }

      return data.map(this.convertRowToTheory);
    } catch (error) {
      console.error('Error in getTheoriesByCategory:', error);
      throw error;
    }
  }

  // Search theories
  async searchTheories(query: string, limit: number = 10): Promise<ConspiracyTheory[]> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('*')
        .textSearch('content', query, {
          type: 'websearch',
          config: 'english'
        })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error searching theories:', error);
        throw new Error(`Failed to search theories: ${error.message}`);
      }

      return data.map(this.convertRowToTheory);
    } catch (error) {
      console.error('Error in searchTheories:', error);
      throw error;
    }
  }

  // Get theory statistics
  async getTheoryStats(theoryId: string): Promise<{
    views: number;
    shares: number;
    copies: number;
    favorites: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('theory_analytics')
        .select('event_type')
        .eq('theory_id', theoryId);

      if (error) {
        console.error('Error fetching theory stats:', error);
        return { views: 0, shares: 0, copies: 0, favorites: 0 };
      }

      const stats = data.reduce((acc, row) => {
        switch (row.event_type) {
          case 'viewed':
            acc.views++;
            break;
          case 'shared':
            acc.shares++;
            break;
          case 'copied':
            acc.copies++;
            break;
          case 'saved':
            acc.favorites++;
            break;
        }
        return acc;
      }, { views: 0, shares: 0, copies: 0, favorites: 0 });

      return stats;
    } catch (error) {
      console.error('Error in getTheoryStats:', error);
      return { views: 0, shares: 0, copies: 0, favorites: 0 };
    }
  }

  // Save theory to favorites
  async toggleFavorite(theoryId: string): Promise<boolean> {
    try {
      // First get current favorite status
      const { data: currentData, error: fetchError } = await supabase
        .from('conspiracy_theories')
        .select('is_favorite')
        .eq('id', theoryId)
        .single();

      if (fetchError) {
        throw new Error(`Failed to fetch theory: ${fetchError.message}`);
      }

      const newFavoriteStatus = !currentData.is_favorite;

      // Update favorite status
      const { error: updateError } = await supabase
        .from('conspiracy_theories')
        .update({ 
          is_favorite: newFavoriteStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', theoryId);

      if (updateError) {
        throw new Error(`Failed to update favorite: ${updateError.message}`);
      }

      // Log analytics with proper event type
      await this.logAnalytics({
        theory_id: theoryId,
        event_type: 'saved', // Ensure this matches constraint
        metadata: {
          is_favorite: newFavoriteStatus,
          action: newFavoriteStatus ? 'favorited' : 'unfavorited'
        }
      });

      return newFavoriteStatus;
    } catch (error) {
      console.error('Error in toggleFavorite:', error);
      throw error;
    }
  }

  // Track theory sharing
  async trackShare(theoryId: string, platform: SharePlatform): Promise<void> {
    try {
      // Increment share count
      const { error: updateError } = await supabase
        .rpc('increment_share_count', { theory_id: theoryId });

      if (updateError) {
        console.error('Error incrementing share count:', updateError);
      }

      // Log analytics with proper event type
      await this.logAnalytics({
        theory_id: theoryId,
        event_type: 'shared', // Ensure this matches constraint
        platform: platform,
        metadata: {
          shared_at: new Date().toISOString(),
          platform: platform
        }
      });
    } catch (error) {
      console.error('Error in trackShare:', error);
      // Don't throw here as sharing might still work
    }
  }

  // Track copy to clipboard
  async trackCopy(theoryId: string): Promise<void> {
    try {
      await this.logAnalytics({
        theory_id: theoryId,
        event_type: 'copied', // Ensure this matches constraint
        metadata: {
          copied_at: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error in trackCopy:', error);
      // Don't throw here as copying might still work
    }
  }

  // Get theory analytics
  async getTheoryAnalytics(theoryId: string): Promise<TheoryAnalyticsData[]> {
    try {
      const { data, error } = await supabase
        .from('theory_analytics')
        .select('*')
        .eq('theory_id', theoryId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching theory analytics:', error);
        return [];
      }

      return data;
    } catch (error) {
      console.error('Error in getTheoryAnalytics:', error);
      return [];
    }
  }

  // Get popular theories (by share count)
  async getPopularTheories(limit: number = 10): Promise<ConspiracyTheory[]> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('*')
        .order('share_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular theories:', error);
        throw new Error(`Failed to fetch popular theories: ${error.message}`);
      }

      return data.map(this.convertRowToTheory);
    } catch (error) {
      console.error('Error in getPopularTheories:', error);
      throw error;
    }
  }

  // Generate sitemap data
  async getSitemapData(): Promise<Array<{
    url: string;
    lastModified: Date;
    changeFrequency: 'daily' | 'weekly' | 'monthly';
    priority: number;
  }>> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('id, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(1000); // Limit for sitemap

      if (error) {
        console.error('Error fetching sitemap data:', error);
        return [];
      }

      return data.map(theory => ({
        url: `https://ridiculousrumors.com/theory/${theory.id}`,
        lastModified: new Date(theory.updated_at || theory.created_at),
        changeFrequency: 'monthly' as const,
        priority: 0.7
      }));
    } catch (error) {
      console.error('Error in getSitemapData:', error);
      return [];
    }
  }

  // Get trending theories (recent + popular)
  async getTrendingTheories(limit: number = 10): Promise<ConspiracyTheory[]> {
    try {
      // Get theories from last 7 days, ordered by share count and recency
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('share_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching trending theories:', error);
        throw new Error(`Failed to fetch trending theories: ${error.message}`);
      }

      return data.map(this.convertRowToTheory);
    } catch (error) {
      console.error('Error in getTrendingTheories:', error);
      throw error;
    }
  }

  // Get category statistics
  async getCategoryStats(): Promise<Array<{
    category: string;
    count: number;
    latest: Date;
  }>> {
    try {
      const { data, error } = await supabase
        .from('conspiracy_theories')
        .select('category, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching category stats:', error);
        return [];
      }

      // Group by category and calculate stats
      const categoryStats = data.reduce((acc, theory) => {
        const category = theory.category;
        if (!acc[category]) {
          acc[category] = {
            category,
            count: 0,
            latest: new Date(theory.created_at)
          };
        }
        acc[category].count++;
        
        const theoryDate = new Date(theory.created_at);
        if (theoryDate > acc[category].latest) {
          acc[category].latest = theoryDate;
        }
        
        return acc;
      }, {} as Record<string, { category: string; count: number; latest: Date }>);

      return Object.values(categoryStats);
    } catch (error) {
      console.error('Error in getCategoryStats:', error);
      return [];
    }
  }

  // Private helper methods
  private async logAnalytics(analyticsData: Omit<TheoryAnalyticsInsert, 'created_at'>): Promise<void> {
    try {
      // Validate event type before inserting
      const eventType = analyticsData.event_type;
      if (!ALLOWED_EVENT_TYPES.includes(eventType as AllowedEventType)) {
        console.error(`Invalid event type: ${eventType}. Allowed types:`, ALLOWED_EVENT_TYPES);
        return;
      }

      console.log('Logging analytics with event type:', eventType); // Debug log

      const { error } = await supabase
        .from('theory_analytics')
        .insert([{
          ...analyticsData,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error logging analytics:', error);
        console.error('Analytics data attempted:', analyticsData); // Debug log
      } else {
        console.log('Analytics logged successfully for event:', eventType); // Debug log
      }
    } catch (error) {
      console.error('Error in logAnalytics:', error);
    }
  }

  private convertRowToTheory(row: ConspiracyTheoryRow): ConspiracyTheory {
    return {
      id: row.id,
      content: row.content,
      category: row.category,
      classification: row.classification,
      createdAt: new Date(row.created_at)
    };
  }

  // Database health check
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('conspiracy_theories')
        .select('id')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  }

  // Debug method to check current constraints
  async checkDatabaseConstraints(): Promise<void> {
    try {
      // Try to query the constraints from the database
      const { data, error } = await supabase
        .rpc('check_constraint_values');

      if (error) {
        console.error('Could not check constraints:', error);
      } else {
        console.log('Database constraints:', data);
      }
    } catch (error) {
      console.error('Error checking constraints:', error);
    }
  }
}

// Singleton instance
export const theoryService = new TheoryService();