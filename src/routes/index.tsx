import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Sidebar, type ModuleId } from "@/components/dashboard/Sidebar";
import { TopBar, type AlertLevel } from "@/components/dashboard/TopBar";
import { FloodPanel } from "@/components/dashboard/FloodPanel";
import { PowerPanel } from "@/components/dashboard/PowerPanel";
import { WaterPanel } from "@/components/dashboard/WaterPanel";
import { MapErrorBoundary } from "@/components/dashboard/MapErrorBoundary";
import { SUBSTATIONS, RIVER_PATH, floodImpact } from "@/lib/mockData";

const MapView = lazy(() =>
  import("@/components/dashboard/MapView").then((m) => ({ default: m.MapView }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaskelen Urban Intelligence — Городская аналитика" },
      { name: "description", content: "Интерактивная панель управления рисками для г. Каскелен: паводки, энергосети, водоснабжение." },
    ],
  }),
  ssr: false,
  component: Dashboard,
});


function distMeters(a: [number, number], b: [number, number]) {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function minDistToRiver(p: [number, number]): number {
  let best = Infinity;
  for (const r of RIVER_PATH) {
    const d = distMeters(p, r);
    if (d < best) best = d;
  }
  return best;
}

function Dashboard() {
  const [module, setModule] = useState<ModuleId>("flood");
  const [floodLevel, setFloodLevel] = useState(0);
  const [showEvac, setShowEvac] = useState(false);
  const [selectedPower, setSelectedPower] = useState<string | null>(null);
  const [waterSummer, setWaterSummer] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState<[number, number] | null>(null);

  const impact = useMemo(() => floodImpact(floodLevel), [floodLevel]);

  const floodedSubstationIds = useMemo(() => {
    if (floodLevel <= 0) return [];
    const radius = 80 + 380 * (floodLevel / 5);
    return SUBSTATIONS.filter((s) => minDistToRiver(s.coords) < radius).map((s) => s.id);
  }, [floodLevel]);

  const alertLevel: AlertLevel = floodLevel >= 3 ? "red" : floodLevel >= 1.2 ? "yellow" : "green";

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar level={alertLevel} residentsAtRisk={impact.residents} />
      <div className="flex flex-1 min-h-0">
        <Sidebar active={module} onChange={setModule} />

        {/* Map area */}
        <main className="flex-1 relative min-w-0">
          <ClientOnly fallback={<div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Загрузка карты…</div>}>
            <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Загрузка карты…</div>}>
              <MapView
                module={module}
                floodLevel={floodLevel}
                showEvac={showEvac}
                selectedPower={selectedPower}
                setSelectedPower={setSelectedPower}
                floodedSubstationIds={floodedSubstationIds}
                waterSummer={waterSummer}
                placingBuilding={placing}
                buildingMarker={buildingMarker}
                onPlaceBuilding={(c) => { setBuildingMarker(c); setPlacing(false); }}
              />
            </Suspense>
          </ClientOnly>


          {/* Floating right panel */}
          <div className="absolute top-4 right-4 bottom-4 w-[340px] z-[500] pointer-events-none">
            <div className="h-full rounded-lg border border-border bg-panel backdrop-blur-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300" key={module}>
              <div className="px-4 py-3 border-b border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Активный модуль</div>
                <div className="text-base font-semibold">
                  {module === "flood" && "Паводки и ЧС"}
                  {module === "power" && "Мониторинг энергосети"}
                  {module === "water" && "Водоснабжение"}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {module === "flood" && (
                  <FloodPanel
                    level={floodLevel}
                    setLevel={setFloodLevel}
                    impact={impact}
                    showRoutes={showEvac}
                    onToggleRoutes={() => setShowEvac((v) => !v)}
                  />
                )}
                {module === "power" && (
                  <PowerPanel
                    selectedId={selectedPower}
                    setSelectedId={setSelectedPower}
                    floodedIds={floodedSubstationIds}
                  />
                )}
                {module === "water" && (
                  <WaterPanel
                    summer={waterSummer}
                    setSummer={setWaterSummer}
                    placing={placing}
                    setPlacing={setPlacing}
                    marker={buildingMarker}
                    clearMarker={() => setBuildingMarker(null)}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
