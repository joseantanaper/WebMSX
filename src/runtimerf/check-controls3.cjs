const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check peripheralControls for available controls
  const controls = await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (!room?.peripheralControls) return 'no peripheralControls';
    
    // Check getControlReport
    const report = room.peripheralControls.getControlReport?.();
    return {
      report,
      getControlReportType: typeof room.peripheralControls.getControlReport,
    };
  });
  console.log('Control report:', JSON.stringify(controls, null, 2));
  
  // Test room.reset() directly
  console.log('\n--- Testing room.reset() ---');
  await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (room) room.reset();
  });
  
  await page.waitForTimeout(2000);
  
  const after = await page.evaluate(() => {
    const room = window.WMSX?.room;
    return room ? {
      machineType: room.machine?.machineType,
      powerIsOn: room.machine?.powerIsOn,
      cpu: room.machine?.cpu ? Object.keys(room.machine.cpu).slice(0, 10) : 'no cpu',
    } : 'no room';
  });
  console.log('After room.reset():', after);
  
  await browser.close();
})();
