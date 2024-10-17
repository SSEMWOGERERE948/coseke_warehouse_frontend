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
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddTaskIcon from "@mui/icons-material/AddTask";

// Import required Chart.js components
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  PointElement,
} from "chart.js";

// Register the components for the chart
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  PointElement,
);

const filesData = {
  labels: ["5", "10", "15", "20", "25", "30"],
  datasets: [
    {
      label: "File Requests",
      data: [40, 50, 60, 70, 80, 63.4, 70, 65, 78, 90],
      borderColor: "rgba(75, 192, 192, 1)",
      fill: true,
      tension: 0.1,
    },
    {
      label: "Approved Files",
      data: [30, 40, 50, 65, 58],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      fill: false,
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      position: "right" as const,
      display: true,
    },
    title: {
      display: true,
      text: "File Requests and Approvals",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Days of the Month",
      },
    },
    y: {
      title: {
        display: true,
        text: "Number of Files",
      },
    },
  },
};

// Card data
const cardsData = [
  {
    title: "Available files",
    value: "40,689",
    icon: <ContentPasteIcon sx={{ color: "white" }} />,
    color: "blue",
    change: "Available files in the system",
    changeColor: "success",
  },
  {
    title: "Unavailable Files",
    value: "10",
    icon: <ContentPasteOffIcon sx={{ color: "white" }} />,
    color: "red",
    change: "Files that have been checkedout",
    changeColor: "success",
  },
  {
    title: "CaseStudies",
    value: "10",
    icon: <BusinessCenterIcon sx={{ color: "white" }} />,
    color: "green",
    change: "Active casestudies",
    changeColor: "danger",
  },
  {
    title: "Approvals",
    value: "5",
    icon: <AddTaskIcon sx={{ color: "white" }} />,
    color: "blue",
    change: "Current number of Approvals in the system",
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
      {
        <Box sx={{ mt: 4 }}>
          <Typography level="h4">Request and approved files</Typography>
          <Box sx={{ height: "250px", width: "100%" }}>
            <Line data={filesData} options={chartOptions} />
          </Box>
        </Box>
      }

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
