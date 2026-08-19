const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Expand Disquete A
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => x.textContent?.includes('Disquete A'));
    if (b) b.click();
  });
  await page.waitForTimeout(500);
  
  // Click "Cargar imágenes" - should open file dialog
  console.log('\n--- Testing loadDiskFiles (screen.openLoadFileDialog) ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cargar = buttons.find(b => b.textContent?.includes('Cargar imágenes'));
    if (cargar) cargar.click();
  });
  
  await page.waitForTimeout(2000);
  
  const fileInputs = await page.evaluate(() => document.querySelectorAll('input[type="file"]').length);
  console.log('File inputs after click:', fileInputs);
  
  // Test "Cargar ROM" for cartridge
  console.log('\n--- Testing cartLoadFile ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cart = buttons.find(b => b.textContent?.includes('Cargar ROM'));
    if (cart) cart.click();
  });
  
  await page.waitForTimeout(2000);
  
  const fileInputs2 = await page.evaluate(() => document.querySelectorAll('input[type="file"]').length);
  console.log('File inputs after Cargar ROM:', fileInputs2);
  
  await browser.close();
})();
