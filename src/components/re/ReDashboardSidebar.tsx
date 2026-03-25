"use client";

import { Box, Tab, Tabs, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReDashboardFilters from "./ReDashboardFilters";

interface ReDashboardSidebarProps {
  filters: any;
  setFilters: (filters: any) => void;
  plantData: { all: any[]; filtered: any[] };
  onFilterChange: (filterName: string, value: string | boolean) => void;
  onReset: () => void;
}

export default function ReDashboardSidebar({
  filters,
  setFilters,
  plantData,
  onFilterChange,
  onReset,
}: ReDashboardSidebarProps) {
  const [isDataReady, setIsDataReady] = useState(false);
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(1);

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
    if (newValue === 0) {
      router.push("/thermal/dashboard");
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

      <ReDashboardFilters
        filters={filters}
        setFilters={setFilters}
        plantData={plantData}
        onFilterChange={onFilterChange}
        onReset={onReset}
      />
      {/* <Box
        sx={{
          mt: "auto",
          pt: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{ color: "rgba(255, 255, 255, 0.6)" }}
        >
          Created by Umed Paliwal
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Link
            href="mailto:umed@berkeley.edu"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              "&:hover": { color: "#4fc3f7" },
            }}
          >
            <EmailIcon sx={{ fontSize: "1rem" }} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/paliwalumed/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              "&:hover": { color: "#4fc3f7" },
            }}
          >
            <LinkedInIcon sx={{ fontSize: "1rem" }} />
          </Link>
          <Link
            href="https://x.com/umedpali"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: "rgba(255, 255, 255, 0.6)",
              "&:hover": { color: "#4fc3f7" },
            }}
          >
            <TwitterIcon sx={{ fontSize: "1rem" }} />
          </Link>
        </Box>
      </Box> */}
    </Box>
  );
}
