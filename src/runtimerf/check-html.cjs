const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(5000);
  
  // Get navbar HTML
  const navbarHtml = await page.evaluate(() => {
    const navbar = document.querySelector('[id="navbar"]') || document.querySelector('[class*="AppShellNavbar"]');
    return navbar ? navbar.innerHTML : 'NO NAVBAR FOUND';
  });
  
  console.log('Navbar HTML (first 3000 chars):');
  console.log(navbarHtml.slice(0, 3000));
  
  await browser.close();
})();
