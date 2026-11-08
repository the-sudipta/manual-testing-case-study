// Turns the case sources, the recorded run and the bug list into chart-ready numbers.
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const run = require(path.join(ROOT, 'execution/results/run-results.json'));
const bugs = require(path.join(ROOT, 'bug-reports/source/bugs'));

const APPS = [
  { name: 'Sauce Demo', cases: require(path.join(ROOT, 'test-cases/source/sauce-demo.cases.js')) },
  { name: 'Booking Platform', cases: require(path.join(ROOT, 'test-cases/source/booking-platform.cases.js')) },
];

const statusOf = (c) => (run.results[c.id] ? run.results[c.id].status : 'Not Run');

function executionStatus() {
  return APPS.map((app) => ({
    label: app.name,
    values: ['Pass', 'Fail', 'Blocked'].map((s) => app.cases.filter((c) => statusOf(c) === s).length),
  }));
}

function defectsBySeverity() {
  return ['Critical', 'Major', 'Minor', 'Trivial'].map((s) => ({ label: s, value: bugs.filter((b) => b.severity === s).length }));
}

function defectDensity() {
  const short = (app) => (app === 'Sauce Demo' ? 'SD' : 'BK');
  const rows = [];
  for (const app of APPS) {
    const modules = [...new Set(app.cases.map((c) => c.module))];
    for (const module of modules) {
      const cases = app.cases.filter((c) => c.module === module).length;
      const defects = bugs.filter((b) => b.module === module && short(b.app) === short(app.name)).length;
      if (defects) rows.push({ label: `${short(app.name)} ${module}`, value: defects, note: `${defects}/${cases} cases` });
    }
  }
  return rows.sort((a, b) => b.value - a.value);
}

module.exports = { executionStatus, defectsBySeverity, defectDensity };
