"use client";

import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Button,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface ReDashboardFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  plantData: { all: any[]; filtered: any[] };
  onFilterChange: (filterName: string, value: string | boolean) => void;
  onReset: () => void;
}

export default function ReDashboardFilters({
  filters,
  setFilters,
  plantData,
  onFilterChange,
  onReset,
}: ReDashboardFiltersProps) {
  const handleFilterChange = (event: any) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    onFilterChange(name, newValue);
  };

  const getUniqueValues = (field: string) => {
    if (!plantData?.all || !plantData.all.length) return [];

    // Start with all plants
    let filteredPlants = plantData.all;

    // Apply cascading filters
    if (filters.technology && field !== "technology") {
      filteredPlants = filteredPlants.filter(
        (plant) => plant.technology === filters.technology
      );
    }

    if (filters.county && field !== "technology" && field !== "county") {
      filteredPlants = filteredPlants.filter(
        (plant) => plant.county === filters.county
      );
    }

    if (
      filters.owner &&
      field !== "technology" &&
      field !== "county" &&
      field !== "owner"
    ) {
      filteredPlants = filteredPlants.filter(
        (plant) => plant.owner === filters.owner
      );
    }

    // Get unique values from filtered plants
    return [
      ...new Set(filteredPlants.map((plant) => plant[field]).filter(Boolean)),
    ].sort();
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<RestartAltIcon />}
        onClick={onReset}
        fullWidth
        sx={{
          mb: 2,
          color: "white",
          borderColor: "rgba(255, 255, 255, 0.3)",
          "&:hover": {
            borderColor: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        Reset Filters
      </Button>

      <TextField
        select
        label="Technology"
        name="technology"
        value={filters.technology || ""}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        variant="outlined"
        SelectProps={{
          native: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      >
        <option value="">Select Technology</option>
        {getUniqueValues("technology").map((technology) => (
          <option key={technology} value={technology}>
            {technology}
          </option>
        ))}
      </TextField>

      <TextField
        select
        label="County"
        name="county"
        value={filters.county || ""}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        variant="outlined"
        SelectProps={{
          native: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      >
        <option value="">Select County</option>
        {getUniqueValues("county").map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </TextField>

      <TextField
        select
        label="Owner"
        name="owner"
        value={filters.utility_name || ""}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        variant="outlined"
        SelectProps={{
          native: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      >
        <option value="">Select Owner</option>
        {getUniqueValues("owner").map((owner) => (
          <option key={owner} value={owner}>
            {owner}
          </option>
        ))}
      </TextField>

      <TextField
        select
        label="Plant Name"
        name="plant_name"
        value={filters.plant_name || ""}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        variant="outlined"
        SelectProps={{
          native: true,
        }}
        InputLabelProps={{
          shrink: true,
        }}
      >
        <option value="">Select Plant</option>
        {getUniqueValues("plant_name").map((plant) => (
          <option key={plant} value={plant}>
            {plant}
          </option>
        ))}
      </TextField>

      <FormControlLabel
        control={
          <Checkbox
            checked={filters.removeUrbanAreaPlants || false}
            onChange={handleFilterChange}
            name="removeUrbanAreaPlants"
          />
        }
        label="Remove Urban Area Plants"
      />
    </Box>
  );
}
