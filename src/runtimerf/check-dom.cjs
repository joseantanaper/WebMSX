const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Get full body HTML
  const bodyHtml = await page.evaluate(() => document.body.innerHTML.slice(0, 5000));
  console.log('Body HTML:', bodyHtml);
  
  await browser.close();
})();
