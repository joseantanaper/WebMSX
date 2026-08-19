const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Check what's actually rendered
  const html = await page.evaluate(() => document.body.innerHTML);
  console.log('Body length:', html.length);
  console.log('Has navbar:', html.includes('navbar') || html.includes('AppShellNavbar'));
  console.log('Has accordion items:', html.includes('Disquete A') && html.includes('Cargar imágenes'));
  
  // Screenshot for visual verification
  await page.screenshot({ path: '/tmp/webmsxrf-current.png', fullPage: true });
  console.log('Screenshot saved to /tmp/webmsxrf-current.png');
  
  await browser.close();
})();
