"use client";

import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ApproachSection() {
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

  // Thermal approach benefits
  const thermalBenefits = [
    {
      title: "Abundant Local Resources",
      subtitle: "~1,371 GW Potential",
      description:
        "Over 1,371 GW of combined solar and wind potential exists within 6 miles of Pennsylvania's thermal plants. This enormous renewable resource can enable clean energy deployment at existing interconnection points.",
    },
    {
      title: "Urban Area Plants",
      subtitle: "0.1 GW Capacity",
      description:
        "1 thermal facility with 0.1 GW capacity is located in urban areas. We removed this plant from the surplus interconnection analysis though it is a great candidate for adding battery storage after the thermal plant gets retired.",
    },
    {
      title: "Economic Crossover",
      subtitle: "32.7 GW Today",
      description:
        "Building new solar is already cheaper than operating 32.7 GW of Pennsylvania's existing thermal plants (96% of total thermal capacity) with IRA tax credits. This makes the vast majority of thermal sites economically viable for surplus interconnection today.",
    },
    {
      title: "Total RE Integration Potential",
      subtitle: "~30 GW by 2030",
      description:
        "Approximately 30 GW of total renewable energy (~29 GW solar + ~1 GW wind) can be economically integrated at Pennsylvania thermal plants by 2030, using existing grid connections and avoiding lengthy queue delays.",
    },
    {
      title: "Quick Wins Available",
      subtitle: "5.7 GW Ready",
      description:
        "5.7 GW of thermal capacity operates at less than 15% capacity factor, and 41% of Pennsylvania's thermal capacity operates below 30% CF, creating immediate opportunities for surplus interconnection.",
    },
  ];

  // Renewable approach benefits
  const renewableBenefits = [
    {
      title: "Renewable Resource Potential",
      subtitle: "~618 GW Total",
      description:
        "Pennsylvania's existing renewable sites have approximately 618 GW of combined solar and wind resource potential within 6 miles of existing RE plants, representing enormous opportunity for expansion.",
    },
    {
      title: "Battery Storage Integration",
      subtitle: "~2.3 GW of 6-Hour Storage",
      description:
        "Adding approximately 2.3 GW of 6-hour battery storage at Pennsylvania's solar and wind sites would deliver firm, dispatchable capacity - helping meet peak demand and enhance grid reliability.",
    },
    {
      title: "Additional RE Capacity",
      subtitle: "~4 GW Enabled",
      description:
        "Pennsylvania's existing renewable interconnections can support an additional ~4 GW of renewable capacity (2.6 GW solar + 1.6 GW wind) when paired with ~2.3 GW of 6-hour battery storage, with no new grid connections required.",
    },
    {
      title: "Maximized Utilization",
      subtitle: "80.2% Solar | 85.1% Wind",
      description:
        "Deploying storage and additional renewables at existing interconnections dramatically improves capacity factors to 80.2% for solar and 85.1% for wind plants. This transforms intermittent renewables into firm resources comparable to gas CCGT plants.",
    },
  ];

  return (
    <Box
      id="approach-section"
      ref={sectionRef}
      sx={{
        py: { xs: 8, md: 10 },
        background: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 100%)",
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
            "radial-gradient(circle, rgba(180,77,18,0.08) 0%, rgba(180,77,18,0) 70%)",
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
            "radial-gradient(circle, rgba(0,86,162,0.08) 0%, rgba(0,86,162,0) 70%)",
          zIndex: 0,
        }}
      />

      <Container maxWidth="xl">
        {/* Title section removed */}

        {/* THERMAL APPROACH SECTION */}
        <Box
          sx={{
            mb: 6,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <Card
            elevation={3}
            className="fade-in-section"
            sx={{
              width: "100%",
              bgcolor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Description and Image Section - Side by Side */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  mb: 2,
                }}
              >
                {/* Left side: Description */}
                <Box sx={{ flex: 0.9, pr: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <ElectricBoltIcon
                      sx={{ fontSize: 32, color: "#B44D12", mr: 1.5 }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#ffffff",
                        fontSize: "1.8rem",
                      }}
                    >
                      Thermal Interconnections
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.95)",
                      fontSize: "1.2rem",
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    Pennsylvania has 34.2 GW of thermal capacity across 67 plants, with 5.7 GW operating at
                    less than 15% capacity factor (mostly gas peakers), leaving grid connections
                    idle most of the time. Building new solar is already cheaper than operating
                    32.7 GW (96%) of existing thermal plants with IRA tax credits. By co-locating
                    solar and wind at these sites, we can bypass lengthy PJM interconnection queues and deploy
                    approximately 30 GW of clean energy using existing infrastructure.
                  </Typography>

                  {/* Action Buttons
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        <MenuBookIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      endIcon={
                        <LaunchIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      href="https://gspp.berkeley.edu/assets/uploads/page/Surplus_Interconnection.pdf"
                      target="_blank"
                      sx={{
                        bgcolor: "#B44D12",
                        "&:hover": { bgcolor: "#933F0F" },
                        py: 0.6,
                        px: 1.2,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Technical Report
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        <SummarizeIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      endIcon={
                        <LaunchIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      href="https://surplusinterconnection.s3.us-east-1.amazonaws.com/GridLab_Surplus_Interconnection_Issue_Brief.pdf"
                      target="_blank"
                      sx={{
                        bgcolor: "#B44D12",
                        "&:hover": { bgcolor: "#933F0F" },
                        py: 0.6,
                        px: 1.2,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Issue Brief
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        <LightbulbIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      endIcon={
                        <LaunchIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      href="https://surplusinterconnection.s3.us-east-1.amazonaws.com/2025-02-21_GridLab_Surplus_Interconnection_Barriers_Report.pdf"
                      target="_blank"
                      sx={{
                        bgcolor: "#B44D12",
                        "&:hover": { bgcolor: "#933F0F" },
                        py: 0.6,
                        px: 1.2,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Barriers & Recommendations
                    </Button>
                  </Box> */}
                </Box>

                {/* Right side: Image */}
                <Box
                  sx={{
                    position: "relative",
                  }}
                >
                  <Image
                    src="/assets/thermal/idea.png"
                    alt="Thermal Plant Concept"
                    width={500}
                    height={400}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "324px",
                      objectFit: "contain",
                      borderRadius: "6px",
                    }}
                    priority
                  />
                </Box>
              </Box>

              {/* Benefits Section - Horizontal */}
              <Box>
                <Box
                  sx={{
                    borderLeft: "3px solid #B44D12",
                    pl: 2,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    Key Results
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}
                >
                  {thermalBenefits.map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: "1 1 calc(33% - 16px)",
                        minWidth: "300px",
                        p: 0,
                        borderRadius: 1,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          bgcolor: "rgba(180, 77, 18, 0.3)",
                          py: 0.75,
                          px: 1.5,
                          borderRadius: "4px 4px 0 0",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#ffffff",
                            mr: 1.5,
                          }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "#B44D12",
                            alignSelf: "center",
                          }}
                        >
                          {benefit.subtitle}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.75,
                          bgcolor: "rgba(180, 77, 18, 0.1)",
                          flexGrow: 1,
                          border: "1px solid rgba(180, 77, 18, 0.2)",
                          borderTop: "none",
                          borderRadius: "0 0 4px 4px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.95)",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* RENEWABLE APPROACH SECTION */}
        <Box sx={{ mb: 2 }}>
          <Card
            elevation={3}
            className="fade-in-section"
            sx={{
              width: "100%",
              bgcolor: "rgba(255,255,255,0.04)",
              backdropFilter: "blur(10px)",
              borderRadius: 2,
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            }}
          >
            <CardContent sx={{ p: 2 }}>
              {/* Description and Image Section - Side by Side */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  mb: 2,
                }}
              >
                {/* Left side: Description */}
                <Box sx={{ flex: 0.9, pr: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <BatteryChargingFullIcon
                      sx={{ fontSize: 32, color: "#B44D12", mr: 1.5 }}
                    />
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "#ffffff",
                        fontSize: "1.8rem",
                      }}
                    >
                      Renewable Interconnections
                    </Typography>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255,255,255,0.95)",
                      fontSize: "1.2rem",
                      lineHeight: 1.6,
                      mb: 3,
                    }}
                  >
                    Pennsylvania's 2.3 GW of existing renewable capacity operates at low capacity
                    factors—solar at 25.8% and wind at 52.0%—meaning interconnection capacity
                    sits idle much of the time. Adding approximately 2.3 GW
                    of 6-hour battery storage can enable an additional ~4 GW of renewable capacity
                    and dramatically increase capacity factors to 80.2% for solar and 85.1% for wind,
                    effectively turning variable renewables into firm power resources.
                  </Typography>

                  {/* Action Buttons */}
                  {/* Action Buttons */}
                  {/* <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      mt: 2,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        <MenuBookIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      endIcon={
                        <LaunchIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      href="https://surplusinterconnection.s3.us-east-1.amazonaws.com/2025-02-21_GridLab_Surplus_Interconnection_Technical_Paper.pdf"
                      target="_blank"
                      sx={{
                        bgcolor: "#B44D12",
                        "&:hover": { bgcolor: "#933F0F" },
                        py: 0.6,
                        px: 1.2,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Technical Report
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        <SummarizeIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      endIcon={
                        <LaunchIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      href="https://surplusinterconnection.s3.us-east-1.amazonaws.com/GridLab_Surplus_Interconnection_Issue_Brief.pdf"
                      target="_blank"
                      sx={{
                        bgcolor: "#B44D12",
                        "&:hover": { bgcolor: "#933F0F" },
                        py: 0.6,
                        px: 1.2,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Issue Brief
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={
                        <LightbulbIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      endIcon={
                        <LaunchIcon
                          sx={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        />
                      }
                      href="https://surplusinterconnection.s3.us-east-1.amazonaws.com/2025-02-21_GridLab_Surplus_Interconnection_Barriers_Report.pdf"
                      target="_blank"
                      sx={{
                        bgcolor: "#B44D12",
                        "&:hover": { bgcolor: "#933F0F" },
                        py: 0.6,
                        px: 1.2,
                        fontSize: "0.9rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Barriers & Recommendations
                    </Button>
                  </Box> */}
                </Box>

                {/* Right side: Image */}
                <Box
                  sx={{
                    position: "relative",
                  }}
                >
                  <Image
                    src="/assets/re/idea_re.png"
                    alt="Renewable Plant Enhancement"
                    width={500}
                    height={400}
                    style={{
                      width: "100%",
                      height: "100%",
                      maxHeight: "324px",
                      objectFit: "contain",
                      borderRadius: "6px",
                    }}
                    priority
                  />
                </Box>
              </Box>

              {/* Benefits Section - Horizontal */}
              <Box>
                <Box
                  sx={{
                    borderLeft: "3px solid #B44D12",
                    pl: 2,
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 600,
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    Key Results
                  </Typography>
                </Box>

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 1 }}
                >
                  {renewableBenefits.map((benefit, index) => (
                    <Box
                      key={index}
                      sx={{
                        flex: "1 1 calc(33% - 16px)",
                        minWidth: "300px",
                        p: 0,
                        borderRadius: 1,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          bgcolor: "rgba(180, 77, 18, 0.3)",
                          py: 0.75,
                          px: 1.5,
                          borderRadius: "4px 4px 0 0",
                          width: "100%",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            fontSize: "1rem",
                            color: "#ffffff",
                            mr: 1.5,
                          }}
                        >
                          {benefit.title}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "#B44D12",
                            alignSelf: "center",
                          }}
                        >
                          {benefit.subtitle}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          p: 1.75,
                          bgcolor: "rgba(180, 77, 18, 0.1)",
                          flexGrow: 1,
                          border: "1px solid rgba(180, 77, 18, 0.2)",
                          borderTop: "none",
                          borderRadius: "0 0 4px 4px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "rgba(255,255,255,0.95)",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {benefit.description}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
