const express = require("express");
const app = express();
const questionsRouter = require("./routes/questions");
const prisma = require("./lib/prisma");

const PORT = process.env.PORT || 3000;
const authRouter = require("./routes/auth");
const postsRouter = require("./routes/questions");
const path = require('path');

console.log("__dirname =", __dirname);
console.log("static path =", require("path").resolve(__dirname, "../public"));

app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware to parse JSON bodies (will be useful in later steps)
app.use(express.json());

// everything under /api/questions
app.use("/api/questions", postsRouter);

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.json({msg: "Not found"});
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

