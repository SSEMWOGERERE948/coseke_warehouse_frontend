import React, { useEffect, useState } from "react";
import { Search, ChevronDown, MoreVertical, ChevronUp } from "lucide-react";
import {
  Avatar,
  Button,
  Checkbox,
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
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { useNavigate } from "react-router-dom";

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
    roles: number[]; // Roles represented as an array of numbers
    userType: string; // User type field
  }>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    roles: [], // Initialize roles as empty array
    userType: "", // Initialize userType
  });

  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AxiosInstance.get("/users");
        setUsers(response.data); // Set the fetched users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Sorting functionality
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

  // Handle modal opening and closing
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
      roles: [], // Reset roles
      userType: "", // Reset userType
    });
  };

  // Handle form submission for adding a new user
  const handleSubmitNewUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      ...newUser,
    };

    try {
      const response = await AxiosInstance.post("/create-users", userData);
      const newUserId = response.data.id; // Assuming the response contains the new user's id

      setUsers((prev) => [
        ...prev,
        {
          id: newUserId,
          ...userData,
        },
      ]);

      // Close the modal
      handleCloseAddUser();

      // Navigate to the roles-and-permissions page with the new user's id
      navigate(`/roles-and-permissions/${newUserId}`);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  // Handle role selection
  const handleRoleChange = (roleId: number) => {
    setNewUser((prev) => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter((id) => id !== roleId) // Remove role if unchecked
        : [...prev.roles, roleId], // Add role if checked
    }));
  };

  // Navigate to roles and permissions when clicking a row
  const handleRowClick = (userId: number) => {
    navigate(`/roles-and-permissions/${userId}`);
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
              <th style={{ width: 40 }}>
                <Checkbox size="sm" />
              </th>
              <th
                onClick={() => handleSort("first_name")}
                style={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center">
                  First Name
                  {sortColumn === "first_name" &&
                    (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </Stack>
              </th>
              <th
                onClick={() => handleSort("last_name")}
                style={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center">
                  Last Name
                  {sortColumn === "last_name" &&
                    (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </Stack>
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr
                key={user.id}
                onClick={() => handleRowClick(user.id)} // Pass user ID on row click
                style={{ cursor: "pointer" }}
              >
                <td>
                  <Checkbox size="sm" />
                </td>
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
                  <Typography level="body-sm">{user.last_name}</Typography>
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
                  <Button variant="plain" color="neutral" size="sm">
                    <MoreVertical />
                  </Button>
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
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
            }}
          />
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

              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
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
                  type="password"
                  required
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

              <FormControl>
                <FormLabel>Roles</FormLabel>
                <Checkbox
                  label="Admin"
                  checked={newUser.roles.includes(3)}
                  onChange={() => handleRoleChange(3)}
                />
                <Checkbox
                  label="User"
                  checked={newUser.roles.includes(4)}
                  onChange={() => handleRoleChange(4)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>User Type</FormLabel>
                <Stack direction="row" spacing={2}>
                  {["ADMIN", "USER"].map((type) => (
                    <Checkbox
                      key={type}
                      label={type}
                      checked={newUser.userType === type}
                      onChange={() =>
                        setNewUser((prev) => ({ ...prev, userType: type }))
                      }
                    />
                  ))}
                </Stack>
              </FormControl>

              <Button type="submit" fullWidth variant="solid" color="primary">
                Add User
              </Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Index;
