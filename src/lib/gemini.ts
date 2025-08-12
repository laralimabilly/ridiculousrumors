// src/lib/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(apiKey);

// Category-specific prompts for short, humorous conspiracy theories
const CATEGORY_PROMPTS = {
  'absurd-science': `
    Generate a single-sentence humorous conspiracy theory about absurd science.
    Examples: "WiFi routers are actually quantum flux generators that turn thoughts into bandwidth." or "Scientists discovered gravity is just really persistent peer pressure from the Earth."
    Requirements:
    - EXACTLY one sentence
    - Maximum 50 words
    - Include scientific-sounding terms used incorrectly or absurdly
    - Be clearly humorous and fictional
    - Start with a brief setup like "Scientists secretly know that..." or "The real reason for..."
    Generate only the conspiracy theory sentence, nothing else.
  `,
  'historical-lies': `
    Generate a single-sentence humorous conspiracy theory about historical events.
    Examples: "The Titanic actually sank because it was carrying too many time travelers from 2024." or "Napoleon was short because he kept shrinking every time he invaded a country."
    Requirements:
    - EXACTLY one sentence
    - Maximum 50 words
    - Reference a real historical event or figure with an absurd explanation
    - Be clearly humorous and fictional
    - Start with something like "The truth is..." or "What really happened was..."
    Generate only the conspiracy theory sentence, nothing else.
  `,
  'celebrity-secrets': `
    Generate a single-sentence humorous conspiracy theory about celebrities.
    Examples: "Taylor Swift's concert tours are actually sophisticated weather control experiments." or "Gordon Ramsay only gets angry because he can hear what the food is thinking."
    Requirements:
    - EXACTLY one sentence
    - Maximum 50 words
    - Reference real or archetypal celebrities with absurd secret activities
    - Be clearly humorous and fictional
    - Start with something like "The real secret is..." or "What celebrities don't want you to know..."
    Generate only the conspiracy theory sentence, nothing else.
  `,
  'paranormal-nonsense': `
    Generate a single-sentence humorous conspiracy theory about paranormal phenomena.
    Examples: "Bigfoot sightings are just really hairy park rangers who forgot to shave during camping season." or "UFOs are actually interdimensional food trucks that only serve snacks to confused humans."
    Requirements:
    - EXACTLY one sentence
    - Maximum 50 words
    - Include paranormal elements (ghosts, aliens, cryptids, etc.) with mundane explanations
    - Be clearly humorous and fictional
    - Start with something like "The truth about [paranormal thing]..." or "What they don't tell you..."
    Generate only the conspiracy theory sentence, nothing else.
  `,
  'government-filth': `
    Generate a single-sentence humorous conspiracy theory about government activities.
    Examples: "The DMV is actually a time-dilation experiment to test human patience limits." or "Traffic lights are synchronized by a secret AI that feeds on road rage."
    Requirements:
    - EXACTLY one sentence
    - Maximum 50 words
    - Reference everyday government/public systems with absurd secret purposes
    - Be clearly humorous and fictional
    - Start with something like "The government secretly uses..." or "The real purpose of..."
    Generate only the conspiracy theory sentence, nothing else.
  `,
  'random': `
    Generate a single-sentence humorous conspiracy theory combining random elements.
    Examples: "Coffee shops are actually data extraction points where baristas harvest dreams through steam wand frequencies." or "Rubber ducks control the global economy through strategic squeaking patterns."
    Requirements:
    - EXACTLY one sentence
    - Maximum 50 words
    - Combine completely unrelated concepts in an absurd but creative way
    - Be clearly humorous and fictional
    - Start with something like "The secret connection between..." or "Nobody realizes that..."
    Generate only the conspiracy theory sentence, nothing else.
  `
};

export interface GenerateTheoryOptions {
  category: string;
  classification?: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
  style?: 'formal' | 'casual' | 'technical';
}

export interface GeneratedTheory {
  content: string;
  category: string;
  classification: 'TOP SECRET' | 'SECRET' | 'CONFIDENTIAL';
  promptUsed: string;
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  async generateConspiracyTheory(options: GenerateTheoryOptions): Promise<GeneratedTheory> {
    const { category, classification = 'TOP SECRET' } = options;
    
    // Get category-specific prompt
    const basePrompt = CATEGORY_PROMPTS[category as keyof typeof CATEGORY_PROMPTS] || CATEGORY_PROMPTS['random'];
    
    // Add classification and style instructions
    const fullPrompt = `
      ${basePrompt}
      
      CRITICAL REQUIREMENTS:
      - Generate ONLY the conspiracy theory sentence
      - Maximum 50 words total
      - Must be exactly one sentence
      - Be humorous and clearly fictional
      - Do not include any prefixes like "CLASSIFIED:" or document formatting
      - Do not include explanations or additional text
      - Just return the single conspiracy theory sentence
      
      Generate the conspiracy theory now:
    `;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      if (!text) {
        throw new Error('No content generated from Gemini API');
      }

      return {
        content: text.trim(),
        category,
        classification,
        promptUsed: fullPrompt
      };
    } catch (error) {
      console.error('Error generating conspiracy theory:', error);
      throw new Error(`Failed to generate theory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateMultipleTheories(options: GenerateTheoryOptions, count: number = 3): Promise<GeneratedTheory[]> {
    const promises = Array.from({ length: count }, () => this.generateConspiracyTheory(options));
    
    try {
      const theories = await Promise.all(promises);
      return theories;
    } catch (error) {
      console.error('Error generating multiple theories:', error);
      throw error;
    }
  }

  // Test the API connection
  async testConnection(): Promise<boolean> {
    try {
      const result = await this.model.generateContent('Test connection. Reply with "OK".');
      const response = await result.response;
      const text = response.text();
      return text.includes('OK');
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const geminiService = new GeminiService();