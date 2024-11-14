import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Sheet,
  Table,
  Typography,
  Chip,
  Modal,
  ModalDialog,
  ModalClose,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Option,
  CircularProgress,
} from "@mui/joy";
import {
  CheckCircle,
  MoreVert,
  SearchRounded,
  Mediation,
} from "@mui/icons-material";
import { Divider } from "@mui/material";
import { AxiosInstance } from "../../core/baseURL";
import IFile from "../../interfaces/IFile";
import { convertArrayToDate, getCurrentUser } from "../../utils/helpers";
import { createRequest } from "../Requests/requests_api";
import { IRequests } from "../../interfaces/IRequests";
import {
  checkInFileService,
  updateFileService,
  deleteFileService,
  getAllFilesService,
} from "./files_api";
import { EditIcon, DeleteIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as XLSX from "xlsx";

export default function FileTable() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  // State for menu and dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);
  const [activeFileId, setActiveFileId] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedFile, setUpdatedFile] = useState<IFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 25, 50];
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });
  const [fileStatus, setFileStatus] = React.useState<string>("all"); // Track selected file status

  // Helper function to format date arrays
  const formatDate = (dateArray?: number[]) => {
    if (!dateArray) return "N/A";
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    return date.toLocaleDateString();
  };

  // Flatten and filter data based on date range
  const prepareDataForExport = () => {
    return files
      .filter((file) => {
        // Apply date filtering only if both start and end dates are provided
        if (dateRange.start && dateRange.end) {
          const fileDate = file.createdDate
            ? new Date(
                file.createdDate[0],
                file.createdDate[1] - 1,
                file.createdDate[2],
              )
            : null;
          return (
            fileDate && fileDate >= dateRange.start && fileDate <= dateRange.end
          );
        }
        return true; // No date filtering if either start or end date is missing
      })
      .map((file) => ({
        ID: file.id || "N/A",
        PID: file.pid,
        "Box Number": file.boxNumber,
        Status: file.status,
        "Responsible Person": file.responsibleUser
          ? `${file.responsibleUser.first_name} ${file.responsibleUser.last_name}`
          : "N/A",
        Email: file.responsibleUser?.email || "N/A",
        "Date Created": formatDate(file.createdDate),
        "Last Modified Date": formatDate(file.lastModifiedDateTime),
        "Created By": file.createdBy,
      }));
  };

  const handleExportToExcel = () => {
    const data = prepareDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(data); // Convert files array to worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Files Report");

    // Generate and trigger Excel download
    XLSX.writeFile(workbook, "Files Report.xlsx");
  };

  const user = getCurrentUser();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    file: IFile,
  ) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setActiveFileId(file.id!);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setActiveFileId(null);
  };

  const handleDialogClose = () => {
    setOpenUpdateDialog(false);
    setUpdatedFile(null);
  };

  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  const roleNames = userRoles
    .map((role: { name: any }) => role.name)
    .filter(Boolean);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);

        if (roleNames.includes("SUPER_ADMIN")) {
          const files = await getAllFilesService();
          setFiles(Array.isArray(files) ? files : []);
        } else if (
          roleNames.includes("MANAGER") ||
          roleNames.includes("USER")
        ) {
          const userId = currentUser?.id; // Use user ID here
          if (userId) {
            const response = await AxiosInstance.get(
              `files/by-departments/${userId}`,
            );
            console.log("response", response);
            setFiles(Array.isArray(response.data) ? response.data : []);
          }
        }
      } catch (error) {
        console.error("Error fetching files:", error);
        setError("Failed to fetch files. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const getStatusChip = (status: string) => {
    return status === "Available" ? (
      <Chip variant="soft" color="success">
        Available
      </Chip>
    ) : (
      <Chip variant="soft" color="danger">
        Unavailable
      </Chip>
    );
  };

  const filteredFiles = files.filter((file) => {
    // Filter by search term
    const matchesSearch = file.id
      ? file.pid?.toLowerCase().includes(search.toLowerCase())
      : false;

    // Filter by file status (available, unavailable, all)
    const matchesStatus = fileStatus === "all" || file.status === fileStatus;

    return matchesSearch && matchesStatus;
  });

  const handleRequestCheckout = async (requests: IRequests) => {
    setLoading(true);
    try {
      if (requests.files.status === "Unavailable") {
        alert("File is currently unavailable");
        return;
      }
      const res = await createRequest(requests);
      alert("Request created successfully");
      handleMenuClose();
      // Optionally refresh the files list here to update the status
      const updatedFiles = await AxiosInstance.get(
        roleNames.includes("SUPER_ADMIN")
          ? "files/all"
          : `files/all/${currentUser?.id}`,
      );
      setFiles(updatedFiles.data);
    } catch (error: any) {
      console.error(
        "Error requesting checkout:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCheckin = async (file: IFile) => {
    setLoading(true);
    try {
      const res = await checkInFileService(file.id!);
      alert("File checked in successfully");
      handleMenuClose();
      // Optionally refresh the files list here to update the status
      const updatedFiles = await AxiosInstance.get(
        roleNames.includes("SUPER_ADMIN")
          ? "files/all"
          : `files/all/${currentUser?.id}`,
      );
      setFiles(updatedFiles.data);
    } catch (error: any) {
      console.error(
        "Error requesting check in!:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFile = async () => {
    if (!updatedFile) return;
    try {
      await updateFileService(updatedFile.id!, updatedFile);
      alert("File updated successfully");
      handleDialogClose();
      // Refresh the file list
      const updatedFiles = files.map((file) =>
        file.id === updatedFile.id ? updatedFile : file,
      );
      setFiles(updatedFiles);
    } catch (error: any) {
      console.error(
        "Error updating file:",
        error.response?.data || error.message,
      );
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteFileService(id);
        alert("File deleted successfully");
        // Remove the deleted file from the list
        setFiles(files.filter((file) => file.id !== id));
      } catch (error: any) {
        console.error(
          "Error deleting file:",
          error.response?.data || error.message,
        );
      }
    }
  };

  // Flatten all the permissions from the user's roles
  const userPermissions = userRoles.flatMap(
    (role: { permissions: any }) => role.permissions || [],
  );

  // Function to check if the user has a specific permission
  const hasPermission = (permissionName: string) => {
    return userPermissions.some(
      (permission: { name: string }) => permission.name === permissionName,
    );
  };

  const totalPages = Math.ceil(filteredFiles.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const handlePageSizeChange = (
    event: React.SyntheticEvent | null,
    newValue: string | null,
  ) => {
    if (newValue) {
      setPageSize(Number(newValue));
      setPage(1); // Reset to first page when changing page size
    }
  };

  useEffect(() => {
    const filteredFiles = files.filter((file) => {
      // Filter by date range
      if (dateRange.start !== null && dateRange.end !== null) {
        const fileDate = file.createdDate
          ? new Date(
              file.createdDate[0],
              file.createdDate[1] - 1,
              file.createdDate[2],
            )
          : null;
        return (
          fileDate && fileDate >= dateRange.start && fileDate <= dateRange.end
        );
      }
      return true;
    });
    setFiles(filteredFiles);
  }, [dateRange]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 2 }}>
        Files
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Input
          startDecorator={<SearchRounded />}
          placeholder="Search for file"
          size="md"
          sx={{ width: 300 }}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Start Date label and input */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Start Date:</Typography>
          <Input
            type="date"
            placeholder="Start Date"
            onChange={(e) =>
              setDateRange({
                ...dateRange,
                start: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </Box>

        {/* End Date label and input */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>End Date:</Typography>
          <Input
            type="date"
            placeholder="End Date"
            onChange={(e) =>
              setDateRange({
                ...dateRange,
                end: e.target.value ? new Date(e.target.value) : null,
              })
            }
          />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography>Status:</Typography>
          <Select
            value={fileStatus}
            onChange={(e: any) => {
              setFileStatus(e?.target.innerText);
            }}
            sx={{ width: 150 }}
          >
            <Option value="all">All Files</Option>
            <Option value="Available">Available</Option>
            <Option value="Unavailable">Unavailable</Option>
          </Select>
        </Box>

        {/* Export to Excel button */}
        <Button onClick={handleExportToExcel} variant="solid" color="primary">
          Export to Excel
        </Button>
      </Box>
      <Sheet
        variant="outlined"
        sx={{
          width: "100%",
          overflow: "auto",
          borderRadius: "sm",
          boxShadow: "sm",
        }}
      >
        <Table hoverRow>
          <thead>
            <tr>
              <th>
                <Checkbox />
              </th>
              <th>PID</th>
              <th>Box Number</th>
              {/* <th>Responsible Person</th> */}
              <th>Status</th>
              <th>Date Modified</th>
              <th>Date Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedFiles.map((file) => (
              <tr key={file.id}>
                <td>
                  <Checkbox />
                </td>
                <td>{file.pid}</td>
                <td>{file.boxNumber}</td>
                {/* <td>
                  <Typography>
                    {file.responsibleUser?.first_name +
                      " " +
                      file.responsibleUser?.last_name}
                  </Typography>
                  <Typography>{file.responsibleUser?.email}</Typography>
                </td> */}
                <td>{getStatusChip(file.status)}</td>
                <td>
                  {file.lastModifiedDateTime
                    ? convertArrayToDate(
                        file.lastModifiedDateTime,
                      )?.toDateString()
                    : "N/A"}
                </td>
                <td>
                  {Array.isArray(file.createdDate)
                    ? convertArrayToDate(file.createdDate)!.toDateString()
                    : "N/A"}
                </td>
                <td>
                  {hasPermission("UPDATE_FILES") && (
                    <IconButton
                      size="sm"
                      onClick={() => {
                        setSelectedFile(file);
                        setUpdatedFile(file);
                        setOpenUpdateDialog(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  )}
                  {hasPermission("DELETE_FILES") && (
                    <IconButton
                      size="sm"
                      onClick={() => handleDeleteFile(file.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="sm"
                    onClick={(e) => handleMenuClick(e, file)}
                  >
                    <MoreVert />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          mt: 2,
        }}
      >
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft />
        </IconButton>
        <Typography level="body-sm">
          Page {page} of {totalPages}
        </Typography>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Single Menu component outside the table */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <Divider />
        {selectedFile?.status === "Available" ? (
          <MenuItem
            onClick={async () => {
              const returnDate = new Date();
              returnDate.setDate(returnDate.getDate() + 3);
              await handleRequestCheckout({
                files: selectedFile,
                returnDate: returnDate,
                createdBy: user.id,
              });
            }}
          >
            {loading ? <CircularProgress size="sm" /> : "Checkout"}
          </MenuItem>
        ) : (
          <MenuItem
            onClick={async () => {
              if (selectedFile) {
                await handleRequestCheckin(selectedFile);
              }
            }}
          >
            {loading ? <CircularProgress size="sm" /> : "Check-in"}
          </MenuItem>
        )}
      </Menu>

      <Modal open={openUpdateDialog} onClose={handleDialogClose}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            Update File
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateFile();
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>pid infant</FormLabel>
                <Input
                  value={updatedFile?.pid || ""}
                  onChange={(e) =>
                    setUpdatedFile((prev) => ({
                      ...prev!,
                      pidinfant: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>pid mother</FormLabel>
                <Input
                  value={updatedFile?.pid || ""}
                  onChange={(e) =>
                    setUpdatedFile((prev) => ({
                      ...prev!,
                      status: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <Button type="submit">Update File</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
