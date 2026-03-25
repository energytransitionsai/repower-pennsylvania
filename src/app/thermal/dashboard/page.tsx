"use client";

import ThermalDashboardContentGmap from "@/components/thermal/ThermalDashboardContentGmap";
import { Box } from "@mui/material";
import { useState } from "react";
import DashboardIntroModal from "../../../components/DashboardIntroModal";

export default function Dashboard() {
  const [showIntroModal, setShowIntroModal] = useState(false);

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative" }}>
      <ThermalDashboardContentGmap
      // filters={filters}
      // setFilters={setFilters}
      // mapConfig={mapConfig}
      />
      <DashboardIntroModal
        open={showIntroModal}
        onClose={() => setShowIntroModal(false)}
      />
    </Box>
  );
}
