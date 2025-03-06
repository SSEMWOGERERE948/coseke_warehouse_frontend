import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Table,
  Typography,
  Sheet,
  CircularProgress,
  Chip,
} from "@mui/joy";
import { SearchRounded } from "@mui/icons-material";
import { getCurrentUser } from "../../utils/helpers";
import { getRequestsService } from "./requests_api";

interface IRequest {
  id: number;
  boxNumber?: number;
  checkedOutBy: number | null;
  status: string;
  organization?: { id: number; name: string } | null;
  organizationName?: string; // ✅ Use extracted organization name
  createdDate: string;
  requestType?: string;
  requestDate?: any;
  completedDate?: any;
}

export default function RequestTable() {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const currentUser = getCurrentUser();
  const isAdmin = currentUser.roles.some((role) => role.name === "SUPER_ADMIN");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequestsService(isAdmin);

      // ✅ Transform data: Extract organization name and format dates
      const formattedData = data.map((req: any) => ({
        ...req,
        organizationName: req.organization ? req.organization.name : "N/A", // Extract organization name
        requestDate: req.requestDate
          ? new Date(
              req.requestDate[0], // Year
              req.requestDate[1] - 1, // Month (0-based in JS)
              req.requestDate[2], // Day
              req.requestDate[3], // Hour
              req.requestDate[4], // Minute
              req.requestDate[5], // Second
            ).toLocaleString("en-US", { hour12: false })
          : "N/A",
        completedDate: req.completedDate
          ? new Date(
              req.completedDate[0],
              req.completedDate[1] - 1,
              req.completedDate[2],
              req.completedDate[3],
              req.completedDate[4],
              req.completedDate[5],
            ).toLocaleString("en-US", { hour12: false })
          : "N/A",
      }));

      setRequests(formattedData);
    } catch (error) {
      console.error("Error fetching file requests:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
      <Typography level="h2" sx={{ mb: 3, fontWeight: "bold" }}>
        File Requests
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Input
          startDecorator={<SearchRounded />}
          placeholder="Search requests..."
          size="md"
          sx={{ width: 300 }}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <Sheet sx={{ width: "100%", overflow: "auto", backgroundColor: "white" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table hoverRow>
            <thead>
              <tr>
                <th>ID</th>
                <th>Box Number</th>
                <th>Request Type</th>
                <th>Status</th>
                <th>Organization</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.id}</td>
                  <td>{request.boxNumber || "N/A"}</td>
                  <td>{request.requestType || "N/A"}</td>
                  <td>
                    <Chip
                      color={
                        request.status === "Unavailable" ? "danger" : "success"
                      }
                    >
                      {request.status}
                    </Chip>
                  </td>
                  <td>{request.organizationName || "N/A"}</td>
                  <td>{request.requestDate || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Sheet>
    </Box>
  );
}
