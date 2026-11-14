"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Navigation, Check, Maximize2 } from "lucide-react";
import type { TirthaMapPoint } from "@/lib/types";
import { useCompleted, toggleCompleted, getCompleted } from "@/lib/progress";
import type { LanguageCode } from "@/lib/i18n/languages";
import { getUiStrings } from "@/lib/i18n/dictionary";

/**
 * Plots every temple on a Leaflet map with free OpenStreetMap tiles — no
 * API key, unlike the Google Maps JS API which requires a billing account.
 * Coordinates come from geocoding each entry's stored Google Maps link
 * (extraction/geocode_tirthas.py); each popup's "Get Directions" link still
 * points at that original maps_url so routing goes through Google Maps,
 * where the app has no reason to reimplement.
 *
 * "Find Temples Near Me" uses the browser's Geolocation API (no server
 * round-trip, no API key) and ranks temples by great-circle (haversine)
 * distance — approximate, but the popup/list "Get Directions" link still
 * hands off to Google Maps for actual turn-by-turn routing.
 *
 * Leaflet touches the DOM directly and expects a real browser window, so
 * it's loaded dynamically inside useEffect rather than imported at module
 * scope — importing it during SSR/build would crash on `window`/`document`.
 */
const EARTH_RADIUS_KM = 6371;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

type NearbyEntry = TirthaMapPoint & { distanceKm: number };
type StatusFilter = "all" | "done" | "pending";

/** Teardrop pin: maroon with the entry number, or green with a check once darshan is complete. */
function pinIcon(L: typeof import("leaflet"), n: number, done: boolean) {
  return L.divIcon({
    className: "",
    html: `<div class="tm-pin ${done ? "tm-pin--done" : ""}"><span>${done ? "&#10003;" : n}</span></div>`,
    iconSize: [30, 40],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  });
}

export function TempleMap({ points, lang }: { points: TirthaMapPoint[]; lang: LanguageCode }) {
  const t = getUiStrings(lang);
  const getDirectionsLabel = t.getDirections;
  const findNearbyLabel = t.findNearby;
  const locatingLabel = t.locating;
  const yourLocationLabel = t.yourLocation;
  const nearbyHeadingLabel = t.nearbyHeading;
  const distanceAwayLabel = t.distanceAway;
  const locationDeniedLabel = t.locationDenied;
  const locationUnavailableLabel = t.locationUnavailable;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const leafletRef = useRef<typeof L | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const markersRef = useRef(new Map<string, { marker: L.Marker; point: TirthaMapPoint }>());
  const layerRef = useRef<L.LayerGroup | null>(null);
  const filterRef = useRef<StatusFilter>("all");

  const { completed, hydrated } = useCompleted();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const placed = points.filter((p) => p.latitude != null && p.longitude != null);
  const doneCount = hydrated ? placed.filter((p) => completed.has(p.slug)).length : 0;

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearby, setNearby] = useState<NearbyEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(containerRef.current, {
        center: [22.5, 78.5],
        zoom: 5,
        scrollWheelZoom: true,
      });
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const layer = L.layerGroup().addTo(map);
      layerRef.current = layer;
      const doneNow = getCompleted();
      const bounds: [number, number][] = [];
      for (const p of points) {
        if (p.latitude == null || p.longitude == null) continue;
        bounds.push([p.latitude, p.longitude]);
        const marker = L.marker([p.latitude, p.longitude], {
          icon: pinIcon(L, p.entry_number, doneNow.has(p.slug)),
          title: p.title,
          riseOnHover: true,
        });
        // Popup content is rebuilt on every open so the button reflects the
        // current completion state.
        marker.bindPopup(() => buildPopup(p), { minWidth: 210, className: "tm-popup" });
        markersRef.current.set(p.slug, { marker, point: p });
      }
      applyMarkers();
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markers.clear();
      layerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- points/lang/label are stable per page load
  }, []);

  function buildPopup(p: TirthaMapPoint): HTMLElement {
    const done = getCompleted().has(p.slug);
    const place = [p.city, p.state].filter(Boolean).join(", ");
    const detailHref = `/${lang}/tirtha/${p.slug}`;
    const directionsHref =
      p.maps_url ?? `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
    const el = document.createElement("div");
    el.className = "tm-popup-body";
    el.innerHTML = `
      <div class="tm-popup-num">#${p.entry_number}${
        done ? ` · <span class="tm-popup-done">&#10003; ${escapeHtml(t.progress.legendDone)}</span>` : ""
      }</div>
      <a class="tm-popup-title" href="${detailHref}">${escapeHtml(p.title)}</a>
      ${place ? `<div class="tm-popup-place">${escapeHtml(place)}</div>` : ""}
      <div class="tm-popup-actions">
        <button type="button" class="tm-popup-toggle ${done ? "is-done" : ""}">
          ${escapeHtml(done ? t.progress.undo : t.progress.markComplete)}
        </button>
        <a class="tm-popup-link" href="${directionsHref}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(getDirectionsLabel)} &#8599;
        </a>
      </div>`;
    // Keep clicks inside the popup from reaching the map (which would close it).
    leafletRef.current?.DomEvent.disableClickPropagation(el);
    el.querySelector("button")?.addEventListener("click", () => {
      toggleCompleted(p.slug, p.title);
      const entry = markersRef.current.get(p.slug);
      if (entry) entry.marker.setPopupContent(buildPopup(p));
    });
    return el;
  }

  /** Sync every marker's icon + visibility with completion state and the active filter. */
  function applyMarkers() {
    const L = leafletRef.current;
    const layer = layerRef.current;
    if (!L || !layer) return;
    const done = getCompleted();
    const f = filterRef.current;
    for (const { marker, point } of markersRef.current.values()) {
      const isDone = done.has(point.slug);
      marker.setIcon(pinIcon(L, point.entry_number, isDone));
      marker.setZIndexOffset(isDone ? 0 : 100);
      const visible = f === "all" || (f === "done" ? isDone : !isDone);
      if (visible && !layer.hasLayer(marker)) layer.addLayer(marker);
      if (!visible && layer.hasLayer(marker)) layer.removeLayer(marker);
    }
  }

  useEffect(() => {
    filterRef.current = filter;
    applyMarkers();
     
  }, [filter, completed]);

  const fitAll = () => {
    const map = mapRef.current;
    const layer = layerRef.current;
    const L = leafletRef.current;
    if (!map || !layer || !L) return;
    const latlngs = layer.getLayers().map((m) => (m as L.Marker).getLatLng());
    if (latlngs.length > 0) map.fitBounds(L.latLngBounds(latlngs), { padding: [30, 30] });
  };

  const findNearby = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationError(locationUnavailableLabel);
      return;
    }
    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude: uLat, longitude: uLon } = pos.coords;

        const ranked: NearbyEntry[] = points
          .filter((p) => p.latitude != null && p.longitude != null)
          .map((p) => ({ ...p, distanceKm: haversineKm(uLat, uLon, p.latitude!, p.longitude!) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 12);
        setNearby(ranked);

        const L = leafletRef.current;
        const map = mapRef.current;
        if (L && map) {
          if (userMarkerRef.current) userMarkerRef.current.remove();
          const userIcon = L.divIcon({
            className: "",
            html: `<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid white;box-shadow:0 0 0 2px #2563eb,0 1px 4px rgba(0,0,0,.4)"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          });
          userMarkerRef.current = L.marker([uLat, uLon], { icon: userIcon, zIndexOffset: 1000 })
            .addTo(map)
            .bindPopup(escapeHtml(yourLocationLabel));
          const nearBounds: [number, number][] = [[uLat, uLon], ...ranked.map((r) => [r.latitude!, r.longitude!] as [number, number])];
          map.fitBounds(nearBounds, { padding: [40, 40], maxZoom: 11 });
        }
      },
      (err) => {
        setLocating(false);
        setLocationError(err.code === err.PERMISSION_DENIED ? locationDeniedLabel : locationUnavailableLabel);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, [points, locationDeniedLabel, locationUnavailableLabel, yourLocationLabel]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={findNearby}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-sm bg-maroon px-4 py-2 font-ui text-sm font-medium text-ivory transition-all hover:-translate-y-0.5 hover:bg-maroon-deep disabled:opacity-60"
        >
          <Locate className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} aria-hidden />
          {locating ? locatingLabel : findNearbyLabel}
        </button>
        <div
          role="radiogroup"
          aria-label={t.progress.yatraProgress}
          className="inline-flex rounded-full border border-sandstone-deep bg-sandstone/70 p-1 font-ui text-xs"
        >
          {(
            [
              ["all", t.progress.filterAll, placed.length],
              ["done", t.progress.filterDone, doneCount],
              ["pending", t.progress.filterPending, placed.length - doneCount],
            ] as const
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={filter === key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-3.5 py-1.5 transition-colors ${
                filter === key ? "bg-maroon text-ivory shadow-sm" : "text-ink-soft hover:text-maroon"
              }`}
            >
              {label}
              <span className="ml-1.5 tabular-nums opacity-70">{hydrated ? count : "–"}</span>
            </button>
          ))}
        </div>
      </div>
      {locationError && <p className="mb-3 font-ui text-xs text-maroon">{locationError}</p>}

      <div className="relative">
        <div
          ref={containerRef}
          className="h-[65vh] min-h-[420px] w-full overflow-hidden rounded-md border border-sandstone-deep shadow-[0_10px_30px_-18px_rgba(42,31,26,0.45)]"
        />
        {/* Legend + progress overlay */}
        <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-col gap-2">
          <div className="pointer-events-auto rounded-md border border-sandstone-deep bg-ivory/95 px-3 py-2.5 font-ui text-xs shadow-md backdrop-blur">
            <p className="mb-1.5 font-semibold text-ink">
              {hydrated ? t.progress.countLabel(doneCount, placed.length) : t.progress.yatraProgress}
            </p>
            <div className="mb-2 h-1 w-44 overflow-hidden rounded-full bg-sandstone-deep/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold to-[#2f7d4f] transition-[width] duration-700"
                style={{ width: `${placed.length ? (doneCount / placed.length) * 100 : 0}%` }}
              />
            </div>
            <p className="flex items-center gap-2 text-ink-soft">
              <span className="tm-legend-dot tm-legend-dot--done">
                <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
              </span>
              {t.progress.legendDone}
            </p>
            <p className="mt-1 flex items-center gap-2 text-ink-soft">
              <span className="tm-legend-dot" />
              {t.progress.legendPending}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={fitAll}
          title="Fit"
          aria-label="Fit all temples"
          className="absolute right-3 top-3 z-[500] rounded-md border border-sandstone-deep bg-ivory/95 p-2 text-ink-soft shadow-md transition-colors hover:text-maroon"
        >
          <Maximize2 className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {nearby && nearby.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-3 font-display text-xl text-maroon">{nearbyHeadingLabel}</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {nearby.map((p) => {
              const detailHref = `/${lang}/tirtha/${p.slug}`;
              const directionsHref =
                p.maps_url ?? `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
              const place = [p.city, p.state].filter(Boolean).join(", ");
              return (
                <li
                  key={p.id}
                  className={`flex items-center justify-between gap-3 rounded-md border bg-ivory px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    completed.has(p.slug) ? "border-[#2f7d4f]/50" : "border-sandstone-deep"
                  }`}
                >
                  <div className="min-w-0">
                    <a href={detailHref} className="flex items-center gap-1.5 truncate font-ui text-sm font-medium text-maroon hover:underline">
                      {completed.has(p.slug) && (
                        <span className="tm-legend-dot tm-legend-dot--done shrink-0" title={t.progress.legendDone}>
                          <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                        </span>
                      )}
                      <span className="truncate">{p.title}</span>
                    </a>
                    <p className="truncate font-ui text-xs text-ink-soft">
                      {place ? `${place} · ` : ""}
                      {distanceAwayLabel(p.distanceKm.toFixed(1))}
                    </p>
                  </div>
                  <a
                    href={directionsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={getDirectionsLabel}
                    className="shrink-0 rounded-sm border border-sandstone-deep p-2 text-ink-soft hover:border-maroon hover:text-maroon"
                  >
                    <Navigation className="h-4 w-4" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
