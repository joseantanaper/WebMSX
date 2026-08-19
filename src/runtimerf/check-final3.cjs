const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test all basic controls
  console.log('=== TESTING CONTROLS ===');
  
  // 1. Power toggle (on -> off)
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent?.includes('Encendido'));
    if (b) b.click();
  });
  await page.waitForTimeout(2000);
  let state = await page.evaluate(() => window.WMSX?.room?.machine?.powerIsOn);
  console.log('1. Power toggle (on->off):', state === false ? '✓' : '✗', state);
  
  // 2. Power toggle (off -> on)
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent?.includes('Encendido'));
    if (b) b.click();
  });
  await page.waitForTimeout(2000);
  state = await page.evaluate(() => window.WMSX?.room?.machine?.powerIsOn);
  console.log('2. Power toggle (off->on):', state === true ? '✓' : '✗', state);
  
  // 3. Reset
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent?.includes('Reiniciar'));
    if (b) b.click();
  });
  await page.waitForTimeout(3000);
  state = await page.evaluate(() => window.WMSX?.room?.machine?.powerIsOn);
  console.log('3. Reset (stays on):', state === true ? '✓' : '✗', state);
  
  // 4. Fullscreen
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent?.includes('Pantalla completa'));
    if (b) b.click();
  });
  await page.waitForTimeout(1000);
  const fs = await page.evaluate(() => document.fullscreenElement !== null);
  console.log('4. Fullscreen:', fs ? '✓' : '✗');
  
  // Check WebMSX running
  const wmsx = await page.evaluate(() => !!window.WMSX?.room);
  console.log('\nWebMSX running:', wmsx);
  
  // Check navbar items
  const navbar = await page.evaluate(() => {
    const nav = document.querySelector('[id="navbar"]');
    return nav ? Array.from(nav.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean) : [];
  });
  console.log('\nNavbar items:', navbar.length);
  
  // Errors
  console.log('\nConsole errors:', errors.length === 0 ? 'NONE' : errors);
  
  await browser.close();
})();
