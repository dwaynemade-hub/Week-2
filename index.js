import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Custom request logger middleware
app.use((req, res, next) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// JSON parsing
app.use(express.json());

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));

// GET / serves the static HTML page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST /user accepts { name, email } and responds "Hello, [name]!"
app.post("/user", (req, res, next) => {
  const { name, email } = req.body || {};
  if (!name || !email) {
    const err = new Error("Missing required fields: name and email");
    err.status = 400;
    return next(err);
  }
  res.json({ message: `Hello, ${name}!` });
});

// GET /user/:id returns "User [id] profile"
app.get("/user/:id", (req, res) => {
  const { id } = req.params;
  res.send(`User ${id} profile`);
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
