// Creates the labels and one GitHub Issue per bug report, then adds them to a "Bug Life Cycle" project board.
// Needs the GitHub CLI logged in with repo and project scopes:  gh auth login -s project
// Usage: node scripts/publish-issues.js            (dry run, prints what would be created)
//        node scripts/publish-issues.js --apply
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const bugs = require('../bug-reports/source/bugs');
const { fileName } = require('./bug-report-files');

const OWNER = 'the-sudipta';
const REPO = `${OWNER}/manual-testing-case-study`;
const RAW = `https://raw.githubusercontent.com/${REPO}/main/bug-reports/`;
const APPLY = process.argv.includes('--apply');

const gh = (args) => (APPLY ? execFileSync('gh', args, { encoding: 'utf8' }).trim() : console.log('gh', args.join(' ')));

function createLabels() {
  const lines = fs.readFileSync(path.resolve(__dirname, '../.github/labels.yml'), 'utf8').split('\n');
  for (const line of lines.filter((l) => l.startsWith('- {'))) {
    const [, name, color, description] = line.match(/name: "?([^",]+)"?, color: (\w+), description: ([^}]+) }/);
    gh(['label', 'create', name, '--color', color, '--description', description.trim(), '--repo', REPO, '--force']);
  }
}

function issueBody(bug) {
  const markdown = fs.readFileSync(path.resolve(__dirname, '../bug-reports', fileName(bug)), 'utf8');
  return markdown.replace(/^# .*\n\n/, '').replace(/\]\(evidence\//g, `](${RAW}evidence/`);
}

function labelsFor(bug) {
  const app = bug.app === 'Sauce Demo' ? 'app:sauce-demo' : 'app:booking-platform';
  return ['bug', 'status:new', app, `severity:${bug.severity.toLowerCase()}`, `priority:${bug.priority}`].join(',');
}

function main() {
  createLabels();
  const board = APPLY ? gh(['project', 'create', '--owner', OWNER, '--title', 'Bug Life Cycle', '--format', 'json', '--jq', '.number']) : 'N';
  for (const bug of bugs) {
    const url = gh(['issue', 'create', '--repo', REPO, '--title', `${bug.id}: ${bug.title}`, '--label', labelsFor(bug), '--body', issueBody(bug)]);
    gh(['project', 'item-add', String(board), '--owner', OWNER, '--url', String(url)]);
  }
}

main();
