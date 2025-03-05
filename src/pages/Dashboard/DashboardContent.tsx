import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import ContentPasteOffIcon from "@mui/icons-material/ContentPasteOff";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { Select, Option } from "@mui/joy";

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

import { AxiosInstance } from "../../core/baseURL";
import { getAllFilesService } from "../Files/files_api";
import IFile from "../../interfaces/IFile";

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

// Define interfaces
interface OrganisationCreation {
  id: number;
  name: string;
  enabled?: boolean;
}

interface Log {
  date: string;
  type: string;
  message: string;
  user: string | null;
}

interface CardDataItem {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  backgroundColor: string;
  description: string;
  changeColor: string;
}

export default function DashboardContent() {
  // State management
  const [OrganisationCreation, setOrganisationCreation] = useState<
    OrganisationCreation[]
  >([]);
  const [OrganisationCreationCount, setOrganisationCreationCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [unavailableFileCount, setUnavailableFileCount] = useState(0);
  const [approvalsCount, setApprovalsCount] = useState(0);
  const [allFilesCount, setAllFilesCount] = useState(0);
  const [timeScale, setTimeScale] = useState("months");
  const [chartData, setChartData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update chart when time scale changes
  useEffect(() => {
    fetchFilesForGraph();
  }, [timeScale]);

  // Consolidated fetch function to load all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchOrganisationCreation(),
        // fetchFiles(),
        fetchFilesForGraph(),
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganisationCreation = async () => {
    try {
      const response = await AxiosInstance.get("case-studies/all");
      const fetchedOrganisationCreation = response.data.map((study: any) => ({
        id: study.id,
        name: study.name,
      }));
      setOrganisationCreation(fetchedOrganisationCreation);
      setOrganisationCreationCount(fetchedOrganisationCreation.length);
    } catch (error: any) {
      console.error(
        "Error fetching file categories:",
        error.response?.data || error.message,
      );
    }
  };

  // const fetchFiles = async () => {
  //   try {
  //     const response = await getAllFilesService();
  //     setFileCount(
  //       response.filter((f: IFile) => f.status === "Available").length,
  //     );
  //     setUnavailableFileCount(
  //       response.filter((f: IFile) => f.status === "Unavailable").length,
  //     );
  //     setApprovalsCount(
  //       response.filter((f: IFile) => f.status === "Approved").length,
  //     );
  //     setAllFilesCount(response.length);
  //   } catch (error: any) {
  //     console.error(
  //       "Error fetching files:",
  //       error.response?.data || error.message,
  //     );
  //   }
  // };

  // Helper function to group files by month
  const groupFilesByMonth = (files: any[]) => {
    const monthlyCounts = Array(12).fill(0);
    files.forEach((file) => {
      if (
        file.createdDate &&
        Array.isArray(file.createdDate) &&
        file.createdDate.length >= 2
      ) {
        const createdDate = new Date(
          file.createdDate[0], // Year
          file.createdDate[1] - 1, // Month (0-indexed)
          file.createdDate[2] || 1, // Day
          file.createdDate[3] || 0, // Hour
          file.createdDate[4] || 0, // Minute
        );
        const month = createdDate.getMonth(); // Get the month (0-11)
        monthlyCounts[month]++; // Increment the count for the month
      }
    });
    return monthlyCounts;
  };

  // Fetch files and generate chart data
  const fetchFilesForGraph = async () => {
    try {
      const response = await getAllFilesService();
      // const monthlyFileCounts = groupFilesByMonth(response);

      setChartData({
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            label: "Files Created",
            // data: monthlyFileCounts,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
          {
            label: "Files Approved",
            // data: monthlyFileCounts.map(count => Math.round(count * 0.75)), // Demo data - replace with actual approvals
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      });
    } catch (error: any) {
      console.error(
        "Error fetching files for graph:",
        error.response?.data || error.message,
      );
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Files Created and Approved Per Month",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: timeScale === "months" ? "Months" : "Days",
        },
      },
      y: {
        title: {
          display: true,
          text: "Number of Files",
        },
        beginAtZero: true,
      },
    },
  };

  // Card data
  const cardsData: CardDataItem[] = [
    {
      title: "Available Files",
      value: fileCount,
      icon: <ContentPasteIcon sx={{ color: "white" }} />,
      color: "#2196F3", // Deeper blue for better contrast
      backgroundColor: "#E3F2FD",
      description: "Available files in the system",
      changeColor: "success",
    },
    {
      title: "Unavailable Files",
      value: unavailableFileCount,
      icon: <ContentPasteOffIcon sx={{ color: "white" }} />,
      color: "#F44336", // Deeper red for better contrast
      backgroundColor: "#FFEBEE",
      description: "Files that have been checked out",
      changeColor: "success",
    },
    {
      title: "File categories",
      value: OrganisationCreationCount,
      icon: <BusinessCenterIcon sx={{ color: "white" }} />,
      color: "#4CAF50", // Deeper green for better contrast
      backgroundColor: "#E8F5E9",
      description: "Active file categories",
      changeColor: "success",
    },
    {
      title: "Approvals",
      value: approvalsCount,
      icon: <AddTaskIcon sx={{ color: "white" }} />,
      color: "#FF9800", // Deeper orange for better contrast
      backgroundColor: "#FFF3E0",
      description: "Current approvals in the system",
      changeColor: "success",
    },
  ];

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
      <Box sx={{ mb: 4 }}>
        <Typography level="h3" sx={{ mb: 2 }}>
          Dashboard Overview
        </Typography>
        <Grid container spacing={3}>
          {cardsData.map((card, index) => (
            <Grid xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: card.backgroundColor,
                  transition:
                    "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
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
                        width: "48px",
                        height: "48px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Box>
                  <Typography level="h2" sx={{ mb: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Chart Section */}
      <Box sx={{ mt: 6, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography level="h4">File Activity Analytics</Typography>
          <Select
            defaultValue="months"
            size="sm"
            onChange={(_, value) => setTimeScale(value as string)}
            sx={{ minWidth: 150 }}
          >
            <Option value="days">Daily</Option>
            <Option value="months">Monthly</Option>
            <Option value="quarters">Quarterly</Option>
          </Select>
        </Box>
        <Card sx={{ p: 2 }}>
          <div style={{ height: "400px", width: "100%" }}>
            {chartData ? (
              <Line options={chartOptions} data={chartData} />
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
