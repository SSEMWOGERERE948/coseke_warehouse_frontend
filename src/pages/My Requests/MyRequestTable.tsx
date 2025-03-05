import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Input,
  Sheet,
  Table,
  Typography,
  CircularProgress,
} from "@mui/joy";
import { SearchRounded } from "@mui/icons-material";
import { getCurrentUser } from "../../utils/helpers";
import { getAllRequests } from "../Requests/requests_api";
import { IRequests } from "../../interfaces/IRequests";

export default function RequestedFilesTable() {
  const [requests, setRequests] = useState<IRequests[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const user = getCurrentUser();
  const isSuperAdmin = user?.roles.some((role) => role.name === "SUPER_ADMIN");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      let allRequests = await getAllRequests();

      if (!isSuperAdmin) {
        // ✅ Filter requests to show only the logged-in user's requests
        allRequests = allRequests.filter((req) => req.user?.id === user.id);
      }

      setRequests(allRequests);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // ✅ Filter requests based on search term
  const filteredRequests = requests.filter(
    (req) =>
      req.files?.boxNumber?.toString().includes(searchTerm) ||
      req.user?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.user?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.state.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
      <Typography
        level="h2"
        sx={{ mb: 3, color: "#2c3e50", fontWeight: "bold" }}
      >
        Requested Files
      </Typography>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Input
          startDecorator={<SearchRounded />}
          placeholder="Search by Box Number, Requester, or Status"
          size="md"
          sx={{ width: 300, backgroundColor: "white" }}
          onChange={handleSearch}
        />
      </Box>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 200,
          }}
        >
          <CircularProgress size="lg" />
        </Box>
      ) : (
        <Sheet
          variant="outlined"
          sx={{
            width: "100%",
            overflow: "auto",
            borderRadius: "md",
            backgroundColor: "white",
          }}
        >
          <Table hoverRow>
            <thead>
              <tr>
                <th>Box Number</th>
                <th>Organization</th>
                <th>Requester</th>
                <th>Email</th>
                <th>Status</th>
                <th>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.files?.boxNumber || "N/A"}</td>
                    <td>{req.files?.organizationName || "N/A"}</td>
                    <td>
                      {req.user?.first_name} {req.user?.last_name}
                    </td>
                    <td>{req.user?.email}</td>
                    <td>
                      <Button
                        variant="solid"
                        color={
                          req.state === "Checked Out" ? "danger" : "success"
                        }
                      >
                        {req.state}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{ textAlign: "center", padding: "16px" }}
                  >
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Sheet>
      )}
    </Box>
  );
}
