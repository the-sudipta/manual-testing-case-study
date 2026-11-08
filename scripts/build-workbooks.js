// Builds the Excel workbooks, CSV/Markdown copies and the RTM from the case sources and the last run.
const path = require('path');
const { loadRun, mergeResults } = require('./workbook/case-results');
const { writeCaseWorkbook, writeTemplate } = require('./workbook/case-workbook');
const { writeRtm } = require('./workbook/rtm-workbook');
const { writeCsv, writeMarkdown } = require('./workbook/text-exports');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'test-cases');

const APPS = [
  { title: 'Sauce Demo', base: 'SauceDemo', source: 'sauce-demo.cases.js' },
  { title: 'Restful Booker Platform', base: 'BookingPlatform', source: 'booking-platform.cases.js' },
];

async function main() {
  const run = loadRun();
  const allCases = [];
  for (const app of APPS) {
    const cases = mergeResults(require(path.join(OUT, 'source', app.source)), run);
    await writeCaseWorkbook(path.join(OUT, `Test_Cases_${app.base}.xlsx`), cases, app.title);
    writeCsv(path.join(OUT, `Test_Cases_${app.base}.csv`), cases);
    writeMarkdown(path.join(OUT, `Test_Cases_${app.base}.md`), cases, app.title);
    allCases.push(...cases);
  }
  await writeRtm(path.join(ROOT, 'requirements-traceability-matrix.xlsx'), require(path.join(OUT, 'source', 'requirements.js')), allCases);
  await writeTemplate(path.join(OUT, 'Test_Case_Template.xlsx'));
  const by = (s) => allCases.filter((c) => c.status === s).length;
  console.log(`cases=${allCases.length} pass=${by('Pass')} fail=${by('Fail')} blocked=${by('Blocked')} notrun=${by('Not Run')}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
