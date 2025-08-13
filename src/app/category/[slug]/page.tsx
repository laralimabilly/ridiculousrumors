// src/app/category/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryPageClient from './category-page-client';
import { theoryService } from '@/lib/theoryService';
import type { ConspiracyTheory } from '@/types/conspiracy';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

// Category metadata mapping with proper typing
interface CategoryInfo {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const CATEGORY_INFO: Record<string, CategoryInfo> = {
  'absurd-science': {
    title: 'Absurd Science',
    description: 'Fictional scientific conspiracy theories that blend ridiculous pseudo-science with comedy.',
    icon: '⚗️',
    color: 'from-green-400 to-emerald-600'
  },
  'historical-lies': {
    title: 'Historical Lies', 
    description: 'Comedic reinterpretations of historical events with absurd explanations.',
    icon: '📜',
    color: 'from-amber-400 to-orange-600'
  },
  'celebrity-secrets': {
    title: 'Celebrity Secrets',
    description: 'Hilarious fictional conspiracy theories about celebrities and their secret activities.',
    icon: '🎭',
    color: 'from-pink-400 to-rose-600'
  },
  'paranormal-nonsense': {
    title: 'Paranormal Nonsense',
    description: 'Supernatural conspiracy theories with mundane and ridiculous explanations.',
    icon: '👻',
    color: 'from-purple-400 to-violet-600'
  },
  'government-filth': {
    title: 'Government Filth',
    description: 'Satirical takes on government activities and political conspiracy theories.',
    icon: '🏛️',
    color: 'from-red-400 to-red-600'
  },
  'random': {
    title: 'Complete Random',
    description: 'Completely random conspiracy theories combining unrelated concepts for maximum absurdity.',
    icon: '🎲',
    color: 'from-blue-400 to-indigo-600'
  }
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryInfo = CATEGORY_INFO[slug];
  
  if (!categoryInfo) {
    return {
      title: 'Category Not Found - Ridiculous Rumors',
      description: 'The requested category could not be found.',
    };
  }

  const pageTitle = `${categoryInfo.title} - Ridiculous Rumors`;
  const pageDescription = `Explore fictional ${categoryInfo.title.toLowerCase()} conspiracy theories. ${categoryInfo.description} All content is satirical fiction for entertainment only.`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      'conspiracy theory',
      'fictional',
      'comedy',
      'satire',
      categoryInfo.title.toLowerCase(),
      'entertainment',
      'AI generated'
    ],
    
    openGraph: {
      type: 'website',
      title: pageTitle,
      description: pageDescription,
      url: `/category/${slug}`,
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${categoryInfo.title} - Ridiculous Rumors`,
        }
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
    },

    alternates: {
      canonical: `/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryInfo = CATEGORY_INFO[slug];
  
  if (!categoryInfo) {
    notFound();
  }

  // Fetch theories for this category with proper typing
  let theories: ConspiracyTheory[] = [];
  let error: string | null = null;

  try {
    theories = await theoryService.getTheoriesByCategory(slug, 20);
  } catch (err) {
    console.error('Error fetching theories for category:', err);
    error = err instanceof Error ? err.message : 'Failed to load theories';
  }

  return (
    <CategoryPageClient 
      category={{
        slug,
        ...categoryInfo
      }}
      initialTheories={theories}
      error={error}
    />
  );
}