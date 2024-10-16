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
import { convertArrayToDate } from "../../utils/helpers";
import { createRequest } from "../Requests/requests_api";
import { IRequests } from "../../interfaces/IRequests";

interface CaseStudy {
  id: number;
  name: string;
  enabled: boolean;
}

export default function FileTable() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for menu and dialogs
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);
  const [openCaseStudyDialog, setOpenCaseStudyDialog] = useState(false);
  const [openFolderDialog, setOpenFolderDialog] = useState(false);
  const [caseStudy, setCaseStudy] = useState<string>("");
  const [folder, setFolder] = useState<string>("");
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);

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

  const getStatusIcon = (status: string) => {
    return status === "Available" ? (
      <CheckCircleIcon sx={{ color: "green" }} />
    ) : (
      <CancelIcon sx={{ color: "red" }} />
    );
  };

  const filteredFiles = files.filter((file) =>
    file.id
      ? file.pidinfant.toLowerCase().includes(search.toLowerCase())
      : false,
  );

  const assignFileToCaseStudy = async (fileId: number, caseStudyId: number) => {
    try {
      const response = await AxiosInstance.put(
        `files/${fileId}/assign-case-study/${caseStudyId}`,
      );
      const updatedFile = response.data;
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === updatedFile.id ? updatedFile : file,
        ),
      );
      console.log(
        `File ${updatedFile.fileName} assigned to case study ${caseStudyId}`,
      );
    } catch (error: any) {
      console.error(
        "Error assigning file to case study:",
        error.response?.data || error.message,
      );
    }
  };

  const assignFileToFolder = async (fileId: number, folderId: number) => {
    try {
      const response = await AxiosInstance.put(
        `files/${fileId}/assign-folder/${folderId}`,
      );
      const updatedFile = response.data;
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === updatedFile.id ? updatedFile : file,
        ),
      );
      console.log(
        `File ${updatedFile.fileName} assigned to folder ${folderId}`,
      );
    } catch (error: any) {
      console.error(
        "Error assigning file to folder:",
        error.response?.data || error.message,
      );
    }
  };

  const handleAssignCaseStudy = () => {
    if (selectedFile && caseStudy) {
      const selectedCaseStudy = caseStudies.find(
        (study) => study.name === caseStudy,
      );
      if (selectedCaseStudy) {
        assignFileToCaseStudy(selectedFile.id!, selectedCaseStudy.id);
      }
    }
    handleDialogClose();
  };

  const handleAssignFolder = () => {
    if (selectedFile && selectedFolder) {
      assignFileToFolder(selectedFile.id!, Number(selectedFolder.id));
    }
    handleDialogClose();
  };

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

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await AxiosInstance.get("case-studies/all");

      const fetchedCaseStudies = response.data.map((study: any) => ({
        id: study.id,
        name: study.name,
        enabled: true,
      }));

      setCaseStudies(fetchedCaseStudies);
    } catch (error: any) {
      console.error(
        "Error fetching case studies:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    try {
      const response = await AxiosInstance.get("folders/all");
      const fetchedFolders = response.data.map((folder: any) => ({
        id: folder.id,
        folderName: folder.folderName,
        createdDate: folder.createdDate,
        lastModifiedDateTime: folder.lastModifiedDateTime,
        lastModifiedBy: folder.lastModifiedBy,
        createdBy: folder.createdBy,
      }));
      setFolders(fetchedFolders);
    } catch (error: any) {
      console.error(
        "Error fetching folders:",
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
                <td>
                  {getStatusIcon(file.status)}{" "}
                  <Typography>{file.status}</Typography>
                </td>
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
                    <MenuItem onClick={handleCaseStudyDialogOpen}>
                      Assign to Case Study
                    </MenuItem>
                    <MenuItem onClick={handleFolderDialogOpen}>
                      Assign to Folder
                    </MenuItem>
                    <Divider />
                    {file.status === "Available" ? (
                      <MenuItem onClick={() => handleRequestCheckout(file)}>
                        Checkout
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={handleFolderDialogOpen}>
                        Check-in
                      </MenuItem>
                    )}
                  </Menu>

                  {/* Case Study Dialog */}
                  <DialogComponent
                    open={openCaseStudyDialog}
                    setOpen={setOpenCaseStudyDialog}
                  >
                    <Typography level="h4" fontWeight="bold" textAlign="center">
                      Assign to Case Study
                    </Typography>
                    <Table hoverRow>
                      <thead>
                        <tr>
                          <th>Case Study Name</th>
                          <th>Enabled</th>
                          <th>Select</th>
                        </tr>
                      </thead>
                      <tbody>
                        {caseStudies.map((study) => (
                          <tr key={study.id}>
                            <td>{study.name}</td>
                            <td>{study.enabled ? "Yes" : "No"}</td>
                            <td>
                              <Checkbox
                                checked={caseStudy === study.name}
                                onChange={() => setCaseStudy(study.name)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Button
                      onClick={handleAssignCaseStudy}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Assign
                    </Button>
                  </DialogComponent>

                  {/* Folder Modal */}

                  <DialogComponent
                    open={openFolderDialog}
                    setOpen={setOpenFolderDialog}
                  >
                    <Typography level="h4" fontWeight="bold" textAlign="center">
                      Assign to Folder
                    </Typography>
                    <Table hoverRow>
                      <thead>
                        <tr>
                          <th>Select</th>
                          <th>Folder Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {folders.map((folder) => (
                          <tr key={folder.id}>
                            <td>
                              <Checkbox
                                checked={selectedFolder?.id === folder.id}
                                onChange={() => setSelectedFolder(folder)}
                              />
                            </td>
                            <td>{folder.folderName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Button
                      onClick={handleAssignFolder}
                      fullWidth
                      sx={{ mt: 2 }}
                    >
                      Assign
                    </Button>
                  </DialogComponent>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
