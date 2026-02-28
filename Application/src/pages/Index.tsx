import { useState, useEffect } from "react";
import { useWaterSimulation } from "@/hooks/useWaterSimulation";
import WaterBackground from "@/components/dashboard/WaterBackground";
import Header from "@/components/dashboard/Header";
import RiskGauge from "@/components/dashboard/RiskGauge";
import RiskTrendChart from "@/components/dashboard/RiskTrendChart";
import SensorGrid from "@/components/dashboard/SensorGrid";
import ContaminationPanel from "@/components/dashboard/ContaminationPanel";
import AIInsightPanel from "@/components/dashboard/AIInsightPanel";
import AlertFeed from "@/components/dashboard/AlertFeed";

const Index = () => {
  const [isDark, setIsDark] = useState(true);
  const sim = useWaterSimulation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <div className="min-h-screen relative">
      <WaterBackground isContaminated={sim.isContaminated} />

      <div className="relative z-10 pb-8">
        <Header
          riskLevel={sim.riskLevel}
          riskScore={sim.riskScore}
          predictedPotability={sim.predictedPotability}
          isDark={isDark}
          toggleTheme={() => setIsDark(!isDark)}
        />

        <main className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
          {/* Top row: Gauge + Trend + AI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <RiskGauge score={sim.riskScore} level={sim.riskLevel} />
            <RiskTrendChart data={sim.riskHistory} />
            <AIInsightPanel insight={sim.aiInsight} shapValues={sim.shapValues} />
          </div>

          {/* Sensor Grid */}
          <SensorGrid sensors={sim.sensors} />

          {/* Bottom row: Contamination + Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContaminationPanel
              sensors={sim.sensors}
              onUpdateSensor={sim.updateSensor}
              onInject={sim.injectContamination}
              onRestore={sim.restoreClean}
              isContaminated={sim.isContaminated}
            />
            <AlertFeed alerts={sim.alerts} onDismiss={sim.dismissAlert} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
