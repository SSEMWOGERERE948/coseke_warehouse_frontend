import React, { useState, useEffect } from "react";
import {
  CssVarsProvider,
  CssBaseline,
  Box,
  Typography,
  Switch,
  Checkbox,
  Sheet,
  Grid,
  Tabs,
  Tab,
  TabList,
  Button,
  Modal,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
} from "@mui/joy";
import SwipeableViews from "react-swipeable-views";
import { AxiosInstance } from "../../core/baseURL"; // Your Axios instance
import { useParams } from "react-router-dom";

interface Permission {
  id: string;
  permissionName: string;
  checked: boolean;
}

interface RolePermissions {
  role: string;
  enabled: boolean;
  permissions: Permission[];
}

interface CaseStudy {
  id: number;
  name: string;
  enabled: boolean;
  permissions: { name: string; checked: boolean }[];
}

export default function SystemPermissions() {
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

  // Fetch permissions by role
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await AxiosInstance.get("permissions/all");

        // Organize permissions based on roles and apply predefined role-based permissions
        const organizedPermissions = [
          {
            role: "Dashboard",
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
                checked: true,
              })),
          },
          {
            role: "Files",
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
                checked: true,
              })),
          },
          {
            role: "Folders",
            enabled: false,
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
                checked: false,
              })),
          },
          {
            role: "Users",
            enabled: false,
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
                checked: false,
              })),
          },
          {
            role: "Case Studies",
            enabled: false,
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
                checked: false,
              })),
          },
        ];

        setPermissionsByRole(organizedPermissions);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

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
              enabled: !role.enabled,
              permissions: role.permissions.map((perm) => ({
                ...perm,
                checked: role.enabled ? false : perm.checked,
              })),
            }
          : role,
      ),
    );
  };

  // Toggle specific permissions for a role
  const handlePermissionToggle = (roleIndex: number, permId: string) => {
    setPermissionsByRole((prevRoles) =>
      prevRoles.map((role, index) =>
        index === roleIndex
          ? {
              ...role,
              permissions: role.permissions.map((perm) =>
                perm.id === permId ? { ...perm, checked: !perm.checked } : perm,
              ),
            }
          : role,
      ),
    );
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

  // Handle case study form input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCaseStudy({
      ...newCaseStudy,
      [e.target.name]: e.target.value,
    });
  };

  // Submit new case study
  const submitNewCaseStudy = async () => {
    try {
      const response = await AxiosInstance.post(
        "case-studies/create-cases",
        newCaseStudy,
      );
      const createdCaseStudy = response.data;

      setCaseStudies((prevStudies) => [
        ...prevStudies,
        {
          id: createdCaseStudy.id,
          name: createdCaseStudy.name,
          enabled: true,
          permissions: [], // Initially no permissions
        },
      ]);

      setModalOpen(false);
    } catch (error) {
      console.error("Error creating case study:", error);
    }
  };

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
            <Tab>System Roles</Tab>
            <Tab>Case Studies</Tab>
          </TabList>
        </Tabs>

        <SwipeableViews index={tabIndex} onChangeIndex={setTabIndex}>
          {/* System Roles and Permissions */}
          <Box p={2}>
            <Typography level="h1" fontSize="xl" mb={2}>
              System Roles and Permissions
            </Typography>
            <FormControl>
              <FormLabel>Select Role</FormLabel>
              <Select>
                <Option value={1}>Super_Admin</Option>
                <Option value={3}>Admin</Option>
                <Option value={4}>User</Option>
              </Select>
            </FormControl>
            <Grid container spacing={3}>
              {permissionsByRole.map((role, roleIndex) => (
                <Grid key={role.role} xs={12} md={6} lg={4}>
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
                        {role.role}
                      </Typography>
                      <Switch
                        checked={role.enabled}
                        onChange={() => handleRoleToggle(roleIndex)}
                        color={role.enabled ? "success" : "neutral"}
                        slotProps={{
                          input: { "aria-label": `Toggle ${role.role} role` },
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
                          label={perm.permissionName}
                          checked={perm.checked}
                          onChange={() =>
                            handlePermissionToggle(roleIndex, perm.id)
                          }
                          disabled={!role.enabled}
                          slotProps={{
                            input: {
                              "aria-label": `${perm.permissionName} permission for ${role.role}`,
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

          {/* Case Studies */}
          <Box p={2}>
            <Typography level="h1" fontSize="xl" mb={4}>
              Case Studies
            </Typography>
            <Button
              onClick={() => setModalOpen(true)}
              sx={{ mb: 4 }}
              color="primary"
              variant="solid"
            >
              Create Case Study
            </Button>
            <Modal
              open={isModalOpen}
              onClose={() => setModalOpen(false)}
              aria-labelledby="create-case-study-modal"
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: "background.surface",
                  borderRadius: "sm",
                  boxShadow: "md",
                  width: "500px",
                  mx: "auto",
                  mt: "10vh",
                }}
              >
                <Typography level="h2" fontSize="lg" mb={2}>
                  Create New Case Study
                </Typography>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={newCaseStudy.name}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    name="description"
                    value={newCaseStudy.description}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                  />
                </FormControl>
                <Button
                  onClick={submitNewCaseStudy}
                  color="primary"
                  variant="solid"
                >
                  Submit
                </Button>
              </Box>
            </Modal>

            <Grid container spacing={3}>
              {caseStudies.map((study) => (
                <Grid key={study.id} xs={12} md={6} lg={4}>
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
                        {study.name}
                      </Typography>
                      <Switch
                        checked={study.enabled}
                        onChange={() => handleToggleCaseStudy(study.id)}
                        color={study.enabled ? "success" : "neutral"}
                        slotProps={{
                          input: {
                            "aria-label": `Toggle ${study.name} case study`,
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
                      {study.permissions.map((perm) => (
                        <Checkbox
                          key={perm.name}
                          label={perm.name}
                          checked={perm.checked}
                          onChange={() =>
                            handlePermissionToggleCaseStudy(study.id, perm.name)
                          }
                          disabled={!study.enabled}
                          slotProps={{
                            input: {
                              "aria-label": `${perm.name} permission for ${study.name}`,
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
