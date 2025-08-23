const { scrape, pickBestImage } = require('@odeconto/scraper');

(async () => {
  const r = await scrape('https://uol.com.br', { depth: 'deep' });
  console.log('title:', r.meta.og.title ?? r.meta.basic.title ?? '(no title)');
  console.log('best image:', pickBestImage(r.meta) ?? '(no image)');
})();