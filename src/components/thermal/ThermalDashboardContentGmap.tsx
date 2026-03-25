"use client";

import plantsData from "@/data/pennsylvania_thermal_data.json";
import { Plant } from "@/types/plant";
import CheckIcon from "@mui/icons-material/Check";
import { Box, Button, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useGoogleMap } from "../hooks/useGoogleMap";
import ThermalDashboardSidebar from "./ThermalDashboardSidebar";
import ThermalStatCards from "./ThermalStatCards";


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

export default function ThermalDashboardContentGmap({}) {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const [defaultMapId] = useState("181f71e9733811c528a5235f");
  const [defaultMapZoom] = useState(7);
  const [defaultMapCenter] = useState<google.maps.LatLngLiteral>({
    lng: -77.80,
    lat: 40.88,
  });

  const { gMap, mapLoaded, googlemaps, mapError } = useGoogleMap({
    mapContainer,
    defaultCenter: defaultMapCenter,
    defaultZoom: defaultMapZoom,
    mapId: defaultMapId,
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY!,
  });

  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [allPlants, setAllPlants] = useState<any[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [popupEventAdded, setPopupEventAdded] = useState(false);

  const [currentSelectedPlant, setCurrentSelectedPlant] =
    useState<Plant | null>(null);

  const [dataGeoJson, setGeoData] = useState<any>(null);
  const [dataBoundaryGeoJson, setBoundaryGeoData] = useState<any>(null);

  const [isVisualLayerVisible, setIsVisualLayerVisible] = useState(false);
  const [isVisualLayerLoading, setIsVisualLayerLoading] = useState(false);
  const [isVisualLayerAvailable, setIsVisualLayerAvailable] = useState(false);

  const [visualLayerPolygons, setVisualLayerPolygons] = useState<
    google.maps.Polygon[]
  >([]);

  useEffect(() => {
    fetch("/data/pennsylvania_thermal_data.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched geojson data:", data);
        setGeoData(data);
      });

    fetch("/data/pennsylvania_map_boundary.geojson")
      .then((res) => res.json())
      .then((data) => {
        console.log("fetched boundary geojson data:", data);
        setBoundaryGeoData(data);
      });
  }, []);

  useEffect(() => {
    if (!mapLoaded || !gMap.current) return;

    const loadMarkers = async () => {
      gMap.current.data.addGeoJson(dataGeoJson, {
        // idPropertyName: "fac_id_eia",
      });
      // Mark features as part of the custom layer for easy removal

      gMap.current.data.forEach((feature) => {
        feature.setProperty("isPlant", true);
      });

      gMap.current.data.addGeoJson(dataBoundaryGeoJson);
      gMap.current.data.forEach((feature) => {
        const isPlant = feature.getProperty("isPlant");
        if (isPlant === true) {
          return;
        }
        feature.setProperty("isPlant", false);
        feature.setProperty("isBoundary", true);
      });

      gMap.current.data.setStyle((feature) => {
        // console.log("feature:", feature);
        if (feature.getProperty("isBoundary") === true) {
          return {
            fillColor: "transparent",
            strokeWeight: 2,
          };
        }

        if (feature.getProperty("isPlant") === false) {
          return null;
        }

        const technology = feature.getProperty("technology");
        let color = "#000000";
        if (technology === "gas_ct") color = "hsla(0, 67%, 52%, 0.44)";
        if (technology === "gas_ccgt") color = "hsla(0, 71%, 52%, 0.48)";
        if (technology === "ogs") color = "hsla(245, 85%, 41%, 0.57)";

        const isPlant = !!feature.getProperty("fac_id_eia");
        if (!isPlant) {
          return {
            cursor: "hand",
          };
        }

        const zoom = gMap.current.getZoom();
        const capacity_mw = parseInt(
          feature.getProperty("capacity_mw") as string
        );
        const baseScale = capacity_mw > 500 ? 12 : 6;

        gMap.current.addListener("zoom_changed", () => {
          const scale = Math.min(
            baseScale * Math.pow(1.3, zoom - defaultMapZoom),
            10
          );
          gMap.current.data.overrideStyle(feature, {
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: scale, // Adjust based on capacity_mw if needed
              fillColor: color,
              fillOpacity: 1,
              strokeColor: "white",
              strokeOpacity: 0.5,
              strokeWeight: 1,
            },
          });
        });

        return {
          visible: true,
          clickable: true,
          cursor: "pointer",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: baseScale, // Adjust based on capacity_mw if needed
            fillColor: color,
            fillOpacity: 1,
            strokeColor: "white",
            strokeOpacity: 0.5,
            strokeWeight: 1,
          },
        } as google.maps.Data.StyleOptions;
      });
    };

    loadMarkers();
  }, [gMap, mapLoaded, dataGeoJson, dataBoundaryGeoJson]);

  useEffect(() => {
    if (!mapLoaded || !gMap.current) return;

    const loadAllFeatures = () => {
      console.log("loading features");
      const plants = plantsData.map((plant: any) => ({
        ...plant.properties,
        geometry: (plant as any).geometry,
      }));
      setAllPlants(plants);
      setFilteredPlants(plants);
    };

    loadAllFeatures();
  }, [mapLoaded]);

  const getCurrentCf = (feature: google.maps.Data.Feature) => {
    const current_cf = (feature.getProperty("current_cf") as number) || 0;
    return (current_cf * 100).toFixed(2);
  };

  const getUnitAnalysis = (feature: google.maps.Data.Feature) => {
    const fac_id_eia = feature.getProperty("fac_id_eia");

    // Query all units and deduplicate
    const allUnits: google.maps.Data.Feature[] = [];

    gMap.current.data.forEach((feature) => {
      const isPlant = feature.getProperty("isPlant");
      if (!isPlant) {
        return;
      }

      if (feature.getProperty("fac_id_eia") === fac_id_eia) {
        allUnits.push(feature);
      }
    });

    // Deduplicate units
    const uniqueUnits = new Map<string, google.maps.Data.Feature>();
    allUnits.forEach((unit) => {
      const fac_id_eia = unit.getProperty("fac_id_eia");
      const eia_unit_id = unit.getProperty("eia_unit_id");

      const key = `${fac_id_eia}_${eia_unit_id}`;

      if (!uniqueUnits.has(key)) {
        uniqueUnits.set(key, unit);
      }
    });

    // Calculate summed renewable capacities for the facility
    const facilityTotals = Array.from(uniqueUnits.values()).reduce(
      (acc, unit) => {
        const solarCapacityMw =
          (unit.getProperty(
            "install_solar_capacity_mw_2030_woIRA"
          ) as number) || 0;
        const windCapacityMw =
          (unit.getProperty("install_wind_capacity_mw_2030_woIRA") as number) ||
          0;

        acc.install_solar_capacity_mw_2030_woIRA +=
          Number(solarCapacityMw) || 0;
        acc.install_wind_capacity_mw_2030_woIRA += Number(windCapacityMw) || 0;
        return acc;
      },
      {
        install_solar_capacity_mw_2030_woIRA: 0,
        install_wind_capacity_mw_2030_woIRA: 0,
      }
    );

    // Group unique units by technology
    const unitsByTechnology = Array.from(uniqueUnits.values()).reduce(
      (acc, unit) => {
        const tech = unit.getProperty("technology") as string;
        if (!acc[tech]) {
          acc[tech] = [];
        }

        acc[tech].push({
          eia_unit_id: unit.getProperty("eia_unit_id"),
          capacity_mw: unit.getProperty("capacity_mw"),
          estimated_vc: unit.getProperty("estimated_vc"),
          capacity_factor: unit.getProperty("capacity_factor"),
          solar_crossover_year: unit.getProperty("solar_crossover_year"),
          wind_crossover_year: unit.getProperty("wind_crossover_year"),
        } as UnitProperties);
        return acc;
      },
      {} as { [key: string]: UnitProperties[] }
    );

    return { facilityTotals, unitsByTechnology };
  };

  const getPopupContent = (feature: google.maps.Data.Feature) => {
    const plantName = feature.getProperty("plant_name") || "N/A";
    const county = feature.getProperty("county") || "N/A";
    const parentCompanyName =
      feature.getProperty("parent_company_name") || "N/A";
    const totalPlantCapacity =
      (feature.getProperty("total_plant_capacity") as number).toFixed(1) || 0;
    const solarLcoe2025wIRA =
      (feature.getProperty("solar_lcoe_2025_woIRA") as number).toFixed(2) || 0;
    const windLcoe2025wIRA =
      (feature.getProperty("wind_lcoe_2025_woIRA") as number).toFixed(2) || 0;

    const { facilityTotals, unitsByTechnology } = getUnitAnalysis(feature);

    const popupContent = `
        <div class="popup-content custom-popup" style="max-width: 400px;">
          <h3 style="color: #4fc3f7; margin-bottom: 10px;">${
            plantName || "N/A"
          }</h3>
          
          <div class="popup-tabs">
            <button class="tab-button active" onclick="document.getElementById('overview-tab').style.display='block'; document.getElementById('units-tab').style.display='none'; document.getElementById('renewable-tab').style.display='none'; this.classList.add('active'); this.nextElementSibling.classList.remove('active'); this.nextElementSibling.nextElementSibling.classList.remove('active')">Overview</button>
            <button class="tab-button" onclick="document.getElementById('units-tab').style.display='block'; document.getElementById('overview-tab').style.display='none'; document.getElementById('renewable-tab').style.display='none'; this.classList.add('active'); this.previousElementSibling.classList.remove('active'); this.nextElementSibling.classList.remove('active')">Units</button>
            <button class="tab-button" onclick="document.getElementById('renewable-tab').style.display='block'; document.getElementById('overview-tab').style.display='none'; document.getElementById('units-tab').style.display='none'; this.classList.add('active'); this.previousElementSibling.classList.remove('active'); this.previousElementSibling.previousElementSibling.classList.remove('active')">Renewable</button>
          </div>

          <div id="overview-tab" class="tab-content" style="display: block;">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${county}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Owner:</span>
                <span class="info-value">${parentCompanyName || "N/A"}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Total Plant Capacity:</span>
                <span class="info-value">${totalPlantCapacity} MW</span>
              </div>
            </div>
          </div>

          <div id="units-tab" class="tab-content units-tab-content" style="display: none;">
            <div class="info-grid">
              ${Object.entries(unitsByTechnology)
                .map(
                  ([tech, units]: [string, UnitProperties[]]) => `
                <div class="unit-section">
                  <strong style="color: #4fc3f7; display: block; margin: 10px 0;">${
                    tech === "gas_ct"
                      ? "Gas CT"
                      : tech === "gas_ccgt"
                      ? "Gas CCGT"
                      : tech === "ogs"
                      ? "Oil/Gas Steam"
                      : tech === "coal"
                      ? "Coal"
                      : tech.charAt(0).toUpperCase() + tech.slice(1)
                  }</strong>
                  ${(units as UnitProperties[])
                    .map(
                      (unit) => `
                    <div class="unit-info">
                      <div class="info-row">
                        <span class="info-label">Unit ID:</span>
                        <span class="info-value">${unit.eia_unit_id}</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Capacity:</span>
                        <span class="info-value">${unit.capacity_mw.toFixed(
                          1
                        )} MW</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Variable Cost:</span>
                        <span class="info-value">${
                          unit.estimated_vc?.toFixed(2) || "N/A"
                        } $/MWh</span>
                      </div>
                      <div class="info-row">
                        <span class="info-label">Capacity Factor (simulated):</span>
                        <span class="info-value">${(
                          unit.capacity_factor * 100
                        ).toFixed(1)}%</span>
                      </div>
                    </div>
                  `
                    )
                    .join("")}
                </div>
              `
                )
                .join("")}
            </div>
          </div>

          <div id="renewable-tab" class="tab-content" style="display: none;">
            <div class="info-grid">
              <div class="info-row">
                <span class="info-label">Solar Int. Pot. (2030):</span>
                <span class="info-value">${facilityTotals.install_solar_capacity_mw_2030_woIRA.toFixed(
                  1
                )} MW</span>
              </div>
              <div class="info-row">
                <span class="info-label">Wind Int. Pot. (2030):</span>
                <span class="info-value">${facilityTotals.install_wind_capacity_mw_2030_woIRA.toFixed(
                  1
                )} MW</span>
              </div>
              <div class="info-row">
                <span class="info-label">Solar LCOE (2025, w/o IRA):</span>
                <span class="info-value">$${solarLcoe2025wIRA}/MWh</span>
              </div>
              <div class="info-row">
                <span class="info-label">Wind LCOE (2025, w/o IRA):</span>
                <span class="info-value">$${windLcoe2025wIRA}/MWh</span>
              </div>
            </div>
          </div>
        </div>
      `;

    return popupContent;
  };

  useEffect(() => {
    if (!mapLoaded || !gMap.current || !googlemaps || popupEventAdded) return;

    // Declare this outside your click handler, e.g. at the component level
    let currentInfoWindow: google.maps.InfoWindow | null = null;

    gMap.current.data.addListener("click", (event: any) => {
      // return;
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }

      const clickedFeature = event.feature;

      const isPlant = !!clickedFeature.getProperty("fac_id_eia");
      if (!isPlant) return;

      console.log("Clicked feature:", event);
      if (!clickedFeature) return;

      const fac_id_eia = clickedFeature.getProperty("fac_id_eia");
      // if (!fac_id_eia) return;

      // Query all units with the same fac_id_eia
      const allUnits: any[] = [];
      gMap.current.data.forEach((feature: any) => {
        if (feature.getProperty("fac_id_eia") === fac_id_eia) {
          allUnits.push(feature);
        }
      });

      // Deduplicate units
      const uniqueUnits = new Map();
      allUnits.forEach((unit: any) => {
        const key = `${unit.getProperty("fac_id_eia")}_${unit.getProperty(
          "eia_unit_id"
        )}`;
        if (!uniqueUnits.has(key)) {
          uniqueUnits.set(key, unit);
        }
      });

      // Calculate summed renewable capacities for the facility
      const facilityTotals = Array.from(uniqueUnits.values()).reduce(
        (acc: any, unit: any) => {
          acc.install_solar_capacity_mw_2030 +=
            Number(unit.getProperty("install_solar_capacity_mw_2030")) || 0;
          acc.install_wind_capacity_mw_2030 +=
            Number(unit.getProperty("install_wind_capacity_mw_2030")) || 0;
          return acc;
        },
        {
          install_solar_capacity_mw_2030: 0,
          install_wind_capacity_mw_2030: 0,
        }
      );

      // Group unique units by technology
      const unitsByTechnology = Array.from(uniqueUnits.values()).reduce(
        (acc: any, unit: any) => {
          const tech = unit.getProperty("technology");
          if (!acc[tech]) acc[tech] = [];
          acc[tech].push(unit.getProperty ? unit.getProperty() : unit);
          return acc;
        },
        {}
      );

      // Show popup (InfoWindow) at the clicked location
      const infowindow = new googlemaps.InfoWindow({
        content: getPopupContent(clickedFeature),
        position: event.latLng,
        maxWidth: 400,
      });
      infowindow.open(gMap.current);

      currentInfoWindow = infowindow;
    });

    gMap.current.addListener("mouseenter", () => {
      gMap.current.data.setStyle({
        cursor: "pointer",
      });
    });

    gMap.current.addListener("mouseleave", () => {
      gMap.current.data.setStyle({
        cursor: "",
      });
    });

    setPopupEventAdded(true);
  }, [mapLoaded, googlemaps, popupEventAdded]);

  const handleFilterChange = (filterName: string, value: string | boolean) => {
    if (!gMap.current) return;

    const newFilters: { [key: string]: any } = {
      ...filters,
      [filterName]: value,
    };

    // Cascading resets for ambiguous filters
    if (filterName === "county") {
      delete newFilters.parent_company_name;
      delete newFilters.plant_name;
    }
    if (filterName === "parent_company_name") {
      delete newFilters.plant_name;
    }

    try {
      // Filter directly from plants data
      const uniqueFilteredPlants = new Map();
      allPlants.forEach((plant: any) => {
        if (!plant) return;
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

      const filteredPlants = Array.from(uniqueFilteredPlants.values());
      setFilteredPlants(filteredPlants);

      // Update Google Maps Data Layer visibility
      gMap.current.data.forEach((feature: any) => {
        if (!feature.getProperty("isPlant")) {
          return;
        }

        const fac_id_eia = feature.getProperty("fac_id_eia");
        const eia_unit_id = feature.getProperty("eia_unit_id");
        const isVisible = filteredPlants.some(
          (plant) =>
            plant.fac_id_eia === fac_id_eia && plant.eia_unit_id === eia_unit_id
        );
        gMap.current.data.overrideStyle(feature, { visible: isVisible });
      });

      // Handle map bounds
      if (typeof value !== "boolean" && value && filteredPlants.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        filteredPlants.forEach((plant) => {
          if ((plant as any).geometry?.coordinates) {
            const [lng, lat] = (plant as any).geometry.coordinates;
            bounds.extend(new google.maps.LatLng(lat, lng));
          } else if (plant.latitude && plant.longitude) {
            bounds.extend(new google.maps.LatLng(plant.latitude, plant.longitude));
          }
        });

        let padding = {
          left: 500,
          right: 300,
          top: 150,
          bottom: 150,
        };

        if (filterName === "plant_name") {
          padding = {
            left: 500, // Keep equal horizontal padding
            right: 300,
            top: 300, // Increased top padding to move plant up
            bottom: 300, // Reduced bottom padding to balance
          };
        }

        const center = bounds.getCenter();
        const uniqueFaqId = new Set(filteredPlants.map((p) => p.fac_id_eia));

        setTimeout(() => {
          if (filterName === "plant_name") {
            const currentZoom = gMap.current.getZoom();
            if (currentZoom < 16) {
              gMap.current.setZoom(16);
            }
            gMap.current.panTo(center);
            return;
          }

          if (uniqueFaqId.size === 1) {
            const currentZoom = gMap.current.getZoom();
            if (currentZoom < 12) {
              gMap.current.setZoom(12);
            }

            gMap.current.panTo(center);
            return;
          }

          gMap.current.fitBounds(bounds, padding);
          gMap.current.panTo(center);
        }, 300);
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
    if (!gMap.current) return;

    // Clear all filters
    setFilters({});

    // Show all features in Data Layer
    gMap.current.data.forEach((feature: any) => {
      gMap.current.data.overrideStyle(feature, { visible: true });
    });

    // Reset map view
    gMap.current.setCenter(defaultMapCenter);
    gMap.current.setZoom(defaultMapZoom);

    // Reset plant data to show all plants
    setAllPlants((val) => {
      setFilteredPlants(val);
      return val;
    });

    // Remove any custom visual layers if present
    visualLayerPolygons.forEach((polygon) => {
      polygon.setVisible(false);
      polygon.setMap(null);
    });

    setVisualLayerPolygons([]);
    setIsVisualLayerAvailable(false);
    setIsVisualLayerLoading(false);
    setIsVisualLayerVisible(false);

    setCurrentSelectedPlant(null);
  };

  // Update the popup styles
  const popupStyles = `
    .custom-popup {
      background-color: rgba(0, 0, 0, 0.8) !important;
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      padding: 10px;
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
    .units-tab-content {
      overflow: scroll;
      max-height: 200px;
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

  const hideVisualLayer = () => {
    if (!gMap.current) return;

    // Remove previous polygons if visible
    visualLayerPolygons.forEach((poly) => {
      poly.setMap(null);
      poly.setVisible(false);
    });
    setVisualLayerPolygons([]);
    setIsVisualLayerVisible(false);
    setIsVisualLayerAvailable(false);
  };

  const loadVisualLayer = async () => {
    if (!gMap.current) return;
    if (visualLayerPolygons.length > 0) return;

    // Polygons are loaded in handleAddLayer
    const selectedPlant = currentSelectedPlant;
    if (!selectedPlant) return;

    console.log("Selected plant:", selectedPlant);

    const s3Url = `https://etaiplatform.s3.us-west-2.amazonaws.com/1000GW/facility_siting_outputs_final/visual_geojson/${selectedPlant.fac_id_eia}_visual.geojson`;

    setIsVisualLayerLoading(true);

    return new Promise<{
      polygons: google.maps.Polygon[];
      bounds: google.maps.LatLngBounds;
    }>((res, rej) => {
      fetch(s3Url)
        .then((res) => res.json())
        .then((geojson) => {
          console.log("Loaded S3 GeoJSON:", geojson);
          const polygons: google.maps.Polygon[] = [];
          const bounds = new google.maps.LatLngBounds();

          // Support both FeatureCollection and single Feature
          const features: any[] = geojson.features
            ? geojson.features
            : [geojson];

          features.forEach((feature) => {
            const type = feature.properties?.polygon_type?.trim() || "Other";
            // let color = "rgba(128, 128, 128, 0.744)";
            let color = "#808080";
            if (type === "Sensitive Habitat") color = "rgba(0, 128, 0, 0.744)";
            else if (type === "Permanent Water/Ice Covered")
              color = "rgba(0, 0, 255, 0.744)";
            else if (type === "Urban Area") color = "rgba(255, 0, 0, 0.744)";
            else if (type === "Unfavorable Topography")
              color = "rgba(255, 255, 0, 0.744)";
            else if (type === "Buildable") color = "rgba(128, 0, 128, 0.744)";

            if (
              feature.geometry.type === "Polygon" ||
              feature.geometry.type === "MultiPolygon"
            ) {
              feature.geometry.coordinates.forEach((latLngLike) => {
                const path = latLngLike.map(([lng, lat]) => {
                  bounds.extend(new google.maps.LatLng(lat, lng));
                  return { lat, lng };
                });
                const polygon = new google.maps.Polygon({
                  clickable: false,
                  draggable: false,
                  editable: false,
                  paths: path,
                  strokeOpacity: 0,
                  strokeWeight: 1,
                  fillColor: color,
                  fillOpacity: 1,
                  zIndex: 99999,
                  geodesic: false,
                });
                polygons.push(polygon);
              });
            }
          });

          // Store polygons for removal
          setVisualLayerPolygons(polygons);

          setIsVisualLayerLoading(false);
          setIsVisualLayerAvailable(true);

          res({ polygons, bounds });
        })
        .catch((err) => {
          setIsVisualLayerLoading(false);
          setIsVisualLayerVisible(false);
          setIsVisualLayerAvailable(false);
          console.error("Error loading GeoJSON:", err);

          rej(err);
        });
    });
  };

  const showVisualLayer = () => {
    if (!gMap.current) return;
    if (isVisualLayerVisible) return;

    if (isVisualLayerAvailable) {
      // Show existing polygons
      visualLayerPolygons.forEach((poly) => {
        poly.setMap(gMap.current);
        poly.setVisible(true);
      });
      setIsVisualLayerVisible(true);
      return;
    }

    // Show polygons
    loadVisualLayer().then(({ polygons, bounds }) => {
      polygons.forEach((poly) => {
        poly.setMap(gMap.current);
        poly.setVisible(true);
      });

      // Fit map to polygons with smooth transition and minimum zoom
      if (!bounds.isEmpty()) {
        gMap.current.panTo(bounds.getCenter());
        // Use a larger padding and minimum zoom for better visibility
        setTimeout(() => {
          // Google Maps fitBounds only accepts padding as a number or Padding object
          gMap.current.fitBounds(bounds, {
            top: 200,
            right: 200,
            bottom: 200,
            left: 200,
          });
          // If zoom is too small, set a minimum zoom
          const currentZoom = gMap.current.getZoom();
          if (currentZoom < 11) {
            gMap.current.setZoom(11);
          }
        }, 500);
      }

      setVisualLayerPolygons(polygons);
      setIsVisualLayerVisible(true);
    });
  };
  useEffect(() => {
    if (!gMap.current) {
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
          bgcolor: "#000",
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

      {filters.plant_name && isVisualLayerVisible && (
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
        {filters.plant_name && isVisualLayerVisible && (
          <Button
            variant="contained"
            color="primary"
            onClick={hideVisualLayer}
            // disabled={isLoadingLayer}
            sx={{
              alignSelf: "center",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {"Hide Land Use"}
          </Button>
        )}
        {filters.plant_name && !isVisualLayerVisible && (
          <Button
            variant="contained"
            color="primary"
            onClick={showVisualLayer}
            disabled={isVisualLayerLoading}
            sx={{
              alignSelf: "center",
              width: "fit-content",
              height: "fit-content",
            }}
          >
            {"Show Land Use"}
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
        <ThermalDashboardSidebar
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
        <ThermalDashboardSidebar
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
        <ThermalStatCards plants={filteredPlants} />
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
              tech: "coal",
              label: "Coal",
              color: "hsla(0, 0%, 0%, 0.9)",
            },
            {
              tech: "gas_ct",
              label: "Gas CT",
              color: "hsla(0, 67%, 52%, 0.44)",
            },
            {
              tech: "gas_ccgt",
              label: "Gas CCGT",
              color: "hsla(0, 71%, 52%, 0.48)",
            },
            {
              tech: "ogs",
              label: "Oil/Gas Steam",
              color: "hsla(245, 85%, 41%, 0.57)",
            },
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
