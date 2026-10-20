import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === "production";

app.use(express.json());

// Initialize GoogleGenAI SDK on server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API: Discovery with Google Maps Grounding using gemini-3.8-flash
app.post("/api/gemini/discover", async (req, res) => {
  try {
    const { query, userLocation, category } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Search query is required." });
    }

    const defaultLat = userLocation?.lat || 28.6139; // Default e.g. New Delhi or user's coords
    const defaultLng = userLocation?.lng || 77.2090;

    const systemPrompt = `You are CYGNUS, an elite geospatial discovery AI and booking concierge.
The user is searching for: "${query}" (category: ${category || "general"}).
1. Identify relevant real-world venues, products, restaurants, or local service providers matching their intent.
2. Provide a clear reasoning summary of why these choices match their needs, price points, and convenience.
3. For restaurants, mention seating vibe and reservation advice.
4. For local services (salons, clinics, repair), detail service scope, turnaround, and appointment requirements.
5. For tech/products, compare specs and physical store vs online pickup availability.
6. Clearly distinguish between verified information and options requiring direct provider confirmation. Never invent artificial booking confirmations.`;

    // Note: When using googleMaps, do NOT set responseMimeType or responseSchema
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `${systemPrompt}\n\nUser Search Request: ${query}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: defaultLat,
              longitude: defaultLng,
            },
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const webLinks = candidate?.groundingMetadata?.webSearchQueries || [];

    // Extract Google Maps place URLs and review snippets as mandatory requirement
    const places = groundingChunks
      .filter((chunk: any) => chunk.maps)
      .map((chunk: any) => ({
        title: chunk.maps?.title || "Local Business",
        uri: chunk.maps?.uri || "",
        address: chunk.maps?.address || "",
        rating: chunk.maps?.rating || null,
        userRatingsTotal: chunk.maps?.userRatingsTotal || null,
        placeAnswerSources: chunk.maps?.placeAnswerSources || null,
      }));

    return res.json({
      text: response.text || "No descriptive text returned.",
      groundingChunks,
      places,
      webLinks,
    });
  } catch (error: any) {
    console.error("Discovery error with Google Maps grounding:", error);
    return res.status(500).json({
      error: error.message || "Failed to execute Maps grounded discovery.",
      fallbackText: "CYGNUS AI encountered a network or quota restriction when accessing live Google Maps Grounding. Switching to simulated local registry.",
    });
  }
});

// API: Multi-turn Chat using gemini-3.8-flash
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, userLocation } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Conversation history array is required." });
    }

    const systemInstruction = `You are CYGNUS, an intelligent real-world discovery, comparison, and booking assistant.
Your core objectives:
1. Help users refine their search and compare shortlisted restaurants, products, and local service providers.
2. Provide transparent comparisons of prices, locations, verified reviews, and real-world availability.
3. Guide users through table reservations, service appointments, and product checkouts.
4. Always distinguish verified live data from options requiring provider confirmation.
5. Require explicit user confirmation before committing reservations or consequential actions.
6. Use natural, concise, human, and confident guidance.`;

    // Map conversation history
    const contents = messages.map((m: any) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content || m.text || "" }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({
      text: response.text || "I'm here to assist with your search, comparison, and bookings.",
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({
      error: error.message || "Chat service error.",
    });
  }
});

// Mount Vite or serve static files
async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, () => {
    console.log(`CYGNUS server running on http://localhost:${PORT}`);
  });
}

startServer();
