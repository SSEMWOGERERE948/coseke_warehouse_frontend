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
  fileId: number;
  requestType: string;
  boxNumber?: number;
  checkedOutBy: number | null;
  status: string;
  requestDate?: number[];
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

      // ✅ Ensure `fileId` is correctly mapped from `id`
      const processedRequests = data.map((request: any) => ({
        ...request,
        fileId: request.id,
      }));

      setRequests(processedRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (
    fileId: number,
    currentStatus: string,
  ) => {
    try {
      if (currentStatus === "Pending") {
        await approveRequestService(fileId);
        console.log(`✅ Admin approved request for File ID ${fileId}`);
      } else if (currentStatus === "Approved") {
        await approveRequestService(fileId);
        console.log(`✅ Admin approved check-in for File ID ${fileId}`);
      }

      fetchRequests();
    } catch (error) {
      console.error(`❌ Error approving request ${fileId}:`, error);
    }
  };

  const handleCheckIn = async (
    fileId: number,
    currentStatus: string | undefined,
  ) => {
    if (!fileId) {
      console.error("❌ Cannot check in file: File ID is undefined");
      return;
    }

    // ✅ Only check in files with "Approved" status
    if (currentStatus !== "Approved") {
      console.error("❌ Only approved files can be checked in.");
      alert("Only approved files can be checked in.");
      return;
    }

    try {
      await checkInFileService(fileId); // ✅ Use fileId, not requestId
      console.log(`✅ File ID ${fileId} checked in successfully`);

      // ✅ Update UI after check-in
      setRequests(
        (prevRequests) => prevRequests.filter((req) => req.fileId !== fileId), // Remove checked-in request
      );

      fetchRequests(); // Refresh UI
    } catch (error) {
      console.error(`❌ Error checking in file ${fileId}:`, error);
      alert("Failed to check in file. Please try again.");
    }
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
                <th>Request ID</th>
                <th>File ID</th>
                <th>Request Type</th>
                <th>Box Number</th>
                <th>Organization</th>
                <th>Request Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) =>
                request.status !== "Completed" ? (
                  <tr key={request.id}>
                    <td>{request.id}</td>
                    <td>{request.fileId || "N/A"}</td>
                    <td>{request.requestType}</td>
                    <td>{request.boxNumber || "N/A"}</td>
                    <td>{request.organization?.name || "N/A"}</td>{" "}
                    {/* ✅ Organization name fixed */}
                    <td>
                      {request.requestDate
                        ? new Date(
                            request.requestDate[0],
                            request.requestDate[1] - 1,
                            request.requestDate[2],
                            request.requestDate[3],
                            request.requestDate[4],
                            request.requestDate[5],
                          ).toLocaleString()
                        : "N/A"}
                    </td>
                    <td>
                      <Chip
                        color={
                          request.status === "Pending" ? "warning" : "success"
                        }
                      >
                        {request.status}
                      </Chip>
                    </td>
                    <td>
                      {request.status === "Pending" && isAdmin ? (
                        <Button
                          onClick={() =>
                            handleApproveRequest(request.fileId, request.status)
                          }
                          disabled={!request.fileId}
                        >
                          Approve
                        </Button>
                      ) : request.status === "Approved" ? (
                        <Button
                          onClick={() =>
                            handleCheckIn(request.fileId, request.status)
                          } // ✅ Use request.fileId
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
