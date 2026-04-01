const fs = require('fs');
const path = require('path');

// Helpers
function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, '');
  } catch (err) {
    return '';
  }
}

function getCategory(title) {
  const t = title.toLowerCase();
  if (t.includes('python') || t.includes('machine learning') || t.includes('data')) return 'Data';
  if (t.includes('javascript') || t.includes('react') || t.includes('frontend') || t.includes('node')) return 'Web';
  if (t.includes('database') || t.includes('postgresql') || t.includes('mongodb') || t.includes('sql')) return 'Database';
  if (t.includes('security') || t.includes('auth')) return 'Security';
  if (t.includes('cloud') || t.includes('devops') || t.includes('docker')) return 'DevOps';
  return 'General';
}

function parseCSV(content) {
  const lines = content.split('\n').filter(line => line.trim());
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const record = {};
    headers.forEach((header, index) => {
      record[header.trim()] = values[index] ? values[index].trim() : '';
    });

    // Add metadata for advanced search
    record.date = formatDate(randomDate(new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), new Date()));
    record.category = getCategory(record.title);
    record.domain = domainFromUrl(record.url);
    record.content_length = record.content ? record.content.length : 0;

    return record;
  });
}

// Load CSV data into memory
const csvPath = path.join(__dirname, '../../demo_dataset.csv');
const fileContent = fs.readFileSync(csvPath, 'utf-8');
const records = parseCSV(fileContent);

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function matchFuzzy(recordValue, term) {
  if (!recordValue || !term) return false;
  const normalized = recordValue.toLowerCase();
  const q = term.toLowerCase();
  if (normalized.includes(q)) return true;

  const tokens = normalized.split(/\s+/);
  return tokens.some(token => levenshtein(token, q) <= 2 || levenshtein(q, token) <= 2);
}

const pool = {
  query: async (queryStr, params) => {
    // params object: {q,date_from,date_to,min_length,max_length,category,domain,sortBy,page,pageSize}
    const opts = params || {};
    const searchTerm = (opts.q || '').trim().toLowerCase();

    const filtered = records.filter((record) => {
      let keep = true;
      if (searchTerm) {
        keep =
          (record.title && record.title.toLowerCase().includes(searchTerm)) ||
          (record.content && record.content.toLowerCase().includes(searchTerm)) ||
          matchFuzzy(record.title, searchTerm) ||
          matchFuzzy(record.content, searchTerm);
      }

      if (!keep) return false;

      if (opts.date_from && record.date < opts.date_from) keep = false;
      if (opts.date_to && record.date > opts.date_to) keep = false;
      if (opts.category && opts.category !== 'All' && record.category !== opts.category) keep = false;
      if (opts.domain && opts.domain !== 'All' && record.domain !== opts.domain) keep = false;
      if (opts.min_length && record.content_length < Number(opts.min_length)) keep = false;
      if (opts.max_length && record.content_length > Number(opts.max_length)) keep = false;

      return keep;
    });

    // scoring and sorting
    const byRelevance = filtered
      .map(record => {
        let score = 0;
        if (searchTerm) {
          if (record.title.toLowerCase().includes(searchTerm)) score += 20;
          if (record.content.toLowerCase().includes(searchTerm)) score += 10;
          if (matchFuzzy(record.title, searchTerm)) score += 5;
          if (matchFuzzy(record.content, searchTerm)) score += 3;
        }
        return { record, score };
      })
      .sort((a, b) => b.score - a.score);

    let sorted = byRelevance.map(o => o.record);

    switch ((opts.sortBy || '').toLowerCase()) {
      case 'date':
        sorted = sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'title':
        sorted = sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'length':
        sorted = sorted.sort((a, b) => b.content_length - a.content_length);
        break;
      default:
        break;
    }

    // Pagination
    const page = Number(opts.page) || 1;
    const pageSize = Number(opts.pageSize) || 20;
    const offset = (page - 1) * pageSize;
    const paginated = sorted.slice(offset, offset + pageSize);

    return {
      rows: paginated,
      total: sorted.length,
      page,
      pageSize,
      allDomains: Array.from(new Set(records.map(r => r.domain))).sort(),
      allCategories: Array.from(new Set(records.map(r => r.category))).sort(),
    };
  },

  getAnalytics: async () => {
    return {
      recordsCount: records.length,
      categories: Array.from(new Set(records.map(r => r.category))).sort(),
      domains: Array.from(new Set(records.map(r => r.domain))).sort(),
    };
  },

  getSuggestions: async (prefix) => {
    if (!prefix) return [];
    const q = prefix.toLowerCase();
    const matches = records
      .map(r => r.title)
      .filter(t => t && t.toLowerCase().includes(q))
      .slice(0, 10);
    return matches;
  }
};

module.exports = pool;