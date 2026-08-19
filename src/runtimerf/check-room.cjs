const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('[CONSOLE]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[PAGEERROR]', err.message));
  
  await page.goto('http://localhost:5174', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(15000);
  
  const roomStatus = await page.evaluate(() => {
    return {
      WMSX: typeof window.WMSX !== 'undefined',
      room: !!window.WMSX?.room,
      webmsxRoom: !!window.webmsxRoom,
      canvas: document.getElementById('webmsx-canvas')?.innerHTML,
    }
  });
  console.log('Room status:', roomStatus);
  
  const loader = await page.$('.mantine-Loader-root');
  console.log('Loader present:', !!loader);
  
  await browser.close();
})();
