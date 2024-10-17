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
import { Select } from "@mui/joy";

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
  const [caseStudyCount, setCaseStudyCount] = useState(0);
  const [fileCount, setFileCount] = useState(0);
  const [unavailableFileCount, setUnavailableFileCount] = useState(0);
  const [approvalsCount, setApprovalsCount] = useState(0);
  const [allFilesCount, setAllFilesCount] = useState(0);

  useEffect(() => {
    fetchCaseStudies();
    fetchFiles();
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
    try {
      const response = await AxiosInstance.get("logging/all");
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const cardsData = [
    {
      title: "Available files",
      value: fileCount,
      icon: <ContentPasteIcon sx={{ color: "white" }} />,
      color: "blue",
      change: "Available files in the system",
      changeColor: "success",
    },
    {
      title: "Unavailable Files",
      value: unavailableFileCount,
      icon: <ContentPasteOffIcon sx={{ color: "white" }} />,
      color: "red",
      change: "Files that have been checked out",
      changeColor: "success",
    },
    {
      title: "Case Studies",
      value: caseStudyCount,
      icon: <BusinessCenterIcon sx={{ color: "white" }} />,
      color: "green",
      change: "Active case studies",
      changeColor: "danger",
    },
    {
      title: "Approvals",
      value: approvalsCount,
      icon: <AddTaskIcon sx={{ color: "white" }} />,
      color: "blue",
      change: "Current number of Approvals in the system",
      changeColor: "success",
    },
  ];

  const DynamicFileChart = () => {
    const [scale, setScale] = useState("months");
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
      const fetchChartData = async (scale: string) => {
        // Simulating API call with mock data
        return new Promise((resolve) => {
          setTimeout(() => {
            if (scale === "days") {
              resolve({
                labels: Array.from({ length: 30 }, (_, i) => i + 1),
                data: Array.from({ length: 30 }, () =>
                  Math.floor(Math.random() * 100),
                ),
              });
            } else if (scale === "months") {
              resolve({
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
                data: Array.from({ length: 12 }, () =>
                  Math.floor(Math.random() * 1000),
                ),
              });
            } else if (scale === "years") {
              const currentYear = new Date().getFullYear();
              resolve({
                labels: Array.from(
                  { length: 5 },
                  (_, i) => currentYear - 4 + i,
                ),
                data: Array.from({ length: 5 }, () =>
                  Math.floor(Math.random() * 10000),
                ),
              });
            }
          }, 500);
        });
      };

      const loadData = async () => {
        const data: any = await fetchChartData(scale);
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Total Files",
              data: data.data,
              borderColor: "rgb(75, 192, 192)",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
          ],
        });
      };

      loadData();
    }, [scale]);

    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: true,
          text: "Total Files in System Over Time",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: scale.charAt(0).toUpperCase() + scale.slice(1),
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

    return (
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
      </div>
    );
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
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

      <Box sx={{ mt: 4 }}>
        <Typography level="h4">Request and approved files</Typography>
        <DynamicFileChart />
      </Box>

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
    </Box>
  );
}
