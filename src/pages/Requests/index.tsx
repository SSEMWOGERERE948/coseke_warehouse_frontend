import { useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import Input from "@mui/joy/Input";
import FormLabel from "@mui/joy/FormLabel";
import { UploadRounded } from "@mui/icons-material";
import RequestTable from "./RequestTable";

function Index() {
  const [open, setOpen] = useState(false); // Modal state

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: { xs: 2, md: 6 },
        pt: {
          xs: "calc(12px + var(--Header-height))",
          sm: "calc(12px + var(--Header-height))",
          md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        height: "100dvh",
        gap: 1,
      }}
    >
      <RequestTable />

      {/* Modal for Adding Request */}
      <Modal open={open} onClose={handleClose}>
        <ModalDialog
          aria-labelledby="add-request-modal-title"
          aria-describedby="add-request-modal-description"
          sx={{ maxWidth: 500 }}
        >
          <Typography id="add-request-modal-title" level="h2">
            Add New Request
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              handleClose(); // Close the modal after form submission
            }}
          >
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Filepid</FormLabel>
              <Input
                placeholder="Enter filepid"
                required
                type="text"
                autoFocus
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Responsible Person</FormLabel>
              <Input
                placeholder="Enter your name"
                required
                type="text"
                autoFocus
              />
            </FormControl>
            <FormControl sx={{ mt: 2 }}>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Enter your email"
                required
                type="text"
                autoFocus
              />
            </FormControl>
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button variant="plain" color="neutral" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Submit
              </Button>
            </Box>
          </form>
        </ModalDialog>
      </Modal>
    </Box>
  );
}

export default Index;
