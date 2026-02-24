import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Polygon {
  id: string;
  name: string;
  geojson: string;
  color: string;
}

interface LocationMapProps {
  polygons?: Polygon[];
  /** Single GeoJSON string for detail view */
  geometry?: string | null;
  /** Center if no geometry */
  center?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  editable?: boolean;
  drawMode?: boolean;
  onPolygonClick?: (id: string) => void;
  onGeometryChange?: (geojson: string) => void;
  onDrawComplete?: (geojson: string) => void;
  onCancelDraw?: () => void;
}

const PALETTE = [
  "#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
];

const LocationMap = ({
  polygons = [],
  geometry,
  center = [40, -3],
  zoom = 6,
  height = "100%",
  className = "",
  editable = false,
  drawMode = false,
  onPolygonClick,
  onGeometryChange,
  onDrawComplete,
  onCancelDraw,
}: LocationMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);
  const drawLayerRef = useRef<L.Polygon | null>(null);
  const drawPointsRef = useRef<L.LatLng[]>([]);
  const drawMarkersRef = useRef<L.CircleMarker[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    const layers = L.layerGroup().addTo(map);
    mapRef.current = map;
    layersRef.current = layers;

    return () => {
      map.remove();
      mapRef.current = null;
      layersRef.current = null;
    };
  }, []);

  // Render polygons (list view)
  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!map || !layers) return;

    layers.clearLayers();

    if (polygons.length > 0) {
      const bounds = L.latLngBounds([]);

      polygons.forEach((p, i) => {
        try {
          const geo = JSON.parse(p.geojson);
          const color = p.color || PALETTE[i % PALETTE.length];
          const layer = L.geoJSON(geo, {
            style: { color, fillColor: color, fillOpacity: 0.25, weight: 2 },
          });

          layer.bindTooltip(p.name, { sticky: true, className: "leaflet-tooltip-custom" });

          layer.bindPopup(`
            <div style="min-width:120px">
              <strong style="font-size:13px">${p.name}</strong>
              <br/>
              <button onclick="window.__locationMapEdit__('${p.id}')" 
                style="margin-top:6px;padding:3px 10px;font-size:11px;background:#3b82f6;color:#fff;border:none;border-radius:4px;cursor:pointer">
                Edit
              </button>
            </div>
          `);

          layer.addTo(layers);
          bounds.extend(layer.getBounds());
        } catch {}
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      }
    }

    // Single geometry (detail view)
    if (geometry) {
      try {
        const geo = JSON.parse(geometry);
        const layer = L.geoJSON(geo, {
          style: { color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.2, weight: 2 },
        });
        layer.addTo(layers);
        const b = layer.getBounds();
        if (b.isValid()) map.fitBounds(b, { padding: [40, 40], maxZoom: 15 });
      } catch {}
    }

    if (!geometry && polygons.length === 0) {
      map.setView(center, zoom);
    }
  }, [polygons, geometry, center, zoom]);

  // Popup click handler
  useEffect(() => {
    (window as any).__locationMapEdit__ = (id: string) => {
      onPolygonClick?.(id);
    };
    return () => {
      delete (window as any).__locationMapEdit__;
    };
  }, [onPolygonClick]);

  // Draw mode
  const startDrawing = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    setIsDrawing(true);
    drawPointsRef.current = [];
    drawMarkersRef.current.forEach((m) => m.remove());
    drawMarkersRef.current = [];
    if (drawLayerRef.current) {
      drawLayerRef.current.remove();
      drawLayerRef.current = null;
    }

    map.getContainer().style.cursor = "crosshair";

    const onClick = (e: L.LeafletMouseEvent) => {
      const pt = e.latlng;
      drawPointsRef.current.push(pt);

      const marker = L.circleMarker(pt, {
        radius: 5,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 1,
      }).addTo(map);
      drawMarkersRef.current.push(marker);

      if (drawPointsRef.current.length >= 2) {
        if (drawLayerRef.current) drawLayerRef.current.remove();
        drawLayerRef.current = L.polygon(drawPointsRef.current, {
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.2,
          weight: 2,
          dashArray: "5,5",
        }).addTo(map);
      }
    };

    const onDblClick = (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e as any);
      L.DomEvent.preventDefault(e as any);
      finishDrawing();
    };

    const finishDrawing = () => {
      map.off("click", onClick);
      map.off("dblclick", onDblClick);
      map.getContainer().style.cursor = "";
      setIsDrawing(false);

      drawMarkersRef.current.forEach((m) => m.remove());
      drawMarkersRef.current = [];

      if (drawPointsRef.current.length >= 3) {
        const coords = drawPointsRef.current.map((p) => [p.lng, p.lat]);
        coords.push(coords[0]); // close ring
        const geojson = JSON.stringify({
          type: "Polygon",
          coordinates: [coords],
        });

        if (drawLayerRef.current) drawLayerRef.current.remove();
        drawLayerRef.current = null;

        onDrawComplete?.(geojson);
      } else {
        if (drawLayerRef.current) {
          drawLayerRef.current.remove();
          drawLayerRef.current = null;
        }
        onCancelDraw?.();
      }
    };

    map.on("click", onClick);
    map.on("dblclick", onDblClick);
  }, [onDrawComplete, onCancelDraw]);

  useEffect(() => {
    if (drawMode) startDrawing();
  }, [drawMode, startDrawing]);

  return (
    <div
      ref={containerRef}
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ height, minHeight: 200 }}
    />
  );
};

export default LocationMap;
