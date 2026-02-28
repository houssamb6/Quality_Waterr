import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface RiskGaugeProps {
  score: number;
  level: "safe" | "moderate" | "high" | "critical";
}

const levelColors = {
  safe: { main: "var(--risk-safe)", glow: "hsl(var(--risk-safe) / 0.3)" },
  moderate: { main: "var(--risk-moderate)", glow: "hsl(var(--risk-moderate) / 0.3)" },
  high: { main: "var(--risk-high)", glow: "hsl(var(--risk-high) / 0.3)" },
  critical: { main: "var(--risk-critical)", glow: "hsl(var(--risk-critical) / 0.3)" },
};

const RiskGauge = ({ score, level }: RiskGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(0);
  const colors = levelColors[level];
  const fillPercent = score / 100;

  useEffect(() => {
    const duration = 800;
    const start = displayScore;
    const diff = score - start;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Risk Level</h3>
      <div className="relative w-40 h-40">
        {/* Outer ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
          <motion.circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={`hsl(${colors.main})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 52}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - fillPercent) }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            key={displayScore}
            className="text-4xl font-display font-bold text-foreground"
          >
            {displayScore}
          </motion.span>
          <span className="text-xs text-muted-foreground mt-1">/ 100</span>
        </div>

        {/* Wave inside circle */}
        <div className="absolute inset-3 rounded-full overflow-hidden opacity-20">
          <div
            className="absolute bottom-0 left-0 w-full transition-all duration-1000"
            style={{ height: `${fillPercent * 100}%`, background: `hsl(${colors.main})` }}
          >
            <svg className="absolute -top-2 left-0 w-[200%] h-4 animate-wave" viewBox="0 0 200 10" preserveAspectRatio="none">
              <path d="M0,5 C25,0 50,10 75,5 C100,0 125,10 150,5 C175,0 200,10 200,5 L200,10 L0,10 Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      <motion.div
        key={level}
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mt-3 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider"
        style={{
          background: `hsl(${colors.main} / 0.15)`,
          color: `hsl(${colors.main})`,
        }}
      >
        {level}
      </motion.div>
    </div>
  );
};

export default RiskGauge;
