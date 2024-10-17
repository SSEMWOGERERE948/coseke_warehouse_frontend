import React, { useEffect, useState } from "react";
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
import { AxiosInstance } from "../../core/baseURL";

// Register the components for the chart
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  PointElement,
);

interface CaseStudy {
  id: number;
  name: string;
  enabled: boolean;
}

interface Log {
  date: string;
  type: string;
  message: string;
  user: string | null;
}

export default function DashboardContent() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [caseStudyCount, setCaseStudyCount] = useState(0); // State for case study count

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
      value: caseStudyCount.toString(),
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

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await AxiosInstance.get("case-studies/all");
      const fetchedCaseStudies = response.data.map((study: any) => ({
        id: study.id,
        name: study.name,
      }));
      setCaseStudies(fetchedCaseStudies);
      setCaseStudyCount(fetchedCaseStudies.length); // Update the case study count
    } catch (error: any) {
      console.error(
        "Error fetching case studies:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await AxiosInstance.get("logging/all");
      console.log(response.data); // Check the actual response
      setLogs(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
        <Typography level="h4">Recent Logs</Typography>
        <table
          style={{ width: "100%", border: "1px solid #ddd", marginTop: "10px" }}
        >
          <thead>
            <tr>
              <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Type</th>
              <th style={{ padding: "8px", textAlign: "left" }}>Message</th>
              <th style={{ padding: "8px", textAlign: "left" }}>User</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(logs) &&
              logs.map((log, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px" }}>{log.date}</td>
                  <td style={{ padding: "8px" }}>{log.type}</td>
                  <td style={{ padding: "8px" }}>{log.message}</td>
                  <td style={{ padding: "8px" }}>{log.user || "N/A"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
