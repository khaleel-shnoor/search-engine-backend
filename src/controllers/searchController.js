const pool = require("../config/db");

exports.searchDocuments = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    const result = await pool.query(
      `SELECT title, url
   FROM documents
   WHERE 
     to_tsvector('english', title || ' ' || content) @@ plainto_tsquery('english', $1)
     OR title ILIKE '%' || $1 || '%'
     OR content ILIKE '%' || $1 || '%'
   ORDER BY ts_rank(
     to_tsvector('english', title || ' ' || content),
     plainto_tsquery('english', $1)
   ) DESC`,
      [q]   // ✅ correctly binds here
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};