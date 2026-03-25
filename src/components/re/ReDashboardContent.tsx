"use client";

import plantsData from "@/data/pennsylvania_re_data.json";
import { Plant } from "@/types/plant";
import { Box, Button, Typography } from "@mui/material";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import ReDashboardSidebar from "./ReDashboardSidebar";
import ReStatCards from "./ReStatCards";
import CheckIcon from "@mui/icons-material/Check";

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
if (!mapboxToken) {
  throw new Error("Mapbox access token is not defined");
}

interface FeatureProperties {
  fac_id_eia: string;
  eia_unit_id: string;
  plant_name: string;
  state: string;
  county: string;
  utility_name_eia_pudl: string;
  rto_name: string;
  total_plant_capacity: number;
  technology: string;
  capacity_mw: number;
  estimated_vc: number;
  capacity_factor: number;
  solar_crossover_year: string;
  wind_crossover_year: string;
  install_solar_capacity_mw_2030: number;
  install_wind_capacity_mw_2030: number;
  solar_lcoe_2024: number;
  wind_lcoe_2024: number;
  urban_area_perc: number;
}

interface UnitProperties {
  eia_unit_id: string;
  capacity_mw: number;
  estimated_vc: number;
  capacity_factor: number;
  solar_crossover_year?: string;
  wind_crossover_year?: string;
}

export default function ReDashboardContent({}) {
  const LAYER_ID = "pennsylvania_re_data-bcp7cj";
  const SOURCE_LAYER = "pennsylvania_re_data-bcp7cj";
  const SOURCE_URL = "mapbox://umedpl.8qha31cs";

  const [filters, setFilters] = useState<{ [key: string]: any }>({});

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<any | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapboxgl, setMapboxgl] = useState<any>(null);
  const [allPlants, setAllPlants] = useState<any[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [popupEventAdded, setPopupEventAdded] = useState(false);

  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const [isLoadingLayer, setIsLoadingLayer] = useState(false);
  const [currentSelectedPlant, setCurrentSelectedPlant] =
    useState<Plant | null>(null);

  const [defaultMapCenter] = useState<[number, number]>([-77.80, 40.88]);

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");
        setMapboxgl(mapboxgl.default);

        mapboxgl.default.accessToken = mapboxToken;

        const mapInstance = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/satellite-streets-v12",
          center: defaultMapCenter,
          zoom: 5.5,
        });

        mapInstance.on("load", () => {
          console.log("Map loaded successfully");

          // Add source
          mapInstance.addSource("power-plants", {
            type: "vector",
            url: SOURCE_URL,
          });

          // Add layer
          mapInstance.addLayer({
            id: LAYER_ID,
            type: "circle",
            source: "power-plants",
            "source-layer": SOURCE_LAYER,
            paint: {
              "circle-color": [
                "match",
                ["get", "technology"],
                "Solar",
                "hsla(18, 76%, 51%, 0.8)",
                "Wind",
                "hsla(245, 85%, 41%, 0.57)",
                "#000000",
              ],
              "circle-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                3,
                [
                  // At zoom level 3
                  "interpolate",
                  ["linear"],
                  ["get", "capacity_mw"],
                  10,
                  3, // Minimum size
                  1027,
                  8, // Maximum size
                ],
                10,
                [
                  // At zoom level 10
                  "interpolate",
                  ["linear"],
                  ["get", "capacity_mw"],
                  10,
                  6, // Larger minimum size at higher zoom
                  1027,
                  15, // Larger maximum size at higher zoom
                ],
                17,
                [
                  // At zoom level 17
                  "interpolate",
                  ["linear"],
                  ["get", "capacity_mw"],
                  10,
                  10, // Even larger minimum size at highest zoom
                  1027,
                  25, // Even larger maximum size at highest zoom
                ],
              ],
              "circle-stroke-width": 1,
              "circle-stroke-color": "white",
              "circle-stroke-opacity": 0.5,
            },
          });

          setMapLoaded(true);
        });

        // // Add source loading event handler
        // mapInstance.on("sourcedata", (e) => {
        //   if (e.sourceId === "power-plants" && e.isSourceLoaded) {
        //     setSourceLoaded(true);
        //     setTrackSourceDataChange(!trackSourceDataChange);
        //   }
        // });

        map.current = mapInstance;
      } catch (error) {
        console.error("Error loading Mapbox GL:", error);
        setMapError("Failed to load Mapbox GL");
      }
    };

    initializeMap();
  }, []);

  // When map loads, store all features
  useEffect(() => {
    if (!mapLoaded || !map.current) return;

    const loadAllFeatures = () => {
      console.log("loading features");
      const plants = plantsData.map((plant: any) => ({
        ...plant.properties,
        geometry: (plant as any).geometry,
      }));
      setAllPlants(plants);
      setFilteredPlants(plants);

      // const features = map.current.querySourceFeatures("power-plants", {
      //   sourceLayer: SOURCE_LAYER,
      // });

      // // Deduplicate features using composite key
      // const uniqueFeatures = new Map();
      // features.forEach((feature) => {
      //   if (!feature.properties) return;
      //   const key = `${feature.properties.fac_id_eia}_${feature.properties.eia_unit_id}`;
      //   if (!uniqueFeatures.has(key)) {
      //     uniqueFeatures.set(key, feature);
      //   }
      // });

      // const deduplicatedFeatures = Array.from(uniqueFeatures.values());

      // if (deduplicatedFeatures.length > 0) {
      //   setAllFeatures(deduplicatedFeatures);

      //   setAllPlants(deduplicatedFeatures.map((f) => f.properties));
      //   setFilteredPlants(deduplicatedFeatures.map((f) => f.properties));
      // } else {
      //   // If no features loaded, try again
      //   setTimeout(loadAllFeatures, 500);
      // }
    };

    loadAllFeatures();
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapLoaded || !map.current || !mapboxgl || popupEventAdded) return;

    map.current.on("click", LAYER_ID, (e: any) => {
      if (!e.features?.length) return;

      const clickedFeature = e.features[0];
      const fac_id_eia = clickedFeature.properties.fac_id_eia;

      // Query all units and deduplicate
      const allUnits = map.current.querySourceFeatures("power-plants", {
        sourceLayer: SOURCE_LAYER,
        filter: ["==", ["get", "fac_id_eia"], fac_id_eia],
      });

      // Deduplicate units
      const uniqueUnits = new Map();
      allUnits.forEach((unit: any) => {
        const key = `${unit.properties.fac_id_eia}_${unit.properties.eia_unit_id}`;
        if (!uniqueUnits.has(key)) {
          uniqueUnits.set(key, unit);
        }
      });

      // Calculate summed renewable capacities for the facility
      const facilityTotals = Array.from(uniqueUnits.values()).reduce(
        (acc, unit) => {
          acc.install_solar_capacity_mw_2030 +=
            Number(unit.properties.install_solar_capacity_mw_2030) || 0;
          acc.install_wind_capacity_mw_2030 +=
            Number(unit.properties.install_wind_capacity_mw_2030) || 0;
          return acc;
        },
        {
          install_solar_capacity_mw_2030: 0,
          install_wind_capacity_mw_2030: 0,
        }
      );

      // Group unique units by technology
      const unitsByTechnology = Array.from(uniqueUnits.values()).reduce(
        (acc, unit) => {
          const tech = unit.properties.technology;
          if (!acc[tech]) acc[tech] = [];
          acc[tech].push(unit.properties);
          return acc;
        },
        {}
      );

      const getCurrentCf = (clickedFeature: any) => {
        if (clickedFeature.properties.technology === "Wind") {
          return (clickedFeature.properties.current_cf || 0).toFixed(2) * 100;
        }

        if (clickedFeature.properties.technology === "Solar") {
          return (clickedFeature.properties.current_cf || 0).toFixed(2) * 100;
        }

        return (clickedFeature.properties.current_cf || 0).toFixed(2) * 100;
      };

      const popupContent = `
        <div class="popup-content" style="max-width: 400px;">
          <h3 style="color: #4fc3f7; margin-bottom: 10px;">${
            clickedFeature.properties.plant_name
          }</h3>
          
          <div class="popup-tabs">
            <button class="tab-button active" onclick="document.getElementById('overview-tab').style.display='block'; document.getElementById('surplus-tab').style.display='none'; this.classList.add('active'); this.nextElementSibling.classList.remove('active');">Overview</button>
            <button class="tab-button" onclick="document.getElementById('surplus-tab').style.display='block'; document.getElementById('overview-tab').style.display='none'; this.classList.add('active'); this.previousElementSibling.classList.remove('active');">Surplus</button>
          </div>

          <div id="overview-tab" class="tab-content" style="display: block;">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${
                  clickedFeature.properties.county
                }</span>
              </div>
              <div class="info-row">
                <span class="info-label">Owner:</span>
                <span class="info-value">${
                  clickedFeature.properties.owner || "N/A"
                }</span>
              </div>
              <div class="info-row">
                <span class="info-label">Total Plant Capacity:</span>
                <span class="info-value">${clickedFeature.properties.capacity_mw.toFixed(
                  1
                )} MW</span>
              </div>
            </div>
          </div>

          <div id="surplus-tab" class="tab-content" style="display: none;">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label" style="max-width: 130px;">Solar Integration Potential:</span>
                <span class="info-value">${clickedFeature.properties.optimal_solar_mw.toFixed(
                  1
                )} MW</span>
              </div>
              <div class="info-row">
                <span class="info-label">Wind Integration Potential:</span>
                <span class="info-value">${clickedFeature.properties.optimal_wind_mw.toFixed(
                  1
                )} MW</span>
              </div>
              <div class="info-row">
                <span class="info-label">Storage Integration Potential:</span>
                <span class="info-value">${clickedFeature.properties.optimal_battery_mw.toFixed(
                  1
                )} MW</span>
              </div>
              <div class="info-row">
                <span class="info-label">Storage Integration Potential:</span>
                <span class="info-value">${clickedFeature.properties.optimal_battery_mwh.toFixed(
                  1
                )} MWh</span>
              </div>
              <div class="info-row">
                <span class="info-label">Current CF</span>
                <span class="info-value">${getCurrentCf(
                  clickedFeature
                )} %</span>
              </div>
              <div class="info-row">
                <span class="info-label">Potential IC Utilisation:</span>
                <span class="info-value">${
                  clickedFeature.properties.optimal_cf.toFixed(2) * 100
                } %</span>
              </div>
              <div class="info-row">
                <span class="info-label">Solar LCOE (2025):</span>
                <span class="info-value">${clickedFeature.properties.solar_lcoe_2025_wIRA.toFixed(
                  2
                )} $/MWh</span>
              </div>
              <div class="info-row">
                <span class="info-label">Wind LCOE (2025):</span>
                <span class="info-value">${clickedFeature.properties.wind_lcoe_2025_wIRA.toFixed(
                  2
                )} $/MWh</span>
              </div>
            </div>
          </div>
        </div>
      `;

      new mapboxgl.Popup({
        maxWidth: "400px",
        className: "custom-popup",
      })
        .setLngLat(e.lngLat)
        .setHTML(popupContent)
        .addTo(map.current);
    });

    map.current.on("mouseenter", LAYER_ID, () => {
      map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", LAYER_ID, () => {
      map.current.getCanvas().style.cursor = "";
    });

    setPopupEventAdded(true);
  }, [mapLoaded, mapboxgl, popupEventAdded]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        console.log("Map container size:", entry.contentRect);
      }
    });

    observer.observe(mapContainer.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const solidGrey = "#808080"; // Solid grey color

  const sidebarBgColor = "rgba(255, 255, 255, 0.1)"; // Light, semi-transparent background
  const textColor = "#ffffff"; // White text for contrast
  const accentColor = "#4fc3f7"; // Light blue for accents

  // const handleFilterChange = (filterName: string, value: string | boolean) => {
  //   if (!map.current) return;

  //   const newFilters = {
  //     ...filters,
  //     [filterName]: value,
  //   };

  //   try {
  //     // Apply filter to map
  //     const filterExpression: mapboxgl.Expression = ["all"];
  //     Object.entries(newFilters).forEach(([key, val]) => {
  //       if (val && key !== "removeUrbanAreaPlants") {
  //         filterExpression.push(["==", ["get", key], val]);
  //       }
  //     });
  //     if (newFilters.removeUrbanAreaPlants === true) {
  //       filterExpression.push(["<", ["get", "urban_area_perc"], 30]);
  //     }
  //     map.current.setFilter(LAYER_ID, filterExpression);

  //     // Filter from stored features
  //     const uniqueFilteredFeatures = new Map();
  //     allFeatures.forEach((feature) => {
  //       if (!feature.properties) return;

  //       // Check filters
  //       for (const [key, val] of Object.entries(newFilters)) {
  //         if (val && key !== "removeUrbanAreaPlants") {
  //           if (feature.properties[key] !== val) return;
  //         }
  //       }

  //       if (newFilters.removeUrbanAreaPlants === true) {
  //         if (
  //           !feature.properties.urban_area_perc ||
  //           feature.properties.urban_area_perc >= 30
  //         )
  //           return;
  //       }

  //       const key = `${feature.properties.fac_id_eia}_${feature.properties.eia_unit_id}`;
  //       if (!uniqueFilteredFeatures.has(key)) {
  //         uniqueFilteredFeatures.set(key, feature);
  //       }
  //     });

  //     // Update plant data
  //     const filteredFeatures = Array.from(uniqueFilteredFeatures.values());
  //     setFilteredPlants(filteredFeatures.map((f) => f.properties));

  //     // Handle map bounds
  //     if (typeof value !== "boolean" && value && filteredFeatures.length > 0) {
  //       const bounds = new mapboxgl.LngLatBounds();
  //       filteredFeatures.forEach((feature) => {
  //         if (feature.geometry?.coordinates) {
  //           bounds.extend(feature.geometry.coordinates);
  //         }
  //       });

  //       // Adjust padding based on filter type
  //       const padding =
  //         filterName === "plant_name"
  //           ? {
  //               top: 400, // Increased top padding to move plant up
  //               bottom: 100, // Reduced bottom padding to balance
  //               left: 200, // Keep equal horizontal padding
  //               right: 200,
  //             }
  //           : {
  //               top: 50,
  //               bottom: 150,
  //               left: 358,
  //               right: 50,
  //             };

  //       map.current.fitBounds(bounds, {
  //         padding,
  //         maxZoom: filterName === "plant_name" ? 16 : 10,
  //         duration: 1500,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error during filter change:", error);
  //   }

  //   setFilters(newFilters);
  // };

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    if (!map.current) return;

    const newFilters: {
      [key: string]: any;
    } = {
      ...filters,
      [filterName]: value,
    };

    try {
      // Apply filter to map
      const filterExpression: mapboxgl.Expression = ["all"];
      Object.entries(newFilters).forEach(([key, val]) => {
        if (val && key !== "removeUrbanAreaPlants") {
          filterExpression.push(["==", ["get", key], val]);
        }
      });
      if (newFilters.removeUrbanAreaPlants === true) {
        filterExpression.push(["<", ["get", "urban_area_perc"], 30]);
      }

      console.log("Filter expression:", filterExpression);
      map.current.setFilter(LAYER_ID, filterExpression);

      // Filter directly from plants data
      const uniqueFilteredPlants = new Map();
      allPlants.forEach((plant: any) => {
        if (!plant) return;

        // Check filters
        for (const [key, val] of Object.entries(newFilters)) {
          if (val && key !== "removeUrbanAreaPlants") {
            if (plant[key] !== val) return;
          }
        }

        if (newFilters.removeUrbanAreaPlants === true) {
          if (!plant.urban_area_perc || plant.urban_area_perc >= 30) return;
        }

        const key = `${plant.fac_id_eia}_${plant.eia_unit_id}`;
        if (!uniqueFilteredPlants.has(key)) {
          uniqueFilteredPlants.set(key, plant);
        }
      });

      // Update filtered plant data
      const filteredPlants = Array.from(uniqueFilteredPlants.values());
      setFilteredPlants(filteredPlants);

      // Handle map bounds
      if (typeof value !== "boolean" && value && filteredPlants.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        filteredPlants.forEach((plant) => {
          if (plant.geometry?.coordinates) {
            bounds.extend(plant.geometry.coordinates);
          }
        });

        // Adjust padding based on filter type
        const padding =
          filterName === "plant_name"
            ? {
                top: 400, // Increased top padding to move plant up
                bottom: 100, // Reduced bottom padding to balance
                left: 200, // Keep equal horizontal padding
                right: 200,
              }
            : {
                top: 50,
                bottom: 150,
                left: 358,
                right: 50,
              };

        map.current.fitBounds(bounds, {
          padding,
          maxZoom: filterName === "plant_name" ? 16 : 10,
          duration: 1500,
        });
      }

      if (filterName === "plant_name" && !value) {
        setCurrentSelectedPlant(null);
      }
    } catch (error) {
      console.error("Error during filter change:", error);
    }

    setFilters(newFilters);
  };

  const handleReset = () => {
    if (!map.current) return;

    // Clear all filters
    setFilters({});

    // Reset map filter
    map.current.setFilter(LAYER_ID, null);

    // Reset map view
    map.current.flyTo({
      center: defaultMapCenter,
      zoom: 5.5,
      duration: 1500,
    });

    // Reset plant data to show all plants
    setAllPlants((val) => {
      setFilteredPlants(val);
      return val;
    });

    const existingSource = map.current.getSource("selected-plant-layer");
    if (existingSource) {
      map.current.removeLayer("selected-plant-layer");
      map.current.removeSource("selected-plant-layer");
      setIsLayerVisible(false);
    }

    setCurrentSelectedPlant(null);
  };

  // Update the popup styles
  const popupStyles = `
    .custom-popup {
      background-color: rgba(0, 0, 0, 0.8) !important;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }
    .custom-popup .mapboxgl-popup-content {
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 15px;
      max-height: 400px;
      overflow-y: auto;
    }
    .custom-popup .mapboxgl-popup-tip {
      border-top-color: rgba(0, 0, 0, 0.8);
    }
    .popup-tabs {
      display: flex;
      margin-bottom: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }
    .tab-button {
      background: none;
      border: none;
      color: white;
      padding: 8px 12px;
      cursor: pointer;
      flex: 1;
      font-size: 0.9rem;
      opacity: 0.7;
      transition: all 0.3s ease;
    }
    .tab-button:hover {
      opacity: 1;
    }
    .tab-button.active {
      color: #4fc3f7;
      opacity: 1;
      border-bottom: 2px solid #4fc3f7;
    }
    .tab-content {
      padding: 10px 0;
    }
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px dotted rgba(255, 255, 255, 0.1);
      padding-bottom: 4px;
    }
    .info-label {
      color: #4fc3f7;
      font-weight: bold;
      margin-right: 8px;
      white-space: nowrap;
    }
    .info-value {
      text-align: right;
      word-break: break-word;
    }
    .unit-section {
      margin-bottom: 15px;
    }
    .unit-section:last-child {
      margin-bottom: 0;
    }
    .unit-info {
      margin-bottom: 10px;
      padding-left: 10px;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
    }
    .unit-info:last-child {
      margin-bottom: 0;
    }
  `;

  // Add the styles to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = popupStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // const handleAddLayer = () => {
  //   if (!map.current) return;

  //   const selectedPlant = filteredPlants[0]; // Assuming the first filtered plant is selected
  //   if (!selectedPlant) return;

  //   console.log("Selected plant:", selectedPlant);

  //   const s3Url = `https://etaiplatform.s3.us-west-2.amazonaws.com/existing_re/${selectedPlant.technology.toLowerCase()}/facility_siting_outputs/visual_geojson/${
  //     selectedPlant.fac_id_eia
  //   }_visual.geojson`;

  //   const existingSource = map.current.getSource("selected-plant-layer");

  //   if (existingSource) {
  //     map.current.removeLayer("selected-plant-layer");
  //     map.current.removeSource("selected-plant-layer");
  //   }

  //   map.current.addSource("selected-plant-layer", {
  //     type: "geojson",
  //     data: s3Url,
  //   });

  //   map.current.addLayer({
  //     id: "selected-plant-layer",
  //     type: "fill",
  //     source: "selected-plant-layer",
  //     paint: {
  //       // "fill-color": "#888888",
  //       // "fill-opacity": 0.4,
  //       "fill-color": [
  //         "match",
  //         ["get", "polygon_type"],
  //         "Sensitive Habitat",
  //         "rgba(0, 128, 0, 0.744)", // Green with 74.4% opacity
  //         "Permanent Water/Ice Covered",
  //         "rgba(0, 0, 255, 0.744)", // Blue with 74.4% opacity
  //         "Urban Area",
  //         "rgba(255, 0, 0, 0.744)", // Red with 74.4% opacity
  //         "Unfavorable Topography",
  //         "rgba(255, 255, 0, 0.744)", // Yellow with 74.4% opacity
  //         "Buildable",
  //         "rgba(128, 0, 128, 0.744)", // Purple with 74.4% opacity
  //         "rgba(128, 128, 128, 0.744)", // Default color (gray) with 74.4% opacity
  //       ],
  //       "fill-opacity": 0.744,
  //     },
  //   });
  // };

  const handleAddLayer = async () => {
    if (!map.current) return;

    const selectedPlant = filteredPlants[0]; // Assuming the first filtered plant is selected
    if (!selectedPlant) return;

    console.log("Selected plant:", selectedPlant);

    const s3Url = `https://etaiplatform.s3.us-west-2.amazonaws.com/existing_re/${selectedPlant.technology.toLowerCase()}/facility_siting_outputs/visual_geojson/${
      selectedPlant.fac_id_eia
    }_visual.geojson`;

    const existingSource = map.current.getSource("selected-plant-layer");

    if (existingSource) {
      map.current.removeLayer("selected-plant-layer");
      map.current.removeSource("selected-plant-layer");
      setIsLayerVisible(false);
      return;
    }

    setIsLoadingLayer(true);

    map.current.addSource("selected-plant-layer", {
      type: "geojson",
      data: s3Url,
    });

    map.current.addLayer({
      id: "selected-plant-layer",
      type: "fill",
      source: "selected-plant-layer",
      paint: {
        "fill-color": [
          "match",
          ["get", "polygon_type"],
          "Sensitive Habitat",
          "rgba(0, 128, 0, 0.744)", // Green with 74.4% opacity
          "Permanent Water/Ice Covered",
          "rgba(0, 0, 255, 0.744)", // Blue with 74.4% opacity
          "Urban Area",
          "rgba(255, 0, 0, 0.744)", // Red with 74.4% opacity
          "Unfavorable Topography",
          "rgba(255, 255, 0, 0.744)", // Yellow with 74.4% opacity
          "Buildable",
          "rgba(128, 0, 128, 0.744)", // Purple with 74.4% opacity
          "rgba(128, 128, 128, 0.744)", // Default color (gray) with 74.4% opacity
        ],
        "fill-opacity": 0.744,
      },
    });

    map.current.on("sourcedata", (e: any) => {
      if (e.sourceId === "selected-plant-layer" && e.isSourceLoaded) {
        setIsLoadingLayer(false);
        setIsLayerVisible(true);
        map.current.flyTo({
          center: selectedPlant.geometry.coordinates,
          zoom: 10,
        });
      }
    });
  };

  useEffect(() => {
    if (!map.current) return;

    if (currentSelectedPlant !== null) {
      const existingSource = map.current.getSource("selected-plant-layer");

      if (existingSource) {
        map.current.removeLayer("selected-plant-layer");
        map.current.removeSource("selected-plant-layer");
        setIsLayerVisible(false);
      }
    } else {
      if (isLayerVisible) {
        map.current.removeLayer("selected-plant-layer");
        map.current.removeSource("selected-plant-layer");
        setIsLayerVisible(false);
      }
    }
  }, [currentSelectedPlant]);

  useEffect(() => {
    if (!map.current) {
      return;
    }

    if (filters.plant_name) {
      console.log("plant selected:", filters.plant_name);

      const selectedPlant = filteredPlants[0];
      if (currentSelectedPlant) {
        if (selectedPlant.fac_id_eia !== currentSelectedPlant.fac_id_eia) {
          setCurrentSelectedPlant(selectedPlant);
        }
      } else {
        setCurrentSelectedPlant(selectedPlant);
      }
    }
  }, [filters]);

  return (
    <Box sx={{ height: "100%", width: "100%", position: "relative" }}>
      {/* Map Container */}
      <Box
        ref={mapContainer}
        sx={{
          height: { xs: "60vh", md: "100%" },
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />

      {/* Color Legend */}
      {/* {currentSelectedPlant && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            position: "absolute",
            bottom: { xs: "41vh", md: 140 },
            right: "50%",
            borderRadius: "8px",
            color: "#ffffff",
            zIndex: 1,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLayer}
            disabled={isLoadingLayer}
            sx={{
              alignSelf: "center",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {isLoadingLayer
              ? "Loading..."
              : isLayerVisible
              ? "Hide Land Use Data"
              : "Show Land Use Data"}
          </Button>
        </Box>
      )} */}

      {filters.plant_name && filteredPlants.length === 1 && isLayerVisible && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            position: "absolute",
            top: 0,
            right: 280,
            borderRadius: "8px",
            color: "#ffffff",
            zIndex: 1,
          }}
        >
          <Box
            sx={{
              border: "1px solid rgba(255, 255, 255, 0.2)",
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              width: "300px",
              padding: 2,
            }}
          >
            {[
              {
                tech: "Sensitive Habitat",
                label: "Sensitive Habitat",
                color: "rgba(0, 128, 0, 0.744)",
              },
              {
                tech: "Permanent Water/Ice Covered",
                label: "Permanent Water/Ice Covered",
                color: "rgba(0, 0, 255, 0.744)",
              },
              {
                tech: "Urban Area",
                label: "Urban Area",
                color: "rgba(255, 0, 0, 0.744)",
              },
              {
                tech: "Unfavorable Topography",
                label: "Unfavorable Topography",
                color: "rgba(255, 255, 0, 0.744)",
              },
              {
                tech: "Buildable",
                label: "Buildable",
                color: "rgba(128, 0, 128, 0.744)",
              },
              {
                tech: "Other",
                label: "Other",
                color: "rgba(128, 128, 128, 0.744)",
              },
            ].map(({ tech, label, color }) => (
              <Box
                key={tech}
                sx={{ display: "flex", alignItems: "center", mb: 1 }}
              >
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    backgroundColor: color,
                    marginRight: 1,
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                  }}
                />
                <Typography variant="body2" sx={{ color: "white" }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          position: "absolute",
          bottom: 50,
          right: 310,
          borderRadius: "8px",
          color: "#ffffff",
          zIndex: 1,
        }}
      >
        {filters.plant_name && filteredPlants.length === 1 && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddLayer}
            disabled={isLoadingLayer}
            sx={{
              alignSelf: "center",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {isLoadingLayer
              ? "Loading..."
              : isLayerVisible
              ? "Hide Land Use"
              : "Show Land Use"}
          </Button>
        )}
      </Box>

      {/* Mobile Layout - Only Filters */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          height: "40vh",
          overflowY: "auto",
          bgcolor: "rgba(0, 0, 0, 0.7)",
          p: 2,
        }}
      >
        <ReDashboardSidebar
          filters={filters}
          setFilters={setFilters}
          plantData={{
            all: plantsData,
            filtered: filteredPlants,
          }}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </Box>

      {/* Desktop Layout - Original Sidebar */}
      <Box
        sx={{
          display: { xs: "none", md: "block" },
          position: "absolute",
          top: 150,
          left: 16,
          width: "308px",
          maxHeight: "calc(100% - 180px)",
          borderRadius: "8px",
          padding: 2,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#ffffff",
          backdropFilter: "blur(5px)",
          overflowY: "auto",
          zIndex: 1,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <ReDashboardSidebar
          filters={filters}
          setFilters={setFilters}
          plantData={{
            all: allPlants,
            filtered: filteredPlants,
          }}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
        />
      </Box>

      {/* Desktop Stats - Original Layout */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          position: "absolute",
          top: 0,
          right: 0,
          width: "280px",
          height: "100%",
          borderRadius: "8px",
          padding: 2,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(5px)",
          zIndex: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "white",
            mb: 2,
            borderBottom: "2px solid rgba(255, 255, 255, 0.5)",
          }}
        >
          Results
        </Typography>
        <ReStatCards plants={filteredPlants} />
        <Box
          sx={{
            bottom: 0,
            alignSelf: "center",
            width: "100%",
            borderRadius: "8px",
            padding: 2,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "#ffffff",
            zIndex: 1,
            border: "1px solid rgba(255, 255, 255, 0.2)",
            mb: 4,
          }}
        >
          {[
            {
              tech: "Solar",
              label: "Solar",
              color: "hsla(18, 76%, 51%, 0.8)",
            },
            { tech: "Wind", label: "Wind", color: "hsla(245, 85%, 41%, 0.57)" },
          ].map(({ tech, label, color }) => (
            <Box
              key={tech}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  backgroundColor: color,
                  marginRight: 1,
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              />
              <Typography variant="body2" sx={{ color: "white" }}>
                {label}
              </Typography>
              {currentSelectedPlant &&
                currentSelectedPlant.technology === tech && (
                  <CheckIcon
                    sx={{
                      marginLeft: "auto",
                      color: "white",
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                    }}
                  />
                )}
            </Box>
          ))}
        </Box>
      </Box>

      {mapError && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(0, 0, 0, 0.8)",
            color: "#ff6b6b",
            borderRadius: "8px",
            padding: 2,
            border: "1px solid #ff6b6b",
          }}
        >
          <Typography color="error">Error loading map: {mapError}</Typography>
        </Box>
      )}
    </Box>
  );
}
