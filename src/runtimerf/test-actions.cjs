const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test power toggle
  console.log('--- Testing power toggle ---');
  const before = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
  });
  console.log('Before:', before);
  
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const power = buttons.find(b => b.textContent?.includes('Encendido'));
    if (power) power.click();
  });
  
  await page.waitForTimeout(2000);
  
  const after = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
  });
  console.log('After power toggle:', after);
  
  // Test reset
  console.log('\n--- Testing reset ---');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const reset = buttons.find(b => b.textContent?.includes('Reiniciar'));
    if (reset) reset.click();
  });
  
  await page.waitForTimeout(2000);
  
  const afterReset = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
  });
  console.log('After reset:', afterReset);
  
  await browser.close();
})();
