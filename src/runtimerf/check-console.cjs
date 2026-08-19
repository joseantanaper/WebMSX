const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', err => {
    errors.push(err.message);
  });
  
  try {
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(5000);
    
    const wmsxLoaded = await page.evaluate(() => typeof window.WMSX !== 'undefined');
    console.log('WMSX loaded:', wmsxLoaded);
    
    const scriptErrors = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('script')).map(s => s.src).filter(s => s.includes('webmsx'));
    });
    console.log('WebMSX scripts:', scriptErrors);
    
    console.log('\n=== CONSOLE ERRORS ===');
    if (errors.length === 0) {
      console.log('No errors');
    } else {
      errors.forEach(e => console.log('ERROR:', e));
    }
    
    const loader = await page.$('.mantine-Loader-root');
    console.log('Loader present:', !!loader);
    
    const navbarText = await page.$$eval('.mantine-Text-root', els => els.map(e => e.textContent).filter(t => t && t.trim()));
    console.log('Navbar texts found:', navbarText.slice(0, 20));
    
  } catch (e) {
    console.log('Navigation error:', e.message);
  }
  
  await browser.close();
})();
