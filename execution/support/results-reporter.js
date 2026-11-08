// Writes one compact result per test case ID so the workbooks can be filled from the real run.
const fs = require('fs');
const path = require('path');

const CASE_ID = /^(TC-[A-Z]{2}-\d{3})/;

function toStatus(test, result) {
  if (result.status === 'skipped') return 'Blocked';
  if (test.expectedStatus === 'failed' && result.status === 'failed') return 'Fail';
  return result.status === 'passed' ? 'Pass' : 'Fail';
}

class ResultsReporter {
  constructor(options = {}) {
    this.outputFile = options.outputFile || 'execution/results/run-results.json';
    this.results = {};
  }

  onBegin(config) {
    this.startedAt = new Date().toISOString();
    this.browser = config.projects.map((p) => p.name).join(', ');
  }

  onTestEnd(test, result) {
    const match = test.title.match(CASE_ID);
    if (!match) return;
    const note = test.annotations.find((a) => a.type === 'bug' || a.type === 'blocked');
    this.results[match[1]] = {
      status: toStatus(test, result),
      unexpected: result.status !== test.expectedStatus && result.status !== 'skipped',
      durationMs: result.duration,
      note: note ? note.description : '',
      error: result.error ? result.error.message.split('\n')[0].slice(0, 200) : '',
    };
  }

  onEnd() {
    const file = path.resolve(process.cwd(), this.outputFile);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const payload = { startedAt: this.startedAt, finishedAt: new Date().toISOString(), browser: this.browser, results: this.results };
    fs.writeFileSync(file, JSON.stringify(payload, null, 2) + '\n');
  }
}

module.exports = ResultsReporter;
