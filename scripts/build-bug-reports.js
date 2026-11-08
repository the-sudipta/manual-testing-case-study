// Builds one Markdown report per defect plus the bug-reports/README.md index from bug-reports/source/bugs.js.
const fs = require('fs');
const path = require('path');
const bugs = require('../bug-reports/source/bugs');
const { fileName } = require('./bug-report-files');

const DIR = path.resolve(__dirname, '../bug-reports');
const REPO = 'https://github.com/the-sudipta/manual-testing-case-study';

function evidenceLines(bug) {
  const shots = bug.cases.map((id) => `evidence/${id}.jpg`).filter((f) => fs.existsSync(path.join(DIR, f)));
  const extra = (bug.evidence || []).map((f) => `evidence/${f}`);
  return [...shots.map((f) => `![${path.basename(f)}](${f})`), ...extra.map((f) => `- [${path.basename(f)}](${f})`)];
}

function renderBug(bug) {
  return [
    `# ${bug.id}: ${bug.title}`, '',
    '| Field | Value |', '|---|---|',
    `| Application | ${bug.app} (${bug.url}) |`, `| Module | ${bug.module} |`,
    `| Severity | ${bug.severity} |`, `| Priority | ${bug.priority} |`,
    `| Status | Open |`, `| Found by | ${bug.cases.join(', ')} |`,
    `| Environment | ${bug.env} |`, `| Reported | 2026-11-08 by Sudipta Kumar Das |`, '',
    '## Steps to reproduce', ...bug.steps.map((s, i) => `${i + 1}. ${s}`), '',
    '## Expected result', bug.expected, '',
    '## Actual result', bug.actual, '',
    ...(bug.notes ? ['## Notes', bug.notes, ''] : []),
    '## Evidence', ...evidenceLines(bug), '',
  ].join('\n');
}

function renderIndex() {
  const rows = bugs.map((b) => `| [${b.id}](${fileName(b)}) | ${b.app} | ${b.module} | ${b.title.replace(/\|/g, '\\|')} | ${b.severity} | ${b.priority} | Open |`);
  const count = (sev) => bugs.filter((b) => b.severity === sev).length;
  return [
    '# Bug Reports', '',
    `${bugs.length} real defects, each reproduced at least twice with evidence. They are also tracked as [GitHub Issues](${REPO}/issues).`, '',
    `Severity: Critical ${count('Critical')} · Major ${count('Major')} · Minor ${count('Minor')} · Trivial ${count('Trivial')}`, '',
    'Life cycle: New → Open → In Progress → Fixed → Retest → Closed (or Rejected / Deferred).', '',
    '| ID | Application | Module | Title | Severity | Priority | Status |', '|---|---|---|---|---|---|---|',
    ...rows, '',
    'Note: Sauce Demo intentionally ships special users (problem_user, error_user, visual_user, performance_glitch_user)',
    'with defects for practice. They are reported here exactly as found, the way they would be reported in a real project.', '',
  ].join('\n');
}

bugs.forEach((bug) => fs.writeFileSync(path.join(DIR, fileName(bug)), renderBug(bug)));
fs.writeFileSync(path.join(DIR, 'README.md'), renderIndex());
console.log(`bug reports written: ${bugs.length}`);
