// Merges the designed test cases with the recorded execution results.
const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.resolve(__dirname, '../../execution/results/run-results.json');

function loadRun() {
  if (!fs.existsSync(RESULTS_FILE)) return { results: {}, finishedAt: '', browser: '' };
  return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf8'));
}

function bugIdFrom(note) {
  const match = (note || '').match(/BUG-\d{3}/);
  return match ? match[0] : '';
}

function actualFor(testCase, result) {
  if (!result) return '';
  if (result.status === 'Pass') return 'As expected';
  if (result.status === 'Blocked') return result.note;
  return testCase.actual || result.error;
}

function mergeResults(cases, run) {
  const executedOn = run.finishedAt ? run.finishedAt.slice(0, 10) : '';
  return cases.map((testCase) => {
    const result = run.results[testCase.id];
    return {
      ...testCase,
      status: result ? result.status : 'Not Run',
      actual: actualFor(testCase, result),
      bug: result ? bugIdFrom(result.note) : '',
      remarks: result ? `Executed ${executedOn} on ${run.browser}` : '',
    };
  });
}

module.exports = { loadRun, mergeResults };
