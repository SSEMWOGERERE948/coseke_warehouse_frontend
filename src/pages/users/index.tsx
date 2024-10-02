import React, { useState } from "react";
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

interface User {
  id: number;
  name: string;
  email: string;
  access: string[];
  lastActive: string;
  dateAdded: string;
}

const users: User[] = [
  {
    id: 1,
    name: "Florence Shaw",
    email: "florence@untitledui.com",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 2,
    name: "Amélie Laurent",
    email: "amelie@untitledui.com",
    access: ["Admin", "Data Export", "Data Import"],
    lastActive: "Mar 4, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 3,
    name: "Ammar Foley",
    email: "ammar@untitledui.com",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 2, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 4,
    name: "Caitlyn King",
    email: "caitlyn@untitledui.com",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
  },
  {
    id: 5,
    name: "Sienna Hewitt",
    email: "sienna@untitledui.com",
    access: ["Data Export", "Data Import"],
    lastActive: "Mar 6, 2024",
    dateAdded: "July 4, 2022",
  },
];

const Index: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<keyof User | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState<{
    name: string;
    email: string;
    access: string[];
  }>({
    name: "",
    email: "",
    access: [],
  });

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
    setNewUser({ name: "", email: "", access: [] });
  };

  const handleSubmitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("New user submitted:", newUser);
    handleCloseAddUser();
  };

  const handleAccessChange = (access: string) => {
    setNewUser((prev) => ({
      ...prev,
      access: prev.access.includes(access)
        ? prev.access.filter((a) => a !== access)
        : [...prev.access, access],
    }));
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
                onClick={() => handleSort("name")}
                style={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center">
                  User name
                  {sortColumn === "name" &&
                    (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </Stack>
              </th>
              <th>Access</th>
              <th
                onClick={() => handleSort("lastActive")}
                style={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center">
                  Last active
                  {sortColumn === "lastActive" &&
                    (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </Stack>
              </th>
              <th
                onClick={() => handleSort("dateAdded")}
                style={{ cursor: "pointer" }}
              >
                <Stack direction="row" alignItems="center">
                  Date added
                  {sortColumn === "dateAdded" &&
                    (sortDirection === "asc" ? <ChevronUp /> : <ChevronDown />)}
                </Stack>
              </th>
              <th style={{ width: 60 }} />
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <Checkbox size="sm" />
                </td>
                <td>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar size="sm">{user.name.charAt(0)}</Avatar>
                    <Stack>
                      <Typography level="body-sm">{user.name}</Typography>
                      <Typography level="body-xs" color="neutral">
                        {user.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </td>
                <td>
                  <Stack direction="row" spacing={1}>
                    {user.access.map((access) => (
                      <Typography
                        key={access}
                        level="body-xs"
                        sx={{
                          backgroundColor: "primary.100",
                          color: "primary.700",
                          borderRadius: "sm",
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        {access}
                      </Typography>
                    ))}
                  </Stack>
                </td>
                <td>
                  <Typography level="body-sm">{user.lastActive}</Typography>
                </td>
                <td>
                  <Typography level="body-sm">{user.dateAdded}</Typography>
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

      <Modal open={isAddUserOpen} onClose={handleCloseAddUser}>
        <ModalDialog
          aria-labelledby="add-user-modal-title"
          aria-describedby="add-user-modal-description"
          sx={{
            maxWidth: 500,
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
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "background.body",
            }}
          />
          <Typography
            id="add-user-modal-title"
            component="h2"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Add New User
          </Typography>
          <form onSubmit={handleSubmitNewUser}>
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  autoFocus
                  required
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  required
                  type="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Access</FormLabel>
                <Stack direction="row" spacing={2}>
                  {["Admin", "Data Export", "Data Import"].map((access) => (
                    <Checkbox
                      key={access}
                      label={access}
                      checked={newUser.access.includes(access)}
                      onChange={() => handleAccessChange(access)}
                    />
                  ))}
                </Stack>
              </FormControl>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="flex-end"
                mt={2}
              >
                <Button
                  variant="plain"
                  color="neutral"
                  onClick={handleCloseAddUser}
                >
                  Cancel
                </Button>
                <Button type="submit">Add User</Button>
              </Stack>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
  );
};

export default Index;
