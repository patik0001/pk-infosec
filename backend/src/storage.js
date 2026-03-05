const fs = require('fs');
const path = require('path');

const dataFile = process.env.DATA_FILE || './data/submissions.json';
const filePath = path.resolve(process.cwd(), dataFile);

function ensureStore() {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ entries: [] }, null, 2), { mode: 0o600 });
  }
}

function appendEntry(entry) {
  ensureStore();
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = JSON.parse(raw || '{"entries":[]}');
  parsed.entries.push({ ...entry, createdAt: new Date().toISOString() });
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2), { mode: 0o600 });
}

module.exports = {
  appendEntry,
  ensureStore,
  filePath,
};
