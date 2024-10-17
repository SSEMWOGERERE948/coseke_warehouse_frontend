import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import DialogComponent from "../../components/DialogComponent";
import { AxiosInstance } from "../../core/baseURL";
import IFile from "../../interfaces/IFile";
import IFolder from "../../interfaces/IFolder";
import { convertArrayToDate, getCurrentUser } from "../../utils/helpers";
import { createRequest } from "../Requests/requests_api";
import { IRequests } from "../../interfaces/IRequests";
import { Chip } from "@mui/joy";

export default function FileTable() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for menu and dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [openCaseStudyDialog, setOpenCaseStudyDialog] = useState(false);
  const [re, setRE] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
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

  const handleCaseStudyDialogOpen = () => {
    setOpenCaseStudyDialog(true);
    handleMenuClose();
  };

  const handleRequestDialogOpen = () => {
    setRE(true);
    handleMenuClose();
  };

  const handleFolderDialogOpen = () => {
    setOpenFolderDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenCaseStudyDialog(false);
    setOpenFolderDialog(false);
  };

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await AxiosInstance.get("files/all");
        const data: IFile[] = Array.isArray(response.data) ? response.data : [];
        console.log(data);
        setFiles(data);
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
      const res = await createRequest(requests);
    } catch (error: any) {
      console.error(
        "Error requesting checkout:",
        error.response?.data || error.message,
      );
    }
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
          startDecorator={<SearchRoundedIcon />}
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
              <th></th>
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
                  <IconButton
                    size="sm"
                    onClick={(e) => handleMenuClick(e, file)}
                  >
                    <MoreVertIcon />
                  </IconButton>

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
                      <MenuItem onClick={() => null}>Check-in</MenuItem>
                    )}
                  </Menu>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
