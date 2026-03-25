import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import theme from "./theme";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Surplus Interconnection in Pennsylvania",
  description:
    "Accelerating Clean Energy Deployment by Leveraging Existing Grid Infrastructure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
          {/* <Analytics /> */}
          {/* <SpeedInsights /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
