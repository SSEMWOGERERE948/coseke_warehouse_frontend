import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssessmentIcon from "@mui/icons-material/Assessment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import Box from "@mui/joy/Box";
import Divider from "@mui/joy/Divider";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import * as React from "react";

import { useNavigate } from "react-router";
import routes from "../../core/routes";
import ColorSchemeToggle from "./ColorSchemeToggle";
import { closeSidebar } from "./utils";
import IUser from "../../interfaces/IUser";
import { getCurrentUser } from "../../utils/helpers";
import Images from "../../asset/images";

function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": {
              overflow: "hidden",
            },
          },
          open ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = React.useState<string | null>("/");
  const user: IUser = getCurrentUser();

  const handleSelect = (item: string) => {
    setSelectedItem(item);
    navigate(item);
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />

      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <img src={Images.Logo} alt="" style={{ width: 40, height: 40 }} />

        <Typography level="title-lg">Baylor Foundation</Typography>
        <ColorSchemeToggle sx={{ ml: "auto" }} />
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton
              selected={selectedItem === routes.DASHBOARD}
              onClick={() => handleSelect(routes.DASHBOARD)}
            >
              <DashboardRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Dashboard</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              selected={selectedItem === routes.FILES}
              onClick={() => handleSelect(routes.FILES)}
            >
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Files</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem>
            <ListItemButton
              selected={selectedItem === routes.FOLDERS}
              onClick={() => handleSelect(routes.FOLDERS)}
            >
              <ShoppingCartRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Folders</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>

          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <AssignmentRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Requests</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? {
                            transform: "rotate(180deg)",
                          }
                        : {
                            transform: "none",
                          },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    selected={selectedItem === routes.PI}
                    onClick={() => handleSelect(routes.PI)}
                  >
                    Principal Investigator
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    selected={selectedItem === routes.REQUESTS}
                    onClick={() => handleSelect(routes.REQUESTS)}
                  >
                    Requests
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    selected={selectedItem === routes.MYREQUESTS}
                    onClick={() => handleSelect(routes.MYREQUESTS)}
                  >
                    My Requests
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    selected={selectedItem === routes.APPROVED}
                    onClick={() => handleSelect(routes.APPROVED)}
                  >
                    Approved
                  </ListItemButton>
                </ListItem>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    selected={selectedItem === routes.REJECTED}
                    onClick={() => handleSelect(routes.REJECTED)}
                  >
                    Rejected
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <GroupRoundedIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Users</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? {
                            transform: "rotate(180deg)",
                          }
                        : {
                            transform: "none",
                          },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <ListItemButton
                    selected={selectedItem === routes.PROFILE}
                    onClick={() => handleSelect(routes.PROFILE)}
                  >
                    My profile
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    selected={selectedItem === routes.USERS}
                    onClick={() => handleSelect(routes.USERS)}
                  >
                    View Users
                  </ListItemButton>
                </ListItem>
                <ListItem>
                  <ListItemButton
                    selected={selectedItem === routes.ROLESANDPERMISSIONS}
                    onClick={() => handleSelect(routes.ROLESANDPERMISSIONS)}
                  >
                    Roles & permission
                  </ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
          {/* <ListItemButton
            selected={selectedItem === routes.CASE_STUDIES}
            onClick={() => handleSelect(routes.CASE_STUDIES)}
          >
            <AssessmentIcon />
            <ListItemContent>
              <Typography level="title-sm">Case Studies</Typography>
            </ListItemContent>
          </ListItemButton> */}
        </List>
        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton
              onClick={() =>
                window.open("https://support.coseke.com", "_blank")
              }
            >
              <SupportRoundedIcon />
              Support
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <SettingsRoundedIcon />
              Settings
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography level="title-sm">
            {user.first_name + " " + user.last_name}
          </Typography>
          <Typography level="body-xs">{user.email}</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={() => {
            sessionStorage.clear();
            navigate("/");
          }}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
