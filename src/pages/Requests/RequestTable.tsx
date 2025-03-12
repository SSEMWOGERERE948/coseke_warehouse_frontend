import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Table,
  Typography,
  Sheet,
  CircularProgress,
  Chip,
} from "@mui/joy";
import { getCurrentUser } from "../../utils/helpers";
import { getRequestsService, approveRequestService } from "./requests_api";
import { checkInFileService } from "../Files/files_api";

interface IRequest {
  id: number;
  file: {
    id: number;
    name: string;
    boxNumber?: number;
    archivalBox?: {
      id: number;
      name: string;
      shelf?: {
        id: number;
        name: string;
        rack?: {
          id: number;
          name: string;
        };
      };
    };
  };
  requestType: string;
  status: string;
  requestDate?: number[];
  completedDate?: number[] | null;
  boxNumber?: number;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  organization?: {
    id: number;
    name: string;
    dateAdded: number[];
    expiryDate: number[];
  };
}

export default function RequestTable() {
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const currentUser = getCurrentUser();
  const isAdmin = currentUser.roles.some((role) => role.name === "SUPER_ADMIN");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getRequestsService(isAdmin);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (
    requestId: number,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "Requested") {
        await approveRequestService(requestId);
        console.log(`✅ Admin approved request ${requestId}`);
      }
      fetchRequests();
    } catch (error) {
      console.error(`❌ Error approving request ${requestId}:`, error);
    }
  };

  const handleCheckIn = async (
    requestId: number,
    fileId: number,
    currentStatus: string | undefined,
  ) => {
    if (!fileId) {
      console.error("❌ Cannot check in file: File ID is undefined");
      return;
    }

    if (currentStatus !== "Approved") {
      console.error("❌ Only approved files can be checked in.");
      alert("Only approved files can be checked in.");
      return;
    }

    try {
      await checkInFileService(requestId); // Using requestId for check-in as per backend implementation
      console.log(`✅ File ID ${fileId} checked in successfully`);
      fetchRequests(); // Refresh UI
    } catch (error) {
      console.error(`❌ Error checking in file ${fileId}:`, error);
      alert("Failed to check in file. Please try again.");
    }
  };

  // Helper function to format date
  const formatDate = (dateArray?: number[]) => {
    if (!dateArray || dateArray.length < 6) return "N/A";
    return new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5],
    ).toLocaleString();
  };

  // Helper function to get user full name
  const getUserFullName = (user?: {
    first_name: string;
    last_name: string;
  }) => {
    if (!user) return "N/A";
    return `${user.first_name} ${user.last_name}`;
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
      <Typography level="h2" sx={{ mb: 3, fontWeight: "bold" }}>
        File Requests
      </Typography>

      <Sheet sx={{ width: "100%", overflow: "auto", backgroundColor: "white" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <Table hoverRow>
            <thead>
              <tr>
                <th>File id</th>
                <th>File Name</th>
                <th>Requested By</th>
                <th>Organization</th>
                <th>Rack</th>
                <th>Shelf</th>
                <th>Archival Box</th>
                <th>Box Number</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) =>
                request.status !== "Completed" ? (
                  <tr key={request.id}>
                    <td>{request.file?.id}</td>
                    <td>{request.file?.name || "Unnamed File"}</td>
                    <td>{getUserFullName(request.user)}</td>
                    <td>{request.organization?.name || "N/A"}</td>
                    <td>
                      {request.file?.archivalBox?.shelf?.rack?.name || "N/A"}
                    </td>
                    <td>{request.file?.archivalBox?.shelf?.name || "N/A"}</td>
                    <td>{request.file?.archivalBox?.name || "N/A"}</td>
                    <td>
                      {request.boxNumber || request.file?.boxNumber || "N/A"}
                    </td>
                    <td>{formatDate(request.requestDate)}</td>
                    <td>
                      <Chip
                        color={
                          request.status === "Requested" ? "warning" : "success"
                        }
                      >
                        {request.status}
                      </Chip>
                    </td>
                    <td>
                      {request.status === "Requested" && isAdmin ? (
                        <Button
                          onClick={() =>
                            handleApproveRequest(request.id, request.status)
                          }
                        >
                          Approve
                        </Button>
                      ) : request.status === "Approved" ? (
                        <Button
                          onClick={() =>
                            handleCheckIn(
                              request.id,
                              request.file.id,
                              request.status,
                            )
                          }
                        >
                          Check In
                        </Button>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ) : null,
              )}
            </tbody>
          </Table>
        )}
      </Sheet>
    </Box>
  );
}
