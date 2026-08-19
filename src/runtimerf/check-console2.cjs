const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    console.log('[CONSOLE]', msg.type(), msg.text());
  });
  
  page.on('pageerror', err => {
    console.log('[PAGEERROR]', err.message);
  });
  
  page.on('requestfailed', req => {
    console.log('[REQUEST FAILED]', req.url(), req.failure()?.errorText);
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    // Check all scripts
    const scripts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(s => ({ src: s.src, type: s.type }));
    });
    console.log('\n=== ALL SCRIPTS ===');
    scripts.forEach(s => console.log(s.src || '(inline)'));
    
  } catch (e) {
    console.log('Navigation error:', e.message);
  }
  
  await browser.close();
})();
