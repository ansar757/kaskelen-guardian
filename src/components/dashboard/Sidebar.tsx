import { Droplets, Waves } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ModuleId = "flood" | "water";

const MODULES: { id: ModuleId; label: string; sub: string; Icon: LucideIcon }[] = [
  { id: "flood", label: "Паводки и ЧС", sub: "Flood & Emergency", Icon: Droplets },
  { id: "water", label: "Водоснабжение", sub: "Water Supply", Icon: Waves },
];

export function Sidebar({ active, onChange }: { active: ModuleId; onChange: (m: ModuleId) => void }) {
  return (
    <aside className="w-20 md:w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur flex flex-col z-[1000] relative">
      <div className="p-3 hidden md:block">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 mb-2">Модули</div>
      </div>
      <nav className="flex-1 px-2 space-y-1 mt-2 md:mt-0">
        {MODULES.map((m) => {
          const isActive = active === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={`w-full group flex items-center gap-3 rounded-md px-3 py-3 text-left transition-all border ${
                isActive
                  ? "bg-primary/15 border-primary/40 text-primary"
                  : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <m.Icon className={`size-5 shrink-0 ${isActive ? "text-primary" : ""}`} />
              <div className="hidden md:block leading-tight">
                <div className="text-sm font-medium">{m.label}</div>
                <div className="text-[11px] opacity-70">{m.sub}</div>
              </div>
            </button>
          );
        })}
      </nav>
      <div className="p-3 text-[10px] text-muted-foreground border-t border-border hidden md:block">
        v1.0 · мок-данные<br/>Акимат г. Каскелен
      </div>
    </aside>
  );
}
