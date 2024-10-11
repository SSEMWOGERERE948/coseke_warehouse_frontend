"use client";

import React, { useState, useEffect } from "react";
import {
  CssVarsProvider,
  Box,
  Typography,
  Button,
  Switch,
  Checkbox,
  Sheet,
  Modal,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Tabs,
  Tab,
  TabList,
  Table,
  Avatar,
  ModalClose,
  Stack,
} from "@mui/joy";
import CssBaseline from "@mui/joy/CssBaseline";
import SwipeableViews from "react-swipeable-views";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
} from "./roles_api";

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

interface Department {
  id: number;
  name: string;
  addedDate: string;
  modifiedDate: string;
}

const department: Department[] = [
  {
    id: 1,
    name: "Human Resources",
    addedDate: "2024-01-15",
    modifiedDate: "2024-03-20",
  },
  {
    id: 2,
    name: "Engineering",
    addedDate: "2024-02-01",
    modifiedDate: "2024-04-01",
  },
  {
    id: 3,
    name: "Marketing",
    addedDate: "2024-01-30",
    modifiedDate: "2024-03-25",
  },
  {
    id: 4,
    name: "Finance",
    addedDate: "2024-03-10",
    modifiedDate: "2024-04-02",
  },
];
const RolesAndPermissions: React.FC = () => {
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

  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<{ name: string }>({
    name: "",
  });

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

  const handleOpenAddDepartment = () => setIsAddDepartmentOpen(true);
  const handleCloseAddDepartment = () => setIsAddDepartmentOpen(false);

  //Added by Sylvia
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const fetchedDepartments = await getAllDepartments();
      setDepartments(fetchedDepartments);
      setError(null);
    } catch (error) {
      setError("Failed to fetch departments");
      console.error("Error fetching departments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewDepartment = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createDepartment({ name: newDepartment.name });
      await fetchDepartments();
      handleCloseAddDepartment();
      setError("Failed to create department");
      console.error("Error creating department:", error);
    } finally {
      setIsLoading(false);
    }
  };
  function setDefaultResultOrder(arg0: string) {
    throw new Error("Function not implemented.");
  }

  // stopped here

  // const handleSubmitNewDepartment = (event: React.FormEvent) => {
  // event.preventDefault();
  // Handle department submission logic here
  // handleCloseAddDepartment();

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value as number)}
          sx={{ mb: 4 }}
        >
          <TabList>
            <Tab>Roles & Permissions</Tab>
            <Tab>Case Studies</Tab>
            <Tab>Departments</Tab>
          </TabList>
        </Tabs>

        <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
          {/* Roles & Permissions Tab */}
          <Box p={2}>
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

          {/* Case Studies Tab */}
          <Box p={2}>
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

          {/* Departments Tab */}
          <Box p={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography level="h2" fontSize="lg">
                Organization Departments
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Input
                  placeholder="Search departments..."
                  variant="outlined"
                  sx={{ minWidth: "200px" }}
                />
                <Button variant="outlined">Filter</Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleOpenAddDepartment}
                >
                  Add Department
                </Button>
              </Box>
            </Box>

            <Sheet sx={{ maxHeight: 400, overflow: "auto" }}>
              <Table stickyHeader>
                <thead>
                  <tr>
                    <th>Department Name</th>
                    <th>Added Date</th>
                    <th>Modified Date</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((department) => (
                    <tr key={department.id}>
                      <td>{department.name}</td>
                      <td>{department.addedDate}</td>
                      <td>{department.modifiedDate}</td>

                      <td>
                        <Button
                          size="sm"
                          variant="outlined"
                          color="danger"
                          onClick={async () => {
                            if (department.id) {
                              try {
                                await deleteDepartment(department.id);
                                await fetchDepartments();
                              } catch (err) {
                                setDefaultResultOrder(
                                  "Failed to delete department",
                                );
                                console.error(
                                  "error deleting department:",
                                  err,
                                );
                              }
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </Box>
        </SwipeableViews>

        {/* Modal for Adding a Department */}
        <Modal open={isAddDepartmentOpen} onClose={handleCloseAddDepartment}>
          <ModalDialog>
            <ModalClose />
            <Typography component="h2" fontSize="lg" mb={2}>
              Add Department
            </Typography>
            <form onSubmit={handleSubmitNewDepartment}>
              <Stack gap={2}>
                <FormControl>
                  <FormLabel>Department Name</FormLabel>
                  <Input
                    required
                    onChange={(e) => setNewDepartment({ name: e.target.value })}
                  />
                </FormControl>
                <Button type="submit" variant="solid" color="primary">
                  Add Department
                </Button>
              </Stack>
            </form>
          </ModalDialog>
        </Modal>
      </Box>
    </CssVarsProvider>
  );
};
export default RolesAndPermissions;
