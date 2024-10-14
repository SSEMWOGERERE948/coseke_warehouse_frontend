import React, { useState, useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Switch from "@mui/joy/Switch";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import { AxiosInstance } from "../../core/baseURL";
import {
  Modal,
  Box,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Checkbox,
  Chip,
} from "@mui/joy";

interface CaseStudy {
  id: number;
  name: string;
  enabled: boolean;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  status?: string;
}

export default function CaseStudiesScreen() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newCaseStudy, setNewCaseStudy] = useState({
    name: "",
    description: "",
  });
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(
    null,
  );
  const [assignedUsers, setAssignedUsers] = useState<number[]>([]);

  // Fetch case studies on component mount
  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const response = await AxiosInstance.get("case-studies/all");

      const fetchedCaseStudies = response.data.map((study: any) => ({
        id: study.id,
        name: study.name,
        enabled: true, // Assuming all case studies are enabled by default
      }));

      setCaseStudies(fetchedCaseStudies);
    } catch (error: any) {
      console.error(
        "Error fetching case studies:",
        error.response?.data || error.message,
      );
    }
  };

  // Fetch users from the API when assigning a user
  const fetchUsers = async () => {
    try {
      const response = await AxiosInstance.get("users");
      setUsers(response.data); // Update state with fetched users
    } catch (error: any) {
      console.error(
        "Error fetching users:",
        error.response?.data || error.message,
      );
    }
  };

  // Handle case study enable/disable toggle
  const handleToggleCaseStudy = (studyId: number) => {
    setCaseStudies((prevStudies) =>
      prevStudies.map((study) =>
        study.id === studyId
          ? {
              ...study,
              enabled: !study.enabled,
            }
          : study,
      ),
    );
  };

  // Handle new case study input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCaseStudy({
      ...newCaseStudy,
      [e.target.name]: e.target.value,
    });
  };

  // Submit new case study to the API and add to the list
  const submitNewCaseStudy = async () => {
    try {
      const response = await AxiosInstance.post(
        "case-studies/create-cases",
        newCaseStudy,
      );
      const createdCaseStudy = response.data;

      // Append newly created case study to the existing list
      setCaseStudies((prevStudies) => [
        ...prevStudies,
        {
          id: createdCaseStudy.id,
          name: createdCaseStudy.name,
          enabled: true,
        },
      ]);
      setModalOpen(false); // Close modal after successful creation
    } catch (error: any) {
      console.error("Error creating case study:", error);
    }
  };

  const handleAssignUser = async (study: CaseStudy) => {
    setSelectedCaseStudy(study);
    await fetchUsers(); // Fetch all users when opening the modal

    // Fetch assigned user IDs for the selected case study
    const assignedUserIds = await fetchAssignedUserIds(study.id);

    // Automatically check the users that are already assigned
    const preSelectedUsers = users.filter((user) =>
      assignedUserIds.includes(user.id),
    );

    setSelectedUsers(preSelectedUsers); // Set those users as pre-selected in the state

    setAssignModalOpen(true); // Open the modal
  };

  // Handle user search input
  const handleUserSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(
    (user) =>
      user &&
      user.first_name &&
      user.first_name
        .toLocaleLowerCase()
        .includes(searchTerm.toLocaleLowerCase()),
  );

  // Assign user to the selected case study
  // Assign users to the selected case study
  const assignUserToCaseStudy = async () => {
    if (selectedUsers.length > 0 && selectedCaseStudy) {
      try {
        await AxiosInstance.post("case-studies/assign-user", {
          caseStudyId: selectedCaseStudy.id,
          userId: selectedUsers.map((user) => user.id), // Sending an array of user IDs
        });
        fetchCaseStudies(); // Optionally refresh case studies list
        setAssignModalOpen(false); // Close assign modal after success
        setSelectedUsers([]); // Reset selected users
      } catch (error: any) {
        console.error(
          "Error assigning user to case study:",
          error.response?.data || error.message,
        );
      }
    }
  };

  const fetchAssignedUserIds = async (
    caseStudyId: number,
  ): Promise<number[]> => {
    try {
      const response = await AxiosInstance.post("case-studies/assigned-users", {
        caseStudyId,
      });
      return response.data.map((user: User) => user.id); // Return an array of user IDs
    } catch (error: any) {
      console.error(
        "Error fetching assigned users:",
        error.response?.data || error.message,
      );
      return []; // Return an empty array on error
    }
  };

  const unassignUser = async (caseStudyId: number, userId: number) => {
    try {
      await AxiosInstance.post("case-studies/unassign-user", {
        caseStudyId,
        userId,
      });
      console.log(`User ${userId} unassigned from case study ${caseStudyId}`);
    } catch (error: any) {
      console.error(
        "Error unassigning user:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
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

        {/* Modal for creating new case study */}
        <Modal
          open={isModalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="create-case-study-modal"
        >
          <Box
            sx={{
              p: 2,
              bgcolor: "background.paper",
              borderRadius: "sm",
              width: "300px",
              mx: "auto",
              mt: "20%",
            }}
          >
            <Typography
              id="create-case-study-modal"
              level="h2"
              mb={2}
              fontSize="lg"
            >
              Create New Case Study
            </Typography>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={newCaseStudy.name}
                onChange={handleInputChange}
                placeholder="Enter case study name"
                size="sm"
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={newCaseStudy.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                size="sm"
              />
            </FormControl>
            <Button
              sx={{ mt: 3, width: "100%" }}
              onClick={submitNewCaseStudy}
              color="success"
              variant="solid"
            >
              Submit
            </Button>
          </Box>
        </Modal>

        {/* Grid displaying case studies */}
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
                <Button
                  variant="soft"
                  size="sm"
                  sx={{ mt: 2 }}
                  onClick={() => handleAssignUser(study)}
                >
                  Assign User
                </Button>
              </Sheet>
            </Grid>
          ))}
        </Grid>

        {/* Modal for assigning user */}
        <Modal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          aria-labelledby="assign-user-modal"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90vw",
              height: "90vh",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "sm",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography id="assign-user-modal" level="h2" mb={2}>
              Assign Users to Case Study: {selectedCaseStudy?.name}
            </Typography>
            <FormControl>
              <FormLabel>Search User</FormLabel>
              <Input
                value={searchTerm}
                onChange={handleUserSearch}
                placeholder="Search users..."
                size="sm"
                sx={{ mb: 2 }}
              />
            </FormControl>
            <Sheet sx={{ flexGrow: 1, overflow: "auto" }}>
              <Table
                aria-label="user selection table"
                stickyHeader
                sx={{
                  "& thead th:nth-of-type(1)": { width: "50px" },
                  "& thead th:nth-of-type(2)": { width: "30%" },
                  "& thead th:nth-of-type(3)": { width: "30%" },
                  "& thead th:nth-of-type(4)": { width: "20%" },
                  "& thead th:nth-of-type(5)": { width: "20%" },
                }}
              >
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      style={{
                        cursor: "pointer",
                        backgroundColor: selectedUsers.some(
                          (selected) => selected.id === user.id,
                        )
                          ? "rgba(0, 0, 0, 0.04)"
                          : "inherit",
                      }}
                    >
                      <td>
                        <label className="custom-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedUsers.some(
                              (selected) => selected.id === user.id,
                            )} // Auto-check if user is in selectedUsers
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers((prev) => [...prev, user]); // Add user to selectedUsers
                              } else {
                                setSelectedUsers((prev) =>
                                  prev.filter(
                                    (selected) => selected.id !== user.id,
                                  ),
                                ); // Remove user from selectedUsers
                              }
                            }}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>{`${user.first_name} ${user.last_name}`}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.address}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
              <Typography>Selected users: {selectedUsers.length}</Typography>
              <Button
                onClick={assignUserToCaseStudy}
                color="primary"
                disabled={selectedUsers.length === 0}
              >
                Assign Selected Users
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </CssVarsProvider>
  );
}
