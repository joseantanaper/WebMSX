const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  // Check room.fileLoader API
  const api = await page.evaluate(() => {
    const room = window.WMSX?.room;
    if (!room) return 'no room';
    
    return {
      hasFileLoader: !!room.fileLoader,
      fileLoaderKeys: room.fileLoader ? Object.keys(room.fileLoader) : [],
      hasLoadFromContent: typeof room.fileLoader?.loadFromContent === 'function',
      hasLoadFromFile: typeof room.fileLoader?.loadFromFile === 'function',
      hasOpenLoadFileDialog: typeof room.fileLoader?.openLoadFileDialog === 'function',
      hasScreenOpenLoadFileDialog: typeof room.screen?.openLoadFileDialog === 'function',
      diskDriveSocket: room.machine?.getDiskDriveSocket?.() ? Object.keys(room.machine.getDiskDriveSocket()) : 'no socket',
    };
  });
  console.log('FileLoader API:', JSON.stringify(api, null, 2));
  
  await browser.close();
})();
