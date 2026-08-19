const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check all elements with mantine classes
  const elements = await page.evaluate(() => {
    const all = document.querySelectorAll('[class*="mantine"]');
    const navItems = Array.from(all).filter(el => 
      el.className.includes('AppShellNavbar') || 
      el.className.includes('Navbar') ||
      el.className.includes('NavLink') ||
      el.id === 'navbar'
    );
    return navItems.map(el => ({
      tag: el.tagName,
      id: el.id,
      class: el.className.slice(0, 100),
      width: el.offsetWidth,
      height: el.offsetHeight,
      text: el.textContent?.trim().slice(0, 50)
    }));
  });
  
  console.log('Mantine navbar elements:', JSON.stringify(elements, null, 2));
  
  // Check all Text elements
  const texts = await page.evaluate(() => {
    const all = document.querySelectorAll('[class*="mantine-Text"]');
    return Array.from(all).map(el => ({
      text: el.textContent?.trim(),
      class: el.className,
      visible: el.offsetParent !== null,
      width: el.offsetWidth,
      height: el.offsetHeight
    })).filter(t => t.text && t.text.length > 0);
  });
  
  console.log('\nText elements:', JSON.stringify(texts.slice(0, 30), null, 2));
  
  await browser.close();
})();
