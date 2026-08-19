const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Test POWER_TOGGLE with longer wait
  console.log('--- Testing POWER_TOGGLE (should turn off) ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room?.peripheralControls) {
      room.peripheralControls.processControlActivated('MACHINE_POWER_TOGGLE', false, false);
    }
  });
  
  await page.waitForTimeout(3000);
  
  const state = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
  });
  console.log('After POWER_TOGGLE (3s):', state);
  
  // Test RESET with longer wait
  console.log('\n--- Testing RESET ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room?.peripheralControls) {
      room.peripheralControls.processControlActivated('RESET', false, false);
    }
  });
  
  await page.waitForTimeout(3000);
  
  const state2 = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
  });
  console.log('After RESET (3s):', state2);
  
  // Test direct machine.powerOff()
  console.log('\n--- Testing machine.powerOff() ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room?.machine?.powerOff) room.machine.powerOff();
  });
  
  await page.waitForTimeout(2000);
  
  const state3 = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room?.machine ? { powerIsOn: room.machine.powerIsOn } : {};
  });
  console.log('After machine.powerOff():', state3);
  
  await browser.close();
})();
