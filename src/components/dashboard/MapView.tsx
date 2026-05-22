import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import {
  CITY_CENTER,
  RIVER_PATH,
  SUBSTATIONS,
  SAFE_POINTS,
  EVAC_ROUTES,
  PRESSURE_ZONES_NORMAL,
  PRESSURE_ZONES_SUMMER,
  type Substation,
} from "@/lib/mockData";
import { tpIcon, psIcon, safeIcon, buildingIcon } from "./icons";
import type { ModuleId } from "./Sidebar";

type Props = {
  module: ModuleId;
  floodLevel: number;
  showEvac: boolean;
  selectedPower: string | null;
  setSelectedPower: (id: string | null) => void;
  floodedSubstationIds: string[];
  waterSummer: boolean;
  placingBuilding: boolean;
  buildingMarker: [number, number] | null;
  onPlaceBuilding: (c: [number, number]) => void;
};

function ClickHandler({ enabled, onClick }: { enabled: boolean; onClick: (c: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      if (enabled) onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function CursorSetter({ placing }: { placing: boolean }) {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    el.style.cursor = placing ? "crosshair" : "";
  }, [placing, map]);
  return null;
}

export function MapView(props: Props) {
  const {
    module, floodLevel, showEvac, selectedPower, setSelectedPower,
    floodedSubstationIds, waterSummer, placingBuilding, buildingMarker, onPlaceBuilding,
  } = props;

  // Flood overlay: render polyline along river with width derived from level
  const floodWeight = useMemo(() => 8 + floodLevel * 22, [floodLevel]);
  const floodOpacity = useMemo(() => Math.min(0.65, 0.15 + floodLevel * 0.11), [floodLevel]);

  // Outage area for selected substation
  const outage = useMemo(() => {
    if (module !== "power" || !selectedPower) return null;
    const s = SUBSTATIONS.find((x) => x.id === selectedPower);
    if (!s) return null;
    return { center: s.coords, radius: s.type === "PS" ? 1800 : 600 };
  }, [module, selectedPower]);

  const pressureZones = waterSummer ? PRESSURE_ZONES_SUMMER : PRESSURE_ZONES_NORMAL;

  return (
    <MapContainer
      center={CITY_CENTER}
      zoom={13}
      className="absolute inset-0"
      zoomControl={true}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />

      <CursorSetter placing={placingBuilding} />
      <ClickHandler enabled={placingBuilding} onClick={onPlaceBuilding} />

      {/* River always visible */}
      <Polyline
        positions={RIVER_PATH}
        pathOptions={{ color: "#38bdf8", weight: 4, opacity: 0.55 }}
      />

      {/* Flood overlay (module 1, also visible faintly when level > 0 in other modules for cross-alerts) */}
      {floodLevel > 0 && (
        <Polyline
          positions={RIVER_PATH}
          pathOptions={{
            color: "#06b6d4",
            weight: floodWeight,
            opacity: floodOpacity,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}

      {/* Module 1: evacuation */}
      {module === "flood" && showEvac && (
        <>
          {EVAC_ROUTES.map((route, i) => (
            <Polyline
              key={i}
              positions={route}
              pathOptions={{ color: "#22c55e", weight: 4, opacity: 0.9, dashArray: "8 6" }}
            />
          ))}
          {SAFE_POINTS.map((p) => (
            <Marker key={p.name} position={p.coords} icon={safeIcon()}>
              <Popup><b>Пункт эвакуации</b><br/>{p.name}</Popup>
            </Marker>
          ))}
        </>
      )}

      {/* Module 2: substations */}
      {module === "power" && SUBSTATIONS.map((s: Substation) => {
        const flooded = floodedSubstationIds.includes(s.id);
        const icon = s.type === "PS" ? psIcon() : tpIcon(flooded);
        return (
          <Marker
            key={s.id}
            position={s.coords}
            icon={icon}
            eventHandlers={{ click: () => setSelectedPower(s.id) }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold">{s.name}</div>
                <div>Мощность: {s.capacity}</div>
                <div>Домохозяйств: {s.households.toLocaleString("ru-RU")}</div>
                <div>Статус: {flooded ? "⚠ затопление" : "норма"}</div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* Outage zone */}
      {outage && (
        <Circle
          center={outage.center}
          radius={outage.radius}
          pathOptions={{ color: "#1f2937", fillColor: "#0f172a", fillOpacity: 0.55, weight: 1 }}
        />
      )}

      {/* Module 3: pressure heatmap (using circle markers) */}
      {module === "water" && pressureZones.map(([lat, lng, v], i) => {
        const color = v > 0.7 ? "#ef4444" : v > 0.4 ? "#eab308" : "#22c55e";
        return (
          <CircleMarker
            key={i}
            center={[lat, lng]}
            radius={28 + v * 22}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.35, weight: 0 }}
          />
        );
      })}

      {/* Building placement */}
      {module === "water" && buildingMarker && (
        <>
          <Circle
            center={buildingMarker}
            radius={1500}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.12, weight: 1, dashArray: "4 4" }}
          />
          <Marker position={buildingMarker} icon={buildingIcon()}>
            <Popup>Новый объект<br/>Радиус влияния: 1.5 км</Popup>
          </Marker>
        </>
      )}
    </MapContainer>
  );
}
