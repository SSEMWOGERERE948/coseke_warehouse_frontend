import React, { useState, useEffect } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Switch from "@mui/joy/Switch";
import Checkbox from "@mui/joy/Checkbox";
import Sheet from "@mui/joy/Sheet";
import Grid from "@mui/joy/Grid";
import Button from "@mui/joy/Button"; // Button import
import Modal from "@mui/joy/Modal"; // Modal for form input
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import { AxiosInstance } from "../../core/baseURL"; // Your Axios instance

interface Permission {
  name: string; // Permission name
  checked: boolean; // Indicates if the permission is granted
}

interface CaseStudy {
  id: number; // Adjust type to match your API response
  name: string;
  enabled: boolean;
  permissions: Permission[]; // Permissions as an array of objects
}

export default function CaseStudiesScreen() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [isModalOpen, setModalOpen] = useState(false); // State for modal visibility
  const [newCaseStudy, setNewCaseStudy] = useState({
    name: "",
    description: "",
    role: 1, // Default role
  });

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await AxiosInstance.get("case-studies/");
        const fetchedCaseStudies = response.data.map((study: any) => ({
          id: study.id,
          name: study.name,
          enabled: true, // Assuming you want to start enabled
          permissions: study.permissions.map((perm: string) => ({
            name: perm,
            checked: false, // Default to false
          })),
        }));

        setCaseStudies(fetchedCaseStudies);
      } catch (error: any) {
        if (error.response) {
          console.error("Error fetching case studies:", error.response.data);
        } else {
          console.error("Error message:", error.message);
        }
      }
    };

    fetchCaseStudies();
  }, []);

  const handleToggleCaseStudy = (studyId: number) => {
    setCaseStudies((prevStudies) =>
      prevStudies.map((study) =>
        study.id === studyId
          ? {
              ...study,
              enabled: !study.enabled,
              permissions: study.permissions.map((perm) => ({
                ...perm,
                checked: !study.enabled ? perm.checked : true, // Check all permissions when enabling the study
              })),
            }
          : study,
      ),
    );
  };

  const handlePermissionToggle = (studyId: number, permName: string) => {
    setCaseStudies((prevStudies) =>
      prevStudies.map((study) =>
        study.id === studyId
          ? {
              ...study,
              permissions: study.permissions.map((perm) =>
                perm.name === permName
                  ? { ...perm, checked: !perm.checked }
                  : perm,
              ),
            }
          : study,
      ),
    );
  };

  // Function to handle input changes in the modal
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCaseStudy({
      ...newCaseStudy,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle case study creation
  const submitNewCaseStudy = async () => {
    try {
      const response = await AxiosInstance.post(
        "case-studies/create-cases",
        newCaseStudy,
      );
      const createdCaseStudy = response.data;

      setCaseStudies((prevStudies) => [
        ...prevStudies,
        {
          id: createdCaseStudy.id,
          name: createdCaseStudy.name,
          enabled: true,
          permissions: [], // Assuming no permissions initially
        },
      ]);

      setModalOpen(false); // Close modal after successful creation
    } catch (error: any) {
      console.error("Error creating case study:", error);
    }
  };

  return (
    <CssVarsProvider>
      <CssBaseline />
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", mx: "auto" }}>
        <Typography level="h1" fontSize="xl" mb={4}>
          Case Studies
        </Typography>

        {/* Button to open the modal */}
        <Button
          onClick={() => setModalOpen(true)}
          sx={{ mb: 4 }}
          color="primary"
          variant="solid"
        >
          Create Case Study
        </Button>

        {/* Modal for creating a new case study */}
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
              width: "300px", // Smaller width for the modal
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
                size="sm" // Smaller input field
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Description</FormLabel>
              <Input
                name="description"
                value={newCaseStudy.description}
                onChange={handleInputChange}
                placeholder="Enter description"
                size="sm" // Smaller input field
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Role</FormLabel>
              <Input
                name="role"
                type="number"
                value={newCaseStudy.role}
                onChange={handleInputChange}
                placeholder="Enter role number"
                size="sm" // Smaller input field
              />
            </FormControl>
            <Button
              sx={{ mt: 3, width: "100%" }} // Full-width submit button
              onClick={submitNewCaseStudy}
              color="success"
              variant="solid"
            >
              Submit
            </Button>
          </Box>
        </Modal>

        {/* Existing case studies grid */}
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    ml: 3,
                  }}
                >
                  {study.permissions.map((perm) => (
                    <Checkbox
                      key={perm.name}
                      label={perm.name}
                      checked={perm.checked}
                      onChange={() =>
                        handlePermissionToggle(study.id, perm.name)
                      }
                      disabled={!study.enabled}
                      slotProps={{
                        input: {
                          "aria-label": `${perm.name} permission for ${study.name} case study`,
                        },
                      }}
                    />
                  ))}
                </Box>
              </Sheet>
            </Grid>
          ))}
        </Grid>
      </Box>
    </CssVarsProvider>
  );
}
