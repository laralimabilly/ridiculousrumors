// src/lib/theoryService.ts
import { supabase, type ConspiracyTheoryInsert, type ConspiracyTheoryRow, type TheoryAnalyticsInsert } from './supabase';
import { geminiService, type GenerateTheoryOptions } from './gemini';
import { generateTheoryId } from './utils';
import type { ConspiracyTheory, SharePlatform } from '@/types/conspiracy';

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

      // Log analytics
      await this.logAnalytics({
        theory_id: data.id,
        event_type: 'generated',
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

      // Log analytics
      await this.logAnalytics({
        theory_id: theoryId,
        event_type: 'saved',
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

      // Log analytics
      await this.logAnalytics({
        theory_id: theoryId,
        event_type: 'shared',
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
        event_type: 'copied',
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
  async getTheoryAnalytics(theoryId: string): Promise<any[]> {
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

  // Private helper methods
  private async logAnalytics(analyticsData: TheoryAnalyticsInsert): Promise<void> {
    try {
      const { error } = await supabase
        .from('theory_analytics')
        .insert([{
          ...analyticsData,
          created_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error logging analytics:', error);
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
}

// Singleton instance
export const theoryService = new TheoryService();