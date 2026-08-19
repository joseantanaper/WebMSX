const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test clicking "Reiniciar" (reset)
  console.log('\n--- Clicking Reiniciar ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const reiniciar = buttons.find(b => b.textContent?.includes('Reiniciar'));
    if (reiniciar) reiniciar.click();
  });
  
  await page.waitForTimeout(2000);
  
  // Check if machine reset happened
  const afterReset = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room ? {
      machine: room.machine?.constructor?.name,
      cpu: room.machine?.cpu?.state,
      vdp: room.machine?.vdp?.state,
    } : 'no room';
  });
  console.log('After reset:', afterReset);
  
  // Test clicking "Disquete A" then "Cargar imágenes"
  console.log('\n--- Expanding Disquete A ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const disqueteA = buttons.find(b => b.textContent?.includes('Disquete A') && !b.textContent?.includes('Disquete B'));
    if (disqueteA) disqueteA.click();
  });
  
  await page.waitForTimeout(500);
  
  console.log('\n--- Clicking Cargar imágenes ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cargar = buttons.find(b => b.textContent?.includes('Cargar imágenes'));
    if (cargar) cargar.click();
  });
  
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
