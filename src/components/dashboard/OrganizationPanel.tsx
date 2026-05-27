import { X, Clock, Instagram, Globe, Wallet, Star, MapPin } from "lucide-react";
import type { Organization } from "@/lib/mockData";

export function OrganizationPanel({ org, onClose }: { org: Organization; onClose: () => void }) {
  return (
    <div className="absolute top-4 left-4 bottom-4 w-[360px] z-[600] pointer-events-auto animate-in fade-in slide-in-from-left-4 duration-200">
      <div className="h-full rounded-lg border border-border bg-panel backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Карточка объекта</div>
            <div className="text-base font-semibold truncate">{org.name}</div>
            <div className="text-[11px] text-primary mt-0.5">{org.type}</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground shrink-0">
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <Row icon={MapPin} label="Координаты" value={`${org.coords[0].toFixed(4)}, ${org.coords[1].toFixed(4)}`} />
          <Row icon={Clock} label="Часы работы" value={org.hours} />
          <Row icon={Wallet} label="Средняя зарплата" value={org.salary} accent />

          {(org.instagram || org.website) && (
            <div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Социальные сети</div>
              <div className="space-y-1.5">
                {org.instagram && (
                  <a href={org.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Instagram className="size-4" /> Instagram
                  </a>
                )}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                    <Globe className="size-4" /> Веб-сайт
                  </a>
                )}
              </div>
            </div>
          )}

          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted-foreground mb-2">Отзывы</div>
            <div className="space-y-2">
              {org.reviews.map((r, i) => (
                <div key={i} className="rounded-md border border-border bg-secondary/40 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium">{r.author}</div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`size-3.5 ${j < r.rating ? "text-warning fill-current" : "text-muted-foreground/40"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[12px] text-muted-foreground leading-relaxed">{r.text}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-muted-foreground border-t border-border pt-3 leading-relaxed">
            Данные собраны из открытых источников (2ГИС, Google Maps, eGov, hh.kz). Зарплаты — оценочные.
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, accent }: { icon: typeof Clock; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-0.5 size-7 rounded-md grid place-items-center border ${accent ? "bg-primary/15 border-primary/30 text-primary" : "bg-secondary/60 border-border text-muted-foreground"}`}>
        <Icon className="size-3.5" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className={`text-sm ${accent ? "font-semibold text-primary" : ""}`}>{value}</div>
      </div>
    </div>
  );
}
