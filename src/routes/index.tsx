import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Sidebar, type ModuleId } from "@/components/dashboard/Sidebar";
import { TopBar, type AlertLevel } from "@/components/dashboard/TopBar";
import { FloodPanel } from "@/components/dashboard/FloodPanel";
import { WaterPanel } from "@/components/dashboard/WaterPanel";
import { MapErrorBoundary } from "@/components/dashboard/MapErrorBoundary";
import { OrganizationPanel } from "@/components/dashboard/OrganizationPanel";
import { ORGANIZATIONS, floodImpact } from "@/lib/mockData";

const MapView = lazy(() =>
  import("@/components/dashboard/MapView").then((m) => ({ default: m.MapView }))
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kaskelen Urban Intelligence — Городская аналитика" },
      { name: "description", content: "Интерактивная панель управления рисками для г. Каскелен: паводки и водоснабжение." },
    ],
  }),
  ssr: false,
  component: Dashboard,
});

function Dashboard() {
  const [module, setModule] = useState<ModuleId>("flood");
  const [floodLevel, setFloodLevel] = useState(0);
  const [showEvac, setShowEvac] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [waterSummer, setWaterSummer] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState<[number, number] | null>(null);

  const impact = useMemo(() => floodImpact(floodLevel), [floodLevel]);
  const alertLevel: AlertLevel = floodLevel >= 3.5 ? "red" : floodLevel >= 1.5 ? "yellow" : "green";
  const selectedOrg = selectedOrgId ? ORGANIZATIONS.find((o) => o.id === selectedOrgId) ?? null : null;

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar level={alertLevel} residentsAtRisk={impact.residents} />
      <div className="flex flex-1 min-h-0">
        <Sidebar active={module} onChange={setModule} />

        <main className="flex-1 relative min-w-0">
          <ClientOnly fallback={<div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Загрузка карты…</div>}>
            <Suspense fallback={<div className="absolute inset-0 grid place-items-center text-muted-foreground text-sm">Загрузка карты…</div>}>
              <MapErrorBoundary>
                <MapView
                  module={module}
                  floodLevel={floodLevel}
                  showEvac={showEvac}
                  selectedOrgId={selectedOrgId}
                  setSelectedOrgId={setSelectedOrgId}
                  waterSummer={waterSummer}
                  placingBuilding={placing}
                  buildingMarker={buildingMarker}
                  onPlaceBuilding={(c) => { setBuildingMarker(c); setPlacing(false); }}
                />
              </MapErrorBoundary>
            </Suspense>
          </ClientOnly>

          {module === "flood" && selectedOrg && (
            <OrganizationPanel org={selectedOrg} onClose={() => setSelectedOrgId(null)} />
          )}

          <div className="absolute top-4 right-4 bottom-4 w-[340px] z-[500] pointer-events-none">
            <div className="h-full rounded-lg border border-border bg-panel backdrop-blur-md shadow-2xl pointer-events-auto flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300" key={module}>
              <div className="px-4 py-3 border-b border-border">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Активный модуль</div>
                <div className="text-base font-semibold">
                  {module === "flood" && "Паводки и ЧС"}
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
