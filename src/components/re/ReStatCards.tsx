"use client";

import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import WindPowerIcon from "@mui/icons-material/WindPower";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface PlantData {
  fac_id_eia;
  plant_name;
  technology;
  owner;
  operating_year;
  capacity_mw;
  utility_name;
  rto_name;
  county;
  state;
  is_battery;
  battery_capacity;
  latitude;
  longitude;
  solar_cf;
  wind_cf;
  recommended_config;
  optimal_solar_mw;
  optimal_wind_mw;
  optimal_battery_mw;
  optimal_battery_mwh;
  optimal_cf;
  solar_lcoe_2025;
  wind_lcoe_2025;
  solar_lcoe_2030;
  wind_lcoe_2030;
  potential_mw_solar;
  potential_mw_wind;
  urban_area_perc;
  normalized_owner;
  current_cf;
}

interface PlantDataSet {
  all: PlantData[];
  filtered: PlantData[];
}

export default function ReStatCards({
  plants: plantsToUse,
}: {
  plants: PlantData[];
}) {
  const [stats, setStats] = React.useState({
    totalCapacity: 0,
    solarIntegrationPotential: 0,
    windIntegrationPotential: 0,
    storageIntegrationPotentialMw: 0,
    storageIntegrationPotentialMwh: 0,
    currentInterconnectionUtilization: 0,
    potentialInterconnectionUtilization: 0,
  });

  // Add debugging logs
  console.log("Number of plants being processed:", plantsToUse.length);

  const calculateAverage = (values: number[]) => {
    const validValues = values.filter(
      (v) => !isNaN(v) && v !== null && v !== undefined && v > 0
    );
    return validValues.length > 0
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length
      : 0;
  };

  // Log unique facility IDs to check for duplicates
  const facilityIds = new Set(plantsToUse.map((p) => p.fac_id_eia));
  console.log("Number of unique facilities:", facilityIds.size);

  const calculateStats = () => {
    return setStats({
      totalCapacity: plantsToUse.reduce((sum, p) => {
        const capacity = Number(p.capacity_mw);
        return sum + (isNaN(capacity) ? 0 : capacity);
      }, 0),
      solarIntegrationPotential: plantsToUse.reduce((sum, p) => {
        const solar = Number(p.optimal_solar_mw);
        // console.log(`Facility ${p.fac_id_eia} Solar: ${solar}`);
        return sum + (isNaN(solar) ? 0 : solar);
      }, 0),
      windIntegrationPotential: plantsToUse.reduce((sum, p) => {
        const solar = Number(p.optimal_wind_mw);
        // console.log(`Facility ${p.fac_id_eia} Solar: ${solar}`);
        return sum + (isNaN(solar) ? 0 : solar);
      }, 0),
      storageIntegrationPotentialMw: plantsToUse.reduce((sum, p) => {
        const optimal_battery_mw = Number(p.optimal_battery_mw);
        const storage = optimal_battery_mw;

        // console.log(`Facility ${p.fac_id_eia} Storage: ${storage}`);
        return sum + (isNaN(storage) ? 0 : storage);
      }, 0),
      storageIntegrationPotentialMwh: plantsToUse.reduce((sum, p) => {
        const optimal_battery_mwh = Number(p.optimal_battery_mwh);
        const storage = optimal_battery_mwh;

        // console.log(`Facility ${p.fac_id_eia} Storage: ${storage}`);
        return sum + (isNaN(storage) ? 0 : storage);
      }, 0),
      currentInterconnectionUtilization: calculateAverage(
        plantsToUse.map((p) => {
          if (p.technology === "Solar") {
            return Number(p.current_cf || 0);
          } else if (p.technology === "Wind") {
            return Number(p.current_cf || 0);
          } else {
            return Number(p.current_cf || 0);
          }
        })
      ),
      potentialInterconnectionUtilization: calculateAverage(
        plantsToUse.map((p) => Number(p.optimal_cf))
      ),
    });
  };

  useEffect(() => {
    calculateStats();
  }, [plantsToUse]);

  // Log final calculations
  console.log("Final stats:", stats);

  const statConfigs = [
    {
      label: "Total Capacity",
      value: stats.totalCapacity,
      unit: "MW",
      icon: <ElectricBoltIcon />,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
    {
      label: "Solar Integration Potential",
      value: stats.solarIntegrationPotential,
      unit: "MW",
      icon: <SolarPowerIcon />,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
    {
      label: "Wind Integration Potential",
      value: stats.windIntegrationPotential,
      unit: "MW",
      icon: <WindPowerIcon />,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
    {
      label: "Storage Integration Potential",
      value: stats.storageIntegrationPotentialMw,
      unit: "MW",
      icon: <SolarPowerIcon />,
      format: (v: number) => Math.round(v).toLocaleString(),
      secondary: {
        value: stats.storageIntegrationPotentialMwh,
        unit: "MWh",
        format: (v: number) => Math.round(v).toLocaleString(),
      },
    },
    {
      label: "Current IC Utilization",
      value: stats.currentInterconnectionUtilization,
      unit: "%",
      icon: <ElectricBoltIcon />,
      format: (v: number) => (v * 100).toFixed(2),
    },
    {
      label: "Potential IC Utilization",
      value: stats.potentialInterconnectionUtilization,
      unit: "%",
      icon: <ElectricBoltIcon />,
      format: (v: number) => (v * 100).toFixed(2),
    },
  ];

  const cardBgColor = "rgba(0, 0, 0, 0.7)";
  const labelColor = "#4fc3f7";
  const valueColor = "#ffffff";
  const accentColor = "#4fc3f7";

  return (
    <Grid
      container
      spacing={3}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {statConfigs.map((stat, index) => (
        <Grid key={index}>
          <Box
            sx={{
              px: 1.5,
              borderRadius: "8px",
              border: `1px solid ${accentColor}`,
              height: "100%",
              width: "auto",
              display: "flex",
              alignItems: "center",
              backgroundColor: cardBgColor,
              minHeight: "70px",
            }}
          >
            <Box sx={{ color: accentColor, mr: 1 }}>
              {React.cloneElement(stat.icon, { fontSize: "medium" })}
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: labelColor,
                  lineHeight: 1.2,
                  display: "block",
                  fontWeight: "bold",
                  fontSize: "0.71rem",
                  mb: 0.5,
                }}
              >
                {stat.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: valueColor,
                  fontWeight: "bold",
                  lineHeight: 1.2,
                  fontSize: "1rem",
                }}
              >
                {stat.format(stat.value)} {stat.unit}
                {stat.secondary && <br />}
                {stat.secondary &&
                  `${stat.secondary.format(stat.secondary.value)} ${
                    stat.secondary.unit
                  }`}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
