// app/theory-sitemap.xml/route.ts
import { theoryService } from '@/lib/theoryService';

export async function GET() {
  try {
    const theories = await theoryService.getSitemapData();
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${theories.map(theory => `  <url>
    <loc>${theory.url}</loc>
    <lastmod>${theory.lastModified.toISOString()}</lastmod>
    <changefreq>${theory.changeFrequency}</changefreq>
    <priority>${theory.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch (error) {
    console.error('Error generating theory sitemap:', error);
    return new Response('Error generating sitemap', { status: 500 });
  }
}