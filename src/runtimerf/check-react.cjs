const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(20000);
  
  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || 'empty');
  console.log('Root HTML length:', rootHtml.length);
  console.log('Root HTML:', rootHtml.slice(0, 2000));
  
  await browser.close();
})();
