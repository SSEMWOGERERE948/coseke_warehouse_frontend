"use client";

import React, { useState } from "react";
import { CssVarsProvider, useColorScheme } from "@mui/joy/styles";
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
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";

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

  const [openNewRoleModal, setOpenNewRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [openNewPermissionModal, setOpenNewPermissionModal] = useState(false);
  const [newPermissionName, setNewPermissionName] = useState("");
  const [selectedRoleForNewPermission, setSelectedRoleForNewPermission] =
    useState<string | null>(null);

  const handleRoleToggle = (roleId: string) => {
    setRoles((prevRoles) =>
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

  const handlePermissionToggle = (roleId: string, permId: string) => {
    setRoles((prevRoles) =>
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

  const handleAddNewRole = () => {
    if (newRoleName.trim()) {
      const newRole: Role = {
        id: newRoleName.toLowerCase().replace(/\s+/g, "_"),
        name: newRoleName,
        enabled: false,
        permissions: [],
      };
      setRoles((prevRoles) => [...prevRoles, newRole]);
      setNewRoleName("");
      setOpenNewRoleModal(false);
    }
  };

  const handleAddNewPermission = () => {
    if (newPermissionName.trim() && selectedRoleForNewPermission) {
      setRoles((prevRoles) =>
        prevRoles.map((role) => {
          if (role.id === selectedRoleForNewPermission) {
            return {
              ...role,
              permissions: [
                ...role.permissions,
                {
                  id: newPermissionName.toLowerCase().replace(/\s+/g, "_"),
                  label: newPermissionName,
                  checked: false,
                },
              ],
            };
          }
          return role;
        }),
      );
      setNewPermissionName("");
      setOpenNewPermissionModal(false);
      setSelectedRoleForNewPermission(null);
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={12} sm={6}>
            <Typography level="h1" fontSize={{ xs: "lg", sm: "xl" }}>
              System Roles and Permissions
            </Typography>
          </Grid>
          <Grid
            xs={12}
            sm={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "flex-start", sm: "flex-end" },
              mt: { xs: 2, sm: 0 },
            }}
          >
            <Button onClick={() => setOpenNewRoleModal(true)} sx={{ mr: 1 }}>
              Add New Role
            </Button>
            <Button color="danger" variant="solid">
              Delete All Roles
            </Button>
          </Grid>
        </Grid>

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
                      onChange={() => handlePermissionToggle(role.id, perm.id)}
                      disabled={!role.enabled}
                      slotProps={{
                        input: {
                          "aria-label": `${perm.label} permission for ${role.name} role`,
                        },
                      }}
                    />
                  ))}
                </Box>
                <Button
                  onClick={() => {
                    setSelectedRoleForNewPermission(role.id);
                    setOpenNewPermissionModal(true);
                  }}
                  sx={{ mt: 2 }}
                >
                  Add New Permission
                </Button>
              </Sheet>
            </Grid>
          ))}
        </Grid>

        <Modal
          open={openNewRoleModal}
          onClose={() => setOpenNewRoleModal(false)}
        >
          <ModalDialog>
            <Typography level="h2" fontSize="lg" mb={2}>
              Add New Role
            </Typography>
            <FormControl>
              <FormLabel>Role Name</FormLabel>
              <Input
                autoFocus
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
              />
            </FormControl>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenNewRoleModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNewRole}>Add Role</Button>
            </Box>
          </ModalDialog>
        </Modal>

        <Modal
          open={openNewPermissionModal}
          onClose={() => setOpenNewPermissionModal(false)}
        >
          <ModalDialog>
            <Typography level="h2" fontSize="lg" mb={2}>
              Add New Permission
            </Typography>
            <FormControl>
              <FormLabel>Permission Name</FormLabel>
              <Input
                autoFocus
                value={newPermissionName}
                onChange={(e) => setNewPermissionName(e.target.value)}
              />
            </FormControl>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button
                variant="plain"
                color="neutral"
                onClick={() => setOpenNewPermissionModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddNewPermission}>Add Permission</Button>
            </Box>
          </ModalDialog>
        </Modal>
      </Box>
    </CssVarsProvider>
  );
}
