import { motion } from "framer-motion";
import { Brain } from "lucide-react";

interface AIInsightPanelProps {
  insight: string;
  shapValues: { sensor: string; contribution: number }[];
}

const AIInsightPanel = ({ insight, shapValues }: AIInsightPanelProps) => {
  const topValues = shapValues.filter((s) => s.contribution > 0).slice(0, 5);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">AI Insights</h3>
      </div>

      <motion.p
        key={insight}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-sm text-foreground mb-4 leading-relaxed"
      >
        {insight}
      </motion.p>

      {topValues.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Contribution (SHAP-style)</p>
          {topValues.map((sv, i) => (
            <div key={sv.sensor} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{sv.sensor}</span>
                <span className="text-foreground font-medium">{sv.contribution}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${sv.contribution}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{
                    background: sv.contribution > 60
                      ? "hsl(var(--risk-critical))"
                      : sv.contribution > 30
                        ? "hsl(var(--risk-high))"
                        : "hsl(var(--primary))",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIInsightPanel;
