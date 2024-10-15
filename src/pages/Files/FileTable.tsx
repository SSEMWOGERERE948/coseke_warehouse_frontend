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
import { UploadRounded } from "@mui/icons-material";

interface ResponsiblePerson {
  initial: string;
  name: string;
  email: string;
}
type FileData = {
  id: string;
  fileName: string;
  status: "Available" | "Unavailable";
  responsiblePerson: {
    initial: string;
    name: string;
    email: string;
  };
  dateModified: string;
  dateUploaded: string;
  statusColor: "success" | "error" | "warning";
  folder?: string;
  caseStudy?: string;
  boxNumber?: string;
  PIDInfant?: string;
  PIDMother?: string;
};

interface Row {
  id: string;
  fileName: string;
  responsiblePerson: ResponsiblePerson;
  status: "Available" | "Unavailable" | "Checked Out"; // Updated statuses
  dateModified: string;
  dateUploaded: string;
  statusColor: "success" | "error" | "warning"; // Color types
}

const initialRows: FileData[] = [
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
    status: "Available", // Updated status
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
    status: "Unavailable", // Updated status
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
    status: "Available", // Updated status
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
        <MenuItem>Checkout</MenuItem>
        <MenuItem>Check-in</MenuItem>
        {/* <MenuItem>Move</MenuItem>
        <Divider />
        <MenuItem color="danger">Delete</MenuItem> */}
      </Menu>
    </Dropdown>
  );
}
/*export default function FileTable(): JSX.Element {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [files, setFiles] = React.useState<FileData[]>(initialRows);
  const [newFile, setNewFile] = React.useState<Partial<FileData>>({
    fileName:'',
    status:'Available',
    responsiblePerson:{
      initial: '',
      name:'',
      email:'',

    },
    folder:'',
    caseStudy:'',
    boxNumber:'',
    PIDInfant:'',
    PIDMother:'',
  });


  /*const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name === 'status') {
      setNewFile(prev => ({ ...prev, status: value as FileData['status'] }));
    } else if (name?.startsWith('responsiblePerson.')) {
      const field = name.split('.')[1];
      setNewFile(prev => ({
        ...prev,
        responsiblePerson: { 
          ...prev.responsiblePerson, [field]: value as string | undefined }
      }));
    } else {
      setNewFile(prev => ({ ...prev, [name as string]: value }));
    }
  };


  // Handle input change dynamically for input fields and select elements
  // Handle input change dynamically for input fields and select elements
const handleInputChange = (event: any, value?: string | null) => {
  const { name } = event.target; // Extract name from the event
  const selectedValue = value ?? event.target.value; // Handle both select and input values


  // Handle input change dynamically for input fields and select elements
const handleInputChange = (event: any, value?: string | null) => {
  const { name } = event.target; // Extract name from the event
  const selectedValue = value ?? event.target.value; // Handle both select and input values

  // Handle input change dynamically for input fields and select elements

  const onClose = () => {
    // :TODO
  }
const handleInputChange = (event: any, value?: string | null) => {
  const { name } = event.target; // Extract name from the event
  const selectedValue = value ?? event.target.value; // Handle both select and input values

  setNewFile((prev) => {
    // Clone previous state with a partial update
    const updatedFile: Partial<FileData> = { ...prev };

    if (name === "status") {
      updatedFile.status = selectedValue as FileData["status"];
    } else if (name?.startsWith("responsiblePerson.")) {
      const field = name.split(".")[1]; // Extract the nested field for responsible person
      // Ensure responsiblePerson is initialized before accessing its fields
      name.responsiblePerson = {
        ...prev.responsiblePerson,
        [field]: selectedValue as string | undefined,
      };
    } else {
      updatedFile[name as keyof Partial<FileData>] = selectedValue;
    }

    return updatedFile; // Ensure the returned object is a Partial<FileData>
  });
};


  
  const handleFileCreate = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const newFileData: FileData = {
      id: (files.length + 1).toString(),
      fileName: newFile.fileName || '',
      status: newFile.status || 'Available',
      responsiblePerson: {
        initial: newFile.responsiblePerson?.name?.[0] || '',
        name: newFile.responsiblePerson?.name || '',
        email: newFile.responsiblePerson?.email || '',
      },
      dateModified: currentDate,
      dateUploaded: currentDate,
      statusColor: newFile.status === 'Available' ? 'success' : newFile.status === 'Unavailable' ? 'error' : 'warning',
      folder: newFile.folder,
      caseStudy: newFile.caseStudy,
      boxNumber: newFile.boxNumber,
      PIDInfant: newFile.PIDInfant,
      PIDMother: newFile.PIDMother,
    };
    setFiles(prevFiles => [...prevFiles, newFileData]);
    setOpen(false);
    setNewFile({
      fileName: '',
      status: 'Available',
      responsiblePerson: {
        initial: '',
        name: '',
        email: '',
      },
      folder: '',
      caseStudy: '',
      boxNumber: '',
      PIDInfant: '',
      PIDMother: '',
    });
  };
  
  // Handle search input change
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // Filter files based on search term
  const filteredFiles = initialRows.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /*function handleSubmit(event: MouseEvent <HTMLAnchorElement, MouseEvent>): void {
    throw new Error("Function not implemented.");
  }


    function handleSubmit(event: any): void {
      const anchorElement = event.currentTarget as HTMLAnchorElement; // if you need to specify the target element
      throw new Error("Function not implemented.");
    }*/

export default function FileTable(): JSX.Element {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [files, setFiles] = React.useState<FileData[]>(initialRows);
  const [newFile, setNewFile] = React.useState<Partial<FileData>>({
    fileName: "",
    status: "Available",
    responsiblePerson: {
      initial: "",
      name: "",
      email: "",
    },
    folder: "",
    caseStudy: "",
    boxNumber: "",
    PIDInfant: "",
    PIDMother: "",
  });

  const handleInputChange = (event: any, value?: string | null) => {
    const { name } = event.target;
    const selectedValue = value ?? event.target.value;

    setNewFile((prev) => {
      const updatedFile: Partial<FileData> = { ...prev };

      if (name === "status") {
        updatedFile.status = selectedValue as FileData["status"];
      } else if (name?.startsWith("responsiblePerson.")) {
        const field = name.split(".")[1];
        field.responsiblePerson = {
          ...prev.responsiblePerson,
          [field]: (selectedValue as string) || "",
        };
      } else {
        updatedFile[name as keyof Partial<FileData>] = selectedValue;
      }

      return updatedFile;
    });
  };

  const handleFileCreate = () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const newFileData: FileData = {
      id: (files.length + 1).toString(),
      fileName: newFile.fileName || "",
      status: newFile.status || "Available",
      responsiblePerson: {
        initial: newFile.responsiblePerson?.name?.[0] || "",
        name: newFile.responsiblePerson?.name || "",
        email: newFile.responsiblePerson?.email || "",
      },
      dateModified: currentDate,
      dateUploaded: currentDate,
      statusColor:
        newFile.status === "Available"
          ? "success"
          : newFile.status === "Unavailable"
            ? "error"
            : "warning",
      folder: newFile.folder,
      caseStudy: newFile.caseStudy,
      boxNumber: newFile.boxNumber,
      PIDInfant: newFile.PIDInfant,
      PIDMother: newFile.PIDMother,
    };
    setFiles((prevFiles) => [...prevFiles, newFileData]);
    setOpen(false);
    setNewFile({
      fileName: "",
      status: "Available",
      responsiblePerson: {
        initial: "",
        name: "",
        email: "",
      },
      folder: "",
      caseStudy: "",
      boxNumber: "",
      PIDInfant: "",
      PIDMother: "",
    });
  };

  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  const filteredFiles = files.filter((file) =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const onClose = () => {
    // :TODO
  };
  function handleSubmit(event: any): void {
    const anchorElement = event.currentTarget as HTMLAnchorElement; // if you need to specify the target element
    throw new Error("Function not implemented.");
  }

  return (
    <div>
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
                  style={{
                    width: 48,
                    textAlign: "center",
                    padding: "12px 6px",
                  }}
                >
                  <Checkbox
                    size="sm"
                    indeterminate={
                      selected.length > 0 &&
                      selected.length !== initialRows.length
                    }
                    checked={selected.length === initialRows.length}
                    onChange={(event) => {
                      setSelected(
                        event.target.checked
                          ? initialRows.map((row) => row.fileName)
                          : [],
                      );
                    }}
                    color={
                      selected.length > 0 ||
                      selected.length === initialRows.length
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
                            order === "desc"
                              ? "rotate(0deg)"
                              : "rotate(180deg)",
                        },
                      },
                      order === "desc"
                        ? { "& svg": { transform: "rotate(0deg)" } }
                        : { "& svg": { transform: "rotate(180deg)" } },
                    ]}
                  >
                    File PID
                  </Link>
                </th>
                <th style={{ width: 240, padding: "12px 6px" }}>
                  Responsible Person
                </th>
                <th style={{ width: 140, padding: "12px 6px" }}>Status</th>
                <th style={{ width: 140, padding: "12px 6px" }}>
                  Date Modified
                </th>
                <th style={{ width: 140, padding: "12px 6px" }}>
                  Date Uploaded
                </th>
                <th style={{ width: 140, padding: "12px 6px" }}></th>
              </tr>
            </thead>
            <tbody>
              {[...filteredFiles]
                .sort(getComparator(order, "id"))
                .map((row) => (
                  <tr key={row.id}>
                    <td style={{ textAlign: "center", width: 120 }}>
                      <Checkbox
                        size="sm"
                        checked={selected.includes(row.id)}
                        color={
                          selected.includes(row.id) ? "primary" : undefined
                        }
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
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <Avatar size="sm">
                          {row.responsiblePerson.initial}
                        </Avatar>
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
                      <Typography level="body-xs">
                        {row.dateUploaded}
                      </Typography>
                    </td>
                    <td>
                      <Typography level="body-xs">
                        {row.dateModified}
                      </Typography>
                    </td>

                    <td>
                      <Box
                        sx={{ display: "flex", gap: 2, alignItems: "center" }}
                      >
                        <RowMenu />
                      </Box>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Sheet>

        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog
            sx={{
              maxWidth: "80vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <ModalClose
              variant="outlined"
              sx={{
                top: "calc(-1/4 * var(--IconButton-size))",
                right: "calc(-1/4 * var(--IconButton-size))",
                boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
                borderRadius: "50%",
                bgcolor: "background.body",
              }}
            />
            <Typography
              component="h2"
              level="h4"
              textColor="inherit"
              fontWeight="lg"
              mb={1}
            >
              Create New File
            </Typography>
            <form
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleFileCreate();
              }}
            >
              <FormControl sx={{ mb: 1.5 }}>
                <FormLabel>File Name</FormLabel>
                <Input
                  autoFocus
                  name="fileName"
                  value={newFile.fileName}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl sx={{ mb: 1.5 }}>
                <FormLabel>Status</FormLabel>
                <Select
                  name="status"
                  value={newFile.status}
                  onChange={handleInputChange}
                >
                  <Option value="Available">Available</Option>
                  <Option value="Unavailable">Unavailable</Option>
                  <Option value="Checked Out">Checked Out</Option>
                </Select>
              </FormControl>
              <FormControl sx={{ mb: 1.5 }}>
                <FormLabel>Responsible Person Name</FormLabel>
                <Input
                  name="responsiblePerson.name"
                  value={newFile.responsiblePerson?.name}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl sx={{ mb: 1.5 }}>
                <FormLabel>Responsible Person Email</FormLabel>
                <Input
                  name="responsiblePerson.email"
                  value={newFile.responsiblePerson?.email}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl sx={{ mb: 1.5 }}>
                <FormLabel>Folder</FormLabel>
                <Input
                  name="folder"
                  value={newFile.folder}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl sx={{ mb: 1.5 }}>
                <FormLabel>Case Study</FormLabel>
                <Input
                  name="caseStudy"
                  value={newFile.caseStudy}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Box Number</FormLabel>
                <Input
                  name="boxNumber"
                  type="number"
                  value={newFile.boxNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>PID Infant</FormLabel>
                <Input
                  name="PIDInfant"
                  value={newFile.PIDInfant}
                  onChange={handleInputChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>PID Mother</FormLabel>
                <Input
                  name="PIDMother"
                  value={newFile.PIDMother}
                  onChange={handleInputChange}
                />
              </FormControl>
            </form>
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
              }}
            >
              <Button onClick={onClose} variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button onClick={handleSubmit} startDecorator={<UploadRounded />}>
                Create File
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </React.Fragment>
    </div>
  );
}
