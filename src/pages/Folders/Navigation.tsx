import React, { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListSubheader from "@mui/joy/ListSubheader";
import { useFileContext } from "./FileContext";
import { getAllFoldersService } from "./folders_api";
import { AxiosInstance } from "../../core/baseURL";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalClose,
  ModalDialog,
  Stack,
  Typography,
  IconButton,
} from "@mui/joy";
import AddIcon from "@mui/icons-material/Add"; // Importing Add Icon

type Folder = {
  id: number;
  folderName: string;
  createdDate: number[];
  lastModifiedDateTime: number[];
  lastModifiedBy: number;
  createdBy: number;
};

type IFileData = {
  folderName: string;
  lastModified: string;
  size: string;
  avatars: string[];
};

// Function to generate a random color
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const formatDate = (dateArray: number[]): string => {
  if (
    dateArray.length >= 6 &&
    !isNaN(
      new Date(
        dateArray[0],
        dateArray[1] - 1,
        dateArray[2],
        dateArray[3],
        dateArray[4],
        dateArray[5],
      ).getTime(),
    )
  ) {
    return new Date(
      dateArray[0],
      dateArray[1] - 1,
      dateArray[2],
      dateArray[3],
      dateArray[4],
      dateArray[5],
    ).toLocaleString();
  }
  return "Invalid Date";
};

export default function Navigation() {
  const { selectedTag, setSelectedTag, setFileData } = useFileContext();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [newFolder, setNewFolder] = useState<Folder>({
    id: 0,
    folderName: "",
    createdDate: [],
    lastModifiedDateTime: [],
    lastModifiedBy: 1,
    createdBy: 1,
  });

  const handleTagClick = (folderName: string) => {
    setSelectedTag(folderName);

    const filteredFolders: IFileData[] = (folders || [])
      .filter((folder) => folder.folderName === folderName)
      .map((folder) => ({
        folderName: folder.folderName,
        lastModified: formatDate(folder.lastModifiedDateTime),
        size: "Unknown size",
        avatars: [],
      }));

    setFileData(filteredFolders);
  };

  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        const response = await AxiosInstance.get("folders/all");
        setFolders(response.data || []);
      } catch (error) {
        console.error("Error fetching folders", error);
      }
    };

    fetchAllFolders();
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
      createdDate: [],
      lastModifiedDateTime: [],
      lastModifiedBy: 1,
      createdBy: 1,
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
            <AddIcon /> {/* Add Icon instead of Button */}
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
          {(folders || []).map((folder) => (
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
                      bgcolor: getRandomColor(), // Applying random color
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent>{folder.folderName}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>

      {/* Modal for creating new folder */}
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
