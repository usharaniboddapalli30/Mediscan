import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "MediScan Healthcare API" });
  });

  // AI Assistant endpoint
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        return res.json({
          reply: `I am MediScan AI Assistant (Educational Mode). Regarding your query on "${message}":\n\n` +
            `• **General Guidance**: Always follow the dosage instructions written on the prescription label or provided by your physician or pharmacist.\n` +
            `• **Storage**: Store medicines in a cool, dry place away from heat, moisture, and direct light unless cold-chain storage (2°C–8°C) is specified (e.g., Insulin or certain vaccines).\n` +
            `• **Safety Check**: Check the batch number, manufacturer seal, and expiry date before taking any medication. Discard expired or discolored pills safely.\n\n` +
            `*Disclaimer: MediScan AI Assistant provides educational information only and does not replace professional medical advice, diagnosis, or treatment.*`,
          offlineFallback: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      const systemInstruction = `You are MediScan AI Assistant, a professional, reassuring, and highly accurate medical information assistant.
You help users understand medication usages, generic equivalents, common precautions, storage conditions, potential drug interactions, and family health tips.
Keep your answers structured with clear bold headings, bullet points, and concise text.
CRITICAL MANDATE: You MUST include the following disclaimer at the end of every response:
"\n\n*⚠️ Disclaimer: MediScan AI Assistant provides general educational information only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional or physician for personal medical decisions.*"`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: message,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      return res.json({
        reply: response.text || "I was unable to generate a detailed response. Please consult your physician for medical guidance.",
      });
    } catch (error: any) {
      console.error("AI Assistant Endpoint Error:", error);
      return res.status(500).json({
        error: "Failed to query AI Assistant",
        details: error?.message || "Internal server error",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediScan server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
