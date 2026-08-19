const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check navbar visibility and text
  const navbarInfo = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('.mantine-AppShellNavbar-root');
    const texts = Array.from(document.querySelectorAll('.mantine-Text-root')).map(el => ({
      text: el.textContent?.trim(),
      visible: el.offsetParent !== null,
      style: window.getComputedStyle(el).cssText.slice(0, 200)
    })).filter(t => t.text && t.text.length > 0);
    
    return {
      navbarExists: !!navbar,
      navbarWidth: navbar?.offsetWidth,
      texts: texts.slice(0, 30)
    }
  });
  
  console.log('Navbar info:', JSON.stringify(navbarInfo, null, 2));
  
  // Check if collapsed
  const collapsed = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('.mantine-AppShellNavbar-root');
    return navbar?.style?.width || window.getComputedStyle(navbar).width;
  });
  console.log('Navbar width:', collapsed);
  
  await browser.close();
})();
