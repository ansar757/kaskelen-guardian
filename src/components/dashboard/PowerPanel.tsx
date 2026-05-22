import { Zap, AlertTriangle } from "lucide-react";
import { SUBSTATIONS, type Substation } from "@/lib/mockData";

type Props = {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  floodedIds: string[];
};

export function PowerPanel({ selectedId, setSelectedId, floodedIds }: Props) {
  const sel = SUBSTATIONS.find((s) => s.id === selectedId) || null;
  const impact = sel ? computeImpact(sel) : null;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <Zap className="size-3.5" /> Симулятор отключения
        </div>
        <select
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(e.target.value || null)}
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— Выберите подстанцию —</option>
          {SUBSTATIONS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.type} · {s.name}
            </option>
          ))}
        </select>
      </div>

      {sel && impact && (
        <div className="rounded-md border border-danger/40 bg-danger/10 p-3 space-y-2">
          <div className="text-sm font-semibold text-danger">Отключено: {sel.name}</div>
          <KV k="Домохозяйства без света" v={impact.households.toLocaleString("ru-RU")} />
          <KV k="Школы затронуты" v={impact.schools} />
          <KV k="Котельные / тепло" v={impact.heat} />
          <KV k="Зона покрытия" v={`~${impact.radius} м`} />
        </div>
      )}

      {floodedIds.length > 0 && (
        <div className="rounded-md border border-danger/50 bg-danger/15 p-3 pulse-danger">
          <div className="flex items-center gap-2 text-danger font-semibold text-sm">
            <AlertTriangle className="size-4" /> Перекрёстная угроза
          </div>
          <div className="text-[12px] mt-1.5 leading-relaxed">
            ⚡ Затопление подстанций: <b>{floodedIds.join(", ")}</b>. Опасность короткого замыкания. Рекомендуется превентивное отключение.
          </div>
        </div>
      )}

      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1 pt-2 border-t border-border">
        Инфраструктура
      </div>
      <div className="text-[12px] space-y-1.5">
        <Legend color="oklch(0.68 0.20 50)" label="ПС — главные подстанции" />
        <Legend color="oklch(0.80 0.16 80)" label="ТП — трансформаторы" />
        <Legend color="oklch(0.62 0.22 25)" label="Аварийное состояние" />
      </div>
    </div>
  );
}

function computeImpact(s: Substation) {
  const isMain = s.type === "PS";
  return {
    households: s.households,
    schools: isMain ? 6 : Math.max(0, Math.round(s.households / 200)),
    heat: isMain ? "3 котельные отключены" : "1 котельная отключена",
    radius: isMain ? 1800 : 600,
  };
}

function KV({ k, v }: { k: string; v: string | number }) {
  return (
    <div className="flex justify-between text-[12px]">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-semibold tabular-nums">{v}</span>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-3 rounded-sm" style={{ background: color }} />
      <span>{label}</span>
    </div>
  );
}
