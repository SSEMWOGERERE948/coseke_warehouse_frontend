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
} from "./files_api";
import { EditIcon, DeleteIcon } from "lucide-react";

export default function FileTable() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for menu and dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [updatedFile, setUpdatedFile] = useState<IFile | null>(null);

  const user = getCurrentUser();

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    file: IFile,
  ) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
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
          const response = await AxiosInstance.get("files/all");
          const data: IFile[] = Array.isArray(response.data)
            ? response.data
            : [];
          setFiles(data);
        } else if (roleNames.includes("ADMIN") || roleNames.includes("USER")) {
          const id = currentUser?.id;
          if (id) {
            const response = await AxiosInstance.get(`files/all/${id}`);
            const data: IFile[] = Array.isArray(response.data)
              ? response.data
              : [];
            setFiles(data);
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

  const filteredFiles = files.filter((file) =>
    file.id
      ? file.pidinfant?.toLowerCase().includes(search.toLowerCase())
      : false,
  );

  const handleRequestCheckout = async (requests: IRequests) => {
    try {
      if (requests.files.status === "Unavailable") {
        alert("File is currently unavailable");
        return;
      }
      const res = await createRequest(requests);
      alert("Request created successfully");
      handleDialogClose();
    } catch (error: any) {
      console.error(
        "Error requesting checkout:",
        error.response?.data || error.message,
      );
    }
  };

  const handleRequestCheckin = async (file: IFile) => {
    try {
      const res = await checkInFileService(file.id!);
      alert("File checked in successfully");
      handleDialogClose();
    } catch (error: any) {
      console.error(
        "Error requesting check in!:",
        error.response?.data || error.message,
      );
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
              <th>File Name</th>
              <th>Responsible Person</th>
              <th>Status</th>
              <th>Date Modified</th>
              <th>Date Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => (
              <tr key={file.id}>
                <td>
                  <Checkbox />
                </td>
                <td>{file.pidinfant}</td>
                <td>
                  <Typography>
                    {file.responsibleUser?.first_name +
                      " " +
                      file.responsibleUser?.last_name}
                  </Typography>
                  <Typography>{file.responsibleUser?.email}</Typography>
                </td>
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
                    ? convertArrayToDate(file.createdDate)?.toDateString()
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
                  <Menu
                    anchorEl={menuAnchorEl}
                    open={Boolean(menuAnchorEl)}
                    onClose={handleMenuClose}
                  >
                    <Divider />
                    {file.status === "Available" ? (
                      <MenuItem
                        onClick={async () => {
                          const returnDate = new Date();
                          returnDate.setDate(returnDate.getDate() + 3);
                          await handleRequestCheckout({
                            files: file,
                            returnDate: returnDate,
                            createdBy: user.id,
                          });
                        }}
                      >
                        Checkout
                      </MenuItem>
                    ) : (
                      <MenuItem
                        onClick={async () => await handleRequestCheckin(file)}
                      >
                        Check-in
                      </MenuItem>
                    )}
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

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
                  value={updatedFile?.pidinfant || ""}
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
                  value={updatedFile?.pidmother || ""}
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
