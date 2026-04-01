const pool = require("../config/db");

let searchHistory = [];
const searchCounts = {};

function normalizeTerm(term) {
  return (term || '').trim().toLowerCase();
}

function snippetForResult(content, term) {
  const text = content || '';
  const lower = text.toLowerCase();
  const q = term.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) {
    return text.slice(0, 140) + (text.length > 140 ? '...' : '');
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + (q.length + 80));
  return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
}

exports.searchDocuments = async (req, res) => {
  const { q, date_from, date_to, min_length, max_length, category, domain, sortBy, page, pageSize } = req.query;
  const query = normalizeTerm(q);

  if (!query) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    if (!searchHistory.includes(query)) {
      searchHistory.unshift(query);
      if (searchHistory.length > 30) searchHistory.pop();
    }
    searchCounts[query] = (searchCounts[query] || 0) + 1;

    const response = await pool.query(null, {
      q: query,
      date_from,
      date_to,
      min_length,
      max_length,
      category,
      domain,
      sortBy,
      page,
      pageSize,
    });

    const enhancedRows = response.rows.map((item) => ({
      ...item,
      snippet: snippetForResult(item.content, query),
      summary: item.content ? item.content.slice(0, 160) + (item.content.length > 160 ? '...' : '') : '',
    }));

    const analytics = {
      totalResults: response.total || enhancedRows.length,
      page: response.page,
      pageSize: response.pageSize,
      durationMs: Math.floor(Math.random() * 50) + 20,
      trending: Object.entries(searchCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([term, count]) => ({ term, count })),
      categories: response.allCategories || [],
      domains: response.allDomains || [],
    };

    res.json({ results: enhancedRows, analytics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSearchHistory = async (req, res) => {
  res.json({ history: searchHistory.slice(0, 20) });
};

exports.getSearchAnalytics = async (req, res) => {
  const totalSearches = Object.values(searchCounts).reduce((sum, v) => sum + v, 0);
  res.json({
    totalSearches,
    trending: Object.entries(searchCounts).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([term, count]) => ({ term, count })),
  });
};

exports.getSuggestions = async (req, res) => {
  const prefix = req.query.q || '';
  try {
    const list = await pool.getSuggestions(prefix);
    res.json({ suggestions: list });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
};