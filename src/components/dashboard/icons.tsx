import L from "leaflet";

export function makeDivIcon(html: string, size = 32) {
  return L.divIcon({
    className: "",
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export const tpIcon = (danger = false) =>
  makeDivIcon(
    `<div class="icon-marker ${danger ? "pulse-danger" : ""}" style="width:30px;height:30px;background:${
      danger ? "oklch(0.62 0.22 25)" : "oklch(0.80 0.16 80)"
    };color:#1a1a1a;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    </div>`,
    30
  );

export const psIcon = () =>
  makeDivIcon(
    `<div class="icon-marker" style="width:42px;height:42px;background:oklch(0.68 0.20 50);color:#1a1a1a;">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    </div>`,
    42
  );

export const safeIcon = () =>
  makeDivIcon(
    `<div class="icon-marker" style="width:30px;height:30px;background:oklch(0.70 0.17 150);color:#0b1220;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    </div>`,
    30
  );

export const buildingIcon = () =>
  makeDivIcon(
    `<div class="icon-marker" style="width:28px;height:28px;background:oklch(0.75 0.14 200);color:#0b1220;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
    </div>`,
    28
  );

export const orgIcon = (selected = false) =>
  makeDivIcon(
    `<div class="icon-marker" style="width:${selected ? 30 : 24}px;height:${selected ? 30 : 24}px;background:${selected ? "oklch(0.75 0.14 200)" : "oklch(0.55 0.10 220)"};color:#0b1220;border-color:rgba(255,255,255,${selected ? 0.6 : 0.3});">
      <svg width="${selected ? 16 : 13}" height="${selected ? 16 : 13}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M15 9h.01M9 13h.01M15 13h.01M9 17h.01M15 17h.01"/></svg>
    </div>`,
    selected ? 30 : 24
  );
