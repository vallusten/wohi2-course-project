const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const svgCaptcha = require("svg-captcha");
const prisma = require("../lib/prisma");

// FIX 1: Add a fallback secret just in case your .env is missing JWT_SECRET
const SECRET = process.env.JWT_SECRET || "super_secret_development_key";

// --- Captcha Memory Store & Cleanup ---
const captchas = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [id, data] of captchas.entries()) {
    if (now > data.expiresAt) captchas.delete(id);
  }
}, 60000); 

// GET /api/auth/captcha
router.get("/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
    background: '#f4f4f4',
    ignoreChars: '0o1il' 
  });
  
  const id = crypto.randomUUID();
  captchas.set(id, { 
    text: captcha.text.toLowerCase(), 
    expiresAt: Date.now() + 5 * 60 * 1000 
  });
  
  res.json({ id, svg: captcha.data });
});

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name, captchaId, captchaAnswer } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }
    
    // --- Validate Captcha ---
    if (process.env.NODE_ENV !== "test") {
      if (!captchaId || !captchaAnswer) {
        return res.status(400).json({ message: "Captcha is required" });
      }
      const storedCaptcha = captchas.get(captchaId);
      if (!storedCaptcha) {
        return res.status(400).json({ message: "Captcha expired or invalid. Please refresh." });
      }
      if (storedCaptcha.text !== captchaAnswer.trim().toLowerCase()) {
        captchas.delete(captchaId); 
        return res.status(400).json({ message: "Incorrect Captcha. Please try again." });
      }
      captchas.delete(captchaId); 
    }
    // ------------------------

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed, name }});
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    // FIX 2: Print the exact error to your terminal so we aren't guessing!
    console.error("REGISTRATION ERROR:", err);
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password, captchaId, captchaAnswer } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // --- Validate Captcha ---
    if (process.env.NODE_ENV !== "test") {
      if (!captchaId || !captchaAnswer) {
        return res.status(400).json({ message: "Captcha is required" });
      }
      const storedCaptcha = captchas.get(captchaId);
      if (!storedCaptcha) {
        return res.status(400).json({ message: "Captcha expired or invalid. Please refresh." });
      }
      if (storedCaptcha.text !== captchaAnswer.trim().toLowerCase()) {
        captchas.delete(captchaId); 
        return res.status(400).json({ message: "Incorrect Captcha. Please try again." });
      }
      captchas.delete(captchaId); 
    }
    // ------------------------

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    // FIX 2: Print the exact error to your terminal so we aren't guessing!
    console.error("LOGIN ERROR:", err);
    next(err); 
  }
});

module.exports = router;