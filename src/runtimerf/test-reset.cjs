const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Get initial machine state
  const before = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room ? {
      machineRunning: room.machine?.running,
      cpuState: room.machine?.cpu?.state,
    } : 'no room';
  });
  console.log('Before reset:', before);
  
  // Click Reiniciar
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const reiniciar = buttons.find(b => b.textContent?.includes('Reiniciar'));
    if (reiniciar) reiniciar.click();
  });
  
  await page.waitForTimeout(2000);
  
  // Check after reset
  const after = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room ? {
      machineRunning: room.machine?.running,
      cpuState: room.machine?.cpu?.state,
    } : 'no room';
  });
  console.log('After reset:', after);
  
  await browser.close();
})();
