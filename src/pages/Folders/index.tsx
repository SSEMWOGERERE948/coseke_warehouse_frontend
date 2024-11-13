import {
  ArticleRounded,
  CloseRounded,
  EditRounded,
  EmailRounded,
  PeopleAltRounded,
  ShareRounded,
} from "@mui/icons-material";
import {
  AspectRatio,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListDivider,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Stack,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Typography,
} from "@mui/joy";
import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import * as React from "react";
import IFile from "../../interfaces/IFile";
import { useFileContext } from "./FileContext";
import Layout from "./Layout";
import Navigation from "./Navigation";
import TableFiles from "./TableFiles";
import { convertArrayToDate, getCurrentUser } from "../../utils/helpers";

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, label }) => (
  <Button
    variant="plain"
    color="neutral"
    component="a"
    href={`/joy-ui/getting-started/templates/${label.toLowerCase()}/`}
    size="sm"
    startDecorator={icon}
    sx={{ flexDirection: "column", "--Button-gap": 0 }}
  >
    {label}
  </Button>
);

interface DetailItemProps {
  label: string;
  value: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <>
    <Typography level="title-sm">{label}</Typography>
    <Typography level="body-sm" textColor="text.primary">
      {value}
    </Typography>
  </>
);

interface ActivityItemProps {
  avatar: string;
  action: string;
  item: string;
  chip: {
    icon: React.ReactNode;
    text: string;
  };
  date: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  avatar,
  action,
  item,
  chip,
  date,
}) => (
  <Box sx={{ display: "flex", gap: 1 }}>
    <Avatar
      size="sm"
      src={avatar}
      srcSet={`${avatar.replace("24", "48")} 2x`}
    />
    <div>
      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 1 }}>
        <Typography level="title-sm" sx={{ alignItems: "center" }}>
          You
        </Typography>
        <Typography level="body-sm">{action}</Typography>
        <Typography level="title-sm">{item}</Typography>
      </Box>
      <Chip variant="outlined" startDecorator={chip.icon}>
        {chip.text}
      </Chip>
      <Typography level="body-xs" sx={{ mt: 1 }}>
        {date}
      </Typography>
    </div>
  </Box>
);

export default function FilesExample() {
  const [drawerOpen, setDrawerOpen] = React.useState<boolean>(false);
  const { fileData, selectedFile, setSelectedFile } = useFileContext();

  const handleFileClick = (file: IFile) => {
    setSelectedFile(file);
  };

  React.useEffect(() => {
    setSelectedFile(null);
  }, [fileData]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <Navigation />
        </Layout.SideDrawer>
      )}
      <Stack
        id="tab-bar"
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "space-around",
          display: { xs: "flex", sm: "none" },
          zIndex: 999,
          bottom: 0,
          position: "fixed",
          width: "100dvw",
          py: 2,
          backgroundColor: "background.body",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {[
          { icon: <EmailRounded />, label: "Email" },
          { icon: <PeopleAltRounded />, label: "Team" },
          { icon: <ArticleRounded />, label: "Files" },
        ].map((item, index) => (
          <TabButton key={index} icon={item.icon} label={item.label} />
        ))}
      </Stack>
      <Layout.Root
        sx={[
          {
            gridTemplateColumns: {
              xs: "1fr",
              sm: "minmax(64px, 200px) minmax(450px, 1fr)",
              md: "minmax(160px, 300px) minmax(600px, 1fr) minmax(300px, 420px)",
            },
          },
          drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          },
        ]}
      >
        <Layout.SideNav>
          <Navigation />
        </Layout.SideNav>
        <Layout.Main>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 2,
            }}
          >
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "sm",
                gridColumn: "1/-1",
                display: { xs: "none", md: "flex" },
              }}
            >
              <TableFiles onFileClick={handleFileClick} data={fileData} />
            </Sheet>
            <Sheet
              variant="outlined"
              sx={{
                display: { xs: "inherit", sm: "none" },
                borderRadius: "sm",
                overflow: "auto",
                backgroundColor: "background.surface",
                "& > *": {
                  "&:nth-child(n):not(:nth-last-child(-n+4))": {
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  },
                },
              }}
            >
              <List size="sm" aria-labelledby="table-in-list">
                {fileData.map((file, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemButton
                        variant="soft"
                        sx={{ bgcolor: "transparent" }}
                      >
                        <ListItemContent sx={{ p: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography
                              level="title-sm"
                              startDecorator={
                                <ArticleRounded color="primary" />
                              }
                              sx={{ alignItems: "flex-start" }}
                            >
                              {file.pidinfant}
                            </Typography>
                            <AvatarGroup
                              size="sm"
                              sx={{
                                "--AvatarGroup-gap": "-8px",
                                "--Avatar-size": "24px",
                              }}
                            >
                              <Avatar src={file.responsibleUser?.first_name} />
                            </AvatarGroup>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mt: 2,
                            }}
                          >
                            <Typography level="body-sm">
                              {file.status}
                            </Typography>
                            <Typography level="body-sm">
                              {file.lastModifiedDateTime?.join("-")}
                            </Typography>
                          </Box>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                    {index < fileData.length - 1 && <ListDivider />}
                  </React.Fragment>
                ))}
              </List>
            </Sheet>
          </Box>
        </Layout.Main>
        <Sheet
          sx={{
            display: { xs: "none", sm: "initial" },
            borderLeft: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
            <Typography level="title-md" sx={{ flex: 1 }}>
              {selectedFile?.folder?.folderName}
            </Typography>
            <IconButton
              component="span"
              variant="plain"
              color="neutral"
              size="sm"
              onClick={() => setSelectedFile(null)}
            >
              <CloseRounded />
            </IconButton>
          </Box>
          <Divider />
          <Tabs>
            <TabList>
              {["Details", "Activity"].map((tab, index) => (
                <Tab key={index} sx={{ flexGrow: 1 }}>
                  <Typography level="title-sm">{tab}</Typography>
                </Tab>
              ))}
            </TabList>
            <TabPanel value={0} sx={{ p: 0 }}>
              {selectedFile ? (
                <>
                  <AspectRatio ratio="21/9">
                    <img
                      alt=""
                      src="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&h=400&auto=format"
                      srcSet="https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=400&h=400&auto=format&dpr=2 2x"
                    />
                  </AspectRatio>
                  <Box
                    sx={{ p: 2, display: "flex", gap: 1, alignItems: "center" }}
                  >
                    <Typography level="title-sm" sx={{ mr: 1 }}>
                      Responsible Person
                    </Typography>
                    <AvatarGroup size="sm" sx={{ "--Avatar-size": "24px" }}>
                      {selectedFile.responsibleUser && (
                        <Avatar
                          src={selectedFile.responsibleUser?.first_name}
                        />
                      )}
                    </AvatarGroup>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      gap: 2,
                      p: 2,
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      "& > *:nth-child(odd)": { color: "text.secondary" },
                    }}
                  >
                    <DetailItem
                      label="File PID"
                      value={selectedFile.pidinfant}
                    />
                    <DetailItem label="Status" value={selectedFile.status} />
                    <DetailItem
                      label="Modified"
                      value={convertArrayToDate(
                        selectedFile.lastModifiedDateTime!,
                      )!.toDateString()}
                    />
                    <DetailItem
                      label="Created"
                      value={convertArrayToDate(
                        selectedFile.createdDate!,
                      )!.toDateString()}
                    />
                  </Box>
                  <Divider />
                  <Box sx={{ py: 2, px: 1 }}>
                    <Button
                      variant="plain"
                      size="sm"
                      endDecorator={<EditRounded />}
                    >
                      Add a description
                    </Button>
                  </Box>
                </>
              ) : (
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Typography level="body-md">
                    Select a file to view details
                  </Typography>
                </Box>
              )}
            </TabPanel>
            <TabPanel
              value={1}
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Typography level="title-md">This week</Typography>
              <ActivityItem
                avatar="https://i.pravatar.cc/24?img=2"
                action="shared"
                item="torres-del-paine.png"
                chip={{ icon: <ShareRounded />, text: "Shared with 3 users" }}
                date="3 Nov 2023"
              />
              <Typography level="title-md">Older</Typography>
              <ActivityItem
                avatar="https://i.pravatar.cc/24?img=2"
                action="edited"
                item="torres-del-paine.png"
                chip={{ icon: <EditRounded />, text: "Changed name" }}
                date="12 Apr 2021"
              />
              <ActivityItem
                avatar="https://i.pravatar.cc/24?img=2"
                action="created"
                item="torres-del-paine.png"
                chip={{ icon: <EditRounded />, text: "Added 5 Apr 2021" }}
                date="12 Apr 2021"
              />
            </TabPanel>
          </Tabs>
        </Sheet>
      </Layout.Root>
    </CssVarsProvider>
  );
}
