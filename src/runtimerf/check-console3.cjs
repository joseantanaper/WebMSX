const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('[CONSOLE]', msg.type(), msg.text());
  });
  
  page.on('pageerror', err => {
    console.log('[PAGEERROR]', err.message);
  });
  
  page.on('request', req => {
    if (req.url().includes('webmsx')) {
      console.log('[REQUEST]', req.method(), req.url());
    }
  });
  
  page.on('requestfailed', req => {
    if (req.url().includes('webmsx')) {
      console.log('[REQUEST FAILED]', req.url(), req.failure()?.errorText);
    }
  });
  
  page.on('response', res => {
    if (res.url().includes('webmsx')) {
      console.log('[RESPONSE]', res.status(), res.url());
    }
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(8000);
    
  } catch (e) {
    console.log('Navigation error:', e.message);
  }
  
  await browser.close();
})();
