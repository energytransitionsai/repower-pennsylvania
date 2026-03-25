import { MapOptions } from "mapbox-gl";

/**
 * Represents the properties of a plant feature.
 */
export interface Plant {
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
  solar_crossover_year?: string;
  wind_crossover_year?: string;
  install_solar_capacity_mw_2030: number;
  install_wind_capacity_mw_2030: number;
  solar_lcoe_2024: number;
  wind_lcoe_2024: number;
  urban_area_perc: number;
  geometry?: {
    type: string;
    coordinates: [number, number];
  };
}

/**
 * Represents the properties of a unit within a plant.
 */
export interface UnitProperties {
  eia_unit_id: string;
  capacity_mw: number;
  estimated_vc: number;
  capacity_factor: number;
  solar_crossover_year?: string;
  wind_crossover_year?: string;
}

/**
 * Represents the configuration for the map source.
 */
export interface MapSourceConfig {
  sourceId: string;
  sourceLayer: string;
  sourceUrl: string;
}

/**
 * Represents the configuration for the map layer.
 */
export interface MapLayerConfig {
  layerId: string;
  paint: mapboxgl.CirclePaint | mapboxgl.FillPaint;
}

/**
 * Represents the configuration for the dashboard.
 */
export interface DashboardConfig {
  mapOptions: Partial<MapOptions>;
  sourceConfig: MapSourceConfig;
  layerConfig: MapLayerConfig;
  tabs: { label: string; route: string }[];
}

/**
 * Represents the filters applied to the dashboard.
 */
export interface Filters {
  rto_name?: string;
  state?: string;
  parent_company_name?: string;
  plant_name?: string;
  removeUrbanAreaPlants?: boolean;
}

/**
 * Represents the dataset of plants.
 */
export interface PlantDataSet {
  all: Plant[];
  filtered: Plant[];
}

/**
 * Props for the `DashboardContent` component.
 */
export interface DashboardContentProps {
  mapboxToken: string;
  mapOptions: Partial<MapOptions>;
  sourceConfig: MapSourceConfig;
  layerConfig: MapLayerConfig;
  data: Plant[];
  filters: Filters;
  onFilterChange: (filterName: string, value: string | boolean) => void;
  onReset: () => void;
}

/**
 * Props for the `DashboardSidebar` component.
 */
export interface DashboardSidebarProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  plantData: PlantDataSet;
  onFilterChange: (filterName: string, value: string | boolean) => void;
  onReset: () => void;
  tabs: { label: string; route: string }[];
  children?: React.ReactNode;
}

/**
 * Props for the `DashboardFilters` component.
 */
export interface DashboardFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  plantData: PlantDataSet;
  onFilterChange: (filterName: string, value: string | boolean) => void;
  onReset: () => void;
}

/**
 * Props for the `StatCards` component.
 */
export interface StatCardsProps {
  plants: Plant[];
}