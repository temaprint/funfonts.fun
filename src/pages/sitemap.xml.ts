import type { APIRoute } from 'astro';
import fontsData from '../data/fonts.json';

const baseUrl = 'https://funfonts.fun';
const FONTS_PER_PAGE = 12;
const totalPages = Math.ceil(fontsData.length / FONTS_PER_PAGE);

export const GET: APIRoute = () => {
  const staticPages = [
    '',
    '/about',
  ];

  // Add pagination pages
  const paginationPages = [];
  for (let i = 2; i <= totalPages; i++) {
    paginationPages.push(`/page/${i}`);
  }

  const fontPages = fontsData.map(font => `/font/${font.title}`);

  const allPages = [...staticPages, ...paginationPages, ...fontPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' ? 'daily' : page.startsWith('/font/') ? 'weekly' : page.startsWith('/page/') ? 'daily' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.startsWith('/font/') ? '0.8' : page.startsWith('/page/') ? '0.9' : '0.6'}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
};