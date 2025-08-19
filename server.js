// server.js
import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import Tesseract from "tesseract.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- Multer (10 MB limit + memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ---- DeepSeek client (OpenAI-compatible)
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

// ---- Simple request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ---- Health/debug routes
app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.DEEPSEEK_API_KEY),
    node: process.version
  });
});

// Try OCR only (no DeepSeek) to isolate OCR issues
app.post("/debug-ocr", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "no_file" });
    const { data } = await Tesseract.recognize(req.file.buffer, "eng");
    res.json({ ocrText: (data.text || "").trim() });
  } catch (err) {
    console.error("OCR ERROR:", err);
    res.status(500).json({ step: "ocr", message: String(err) });
  }
});

// ---- Main solve route
app.post("/solve", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "no_file" });

    // 1) OCR
    let ocrText;
    try {
      const { data } = await Tesseract.recognize(req.file.buffer, "eng");
      ocrText = (data.text || "").trim();
      console.log("OCR TEXT:", ocrText.slice(0, 200));
    } catch (err) {
      console.error("OCR ERROR:", err);
      return res.status(500).json({
        error: { step: "ocr", message: "Tesseract failed", detail: String(err) }
      });
    }

    if (!ocrText) {
      return res.json({ answer: "cannot solve", note: "empty_ocr" });
    }

    // 2) DeepSeek reasoning
    let answer = "cannot solve";
    try {
      const prompt = `
Solve the following math problem extracted by OCR:

${ocrText}

Return ONLY the final numeric/algebraic answer (no words, no steps).
If the problem is ambiguous/incomplete, return exactly: cannot solve
      `.trim();

      const completion = await deepseek.chat.completions.create({
        model: "deepseek-reasoner",
        temperature: 0,
        messages: [{ role: "user", content: prompt }]
      });

      answer =
        completion.choices?.[0]?.message?.content?.trim() || "cannot solve";
    } catch (err) {
      console.error("DEEPSEEK ERROR:", err);
      return res.status(500).json({
        error: {
          step: "deepseek",
          message: "DeepSeek API failed",
          detail: String(err)
        }
      });
    }

    return res.json({ answer });
  } catch (err) {
    console.error("UNCAUGHT ERROR:", err);
    return res.status(500).json({
      error: { step: "unknown", message: "Unexpected error", detail: String(err) }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
