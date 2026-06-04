const express = require("express");
const svgCaptcha = require("svg-captcha");
const crypto = require("crypto");

const router = express.Router();

const captchas = new Map();

router.get("/", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
  });

  const captchaId = crypto.randomUUID();

  captchas.set(captchaId, captcha.text);

  setTimeout(() => {
    captchas.delete(captchaId);
  }, 5 * 60 * 1000);

  res.json({
    captchaId,
    svg: captcha.data,
  });
});

module.exports = {
  router,
  captchas,
};