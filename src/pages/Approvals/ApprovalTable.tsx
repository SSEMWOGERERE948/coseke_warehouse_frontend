/* eslint-disable jsx-a11y/anchor-is-valid */
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import DialogActions from "@mui/joy/DialogActions";
import DialogContent from "@mui/joy/DialogContent";
import DialogTitle from "@mui/joy/DialogTitle";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";
import IconButton from "@mui/joy/IconButton";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import BlockIcon from "@mui/icons-material/Block";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import * as React from "react";

interface RowMenuProps {
  onApprove: () => void;
  fileName: string;
  responsiblePerson: ResponsiblePerson;
}

const RowMenu: React.FC<RowMenuProps> = ({ onApprove }) => {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={onApprove}>Approve</MenuItem>
        <Divider />
        <MenuItem color="danger">Reject</MenuItem>
      </Menu>
    </Dropdown>
  );
};

interface ResponsiblePerson {
  initial: string;
  name: string;
  email: string;
}

interface Row {
  id: string;
  fileName: string;
  responsiblePerson: ResponsiblePerson;
  status: "Available" | "Unavailable" | "Checked Out";
  dateModified: string;
  dateUploaded: string;
  statusColor: "success" | "danger" | "warning";
}

const rows: Row[] = [
  {
    id: "2",
    fileName: "Budget Report.xlsx",
    responsiblePerson: {
      initial: "S",
      name: "Steve Hampton",
      email: "steve.hampton@email.com",
    },
    status: "Unavailable",
    dateModified: "2024-09-20",
    dateUploaded: "2024-09-10",
    statusColor: "danger",
  },
];

export default function ApprovalTable() {
  const [order, setOrder] = React.useState<"asc" | "desc">("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<Row | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleApprovalClick = (file: Row) => {
    setSelectedFile(file);
    setOpenModal(true);
  };

  const handleApprove = () => {
    // Handle approval logic here
    setOpenModal(false);
    setSelectedFile(null);
  };

  const handleReject = () => {
    // Handle rejection logic here
    setOpenModal(false);
    setSelectedFile(null);
  };

  const filteredFiles = rows.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <React.Fragment>
      <Sheet
        className="TableContainer"
        variant="outlined"
        sx={{
          width: "100%",
          borderRadius: "md",
          flex: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground": (theme) =>
              theme.vars.palette.background.level1,
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground": (theme) =>
              theme.vars.palette.background.level1,
          }}
        >
          <thead>
            <tr>
              <th style={{ width: "40px", textAlign: "center" }}>
                <Checkbox
                  checked={selected.length === rows.length}
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  onChange={(event) =>
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    )
                  }
                  color={selected.length > 0 ? "primary" : "neutral"}
                  slotProps={{ checkbox: { sx: { mx: "auto" } } }}
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: "40%" }}>File Name</th>
              <th style={{ width: "20%" }}>Responsible Person</th>
              <th style={{ textAlign: "right" }}>Status</th>
              <th style={{ textAlign: "right" }}>Date Modified</th>
              <th style={{ width: "48px" }} />
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: "center" }}>
                  <Checkbox
                    checked={selected.includes(row.id)}
                    onChange={(event) =>
                      setSelected((ids) =>
                        event.target.checked
                          ? [...ids, row.id]
                          : ids.filter((id) => id !== row.id),
                      )
                    }
                    slotProps={{ checkbox: { sx: { mx: "auto" } } }}
                    color={selected.includes(row.id) ? "primary" : "neutral"}
                  />
                </td>
                <td>
                  <Typography fontWeight="lg" textColor="text.primary" mb={0.5}>
                    {row.fileName}
                  </Typography>
                  <Typography level="body-sm">
                    Uploaded on: {row.dateUploaded}
                  </Typography>
                </td>
                <td>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar size="sm">{row.responsiblePerson.initial}</Avatar>
                    <div>
                      <Typography fontWeight="lg" level="body-sm">
                        {row.responsiblePerson.name}
                      </Typography>
                      <Typography level="body-xs">
                        {row.responsiblePerson.email}
                      </Typography>
                    </div>
                  </Box>
                </td>
                <td align="right">
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      row.status === "Available" ? (
                        <CheckRoundedIcon />
                      ) : row.status === "Checked Out" ? (
                        <AutorenewRoundedIcon />
                      ) : (
                        <BlockIcon />
                      )
                    }
                    color={row.statusColor}
                  >
                    {row.status}
                  </Chip>
                </td>
                <td align="right">{row.dateModified}</td>
                <td>
                  <RowMenu
                    onApprove={() => handleApprovalClick(row)}
                    fileName={row.fileName}
                    responsiblePerson={row.responsiblePerson}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <ModalDialog>
          <ModalClose />
          <DialogTitle>File Approval Request</DialogTitle>
          <DialogContent>
            {selectedFile && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography level="body-md">
                  <strong>File Name:</strong> {selectedFile.fileName}
                </Typography>
                <Typography level="body-md">
                  <strong>Requesting Approval From:</strong>{" "}
                  {selectedFile.responsiblePerson.name}
                </Typography>
                <Typography level="body-md">
                  <strong>Request Time:</strong> {new Date().toLocaleString()}
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" onClick={handleReject}>
              Reject
            </Button>
            <Button variant="solid" color="primary" onClick={handleApprove}>
              Approve
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
