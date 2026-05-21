/*const app = require("./app");
const logger = require("./lib/logger");
const prisma = require("./lib/prisma");

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info({ port: PORT }, "server listening");
  console.log(`Server running on port ${PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown); */
const app = require("./app");
const logger = require("./lib/logger");
const prisma = require("./lib/prisma");

const PORT = process.env.PORT || 3000;

console.log("PORT =", PORT);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  logger.info({ port: PORT }, "server listening");
});

server.on("error", (err) => {
  console.error("SERVER ERROR:", err);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
