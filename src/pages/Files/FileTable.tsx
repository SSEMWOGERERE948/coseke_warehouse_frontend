/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from "react";
import { ColorPaletteProp } from "@mui/joy/styles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Link from "@mui/joy/Link";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton, { iconButtonClasses } from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Dropdown from "@mui/joy/Dropdown";

import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import BlockIcon from "@mui/icons-material/Block";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

interface ResponsiblePerson {
  initial: string;
  name: string;
  email: string;
}

interface Row {
  id: string;
  fileName: string;
  responsiblePerson: ResponsiblePerson;
  status: "Available" | "Unavailable" | "Checked Out"; // Updated statuses
  dateModified: string;
  dateUploaded: string;
  statusColor: "success" | "error" | "warning"; // Color types
}

const rows: Row[] = [
  {
    id: "1",
    fileName: "Project Proposal.docx",
    responsiblePerson: {
      initial: "O",
      name: "Olivia Rhye",
      email: "olivia.rhye@email.com",
    },
    status: "Available", // Updated status
    dateModified: "2024-09-25",
    dateUploaded: "2024-09-15",
    statusColor: "success", // Color for Available
  },
  {
    id: "2",
    fileName: "Budget Report.xlsx",
    responsiblePerson: {
      initial: "S",
      name: "Steve Hampton",
      email: "steve.hampton@email.com",
    },
    status: "Unavailable", // Updated status
    dateModified: "2024-09-20",
    dateUploaded: "2024-09-10",
    statusColor: "error", // Color for Unavailable
  },
  {
    id: "3",
    fileName: "Meeting Notes.txt",
    responsiblePerson: {
      initial: "C",
      name: "Ciaran Murray",
      email: "ciaran.murray@email.com",
    },
    status: "Checked Out", // Updated status
    dateModified: "2024-09-23",
    dateUploaded: "2024-09-12",
    statusColor: "warning", // Color for Checked Out
  },
  {
    id: "4",
    fileName: "Design Mockups.zip",
    responsiblePerson: {
      initial: "M",
      name: "Marina Macdonald",
      email: "marina.macdonald@email.com",
    },
    status: "Available", // Updated status
    dateModified: "2024-09-26",
    dateUploaded: "2024-09-14",
    statusColor: "success", // Color for Available
  },
  {
    id: "5",
    fileName: "Final Presentation.pptx",
    responsiblePerson: {
      initial: "C",
      name: "Charles Fulton",
      email: "charles.fulton@email.com",
    },
    status: "Unavailable", // Updated status
    dateModified: "2024-09-30",
    dateUploaded: "2024-09-01",
    statusColor: "error", // Color for Unavailable
  },
  {
    id: "6",
    fileName: "Sales Data.csv",
    responsiblePerson: {
      initial: "J",
      name: "Jay Hoper",
      email: "jay.hoper@email.com",
    },
    status: "Available", // Updated status
    dateModified: "2024-09-28",
    dateUploaded: "2024-09-05",
    statusColor: "success", // Color for Available
  },
  {
    id: "7",
    fileName: "User Feedback.pdf",
    responsiblePerson: {
      initial: "O",
      name: "Olivia Rhye",
      email: "olivia.rhye@email.com",
    },
    status: "Checked Out", // Updated status
    dateModified: "2024-09-29",
    dateUploaded: "2024-09-08",
    statusColor: "warning", // Color for Checked Out
  },
  {
    id: "8",
    fileName: "Market Research.docx",
    responsiblePerson: {
      initial: "S",
      name: "Steve Hampton",
      email: "steve.hampton@email.com",
    },
    status: "Unavailable", // Updated status
    dateModified: "2024-09-27",
    dateUploaded: "2024-09-03",
    statusColor: "error", // Color for Unavailable
  },
  {
    id: "9",
    fileName: "Client Feedback.txt",
    responsiblePerson: {
      initial: "C",
      name: "Ciaran Murray",
      email: "ciaran.murray@email.com",
    },
    status: "Available", // Updated status
    dateModified: "2024-09-24",
    dateUploaded: "2024-09-02",
    statusColor: "success", // Color for Available
  },
  {
    id: "10",
    fileName: "Product Roadmap.pptx",
    responsiblePerson: {
      initial: "M",
      name: "Marina Macdonald",
      email: "marina.macdonald@email.com",
    },
    status: "Checked Out", // Updated status
    dateModified: "2024-09-21",
    dateUploaded: "2024-08-28",
    statusColor: "warning", // Color for Checked Out
  },
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem>
      </Menu>
    </Dropdown>
  );
}
export default function FileTable() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  // Handle search input change
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // Filter files based on search term
  const filteredFiles = rows.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <React.Fragment>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: "flex", sm: "none" }, my: 1, gap: 1 }}
      >
        <Input
          size="sm"
          placeholder="Search"
          startDecorator={<SearchIcon />}
          sx={{ flexGrow: 1 }}
        />
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search for file</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            value={searchTerm}
            onChange={handleSearchChange} // Update the search term
          />
        </FormControl>
      </Box>
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: "none", sm: "initial" },
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflow: "auto",
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            "--TableCell-headBackground":
              "var(--joy-palette-background-level1)",
            "--Table-headerUnderlineThickness": "1px",
            "--TableRow-hoverBackground":
              "var(--joy-palette-background-level1)",
            "--TableCell-paddingY": "4px",
            "--TableCell-paddingX": "8px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{ width: 48, textAlign: "center", padding: "12px 6px" }}
              >
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? "primary"
                      : undefined
                  }
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </th>
              <th style={{ width: 120, padding: "12px 6px" }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={[
                    {
                      fontWeight: "lg",
                      "& svg": {
                        transition: "0.2s",
                        transform:
                          order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                      },
                    },
                    order === "desc"
                      ? { "& svg": { transform: "rotate(0deg)" } }
                      : { "& svg": { transform: "rotate(180deg)" } },
                  ]}
                >
                  File Name
                </Link>
              </th>
              <th style={{ width: 240, padding: "12px 6px" }}>
                Responsible Person
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Date Modified</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Date Uploaded</th>
              <th style={{ width: 140, padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {[...filteredFiles].sort(getComparator(order, "id")).map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: "center", width: 120 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.includes(row.id)}
                    color={selected.includes(row.id) ? "primary" : undefined}
                    onChange={(event) => {
                      setSelected((ids) =>
                        event.target.checked
                          ? ids.concat(row.id)
                          : ids.filter((itemId) => itemId !== row.id),
                      );
                    }}
                    slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                    sx={{ verticalAlign: "text-bottom" }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.fileName}</Typography>
                </td>
                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Avatar size="sm">{row.responsiblePerson.initial}</Avatar>
                    <div>
                      <Typography level="body-xs">
                        {row.responsiblePerson.name}
                      </Typography>
                      <Typography level="body-xs">
                        {row.responsiblePerson.email}
                      </Typography>
                    </div>
                  </Box>
                </td>

                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Available: <CheckRoundedIcon />,
                        "Checked Out": <AutorenewRoundedIcon />,
                        Unavailable: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Available: "success",
                        "Checked Out": "neutral",
                        Unavailable: "danger",
                      }[row.status] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Typography level="body-xs">{row.dateUploaded}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.dateModified}</Typography>
                </td>

                <td>
                  <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Link level="body-xs" component="button">
                      Download
                    </Link>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
    </React.Fragment>
  );
}
