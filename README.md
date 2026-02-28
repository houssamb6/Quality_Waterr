# 💧 AquaGuard AI

> **AI-powered Drinking Water Quality Risk Monitoring Dashboard**
> Real-time multi-sensor monitoring, contamination simulation, and intelligent risk prediction — all in a futuristic water-themed interface.

---

## 📸 Overview

AquaGuard AI is a fully interactive, frontend-only React dashboard designed to simulate an AI system that monitors drinking water quality in real time. It visualizes sensor data across 9 key physicochemical parameters, predicts a live risk index, and provides AI-generated insights about the most probable causes of water quality degradation.

This project serves as the **frontend prototype** for an AI-based water quality monitoring challenge, with the architecture designed to connect to a real ML backend (or trained model API) in future iterations.

---

## ✨ Features

### 🌊 Animated Water Risk Gauge
- Circular gauge (0–100) with a live water-fill animation
- Color transitions based on risk level: **Blue → Yellow → Orange → Red**
- Animated wave inside the tank
- Glowing ring with real-time value counting

### 📈 Risk Trend Wave Chart
- Area chart showing historical risk index over time
- Dashed predicted future risk line (AI forecast simulation)
- Gradient fill, reference threshold lines, and custom floating tooltip

### 🔬 Interactive Sensor Lagoon
- Grid of 9 glassmorphism sensor cards, one per water parameter
- Each card shows:
  - Live animated value (with JetBrains Mono font)
  - Per-sensor accent color
  - Mini sparkline area chart
  - Safe range bar indicator
  - Ripple effect on click
  - Pulsing status dot

### ⚗️ Contamination Simulation Panel
- Sliders for all 9 sensor parameters with color-coded fill tracks
- **"Inject Contamination"** button — gradually spreads contamination across all sensors with animated progress bar
- **"Restore Clean Water"** button — resets all values to safe nominals
- Background subtly darkens and glows red during contamination

### 🧠 AI Insight Panel
- Dynamic text explanation updates based on current risk level
- SHAP-style animated horizontal bars showing contributing factors
- Bars fill smoothly with color-coded importance scores

### 🔔 Alert Feed
- Slide-in dismissable alerts with color coding (info / warning / danger)
- Auto-triggered alerts on contamination injection
- Timestamps and scrollable feed

### 🎨 Design
- Deep dark water theme with animated floating bubble background
- Pulsing radial mesh gradient orbs (color-reactive to risk)
- Full glassmorphism card system with backdrop blur
- **Outfit** display font + **JetBrains Mono** for data values
- Smooth Framer Motion transitions throughout

---

## 📊 Monitored Parameters

| Parameter | Unit | Safe Range | Description |
|---|---|---|---|
| pH | pH | 6.5 – 8.5 | Acidity / Alkalinity |
| Hardness | mg/L | 60 – 300 | Mineral content |
| Solids (TDS) | ppm | 0 – 40,000 | Total dissolved solids |
| Chloramines | mg/L | 1 – 10 | Disinfectant residual |
| Sulfate | mg/L | 0 – 400 | Sulfate concentration |
| Conductivity | μS/cm | 200 – 600 | Electrical conductivity |
| Organic Carbon | mg/L | 0 – 20 | Total organic carbon |
| Trihalomethanes | μg/L | 0 – 80 | Disinfection byproducts |
| Turbidity | NTU | 0 – 5 | Water clarity |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- npm or yarn

### Installation

```bash
# 1. Create a new Vite + React project
npm create vite@latest aquaguard-ai -- --template react
cd aquaguard-ai

# 2. Install dependencies
npm install framer-motion recharts lucide-react

# 3. Replace src/App.jsx with the AquaGuardAI.jsx component
cp AquaGuardAI.jsx src/App.jsx

# 4. Start the dev server
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🗂️ Project Structure

```
aquaguard-ai/
├── src/
│   ├── App.jsx                  # Main AquaGuardAI component (single file)
│   ├── main.jsx                 # React entry point
│   └── index.css                # Optional global resets
├── public/
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

> The entire dashboard lives in a **single component file** (`App.jsx`) with all mock data, sub-components, animations, and logic self-contained. No external API or backend required.

---

## 🔧 Tech Stack

| Library | Version | Purpose |
|---|---|---|
| React | 18+ | UI framework |
| Vite | 5+ | Build tool & dev server |
| Framer Motion | 11+ | Animations & transitions |
| Recharts | 2+ | Area charts & sparklines |
| Lucide React | 0.4+ | Icons |
| Google Fonts | — | Outfit + JetBrains Mono |

> **No Tailwind CSS required.** All styling uses inline styles for maximum portability.

---

## 🧪 Mock Data & Simulation

All data is simulated in-state — no backend required.

- **Sensor drift** — values auto-fluctuate ±0.4% every 3.2 seconds to simulate live readings
- **Trend history** — 24 data points generated on load, updated in real time
- **AI forecast** — last 6 points on the trend chart are simulated predictions
- **Contamination injection** — 40-step animation spreading values toward danger thresholds over ~7 seconds
- **Risk score** — computed from a weighted deviation formula across all 9 parameters

### Risk Score Formula

```
Risk = Σ weighted_deviation(sensor, safe_min, safe_max)

Weights:
  pH            → 25%
  Turbidity     → 20%
  Chloramines   → 15%
  Organic Carbon→ 12%
  THMs          → 12%
  Sulfate       →  8%
  Conductivity  →  5%
  Hardness      →  3%
```

---

## 🔌 Connecting to a Real ML Model (Future)

To connect to a trained water quality prediction model, replace the `computeRisk()` function with an API call:

```javascript
// Replace this:
const risk = computeRisk(values);

// With this:
const [risk, setRisk] = useState(0);

useEffect(() => {
  fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })
    .then(r => r.json())
    .then(data => setRisk(data.risk_score));
}, [values]);
```

### Expected API Contract

**POST** `/api/predict`

```json
// Request body
{
  "ph": 7.2,
  "hardness": 180.0,
  "solids": 20000.0,
  "chloramines": 7.3,
  "sulfate": 300.0,
  "conductivity": 400.0,
  "organic_carbon": 14.0,
  "trihalomethanes": 60.0,
  "turbidity": 3.0
}

// Response
{
  "risk_score": 18.4,
  "label": "Safe",
  "potability": 1,
  "feature_importance": {
    "turbidity": 0.22,
    "ph": 0.19,
    "trihalomethanes": 0.15
  }
}
```

---

## 📦 Recommended Dataset

This dashboard is designed to pair with the **Water Quality & Potability** dataset:

- **Source:** [Kaggle – Water Quality Dataset](https://www.kaggle.com/datasets/mssmartypants/water-quality)
- **Samples:** ~3,276 rows
- **Features:** pH, Hardness, Solids, Chloramines, Sulfate, Conductivity, Organic Carbon, Trihalomethanes, Turbidity
- **Label:** Potability (0 = Not Potable, 1 = Potable)

For a richer multi-class output (Safe / Moderate / High / Critical), consider computing a **Water Quality Index (WQI)** score from the features and remapping it to the four risk tiers used in this dashboard.

---

## 🗺️ Roadmap

- [ ] Connect to trained ML model API (scikit-learn, TensorFlow, or PyTorch)
- [ ] Add WebSocket support for true real-time sensor streaming
- [ ] Integrate EPANET simulation data for pipe-network context
- [ ] Export alert log as CSV
- [ ] Add user authentication for multi-site deployments
- [ ] Mobile responsive layout improvements
- [ ] Historical data persistence (localStorage or backend DB)

---

## 📄 License

MIT License — free to use, modify, and distribute for research and educational purposes.

---

## 🙏 Acknowledgements

- WHO Drinking Water Quality Guidelines
- US EPA Water Quality Standards
- Kaggle Water Quality & Potability Dataset contributors
- Framer Motion, Recharts, and Lucide React open-source communities
