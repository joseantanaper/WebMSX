const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check navbar structure and visibility
  const navbarInfo = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('[class*="AppShellNavbar"]');
    const buttons = navbar ? Array.from(navbar.querySelectorAll('button')) : [];
    return {
      navbarWidth: navbar?.offsetWidth,
      buttonCount: buttons.length,
      buttons: buttons.map(btn => ({
        text: btn.textContent?.trim(),
        visible: btn.offsetParent !== null,
        style: btn.style.cssText.slice(0, 100)
      })).filter(b => b.text && b.text.length > 0)
    };
  });
  
  console.log('Navbar:', JSON.stringify(navbarInfo, null, 2));
  
  // Check WebMSX still running
  const wmsx = await page.evaluate(() => !!window.WMSX?.room);
  console.log('WebMSX running:', wmsx);
  
  await browser.close();
})();
