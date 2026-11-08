// Saves a screenshot for every failed or known-defect case into bug-reports/evidence/<case-id>.jpg.
const path = require('path');

const EVIDENCE_DIR = path.resolve(__dirname, '../../bug-reports/evidence');
const CASE_ID = /^(TC-[A-Z]{2}-\d{3})/;

async function captureEvidence(page, testInfo) {
  const match = testInfo.title.match(CASE_ID);
  const isDefect = testInfo.expectedStatus === 'failed' || testInfo.status !== testInfo.expectedStatus;
  if (!match || !isDefect || testInfo.status === 'skipped') return;
  const file = path.join(EVIDENCE_DIR, `${match[1]}.jpg`);
  await page.screenshot({ path: file, fullPage: true, type: 'jpeg', quality: 60 }).catch(() => {});
}

function knownDefect(test, bugId, reason) {
  test.info().annotations.push({ type: 'bug', description: `${bugId}: ${reason}` });
  test.fail(true, `${bugId}: ${reason}`);
}

function blockedBy(test, bugId, reason) {
  test.info().annotations.push({ type: 'blocked', description: `Blocked by ${bugId}: ${reason}` });
  test.skip(true, `Blocked by ${bugId}`);
}

module.exports = { captureEvidence, knownDefect, blockedBy };
