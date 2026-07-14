const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Создаёт папку data и файл (с дефолтным значением), если их ещё нет
function ensureFile(fileName, defaultValue) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
  }
  return filePath;
}

// Очередь per-файл: не даёт двум параллельным запросам
// затереть данные друг друга при записи
const queues = {};

function withQueue(filePath, task) {
  const prev = queues[filePath] || Promise.resolve();
  const run = prev.then(task, task);
  queues[filePath] = run.catch(() => {});
  return run;
}

// Всегда читает файл заново с диска — никакого кэша в памяти
function readJSON(fileName, defaultValue) {
  const filePath = ensureFile(fileName, defaultValue);
  return withQueue(filePath, async () => {
    const raw = fs.readFileSync(filePath, 'utf-8');
    try {
      return raw.trim() ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.error(`[jsonStore] Ошибка чтения ${fileName}:`, e.message);
      return defaultValue;
    }
  });
}

// Полностью перезаписывает файл (атомарно, через временный файл)
function writeJSON(fileName, data) {
  const filePath = ensureFile(fileName, data);
  return withQueue(filePath, async () => {
    const tmpPath = `${filePath}.tmp`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, filePath);
    return data;
  });
}

module.exports = { readJSON, writeJSON, DATA_DIR };
