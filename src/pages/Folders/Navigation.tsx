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
import { getAllFilesService } from "../Files/files_api";
import { useFileContext } from "./FileContext";
import { convertArrayToDate } from "../../utils/helpers";

const getRandomColor = (() => {
  let step = 0;
  const baseColor = "#3498db";

  return () => {
    let r = parseInt(baseColor.slice(1, 3), 16);
    let g = parseInt(baseColor.slice(3, 5), 16);
    let b = parseInt(baseColor.slice(5, 7), 16);

    r = (r + step * 30) % 256;
    g = (g + step * 20) % 256;
    b = (b + step * 10) % 256;

    const newColor = `#${[r, g, b].map((c) => c.toString(16).padStart(2, "0")).join("")}`;
    step++;
    return newColor;
  };
})();

export default function Navigation() {
  const { selectedTag, setSelectedTag, setFileData } = useFileContext();
  const [folders, setFolders] = useState<IFolder[]>([]);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<IFolder>({
    id: 0,
    folderName: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const handleTagClick = async (name: string) => {
    setSelectedTag(name);
    try {
      const files = await getAllFilesService();
      let filteredFiles = files;
      if (name !== "All") {
        filteredFiles = files.filter(
          (file) => file.folder?.folderName === name,
        );
      }
      setFileData(filteredFiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };

  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        const response = await AxiosInstance.get("folders/all");
        setFolders([
          {
            id: 0,
            folderName: "All",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          ...response.data,
        ]);
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    };

    fetchAllFolders();
    handleTagClick("All"); // Load all files initially
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
          <IconButton onClick={handleOpenAddFolder} color="primary">
            <AddIcon />
          </IconButton>
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
            <ListItem key={folder.id}>
              <ListItemButton
                selected={selectedTag === folder.folderName}
                onClick={() => handleTagClick(folder.folderName)}
              >
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "99px",
                      bgcolor:
                        folder.folderName === "All"
                          ? "primary.main"
                          : getRandomColor(),
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent>{folder.folderName}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>

      <Modal open={isAddFolderOpen} onClose={handleCloseAddFolder}>
        <ModalDialog
          aria-labelledby="add-folder-modal-title"
          aria-describedby="add-folder-modal-description"
          sx={{
            maxWidth: "400px",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
            }}
          />
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
    </List>
  );
}
