const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check WebMSX room structure
  const api = await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (!room) return 'no room';
    
    return {
      machineKeys: Object.keys(room.machine || {}),
      hasPowerOn: typeof room.powerOn === 'function',
      hasPowerOff: typeof room.powerOff === 'function',
      hasReset: typeof room.reset === 'function',
      peripheralControlsKeys: Object.keys(room.peripheralControls || {}),
      // Check for control constants
      WMSXConstants: Object.keys(window.WMSX || {}).filter(k => k.includes('CONTROL') || k.includes('POWER') || k.includes('RESET')),
    };
  });
  console.log('WebMSX API:', JSON.stringify(api, null, 2));
  
  // Test calling processControlActivated directly
  console.log('\n--- Testing direct control call ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room && room.peripheralControls) {
      console.log('Calling MACHINE_POWER_RESET...');
      room.peripheralControls.processControlActivated('MACHINE_POWER_RESET', false, false);
    }
  });
  
  await page.waitForTimeout(2000);
  
  const after = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room ? {
      machineRunning: room.machine?.running,
      cpuState: room.machine?.cpu?.state,
    } : 'no room';
  });
  console.log('After direct call:', after);
  
  await browser.close();
})();
