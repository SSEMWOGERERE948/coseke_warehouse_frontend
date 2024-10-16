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
  List,
  ListItem,
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { useNavigate } from "react-router-dom";
import { FormGroup } from "@mui/material";

interface Role {
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
}

const Index: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
  }>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false); // Permission state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AxiosInstance.get("/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await AxiosInstance.get("/roles/all");
        setAvailableRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchUsers();
    fetchRoles();

    // Assume this is where you would check for permission via an API call
    const checkUserPermission = async () => {
      try {
        const response = await AxiosInstance.get("/user/permissions");
        setHasPermission(response.data.canEdit); // Assuming `canEdit` field from API
      } catch (error) {
        console.error("Error checking permissions:", error);
      }
    };

    checkUserPermission();
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
    });
  };

  const handleSubmitNewUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      ...newUser,
    };

    try {
      const response = await AxiosInstance.post("users/create-users", userData);
      const newUserId = response.data.id;

      setUsers((prev) => [
        ...prev,
        {
          id: newUserId,
          ...userData,
        },
      ]);

      handleCloseAddUser();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleUpdateUser = (user: User) => {
    setSelectedUser(user);
    setSelectedRoleIds([]); // Clear previously selected roles
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

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const roleId = parseInt(event.target.value);
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const handleCloseEditUser = () => {
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  const handleSubmitRoles = async () => {
    if (!selectedUser || selectedRoleIds.length === 0) {
      console.error("No roles selected or user data missing.");
      return;
    }

    try {
      const payload = {
        userId: selectedUser.id,
        userType: selectedRoleIds.map(
          (id) => availableRoles.find((role) => role.id === id)?.name,
        ),
      };

      await AxiosInstance.post(`assign-userType`, payload);
      setIsEditUserOpen(false);
    } catch (error) {
      console.error("Error assigning user roles:", error);
    }
  };

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
                  <Stack direction="row" spacing={1}>
                    {hasPermission ? (
                      <Button
                        variant="plain"
                        size="sm"
                        onClick={() => handleUpdateUser(user)} // Trigger edit modal with user details
                      >
                        <Edit />
                      </Button>
                    ) : null}
                    <Button
                      variant="plain"
                      color="danger"
                      size="sm"
                      onClick={() => handleRemoveUser(user.id)} // Remove user
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
                  defaultValue={newUser.last_name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, last_name: e.target.value })
                  }
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
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
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={selectedUser?.first_name + " " + selectedUser?.last_name}
                disabled={!hasPermission}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser!,
                    first_name: e.target.value.split(" ")[0],
                    last_name: e.target.value.split(" ")[1],
                  })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={selectedUser?.email}
                disabled={!hasPermission}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, email: e.target.value })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Phone</FormLabel>
              <Input
                type="phone"
                value={selectedUser?.phone}
                disabled={!hasPermission}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, phone: e.target.value })
                }
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Address</FormLabel>
              <Input
                type="text"
                value={selectedUser?.address}
                disabled={!hasPermission}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser!, address: e.target.value })
                }
              />
            </FormControl>

            {/* Roles selection */}
            <FormControl component="fieldset" sx={{ mt: 3 }}>
              <FormLabel component="legend">Select Roles</FormLabel>
              <FormGroup>
                <List>
                  {availableRoles.map((role) => (
                    <ListItem key={role.id}>
                      <Checkbox
                        value={role.id.toString()}
                        checked={selectedRoleIds.includes(role.id)}
                        onChange={handleRoleChange}
                        disabled={!hasPermission}
                      />
                      <Typography>{role.name}</Typography>
                    </ListItem>
                  ))}
                </List>
              </FormGroup>
            </FormControl>

            {hasPermission ? (
              <Button
                fullWidth
                variant="solid"
                color="primary"
                onClick={handleSubmitRoles}
                sx={{ mt: 3 }}
              >
                Update User and Roles
              </Button>
            ) : null}
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Index;
