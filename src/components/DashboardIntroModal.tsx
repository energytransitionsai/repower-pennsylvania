"use client";

import React from "react";
import { Box, Typography, Button, Modal } from "@mui/material";

interface DashboardIntroModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DashboardIntroModal({
  open,
  onClose,
}: DashboardIntroModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="dashboard-intro-modal"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "600px" },
          bgcolor: "rgba(0, 0, 0, 0.9)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "12px",
          boxShadow: 24,
          p: 4,
          color: "white",
          outline: "none",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            color: "#4fc3f7",
            mb: 3,
            fontWeight: "bold",
          }}
        >
          Welcome to the Surplus Interconnection Dashboard
        </Typography>

        <Typography variant="body1" sx={{ mb: 3 }}>
          We analyze the potential for adding renewables at existing power
          plants. For each plant, we assess local solar and wind resources
          within 6 miles, determine when renewable costs become cheaper than
          current operations (crossover year), and calculate how much capacity
          can share the existing grid connection.
        </Typography>

        <Typography variant="h6" sx={{ color: "#4fc3f7", mb: 2 }}>
          Explore Each Plant's Potential:
        </Typography>

        <Box component="ul" sx={{ mb: 3, pl: 2 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            Click on any plant marker to see:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            <Typography component="li">
              Current capacity and generation costs
            </Typography>
            <Typography component="li">
              Potential solar and wind capacity that can be added by 2030
            </Typography>
            <Typography component="li">
              Cost comparison between existing operations and new renewables
              (LCOE)
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ color: "#4fc3f7", mb: 2 }}>
          Interactive Filters:
        </Typography>

        <Box component="ul" sx={{ mb: 3, pl: 2 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            Find specific opportunities by filtering:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            <Typography component="li">
              By RTO/ISO regions to explore different electricity markets
            </Typography>
            <Typography component="li">
              By state to focus on specific geographic areas
            </Typography>
            <Typography component="li">
              By parent company to analyze specific portfolios
            </Typography>
            <Typography component="li">
              Option to exclude plants in urban areas with limited land
              availability
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ color: "#4fc3f7", mb: 2 }}>
          View Aggregated Results:
        </Typography>

        <Box component="ul" sx={{ mb: 4, pl: 2 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            Track key metrics at the bottom of the page that update as you
            change filters:
          </Typography>
          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            <Typography component="li">
              Total existing capacity of selected plants
            </Typography>
            <Typography component="li">
              Average variable costs of current generation
            </Typography>
            <Typography component="li">
              Solar and wind LCOE comparisons
            </Typography>
            <Typography component="li">
              Total renewable integration potential
            </Typography>
          </Box>
        </Box>

        <Button
          onClick={onClose}
          sx={{
            backgroundColor: "#00838F",
            color: "white",
            "&:hover": {
              backgroundColor: "#006064",
            },
            px: 4,
            py: 1.5,
            borderRadius: "8px",
          }}
        >
          Start Exploring
        </Button>
      </Box>
    </Modal>
  );
}
