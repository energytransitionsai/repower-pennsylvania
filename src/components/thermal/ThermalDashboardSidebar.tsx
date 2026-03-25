"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Link, Tabs, Tab } from "@mui/material";
import Image from "next/image";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import EmailIcon from "@mui/icons-material/Email";
import ThermalDashoardFilters from "./ThermalDashboardFilters";
import { useRouter } from "next/navigation";

interface ThermalDashboardSidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  plantData: { all: any[]; filtered: any[] };
  onFilterChange: (filterName: string, value: string | boolean) => void;
  onReset: () => void;
}

export default function ThermalDashboardSidebar({
  filters,
  setFilters,
  plantData,
  onFilterChange,
  onReset,
}: ThermalDashboardSidebarProps) {
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
    if (newValue === 1) {
      router.push("/re/dashboard");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
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
        Surplus Interconnection Pennsylvania
      </Typography>
      {/* <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          width: "100%",
          height: "50px",
        }}
      >
        <Box sx={{ width: "48%", position: "relative" }}>
          <Image
            src="/gridlab_logo.png"
            alt="GridLab Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </Box>
        <Box sx={{ width: "48%", position: "relative" }}>
          <Image
            src="/ucb_logo.png"
            alt="UCB Logo"
            fill
            style={{ objectFit: "contain" }}
          />
        </Box>
      </Box> */}

      <Tabs
        sx={{
          color: "white",
          marginBottom: 2,
        }}
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="Dashboard Tabs"
      >
        <Tab label="Thermal" />
        <Tab label="Renewable" />
      </Tabs>

      <ThermalDashoardFilters
        filters={filters}
        setFilters={setFilters}
        plantData={plantData}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
    </Box>
  );
}
