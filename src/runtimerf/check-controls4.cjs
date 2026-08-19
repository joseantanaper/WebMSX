const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test machine.reset()
  console.log('\n--- Testing room.machine.reset() ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room?.machine?.reset) room.machine.reset();
  });
  
  await page.waitForTimeout(2000);
  
  const after = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? {
      machineType: room.machine.machineType,
      powerIsOn: room.machine.powerIsOn,
    } : 'no room';
  });
  console.log('After machine.reset():', after);
  
  // Check what controls are available in peripheralControls
  const controlNames = await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (!room?.peripheralControls) return [];
    
    // Try to find control names by checking the source or constants
    const WMSX = window.WMSX;
    const keys = Object.keys(WMSX || {});
    return keys.filter(k => k.includes('CONTROL') || k.includes('POWER') || k.includes('RESET') || k.includes('DISK') || k.includes('CARTRIDGE') || k.includes('TAPE') || k.includes('SCREEN'));
  });
  console.log('\nWMSX control constants:', controlNames);
  
  await browser.close();
})();
