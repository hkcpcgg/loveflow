/* 카톡 첫인상 그림(og-image.png 2400×1260) 다시 뽑기 — NODE_PATH=$(npm root -g) node tools/og/shot.js */
const { chromium } = require('playwright'); const path = require('path');
(async () => { const br = await chromium.launch(); const pg = await (await br.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })).newPage();
  await pg.goto('file://' + path.join(__dirname, 'og.html')); await pg.waitForTimeout(800);
  await pg.screenshot({ path: path.join(__dirname, '../../og-image.png') }); await br.close(); })();
