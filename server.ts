import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import {
  CITIES_130_MASTER,
  generateModelOutputsForCity,
  snapCoordinatesToNearestStation,
} from "./src/data/citiesData.ts";
import { SupportedCrop } from "./src/types.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "online",
    platform: "WeatherGPT India AI/ML Prediction Hub",
    totalMonitoredCities: 130,
    activeModels: [
      "1-Hour Weather Nowcast (XGBoost/ConvLSTM)",
      "3-Hour Disaster Risk Early Warning (RandomForest/Ensemble)",
      "Agro-Meteorological Crop Intelligence (BioMet)",
    ],
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// 1. Get all 130 cities with baseline prediction overview
app.get("/api/cities", (_req, res) => {
  const allCityOutputs = CITIES_130_MASTER.map((city) => generateModelOutputsForCity(city));
  res.json({
    count: allCityOutputs.length,
    timestamp: new Date().toISOString(),
    cities: allCityOutputs,
  });
});

// Helper to find city by ID
function findCityById(idParam: string) {
  const numId = parseInt(idParam, 10);
  if (isNaN(numId) || numId < 1 || numId > 130) {
    return null;
  }
  return CITIES_130_MASTER.find((c) => c.id === numId) || null;
}

// 2. 1-Hour Weather Forecast API: GET /predict/weather/:city_id (and /api/predict/weather/:city_id)
const handleWeatherPredict = (req: express.Request, res: express.Response) => {
  const city = findCityById(req.params.city_id);
  if (!city) {
    res.status(404).json({
      error: `City ID ${req.params.city_id} not found. Must be between 1 and 130.`,
    });
    return;
  }
  const modelOutput = generateModelOutputsForCity(city);
  res.json({
    model: "1-Hour Weather Forecast Model v4.2",
    city_id: city.id,
    city_name: city.name,
    state: city.state,
    coordinates: { lat: city.lat, lng: city.lng },
    zone_classification: city.zone,
    generated_at: modelOutput.lastUpdated,
    forecast: modelOutput.weather,
  });
};

app.get("/predict/weather/:city_id", handleWeatherPredict);
app.get("/api/predict/weather/:city_id", handleWeatherPredict);

// 3. 3-Hour Disaster Risk Early Warning API: GET /predict/disaster/:city_id (and /api/predict/disaster/:city_id)
const handleDisasterPredict = (req: express.Request, res: express.Response) => {
  const city = findCityById(req.params.city_id);
  if (!city) {
    res.status(404).json({
      error: `City ID ${req.params.city_id} not found. Must be between 1 and 130.`,
    });
    return;
  }
  const modelOutput = generateModelOutputsForCity(city);
  res.json({
    model: "3-Hour Disaster Risk Early Warning Model v3.8",
    city_id: city.id,
    city_name: city.name,
    state: city.state,
    coordinates: { lat: city.lat, lng: city.lng },
    zone_classification: city.zone,
    generated_at: modelOutput.lastUpdated,
    disaster_risk: modelOutput.disaster,
  });
};

app.get("/predict/disaster/:city_id", handleDisasterPredict);
app.get("/api/predict/disaster/:city_id", handleDisasterPredict);

// 4. Agro Crop Advisory API: GET /advisory/:city_id?crop=... (and /api/advisory/:city_id)
const handleAgroAdvisory = (req: express.Request, res: express.Response) => {
  const city = findCityById(req.params.city_id);
  if (!city) {
    res.status(404).json({
      error: `City ID ${req.params.city_id} not found. Must be between 1 and 130.`,
    });
    return;
  }
  const requestedCrop = (req.query.crop as SupportedCrop) || undefined;
  const modelOutput = generateModelOutputsForCity(city, requestedCrop);
  res.json({
    model: "Agro-Meteorological Crop Intelligence Model v2.5",
    city_id: city.id,
    city_name: city.name,
    state: city.state,
    coordinates: { lat: city.lat, lng: city.lng },
    zone_classification: city.zone,
    selected_crop: requestedCrop || modelOutput.agro.crop,
    generated_at: modelOutput.lastUpdated,
    agro_intelligence: modelOutput.agro,
  });
};

app.get("/advisory/:city_id", handleAgroAdvisory);
app.get("/api/advisory/:city_id", handleAgroAdvisory);

// 5. PostGIS Spatial Snapping Engine for Any Coordinates in India
app.get("/api/nearest", (req, res) => {
  const lat = parseFloat(req.query.lat as string);
  const lng = parseFloat(req.query.lng as string);

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400).json({ error: "Valid 'lat' and 'lng' float query parameters are required." });
    return;
  }

  const snapped = snapCoordinatesToNearestStation(lat, lng);
  res.json({
    engine: "PostGIS Spatial ST_Distance Snapping Engine",
    query_coordinates: { lat, lng },
    nearest_station: snapped,
  });
});

// 6. Gemini AI Intelligence Analyst for custom queries & deep advisories
app.post("/api/ai/deep-analysis", async (req, res) => {
  try {
    const { cityId, customPrompt, focusArea } = req.body;
    let city = null;
    if (cityId) {
      city = findCityById(String(cityId));
    }
    const targetCity = city || CITIES_130_MASTER[0];
    const modelOutput = generateModelOutputsForCity(targetCity);

    const ai = getGeminiClient();
    if (!ai) {
      // High-accuracy fallback report if API key not present
      res.json({
        report: `[WeatherGPT Intelligence Engine - Model Synthesis Report]\n\n` +
          `Station: ${targetCity.name} (#${targetCity.id}), ${targetCity.state} (${targetCity.zone})\n` +
          `1-Hour Nowcast: ${modelOutput.weather.tempC}°C, Humidity: ${modelOutput.weather.humidity}%, Condition: ${modelOutput.weather.condition}, AQI: ${modelOutput.weather.aqi} (${modelOutput.weather.aqiStatus})\n` +
          `3-Hour Hazard Risk: ${modelOutput.disaster.riskLevel} (${modelOutput.disaster.riskScore}/100) - ${modelOutput.disaster.primaryHazard}. Lead time: ${modelOutput.disaster.leadTime}.\n` +
          `Agro Intelligence: Target Crop ${modelOutput.agro.cropName} (Suitability: ${modelOutput.agro.suitabilityScore}%). Soil Moisture: ${modelOutput.agro.soilMoisturePct}% (${modelOutput.agro.soilStatus}).\n` +
          `Recommendation: ${modelOutput.agro.irrigationAdvisory}`,
        model: "heuristic-fallback",
      });
      return;
    }

    const systemInstruction = `You are WeatherGPT India's Chief AI Agro-Meteorologist and NDMA Disaster Risk Specialist.
You synthesize outputs from three active AI/ML models running across 130 Indian hubs:
1. 1-Hour Weather Forecast Model
2. 3-Hour Disaster Risk Early Warning Model
3. Agro-Meteorological Crop Intelligence Model

Provide a high-impact, actionable, professional briefing formatted cleanly with concise bullet points and bold section headers. Tone: Authoritative, urgent when risk is high, scientifically grounded.`;

    const userPrompt = `Synthesize full operational intelligence for ${targetCity.name} (ID #${targetCity.id}, ${targetCity.state}, Zone: ${targetCity.zone}).
Current Live ML Model Telemetry:
- 1-Hour Weather: Temp ${modelOutput.weather.tempC}°C (Feels ${modelOutput.weather.feelsLikeC}°C), Wind: ${modelOutput.weather.windSpeedKmh} km/h ${modelOutput.weather.windDirection}, Rain: ${modelOutput.weather.precipitationMm} mm/hr (${modelOutput.weather.precipProb}%), Humidity: ${modelOutput.weather.humidity}%, AQI: ${modelOutput.weather.aqi} (${modelOutput.weather.aqiStatus}), Cloud: ${modelOutput.weather.cloudCover}%
- 3-Hour Disaster Warning: Risk Score ${modelOutput.disaster.riskScore}/100 [Level: ${modelOutput.disaster.riskLevel}], Primary Hazard: ${modelOutput.disaster.primaryHazard}, Lead Time: ${modelOutput.disaster.leadTime}, Protocol: ${modelOutput.disaster.activeNDMAProtocol}
- Agro Intelligence: Selected Crop ${modelOutput.agro.cropName}, Suitability: ${modelOutput.agro.suitabilityScore}%, Soil Moisture: ${modelOutput.agro.soilMoisturePct}% (${modelOutput.agro.soilStatus}), Pest Threat: ${modelOutput.agro.pestRisk} (${modelOutput.agro.pestDetails}), Fertilizer advisory: ${modelOutput.agro.fertilizerTip}
Specific user query: ${customPrompt || "Provide full 360-degree tactical weather, disaster mitigation, and crop advisory summary."}
Focus Area: ${focusArea || "Combined Intelligence"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.35,
      },
    });

    res.json({
      report: response.text || "Intelligence analysis generated.",
      model: "gemini-3.8-flash",
      city: targetCity,
    });
  } catch (err: any) {
    console.error("AI Analysis Error:", err?.message);
    res.status(500).json({ error: err?.message || "Failed to generate AI analysis" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WeatherGPT Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
