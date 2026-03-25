"use client";

import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import WindPowerIcon from "@mui/icons-material/WindPower";
import { Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { StatCardsProps } from "./dashboard.types";

export default function StatCards({ plants }: StatCardsProps) {
  const [stats, setStats] = useState({
    totalCapacity: 0,
    avgVariableCost: 0,
    avgSolarLCOE: 0,
    avgWindLCOE: 0,
    solarCapacity: 0,
    windCapacity: 0,
  });

  /**
   * Calculates the average of an array of numbers, ignoring invalid values.
   */
  const calculateAverage = (values: number[]) => {
    const validValues = values.filter((v) => !isNaN(v) && v > 0);
    return validValues.length > 0
      ? validValues.reduce((a, b) => a + b, 0) / validValues.length
      : 0;
  };

  /**
   * Calculates the statistics based on the provided plant data.
   */
  const calculateStats = () => {
    setStats({
      totalCapacity: plants.reduce((sum, p) => sum + (p.capacity_mw || 0), 0),
      avgVariableCost: calculateAverage(plants.map((p) => p.estimated_vc)),
      avgSolarLCOE: calculateAverage(plants.map((p) => p.solar_lcoe_2024)),
      avgWindLCOE: calculateAverage(plants.map((p) => p.wind_lcoe_2024)),
      solarCapacity: plants.reduce(
        (sum, p) => sum + (p.install_solar_capacity_mw_2030 || 0),
        0
      ),
      windCapacity: plants.reduce(
        (sum, p) => sum + (p.install_wind_capacity_mw_2030 || 0),
        0
      ),
    });
  };

  useEffect(() => {
    calculateStats();
  }, [plants]);

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

  const cardStyles = {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    labelColor: "#4fc3f7",
    valueColor: "#ffffff",
    accentColor: "#4fc3f7",
  };

  return (
    <Grid
      container
      spacing={1}
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 4,
        justifyContent: "center",
      }}
    >
      {statConfigs.map((stat, index) => (
        <Grid key={index}>
          <Box
            sx={{
              px: 1.5,
              borderRadius: "8px",
              border: `1px solid ${cardStyles.accentColor}`,
              height: "100%",
              display: "flex",
              alignItems: "center",
              backgroundColor: cardStyles.backgroundColor,
              minHeight: "70px",
            }}
          >
            <Box sx={{ color: cardStyles.accentColor, mr: 1 }}>
              {React.cloneElement(stat.icon, { fontSize: "medium" })}
            </Box>
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: cardStyles.labelColor,
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
                  color: cardStyles.valueColor,
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
