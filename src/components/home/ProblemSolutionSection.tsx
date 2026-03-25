"use client";

import BoltIcon from "@mui/icons-material/Bolt";
import PolicyIcon from "@mui/icons-material/Policy";
import SavingsIcon from "@mui/icons-material/Savings";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import SpeedIcon from "@mui/icons-material/Speed";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useRef } from "react";

export default function ProblemSolutionSection() {
  const theme = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in-section");
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("is-visible");
              }, 100 * index);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <Box
      id="problem-solution"
      ref={sectionRef}
      sx={{
        py: { xs: 10, md: 12 },
        background: "linear-gradient(135deg, #011B29 0%, #01304D 100%)",
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          right: "-5%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(58,134,255,0.12) 0%, rgba(58,134,255,0) 70%)",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "-10%",
          width: "50%",
          height: "50%",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(33,158,188,0.12) 0%, rgba(33,158,188,0) 70%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg">
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            variant="h3"
            className="fade-in-section"
            sx={{
              fontWeight: 700,
              mb: 6,
              color: "white",
              textShadow: "0 0 20px rgba(0,195,255,0.2)",
              maxWidth: "900px",
              mx: "auto",
              fontSize: "1.75rem",
            }}
          >
            Pennsylvania's clean energy transition faces critical interconnection
            bottlenecks despite ambitious goals
          </Typography>
        </Box>

        {/* PROBLEM AND SOLUTION SECTION - SIDE BY SIDE */}
        <Grid
          container
          sx={{
            display: {
              xs: "flex",
            },
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: {
              xs: 4,
              sm: 0,
            },
          }}
        >
          {/* LEFT SIDE: THE PROBLEM */}
          <Grid
            sx={{
              px: {
                xs: 0,
                sm: 1,
              },
              flexBasis: { sm: "50%" },
            }}
          >
            <Typography
              variant="h3"
              className="fade-in-section"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: "1.75rem",
                position: "relative",
                color: "white",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: -12,
                  width: 50,
                  height: 3,
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, #3a86ff 0%, #219ebc 100%)",
                },
              }}
            >
              The Problem
            </Typography>

            <Card
              className="fade-in-section"
              sx={{
                bgcolor: "rgba(0,20,40,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(72,202,228,0.2)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                mt: 4,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mb: 2, alignItems: "center" }}
                  >
                    <BoltIcon sx={{ fontSize: 28, color: "#48cae4" }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "white",
                      }}
                    >
                      Interconnection Delays
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.9rem",
                      mb: 2,
                      lineHeight: 1.5,
                      color: "white",
                      fontWeight: 400,
                    }}
                  >
                    Pennsylvania has{" "}
                    <strong style={{ color: "#48cae4" }}>~72 GW</strong> of
                    active projects in the PJM interconnection queue, with{" "}
                    <strong style={{ color: "#48cae4" }}>average connection timelines exceeding 5 years</strong>—
                    over 40 months to reach interconnection agreement, plus 2+ years for construction.
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: "rgba(72,202,228,0.2)" }} />

                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mb: 2, alignItems: "center" }}
                  >
                    <WarningAmberIcon sx={{ fontSize: 28, color: "#48cae4" }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "white",
                      }}
                    >
                      Tightening Supply Conditions
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.9rem",
                      mb: 2,
                      lineHeight: 1.5,
                      color: "white",
                      fontWeight: 400,
                    }}
                  >
                    Pennsylvania's electricity market faces substantial capacity challenges.{" "}
                    <strong style={{ color: "#48cae4" }}>PJM's 2026/27 capacity cleared at the price cap of $329.17/MW-day</strong>{" "}
                    (11.4x increase from prior years), reflecting{" "}
                    <strong style={{ color: "#48cae4" }}>accelerating demand growth from data centers and electrification</strong>{" "}
                    alongside thermal plant retirements. PJM's market monitor attributes data centers as the
                    primary reason for rising capacity prices across the region.
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: "rgba(72,202,228,0.2)" }} />

                <Box sx={{ mb: 3 }}>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mb: 2, alignItems: "center" }}
                  >
                    <WarningAmberIcon sx={{ fontSize: 28, color: "#48cae4" }} />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "white",
                      }}
                    >
                      New Gas Supply Challenges
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.9rem",
                      mb: 2,
                      lineHeight: 1.5,
                      color: "white",
                      fontWeight: 400,
                    }}
                  >
                    <strong style={{ color: "#48cae4" }}>New gas plants ordered today won't come online until 2030-2031 at earliest</strong>,
                    creating a critical gap in meeting near-term capacity needs. Additionally,{" "}
                    <strong style={{ color: "#48cae4" }}>capital costs have surged: recent combined-cycle projects now cost $2,000/kW or more,
                    up from $1,116-1,427/kW for 2026-2027 projects</strong>, making new gas generation increasingly expensive
                    as a response to growing electricity demand.
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: "rgba(72,202,228,0.2)" }} />

                <Box>
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ mb: 2, alignItems: "center" }}
                  >
                    <SettingsEthernetIcon
                      sx={{ fontSize: 28, color: "#48cae4" }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        color: "white",
                      }}
                    >
                      Economic Opportunity Loss
                    </Typography>
                  </Stack>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.9rem",
                      mb: 2,
                      lineHeight: 1.5,
                      color: "white",
                      fontWeight: 400,
                    }}
                  >
                    Pennsylvania faces growing economic development constraints as{" "}
                    <strong style={{ color: "#48cae4" }}>
                      U.S. electricity demand is projected to increase 25% by 2030 and 78% by 2050
                    </strong>
                    , driven by data centers, AI infrastructure, and industrial electrification. With{" "}
                    <strong style={{ color: "#48cae4" }}>
                      power availability now the primary site selection factor
                    </strong>{" "}
                    for data centers, Pennsylvania's strategic position within PJM creates
                    unique opportunities. However, extended interconnection timelines and tightening capacity
                    conditions limit the state's competitiveness for these high-value investments.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* RIGHT SIDE: THE SOLUTION */}
          <Grid
            sx={{
              px: {
                xs: 0,
                sm: 1,
              },
              flexBasis: { sm: "50%" },
            }}
          >
            <Typography
              variant="h3"
              className="fade-in-section"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: "1.75rem",
                position: "relative",
                "&:after": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  bottom: -12,
                  width: 50,
                  height: 3,
                  borderRadius: 2,
                  background:
                    "linear-gradient(90deg, #8ecae6 0%, #219ebc 100%)",
                },
              }}
            >
              The Solution: Surplus Interconnection
            </Typography>

            <Card
              className="fade-in-section"
              sx={{
                bgcolor: "rgba(0,40,80,0.9)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(142,202,230,0.3)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                mt: 4,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: "#8ecae6",
                      fontSize: "1.2rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <PolicyIcon sx={{ mr: 1.5, fontSize: "1.2rem" }} />
                    Surplus Interconnection for Pennsylvania
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: "0.9rem",
                      mb: 0,
                      lineHeight: 1.5,
                      color: "white",
                      fontWeight: 400,
                    }}
                  >
                    Surplus Interconnection Service allows new electricity
                    supply resources to connect to the grid using existing
                    infrastructure that serves already operating generators,
                    without exceeding the total output capacity already
                    allocated to the existing resource. FERC Order 845 (2018)
                    cleared a regulatory pathway for generators to add new
                    electricity resources to the grid by utilizing surplus
                    capacity at existing interconnection points.
                  </Typography>
                </Box>

                <Divider sx={{ my: 3, borderColor: "rgba(142,202,230,0.2)" }} />

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      mb: 2,
                      color: "#8ecae6",
                      fontSize: "1.2rem",
                    }}
                  >
                    Key Results
                  </Typography>

                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "#8ecae6",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SpeedIcon sx={{ fontSize: "1rem", mr: 1 }} />
                      Available Surplus Capacity
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        color: "white",
                        ml: 2,
                        fontWeight: 400,
                      }}
                    >
                      Pennsylvania can add{" "}
                      <strong style={{ color: "#8ecae6" }}>37 GW</strong> of
                      clean energy capacity through surplus interconnection,
                      including ~30 GW at thermal plants (29 GW solar + 1 GW wind) and ~4 GW at renewable plants
                      enabled by ~2.3 GW of 6-hour battery storage—all at existing sites without new transmission.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "#8ecae6",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SavingsIcon sx={{ fontSize: "1rem", mr: 1 }} />
                      Cost Savings
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        color: "white",
                        ml: 2,
                        fontWeight: 400,
                      }}
                    >
                      Surplus interconnection can save{" "}
                      <strong style={{ color: "#8ecae6" }}>$3.1 billion</strong> in
                      interconnection costs by leveraging existing infrastructure, equivalent to{" "}
                      <strong style={{ color: "#8ecae6" }}>$586 per Pennsylvania household</strong>. This conservative estimate
                      only accounts for interconnection savings—additional benefits from co-location and transmission
                      utilization would increase total savings significantly.
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 0.5,
                        color: "#8ecae6",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <SavingsIcon sx={{ fontSize: "1rem", mr: 1 }} />
                      Fast Deployment
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "0.9rem",
                        lineHeight: 1.5,
                        color: "white",
                        ml: 2,
                        fontWeight: 400,
                      }}
                    >
                      Surplus interconnection projects can be completed in{" "}
                      <strong style={{ color: "#8ecae6" }}>12-18 months</strong>{" "}
                      compared to{" "}
                      <strong style={{ color: "#8ecae6" }}>4-5 years</strong> for
                      standard queue projects. PJM's 2025 FERC-approved reforms streamline SIS eligibility,
                      enabling rapid deployment when no network upgrades are triggered.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
