import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import DashboardContent from "./DashboardContent";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        {location.pathname === "/dashboard" ? <DashboardContent /> : <Outlet />}
      </Box>
    </CssVarsProvider>
  );
}
