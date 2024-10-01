import Box from "@mui/joy/Box";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Outlet />
      </Box>
    </CssVarsProvider>
  );
}
