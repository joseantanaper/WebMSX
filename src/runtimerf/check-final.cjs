const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  const wmsxRunning = await page.evaluate(() => !!window.WMSX?.room);
  const canvasExists = await page.$('#wmsx-screen-canvas');
  
  console.log('=== FINAL VERIFICATION ===');
  console.log('WebMSX room running:', wmsxRunning);
  console.log('Canvas element exists:', !!canvasExists);
  console.log('Console errors:', errors.length === 0 ? 'NONE' : errors);
  
  await browser.close();
})();
