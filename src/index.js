/*const app = require("./app");
const logger = require("./lib/logger");
const prisma = require("./lib/prisma");

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, "0.0.0.0", () => {
  logger.info({ port: PORT }, "server listening");
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}
process.on("SIGINT",  shutdown);
process.on("SIGTERM", shutdown); */
console.log("1 starting");

const app = require("./app");
console.log("2 app loaded");

const logger = require("./lib/logger");
console.log("3 logger loaded");

const prisma = require("./lib/prisma");
console.log("4 prisma loaded");

const PORT = process.env.PORT || 3000;
console.log("5 starting server");

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log("6 server listening");
  logger.info({ port: PORT }, "server listening");
});

async function shutdown() {
  console.log("7 shutting down");
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);