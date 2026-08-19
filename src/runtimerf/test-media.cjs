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
  
  // Click "Cargar imágenes" - this should open a file dialog
  console.log('\n--- Testing DISK_LOAD_FILES ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cargar = buttons.find(b => b.textContent?.includes('Cargar imágenes'));
    if (cargar) cargar.click();
  });
  
  await page.waitForTimeout(2000);
  
  // Check if file input was created or dialog opened
  const fileInputs = await page.evaluate(() => {
    return document.querySelectorAll('input[type="file"]').length;
  });
  console.log('File inputs after click:', fileInputs);
  
  // Check peripheralControls for what happened
  const result = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.peripheralControls?.getControlReport?.();
  });
  console.log('Control report:', result);
  
  await browser.close();
})();
