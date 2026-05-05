require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const pool = require("./database");

const app = express();

// 🔴 REQUIRED for Render (fixes cookies)
app.set("trust proxy", 1);

app.use(cors({
  origin: "https://studynet-brown.vercel.app", // 🔴 EXACT frontend URL
  credentials: true
}));

app.use(express.json());

app.use(session({
  name: "studynet.sid",
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    httpOnly: true,
    secure: true,       // 🔴 REQUIRED for HTTPS
    sameSite: "none",   // 🔴 REQUIRED for cross-origin
    maxAge: 1000 * 60 * 60 * 24
  }
}));

// ---------- AUTH ----------
const auth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// ---------- REGISTER ----------
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashed]
    );

    res.json({ message: "User created" });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- LOGIN ----------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  req.session.user = user.id;

  console.log("SESSION SET:", req.session); // 🔴 debug

  res.json({ message: "Logged in" });
});

// ---------- LOGOUT ----------
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// ---------- NOTES ----------
app.get("/notes", auth, async (req, res) => {
  console.log("SESSION /notes:", req.session); // 🔴 debug

  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC",
    [req.session.user]
  );

  res.json(result.rows);
});

app.post("/notes", auth, async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, req.session.user]
  );

  res.json(result.rows[0]);
});

app.delete("/notes/:id", auth, async (req, res) => {
  await pool.query(
    "DELETE FROM notes WHERE id = $1 AND user_id = $2",
    [req.params.id, req.session.user]
  );

  res.json({ message: "Deleted" });
});

app.listen(5001, () => {
  console.log("Server running");
});