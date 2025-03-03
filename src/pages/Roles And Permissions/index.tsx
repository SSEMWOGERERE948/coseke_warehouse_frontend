import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  CssVarsProvider,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Modal,
  ModalClose,
  ModalDialog,
  Option,
  Select,
  Sheet,
  Stack,
  Switch,
  Tab,
  Table,
  TabList,
  Tabs,
  Typography,
} from "@mui/joy";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { AxiosInstance } from "../../core/baseURL";
import IStorageLocation from "../../interfaces/IStorageLocation";
import { convertArrayToDate } from "../../utils/helpers";

import { Routes, Route } from "react-router-dom";
import { MoreVert } from "@mui/icons-material";
import {
  getAllStorageLocations,
  deleteStorageLocation,
  createStorageLocation,
} from "./roles_api";
import OrganizationsScreen from "../organisation_creation";

interface Permission {
  id: string;
  permissionName: string;
  checked: boolean;
}

interface RolePermissions {
  Name: string;
  enabled: boolean;
  permissions: Permission[];
}

const roles: Role[] = [
  { id: 1, roleName: "Manager" },
  { id: 2, roleName: "User" },
  { id: 3, roleName: "Supervisor" },
  { id: 4, roleName: "Super_Admin" },
];

interface Role {
  id: number;
  roleName: string;
}

interface AssignFolderToDepartment {
  folderIds: number[];
  departmentId: number;
  operation: "ASSIGN" | "UNASSIGN";
}

interface StorageLocation {
  createdAt: string | number | Date;
  id: number;
  type: "Rack" | "Shelf" | "Archival Box" | "Box";
  name: string;
  parentId?: number;
  parentName?: string;
  createdDate: number[];
  lastModifiedDate: number[];
  parent?: { id: number; name: string } | null;
}

const RolesAndPermissions: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleRoleChange = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element>
      | null,
    newValue: string | null,
  ) => {
    if (newValue) {
      const selectedRoleObject = roles.find(
        (role) => role.id.toString() === newValue,
      );
      if (selectedRoleObject) {
        setSelectedRole(selectedRoleObject);
        console.log("Selected role:", selectedRoleObject);
      }
    } else {
      setSelectedRole(null);
      console.log("No role selected");
    }
  };

  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState<{ name: string }>({
    name: "",
  });
  interface OrganisationCreation {
    id: number;
    name: string;
    enabled: boolean;
    permissions: { name: string; checked: boolean }[];
  }

  const [permissionsByRole, setPermissionsByRole] = useState<RolePermissions[]>(
    [],
  );
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [OrganisationCreation, setOrganisationCreation] = useState<
    OrganisationCreation[]
  >([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newOrganisationCreation, setNewOrganisationCreation] = useState({
    name: "",
    description: "",
    role: 1, // Default role
  });
  const { userId } = useParams(); // If needed for role/user context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]); // Selected folder IDs
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false); // State for dialog open/close
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>(
    [],
  );
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null,
  );
  const [newLocation, setNewLocation] = useState<IStorageLocation>({
    id: 0,
    name: "",
    type: "Rack", // Ensure type is one of the allowed values
    parentId: null,
    createdAt: new Date().toISOString(),
  });

  const [parentLocations, setParentLocations] = useState<StorageLocation[]>([]);

  // Handle file category form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewOrganisationCreation({
      ...newOrganisationCreation,
      [e.target.name]: e.target.value,
    });
  };

  // File category toggle
  const handleToggleOrganisationCreation = (studyId: number) => {
    setOrganisationCreation((prevStudies) =>
      prevStudies.map((study) =>
        study.id === studyId
          ? {
              ...study,
              enabled: !study.enabled,
              permissions: study.permissions.map((perm) => ({
                ...perm,
                checked: !study.enabled ? perm.checked : true,
              })),
            }
          : study,
      ),
    );
  };

  // Permission toggle within a File category
  const handlePermissionToggleOrganisationCreation = (
    studyId: number,
    permName: string,
  ) => {
    setOrganisationCreation((prevStudies) =>
      prevStudies.map((study) =>
        study.id === studyId
          ? {
              ...study,
              permissions: study.permissions.map((perm) =>
                perm.name === permName
                  ? { ...perm, checked: !perm.checked }
                  : perm,
              ),
            }
          : study,
      ),
    );
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await AxiosInstance.get("permissions/all");

        // Get the permissions for the selected role
        const rolePermissionsResponse = selectedRole
          ? await AxiosInstance.post("permissions/role", {
              roleName: selectedRole.roleName,
            })
          : { data: [] };

        const rolePermissions = new Set(
          rolePermissionsResponse.data.map((perm: any) => perm.name),
        );

        // Organize permissions based on roles and check them according to the role's permissions
        const organizedPermissions = [
          {
            Name: "Dashboard",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_DASHBOARD",
                  "CREATE_DASHBOARD",
                  "UPDATE_DASHBOARD",
                  "DELETE_DASHBOARD",
                ].includes(perm.name),
              )
              .map((perm: any) => ({
                id: perm.id,
                permissionName: perm.name,
                checked: rolePermissions.has(perm.name),
              })),
          },
          {
            Name: "Files",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_FILES",
                  "CREATE_FILES",
                  "UPDATE_FILES",
                  "DELETE_FILES",
                ].includes(perm.name),
              )
              .map((perm: any) => ({
                id: perm.id,
                permissionName: perm.name,
                checked: rolePermissions.has(perm.name),
              })),
          },
          {
            Name: "Folders",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_FOLDERS",
                  "CREATE_FOLDERS",
                  "UPDATE_FOLDERS",
                  "DELETE_FOLDERS",
                ].includes(perm.name),
              )
              .map((perm: any) => ({
                id: perm.id,
                permissionName: perm.name,
                checked: rolePermissions.has(perm.name),
              })),
          },
          {
            Name: "Users",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_USER",
                  "CREATE_USER",
                  "UPDATE_USER",
                  "DELETE_USER",
                ].includes(perm.name),
              )
              .map((perm: any) => ({
                id: perm.id,
                permissionName: perm.name,
                checked: rolePermissions.has(perm.name),
              })),
          },
          {
            Name: "File categories",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_OrganisationCreation",
                  "CREATE_OrganisationCreation",
                  "UPDATE_OrganisationCreation",
                  "DELETE_OrganisationCreation",
                ].includes(perm.name),
              )
              .map((perm: any) => ({
                id: perm.id,
                permissionName: perm.name,
                checked: rolePermissions.has(perm.name),
              })),
          },
          {
            Name: "Requests",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_REQUESTS",
                  "CREATE_REQUESTS",
                  "UPDATE_REQUESTS",
                  "DELETE_REQUESTS",
                ].includes(perm.name),
              )
              .map((perm: any) => ({
                id: perm.id,
                permissionName: perm.name,
                checked: rolePermissions.has(perm.name),
              })),
          },
        ];

        setPermissionsByRole(organizedPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [selectedRole]); // Add selectedRole as a dependency

  // Fetch file categories
  useEffect(() => {
    const fetchOrganisationCreation = async () => {
      try {
        const response = await AxiosInstance.get("case-studies/all");
        const fetchedOrganisationCreation = response.data.map((study: any) => ({
          id: study.id,
          name: study.name,
          enabled: true,
          permissions: study.permissions.map((perm: string) => ({
            name: perm,
            checked: false,
          })),
        }));

        setOrganisationCreation(fetchedOrganisationCreation);
      } catch (error) {
        console.error("Error fetching file categories:", error);
      }
    };

    fetchOrganisationCreation();
  }, []);

  // Role-based toggle for enabling/disabling role permissions
  const handleRoleToggle = (roleIndex: number) => {
    setPermissionsByRole((prevRoles) =>
      prevRoles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              enabled: !role.enabled, // Enable or disable the entire role
              permissions: role.permissions.map((perm) => ({
                ...perm,
                checked: !role.enabled, // If role is being enabled, check all permissions. If disabled, uncheck all.
              })),
            }
          : role,
      ),
    );
  };

  // Function to handle toggling a single permission
  const handlePermissionToggle = async (permId: string, isChecked: boolean) => {
    if (!selectedRole) return;

    setIsSubmitting(true);

    try {
      // Update local UI state optimistically
      const updatedPermissions = permissionsByRole.map((role) => ({
        ...role,
        permissions: role.permissions.map((perm) =>
          perm.id === permId ? { ...perm, checked: isChecked } : perm,
        ),
      }));

      setPermissionsByRole(updatedPermissions);

      const permissionToUpdate = updatedPermissions
        .flatMap((role) => role.permissions)
        .find((perm) => perm.id === permId);

      if (permissionToUpdate) {
        const permissionPayload = {
          roleName: selectedRole.roleName,
          permissionName: permissionToUpdate.permissionName,
        };

        // Add or remove permission from backend
        if (isChecked) {
          await assignPermissionToBackend(permissionPayload);
          console.log("Permission assigned successfully.");
        } else {
          await removePermissionFromBackend(permissionPayload);
          console.log("Permission removed successfully.");
        }
      }
    } catch (error) {
      console.error("Error processing permission change:", error);
      // Rollback UI state in case of an error
      setPermissionsByRole((prevState) =>
        prevState.map((role) => ({
          ...role,
          permissions: role.permissions.map((perm) =>
            perm.id === permId ? { ...perm, checked: !isChecked } : perm,
          ),
        })),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to toggle all permissions within a specific section
  const handleToggleSectionPermissions = async (
    sectionName: string,
    isChecked: boolean,
  ) => {
    if (!selectedRole) return;

    setIsSubmitting(true);

    try {
      // Update permissions within the specific section
      const updatedPermissions = permissionsByRole.map((role) =>
        role.Name === sectionName
          ? {
              ...role,
              permissions: role.permissions.map((perm) => ({
                ...perm,
                checked: isChecked,
              })),
            }
          : role,
      );

      setPermissionsByRole(updatedPermissions);

      const permissionPayloads = updatedPermissions
        .find((role) => role.Name === sectionName)
        ?.permissions.map((perm) => ({
          roleName: selectedRole.roleName,
          permissionName: perm.permissionName,
        }));

      if (permissionPayloads) {
        // Add or remove permissions for the entire section
        if (isChecked) {
          await Promise.all(
            permissionPayloads.map((payload) =>
              assignPermissionToBackend(payload),
            ),
          );
          console.log(
            `All permissions for ${sectionName} assigned successfully.`,
          );
        } else {
          await Promise.all(
            permissionPayloads.map((payload) =>
              removePermissionFromBackend(payload),
            ),
          );
          console.log(
            `All permissions for ${sectionName} removed successfully.`,
          );
        }
      }
    } catch (error) {
      console.error(`Error toggling permissions for ${sectionName}:`, error);
      // Rollback UI state in case of an error
      setPermissionsByRole((prevState) =>
        prevState.map((role) =>
          role.Name === sectionName
            ? {
                ...role,
                permissions: role.permissions.map((perm) => ({
                  ...perm,
                  checked: !isChecked,
                })),
              }
            : role,
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseAddDepartment = () => setIsAddDepartmentOpen(false);

  useEffect(() => {
    fetchStorageLocations();
  }, []);

  // Fetch all storage locations
  const fetchStorageLocations = async () => {
    try {
      const data = await getAllStorageLocations();

      // Ensure proper date formatting and parent location assignment
      const formattedData = data.map((location: any) => ({
        ...location,
        parentName: location.parent ? location.parent.name : "N/A", // Get parent name
        createdAt: location.createdAt
          ? new Date(
              location.createdAt[0], // Year
              location.createdAt[1] - 1, // Month (Fix month index)
              location.createdAt[2], // Day
              location.createdAt[3], // Hour
              location.createdAt[4], // Minute
              location.createdAt[5], // Second
            ).toLocaleString()
          : "N/A",
        updatedAt: location.updatedAt
          ? new Date(
              location.updatedAt[0], // Year
              location.updatedAt[1] - 1, // Month (Fix month index)
              location.updatedAt[2], // Day
              location.updatedAt[3], // Hour
              location.updatedAt[4], // Minute
              location.updatedAt[5], // Second
            ).toLocaleString()
          : "N/A",
      }));

      setStorageLocations(formattedData);

      // Set only valid parent locations (excluding "Box" types)
      setParentLocations(
        formattedData.filter((loc: { type: string }) => loc.type !== "Box"),
      );
    } catch (error) {
      console.error("Error fetching storage locations:", error);
    }
  };

  // Handle deleting a storage location
  const handleDeleteLocation = async (id: number) => {
    try {
      await deleteStorageLocation(id);
      fetchStorageLocations();
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  // Handle opening the options menu
  const handleOpenMenu = (event: React.MouseEvent, id: number) => {
    setSelectedLocationId(id);
  };

  // Handle creating a new storage location
  const handleSubmitLocation = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await createStorageLocation(
        newLocation,
        newLocation.parentId ?? undefined,
      );
      setModalOpen(false);
      fetchStorageLocations();
    } catch (error) {
      console.error("Error creating storage location:", error);
    }
  };

  const isValidParent = (
    location: IStorageLocation,
    type: IStorageLocation["type"],
  ) => {
    if (type === "Shelf") return location.type === "Rack";
    if (type === "Archival Box") return location.type === "Shelf";
    if (type === "Box") return location.type === "Archival Box";
    return false;
  };

  const assignPermissionToBackend = async (permissionPayload: {
    roleName: string;
    permissionName: string;
  }) => {
    try {
      const response = await AxiosInstance.post(
        "/permissions/add",
        permissionPayload,
      );
      console.log("Permission successfully added:", response.data);
    } catch (error) {
      console.error("Failed to add permission:", error);
      throw error;
    }
  };

  const removePermissionFromBackend = async (permissionPayload: {
    roleName: string;
    permissionName: string;
  }) => {
    try {
      const response = await AxiosInstance.post(
        "/permissions/remove",
        permissionPayload,
      );
      console.log("Permission successfully removed:", response.data);
    } catch (error) {
      console.error("Failed to remove permission:", error);
      throw error;
    }
  };

  const fetchAssignedFolders = async (departmentId: number) => {
    try {
      const response = await AxiosInstance.get(
        `/folders/departments/${departmentId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching assigned folders:", error);
      return [];
    }
  };

  const handleAssignLocation = (locationId: number) => {
    setSelectedLocationId(locationId); // Store the selected location ID
    setModalOpen(true); // Open the modal to add a sub-location
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Checkbox change handler
  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1000px", mx: "auto" }}>
        <Tabs
          value={tabIndex}
          onChange={(_, value) => setTabIndex(value as number)}
          sx={{ mb: 4 }}
        >
          <TabList>
            <Tab>System Roles</Tab>
            <Tab>Organisations</Tab>
            <Tab>Storage Locations</Tab>
          </TabList>
        </Tabs>

        <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
          {/* System Roles and Permissions */}
          <Box p={2} sx={{ overflowX: "hidden", maxWidth: "100vw" }}>
            <Typography level="h1" fontSize="xl" mb={2}>
              System Roles and Permissions
            </Typography>

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography level="h2" fontSize="lg">
                Manage Roles and Permissions
              </Typography>
              <FormControl sx={{ minWidth: 200 }}>
                <FormLabel>Select Role</FormLabel>
                <Select
                  value={selectedRole ? selectedRole.id.toString() : ""}
                  onChange={handleRoleChange}
                >
                  {roles.map((role) => (
                    <Option key={role.id} value={role.id.toString()}>
                      {role.roleName}
                    </Option>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Grid container spacing={3} sx={{ maxWidth: "100%" }}>
              {permissionsByRole.map((role, roleIndex) => (
                <Grid key={role.Name} xs={12} md={6} lg={4}>
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
                        {role.Name}
                      </Typography>
                      <Switch
                        checked={role.permissions.every((perm) => perm.checked)}
                        onChange={(event) =>
                          handleToggleSectionPermissions(
                            role.Name,
                            event.target.checked,
                          )
                        }
                        color={
                          role.permissions.every((perm) => perm.checked)
                            ? "success"
                            : "neutral"
                        }
                        slotProps={{
                          input: {
                            "aria-label": `Toggle all permissions for ${role.Name}`,
                          },
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
                        <Box
                          key={perm.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Checkbox
                            label={perm.permissionName}
                            checked={perm.checked}
                            onChange={(event) =>
                              handlePermissionToggle(
                                perm.id,
                                event.target.checked,
                              )
                            }
                            disabled={
                              !role.enabled || isSubmitting || !selectedRole
                            }
                            slotProps={{
                              input: {
                                "aria-label": `${perm.permissionName} permission for ${selectedRole?.roleName || "selected role"}`,
                              },
                            }}
                          />

                          <IconButton
                            onClick={async () => {
                              const roleName = selectedRole
                                ? selectedRole.roleName
                                : "";
                              const permissionPayload = {
                                roleName: roleName,
                                permissionName: perm.permissionName,
                              };
                              try {
                                await removePermissionFromBackend(
                                  permissionPayload,
                                );
                                console.log("Permission removed successfully.");
                                // Update local state after successful removal
                                handlePermissionToggle(perm.id, false);
                              } catch (error) {
                                console.error(
                                  "Error removing permission:",
                                  error,
                                );
                              }
                            }}
                            aria-label={`Delete ${perm.permissionName} permission`}
                            disabled={isSubmitting || !selectedRole}
                          >
                            {/* <DeleteIcon /> */}
                          </IconButton>
                        </Box>
                      ))}

                      {/* Add new permission button */}
                      <Box mt={2} display="flex" justifyContent="flex-end">
                        <IconButton
                          onClick={() => {
                            // Logic to add a new permission (this needs to be implemented)
                            console.log(
                              "Add permission functionality goes here.",
                            );
                          }}
                          aria-label="Add permission"
                          disabled={isSubmitting} // Disable during submission
                        >
                          {/* <Add /> */}
                        </IconButton>
                      </Box>
                    </Box>
                  </Sheet>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* File categories Tab */}
          <Box p={2}>
            <Routes>
              <Route path="/" element={<OrganizationsScreen />} />
            </Routes>
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
                Storage Locations
              </Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Input
                  placeholder="Search storage locations..."
                  variant="outlined"
                  sx={{ minWidth: "200px" }}
                />
                <Button variant="outlined">Filter</Button>
                <Button
                  variant="solid"
                  color="primary"
                  onClick={() => setModalOpen(true)}
                >
                  Add Storage Location
                </Button>
              </Box>
            </Box>

            <Sheet sx={{ maxHeight: 400, overflow: "auto" }}>
              <Table stickyHeader>
                <thead>
                  <tr>
                    <th>Storage Level</th>
                    <th>Location Name</th>
                    <th>Parent Location</th>
                    <th>Added Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storageLocations.map((location) => (
                    <tr key={location.id}>
                      <td>{location.type}</td>{" "}
                      {/* Rack, Shelf, Archival Box, Box */}
                      <td>{location.name}</td>
                      <td>{location.parent ? location.parent.name : "N/A"}</td>
                      <td>
                        {location.createdAt
                          ? new Date(location.createdAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outlined"
                          color="danger"
                          onClick={() => handleDeleteLocation(location.id)}
                        >
                          Delete
                        </Button>
                        <IconButton
                          onClick={(event) =>
                            handleOpenMenu(event, location.id)
                          }
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={null}
                          open={Boolean(selectedLocationId)}
                          onClose={() => setSelectedLocationId(null)}
                        >
                          <MenuItem>Assign Sub-Locations</MenuItem>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>

            {/* Modal for Creating a New Storage Location */}
            <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
              <ModalDialog>
                <ModalClose />
                <Typography component="h2" fontSize="lg" mb={2}>
                  Add Storage Location
                </Typography>
                <form onSubmit={handleSubmitLocation}>
                  <Stack gap={2}>
                    <FormControl required>
                      <FormLabel>Storage Level</FormLabel>
                      <Select
                        value={newLocation.type}
                        onChange={(event, newValue) =>
                          setNewLocation({
                            ...newLocation,
                            type: newValue as
                              | "Rack"
                              | "Shelf"
                              | "Archival Box"
                              | "Box",
                          })
                        }
                      >
                        <Option value="Rack">Rack</Option>
                        <Option value="Shelf">Shelf</Option>
                        <Option value="Archival Box">Archival Box</Option>
                        <Option value="Box">Box</Option>
                      </Select>
                    </FormControl>

                    {newLocation.type !== "Rack" && (
                      <FormControl required>
                        <FormLabel>Parent Location</FormLabel>
                        <Select
                          value={
                            newLocation.parentId === null ||
                            newLocation.parentId === undefined
                              ? ""
                              : newLocation.parentId.toString()
                          }
                          onChange={(event, newValue) => {
                            setNewLocation({
                              ...newLocation,
                              parentId:
                                newValue !== null ? Number(newValue) : null, // Ensures a valid number or null
                            });
                          }}
                        >
                          {parentLocations
                            .filter((loc) =>
                              isValidParent(
                                loc as IStorageLocation,
                                newLocation.type as IStorageLocation["type"],
                              ),
                            )
                            .map((loc) => (
                              <Option key={loc.id} value={loc.id.toString()}>
                                {loc.name} ({loc.type})
                              </Option>
                            ))}
                        </Select>
                      </FormControl>
                    )}

                    <FormControl required>
                      <FormLabel>Location Name</FormLabel>
                      <Input
                        value={newLocation.name}
                        onChange={(e) =>
                          setNewLocation({
                            ...newLocation,
                            name: e.target.value,
                          })
                        }
                      />
                    </FormControl>

                    <Button type="submit" variant="solid" color="primary">
                      Add Location
                    </Button>
                  </Stack>
                </form>
              </ModalDialog>
            </Modal>
          </Box>
        </SwipeableViews>
      </Box>
    </CssVarsProvider>
  );
};
export default RolesAndPermissions;
