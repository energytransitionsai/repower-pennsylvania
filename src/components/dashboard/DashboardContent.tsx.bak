"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DashboardContentProps } from "./dashboard.types";

export default function DashboardContent({
  mapboxToken,
  mapOptions,
  sourceConfig,
  layerConfig,
  data,
  filters,
  onFilterChange,
  onReset,
}: DashboardContentProps) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [popupEventAdded, setPopupEventAdded] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initializeMap = async () => {
      try {
        mapboxgl.accessToken = mapboxToken;

        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current!,
          ...mapOptions,
        });

        mapInstance.on("load", () => {
          mapInstance.addSource(sourceConfig.sourceId, {
            type: "vector",
            url: sourceConfig.sourceUrl,
          });

          mapInstance.addLayer({
            id: layerConfig.layerId,
            type: "circle",
            source: sourceConfig.sourceId,
            "source-layer": sourceConfig.sourceLayer,
            paint: layerConfig.paint,
          });

          setMapLoaded(true);
        });

        map.current = mapInstance;
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();
  }, [mapboxToken, mapOptions, sourceConfig, layerConfig]);

  useEffect(() => {
    if (!mapLoaded || !map.current || popupEventAdded) return;

    map.current.on("click", layerConfig.layerId, (e) => {
      if (!e.features?.length) return;

      const clickedFeature = e.features[0];
      const popupContent = `
        <div>
          <h3>${clickedFeature.properties.plant_name}</h3>
          <p>Capacity: ${clickedFeature.properties.total_plant_capacity} MW</p>
        </div>
      `;

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map.current);
    });

    map.current.on("mouseenter", layerConfig.layerId, () => {
      map.current!.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", layerConfig.layerId, () => {
      map.current!.getCanvas().style.cursor = "";
    });

    setPopupEventAdded(true);
  }, [mapLoaded, layerConfig.layerId, popupEventAdded]);

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    if (!map.current) return;

    const newFilters = { ...filters, [filterName]: value };

    const filterExpression: mapboxgl.Expression = ["all"];
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        filterExpression.push(["==", ["get", key], val]);
      }
    });

    map.current.setFilter(layerConfig.layerId, filterExpression);

    onFilterChange(filterName, value);
  };

  const handleReset = () => {
    if (!map.current) return;

    map.current.setFilter(layerConfig.layerId, null);
    onReset();
  };

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 1,
          padding: "8px 12px",
          backgroundColor: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Reset Filters
      </button>
    </div>
  );
}
