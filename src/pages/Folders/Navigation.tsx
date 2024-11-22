import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
} from "@mui/joy";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListSubheader from "@mui/joy/ListSubheader";
import React, { useEffect, useState } from "react";
import { AxiosInstance } from "../../core/baseURL";
import IFolder from "../../interfaces/IFolder";
import { updateFolderService, deleteFolderService } from "./folders_api";
import { useFileContext } from "./FileContext";
import { getAllFilesService } from "../Files/files_api";
import { getCurrentUser } from "../../utils/helpers";

const getRandomColor = () => {
  return "#3498db";
};

export default function Navigation() {
  const { selectedTag, setSelectedTag, setFileData } = useFileContext();
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isEditFolderOpen, setIsEditFolderOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<IFolder>({
    id: 0,
    folderName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // Track which folder is being edited
  const [currentEditFolder, setCurrentEditFolder] = useState<IFolder | null>(
    null,
  );

  // Get the current user and their permissions
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  const roleNames = userRoles
    .map((role: { name: any }) => role.name)
    .filter(Boolean);

  const handleTagClick = async (name: string) => {
    setSelectedTag(name);
    try {
      const files = await getAllFilesService();
      let filteredFiles = [];

      if (roleNames.includes("SUPER_ADMIN")) {
        filteredFiles = files.filter(
          (file) => file.folder?.folderName === name,
        );
        console.log("filteredFiles", files);
        setFileData(filteredFiles);
      } else if (
        (roleNames.includes("SUPERVISOR") ||
          roleNames.includes("MANAGER") ||
          roleNames.includes("USER")) &&
        currentUser?.id
      ) {
        const response = await AxiosInstance.get(
          `files/by-departments/${currentUser.id}`,
        );
        filteredFiles = Array.isArray(response.data)
          ? response.data.filter((file) => file.folder?.folderName === name)
          : [];
        setFileData(filteredFiles);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        const userId = currentUser?.id;
        const response = await AxiosInstance.get(`folders/all/${userId}`);
        setFolders([...response.data]);
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    };

    fetchAllFolders();
    handleTagClick(""); // Load all files initially
  }, []);

  const handleSubmitNewFolder = async (event: React.FormEvent) => {
    event.preventDefault();

    const folderToCreate = {
      ...newFolder,
      createdDate: new Date(),
      lastModifiedDateTime: new Date(),
    };

    try {
      const response = await AxiosInstance.post("folders/add", folderToCreate);
      setFolders((prevFolders) => [...prevFolders, response.data]);
      console.log("Folder created:", response.data);
      handleCloseAddFolder();
    } catch (error) {
      console.error("Error creating folder:", error);
    }
  };

  const handleEditFolder = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure currentEditFolder is defined and has a valid id before proceeding
    if (!currentEditFolder || typeof currentEditFolder.id === "undefined") {
      console.error("No folder selected for editing or folder ID is missing.");
      return;
    }

    try {
      const updatedFolder = await updateFolderService(
        currentEditFolder.id,
        currentEditFolder,
      );
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === currentEditFolder.id ? updatedFolder : folder,
        ),
      );
      handleCloseEditFolder();
    } catch (error) {
      console.error("Error updating folder:", error);
    }
  };

  const handleDeleteFolder = async (id: number | undefined) => {
    if (typeof id === "undefined") {
      console.error("Folder ID is undefined, cannot delete folder.");
      return;
    }

    try {
      await deleteFolderService(id);
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.id !== id),
      );
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleOpenAddFolder = () => {
    setIsAddFolderOpen(true);
  };

  const handleCloseAddFolder = () => {
    setIsAddFolderOpen(false);
    setNewFolder({
      id: 0,
      folderName: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleOpenEditFolder = (folder: IFolder) => {
    setCurrentEditFolder(folder);
    setIsEditFolderOpen(true);
  };

  const handleCloseEditFolder = () => {
    setIsEditFolderOpen(false);
    setCurrentEditFolder(null);
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
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem nested sx={{ mt: 2 }}>
        <ListSubheader
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            letterSpacing: "2px",
            fontWeight: "800",
          }}
        >
          Folders
          {hasPermission("CREATE_FOLDERS") && (
            <IconButton onClick={handleOpenAddFolder} color="primary">
              <AddIcon />
            </IconButton>
          )}
        </ListSubheader>
        <List
          aria-labelledby="nav-list-tags"
          size="sm"
          sx={{
            "--ListItemDecorator-size": "32px",
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          {folders.map((folder) => (
            <ListItem
              key={folder.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemButton
                selected={selectedTag === folder.folderName}
                onClick={() => handleTagClick(folder.folderName)}
                sx={{ flexGrow: 1, mr: 6.5 }}
              >
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "99px",
                      bgcolor: getRandomColor(),
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent>{folder.folderName}</ListItemContent>
              </ListItemButton>

              <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
                {/* Edit Button - visible only if the user has UPDATE_FOLDER permission */}
                {hasPermission("UPDATE_FOLDERS") && (
                  <IconButton
                    aria-label="edit"
                    onClick={() => handleOpenEditFolder(folder)}
                    sx={{
                      padding: 0.5, // Smaller padding for smaller icon
                      fontSize: "small", // Reduces icon size
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}

                {hasPermission("DELETE_FOLDERS") && (
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteFolder(folder.id)}
                    sx={{
                      padding: 0.5,
                      fontSize: "small",
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </ListItem>

      {/* Modal for Adding Folder */}
      <Modal open={isAddFolderOpen} onClose={handleCloseAddFolder}>
        <ModalDialog>
          <ModalClose />
          <Typography level="h4" fontWeight="bold" textAlign="center">
            Create New Folder
          </Typography>
          <form onSubmit={handleSubmitNewFolder}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Folder Name</FormLabel>
                <Input
                  required
                  value={newFolder.folderName}
                  onChange={(e) =>
                    setNewFolder({ ...newFolder, folderName: e.target.value })
                  }
                />
              </FormControl>
              <Button type="submit" fullWidth>
                Create Folder
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Modal for Editing Folder */}
      {currentEditFolder && (
        <Modal open={isEditFolderOpen} onClose={handleCloseEditFolder}>
          <ModalDialog>
            <ModalClose />
            <Typography level="h4" fontWeight="bold" textAlign="center">
              Edit Folder
            </Typography>
            <form onSubmit={handleEditFolder}>
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Folder Name</FormLabel>
                  <Input
                    required
                    value={currentEditFolder.folderName}
                    onChange={(e) =>
                      setCurrentEditFolder({
                        ...currentEditFolder,
                        folderName: e.target.value,
                      })
                    }
                  />
                </FormControl>
                <Button type="submit" fullWidth>
                  Save Changes
                </Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      )}
    </List>
  );
}
