"use client";

import React, { useState } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Switch from "@mui/joy/Switch";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Grid from "@mui/joy/Grid";
import Tabs from "@mui/joy/Tabs";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import SwipeableViews from "react-swipeable-views";

interface Permission {
  id: string;
  label: string;
  checked: boolean;
}

interface Role {
  id: string;
  name: string;
  enabled: boolean;
  permissions: Permission[];
}

export default function SystemRolesPermissions() {
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Administrator",
      enabled: true,
      permissions: [
        { id: "user_manage", label: "Manage Users", checked: true },
        { id: "role_manage", label: "Manage Roles", checked: true },
        { id: "system_config", label: "System Configuration", checked: true },
        { id: "audit_logs", label: "View Audit Logs", checked: true },
      ],
    },
    {
      id: "editor",
      name: "Content Editor",
      enabled: false,
      permissions: [
        { id: "content_create", label: "Create Content", checked: false },
        { id: "content_edit", label: "Edit Content", checked: false },
        { id: "content_publish", label: "Publish Content", checked: false },
        { id: "media_manage", label: "Manage Media", checked: false },
      ],
    },
    {
      id: "viewer",
      name: "Viewer",
      enabled: false,
      permissions: [
        { id: "content_view", label: "View Content", checked: false },
        { id: "reports_view", label: "View Reports", checked: false },
        { id: "dashboard_access", label: "Access Dashboard", checked: false },
      ],
    },
  ]);

  const [caseStudyRoles, setCaseStudyRoles] = useState<Role[]>([
    {
      id: "malaria_study",
      name: "Malaria Case Study",
      enabled: true,
      permissions: [
        { id: "view_results", label: "View Results", checked: true },
        { id: "edit_analysis", label: "Edit Analysis", checked: false },
        { id: "export_data", label: "Export Data", checked: true },
      ],
    },
    {
      id: "typhoid_study",
      name: "Typhoid Case Study",
      enabled: false,
      permissions: [
        { id: "view_results", label: "View Results", checked: false },
        { id: "edit_analysis", label: "Edit Analysis", checked: false },
        { id: "export_data", label: "Export Data", checked: false },
      ],
    },
  ]);

  const [openNewRoleModal, setOpenNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [openNewPermissionModal, setOpenNewPermissionModal] = useState(false);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [selectedRoleForNewPermission, setSelectedRoleForNewPermission] =
    useState<string | null>(null);

  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleRoleToggle = (roleId: string, isCaseStudy: boolean = false) => {
    const rolesToUpdate = isCaseStudy ? setCaseStudyRoles : setRoles;
    rolesToUpdate((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === roleId) {
          const newEnabled = !role.enabled;
          return {
            ...role,
            enabled: newEnabled,
            permissions: role.permissions.map((perm) => ({
              ...perm,
              checked: newEnabled,
            })),
          };
        }
        return role;
      }),
    );
  };

  const handlePermissionToggle = (
    roleId: string,
    permId: string,
    isCaseStudy: boolean = false,
  ) => {
    const rolesToUpdate = isCaseStudy ? setCaseStudyRoles : setRoles;
    rolesToUpdate((prevRoles) =>
      prevRoles.map((role) => {
        if (role.id === roleId) {
          return {
            ...role,
            permissions: role.permissions.map((perm) =>
              perm.id === permId ? { ...perm, checked: !perm.checked } : perm,
            ),
          };
        }
        return role;
      }),
    );
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
        {/* Tabs for navigating between roles and case studies */}
        <Tabs
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value as number)}
          sx={{ mb: 4 }}
        >
          <TabList>
            <Tab>Roles & Permissions</Tab>
            <Tab>Case Studies</Tab>
          </TabList>
        </Tabs>

        <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
          <Box p={2}>
            {/* System Roles and Permissions */}
            <Typography level="h1" fontSize="xl" mb={2}>
              System Roles and Permissions
            </Typography>
            <Grid container spacing={3}>
              {roles.map((role) => (
                <Grid key={role.id} xs={12} md={6} lg={4}>
                  <Sheet
                    variant="outlined"
                    sx={{ p: 3, borderRadius: "sm", height: "100%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography level="h2" fontSize="lg">
                        {role.name}
                      </Typography>
                      <Switch
                        checked={role.enabled}
                        onChange={() => handleRoleToggle(role.id)}
                        color={role.enabled ? "success" : "neutral"}
                        slotProps={{
                          input: { "aria-label": `Toggle ${role.name} role` },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        ml: 3,
                      }}
                    >
                      {role.permissions.map((perm) => (
                        <Checkbox
                          key={perm.id}
                          label={perm.label}
                          checked={perm.checked}
                          onChange={() =>
                            handlePermissionToggle(role.id, perm.id)
                          }
                          disabled={!role.enabled}
                          slotProps={{
                            input: {
                              "aria-label": `${perm.label} permission for ${role.name} role`,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Sheet>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box p={2}>
            {/* Case Studies Roles and Permissions */}
            <Typography level="h1" fontSize="xl" mb={2}>
              Case Studies Roles and Permissions
            </Typography>
            <Grid container spacing={3}>
              {caseStudyRoles.map((role) => (
                <Grid key={role.id} xs={12} md={6} lg={4}>
                  <Sheet
                    variant="outlined"
                    sx={{ p: 3, borderRadius: "sm", height: "100%" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography level="h2" fontSize="lg">
                        {role.name}
                      </Typography>
                      <Switch
                        checked={role.enabled}
                        onChange={() => handleRoleToggle(role.id, true)}
                        color={role.enabled ? "success" : "neutral"}
                        slotProps={{
                          input: { "aria-label": `Toggle ${role.name} role` },
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        ml: 3,
                      }}
                    >
                      {role.permissions.map((perm) => (
                        <Checkbox
                          key={perm.id}
                          label={perm.label}
                          checked={perm.checked}
                          onChange={() =>
                            handlePermissionToggle(role.id, perm.id, true)
                          }
                          disabled={!role.enabled}
                          slotProps={{
                            input: {
                              "aria-label": `${perm.label} permission for ${role.name} role`,
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Sheet>
                </Grid>
              ))}
            </Grid>
          </Box>
        </SwipeableViews>
      </Box>
    </CssVarsProvider>
  );
}
