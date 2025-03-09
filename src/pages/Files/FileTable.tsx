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
  Grid,
  Card,
  CardContent,
} from "@mui/joy";
import {
  SearchRounded,
  MoreVert,
  UploadFile,
  Close,
  InfoOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";
import { AxiosInstance } from "../../core/baseURL";
import IFile from "../../interfaces/IFile";
import { getCurrentUser } from "../../utils/helpers";
import {
  checkInFileService,
  deleteFileService,
  getAllFilesService,
  addFileService,
  getAllArchivalBoxes,
  bulkUploadFilesService,
  checkOutFileService,
} from "./files_api";
import {
  EditIcon,
  DeleteIcon,
  DownloadIcon,
  FileIcon,
  CloudUpload,
} from "lucide-react";
import * as XLSX from "xlsx";
import { getAllOrganisationCreationService } from "../organisation_creation/organisation_creation_api";
import { approveRequestService } from "../Requests/requests_api";

export default function FileTable() {
  const [files, setFiles] = useState<IFile[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [pid, setPid] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddFileModalOpen, setIsAddFileModalOpen] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];
  const roleNames = userRoles
    .map((role: { name: any }) => role.name)
    .filter(Boolean);
  const [archivalBoxes, setArchivalBoxes] = useState<any[]>([]);
  const [selectedArchivalBox, setSelectedArchivalBox] = useState<number | null>(
    null,
  );
  const [boxNumber, setBoxNumber] = useState<string>("");
  const [groupedBoxes, setGroupedBoxes] = useState<Map<number, IFile[]>>(
    new Map(),
  );
  const [selectedBox, setSelectedBox] = useState<IFile | null>(null);
  const [ismetadataJsonModalOpen, setIsmetadataJsonModalOpen] = useState(false);
  const [selectedmetadataJson, setSelectedmetadataJson] = useState<Record<
    string,
    any
  > | null>(null);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<
    number | null
  >(null);
  const availableFiles = files.filter((file) => file.status === "Available");
  const unavailableFiles = files.filter(
    (file) => file.status === "Unavailable",
  );
  const [isExtracting, setIsExtracting] = useState(false);
  const isSuperAdmin = currentUser?.roles?.some(
    (role) => role.name === "SUPER_ADMIN",
  );

  // Search functionality
  const [filteredGroupedBoxes, setFilteredGroupedBoxes] = useState<
    Map<number, IFile[]>
  >(new Map());
  const [filteredMetadataJson, setFilteredMetadataJson] = useState<Record<
    string,
    any
  > | null>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  // Apply search filter whenever search term or data changes
  useEffect(() => {
    if (search.trim() === "") {
      // If search is empty, show all data
      setFilteredGroupedBoxes(groupedBoxes);
      setFilteredMetadataJson(selectedmetadataJson);
      return;
    }

    // Filter the grouped boxes
    const searchLower = search.toLowerCase();
    const filteredBoxes = new Map<number, IFile[]>();

    // Filter the main table data
    groupedBoxes.forEach((boxFiles, boxNumber) => {
      // Check if any of the searchable fields contain the search term
      const matchingFiles = boxFiles.filter(
        (file) =>
          boxNumber.toString().includes(searchLower) ||
          (file.archivalBoxName || "").toLowerCase().includes(searchLower) ||
          (file.shelfName || "").toLowerCase().includes(searchLower) ||
          (file.rackName || "").toLowerCase().includes(searchLower) ||
          (file.organizationName || "").toLowerCase().includes(searchLower),
      );

      if (matchingFiles.length > 0) {
        filteredBoxes.set(boxNumber, matchingFiles);
      }
    });

    setFilteredGroupedBoxes(filteredBoxes);

    // Filter metadata JSON if it's open
    if (selectedmetadataJson && Array.isArray(selectedmetadataJson)) {
      const filteredJson = selectedmetadataJson.filter((item) => {
        return Object.entries(item).some(([key, value]) => {
          if (typeof value === "string" || typeof value === "number") {
            return String(value).toLowerCase().includes(searchLower);
          }
          return false;
        });
      });

      setFilteredMetadataJson(filteredJson.length > 0 ? filteredJson : null);
    } else {
      setFilteredMetadataJson(null);
    }
  }, [search, groupedBoxes, selectedmetadataJson]);

  const fetchFiles = async () => {
    try {
      console.log("Fetching files...");

      const currentUser = getCurrentUser();
      const isSuperAdmin = currentUser?.roles?.some(
        (role) => role.name === "SUPER_ADMIN",
      );

      // Get files based on user's organization for non-super admins
      const fetchedFiles = await getAllFilesService(
        isSuperAdmin ? undefined : currentUser?.organizationId,
        isSuperAdmin,
      );

      const validFiles: IFile[] = Array.isArray(fetchedFiles)
        ? fetchedFiles
        : [];

      // Ensure each file has the organization info properly set
      validFiles.forEach((file) => {
        if (Array.isArray(file.metadataJson) && file.metadataJson.length > 0) {
          file.metadataJson.forEach((metadata) => {
            metadata.status = file.status; // Sync metadata with actual DB status
            metadata.organizationId = file.organizationId; // Ensure organization ID is included
          });
        }
      });

      console.log(
        "Processed Files with Extracted Status and Organization:",
        validFiles,
      );

      // Group files by box number
      const grouped = validFiles.reduce((map, file) => {
        if (!map.has(file.boxNumber)) {
          map.set(file.boxNumber, []);
        }
        map.get(file.boxNumber)?.push(file);
        return map;
      }, new Map<number, IFile[]>());

      // Update state
      setFiles(validFiles);
      setGroupedBoxes(grouped);
      setFilteredGroupedBoxes(grouped); // Initialize filtered data with all data
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getAllOrganisationCreationService();
        setOrganizations(Array.isArray(data) ? data : []); // Ensure it's always an array
      } catch (error) {
        console.error("Error fetching organizations:", error);
        setOrganizations([]); // Fallback to empty array on error
      }
    };

    fetchOrganizations();
  }, []);

  const handleViewmetadataJson = (boxFiles: IFile[]) => {
    console.log("handleViewmetadataJson called with:", boxFiles);

    if (boxFiles.length > 0) {
      const allmetadataJson: Record<string, any>[] = [];

      boxFiles.forEach((file, index) => {
        console.log(`Processing File ${index + 1}:`, file);

        try {
          if (
            Array.isArray(file.metadataJson) &&
            file.metadataJson.length > 0
          ) {
            file.metadataJson.forEach((metadata) => {
              metadata.fileId = file.id;
              metadata.organizationId = file.organizationId;

              // ✅ Remove checkedOutBy (No display, but logic intact)
              delete metadata.checkedOutBy;

              // ✅ Change "Unavailable" to "Approved"
              if (metadata.status === "Checked Out") {
                metadata.status = "Approved";
              } else if (metadata.status === "Checked In") {
                metadata.status = "Available";
              }
            });

            allmetadataJson.push(...file.metadataJson);
          }
        } catch (error) {
          console.error(
            `Error processing metadataJson for file ${index + 1}:`,
            error,
          );
        }
      });

      console.log("Final metadataJson array:", allmetadataJson);

      const jsonData = allmetadataJson.length > 0 ? allmetadataJson : null;
      setSelectedmetadataJson(jsonData);
      setFilteredMetadataJson(jsonData); // Initialize filtered data with all data
      setIsmetadataJsonModalOpen(true);
    } else {
      console.log("No box files provided to handleViewmetadataJson");
    }
  };

  const updateStatusCounts = () => {
    const available = files.filter(
      (file) => file.status === "Available",
    ).length;
    const unavailable = files.filter(
      (file) => file.status === "Unavailable",
    ).length;

    setSelectedmetadataJson((prevMetadata) => {
      if (!Array.isArray(prevMetadata)) return [];
      return prevMetadata.map((data) =>
        data.status === "Available"
          ? { ...data, available }
          : { ...data, unavailable },
      );
    });
  };

  const handleToggleFileStatus = async (
    fileId: number,
    currentStatus: string,
    fileOrganizationId?: number,
  ) => {
    console.log(`🟢 Clicked: File ID ${fileId} with status: ${currentStatus}`);

    try {
      const currentUserId = currentUser?.id;
      const userOrganizationId = currentUser?.organizationId;
      const isSuperAdmin = roleNames.includes("SUPER_ADMIN");

      if (
        !isSuperAdmin &&
        fileOrganizationId &&
        fileOrganizationId !== userOrganizationId
      ) {
        alert("You can only interact with files within your organization.");
        return;
      }

      // ✅ Admin Approves & Marks as "Approved"
      if (currentStatus === "Pending" && isSuperAdmin) {
        await approveRequestService(fileId);
        console.log(`✅ Admin approved request for File ID ${fileId}`);

        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, status: "Approved" } : file,
          ),
        );

        setSelectedmetadataJson((prevMetadata) => {
          if (!Array.isArray(prevMetadata)) return [];
          return prevMetadata.map((data) =>
            data.fileId === fileId ? { ...data, status: "Approved" } : data,
          );
        });

        // Also update filtered metadata
        setFilteredMetadataJson((prevMetadata) => {
          if (!Array.isArray(prevMetadata)) return [];
          return prevMetadata.map((data) =>
            data.fileId === fileId ? { ...data, status: "Approved" } : data,
          );
        });

        return;
      }

      // ✅ Only Admin can check in
      if (currentStatus === "Approved" && isSuperAdmin) {
        await checkInFileService(fileId);
        console.log(`✅ File checked in: File ID ${fileId}`);

        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === fileId ? { ...file, status: "Available" } : file,
          ),
        );

        setSelectedmetadataJson((prevMetadata) => {
          if (!Array.isArray(prevMetadata)) return [];
          return prevMetadata.map((data) =>
            data.fileId === fileId ? { ...data, status: "Available" } : data,
          );
        });

        // Also update filtered metadata
        setFilteredMetadataJson((prevMetadata) => {
          if (!Array.isArray(prevMetadata)) return [];
          return prevMetadata.map((data) =>
            data.fileId === fileId ? { ...data, status: "Available" } : data,
          );
        });

        return;
      }

      alert("Only the Admin can approve or check in files.");
    } catch (error: any) {
      console.error(`❌ Error processing file ${fileId}:`, error);
      alert(error.message);
    }
  };

  useEffect(() => {
    const fetchArchivalBoxes = async () => {
      try {
        const response = await getAllArchivalBoxes();

        // Extract all archival boxes from nested structure
        const extractArchivalBoxes = (items: any[]): any[] => {
          let boxes: any[] = [];

          items.forEach((item) => {
            if (item.type === "Archival Box") {
              boxes.push(item);
            }

            if (
              item.children &&
              Array.isArray(item.children) &&
              item.children.length > 0
            ) {
              boxes = [...boxes, ...extractArchivalBoxes(item.children)];
            }
          });

          return boxes;
        };

        // Set only the archival boxes
        const archivalBoxes = extractArchivalBoxes(response);
        setArchivalBoxes(archivalBoxes);
      } catch (error) {
        console.error("Error fetching archival boxes:", error);
      }
    };

    fetchArchivalBoxes();
  }, []);

  const handleAddFile = async () => {
    if (!selectedArchivalBox || !boxNumber || selectedFiles.length === 0) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      // Create the new file object matching the backend model
      const newFile: IFile = {
        archivalBoxId: selectedArchivalBox, // Matches new structure
        boxNumber: Number(boxNumber), // Convert to number
        metadataJson: excelData.map((row) => ({ ...row })), // Store structured metadataJson
      };

      // Call the service with the updated structure
      await addFileService(newFile);

      alert("File added successfully!");
      fetchFiles();
      setIsAddFileModalOpen(false);

      // Reset form
      setSelectedFiles([]);
      setExcelData([]);
      setColumns([]);
      setBoxNumber("");
      setSelectedArchivalBox(null);
    } catch (error) {
      console.error("Error adding file:", error);
      alert("Failed to add file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteFileService(id);
        alert("File deleted successfully");
        fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
        alert("Failed to delete file.");
      }
    }
  };

  const handleFileUpload = async () => {
    if (
      !selectedArchivalBox ||
      !boxNumber ||
      !selectedOrganization ||
      selectedFiles.length === 0
    ) {
      alert(
        "Please select an archival box, enter a box number, select an organization, and add files.",
      );
      return;
    }

    setLoading(true);
    try {
      const structuredData = excelData.map((row) => {
        const obj: Record<string, any> = {};
        columns.forEach((col, index) => {
          obj[col] = row[index]; // Map column headers to row values
        });
        return obj;
      });

      await bulkUploadFilesService(
        selectedArchivalBox,
        Number(boxNumber),
        selectedOrganization, // ✅ Send organizationId
        structuredData,
      );

      alert("Files uploaded successfully!");
      setSelectedFiles([]);
      setExcelData([]);
      setColumns([]);
      setIsAddFileModalOpen(false);
      fetchFiles();
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload files.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsExtracting(true); // ✅ Show loader while processing

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const parsedData: any[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        });

        if (parsedData.length > 0) {
          const headers = parsedData[0] as string[];
          setColumns(headers);

          const filteredRows = parsedData
            .slice(1)
            .filter((row) =>
              row.some(
                (cell) => cell !== undefined && cell !== null && cell !== "",
              ),
            );
          setExcelData(filteredRows);

          const pidColumnIndex = headers.findIndex(
            (h) => h.toLowerCase().includes("pid") || h.toLowerCase() === "id",
          );
          const pids = filteredRows
            .map((row) => row[pidColumnIndex]?.toString())
            .filter(Boolean);
          setSelectedFiles(pids);
          setAllSelected(pids.length === filteredRows.length);
        }
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process file. Please upload a valid Excel file.");
      } finally {
        setIsExtracting(false); // ✅ Hide loader after processing
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Get PIDs (assuming it's the first column or a column named PID)
      const pidColumnIndex = columns.findIndex(
        (h) => h.toLowerCase().includes("pid") || h.toLowerCase() === "id",
      );

      if (pidColumnIndex !== -1) {
        const pids = excelData
          .map((row) => row[pidColumnIndex]?.toString())
          .filter(Boolean);
        setSelectedFiles(pids);
      } else {
        const pids = excelData.map((row) => row[0]?.toString()).filter(Boolean);
        setSelectedFiles(pids);
      }
    } else {
      setSelectedFiles([]);
    }
    setAllSelected(checked);
  };

  const handleSelectFile = (pid: string) => {
    const isSelected = selectedFiles.includes(pid);
    let newSelectedFiles;

    if (isSelected) {
      newSelectedFiles = selectedFiles.filter((f) => f !== pid);
    } else {
      newSelectedFiles = [...selectedFiles, pid];
    }

    setSelectedFiles(newSelectedFiles);
    setAllSelected(newSelectedFiles.length === excelData.length);
  };

  const isPidSelected = (pid: string) => {
    return selectedFiles.includes(pid);
  };

  // Search handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5" }}>
      <Typography
        level="h2"
        sx={{ mb: 3, color: "#2c3e50", fontWeight: "bold" }}
      >
        File Management
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
          endDecorator={
            search && <Close onClick={clearSearch} sx={{ cursor: "pointer" }} />
          }
          placeholder="Search for file, box number, organization..."
          size="md"
          sx={{ width: 300, backgroundColor: "white" }}
          value={search}
          onChange={handleSearchChange}
        />

        {/* 🔥 "Add File" Button */}
        <Button
          variant="soft"
          color="success"
          onClick={() => setIsAddFileModalOpen(true)}
          startDecorator={<UploadFile />}
        >
          Add File
        </Button>
      </Box>

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
              <th>Archival Box</th>
              <th>Shelf</th>
              <th>Rack</th>
              <th>Organization</th> {/* ✅ New Column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGroupedBoxes.size > 0 ? (
              Array.from(filteredGroupedBoxes.entries()).map(
                ([boxNumber, boxFiles]) => (
                  <tr key={boxNumber}>
                    <td>{boxNumber}</td>
                    <td>{boxFiles[0]?.archivalBoxName || "N/A"}</td>
                    <td>{boxFiles[0]?.shelfName || "N/A"}</td>
                    <td>{boxFiles[0]?.rackName || "N/A"}</td>
                    <td>{boxFiles[0]?.organizationName || "N/A"}</td>
                    <td>
                      <Button
                        variant="soft"
                        color="primary"
                        onClick={() => handleViewmetadataJson(boxFiles)}
                      >
                        View files
                      </Button>
                    </td>
                  </tr>
                ),
              )
            ) : (
              <tr>
                <td
                  colSpan={6}
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  {search
                    ? "No results found for your search"
                    : "No files available"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      <Modal
        open={ismetadataJsonModalOpen}
        onClose={() => setIsmetadataJsonModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ModalDialog
          sx={{
            width: "calc(100vw - 240px)",
            maxWidth: "100%",
            height: "80vh",
            maxHeight: "90vh",
            overflow: "hidden",
            borderRadius: "lg",
            p: 3,
            backgroundColor: "background.surface",
            boxShadow: "lg",
            position: "absolute",
            left: "240px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              pb: 1,
            }}
          >
            <Typography level="title-lg">Files</Typography>

            {/* Add search in metadata modal */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Input
                startDecorator={<SearchRounded />}
                endDecorator={
                  search && (
                    <Close onClick={clearSearch} sx={{ cursor: "pointer" }} />
                  )
                }
                placeholder="Search files..."
                size="sm"
                value={search}
                onChange={handleSearchChange}
                sx={{ width: 250 }}
              />
              <ModalClose />
            </Box>
          </Box>

          {/* Status Summary Cards */}
          <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
            <Card sx={{ minWidth: 180, textAlign: "center", flex: 1 }}>
              <CardContent>
                <Typography
                  level="h3"
                  sx={{ fontWeight: "bold", color: "success.700" }}
                >
                  {filteredMetadataJson?.filter(
                    (file: { status: string }) => file.status === "Available",
                  ).length || 0}
                </Typography>
                <Typography level="body-sm" sx={{ color: "success.600" }}>
                  Available Files
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ minWidth: 180, textAlign: "center", flex: 1 }}>
              <CardContent>
                <Typography
                  level="h3"
                  sx={{ fontWeight: "bold", color: "danger.700" }}
                >
                  {filteredMetadataJson?.filter(
                    (file: { status: string }) => file.status === "Unavailable",
                  ).length || 0}
                </Typography>
                <Typography level="body-sm" sx={{ color: "danger.600" }}>
                  Unavailable Files
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Scrollable Table Container */}
          <Box sx={{ overflow: "auto", maxHeight: "calc(70vh - 120px)" }}>
            {filteredMetadataJson &&
            Array.isArray(filteredMetadataJson) &&
            filteredMetadataJson.length > 0 ? (
              <Table
                sx={{
                  width: "100%",
                  "& th": {
                    position: "sticky",
                    top: 0,
                    backgroundColor: "background.surface",
                    zIndex: 2,
                    textAlign: "left",
                    fontWeight: "bold",
                    p: "10px",
                    whiteSpace: "nowrap",
                  },
                  "& td": {
                    p: "10px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "180px", // Adjust column width dynamically
                  },
                  "& tbody tr:nth-of-type(odd)": {
                    backgroundColor: "background.level1",
                  },
                }}
              >
                <thead>
                  <tr>
                    {Object.keys(filteredMetadataJson[0] || {}).map(
                      (key, index) => (
                        <th key={index}>{key.replace(/_/g, " ")}</th>
                      ),
                    )}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetadataJson.map(
                    (
                      data: {
                        [x: string]: any;
                        status?: any;
                        fileId?: any;
                        organizationId?: any;
                      },
                      rowIndex: React.Key | null | undefined,
                    ) => (
                      <tr key={rowIndex}>
                        {Object.keys(data).map((key, colIndex) => (
                          <td key={colIndex} title={String(data[key])}>
                            {String(data[key]) || "-"}
                          </td>
                        ))}

                        {/* ✅ File Status Chip (Unchanged) */}
                        <td
                          style={{
                            textAlign: "center",
                            minWidth: "130px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <Chip
                            variant="soft"
                            color={
                              data.status === "Pending"
                                ? "warning"
                                : data.status === "Available"
                                  ? "primary"
                                  : data.status === "Approved"
                                    ? "success"
                                    : "neutral"
                            }
                            size="sm"
                            // In the Chip onClick handler
                            onClick={async () => {
                              if (data.status === "Available") {
                                try {
                                  await checkOutFileService(data.fileId);
                                  console.log(
                                    `✅ Checked out file ID: ${data.fileId}`,
                                  );

                                  // Update files state
                                  setFiles((prevFiles) =>
                                    prevFiles.map((file) =>
                                      file.id === data.fileId
                                        ? { ...file, status: "Unavailable" }
                                        : file,
                                    ),
                                  );

                                  // ADDED: Also update the selectedmetadataJson state to "Pending"
                                  setSelectedmetadataJson((prevMetadata) => {
                                    if (!Array.isArray(prevMetadata)) return [];
                                    return prevMetadata.map((item) =>
                                      item.fileId === data.fileId
                                        ? { ...item, status: "Pending" }
                                        : item,
                                    );
                                  });
                                } catch (error) {
                                  console.error(
                                    "❌ Error checking out file:",
                                    error,
                                  );
                                }
                              }
                            }}
                            disabled={data.status !== "Available"}
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: "120px",
                              minWidth: "120px",
                              maxWidth: "120px",
                              textAlign: "center",
                              padding: "6px",
                              fontSize: "12px",
                              whiteSpace: "nowrap",
                              height: "32px",
                              boxSizing: "border-box",
                              margin: "0 auto",
                              cursor:
                                data.status === "Available"
                                  ? "pointer"
                                  : "default",
                              "&.Mui-disabled": {
                                opacity: 0.6,
                              },
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {/* Icon based on status */}
                            <span
                              style={{
                                display: "inline-flex",
                                width: "20px",
                                marginRight: "4px",
                                justifyContent: "center",
                              }}
                            >
                              {data.status === "Pending" ? (
                                <InfoOutlined fontSize="small" />
                              ) : data.status === "Available" ? (
                                <DownloadIcon fontSize="small" />
                              ) : data.status === "Approved" ? (
                                <CheckCircleOutline fontSize="small" />
                              ) : (
                                <CheckCircleOutline fontSize="small" />
                              )}
                            </span>

                            {/* Status Text */}
                            <span>
                              {data.status === "Pending"
                                ? "Pending"
                                : data.status === "Available"
                                  ? "Check Out"
                                  : "Checked Out"}
                            </span>
                          </Chip>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </Table>
            ) : (
              <Typography level="body-md" sx={{ textAlign: "center", p: 2 }}>
                No metadata JSON available for this box.
              </Typography>
            )}
          </Box>
        </ModalDialog>
      </Modal>

      {/* File Upload Modal */}
      <Modal
        open={isAddFileModalOpen}
        onClose={() => {
          if (loading) return; // Prevent closing while uploading
          setIsAddFileModalOpen(false);
          setExcelData([]);
          setColumns([]);
          setSelectedFiles([]);
          setBoxNumber("");
          setSelectedArchivalBox(null);
          setFile(null);
        }}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <ModalDialog
          sx={{
            maxWidth: "900px",
            width: "90%",
            borderRadius: "lg",
            overflow: "hidden",
            p: 0,
            boxShadow: "lg",
          }}
        >
          {/* Modal Header */}
          <Box
            sx={{
              p: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid",
              borderColor: "divider",
              backgroundColor: "primary.softBg",
            }}
          >
            <Typography
              level="title-lg"
              sx={{ fontWeight: "bold", color: "primary.700" }}
            >
              {excelData.length > 0 ? "Review Upload Files" : "Upload Files"}
            </Typography>

            <ModalClose
              disabled={loading}
              sx={{
                borderRadius: "50%",
                "&:hover": { backgroundColor: "neutral.softHoverBg" },
              }}
            />
          </Box>

          {/* Modal Content */}
          <Box sx={{ p: 0 }}>
            {/* Step Indicator */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                backgroundColor: "background.level1",
              }}
            >
              <Chip
                variant="soft"
                color="primary"
                size="sm"
                sx={{ fontWeight: "medium" }}
              >
                {excelData.length > 0 ? "Step 2/2" : "Step 1/2"}
              </Chip>
              <Typography
                level="body-sm"
                sx={{ ml: 1.5, color: "text.secondary" }}
              >
                {excelData.length > 0
                  ? "Review and confirm file information"
                  : "Select files to upload"}
              </Typography>
            </Box>

            {/* Selection Fields */}
            <Grid container spacing={2} sx={{ p: 2.5 }}>
              {/* Archival Box Selection */}
              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Archival Box</FormLabel>
                  <Select
                    placeholder={
                      archivalBoxes.length > 0
                        ? "Select an archival box"
                        : "Loading archival boxes..."
                    }
                    value={
                      selectedArchivalBox !== null
                        ? selectedArchivalBox.toString()
                        : ""
                    }
                    onChange={(e, value) =>
                      setSelectedArchivalBox(value ? Number(value) : null)
                    }
                    size="md"
                    disabled={archivalBoxes.length === 0}
                  >
                    {archivalBoxes.length > 0 ? (
                      archivalBoxes.map((box) => (
                        <Option key={box.id} value={box.id.toString()}>
                          {box.name}
                        </Option>
                      ))
                    ) : (
                      <Option key="no-boxes" value="" disabled>
                        No archival boxes available
                      </Option>
                    )}
                  </Select>
                </FormControl>
              </Grid>

              {/* Box Number Input */}
              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Box Number</FormLabel>
                  <Input
                    type="number"
                    value={boxNumber}
                    onChange={(e) => setBoxNumber(e.target.value)}
                    placeholder="Enter box number"
                    size="md"
                  />
                </FormControl>
              </Grid>

              {/* Organization Selection */}
              <Grid xs={12} sm={6}>
                <FormControl>
                  <FormLabel>Organization</FormLabel>
                  <Select
                    placeholder={
                      organizations.length > 0
                        ? "Select an organization"
                        : "Loading organizations..."
                    }
                    value={
                      selectedOrganization !== null
                        ? selectedOrganization.toString()
                        : ""
                    }
                    onChange={(e, value) =>
                      setSelectedOrganization(value ? Number(value) : null)
                    }
                    size="md"
                    disabled={organizations.length === 0}
                  >
                    {organizations.length > 0 ? (
                      organizations.map((org) => (
                        <Option key={org.id} value={org.id.toString()}>
                          {org.name}
                        </Option>
                      ))
                    ) : (
                      <Option key="no-orgs" value="" disabled>
                        No organizations available
                      </Option>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* File Upload Area */}
            {!excelData.length && (
              <Box
                sx={{
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    border: "2px dashed",
                    borderColor: "neutral.outlinedBorder",
                    borderRadius: "md",
                    p: 4,
                    width: "100%",
                    textAlign: "center",
                    backgroundColor: file
                      ? "success.softBg"
                      : "background.level1",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: "primary.outlinedHoverBorder",
                      backgroundColor: "primary.softHoverBg",
                    },
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    document.getElementById("excel-file-upload")?.click()
                  }
                >
                  <Input
                    type="file"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] || null);
                      handleFileSelect(e);
                    }}
                    slotProps={{
                      input: {
                        accept: ".xlsx, .xls",
                        style: { display: "none" },
                      },
                    }}
                    sx={{ display: "none" }}
                    id="excel-file-upload"
                  />

                  {file ? (
                    isExtracting ? (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <CircularProgress size="md" />
                        <Typography
                          level="body-md"
                          fontWeight="md"
                          sx={{ color: "primary.600" }}
                        >
                          Extracting file data...
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FileIcon
                          size={24}
                          color="var(--joy-palette-success-600)"
                        />
                        <Typography
                          level="body-md"
                          fontWeight="md"
                          sx={{ color: "success.600" }}
                        >
                          {file.name}
                        </Typography>
                      </Stack>
                    )
                  ) : (
                    <Stack alignItems="center" spacing={1.5}>
                      <CloudUpload
                        size={36}
                        color="var(--joy-palette-primary-500)"
                      />
                      <Typography level="title-sm" fontWeight="md">
                        Click to upload Excel file
                      </Typography>
                      <Typography
                        level="body-sm"
                        sx={{ color: "text.secondary" }}
                      >
                        Supports .xlsx and .xls formats
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </Box>
            )}

            {/* Excel Data Preview */}
            {excelData.length > 0 && (
              <Box
                sx={{
                  maxHeight: "350px",
                  overflow: "auto",
                  borderTop: "1px solid",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  p: 0,
                }}
              >
                <Table
                  stickyHeader
                  hoverRow
                  sx={{
                    "& thead th": {
                      backgroundColor: "background.surface",
                      fontWeight: "md",
                      color: "text.primary",
                    },
                    "& tbody tr:nth-of-type(odd)": {
                      backgroundColor: "background.level1",
                    },
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: "48px" }}>
                        <Checkbox
                          checked={allSelected}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          size="sm"
                        />
                      </th>
                      {columns.map((column, index) => (
                        <th key={index}>{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {excelData.map((row, rowIndex) => {
                      const pid = row[0]?.toString();
                      return (
                        <tr key={rowIndex}>
                          <td>
                            <Checkbox
                              checked={isPidSelected(pid)}
                              onChange={() => handleSelectFile(pid)}
                              size="sm"
                            />
                          </td>
                          {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Box>
            )}

            {/* Status and Information */}
            {excelData.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "background.level1",
                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <InfoOutlined
                  sx={{ color: "primary.500", mr: 1, fontSize: "18px" }}
                />
                <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                  {selectedFiles.length} of {excelData.length} files selected
                  for upload
                </Typography>
              </Box>
            )}

            {/* Action Buttons - Ensure they are always visible */}
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.surface",
                position: "sticky",
                bottom: 0,
                zIndex: 2,
              }}
            >
              <Button
                variant="outlined"
                color="neutral"
                disabled={loading}
                onClick={() => {
                  setIsAddFileModalOpen(false);
                  setExcelData([]);
                  setColumns([]);
                  setSelectedFiles([]);
                  setBoxNumber("");
                  setSelectedArchivalBox(null);
                  setFile(null);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="soft"
                disabled={
                  loading ||
                  selectedFiles.length === 0 ||
                  !selectedArchivalBox ||
                  !boxNumber
                }
                onClick={
                  excelData.length > 0 ? handleFileUpload : handleAddFile
                }
                startDecorator={
                  loading ? <CircularProgress size="sm" /> : undefined
                }
              >
                {loading
                  ? "Uploading..."
                  : excelData.length > 0
                    ? "Upload Selected Files"
                    : "Add File"}
              </Button>
            </Box>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
