import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import { getAllFilesService } from "../Files/files_api";
import { getCurrentUser } from "../../utils/helpers";

// Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
  PointElement,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
  PointElement,
);

export default function DashboardContent() {
  // State for file counts
  const [files, setFiles] = useState<any[]>([]);
  const [fileCounts, setFileCounts] = useState({
    available: 0,
    unavailable: 0,
  });

  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current user & admin status
  const currentUser = getCurrentUser();
  const isAdmin = currentUser.roles.some((role) => role.name === "SUPER_ADMIN");

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch file counts and prepare graph data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch files based on admin status
      const fetchedFiles = await getAllFilesService(
        isAdmin ? undefined : currentUser.organizationId, // If not admin, fetch only org files
        isAdmin,
      );
      setFiles(fetchedFiles);

      // Extract counts exactly as in the file table
      const available = fetchedFiles.filter(
        (file: any) => file.status === "Available",
      ).length;
      const unavailable = fetchedFiles.filter(
        (file: any) => file.status === "Unavailable",
      ).length;

      setFileCounts({ available, unavailable });

      // Prepare chart data
      setChartData({
        labels: ["Available", "Unavailable"],
        datasets: [
          {
            label: "File Status",
            data: [available, unavailable],
            backgroundColor: ["#4CAF50", "#F44336"], // Green for available, Red for unavailable
            borderColor: ["#388E3C", "#D32F2F"],
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching file data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Box sx={{ p: 3, width: "100%", textAlign: "center" }}>
        <Typography level="h4">Loading dashboard data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Stats Cards Section */}
      <Grid container spacing={3}>
        {/* Available Files Card */}
        <Grid xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#E8F5E9" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography level="h4">Available Files</Typography>
                <Box
                  sx={{
                    backgroundColor: "#4CAF50",
                    borderRadius: "50%",
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <ContentPasteIcon sx={{ color: "white" }} />
                </Box>
              </Box>
              <Typography level="h2">{fileCounts.available}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Unavailable Files Card */}
        <Grid xs={12} sm={6}>
          <Card sx={{ backgroundColor: "#FFEBEE" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography level="h4">Unavailable Files</Typography>
                <Box
                  sx={{
                    backgroundColor: "#F44336",
                    borderRadius: "50%",
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "48px",
                    height: "48px",
                  }}
                >
                  <ContentPasteOffIcon sx={{ color: "white" }} />
                </Box>
              </Box>
              <Typography level="h2">{fileCounts.unavailable}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Typography level="h4" sx={{ mb: 2 }}>
          File Status Overview
        </Typography>
        <Card sx={{ p: 2 }}>
          <div style={{ height: "400px", width: "100%" }}>
            {chartData ? (
              <Line
                options={{ responsive: true, maintainAspectRatio: false }}
                data={chartData}
              />
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Typography>No chart data available</Typography>
              </Box>
            )}
          </div>
        </Card>
      </Box>
    </Box>
  );
}
