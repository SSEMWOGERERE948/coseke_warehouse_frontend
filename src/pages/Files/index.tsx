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

type FileData = {
  fileName: string;
  status: string;
  folder: number | null;
  caseStudy: number | null;
  boxNumber: string;
  PIDInfant: string;
  PIDMother: string;
};

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

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onClose,
  onFileCreate,
}) => {
  const [fileData, setFileData] = useState<FileData>({
    fileName: "",
    status: "Available",
    folder: null,
    caseStudy: null,
    boxNumber: "",
    PIDInfant: "",
    PIDMother: "",
  });

  const [files, setFiles] = useState<FileData[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);

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
      const newFile = {
        ...fileData,
      };

      const response = await AxiosInstance.post("files/add", newFile);
      onFileCreate(response.data);
      fetchAllFolders();
      onClose();
    } catch (error) {
      console.error("Error creating file:", error);
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
        enabled: true, // Assuming all case studies are enabled by default
      }));

      setCaseStudies(fetchedCaseStudies);
    } catch (error: any) {
      console.error(
        "Error fetching case studies:",
        error.response?.data || error.message,
      );
    }
  };

  const fetchAllFolders = async () => {
    try {
      const response = await AxiosInstance.get("folders/all");
      setFolders(response.data || []);
    } catch (error) {
      console.error("Error fetching folders", error);
    }
  };

  useEffect(() => {
    fetchAllFolders();
  }, []);

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
            <FormLabel>File Name</FormLabel>
            <Input
              name="fileName"
              value={fileData.fileName}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Status</FormLabel>
            <Select
              name="status"
              value={fileData.status}
              onChange={(_, value) =>
                setFileData((prev) => ({
                  ...prev,
                  status: value || "Available",
                }))
              }
            >
              <Option value="Available">Available</Option>
              <Option value="Unavailable">Unavailable</Option>
              <Option value="Checked Out">Checked Out</Option>
            </Select>
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
            <FormLabel>PID Infant</FormLabel>
            <Input
              name="PIDInfant"
              value={fileData.PIDInfant}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>PID Mother</FormLabel>
            <Input
              name="PIDMother"
              value={fileData.PIDMother}
              onChange={handleInputChange}
            />
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
  const [files, setFiles] = useState<FileData[]>([]); // State to store the list of files

  const handleFileCreate = (newFile: FileData) => {
    // Add the new file (FileData) to the list of files
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
