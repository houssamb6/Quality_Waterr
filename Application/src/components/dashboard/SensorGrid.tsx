import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import type { SensorData } from "@/hooks/useWaterSimulation";
import { Droplets, Gauge, FlaskConical, Atom, Wind, Zap, Leaf, AlertTriangle, CloudRain, ShieldCheck } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ph: <Gauge className="w-4 h-4" />,
  hardness: <FlaskConical className="w-4 h-4" />,
  solids: <Atom className="w-4 h-4" />,
  chloramines: <Droplets className="w-4 h-4" />,
  sulfate: <Wind className="w-4 h-4" />,
  conductivity: <Zap className="w-4 h-4" />,
  organic_carbon: <Leaf className="w-4 h-4" />,
  trihalomethanes: <AlertTriangle className="w-4 h-4" />,
  turbidity: <CloudRain className="w-4 h-4" />,
  potability: <ShieldCheck className="w-4 h-4" />,
};

interface SensorCardProps {
  sensor: SensorData;
}

const SensorCard = ({ sensor }: SensorCardProps) => {
  const isOutOfRange = sensor.value < sensor.safeMin || sensor.value > sensor.safeMax;
  const sparkData = sensor.history.map((v, i) => ({ i, v }));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card-hover p-4 relative overflow-hidden ${
        isOutOfRange ? "ring-1 ring-risk-critical/40" : ""
      }`}
    >
      {/* Ripple on danger */}
      {isOutOfRange && (
        <div className="absolute inset-0 bg-risk-critical/5 animate-pulse rounded-xl" />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isOutOfRange ? "bg-risk-critical/15 text-risk-critical" : "bg-primary/10 text-primary"}`}>
              {iconMap[sensor.id] || <Droplets className="w-4 h-4" />}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{sensor.name}</span>
          </div>
        </div>

        <motion.div
          key={sensor.value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-2xl font-display font-bold text-foreground mb-1"
        >
          {sensor.value}
          <span className="text-xs text-muted-foreground ml-1 font-body font-normal">{sensor.unit}</span>
        </motion.div>

        <div className="text-[10px] text-muted-foreground mb-2">
          Safe: {sensor.safeMin}–{sensor.safeMax} {sensor.unit}
        </div>

        <div className="h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={isOutOfRange ? "hsl(var(--risk-critical))" : "hsl(var(--primary))"}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
};

interface SensorGridProps {
  sensors: SensorData[];
}

const SensorGrid = ({ sensors }: SensorGridProps) => (
  <div className="glass-card p-6">
    <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Sensor Lagoon</h3>
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {sensors.map((s) => (
        <SensorCard key={s.id} sensor={s} />
      ))}
    </div>
  </div>
);

export default SensorGrid;
