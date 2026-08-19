const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check navbar texts
  const texts = await page.evaluate(() => {
    const all = document.querySelectorAll('[class*="mantine-Text"]');
    return Array.from(all).map(el => ({
      text: el.textContent?.trim(),
      visible: el.offsetParent !== null,
      width: el.offsetWidth,
      height: el.offsetHeight
    })).filter(t => t.text && t.text.length > 0);
  });
  
  console.log('Text elements:', JSON.stringify(texts.slice(0, 40), null, 2));
  
  // Check navbar
  const navbar = await page.evaluate(() => {
    const nav = document.querySelector('[class*="AppShellNavbar"]') || document.querySelector('[id="navbar"]');
    return nav ? {
      width: nav.offsetWidth,
      height: nav.offsetHeight,
      html: nav.innerHTML.slice(0, 500)
    } : null;
  });
  
  console.log('Navbar:', JSON.stringify(navbar, null, 2));
  
  await browser.close();
})();
