import React, { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp, Trash2, Edit } from "lucide-react";
import {
  Avatar,
  Button,
  Input,
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Stack,
  FormControl,
  FormLabel,
  Box,
  Table,
  Sheet,
  Checkbox,
  Select,
  Option,
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { FormControlLabel, FormGroup } from "@mui/material";

interface Role {
  id: number;
  name: string;
}

interface Organization {
  id: number;
  name: string;
}

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  roles: any;
  organization?: {
    id: number;
    name: string;
  };
}

const Index: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [availableOrganizations, setAvailableOrganizations] = useState<
    Organization[]
  >([]);
  const [selectedOrganization, setSelectedOrganization] = useState<
    number | null
  >(null);

  const [newUser, setNewUser] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    roles: any;
  }>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    roles: null,
  });

  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isLoadingOrganizations, setIsLoadingOrganizations] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      setIsLoadingOrganizations(true);
      try {
        const response = await AxiosInstance.get("/organizations/all");
        setAvailableOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      } finally {
        setIsLoadingOrganizations(false);
      }
    };
    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          AxiosInstance.get("/users"),
          AxiosInstance.get("/roles/all"),
        ]);
        setUsers(usersRes.data);
        setAvailableRoles(rolesRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (!sortColumn) return 0;
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleAddUser = () => {
    setIsAddUserOpen(true);
  };

  const handleCloseAddUser = () => {
    setIsAddUserOpen(false);
    setNewUser({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      roles: null,
    });
    setEmailError(null);
  };

  const handleSubmitNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    try {
      // Change this to capture the response from the API
      const response = await AxiosInstance.post("users/create-users", newUser);
      // Use the ID returned from the backend instead of Date.now()
      const createdUser = response.data;
      setUsers((prev) => [...prev, createdUser]);
      handleCloseAddUser();
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        if (error.response.data.includes("Email is already in use")) {
          setEmailError(
            "Email is already in use. Please use a different email.",
          );
        }
      }
      console.error("Error adding user:", error);
    }
  };

  const handleEditUser = async (user: User) => {
    setSelectedUser(user);
    setSelectedRoleIds(user.roles?.map((role: { id: any }) => role.id) || []);

    // Make sure organizations are fetched before opening the edit modal
    if (availableOrganizations.length === 0) {
      try {
        const response = await AxiosInstance.get("/organizations/all");
        setAvailableOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    }

    // Set selected organization if user has one
    if (user.organization) {
      setSelectedOrganization(user.organization.id);
    } else {
      setSelectedOrganization(null);
    }

    setIsEditUserOpen(true);
  };

  const handleRemoveUser = async (userId: number) => {
    try {
      await AxiosInstance.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleRoleChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const roleId = parseInt(event.target.value);
    const isChecked = event.target.checked;

    if (!selectedUser) return;

    try {
      if (isChecked) {
        // Assign the role
        await AxiosInstance.post(`/assign-userType`, {
          userId: selectedUser.id,
          userTypes: [availableRoles.find((role) => role.id === roleId)?.name],
        });
        setSelectedRoleIds((prev) => [...prev, roleId]);
      } else {
        // Unassign the role
        await AxiosInstance.post(`/unassign-userType`, {
          userId: selectedUser.id,
          userTypes: [availableRoles.find((role) => role.id === roleId)?.name],
        });
        setSelectedRoleIds((prev) => prev.filter((id) => id !== roleId));
      }
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleCloseEditUser = () => {
    setIsEditUserOpen(false);
    setSelectedUser(null);
    setSelectedOrganization(null);
  };

  const handleSubmitRoles = async () => {
    if (!selectedUser || selectedRoleIds.length === 0) {
      console.error("No roles selected or user data missing.");
      return;
    }

    try {
      const payload = {
        userId: selectedUser.id,
        userTypes: selectedRoleIds.map(
          (id) => availableRoles.find((role) => role.id === id)?.name,
        ),
      };

      await AxiosInstance.post(`assign-userType`, payload);
    } catch (error) {
      console.error("Error assigning user roles:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      const updateData = {
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        email: selectedUser.email,
        phone: selectedUser.phone,
        address: selectedUser.address,
        organizationId: selectedOrganization,
      };

      await AxiosInstance.post(`/users/update/${selectedUser.id}`, updateData);

      // Update the user in the local state
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                ...updateData,
                organization: selectedOrganization
                  ? availableOrganizations.find(
                      (org) => org.id === selectedOrganization,
                    )
                  : undefined,
              }
            : user,
        ),
      );

      handleCloseEditUser();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await AxiosInstance.get("/organizations/all");
        setAvailableOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 4 }}
      >
        <Typography level="h2">All users ({users.length})</Typography>
        <Stack direction="row" spacing={2}>
          <Input
            startDecorator={<Search />}
            placeholder="Search"
            sx={{ width: 200 }}
          />
          <Button
            variant="outlined"
            endDecorator={<ChevronDown />}
            sx={{ minWidth: 100 }}
          >
            Filters
          </Button>
          <Button onClick={handleAddUser} sx={{ minWidth: 120 }}>
            + Add user
          </Button>
        </Stack>
      </Stack>

      <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "auto" }}>
        <Table stickyHeader hoverRow>
          <thead>
            <tr>
              <th style={{ width: 40 }} />
              <th
                onClick={() => handleSort("first_name")}
                style={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center">
                  Name
                  {sortColumn === "first_name" &&
                    (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </Stack>
              </th>

              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Organization</th>
              <th style={{ width: 120 }} />
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id} style={{ cursor: "pointer" }}>
                <td />
                <td>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar size="sm">{user.first_name.charAt(0)}</Avatar>
                    <Stack>
                      <Typography level="body-sm">
                        {user.first_name} {user.last_name}
                      </Typography>
                      <Typography level="body-xs" color="neutral">
                        {user.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </td>

                <td>
                  <Typography level="body-sm">{user.email}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">{user.phone}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">{user.address}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">
                    {user.organization?.name || "Not assigned"}
                  </Typography>
                </td>
                <td>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="plain"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit />
                    </Button>
                    <Button
                      variant="plain"
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)}
                    >
                      <Trash2 />
                    </Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      {/* Add User Modal */}
      <Modal open={isAddUserOpen} onClose={handleCloseAddUser}>
        <ModalDialog
          aria-labelledby="add-user-modal-title"
          aria-describedby="add-user-modal-description"
          sx={{
            maxWidth: "400px",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose />
          <Typography level="h4" fontWeight="bold" textAlign="center">
            Add New User
          </Typography>

          <form onSubmit={handleSubmitNewUser}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  required
                  value={newUser.first_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, first_name: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  required
                  value={newUser.last_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, last_name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl error={!!emailError}>
                <FormLabel>Email</FormLabel>
                <Input
                  required
                  value={newUser.email}
                  onChange={(e) => {
                    setNewUser({ ...newUser, email: e.target.value });
                    setEmailError(null); // Reset error when user types
                  }}
                  sx={{
                    borderColor: emailError ? "red" : "",
                    backgroundColor: emailError ? "#ffeeee" : "",
                  }}
                />
                {emailError && (
                  <Typography sx={{ color: "red", fontSize: "12px" }}>
                    {emailError}
                  </Typography>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  required
                  type="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  required
                  value={newUser.phone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  required
                  value={newUser.address}
                  onChange={(e) =>
                    setNewUser({ ...newUser, address: e.target.value })
                  }
                />
              </FormControl>

              <Button type="submit" fullWidth>
                Add User
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>

      {/* Modal for Editing User and Assigning Roles */}
      <Modal open={isEditUserOpen} onClose={handleCloseEditUser}>
        <ModalDialog
          sx={{
            maxHeight: "80vh",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <ModalClose />
          <Box sx={{ maxWidth: 500, margin: "auto", p: 3 }}>
            <Typography level="h2" sx={{ mb: 3 }}>
              Edit User and Assign Roles
            </Typography>
            {/* Form for editing user details */}
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                value={selectedUser?.first_name || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser!,
                    first_name: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                value={selectedUser?.last_name || ""}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser!,
                    last_name: e.target.value,
                  })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={selectedUser?.email || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={selectedUser?.phone || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, phone: e.target.value })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                value={selectedUser?.address || ""}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, address: e.target.value })
                }
              />
            </FormControl>

            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Organization</FormLabel>
              <Select
                placeholder={
                  isLoadingOrganizations
                    ? "Loading organizations..."
                    : availableOrganizations.length > 0
                      ? "Select an organization"
                      : "No organizations available"
                }
                value={
                  selectedOrganization !== null
                    ? selectedOrganization.toString()
                    : ""
                }
                onChange={(e, value) =>
                  setSelectedOrganization(value ? Number(value) : null)
                }
                size="md"
                disabled={
                  isLoadingOrganizations || availableOrganizations.length === 0
                }
              >
                {availableOrganizations.length > 0 ? (
                  availableOrganizations.map((org) => (
                    <Option key={org.id} value={org.id.toString()}>
                      {org.name}
                    </Option>
                  ))
                ) : (
                  <Option key="no-orgs" value="" disabled>
                    {isLoadingOrganizations
                      ? "Loading..."
                      : "No organizations available"}
                  </Option>
                )}
              </Select>
            </FormControl>

            {/* Roles selection */}
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <FormLabel component="legend">Select Roles</FormLabel>
              <FormGroup>
                {availableRoles.map((role) => (
                  <FormControlLabel
                    key={role.id}
                    control={
                      <Checkbox
                        checked={selectedRoleIds.includes(role.id)} // Check if the role is already assigned
                        onChange={handleRoleChange}
                        value={role.id}
                      />
                    }
                    label={role.name}
                  />
                ))}
              </FormGroup>
            </FormControl>

            <Button
              fullWidth
              variant="solid"
              color="primary"
              onClick={async () => {
                await handleUpdateUser();
                await handleSubmitRoles();
              }}
              sx={{ mt: 3 }}
            >
              Update User and Roles
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Index;
