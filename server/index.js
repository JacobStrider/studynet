require("dotenv").config();
const pool = require("./database");


const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

// Test
app.get("/", (req, res) => {
    res.send("Hello World!");
});

// GET notes (from database)
app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST note (to database)
app.post("/notes", async (req, res) => {
  try {
    const { title, content } = req.body;
    const result = await pool.query(
      "INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});