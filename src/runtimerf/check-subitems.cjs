const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Check for all buttons including sub-items in DOM
  const buttons = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('[class*="AppShellNavbar"]');
    if (!navbar) return [];
    return Array.from(navbar.querySelectorAll('button')).map(btn => ({
      text: btn.textContent?.trim(),
      visible: btn.offsetParent !== null,
      style: btn.style.cssText.slice(0, 150)
    }));
  });
  
  console.log('All buttons in DOM:');
  buttons.forEach(b => console.log(`  ${b.visible ? '✓' : '✗'} ${b.text}`));
  
  await browser.close();
})();
