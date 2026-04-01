const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Insert post
router.post("/", async (req, res) => {
  const { title, content, url } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO posts (title, content, url, document)
       VALUES ($1, $2, $3, to_tsvector('english', $1 || ' ' || $2))
       RETURNING *`,
      [title, content, url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all
router.get("/", async (req, res) => {
  const result = await pool.query("SELECT * FROM posts");
  res.json(result.rows);
});

module.exports = router;