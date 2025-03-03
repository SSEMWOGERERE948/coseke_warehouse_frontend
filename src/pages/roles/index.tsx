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
  Select,
  Option,
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { useParams, useNavigate } from "react-router-dom";
import { FormGroup } from "@mui/material";

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
  name: string;
  email: string;
}

export default function UserRoles() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State variables
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availableOrganizations, setAvailableOrganizations] = useState<
    Organization[]
  >([]);
  const [selectedOrganization, setSelectedOrganization] = useState<
    number | null
  >(null);
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [phone, setUserPhone] = useState<string>("");
  const [address, setUserAddress] = useState<string>("");
  const [open, setOpen] = useState(true);

  // Fetch data on component mount
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
        setUserName(`${fetchedUser.first_name} ${fetchedUser.last_name}`);
        setUserEmail(fetchedUser.email);
        setUserPhone(fetchedUser.phone);
        setUserAddress(fetchedUser.address);
        setSelectedOrganization(fetchedUser.organization?.id || null);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchOrganizations = async () => {
      try {
        const response = await AxiosInstance.get("/organizations/all");
        setAvailableOrganizations(response.data);
      } catch (error) {
        console.error("Error fetching organizations:", error);
      }
    };

    fetchRoles();
    fetchUser();
    fetchOrganizations();
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
    navigate("/users");
  };

  const handleSubmitRoles = async () => {
    if (!user || selectedRoleIds.length === 0 || !selectedOrganization) {
      console.error("Missing required fields.");
      return;
    }

    try {
      const payload = {
        userId: Number(id),
        name: userName,
        email: userEmail,
        phone: phone,
        address: address,
        organizationId: selectedOrganization,
        userType: selectedRoleIds.map(
          (id) => availableRoles.find((role) => role.id === id)?.name,
        ),
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

          {/* User Details */}
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
            <Input
              type="phone"
              value={phone}
              onChange={(e) => setUserPhone(e.target.value)}
              placeholder="Enter Phone"
            />
          </FormControl>
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Address</FormLabel>
            <Input
              type="text"
              value={address}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder="Enter Address"
            />
          </FormControl>

          {/* Organization Selection */}
          <FormControl sx={{ mt: 2 }}>
            <FormLabel>Organization</FormLabel>
            <Select
              placeholder={
                availableOrganizations.length > 0
                  ? "Select an organization"
                  : "Loading organizations..."
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
              disabled={availableOrganizations.length === 0}
            >
              {availableOrganizations.length > 0 ? (
                availableOrganizations.map((org) => (
                  <Option key={org.id} value={org.id.toString()}>
                    {org.name}
                  </Option>
                ))
              ) : (
                <Option key="no-orgs" value="" disabled>
                  No organizations available
                </Option>
              )}
            </Select>
          </FormControl>

          {/* Roles Selection */}
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

          {/* Submit Button */}
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
