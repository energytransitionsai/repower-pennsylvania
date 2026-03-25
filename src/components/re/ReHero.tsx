"use client";

import React from "react";
import { Box, Typography, Link as MuiLink } from "@mui/material";
import { styled } from "@mui/system";
// import Header from "../header";
import Link from "next/link";

const HeroContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
  overflow: "hidden",
}));

const VideoBackground = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: -1,
  "& video": {
    objectFit: "cover",
    width: "100%",
    height: "100%",
  },
});

const Overlay = styled("div")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
});

const HeroContent = styled(Box)(({ theme }) => ({
  textAlign: "center",
  padding: "0 20px",
  maxWidth: "800px",
  position: "relative", // Ensure content stays above video
  zIndex: 1, // Bring content to front
}));

export default function ReHero() {
  return (
    <HeroContainer>
      <VideoBackground>
        <video autoPlay muted loop playsInline>
          <source src="/video_re_dashboard.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </VideoBackground>
      <Overlay />
      {/* <Header /> */}
      <HeroContent>
        <Typography
          variant="h1"
          gutterBottom
          sx={{
            fontSize: {
              xs: "2.5rem", // Smaller on mobile
              sm: "3.5rem", // Medium on tablet
              md: "4rem", // Full size on desktop
            },
            fontWeight: "bold",
            lineHeight: {
              xs: 1.2, // Tighter line height on mobile
              sm: 1.3,
            },
            mb: 2,
          }}
        >
          Pair Storage with existing Renewables
        </Typography>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontSize: {
              xs: "1.25rem", // Smaller on mobile
              sm: "1.5rem", // Medium on tablet
              md: "2rem", // Full size on desktop
            },
            mb: 4,
            opacity: 0.9,
          }}
        >
          Improve resiliency and meet peak demand by adding energy storage to
          existing renewable sites
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexWrap: { xs: "wrap", sm: "nowrap" }, // Stack on mobile, side by side otherwise
          }}
        >
          {/* Internal Dashboard Link */}
          <Link href="/re/dashboard" passHref legacyBehavior>
            <MuiLink
              component="a"
              sx={{
                display: "inline-block",
                padding: "12px 24px",
                backgroundColor: "#00838F",
                color: "white",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                width: { xs: "100%", sm: "auto" }, // Full width on mobile
                textAlign: "center",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#006064",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Explore Dashboard
            </MuiLink>
          </Link>

          {/* External Links */}
          <MuiLink
            href="https://gspp.berkeley.edu/assets/uploads/page/Surplus_Interconnection.pdf"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#00838F",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              width: { xs: "100%", sm: "auto" }, // Full width on mobile
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#006064",
                transform: "translateY(-2px)",
              },
            }}
          >
            Read Working Paper
          </MuiLink>

          <MuiLink
            href="https://gridlab.org/surplus-interconnection-policy-explainer/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "inline-block",
              padding: "12px 24px",
              backgroundColor: "#00838F",
              color: "white",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
              transition: "all 0.3s ease",
              width: { xs: "100%", sm: "auto" },
              textAlign: "center",
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#006064",
                transform: "translateY(-2px)",
              },
            }}
          >
            Read Policy Explainer
          </MuiLink>
        </Box>
      </HeroContent>
    </HeroContainer>
  );
}
