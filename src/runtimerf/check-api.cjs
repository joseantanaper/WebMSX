const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(8000);
  
  const wmsxAPI = await page.evaluate(() => {
    const w = window.WMSX;
    if (!w) return 'WMSX not defined';
    return Object.keys(w);
  });
  console.log('WMSX keys:', wmsxAPI);
  
  await browser.close();
})();
