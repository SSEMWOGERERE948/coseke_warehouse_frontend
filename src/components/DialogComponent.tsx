import { ModalClose, ModalDialog } from "@mui/joy";
import { Modal } from "@mui/material";

function DialogComponent({
  setOpen,
  open,
  children,
}: {
  setOpen: any;
  open: boolean;
  children: any;
}) {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        aria-labelledby="case-study-modal-title"
        aria-describedby="case-study-modal-description"
        sx={{
          maxWidth: "600px",
          maxHeight: "80vh",
          overflowY: "auto",
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose />
        {children}
      </ModalDialog>
    </Modal>
  );
}

export default DialogComponent;
