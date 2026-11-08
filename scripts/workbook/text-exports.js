// CSV and Markdown copies of the workbooks so the cases are readable on GitHub.
const fs = require('fs');
const { COLUMNS, numberedSteps } = require('./case-workbook');

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
const mdCell = (value) => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');

function rowValues(c) {
  return COLUMNS.map((col) => (col.key === 'steps' ? numberedSteps(c.steps) : c[col.key]));
}

function writeCsv(file, cases) {
  const lines = [COLUMNS.map((c) => csvCell(c.header)).join(',')];
  cases.forEach((c) => lines.push(rowValues(c).map(csvCell).join(',')));
  fs.writeFileSync(file, '﻿' + lines.join('\r\n') + '\r\n');
}

function writeMarkdown(file, cases, title) {
  const keep = ['id', 'module', 'technique', 'scenario', 'steps', 'data', 'expected', 'actual', 'status', 'severity', 'priority', 'bug'];
  const cols = COLUMNS.filter((c) => keep.includes(c.key));
  const lines = [
    `# Test Cases — ${title}`, '',
    'Generated from the workbook source. Technique: EP = Equivalence Partitioning, BVA = Boundary Value Analysis,',
    'DT = Decision Table, ST = State Transition, EG = Error Guessing.', '',
    `| ${cols.map((c) => c.header).join(' | ')} |`,
    `|${cols.map(() => '---').join('|')}|`,
  ];
  cases.forEach((c) => {
    const values = cols.map((col) => (col.key === 'steps' ? numberedSteps(c.steps) : c[col.key]));
    lines.push(`| ${values.map(mdCell).join(' | ')} |`);
  });
  fs.writeFileSync(file, lines.join('\n') + '\n');
}

module.exports = { writeCsv, writeMarkdown };
