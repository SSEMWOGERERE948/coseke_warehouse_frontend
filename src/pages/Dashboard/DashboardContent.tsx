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
import PauseCircleOutlineTwoToneIcon from "@mui/icons-material/PauseCircleOutlineTwoTone";

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
  responsive: true,
};

// Card data
const cardsData = [
  {
    title: "Files",
    value: "40,689",
    icon: <PersonIcon sx={{ color: "white" }} />,
    color: "blue",
    change: "8.5% Up from yesterday",
    changeColor: "success",
  },
  {
    title: "Total Orders",
    value: "10,293",
    icon: <ShoppingCartIcon sx={{ color: "white" }} />,
    color: "purple",
    change: "1.3% Up from last week",
    changeColor: "success",
  },
  {
    title: "Total Sales",
    value: "$89,000",
    icon: <AttachMoneyIcon sx={{ color: "green" }} />,
    color: "palegreen",
    change: "4.3% Down from yesterday",
    changeColor: "danger",
  },
  {
    title: "Total Pending",
    value: "2040",
    icon: <AttachMoneyIcon sx={{ color: "white" }} />,
    color: "blue",
    change: "1.8% Up from yesterday",
    changeColor: "success",
  },
];

// Table data
const tableData = [
  {
    fileName: "Pharmacy records",
    fileID: "PH001",
    user: "Pharmacist",
    action: "Edited and removed some fields",
  },
  {
    fileName: "Medicine requests",
    fileID: "ME101",
    user: "Doctor Bushira",
    action: "Created",
  },
  {
    fileName: "Supplies",
    fileID: "PH200",
    user: "Data Inspector",
    action: "Edited",
  },
  {
    fileName: "Medicine Supplies",
    fileID: "ME005",
    user: "Manager",
    action: "Completed",
  },
];

export default function DashboardContent() {
  return (
    <Box sx={{ p: 3, width: "100%" }}>
      {/* Grid container for cards */}
      <Grid container spacing={3}>
        {cardsData.map((card, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography level="h4">{card.title}</Typography>
                  <Box
                    sx={{
                      backgroundColor: card.color,
                      borderRadius: "50%",
                      padding: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
                <Typography level="h4">{card.value}</Typography>
                <Typography level="body-sm" sx={{ color: card.changeColor }}>
                  {card.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Sales Details Line Chart */}
      <Box sx={{ mt: 4 }}>
        <Typography level="h4">Files Details</Typography>
        <Box sx={{ height: "250px", width: "100%" }}>
          <Line data={filesData} options={chartOptions} />
        </Box>
      </Box>

      {/* Table Section */}
      <Box sx={{ mt: 4, overflowX: "auto" }}>
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
            {tableData.map((row, index) => (
              <tr key={index}>
                <td style={{ padding: "8px" }}>{row.fileName}</td>
                <td style={{ padding: "8px" }}>{row.fileID}</td>
                <td style={{ padding: "8px" }}>{row.user}</td>
                <td style={{ padding: "8px" }}>{row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
