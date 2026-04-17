import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: Array<{ url: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }> = [
    { url: '/', priority: 1.0, changeFrequency: 'weekly' },
    { url: '/catalog/', priority: 0.9, changeFrequency: 'daily' },
    { url: '/about/', priority: 0.6, changeFrequency: 'monthly' },
    { url: '/reviews/', priority: 0.5, changeFrequency: 'weekly' },
  ];

  return routes.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
