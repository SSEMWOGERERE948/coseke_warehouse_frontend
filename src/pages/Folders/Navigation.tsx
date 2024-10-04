import React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListSubheader from "@mui/joy/ListSubheader";
import { useFileContext } from "./FileContext";

type Tag = "Clinic" | "Lab" | "Pharmacy" | "Regulatory Team";

export default function Navigation() {
  const { selectedTag, setSelectedTag, setFileData } = useFileContext();

  const handleTagClick = (tag: Tag) => {
    setSelectedTag(tag);

    const fileDataByTag: Record<
      Tag,
      {
        folderName: string;
        lastModified: string;
        size: string;
        avatars: string[];
      }[]
    > = {
      Clinic: [
        {
          folderName: "Clinic Folder",
          lastModified: "21 Oct 2023, 3PM",
          size: "987.5MB",
          avatars: [
            "https://i.pravatar.cc/24?img=6",
            "https://i.pravatar.cc/24?img=7",
          ],
        },
        {
          folderName: "Clinic Reports",
          lastModified: "18 Oct 2023, 1PM",
          size: "500MB",
          avatars: ["https://i.pravatar.cc/24?img=8"],
        },
      ],
      Lab: [
        {
          folderName: "Lab Results",
          lastModified: "20 Oct 2023, 9AM",
          size: "700MB",
          avatars: ["https://i.pravatar.cc/24?img=9"],
        },
      ],
      Pharmacy: [
        {
          folderName: "Pharmacy Orders",
          lastModified: "19 Oct 2023, 11AM",
          size: "300MB",
          avatars: ["https://i.pravatar.cc/24?img=10"],
        },
      ],
      "Regulatory Team": [
        {
          folderName: "Regulatory Docs",
          lastModified: "17 Oct 2023, 4PM",
          size: "1.2GB",
          avatars: [
            "https://i.pravatar.cc/24?img=11",
            "https://i.pravatar.cc/24?img=12",
          ],
        },
      ],
    };

    setFileData(fileDataByTag[tag]);
  };

  return (
    <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
      <ListItem nested sx={{ mt: 2 }}>
        <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
          Tags
        </ListSubheader>
        <List
          aria-labelledby="nav-list-tags"
          size="sm"
          sx={{
            "--ListItemDecorator-size": "32px",
            "& .JoyListItemButton-root": { p: "8px" },
          }}
        >
          {[
            { name: "Clinic", color: "primary.500" },
            { name: "Lab", color: "danger.500" },
            { name: "Pharmacy", color: "warning.400" },
            { name: "Regulatory Team", color: "success.400" },
          ].map((tag) => (
            <ListItem key={tag.name}>
              <ListItemButton
                selected={selectedTag === tag.name}
                onClick={() => handleTagClick(tag.name as Tag)}
              >
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "99px",
                      bgcolor: tag.color,
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent>{tag.name}</ListItemContent>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </ListItem>
    </List>
  );
}
