import React, { useState, useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import {
  Modal,
  ModalDialog,
  Box,
  Typography,
  FormControl,
  FormLabel,
  Input,
  Button,
  Table,
  Sheet,
  Grid,
  IconButton,
} from "@mui/joy";
import { Add, Delete, Edit, DateRange } from "@mui/icons-material";
import {
  getAllOrganizations,
  updateOrganization,
  createOrganization,
  deleteOrganization,
} from "../Roles And Permissions/roles_api";
import { updateOrganisationCreationService } from "./organisation_creation_api";

export interface Organization {
  id: number;
  name: string;
  dateAdded: string; // ✅ When the organization was created
  expiryDate: string; // ✅ Expiration date
}

export default function OrganizationsScreen() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);
  const [newOrganizationName, setNewOrganizationName] = useState("");
  const [expiryDate, setExpiryDate] = useState(""); // Store new expiry date

  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch all organizations
  const fetchOrganizations = async () => {
    try {
      const data = await getAllOrganizations();
      setOrganizations(data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  // Open modal for adding/updating organization
  const handleOpenModal = (organization?: Organization) => {
    if (organization) {
      setSelectedOrganization(organization);
      setNewOrganizationName(organization.name);
      setExpiryDate(organization.expiryDate);
    } else {
      setSelectedOrganization(null);
      setNewOrganizationName("");
      setExpiryDate("");
    }
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrganization(null);
    setNewOrganizationName("");
    setExpiryDate("");
  };

  const handleSaveOrganization = async () => {
    try {
      if (selectedOrganization) {
        // Create an object that matches the expected type
        const updatedOrg = {
          name: newOrganizationName,
          dateAdded: selectedOrganization.dateAdded,
          expiryDate,
        };

        await updateOrganization(selectedOrganization.id, updatedOrg);
      } else {
        // Create an object that matches the expected type
        const newOrg = {
          name: newOrganizationName,
          dateAdded: new Date().toISOString(),
          expiryDate,
        };

        await createOrganization(newOrg);
      }
      fetchOrganizations();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving organization:", error);
    }
  };

  // Handle delete organization
  const handleDeleteOrganization = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this organization?")) {
      try {
        await deleteOrganization(id);
        fetchOrganizations();
      } catch (error) {
        console.error("Error deleting organization:", error);
      }
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: 4, maxWidth: "1000px", mx: "auto" }}>
        <Typography level="h2" sx={{ mb: 3, fontWeight: "bold" }}>
          Manage Organizations
        </Typography>

        {/* Add Organization Button */}
        <Button
          startDecorator={<Add />}
          onClick={() => handleOpenModal()}
          sx={{ mb: 2 }}
        >
          Add Organization
        </Button>

        {/* Organization Table */}
        <Sheet
          sx={{
            borderRadius: "md",
            overflow: "auto",
            p: 2,
            backgroundColor: "white",
          }}
        >
          <Table hoverRow>
            <thead>
              <tr>
                <th>ID</th>
                <th>Organization Name</th>
                <th>Date Added</th>
                <th>Expiry Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id}>
                  <td>{org.id}</td>
                  <td>{org.name}</td>
                  <td>{new Date(org.dateAdded).toLocaleDateString()}</td>
                  <td>{new Date(org.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <IconButton onClick={() => handleOpenModal(org)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteOrganization(org.id)}
                    >
                      <Delete />
                    </IconButton>
                    <IconButton onClick={() => handleOpenModal(org)}>
                      <DateRange /> {/* Extend expiry date */}
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>

        {/* Modal for Adding/Updating Organization */}
        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <ModalDialog>
            <Typography component="h2" sx={{ mb: 2 }}>
              {selectedOrganization ? "Edit Organization" : "Add Organization"}
            </Typography>
            <FormControl>
              <FormLabel>Organization Name</FormLabel>
              <Input
                value={newOrganizationName}
                onChange={(e) => setNewOrganizationName(e.target.value)}
                placeholder="Enter organization name"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Expiry Date</FormLabel>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </FormControl>
            <Button onClick={handleSaveOrganization} color="primary">
              {selectedOrganization ? "Update" : "Create"}
            </Button>
          </ModalDialog>
        </Modal>
      </Box>
    </CssVarsProvider>
  );
}
