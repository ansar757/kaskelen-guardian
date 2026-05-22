import { useEffect, useState } from "react";
import { ShieldCheck, AlertTriangle, Siren } from "lucide-react";

export type AlertLevel = "green" | "yellow" | "red";

const config = {
  green: {
    label: "Все системы в норме",
    Icon: ShieldCheck,
    bg: "bg-success/15",
    text: "text-success",
    dot: "bg-success",
    border: "border-success/40",
  },
  yellow: {
    label: "Мониторинг активен — повышенный уровень воды",
    Icon: AlertTriangle,
    bg: "bg-warning/15",
    text: "text-warning",
    dot: "bg-warning",
    border: "border-warning/40",
  },
  red: {
    label: "ЧРЕЗВЫЧАЙНАЯ СИТУАЦИЯ — активна зона затопления",
    Icon: Siren,
    bg: "bg-danger/15",
    text: "text-danger",
    dot: "bg-danger",
    border: "border-danger/50",
  },
};

export function TopBar({ level, residentsAtRisk }: { level: AlertLevel; residentsAtRisk: number }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const c = config[level];
  const Icon = c.Icon;
  const dateStr = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" });
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const label = level === "red" ? `ЧС — активна зона затопления, ${residentsAtRisk.toLocaleString("ru-RU")} жителей в зоне риска` : c.label;

  return (
    <header className="h-14 shrink-0 border-b border-border bg-card/80 backdrop-blur flex items-center px-4 gap-4 z-[1000] relative">
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-md bg-primary/15 border border-primary/30 grid place-items-center">
          <div className="size-2 rounded-full bg-primary" />
        </div>
        <div className="leading-tight">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Городская аналитика</div>
          <div className="text-sm font-semibold">г. Каскелен · Urban Intelligence</div>
        </div>
      </div>

      <div className={`flex-1 mx-4 flex items-center justify-center gap-3 h-10 rounded-md border ${c.border} ${c.bg} ${c.text} px-4 transition-all`}>
        <span className={`relative flex size-2.5`}>
          <span className={`absolute inline-flex size-full rounded-full ${c.dot} opacity-60 animate-ping`} />
          <span className={`relative inline-flex size-2.5 rounded-full ${c.dot}`} />
        </span>
        <Icon className="size-4" />
        <span className="text-sm font-medium tracking-wide uppercase">{label}</span>
      </div>

      <div className="text-right leading-tight">
        <div className="text-sm font-mono tabular-nums">{timeStr}</div>
        <div className="text-[11px] text-muted-foreground">{dateStr}</div>
      </div>
    </header>
  );
}
