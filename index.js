const express = require("express");
const { checkMongoDB, insertItem, disconnectFromMongoDB } = require("./db");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.post("/items", async (req, res) => {
  if (!req.body || Array.isArray(req.body) || typeof req.body !== "object") {
    return res.status(400).json({ error: "Request body must be a JSON object" });
  }

  try {
    const result = await insertItem(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (error) {
    console.error("Insert failed:", error.message);
    res.status(503).json({ error: "Could not save item" });
  }
});

app.get("/health", async (req, res) => {
  try {
    await checkMongoDB();
    res.status(200).send("hello");
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(503).send("database unavailable");
  }
});

const server = app.listen(port, () => {
  console.log(`Health check listening on port ${port}`);
});

async function shutdown() {
  server.close(async () => {
    await disconnectFromMongoDB();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
