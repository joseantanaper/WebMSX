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
  
  // Check accordion structure
  const accordionInfo = await page.evaluate(() => {
    const accordions = document.querySelectorAll('[class*="Accordion"]');
    return Array.from(accordions).map(el => ({
      class: el.className,
      html: el.innerHTML.slice(0, 300)
    }));
  });
  
  console.log('Accordions:', JSON.stringify(accordionInfo, null, 2));
  
  // Check for control bar
  const controlBar = await page.evaluate(() => {
    const bar = document.querySelector('[class*="wmsx-control-bar"]') || document.querySelector('[id*="control-bar"]') || document.querySelector('[class*="ControlBar"]');
    return bar ? { found: true, style: window.getComputedStyle(bar).display } : { found: false };
  });
  
  console.log('Control bar:', controlBar);
  
  console.log('Errors:', errors.length === 0 ? 'NONE' : errors);
  
  await browser.close();
})();
