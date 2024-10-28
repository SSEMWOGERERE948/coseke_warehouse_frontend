import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { UploadRounded } from "@mui/icons-material";
import FileUploadDialogProps from "../../interfaces/IFileDialog";
import FileTable from "./FileTable";
import { AxiosInstance } from "../../core/baseURL";
import { getCurrentUser } from "../../utils/helpers";
import IUser from "../../interfaces/IUser";
import IFile from "../../interfaces/IFile";
import IFolder from "../../interfaces/IFolder";

interface CaseStudy {
  users: any;
  id: number;
  name: string;
  enabled: boolean;
}

interface FileAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  selectedFile: IFile | null;
  caseStudies: CaseStudy[];
  folders: IFolder[];
  onAssign: () => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onFileCreate,
}) => {
  const [fileData, setFileData] = useState<
    IFile & { caseStudyId?: number; folderId?: number }
  >({
    status: "Available",
    boxNumber: 0,
    pidinfant: "",
    pidmother: "",
    createdBy: 0,
    caseStudyId: undefined,
    folderId: undefined,
  });

  const [files, setFiles] = useState<IFile[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [folders, setFolders] = useState<IFolder[]>([]);
  const currentUser = getCurrentUser();
  const userEmails = [currentUser?.email];

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const newFile: IFile = {
        ...fileData,
      };

      console.log("Creating new file:", newFile);

      const response = await AxiosInstance.post("files/add", {
        ...newFile,
        caseStudy: fileData.caseStudy,
        folder: fileData.folder,
      });

      const createdFile = response.data;
      console.log("File created:", createdFile);

      onFileCreate(response.data);
      fetchAllFolders();
      onClose();
    } catch (error) {
      console.error("Error creating file:", error);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
    fetchAllFolders();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await AxiosInstance.get("case-studies/all");
      const fetchedCaseStudies = response.data;

      // Filter case studies assigned to the current user's email
      const assignedCaseStudies = fetchedCaseStudies.filter(
        (study: CaseStudy) =>
          study.users.some((user: { email: any }) =>
            userEmails.includes(user.email),
          ),
      );

      setCaseStudies(assignedCaseStudies);
    } catch (error: any) {
      console.error(
        "Error fetching case studies:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchAllFolders = async () => {
    try {
      const id = currentUser?.id;
      const response = await AxiosInstance.get(`folders/all/${id}`);
      setFolders(response.data || []);
    } catch (error) {
      console.error("Error fetching folders", error);
    }
  };

  const handleSelectChange = (
    value: number | null,
    name: "caseStudyId" | "folderId",
  ) => {
    setFileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // API to assign the file to a selected case study
  const assignFileToCaseStudy = async (fileId: number, caseStudyId: number) => {
    try {
      const response = await AxiosInstance.put(
        `files/${fileId}/assign-case-study/${caseStudyId}`,
      );
      const updatedFile = response.data;
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

  // API to assign the file to a selected folder
  const assignFileToFolder = async (fileId: number, folderId: number) => {
    try {
      const response = await AxiosInstance.put(
        `files/${fileId}/assign-folder/${folderId}`,
      );
      const updatedFile = response.data;
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

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        sx={{
          maxHeight: "80vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <ModalClose />
        <Typography level="h4" component="h2">
          Create New File
        </Typography>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel>PID Infant</FormLabel>
            <Input
              name="pidinfant"
              value={fileData.pidinfant}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>PID Mother</FormLabel>
            <Input
              name="pidmother"
              value={fileData.pidmother}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Box Number</FormLabel>
            <Input
              name="boxNumber"
              type="number"
              value={fileData.boxNumber}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Case Study</FormLabel>
            <Select
              name="caseStudyId"
              value={fileData.caseStudyId ?? null}
              onChange={(_, value) =>
                handleSelectChange(value as number | null, "caseStudyId")
              }
            >
              {caseStudies.map((study) => (
                <Option key={study.id} value={study.id}>
                  {study.name}
                </Option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Folder</FormLabel>
            <Select
              name="folderId"
              value={fileData.folderId ?? null}
              onChange={(_, value) =>
                handleSelectChange(value as number | null, "folderId")
              }
            >
              {folders.map((folder) => (
                <Option key={folder.id} value={folder.id}>
                  {folder.folderName}
                </Option>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box
          sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button onClick={onClose} variant="outlined" color="neutral">
            Cancel
          </Button>
          <Button onClick={handleSubmit} startDecorator={<UploadRounded />}>
            Create File
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
};

function Index() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<IFile[]>([]); // State to store the list of files

  const handleFileCreate = (newFile: IFile) => {
    // Add the new file (IFile) to the list of files
    setFiles((prevFiles) => [...prevFiles, newFile]);
  };

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: { xs: 2, md: 6 },
        pt: {
          xs: "calc(12px + var(--Header-height))",
          sm: "calc(12px + var(--Header-height))",
          md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100dvh",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level="h2" component="h1">
          Files
        </Typography>
        <Button
          color="primary"
          startDecorator={<UploadRounded />}
          size="sm"
          onClick={() => setOpen(true)}
        >
          Create File
        </Button>
      </Box>

      <FileUploadDialog
        open={open}
        onClose={() => setOpen(false)}
        onFileCreate={handleFileCreate}
      />
      <FileTable />
    </Box>
  );
}

export default Index;
