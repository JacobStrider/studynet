require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcrypt");
const pool = require("./database");

const app = express();

app.set("trust proxy", 1); 

app.use(cors({
  origin: "https://studynet-brown.vercel.app", 
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "none"
  }
}));

// ---------- AUTH MIDDLEWARE ----------
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

    if (!username || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashed]
    );

    res.json({ message: "User created" });

  } catch (err) {
    if (err.code === "23505") {
      return res.status(400).json({ error: "Username already exists" });
    }

    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- LOGIN ----------
app.post("/login", async (req, res) => {
  try {
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

    res.json({ message: "Logged in" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------- LOGOUT ----------
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
});

// ---------- NOTES ----------

// GET
app.get("/notes", auth, async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM notes WHERE user_id = $1 ORDER BY id DESC",
    [req.session.user]
  );
  res.json(result.rows);
});

// POST
app.post("/notes", auth, async (req, res) => {
  const { title, content } = req.body;

  const result = await pool.query(
    "INSERT INTO notes (title, content, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, content, req.session.user]
  );

  res.json(result.rows[0]);
});

// DELETE
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