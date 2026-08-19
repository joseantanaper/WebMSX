const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // visible browser
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
  console.log('\n--- Testing DISK_LOAD_FILES (visible browser) ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const cargar = buttons.find(b => b.textContent?.includes('Cargar imágenes'));
    if (cargar) cargar.click();
  });
  
  await page.waitForTimeout(3000);
  
  // Check for file input or dialog
  const fileInputs = await page.evaluate(() => {
    return document.querySelectorAll('input[type="file"]').length;
  });
  console.log('File inputs:', fileInputs);
  
  // Keep browser open for manual inspection
  console.log('\nBrowser open - check if file dialog appeared. Press Enter to close...');
  
  // Wait for user input
  await new Promise(resolve => process.stdin.once('data', resolve));
  
  await browser.close();
})();
