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
import { Button, Option } from "@mui/joy";

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
import { Select } from "@mui/joy";

import { AxiosInstance } from "../../core/baseURL";
import { getAllFilesService } from "../Files/files_api";
import IFile from "../../interfaces/IFile";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Title,
  Tooltip,
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
  const [pageSize, setPageSize] = useState(10); // Logs per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalLogs, setTotalLogs] = useState(0); // Total number of logs
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [scale, setScale] = useState("months");
  const [chartData, setChartData] = useState<any>(null);

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

  const [fileCount, setFileCount] = useState(0);
  const [unavailableFileCount, setUnavailableFileCount] = useState(0);
  const [approvalsCount, setApprovalsCount] = useState(0);
  const [allFilesCount, setAllFilesCount] = useState(0);

  useEffect(() => {
    fetchCaseStudies();
    fetchUnavailableFiles();
    fetchApprovals();
    fetchLogs();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await AxiosInstance.get("case-studies/all");
      const fetchedCaseStudies = response.data.map((study: any) => ({
        id: study.id,
        name: study.name,
      }));
      setCaseStudies(fetchedCaseStudies);
      setCaseStudyCount(fetchedCaseStudies.length);
    } catch (error: any) {
      console.error(
        "Error fetching case studies:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchCaseStudies();
    fetchLogs();
  }, [pageSize, currentPage]);

  const fetchUnavailableFiles = async () => {
    try {
      const response = await getAllFilesService();
      setUnavailableFileCount(
        response.filter((f: IFile) => f.status === "Unavailable").length,
      );
    } catch (error: any) {
      console.error(
        "Error fetching unavailable files:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchApprovals = async () => {
    try {
      const response = await getAllFilesService();
      setApprovalsCount(
        response.filter((f: IFile) => f.status === "Approved").length,
      );
    } catch (error: any) {
      console.error(
        "Error fetching approvals:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await AxiosInstance.get(`logging/all`, {
        params: {
          page: currentPage - 1, // API pages are usually 0-indexed
          size: pageSize,
        },
      });
      setLogs(response.data.content);
      setTotalLogs(response.data.totalElements);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
    setLoadingLogs(false);
  };

  const totalPages = Math.ceil(totalLogs / pageSize);
  const cardsData = [
    {
      title: "Available files",
      value: fileCount,
      icon: <ContentPasteIcon sx={{ color: "white" }} />,
      color: "blue",
      backgroundColor: "#BBDEFB", // Lighter blue for a soothing effect
      change: "Available files in the system",
      changeColor: "success",
    },
    {
      title: "Unavailable Files",
      value: unavailableFileCount,
      icon: <ContentPasteOffIcon sx={{ color: "white" }} />,
      color: "red",
      backgroundColor: "#FFCDD2", // Lighter red for visibility
      change: "Files that have been checked out",
      changeColor: "success",
    },
    {
      title: "Case Studies",
      value: caseStudyCount,
      icon: <BusinessCenterIcon sx={{ color: "white" }} />,
      color: "green",
      backgroundColor: "#C8E6C9", // Lighter green for positivity
      change: "Active case studies",
      changeColor: "danger",
    },
    {
      title: "Approvals",
      value: approvalsCount,
      icon: <AddTaskIcon sx={{ color: "white" }} />,
      color: "blue",
      backgroundColor: "#BBDEFB", // Consistent lighter blue
      change: "Current number of Approvals in the system",
      changeColor: "success",
    },
  ];

  // Helper function to group files by month
  const groupFilesByMonth = (files: any[]) => {
    const monthlyCounts = Array(12).fill(0); // Array of 12 months initialized to 0
    files.forEach((file) => {
      const createdDate = new Date(
        file.createdDate[0], // Year
        file.createdDate[1] - 1, // Month (0-indexed)
        file.createdDate[2], // Day
        file.createdDate[3], // Hour
        file.createdDate[4], // Minute
        file.createdDate[5], // Second
      );
      const month = createdDate.getMonth(); // Get the month (0-11)
      monthlyCounts[month]++; // Increment the count for the month
    });
    return monthlyCounts;
  };

  // Fetch the files and generate chart data
  const fetchFilesForGraph = async () => {
    try {
      const response = await getAllFilesService();
      const monthlyFileCounts = groupFilesByMonth(response);

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
            data: monthlyFileCounts,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.5)",
          },
        ],
      });
    } catch (error: any) {
      console.error(
        "Error fetching files:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchFilesForGraph();
  }, [scale]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Total Files Created Per Month",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
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

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await getAllFilesService();
      setFileCount(
        response.filter((f: IFile) => f.status === "Available").length,
      );
      setAllFilesCount(response.length);
    } catch (error: any) {
      console.error(
        "Error fetching files:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Grid container spacing={3}>
        {cardsData.map((card, index) => (
          <Grid xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{ height: "100%", backgroundColor: card.backgroundColor }}
            >
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

      <Box sx={{ mt: 4 }}>
        <Typography level="h4">Request and approved files</Typography>
        <div className="w-full max-w-3xl mx-auto p-4">
          <Select
            value={scale}
            onChange={(e, newValue) => setScale(newValue as string)}
            className="mb-4"
          >
            <option value="days">Days</option>
            <option value="months">Months</option>
            <option value="years">Years</option>
          </Select>
          {chartData && <Line options={options} data={chartData} />}
        </div>{" "}
      </Box>

      {/* Logs Table Section */}
      <Box sx={{ mt: 2, overflowX: "auto" }}>
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
            {logs.map((log, index) => (
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

      {/* Pagination Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 3,
          alignItems: "center",
        }}
      >
        <Typography>
          Showing {Math.min(logs.length, pageSize)} of {totalLogs} logs
        </Typography>

        {/* Page Size Selector */}
        {/* <Box>
          <Typography>Select logs per page:</Typography>
          <Select
            value={pageSize.toString()}
            onChange={(_, value) => {
              if (value) {
                setPageSize(Number(value));
                setCurrentPage(1); // Reset to the first page when page size changes
              }
            }}
          >
            <Option value="10">10</Option>
            <Option value="25">25</Option>
            <Option value="50">50</Option>
          </Select>
        </Box> */}

        {/* Page Navigation */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <Typography>
            {currentPage} / {totalPages}
          </Typography>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
