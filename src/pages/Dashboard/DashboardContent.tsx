import React from "react";
import { Line } from "react-chartjs-2";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";

// Import required Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// Register the components for the chart
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const filesData = {
  labels: [
    "10k",
    "15k",
    "20k",
    "25k",
    "30k",
    "35k",
    "40k",
    "45k",
    "50k",
    "55k",
  ],
  datasets: [
    {
      label: "Files Details",
      data: [40, 50, 60, 70, 80, 63.4, 70, 65, 78, 90],
      borderColor: "rgba(75, 192, 192, 1)",
      fill: false,
      tension: 0.1,
    },
  ],
};

export default function DashboardContent() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Grid container for cards */}
      <Grid container spacing={3}>
        {/* Total Users Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography level="h4">Total Users</Typography>
              <Typography level="h4">40,689</Typography>
              <Typography level="body-lg" color="success">
                8.5% Up from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography level="h4">Total Orders</Typography>
              <Typography level="h4">10,293</Typography>
              <Typography level="body-lg" color="success">
                1.3% Up from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Sales Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography level="h4">Total Sales</Typography>
              <Typography level="h4">$89,000</Typography>
              <Typography level="body-lg" color="danger">
                4.3% Down from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Pending Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography level="h4">Total Pending</Typography>
              <Typography level="h4">2040</Typography>
              <Typography level="body-lg" color="success">
                1.8% Up from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Details Line Chart */}
      <Box sx={{ mt: 4 }}>
        <Typography level="h4">Files Details</Typography>
        <Line data={filesData} />
      </Box>
    </Box>
  );
}
