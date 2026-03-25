"use client";

import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import React from "react";
import { DashboardFiltersProps } from "./dashboard.types";

export default function DashboardFilters({
  filters,
  setFilters,
  plantData,
  onFilterChange,
  onReset,
}: DashboardFiltersProps) {
  /**
   * Handles changes to filter inputs.
   */
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    const newValue = type === "checkbox" ? checked : value;
    onFilterChange(name, newValue);
  };

  /**
   * Retrieves unique values for a given field, applying cascading filters.
   */
  const getUniqueValues = (field: keyof typeof filters) => {
    if (!plantData?.all || !plantData.all.length) return [];

    // Start with all plants
    let filteredPlants = plantData.all;

    // Apply cascading filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== field && value) {
        filteredPlants = filteredPlants.filter(
          (plant) => plant[key as keyof typeof plant] === value
        );
      }
    });

    // Get unique values from filtered plants
    return [
      ...new Set(filteredPlants.map((plant) => plant[field]).filter(Boolean)),
    ].sort();
  };

  return (
    <Box>
      {/* Reset Button */}
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

      {/* RTO/ISO Filter */}
      <TextField
        select
        label="RTO/ISO"
        name="rto_name"
        value={filters.rto_name || ""}
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
        <option value="">Select RTO/ISO</option>
        {getUniqueValues("rto_name").map((rto) => (
          <option key={rto} value={rto}>
            {rto}
          </option>
        ))}
      </TextField>

      {/* State Filter */}
      <TextField
        select
        label="State"
        name="state"
        value={filters.state || ""}
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
        <option value="">Select State</option>
        {getUniqueValues("state").map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </TextField>

      {/* Parent Company Filter */}
      <TextField
        select
        label="Parent Company"
        name="parent_company_name"
        value={filters.parent_company_name || ""}
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
        <option value="">Select Parent Company</option>
        {getUniqueValues("parent_company_name").map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}
      </TextField>

      {/* Plant Name Filter */}
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

      {/* Remove Urban Area Plants Filter */}
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
