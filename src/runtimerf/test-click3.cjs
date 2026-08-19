const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Click "Disquete A" to expand
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const disqueteA = buttons.find(b => b.textContent?.includes('Disquete A'));
    if (disqueteA) disqueteA.click();
  });
  
  await page.waitForTimeout(1000);
  
  // Check if sub-items appeared
  const afterClick = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('[class*="AppShellNavbar"]');
    const buttons = navbar ? Array.from(navbar.querySelectorAll('button')) : [];
    return buttons.map(btn => ({
      text: btn.textContent?.trim(),
      visible: btn.offsetParent !== null,
    })).filter(b => b.text && b.text.length > 0);
  });
  
  console.log('After click:', afterClick.map(b => ({text: b.text, visible: b.visible})));
  
  await browser.close();
})();
