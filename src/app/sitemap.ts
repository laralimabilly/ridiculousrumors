// app/sitemap.ts
import { MetadataRoute } from 'next';
import { theoryService } from '@/lib/theoryService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://ridiculousrumors.com';
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Category pages
  const categories = [
    'absurd-science',
    'historical-lies', 
    'celebrity-secrets',
    'paranormal-nonsense',
    'government-filth',
    'random'
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(category => ({
    url: `${baseUrl}/category/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Dynamic theory pages
  let theoryPages: MetadataRoute.Sitemap = [];
  
  try {
    const sitemapData = await theoryService.getSitemapData();
    theoryPages = sitemapData.map(theory => ({
      url: theory.url,
      lastModified: theory.lastModified,
      changeFrequency: theory.changeFrequency,
      priority: theory.priority,
    }));
  } catch (error) {
    console.error('Error generating sitemap for theories:', error);
    // Continue without theory pages if there's an error
  }

  return [...staticPages, ...categoryPages, ...theoryPages];
}