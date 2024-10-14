import React, { useEffect, useState } from "react";
import {
  Button,
  Radio,
  Typography,
  Box,
  List,
  ListItem,
  FormControl,
  FormLabel,
  RadioGroup,
} from "@mui/joy";
import { AxiosInstance } from "../../core/baseURL";
import { useParams, useNavigate } from "react-router-dom";
import { FormControlLabel } from "@mui/material";

// Interface for Role
interface Role {
  id: number;
  name: string;
}

export default function UserRoles() {
  const { id } = useParams<{ id: string }>(); // Get id from route params
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null); // Single selected role ID
  const [selectedRoleName, setSelectedRoleName] = useState<string | null>(null); // Single selected role name
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]); // Available roles typed with Role interface
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available roles from the server
    const fetchRoles = async () => {
      try {
        const response = await AxiosInstance.get("/roles/all");
        const roles: Role[] = response.data; // Explicitly typing the response data as an array of Role
        setAvailableRoles(roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedRoleId = parseInt(event.target.value);
    setSelectedRoleId(selectedRoleId); // Set the selected role ID
    const selectedRole = availableRoles.find(
      (role) => role.id === selectedRoleId,
    );
    if (selectedRole) {
      setSelectedRoleName(selectedRole.name); // Set the selected role's name
    }
  };

  const handleSubmitRoles = async () => {
    if (!selectedRoleName) {
      console.error("No role selected.");
      return;
    }

    try {
      const userId = Number(id); // Convert id from string to number

      const payload = {
        userId, // Use the numeric userId
        userType: selectedRoleName, // Pass the selected role name instead of the id
      };

      // Send the selected role name to the server for assignment
      await AxiosInstance.post(`assign-userType`, payload);
      navigate("/users"); // Navigate back to users list or any other page
    } catch (error) {
      console.error("Error assigning user role:", error);
    }
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "auto", p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>
        Assign Role to User
      </Typography>

      <FormControl component="fieldset">
        <FormLabel component="legend">Select a Role</FormLabel>
        <RadioGroup
          aria-label="roles"
          name="userRoles"
          value={selectedRoleId ? selectedRoleId.toString() : ""}
          onChange={handleRoleChange} // Handle change using the role id
        >
          <List>
            {availableRoles.map((role) => (
              <ListItem key={role.id}>
                <FormControlLabel
                  value={role.id.toString()} // Radio button value is the role's id
                  control={<Radio />}
                  label={role.name} // Display the role's name
                />
              </ListItem>
            ))}
          </List>
        </RadioGroup>
      </FormControl>

      <Button
        fullWidth
        variant="solid"
        color="primary"
        onClick={handleSubmitRoles}
        sx={{ mt: 3 }}
      >
        Update Role
      </Button>
    </Box>
  );
}
