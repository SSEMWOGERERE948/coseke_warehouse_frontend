import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import IconButton from "@mui/joy/IconButton";
import Table from "@mui/joy/Table";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { AxiosInstance } from "../../core/baseURL";

// Define the IUser, IFolder, ICaseStudy, and IFile interfaces
interface IUser {
  id: number;
  email: string;
}

type Folder = {
  id: number;
  folderName: string;
  createdDate: number[];
  lastModifiedDateTime: number[];
  lastModifiedBy: number;
  createdBy: number;
};

interface CaseStudy {
  id: number;
  name: string;
  enabled: boolean;
}

interface IFile {
  id?: number;
  fileName: string;
  responsiblePerson: string;
  dateUploaded: string;
  dateModified: string;
  PIDInfant: string;
  PIDMother: string;
  boxNumber: number;
  status: string;
  responsibleUser?: IUser;
  folder?: Folder;
  caseStudy?: CaseStudy;
  createdDate?: string;
  lastModifiedDateTime?: string;
  lastModifiedBy?: number;
  createdBy: number;
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
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

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

  const formatDate = (dateString: string | number[] | undefined) => {
    if (!dateString) return "N/A";

    let date: Date;

    if (typeof dateString === "string") {
      // Try parsing as ISO string
      date = new Date(dateString);

      // If invalid, try parsing as a Unix timestamp (milliseconds)
      if (isNaN(date.getTime())) {
        date = new Date(parseInt(dateString));
      }
    } else if (Array.isArray(dateString)) {
      // Handle array format [year, month, day, hour, minute, second]
      date = new Date(
        Date.UTC(
          dateString[0],
          dateString[1] - 1, // Month is 0-indexed
          dateString[2],
          dateString[3] || 0,
          dateString[4] || 0,
          dateString[5] || 0,
        ),
      );
    } else {
      return "Invalid Date";
    }

    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // Filter files based on the search term
  const filteredFiles = files.filter((file) =>
    file.fileName
      ? file.fileName.toLowerCase().includes(search.toLowerCase())
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
      assignFileToFolder(selectedFile.id!, selectedFolder.id);
    }
    handleDialogClose();
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
                <td>{file.fileName}</td>
                <td>
                  <Typography>{file.responsiblePerson}</Typography>
                  <Typography>{file.responsibleUser?.email}</Typography>
                </td>
                <td>
                  {getStatusIcon(file.status)}{" "}
                  <Typography>{file.status}</Typography>
                </td>
                <td>{formatDate(file.lastModifiedDateTime || "")}</td>
                <td>{formatDate(file.createdDate || "")}</td>
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
                  </Menu>

                  {/* Case Study Dialog */}
                  <Modal open={openCaseStudyDialog} onClose={handleDialogClose}>
                    <ModalDialog
                      aria-labelledby="case-study-modal-title"
                      aria-describedby="case-study-modal-description"
                      sx={{
                        maxWidth: "600px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: "md",
                        p: 3,
                        boxShadow: "lg",
                      }}
                    >
                      <ModalClose />
                      <Typography
                        level="h4"
                        fontWeight="bold"
                        textAlign="center"
                      >
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
                    </ModalDialog>
                  </Modal>

                  {/* Folder Modal */}
                  <Modal
                    open={openFolderDialog}
                    onClose={() => setOpenFolderDialog(false)}
                  >
                    <ModalDialog
                      aria-labelledby="folder-modal-title"
                      aria-describedby="folder-modal-description"
                      sx={{
                        maxWidth: "600px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        borderRadius: "md",
                        p: 3,
                        boxShadow: "lg",
                      }}
                    >
                      <ModalClose />
                      <Typography
                        level="h4"
                        fontWeight="bold"
                        textAlign="center"
                      >
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
                    </ModalDialog>
                  </Modal>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </Box>
  );
}
