"use client";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import WindPowerIcon from "@mui/icons-material/WindPower";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

interface PlantData {
  fac_id_eia: string;
  eia_unit_id: string;
  capacity_mw: number;
  estimated_vc: number;
  solar_lcoe_2025_woIRA: number;
  wind_lcoe_2025_woIRA: number;
  install_solar_capacity_mw_2030_woIRA: number;
  install_wind_capacity_mw_2030_woIRA: number;
}

interface PlantDataSet {
  all: PlantData[];
  filtered: PlantData[];
}

export default function ThermalStatCards({
  plants: plantsToUse,
}: {
  plants: PlantData[];
}) {
  const [stats, setStats] = React.useState({
    totalCapacity: 0,
    avgVariableCost: 0,
    avgSolarLCOE: 0,
    avgWindLCOE: 0,
    solarCapacity: 0,
    windCapacity: 0,
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

      avgVariableCost: calculateAverage(
        plantsToUse.map((p) => Number(p.estimated_vc || 0))
      ),
      avgSolarLCOE: calculateAverage(
        plantsToUse.map((p) => Number(p.solar_lcoe_2025_woIRA || 0))
      ),
      avgWindLCOE: calculateAverage(
        plantsToUse.map((p) => Number(p.wind_lcoe_2025_woIRA || 0))
      ),

      solarCapacity: plantsToUse.reduce((sum, p) => {
        const solar = Number(p.install_solar_capacity_mw_2030_woIRA);
        // console.log(`Facility ${p.fac_id_eia} Solar: ${solar}`);
        return sum + (isNaN(solar) ? 0 : solar);
      }, 0),

      windCapacity: plantsToUse.reduce((sum, p) => {
        const wind = Number(p.install_wind_capacity_mw_2030_woIRA);
        // console.log(`Facility ${p.fac_id_eia} Wind: ${wind}`);
        return sum + (isNaN(wind) ? 0 : wind);
      }, 0),
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
      label: "Avg Variable Cost",
      value: stats.avgVariableCost,
      unit: "$/MWh",
      icon: <AttachMoneyIcon />,
      format: (v: number) => v.toFixed(2),
    },
    {
      label: "Avg Solar LCOE",
      value: stats.avgSolarLCOE,
      unit: "$/MWh",
      icon: <AttachMoneyIcon />,
      format: (v: number) => v.toFixed(2),
    },
    {
      label: "Avg Wind LCOE",
      value: stats.avgWindLCOE,
      unit: "$/MWh",
      icon: <AttachMoneyIcon />,
      format: (v: number) => v.toFixed(2),
    },
    {
      label: "Solar Integration Potential",
      value: stats.solarCapacity,
      unit: "MW",
      icon: <SolarPowerIcon />,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
    {
      label: "Wind Integration Potential",
      value: stats.windCapacity,
      unit: "MW",
      icon: <WindPowerIcon />,
      format: (v: number) => Math.round(v).toLocaleString(),
    },
  ];

  const cardBgColor = "rgba(0, 0, 0, 0.7)";
  const labelColor = "#4fc3f7";
  const valueColor = "#ffffff";
  const accentColor = "#4fc3f7";

  return (
    <Grid
      container
      spacing={1}
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
                  fontSize: "0.91rem",
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
                  fontSize: "1.105rem",
                }}
              >
                {stat.format(stat.value)} {stat.unit}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
