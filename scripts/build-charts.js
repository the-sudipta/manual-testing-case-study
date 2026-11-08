// Renders the summary report charts to PNG (SVG drawn in a headless browser, then screenshotted).
const path = require('path');
const { chromium } = require('@playwright/test');
const data = require('./charts/chart-data');
const { stackedBars, simpleBars } = require('./charts/svg-charts');

const OUT = path.resolve(__dirname, '../reports/charts');

const CHARTS = [
  { file: 'execution-status.png', svg: () => stackedBars('Execution status by application', data.executionStatus(), ['Pass', 'Fail', 'Blocked']) },
  { file: 'defects-by-severity.png', svg: () => simpleBars('Defects by severity', data.defectsBySeverity()) },
  { file: 'defect-density-by-module.png', svg: () => simpleBars('Defects per module (defects / test cases)', data.defectDensity()) },
];

async function render(page, chart) {
  await page.setContent(`<body style="margin:0">${chart.svg()}</body>`);
  await page.locator('svg').screenshot({ path: path.join(OUT, chart.file) });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor: 2 });
  for (const chart of CHARTS) await render(page, chart);
  await browser.close();
  console.log(`charts written: ${CHARTS.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
