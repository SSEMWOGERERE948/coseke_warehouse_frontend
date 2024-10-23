import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Typography,
  Box,
  List,
  ListItem,
  FormControl,
  FormLabel,
  Checkbox,
  ModalDialog,
  ModalClose,
  Input,
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { useParams, useNavigate } from "react-router-dom";
import { FormGroup } from "@mui/material";

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string; // Add other user fields as necessary
}

export default function UserRoles() {
  const { id } = useParams<{ id: string }>();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<Role[]>([]);
  const [user, setUser] = useState<User | null>(null); // State to hold user data
  const [userName, setUserName] = useState<string>(""); // State for editable user name
  const [userEmail, setUserEmail] = useState<string>(""); // State for editable user email
  const [open, setOpen] = useState(true); // Modal open state
  const navigate = useNavigate();
  const [phone, setUserPhone] = useState<string>(""); //state for editable user phone
  const [address, setUserAddress] = useState<string>("");

  // Fetch roles and user details
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await AxiosInstance.get("/roles/all");
        setAvailableRoles(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await AxiosInstance.get(`/users/${id}`);
        const fetchedUser = response.data;
        setUser(fetchedUser);
        setUserName(fetchedUser.first_name + " " + fetchedUser.last_name); // Set the editable fields
        setUserEmail(fetchedUser.email);
        setUserPhone(fetchedUser.phone);
        setUserAddress(fetchedUser.address);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await AxiosInstance.get("departments/");
        setAvailableDepartments(response.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
    fetchUser();
    fetchDepartments();
  }, [id]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const roleId = parseInt(event.target.value);
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  const onclose = () => {
    setOpen(false);
    navigate("/users"); // Navigate back to user list or previous page
  };

  const handleSubmitRoles = async () => {
    if (!user || selectedRoleIds.length === 0) {
      console.error("No roles selected or user data missing.");
      return;
    }

    try {
      const payload = {
        userId: Number(id),
        name: userName, // Updated name
        email: userEmail, // Updated email
        phone: phone,
        address: address,
        userType: selectedRoleIds.map(
          (id) => availableRoles.find((role) => role.id === id)?.name,
        ), // Extract role names based on selected IDs
      };

      await AxiosInstance.post(`assign-userType`, payload);
      navigate("/users");
    } catch (error) {
      console.error("Error assigning user roles:", error);
    }
  };

  return (
    <Modal open={open} onClose={onclose}>
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
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user's name"
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter user's email"
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Phone</FormLabel>
            <input
              type="phone"
              value={phone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Enter Phone"
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Address</FormLabel>
            <input
              type="address"
              value={address}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Enter Address"
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
                    />
                    <Typography>{role.name}</Typography>
                  </ListItem>
                ))}
              </List>
            </FormGroup>
          </FormControl>

          <Button
            fullWidth
            variant="solid"
            color="primary"
            onClick={handleSubmitRoles}
            sx={{ mt: 3 }}
          >
            Update User and Roles
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
function setUserPhone(phone: any) {
  throw new Error("Function not implemented.");
}
