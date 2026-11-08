// Builds a test case workbook: "Test Cases" sheet in the owner's template + "Summary" sheet.
const ExcelJS = require('exceljs');
const { styleHeader, styleBody } = require('./sheet-style');

const COLUMNS = [
  { header: 'Test Case ID', key: 'id', width: 13 },
  { header: 'Module', key: 'module', width: 14 },
  { header: 'Requirement', key: 'req', width: 12 },
  { header: 'Technique', key: 'technique', width: 10 },
  { header: 'Scenario', key: 'scenario', width: 30 },
  { header: 'Pre-conditions', key: 'pre', width: 26 },
  { header: 'Test Steps', key: 'steps', width: 40 },
  { header: 'Test Data', key: 'data', width: 24 },
  { header: 'Expected Result', key: 'expected', width: 36 },
  { header: 'Actual Result', key: 'actual', width: 36 },
  { header: 'Status', key: 'status', width: 10 },
  { header: 'Severity', key: 'severity', width: 10 },
  { header: 'Priority', key: 'priority', width: 9 },
  { header: 'Bug ID', key: 'bug', width: 10 },
  { header: 'Remarks', key: 'remarks', width: 30 },
];

const numberedSteps = (steps) => steps.map((s, i) => `${i + 1}. ${s}`).join('\n');

function addCaseSheet(workbook, cases) {
  const sheet = workbook.addWorksheet('Test Cases');
  sheet.columns = COLUMNS;
  cases.forEach((c) => sheet.addRow({ ...c, pre: c.pre.replace(/^Pre: /, ''), steps: numberedSteps(c.steps) }));
  styleHeader(sheet);
  styleBody(sheet, 'status');
}

function addSummarySheet(workbook, cases, title) {
  const sheet = workbook.addWorksheet('Summary');
  sheet.columns = [{ header: 'Metric', key: 'k', width: 28 }, { header: 'Value', key: 'v', width: 40 }];
  const count = (status) => cases.filter((c) => c.status === status).length;
  const executed = cases.length - count('Not Run') - count('Blocked');
  [
    ['Application', title], ['Total test cases', cases.length], ['Executed', executed],
    ['Passed', count('Pass')], ['Failed', count('Fail')], ['Blocked', count('Blocked')],
    ['Pass rate (of executed)', executed ? `${((count('Pass') / executed) * 100).toFixed(1)}%` : '-'],
    ['Defects linked', new Set(cases.map((c) => c.bug).filter(Boolean)).size],
  ].forEach(([k, v]) => sheet.addRow({ k, v }));
  styleHeader(sheet);
  styleBody(sheet);
}

async function writeCaseWorkbook(file, cases, title) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sudipta Kumar Das';
  addCaseSheet(workbook, cases);
  addSummarySheet(workbook, cases, title);
  await workbook.xlsx.writeFile(file);
}

async function writeTemplate(file) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sudipta Kumar Das';
  addCaseSheet(workbook, []);
  await workbook.xlsx.writeFile(file);
}

module.exports = { COLUMNS, writeCaseWorkbook, writeTemplate, numberedSteps };
