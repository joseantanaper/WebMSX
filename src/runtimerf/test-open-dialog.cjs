const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test screen.openLoadFileDialog()
  console.log('\n--- Testing screen.openLoadFileDialog() ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room?.screen?.openLoadFileDialog) {
      room.screen.openLoadFileDialog();
    }
  });
  
  await page.waitForTimeout(2000);
  
  const fileInputs = await page.evaluate(() => document.querySelectorAll('input[type="file"]').length);
  console.log('File inputs after openLoadFileDialog:', fileInputs);
  
  // Test fileLoader.openFileChooserDialog()
  console.log('\n--- Testing fileLoader.openFileChooserDialog() ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room?.fileLoader?.openFileChooserDialog) {
      room.fileLoader.openFileChooserDialog();
    }
  });
  
  await page.waitForTimeout(2000);
  
  const fileInputs2 = await page.evaluate(() => document.querySelectorAll('input[type="file"]').length);
  console.log('File inputs after openFileChooserDialog:', fileInputs2);
  
  await browser.close();
})();
