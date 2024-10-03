import React from "react";
import { Line } from "react-chartjs-2";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

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
      fill: true,
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  maintainAspectRatio: false,
};

export default function DashboardContent() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Grid container for cards */}
      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        alignItems="stretch"
      >
        {/* Total Users Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography level="h4">Files</Typography>
                <Box
                  sx={{
                    backgroundColor: "blue",
                    borderRadius: "50%",
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40, // Set a fixed width
                    height: 40, // Set a fixed height
                  }}
                >
                  <PersonIcon sx={{ color: "white" }} />
                </Box>
              </Box>
              <Typography level="h4">40,689</Typography>
              <Typography level="body-sm" color="success">
                8.5% Up from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Orders Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography level="h4">Total Orders</Typography>
                <Box
                  sx={{
                    backgroundColor: "purple",
                    borderRadius: "50%",
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  <ShoppingCartIcon sx={{ color: "white" }} />
                </Box>
              </Box>
              <Typography level="h4">10,293</Typography>
              <Typography level="body-sm" color="success">
                1.3% Up from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Sales Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography level="h4">Total Sales</Typography>
                <Box
                  sx={{
                    backgroundColor: "palegreen",
                    borderRadius: "50%",
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  <AttachMoneyIcon sx={{ color: "green" }} />
                </Box>
              </Box>
              <Typography level="h4">$89,000</Typography>
              <Typography
                level="body-sm"
                color="danger"
                sx={{ whiteSpace: "nowrap" }}
              >
                4.3% Down from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Pending Card */}
        <Grid component="div" xs={12} sm={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography level="h4">Total Pending</Typography>
                <Box
                  sx={{
                    backgroundColor: "blue",
                    borderRadius: "50%",
                    padding: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  }}
                >
                  <AttachMoneyIcon sx={{ color: "white" }} />
                </Box>
              </Box>
              <Typography level="h4">2040</Typography>
              <Typography level="body-sm" color="success">
                1.8% Up from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sales Details Line Chart */}
      <Box sx={{ mt: 4 }}>
        <Typography level="h4">Files Details</Typography>
        <Box sx={{ height: 250 }}>
          <Line data={filesData} options={chartOptions} />
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ mt: 4 }}>
        <Typography level="h4">Recent Orders</Typography>
        <table
          style={{ width: "100%", border: "1px solid #ddd", marginTop: "10px" }}
        >
          <thead>
            <tr>
              <th style={{ padding: "8px", textAlign: "left" }}>File Name</th>
              <th style={{ padding: "8px", textAlign: "left" }}>File ID</th>
              <th style={{ padding: "8px", textAlign: "left" }}>User</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "8px" }}>Pharmacy records</td>
              <td style={{ padding: "8px" }}>PH001</td>
              <td style={{ padding: "8px" }}>Pharmacist</td>
              <td style={{ padding: "8px" }}>Edited and removed some fields</td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Medicine requests</td>
              <td style={{ padding: "8px" }}>ME101</td>
              <td style={{ padding: "8px" }}>Doctor Bushira</td>
              <td style={{ padding: "8px" }}>Created</td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Supplies</td>
              <td style={{ padding: "8px" }}>PH200</td>
              <td style={{ padding: "8px" }}>Data Inspector</td>
              <td style={{ padding: "8px" }}>edited</td>
            </tr>
            <tr>
              <td style={{ padding: "8px" }}>Medicine Supplies</td>
              <td style={{ padding: "8px" }}>ME005</td>
              <td style={{ padding: "8px" }}>Manager</td>
              <td style={{ padding: "8px" }}>Completed</td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
