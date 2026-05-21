/*const path = require("path");
const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./lib/logger");
const postsRouter = require("./routes/questions");
const authRouter  = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const { ZodError } = require("zod");

const app = express();
app.use(pinoHttp({logger, autoLogging:{ignore:(r)=>r.url.startsWith("/uploads")}}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api/auth", authRouter);
app.use("/api/questions", postsRouter);
app.use((req, res) => res.status(404).json({ message: "Not found" }));
//app.use(errorHandler);

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      errors: err.errors,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app; */
const logger = require("./lib/logger");
console.log("1 logger loaded");

const prisma = require("./lib/prisma");
console.log("2 prisma loaded");

console.log("3 loading app...");
const app = require("./app");
console.log("4 app loaded");

const PORT = process.env.PORT || 3000;

console.log("5 starting server");

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("6 SERVER LISTENING");
  logger.info({ port: PORT }, "server listening");
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);