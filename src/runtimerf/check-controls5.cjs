const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test various control names
  const testControls = [
    'MACHINE_POWER_TOGGLE',
    'MACHINE_POWER_RESET',
    'POWER_TOGGLE',
    'POWER_RESET',
    'RESET',
    'MACHINE_RESET',
    'MACHINE_POWER_ON',
    'MACHINE_POWER_OFF',
  ];
  
  for (const control of testControls) {
    console.log(`\n--- Testing ${control} ---`);
    const result = await page.evaluate((ctrl) => {
      const room = window.WMSX?.room;
      if (room?.peripheralControls) {
        try {
          room.peripheralControls.processControlActivated(ctrl, false, false);
          return { success: true, control: ctrl };
        } catch (e) {
          return { success: false, control: ctrl, error: e.message };
        }
      }
      return { success: false, control: ctrl, error: 'no peripheralControls' };
    }, control);
    console.log('Result:', result);
    await page.waitForTimeout(500);
    
    // Check if machine state changed
    const state = await page.evaluate(() => {
      const room = window.WMSX?.room;
      return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
    });
    console.log('Machine state:', state);
  }
  
  await browser.close();
})();
