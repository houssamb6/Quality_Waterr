import { Droplets, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
  riskLevel: "safe" | "moderate" | "high" | "critical";
  riskScore: number;
  predictedPotability?: number | null; // 0 or 1
  isDark: boolean;
  toggleTheme: () => void;
}


const riskConfig = {
  safe: { label: "Safe", className: "bg-risk-safe/20 text-risk-safe border-risk-safe/30" },
  moderate: { label: "Moderate", className: "bg-risk-moderate/20 text-risk-moderate border-risk-moderate/30" },
  high: { label: "High Risk", className: "bg-risk-high/20 text-risk-high border-risk-high/30" },
  critical: { label: "Critical", className: "bg-risk-critical/20 text-risk-critical border-risk-critical/30" },
};

const Header = ({ riskLevel, riskScore, predictedPotability, isDark, toggleTheme }: HeaderProps) => {
  const risk = riskConfig[riskLevel];

  return (
    <header className="relative z-10 glass-card px-4 sm:px-6 py-3 mx-4 mt-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Droplets className="w-7 h-7 text-primary" />
        </motion.div>
        <div>
          <h1 className="text-lg sm:text-xl font-display font-bold text-foreground tracking-tight">
            AquaGuard AI
          </h1>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            Live Monitoring
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          key={riskLevel}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${risk.className}`}
        >
          Risk: {risk.label} ({riskScore})
        </motion.div>

        {predictedPotability !== undefined && predictedPotability !== null && (
          <div className="px-2 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent">
            Pred
            : {predictedPotability > 0.5 ? "Potable" : "Not potable"}
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg glass-card-hover text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
