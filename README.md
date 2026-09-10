# 🌤️ WeatherGPT India Hub

> **Tri-Model Meteorological & Disaster Risk AI Intelligence Platform for 130 Indian Cities**

An interactive AI/ML intelligence platform providing real-time 1-Hour Nowcasting, 3-Hour Disaster Risk Early Warning, Agro-Meteorological Crop Advisory, and Multilingual Voice AI Assistant across 130 monitored meteorological stations across India.

---

## 🚀 Architectural Overview & Tri-Model Engine

WeatherGPT India integrates three core predictive machine learning pipelines:

1. **1-Hour Weather Forecast Model (`Nowcast-XGBoost-ConvLSTM-v4.2`)**
   - High-frequency telemetry tracking real-time temperature, wind vectors, precipitation probability, AQI status, and hourly trends.
2. **3-Hour Disaster Risk Early Warning Model (`EarlyWarning-RandomForest-Ensemble-v3.8`)**
   - Hazard assessment monitoring urban flash floods, tropical cyclones, slope landslides, heatwaves, and severe smog with active NDMA protocols.
3. **Agro-Meteorological Crop Intelligence Model (`CropIntel-BioMet-v2.5`)**
   - Comprehensive crop suitability scoring, soil moisture status, pest risk detection, GDD accumulation, and localized irrigation/fertilizer advisories across 10 supported crops.

---

## 🌟 Key Features

- **130 Monitored Stations Master Matrix**: Full geographical coverage across Northern, Western, Southern, Central & Eastern, and North-Eastern regions.
- **Multilingual AI Voice Assistant (`AgentChatbox`)**: Interactive AI meteorologist with voice input/output supporting 12+ Indian languages (Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Odia, etc.).
- **PostGIS Spatial Snapping Engine**: Automatically snaps any custom GPS coordinate within India to the nearest monitored meteorological station with precise distance and bearing calculations (`/api/nearest`).
- **Gemini AI Intelligence Analyst**: Custom AI synthesis powered by Google GenAI (`@google/genai`, `gemini-3.8-flash`) providing deep tactical briefings and regional risk analyses.
- **Multi-View Interface**: Seamlessly toggle between:
  - 🗺️ **Interactive Leaflet Map**: Hazard Radar overlays, Doppler radar layers
  - 🌐 **3D Globe Simulator**: Real-time wind vectors, atmospheric flow
  - 📱 **Mobile App Simulator**: Responsive field unit view
  - 📊 **130 Cities Master Matrix**: Live sorting, filtering, telemetry
- **Hazard Radar Geofence Alert System**: Real-time alert tracking for severe meteorological and disaster events with spatial buffer zones.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Leaflet, Lucide React, Motion
- **Backend**: Node.js, Express, TypeScript (`tsx`)
- **AI Integration**: Google GenAI SDK (`@google/genai`) with Gemini models
- **Voice & Audio**: Web Speech API with multilingual Indian language synthesis

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- Google Gemini API Key (`GEMINI_API_KEY`)

### Installation & Environment Setup

1. **Clone the repository and install dependencies:**
   ```bash
   git clone https://github.com/vu241fa04f56/GPT-SIH.git
   cd GPT-SIH
   npm install
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```

3. **Running the Application:**
   - **Development Mode:**
     ```bash
     npm run dev
     ```
     Starts the Express server with Vite middleware on `http://localhost:3000`.
   - **Production Build:**
     ```bash
     npm run build
     npm start
     ```

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Returns platform status, active model versions, and system telemetry |
| `/api/cities` | `GET` | Fetches model outputs for all 130 monitored cities |
| `/api/predict/weather/:city_id` | `GET` | 1-Hour Weather Predict telemetry & forecast |
| `/api/predict/disaster/:city_id` | `GET` | 3-Hour Disaster Early Warning hazard telemetry |
| `/api/advisory/:city_id?crop=...` | `GET` | Agro Crop Advisory & bio-meteorological score |
| `/api/nearest?lat=...&lng=...` | `GET` | Snaps arbitrary GPS coordinates to nearest station |
| `/api/ai/deep-analysis` | `POST` | Generates custom Gemini tactical briefing reports |
| `/api/ai/chat` | `POST` | WeatherGPT Multilingual Agent conversation endpoint |

---

## 📄 License

Built for Smart India Hackathon (SIH) & Meteorological Disaster Resilience.
