import { Waves, Sun, Building2, X } from "lucide-react";

type Props = {
  summer: boolean;
  setSummer: (b: boolean) => void;
  placing: boolean;
  setPlacing: (b: boolean) => void;
  marker: [number, number] | null;
  clearMarker: () => void;
};

export function WaterPanel({ summer, setSummer, placing, setPlacing, marker, clearMarker }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
          <Waves className="size-3.5" /> Давление в сети
        </div>
        <div className="rounded-md border border-border bg-secondary/40 p-3 space-y-2">
          <div className="text-[12px] flex items-center gap-2"><span className="size-3 rounded-full bg-danger" /> Критически низкое — нагорный район</div>
          <div className="text-[12px] flex items-center gap-2"><span className="size-3 rounded-full bg-warning" /> Среднее</div>
          <div className="text-[12px] flex items-center gap-2"><span className="size-3 rounded-full bg-success" /> Норма</div>
        </div>
      </div>

      <button
        onClick={() => setSummer(!summer)}
        className={`w-full flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-all ${
          summer
            ? "bg-warning/20 border-warning/50 text-warning"
            : "bg-secondary/60 border-border hover:bg-secondary"
        }`}
      >
        <Sun className="size-4" />
        {summer ? "Летний режим: включён" : "Летний режим"}
      </button>

      <div className="pt-2 border-t border-border">
        <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Влияние нового строительства
        </div>
        <button
          onClick={() => setPlacing(!placing)}
          className={`w-full flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition-all ${
            placing
              ? "bg-primary/20 border-primary/50 text-primary"
              : "bg-secondary/60 border-border hover:bg-secondary"
          }`}
        >
          <Building2 className="size-4" />
          {placing ? "Кликните по карте..." : "Разместить новое здание"}
        </button>

        {marker && (
          <div className="mt-3 rounded-md border border-danger/40 bg-danger/10 p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-danger">Прогноз нагрузки</div>
              <button onClick={clearMarker} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
            </div>
            <div className="text-[12px] leading-relaxed">
              Подключение этого объекта снизит давление воды на <b className="text-danger">12–18%</b> в радиусе <b>1.5 км</b>.
            </div>
            <div className="text-[11px] text-muted-foreground border-t border-border pt-2 mt-1">
              <b className="text-foreground">Рекомендация:</b> модернизация водозабора и увеличение диаметра магистрали Ø300 → Ø400 мм перед выдачей ТУ.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
