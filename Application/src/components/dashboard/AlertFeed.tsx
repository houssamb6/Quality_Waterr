import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, AlertTriangle, XOctagon } from "lucide-react";
import type { Alert } from "@/hooks/useWaterSimulation";

const alertIcons = {
  safe: <CheckCircle className="w-4 h-4" />,
  moderate: <AlertCircle className="w-4 h-4" />,
  high: <AlertTriangle className="w-4 h-4" />,
  critical: <XOctagon className="w-4 h-4" />,
};

const alertColors = {
  safe: "border-risk-safe/30 bg-risk-safe/10 text-risk-safe",
  moderate: "border-risk-moderate/30 bg-risk-moderate/10 text-risk-moderate",
  high: "border-risk-high/30 bg-risk-high/10 text-risk-high",
  critical: "border-risk-critical/30 bg-risk-critical/10 text-risk-critical",
};

interface AlertFeedProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

const AlertFeed = ({ alerts, onDismiss }: AlertFeedProps) => {
  if (alerts.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Alert Feed</h3>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 30, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.95 }}
              className={`flex items-start gap-2 p-3 rounded-lg border ${alertColors[alert.level]}`}
            >
              <div className="mt-0.5 shrink-0">{alertIcons[alert.level]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground">{alert.message}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="shrink-0 p-0.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AlertFeed;
