// Requirements traceability matrix: requirement -> test cases -> results -> defects.
const ExcelJS = require('exceljs');
const { styleHeader, styleBody } = require('./sheet-style');

function coverageStatus(linked) {
  if (linked.length === 0) return 'Not Covered';
  if (linked.some((c) => c.status === 'Fail')) return 'Fail';
  if (linked.some((c) => c.status === 'Blocked')) return 'Blocked';
  return 'Pass';
}

function rtmRows(requirements, cases) {
  return requirements.map((r) => {
    const linked = cases.filter((c) => c.req === r.id);
    const bugs = [...new Set(linked.map((c) => c.bug).filter(Boolean))];
    return {
      id: r.id, app: r.app, text: r.text,
      cases: linked.map((c) => c.id).join(', '),
      total: linked.length,
      passed: linked.filter((c) => c.status === 'Pass').length,
      failed: linked.filter((c) => c.status === 'Fail').length,
      blocked: linked.filter((c) => c.status === 'Blocked').length,
      bugs: bugs.join(', '),
      status: coverageStatus(linked),
    };
  });
}

async function writeRtm(file, requirements, cases) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Sudipta Kumar Das';
  const sheet = workbook.addWorksheet('RTM');
  sheet.columns = [
    { header: 'Requirement ID', key: 'id', width: 14 }, { header: 'Application', key: 'app', width: 16 },
    { header: 'Requirement', key: 'text', width: 60 }, { header: 'Test Cases', key: 'cases', width: 50 },
    { header: 'Total', key: 'total', width: 7 }, { header: 'Passed', key: 'passed', width: 8 },
    { header: 'Failed', key: 'failed', width: 8 }, { header: 'Blocked', key: 'blocked', width: 8 },
    { header: 'Defects', key: 'bugs', width: 26 }, { header: 'Status', key: 'status', width: 12 },
  ];
  rtmRows(requirements, cases).forEach((row) => sheet.addRow(row));
  styleHeader(sheet);
  styleBody(sheet, 'status');
  await workbook.xlsx.writeFile(file);
}

module.exports = { rtmRows, writeRtm };
