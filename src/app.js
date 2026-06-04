const path = require("path");
const express = require("express");
const pinoHttp = require("pino-http");
const logger = require("./lib/logger");
const postsRouter = require("./routes/questions");
const authRouter  = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");
const { ZodError } = require("zod");
const { router: captchaRouter, } = require("./routes/captcha");
const app = express();
app.use(pinoHttp({logger, autoLogging:{ignore:(r)=>r.url.startsWith("/uploads")}}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/api/captcha", captchaRouter);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

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

module.exports = app; 