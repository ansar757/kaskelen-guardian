import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Polyline, Polygon, CircleMarker, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import {
  CITY_CENTER,
  RIVER_PATH,
  SAFE_POINTS,
  EVAC_ROUTES,
  PRESSURE_ZONES_NORMAL,
  PRESSURE_ZONES_SUMMER,
  FLOOD_ZONE_WARNING,
  FLOOD_ZONE_DANGER,
  ORGANIZATIONS,
} from "@/lib/mockData";
import { safeIcon, buildingIcon, orgIcon } from "./icons";
import type { ModuleId } from "./Sidebar";

type Props = {
  module: ModuleId;
  floodLevel: number;
  showEvac: boolean;
  selectedOrgId: string | null;
  setSelectedOrgId: (id: string | null) => void;
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
    module, floodLevel, showEvac, selectedOrgId, setSelectedOrgId,
    waterSummer, placingBuilding, buildingMarker, onPlaceBuilding,
  } = props;

  const tier: "normal" | "warning" | "danger" =
    floodLevel < 1.5 ? "normal" : floodLevel < 3.5 ? "warning" : "danger";

  // Danger polygon opacity scales within 3.5–5
  const dangerOpacity = useMemo(() => {
    if (tier !== "danger") return 0;
    const t = Math.min(1, (floodLevel - 3.5) / 1.5);
    return 0.28 + 0.22 * t;
  }, [tier, floodLevel]);

  const warningOpacity = useMemo(() => {
    if (tier === "normal") return 0;
    if (tier === "warning") {
      const t = (floodLevel - 1.5) / 2;
      return 0.25 + 0.20 * t;
    }
    return 0.35;
  }, [tier, floodLevel]);

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

      {/* Flood zones — module 1 only */}
      {module === "flood" && tier !== "normal" && (
        <Polygon
          positions={FLOOD_ZONE_WARNING}
          pathOptions={{
            color: "#38bdf8",
            weight: 1,
            fillColor: "#38bdf8",
            fillOpacity: warningOpacity,
          }}
        />
      )}
      {module === "flood" && tier === "danger" && (
        <Polygon
          positions={FLOOD_ZONE_DANGER}
          pathOptions={{
            color: "#0ea5e9",
            weight: 1.5,
            dashArray: "4 4",
            fillColor: "#0ea5e9",
            fillOpacity: dangerOpacity,
          }}
        />
      )}

      {/* Evacuation — only meaningful when flood > 2.5m */}
      {module === "flood" && showEvac && floodLevel > 2.5 && (
        <>
          {EVAC_ROUTES.map((route, i) => (
            <Polyline
              key={i}
              positions={route}
              pathOptions={{ color: "#22c55e", weight: 5, opacity: 0.95, dashArray: "8 6", lineCap: "round" }}
            />
          ))}
          {SAFE_POINTS.map((p) => (
            <Marker key={p.name} position={p.coords} icon={safeIcon()}>
              <Popup><b>Пункт эвакуации</b><br/>{p.name}</Popup>
            </Marker>
          ))}
        </>
      )}

      {/* Organizations — clickable in flood module */}
      {module === "flood" && ORGANIZATIONS.map((o) => (
        <Marker
          key={o.id}
          position={o.coords}
          icon={orgIcon(selectedOrgId === o.id)}
          eventHandlers={{ click: () => setSelectedOrgId(o.id) }}
        />
      ))}

      {/* Module 2: pressure heatmap */}
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
