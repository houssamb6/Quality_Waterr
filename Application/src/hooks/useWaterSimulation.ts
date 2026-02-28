import { useState, useEffect, useCallback, useRef } from "react";

export interface SensorData {
  id: string;
  name: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  safeMin: number;
  safeMax: number;
  history: number[];
}

export interface Alert {
  id: string;
  message: string;
  level: "safe" | "moderate" | "high" | "critical";
  timestamp: Date;
}

export interface SimulationState {
  riskScore: number;
  riskLevel: "safe" | "moderate" | "high" | "critical";
  sensors: SensorData[];
  riskHistory: { time: string; value: number; predicted?: number }[];
  alerts: Alert[];
  aiInsight: string;
  shapValues: { sensor: string; contribution: number }[];
  isContaminated: boolean;
}

const INITIAL_SENSORS: SensorData[] = [
  { id: "ph", name: "pH", unit: "pH", value: 7.1, min: 0, max: 14, safeMin: 6.5, safeMax: 8.5, history: [] },
  { id: "hardness", name: "Hardness", unit: "mg/L", value: 180, min: 0, max: 500, safeMin: 60, safeMax: 300, history: [] },
  { id: "solids", name: "Solids", unit: "ppm", value: 20000, min: 0, max: 60000, safeMin: 0, safeMax: 40000, history: [] },
  { id: "chloramines", name: "Chloramines", unit: "mg/L", value: 7, min: 0, max: 13, safeMin: 1, safeMax: 10, history: [] },
  { id: "sulfate", name: "Sulfate", unit: "mg/L", value: 300, min: 0, max: 500, safeMin: 0, safeMax: 400, history: [] },
  { id: "conductivity", name: "Conductivity", unit: "μS/cm", value: 400, min: 0, max: 800, safeMin: 200, safeMax: 600, history: [] },
  { id: "organic_carbon", name: "Organic Carbon", unit: "mg/L", value: 14, min: 0, max: 30, safeMin: 0, safeMax: 20, history: [] },
  { id: "trihalomethanes", name: "Trihalomethanes", unit: "μg/L", value: 60, min: 0, max: 130, safeMin: 0, safeMax: 80, history: [] },
  { id: "turbidity", name: "Turbidity", unit: "NTU", value: 3.5, min: 0, max: 10, safeMin: 0, safeMax: 5, history: [] },
  { id: "potability", name: "Potability", unit: "score", value: 1, min: 0, max: 1, safeMin: 1, safeMax: 1, history: [] },
];

function getRiskLevel(score: number): "safe" | "moderate" | "high" | "critical" {
  if (score < 30) return "safe";
  if (score < 55) return "moderate";
  if (score < 75) return "high";
  return "critical";
}

function calculateRisk(sensors: SensorData[]): number {
  let total = 0;
  sensors.forEach((s) => {
    const range = s.safeMax - s.safeMin;
    let deviation = 0;
    if (s.value < s.safeMin) deviation = (s.safeMin - s.value) / range;
    else if (s.value > s.safeMax) deviation = (s.value - s.safeMax) / range;
    total += Math.min(deviation * 30, 100 / sensors.length);
  });
  return Math.min(Math.round(total), 100);
}

function generateInsight(sensors: SensorData[], risk: number): string {
  const problematic = sensors
    .filter((s) => s.value < s.safeMin || s.value > s.safeMax)
    .map((s) => s.name);
  if (problematic.length === 0) return "All parameters within safe ranges. Water quality is excellent.";
  if (risk > 75) return `⚠️ Critical: ${problematic.join(" and ")} at dangerous levels. Immediate action required.`;
  if (risk > 55) return `AI detected elevated ${problematic.join(" and ")} contributing to increased risk.`;
  return `Minor deviations in ${problematic.join(", ")}. Monitoring closely.`;
}

function generateShapValues(sensors: SensorData[]): { sensor: string; contribution: number }[] {
  return sensors.map((s) => {
    let contrib = 0;
    if (s.value < s.safeMin) contrib = ((s.safeMin - s.value) / (s.safeMax - s.safeMin)) * 100;
    else if (s.value > s.safeMax) contrib = ((s.value - s.safeMax) / (s.safeMax - s.safeMin)) * 100;
    return { sensor: s.name, contribution: Math.min(Math.round(contrib), 100) };
  }).sort((a, b) => b.contribution - a.contribution);
}

/** Response from POST /api/predict when model has predict_proba */
export interface PredictResponse {
  prediction: number;
  probability?: number[];
  risk_index?: number;
  risk_level?: string;
  probability_safe?: number;
  probability_unsafe?: number;
}

function apiRiskLevelToLower(level: string): "safe" | "moderate" | "high" | "critical" {
  const m: Record<string, "safe" | "moderate" | "high" | "critical"> = {
    Safe: "safe",
    Moderate: "moderate",
    High: "high",
    Critical: "critical",
  };
  return m[level] ?? "safe";
}

export function useWaterSimulation() {
  const [sensors, setSensors] = useState<SensorData[]>(
    INITIAL_SENSORS.map((s) => ({ ...s, history: Array.from({ length: 20 }, () => s.value + (Math.random() - 0.5) * 2) }))
  );
  const [riskHistory, setRiskHistory] = useState<{ time: string; value: number; predicted?: number }[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isContaminated, setIsContaminated] = useState(false);
  const [predictedPotability, setPredictedPotability] = useState<number | null>(null); // result from ML model
  const [lastRiskFromApi, setLastRiskFromApi] = useState<{ risk_index: number; risk_level: string } | null>(null);
  const [probabilitySafe, setProbabilitySafe] = useState<number | null>(null);
  const [probabilityUnsafe, setProbabilityUnsafe] = useState<number | null>(null);
  const alertIdRef = useRef(0);
  const sensorsRef = useRef(sensors);
  sensorsRef.current = sensors;

  // Risk level from mock/simulated sensor data (rule-based), so the gauge responds to fluctuations.
  const ruleBasedScore = calculateRisk(sensors);
  const riskScore = ruleBasedScore;
  const riskLevel = getRiskLevel(ruleBasedScore);
  const aiInsight = generateInsight(sensors, riskScore);
  const shapValues = generateShapValues(sensors);

  // helper that calls the backend ML model and returns prediction + risk from predict_proba
  async function fetchModelPrediction(sensorList: SensorData[]): Promise<PredictResponse> {
    const payload: Record<string, number> = {};
    sensorList
      .filter((s) => s.id !== "potability")
      .forEach((s) => {
        payload[s.id] = s.value;
      });

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: PredictResponse = await res.json();
      // Derive risk from probability so it's always tied to the same prediction (class 0 = unsafe)
      if (data.probability != null && data.probability[0] != null) {
        const probUnsafe = data.probability[0];
        const risk_index = Math.round(probUnsafe * 100 * 100) / 100;
        let risk_level: string;
        if (risk_index < 30) risk_level = "Safe";
        else if (risk_index < 60) risk_level = "Moderate";
        else if (risk_index < 80) risk_level = "High";
        else risk_level = "Critical";
        setLastRiskFromApi({ risk_index, risk_level });
      } else if (data.risk_index != null && data.risk_level != null) {
        setLastRiskFromApi({ risk_index: data.risk_index, risk_level: data.risk_level });
      } else {
        setLastRiskFromApi(null);
      }
      if (data.probability_safe != null) setProbabilitySafe(data.probability_safe);
      if (data.probability_unsafe != null) setProbabilityUnsafe(data.probability_unsafe);
      return data;
    } catch (err) {
      console.warn("prediction request failed", err);
      setLastRiskFromApi(null);
      setProbabilitySafe(null);
      setProbabilityUnsafe(null);
      return { prediction: 0 };
    }
  }

  // Simulate real-time fluctuations and ask the model for prediction + risk each time
  useEffect(() => {
    let mounted = true;
    const interval = setInterval(async () => {
      const current = sensorsRef.current;
      const next = current.map((s) => {
        const noise = (Math.random() - 0.5) * (isContaminated ? 1.5 : 0.5);
        const newVal = Math.max(s.min, Math.min(s.max, s.value + noise));
        const newHistory = [...s.history.slice(-19), newVal];
        return { ...s, value: parseFloat(newVal.toFixed(2)), history: newHistory };
      });
      setSensors(next);

      const data = await fetchModelPrediction(next);
      if (mounted) {
        setPredictedPotability(data.prediction);
      }

      const riskValueFromSensors = calculateRisk(next);
      setRiskHistory((prev) => {
        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}:${now
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
        const riskValue = riskValueFromSensors;
        const predictedScaled =
          data.probability?.[1] != null
            ? Math.round(data.probability[1] * 1000) / 10
            : typeof data.prediction === "number"
              ? data.prediction * 100
              : undefined;
        const newEntry = { time, value: riskValue, predicted: predictedScaled };
        return [...prev.slice(-29), newEntry];
      });
    }, 2000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [isContaminated]);

  const injectContamination = useCallback(() => {
    setIsContaminated(true);
    setSensors((prev) =>
      prev.map((s) => {
        let newVal = s.value;
        if (s.id === "ph") newVal = 4.5;
        else if (s.id === "hardness") newVal = 450;
        else if (s.id === "chloramines") newVal = 12;
        else if (s.id === "sulfate") newVal = 480;
        else if (s.id === "organic_carbon") newVal = 28;
        else if (s.id === "trihalomethanes") newVal = 120;
        else if (s.id === "turbidity") newVal = 9;
        else if (s.id === "potability") newVal = 0;
        return { ...s, value: newVal };
      })
    );
    const id = `alert-${++alertIdRef.current}`;
    setAlerts((prev) => [
      { id, message: "Contamination event detected! Multiple sensors reporting anomalous values.", level: "critical", timestamp: new Date() },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const restoreClean = useCallback(() => {
    setIsContaminated(false);
    setSensors((prev) => {
      const initial = INITIAL_SENSORS;
      return prev.map((s) => {
        const orig = initial.find((i) => i.id === s.id);
        return { ...s, value: orig ? orig.value : s.value };
      });
    });
    const id = `alert-${++alertIdRef.current}`;
    setAlerts((prev) => [
      { id, message: "Water quality restored to safe levels.", level: "safe", timestamp: new Date() },
      ...prev.slice(0, 9),
    ]);
  }, []);

  const updateSensor = useCallback((sensorId: string, value: number) => {
    setSensors((prev) => prev.map((s) => (s.id === sensorId ? { ...s, value: parseFloat(value.toFixed(2)) } : s)));
  }, []);

  const dismissAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  // when sensors are updated (including manual changes), request a prediction right away
  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await fetchModelPrediction(sensors);
      if (mounted && data) {
        setPredictedPotability(data.prediction);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [sensors]);

  return {
    riskScore,
    riskLevel,
    sensors,
    riskHistory,
    alerts,
    aiInsight,
    shapValues,
    isContaminated,
    predictedPotability,
    probabilitySafe,
    probabilityUnsafe,
    injectContamination,
    restoreClean,
    updateSensor,
    dismissAlert,
  };
}
