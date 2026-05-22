import { Home, School, Cross, Users, Navigation, Waves } from "lucide-react";
import type { FloodImpact } from "@/lib/mockData";

type Props = {
  level: number;
  setLevel: (n: number) => void;
  impact: FloodImpact;
  showRoutes: boolean;
  onToggleRoutes: () => void;
};

export function FloodPanel({ level, setLevel, impact, showRoutes, onToggleRoutes }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <Waves className="size-3.5" /> Симулятор паводка
        </div>
        <div className="rounded-md border border-border bg-secondary/40 p-4">
          <div className="flex items-baseline justify-between mb-3">
            <span className="text-sm text-muted-foreground">Уровень воды</span>
            <span className="text-2xl font-bold tabular-nums text-primary">
              {level.toFixed(1)} <span className="text-sm text-muted-foreground">м</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={level}
            onChange={(e) => setLevel(parseFloat(e.target.value))}
            className="w-full accent-[oklch(0.75_0.14_200)]"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0 м</span><span>норма</span><span>2.5 м</span><span>опасно</span><span>5 м</span>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Калькулятор ущерба</div>
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Home} label="Жилые здания" value={impact.residential} tone="primary" />
          <Stat icon={School} label="Школы" value={impact.schools} tone="warning" />
          <Stat icon={Cross} label="Мед. учреждения" value={impact.medical} tone="danger" />
          <Stat icon={Users} label="Жители в зоне" value={impact.residents} tone="primary" big />
        </div>
      </div>

      <button
        onClick={onToggleRoutes}
        className={`w-full flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-all ${
          showRoutes
            ? "bg-success/20 border-success/50 text-success"
            : "bg-secondary/60 border-border hover:bg-secondary"
        }`}
      >
        <Navigation className="size-4" />
        {showRoutes ? "Маршруты эвакуации показаны" : "Рассчитать маршруты эвакуации"}
      </button>

      <div className="text-[11px] text-muted-foreground leading-relaxed border-t border-border pt-3">
        Модель использует упрощённую логику затопления вдоль р. Каскеленка. Низины и прибрежные зоны затапливаются первыми.
      </div>
    </div>
  );
}

function Stat({
  icon: Icon, label, value, tone, big,
}: { icon: typeof Home; label: string; value: number; tone: "primary" | "warning" | "danger"; big?: boolean }) {
  const toneCls = {
    primary: "text-primary border-primary/30",
    warning: "text-warning border-warning/30",
    danger: "text-danger border-danger/30",
  }[tone];
  return (
    <div className={`rounded-md border bg-secondary/30 p-3 ${big ? "col-span-2" : ""}`}>
      <div className={`flex items-center gap-1.5 text-[11px] ${toneCls.split(" ")[0]}`}>
        <Icon className="size-3.5" />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      <div className={`mt-1 font-bold tabular-nums ${big ? "text-3xl" : "text-xl"}`}>
        {value.toLocaleString("ru-RU")}
      </div>
    </div>
  );
}
