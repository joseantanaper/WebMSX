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
  
  // Check control bar
  const controlBar = await page.evaluate(() => {
    const bars = document.querySelectorAll('[class*="wmsx-control"], [id*="control"], [class*="ControlBar"]');
    return Array.from(bars).map(b => ({ 
      id: b.id, 
      class: b.className, 
      style: window.getComputedStyle(b).display,
      visible: b.offsetParent !== null
    }));
  });
  
  // Check WebMSX running
  const wmsxRunning = await page.evaluate(() => !!window.WMSX?.room);
  
  console.log('=== FINAL VERIFICATION ===');
  console.log('WebMSX room running:', wmsxRunning);
  console.log('Control bars:', controlBar);
  console.log('Console errors:', errors.length === 0 ? 'NONE' : errors);
  
  await browser.close();
})();
