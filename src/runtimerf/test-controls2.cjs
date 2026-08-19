const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test clicking "Reiniciar" directly with onClick
  console.log('\n--- Testing click handler ---');
  const result = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const reiniciar = buttons.find(b => b.textContent?.includes('Reiniciar'));
    if (reiniciar) {
      console.log('Found button:', reiniciar.textContent);
      console.log('onClick:', reiniciar.onclick);
      reiniciar.click();
      return 'clicked';
    }
    return 'not found';
  });
  console.log('Result:', result);
  
  await page.waitForTimeout(2000);
  
  // Check WebMSX controls
  const controls = await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (!room) return 'no room';
    return {
      hasPeripheralControls: !!room.peripheralControls,
      controls: room.peripheralControls ? Object.keys(room.peripheralControls) : [],
    };
  });
  console.log('WebMSX controls:', controls);
  
  await browser.close();
})();
