"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useRouter } from "next/navigation";
import { DashboardSidebarProps } from "./dashboard.types";

export default function DashboardSidebar({
  filters,
  setFilters,
  plantData,
  onFilterChange,
  onReset,
  tabs,
  children,
}: DashboardSidebarProps) {
  const router = useRouter();
  const [isDataReady, setIsDataReady] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (plantData.all.length > 0 && plantData.filtered.length > 0) {
      setIsDataReady(true);
    }
  }, [plantData]);

  if (!isDataReady) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    if (tabs[newValue]?.route) {
      router.push(tabs[newValue].route);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Sidebar Title */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
          mb: 2,
          fontSize: "1.3rem",
          letterSpacing: "0.5px",
        }}
      >
        Surplus Interconnection
      </Typography>

      {/* Tabs */}
      <Tabs
        sx={{
          color: "white",
          marginBottom: 2,
        }}
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="Dashboard Tabs"
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab.label} />
        ))}
      </Tabs>

      {/* Custom Filter Components */}
      {children}
    </Box>
  );
}
