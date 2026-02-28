import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Skull, RefreshCw } from "lucide-react";
import type { SensorData } from "@/hooks/useWaterSimulation";

interface ContaminationPanelProps {
  sensors: SensorData[];
  onUpdateSensor: (id: string, value: number) => void;
  onInject: () => void;
  onRestore: () => void;
  isContaminated: boolean;
}

const ContaminationPanel = ({ sensors, onUpdateSensor, onInject, onRestore, isContaminated }: ContaminationPanelProps) => {
  const sliderSensors = sensors.slice(0, 6);

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Contamination Sim</h3>

      <div className="space-y-3 mb-5">
        {sliderSensors.map((s) => (
          <div key={s.id} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{s.name}</span>
              <span className="font-semibold text-foreground">{s.value} {s.unit}</span>
            </div>
            <Slider
              value={[s.value]}
              min={s.min}
              max={s.max}
              step={(s.max - s.min) / 100}
              onValueChange={([v]) => onUpdateSensor(s.id, v)}
              className="cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onInject}
          variant="destructive"
          size="sm"
          className="flex-1 gap-1.5"
          disabled={isContaminated}
        >
          <Skull className="w-3.5 h-3.5" />
          Inject Contamination
        </Button>
        <Button
          onClick={onRestore}
          variant="secondary"
          size="sm"
          className="flex-1 gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Restore Clean
        </Button>
      </div>
    </div>
  );
};

export default ContaminationPanel;
