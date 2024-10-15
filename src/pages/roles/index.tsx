import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Box,
  List,
  ListItem,
  FormControl,
  FormLabel,
  Checkbox,
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { useParams, useNavigate } from "react-router-dom";
import { FormGroup } from "@mui/material";

interface Role {
  id: number;
  name: string;
}

export default function UserRoles() {
  const { id } = useParams<{ id: string }>();
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await AxiosInstance.get("/roles/all");
        const roles: Role[] = response.data;
        setAvailableRoles(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const roleId = parseInt(event.target.value);
    if (selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds(selectedRoleIds.filter((id) => id !== roleId));
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  const handleSubmitRoles = async () => {
    if (selectedRoleIds.length === 0) {
      console.error("No roles selected.");
      return;
    }

    try {
      const userId = Number(id);

      const payload = {
        userId,
        userType: selectedRoleIds.map(
          (id) => availableRoles.find((role) => role.id === id)?.name,
        ), // Extract names based on selected IDs
      };

      await AxiosInstance.post(`assign-userType`, payload);
      navigate("/users");
    } catch (error) {
      console.error("Error assigning user roles:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Assign Role to User
      </Typography>

      <FormControl component="fieldset">
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
        Update Roles
      </Button>
    </Box>
  );
}
