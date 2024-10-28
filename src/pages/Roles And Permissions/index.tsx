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
import IDepartment from "../../interfaces/IDepartment";
import IRole from "../../interfaces/IRole";
import { convertArrayToDate } from "../../utils/helpers";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
} from "./roles_api";
import { Routes, Route } from "react-router-dom";
import CaseStudies from "../case_studies";
import { MoreVert } from "@mui/icons-material";
import {
  assignFoldersToDepartmentService,
  getAllFoldersService,
} from "../Folders/folders_api";
import IFolder from "../../interfaces/IFolder";

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
  { id: 1, roleName: "Admin" },
  { id: 2, roleName: "User" },
  { id: 3, roleName: "Super_Admin" },
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
  interface CaseStudy {
    id: number;
    name: string;
    enabled: boolean;
    permissions: { name: string; checked: boolean }[];
  }

  const [permissionsByRole, setPermissionsByRole] = useState<RolePermissions[]>(
    [],
  );
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCaseStudy, setNewCaseStudy] = useState({
    name: "",
    description: "",
    role: 1, // Default role
  });
  const { userId } = useParams(); // If needed for role/user context
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle case study form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCaseStudy({
      ...newCaseStudy,
      [e.target.name]: e.target.value,
    });
  };

  // Case Study toggle
  const handleToggleCaseStudy = (studyId: number) => {
    setCaseStudies((prevStudies) =>
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

  // Permission toggle within a Case Study
  const handlePermissionToggleCaseStudy = (
    studyId: number,
    permName: string,
  ) => {
    setCaseStudies((prevStudies) =>
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
            Name: "Case Studies",
            enabled: true,
            permissions: response.data
              .filter((perm: any) =>
                [
                  "READ_CASESTUDIES",
                  "CREATE_CASESTUDIES",
                  "UPDATE_CASESTUDIES",
                  "DELETE_CASESTUDIES",
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

  // Fetch case studies
  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await AxiosInstance.get("case-studies/all");
        const fetchedCaseStudies = response.data.map((study: any) => ({
          id: study.id,
          name: study.name,
          enabled: true,
          permissions: study.permissions.map((perm: string) => ({
            name: perm,
            checked: false,
          })),
        }));

        setCaseStudies(fetchedCaseStudies);
      } catch (error) {
        console.error("Error fetching case studies:", error);
      }
    };

    fetchCaseStudies();
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

  const handleOpenAddDepartment = () => setIsAddDepartmentOpen(true);
  const handleCloseAddDepartment = () => setIsAddDepartmentOpen(false);

  //Added by Sylvia
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [folders, setFolders] = useState<IFolder[]>([]); // State to hold fetched folders
  const [selectedFolders, setSelectedFolders] = useState<number[]>([]); // Selected folder IDs
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false); // State for dialog open/close

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const fetchedDepartments = await getAllDepartments();
      if (Array.isArray(fetchedDepartments)) {
        // Ensure it's an array
        setDepartments(fetchedDepartments);
      } else {
        setDepartments([]); // Fallback to an empty array if not an array
        console.error("Expected an array but got:", fetchedDepartments);
      }
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
      await createDepartment({ departmentName: newDepartment.name });
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

  const handleFolderAssignment = async (
    departmentId: number,
    folderId: number,
    isAssigning: boolean,
  ) => {
    const payload: AssignFolderToDepartment = {
      departmentId: departmentId,
      folderIds: [folderId],
      operation: isAssigning ? "ASSIGN" : "UNASSIGN",
    };

    try {
      setIsLoading(true);
      // Use a single endpoint for both operations
      await AxiosInstance.post("/folders/manage-assignment", payload);

      // Update local state
      setFolders((prevFolders) =>
        prevFolders.map((folder) =>
          folder.id === folderId
            ? { ...folder, isAssigned: isAssigning }
            : folder,
        ),
      );
    } catch (error) {
      console.error(
        `Error ${isAssigning ? "assigning" : "unassigning"} folder:`,
        error,
      );
      setError(`Failed to ${isAssigning ? "assign" : "unassign"} folder`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle opening the assign folders dialog
  const handleAssignFolders = async (departmentId: number) => {
    try {
      setIsLoading(true);
      setSelectedDepartmentId(departmentId);

      // Fetch all folders
      const allFolders = await getAllFoldersService();

      // Fetch assigned folders for this department
      const assignedFolders = await fetchAssignedFolders(departmentId);
      const assignedFolderIds = assignedFolders.map(
        (folder: IFolder) => folder.id,
      );

      // Mark folders as assigned/unassigned
      const foldersWithAssignmentStatus = allFolders.map((folder: IFolder) => ({
        ...folder,
        isAssigned: assignedFolderIds.includes(folder.id),
      }));

      setFolders(foldersWithAssignmentStatus);
      setSelectedFolders(assignedFolderIds);
      setIsFolderDialogOpen(true);
    } catch (error) {
      console.error("Error preparing folder assignment dialog:", error);
      setError("Failed to load folders");
    } finally {
      setIsLoading(false);
      handleCloseMenu();
    }
  };

  // Menu handlers
  const handleOpenAssignDialog = (
    event: React.MouseEvent<HTMLElement>,
    departmentId: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedDepartmentId(departmentId);
    console.log("Opening menu for department:", departmentId);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseDialog = () => {
    setIsFolderDialogOpen(false);
    setSelectedDepartmentId(null);
    setSelectedFolders([]);
  };

  const fetchFoldersWithAssignments = async (departmentId: number) => {
    try {
      setIsLoading(true);

      // Fetch all folders
      const allFoldersResponse = await AxiosInstance.get("folders/all");
      console.log("All folders:", allFoldersResponse.data);

      // Fetch assigned folders for the department
      const assignedFoldersResponse = await AxiosInstance.get(
        `folders/department/${departmentId}`,
      );
      console.log("Assigned folders:", assignedFoldersResponse.data);

      // Create a Set of assigned folder IDs for quick lookup
      const assignedFolderIds = new Set(
        assignedFoldersResponse.data.map((folder: IFolder) => folder.id),
      );
      console.log("Assigned folder IDs:", Array.from(assignedFolderIds));

      // Mark folders as assigned or not with explicit type checking
      const foldersWithAssignments = allFoldersResponse.data.map(
        (folder: IFolder) => {
          const isAssigned = assignedFolderIds.has(folder.id);
          console.log(
            `Folder ${folder.id} (${folder.folderName}) assigned: ${isAssigned}`,
          );

          return {
            ...folder,
            isAssigned: isAssigned,
          };
        },
      );

      console.log("Final folders with assignments:", foldersWithAssignments);
      setFolders(foldersWithAssignments);
      setError(null);
    } catch (error) {
      console.error("Error fetching folders and assignments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load folders when department is selected
  useEffect(() => {
    if (selectedDepartmentId) {
      console.log("Selected Department ID:", selectedDepartmentId);
      fetchFoldersWithAssignments(selectedDepartmentId);
    }
  }, [selectedDepartmentId]);

  // Add type checking for folder ID comparison
  const handleFolderCheckboxChange = async (
    folderId: number,
    isChecked: boolean,
  ) => {
    console.log("Checkbox change:", { folderId, isChecked });
    if (!selectedDepartmentId) return;
    await handleFolderAssignment(selectedDepartmentId, folderId, isChecked);
  };

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
            <Tab>Case Studies</Tab>
            <Tab>Departments</Tab>
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

          {/* Case Studies Tab */}
          <Box p={2}>
            <Routes>
              <Route path="/" element={<CaseStudies />} />
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(departments) &&
                    departments.map((department: IDepartment) => (
                      <tr key={department.id!}>
                        <td>{department.departmentName}</td>
                        <td>
                          {convertArrayToDate(
                            department.createdDate!,
                          ).toDateString()}
                        </td>
                        <td>
                          {convertArrayToDate(
                            department.lastModifiedDateTime!,
                          ).toDateString()}
                        </td>
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
                                    "Error deleting department:",
                                    err,
                                  );
                                }
                              }
                            }}
                          >
                            Delete
                          </Button>

                          {/* Three-dotted icon */}
                          <IconButton
                            onClick={(event) =>
                              handleOpenAssignDialog(event, department.id!)
                            }
                          >
                            <MoreVert />
                          </IconButton>

                          {/* Menu for assigning folders */}
                          <Menu
                            anchorEl={anchorEl} // The element the menu is anchored to
                            open={Boolean(anchorEl)} // Open when anchorEl is not null
                            onClose={handleCloseMenu} // Close the menu
                          >
                            <Menu
                              anchorEl={anchorEl}
                              open={
                                Boolean(anchorEl) &&
                                selectedDepartmentId === department.id
                              }
                              onClose={handleCloseMenu}
                            >
                              <MenuItem
                                onClick={() =>
                                  handleAssignFolders(department.id!)
                                }
                              >
                                Assign Folders
                              </MenuItem>
                            </Menu>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Sheet>
          </Box>
        </SwipeableViews>

        <Modal
          open={isFolderDialogOpen}
          onClose={() => setIsFolderDialogOpen(false)}
        >
          <ModalDialog>
            <Typography component="h2" fontSize="lg" mb={2}>
              Manage Folder Assignments for Department
            </Typography>
            <Stack gap={2}>
              {isLoading && <Typography>Loading...</Typography>}
              {error && <Typography>{error}</Typography>}
              {folders.map((folder: IFolder) => (
                <FormControl key={folder.id}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Checkbox
                      checked={Boolean(folder.isAssigned)}
                      onChange={(e) =>
                        handleFolderCheckboxChange(folder.id!, e.target.checked)
                      }
                      disabled={isLoading}
                    />
                    <FormLabel>{folder.folderName}</FormLabel>
                  </Stack>
                </FormControl>
              ))}
            </Stack>
          </ModalDialog>
        </Modal>

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
