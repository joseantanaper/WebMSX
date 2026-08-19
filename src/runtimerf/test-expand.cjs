const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Click "Disquete A" to expand
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const disqueteA = buttons.find(b => b.textContent?.includes('Disquete A'));
    if (disqueteA) disqueteA.click();
  });
  
  await page.waitForTimeout(500);
  
  // Check all buttons now
  const buttons = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('[class*="AppShellNavbar"]');
    if (!navbar) return [];
    return Array.from(navbar.querySelectorAll('button')).map(btn => ({
      text: btn.textContent?.trim(),
      visible: btn.offsetParent !== null,
    }));
  });
  
  console.log('After clicking "Disquete A":');
  buttons.forEach(b => console.log(`  ${b.visible ? '✓' : '✗'} ${b.text}`));
  
  await browser.close();
})();
