"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Locate, Navigation } from "lucide-react";
import type { TirthaMapPoint } from "@/lib/types";
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

  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearby, setNearby] = useState<NearbyEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      leafletRef.current = L;

      // Default Leaflet marker icon URLs assume a bundler that copies the
      // image assets alongside the JS; Next.js doesn't, so point at a CDN
      // that serves the exact same Leaflet-release icons instead.
      const icon = L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

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

      const bounds: [number, number][] = [];
      for (const p of points) {
        if (p.latitude == null || p.longitude == null) continue;
        bounds.push([p.latitude, p.longitude]);
        const marker = L.marker([p.latitude, p.longitude], { icon }).addTo(map);
        const place = [p.city, p.state].filter(Boolean).join(", ");
        const detailHref = `/${lang}/tirtha/${p.slug}`;
        const directionsHref =
          p.maps_url ?? `https://www.google.com/maps/search/?api=1&query=${p.latitude},${p.longitude}`;
        marker.bindPopup(
          `<div style="font-family:inherit;min-width:180px">
            <a href="${detailHref}" style="font-weight:600;color:#7a1f2b;text-decoration:none">${escapeHtml(p.title)}</a>
            ${place ? `<div style="font-size:12px;color:#6b6058;margin-top:2px">${escapeHtml(place)}</div>` : ""}
            <a href="${directionsHref}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block;margin-top:6px;font-size:12px;color:#7a1f2b;text-decoration:underline">
               ${escapeHtml(getDirectionsLabel)}
            </a>
          </div>`,
        );
      }
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
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- points/lang/label are stable per page load
  }, []);

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
      <div className="mb-4">
        <button
          type="button"
          onClick={findNearby}
          disabled={locating}
          className="inline-flex items-center gap-2 rounded-sm bg-maroon px-4 py-2 font-ui text-sm font-medium text-ivory transition-colors hover:bg-maroon-deep disabled:opacity-60"
        >
          <Locate className="h-4 w-4" aria-hidden />
          {locating ? locatingLabel : findNearbyLabel}
        </button>
        {locationError && <p className="mt-2 font-ui text-xs text-maroon">{locationError}</p>}
      </div>

      <div ref={containerRef} className="h-[65vh] w-full rounded-sm border border-sandstone-deep" />

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
                  className="flex items-center justify-between gap-3 rounded-sm border border-sandstone-deep bg-ivory px-4 py-3"
                >
                  <div className="min-w-0">
                    <a href={detailHref} className="block truncate font-ui text-sm font-medium text-maroon hover:underline">
                      {p.title}
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
