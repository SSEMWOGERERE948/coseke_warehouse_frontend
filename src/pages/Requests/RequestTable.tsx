/* eslint-disable jsx-a11y/anchor-is-valid */
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import Divider from "@mui/joy/Divider";
import Dropdown from "@mui/joy/Dropdown";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import * as React from "react";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import SearchIcon from "@mui/icons-material/Search";
import { Stack, Textarea } from "@mui/joy";
import * as XLSX from "xlsx";
import { IRequests } from "../../interfaces/IRequests";
import { convertArrayToDate, getCurrentUser } from "../../utils/helpers";
import {
  changeStage,
  getAllRequests,
  rejectRequest,
} from "../Requests/requests_api";
import { SearchRounded } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

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

function RowMenu({
  request,
  handleGetAllRequests,
  setRequest,
  setRejectOpen,
  loading,
  setLoading,
}: {
  request: IRequests;
  handleGetAllRequests: () => Promise<void>;
  setRequest: React.Dispatch<React.SetStateAction<IRequests | null>>;
  setRejectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: "plain", color: "neutral", size: "sm" } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem
          onClick={async () => {
            setLoading(true);
            try {
              await changeStage(request.id!, "PI Review");
              handleGetAllRequests();
            } catch (error) {
              console.error(error);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Forward to PI"}
        </MenuItem>
        <Divider />
        <MenuItem
          color="danger"
          onClick={() => {
            setRequest(request); // Set the current request
            setRejectOpen(true);
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Decline"}
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}
export default function RequestTable() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [rows, setRows] = React.useState<IRequests[]>([]);
  const user = getCurrentUser();
  const [rejectReason, setRejectReason] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [rejectOpen, setRejectOpen] = React.useState(false);
  const [req, setReq] = React.useState<IRequests | null>(null);
  const [dateRange, setDateRange] = React.useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  // Helper function to format date arrays
  const formatDate = (dateArray?: number[]) => {
    if (!dateArray) return "N/A";
    const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
    return date.toLocaleDateString();
  };

  // Flatten and filter data based on date range
  const prepareDataForExport = () => {
    return rows
      .filter((file) => {
        // Apply date filtering only if both start and end dates are provided
        if (dateRange.start && dateRange.end) {
          const fileDate = file.createdDate
            ? new Date(
                file.createdDate[0],
                file.createdDate[1] - 1,
                file.createdDate[2],
              )
            : null;
          return (
            fileDate && fileDate >= dateRange.start && fileDate <= dateRange.end
          );
        }
        return true; // No date filtering if either start or end date is missing
      })
      .map((file) => ({
        ID: file.id || "N/A",
        PID: file.files.pid,
        "Box Number": file.files.boxNumber,
        Status: file.state,
        Stage: file.stage,
        "Responsible Person": file.user
          ? `${file.user.first_name} ${file.user.last_name}`
          : "N/A",
        Email: file.user?.email || "N/A",
        "Date Created": formatDate(file.createdDate),
        "Last Modified Date": formatDate(file.lastModifiedDateTime),
        "Created By": file.createdBy,
      }));
  };

  const handleExportToExcel = () => {
    const data = prepareDataForExport();
    const worksheet = XLSX.utils.json_to_sheet(data); // Convert files array to worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Files Report");

    // Generate and trigger Excel download
    XLSX.writeFile(workbook, "Officer Requests.xlsx");
  };

  const handleReject = async (request: IRequests) => {
    setLoading(true);
    try {
      await rejectRequest(request.id!, rejectReason);
      handleGetAllRequests();
      setRejectOpen(false); // Close the modal
      setRejectReason(""); // Reset the reason
      setReq(null); // Clear the selected request
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
  };

  // Filter files based on search term
  const filteredFiles = rows.filter((req) =>
    req.files.pid.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleGetAllRequests = async () => {
    let res = await getAllRequests();
    setRows(res.filter((req) => req.stage === "Officer"));
  };
  React.useEffect(() => {
    handleGetAllRequests();
  }, []);

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Input
              startDecorator={<SearchRounded />}
              placeholder="Search for file"
              size="md"
              sx={{ width: 300 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Start Date label and input */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Start Date:</Typography>
              <Input
                type="date"
                placeholder="Start Date"
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    start: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </Box>

            {/* End Date label and input */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>End Date:</Typography>
              <Input
                type="date"
                placeholder="End Date"
                onChange={(e) =>
                  setDateRange({
                    ...dateRange,
                    end: e.target.value ? new Date(e.target.value) : null,
                  })
                }
              />
            </Box>

            {/* Export to Excel button */}
            <Button
              onClick={handleExportToExcel}
              variant="solid"
              color="primary"
            >
              Export to Excel
            </Button>
          </Box>
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
                      event.target.checked
                        ? rows.map((row) => row.id!.toString())
                        : [],
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
                  PID
                </Link>
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Box Number</th>
              <th style={{ width: 240, padding: "12px 6px" }}>
                Responsible Person
              </th>
              <th style={{ width: 140, padding: "12px 6px" }}>Date Modified</th>
              <th style={{ width: 140, padding: "12px 6px" }}>Date Uploaded</th>
              <th style={{ width: 140, padding: "12px 6px" }}></th>
            </tr>
          </thead>
          <tbody>
            {[...filteredFiles]
              .sort((a, b) => a.files.pid.localeCompare(b.files.pid))
              .map((row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: "center", width: 120 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id!.toString())}
                      color={
                        selected.includes(row.id!.toString())
                          ? "primary"
                          : undefined
                      }
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? ids.concat(row.id!.toString())
                            : ids.filter(
                                (itemId) => itemId !== row.id!.toString(),
                              ),
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: "left" } } }}
                      sx={{ verticalAlign: "text-bottom" }}
                    />
                  </td>
                  <td>
                    <Typography level="body-xs">{row.files.pid}</Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {row.files.boxNumber}
                    </Typography>
                  </td>
                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar size="sm">
                        {row.user?.first_name.charAt(0) +
                          " " +
                          row.user?.last_name.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography level="body-xs">
                          {row.user?.first_name + " " + row.user?.last_name}
                        </Typography>
                        <Typography level="body-xs">
                          {row.user?.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {convertArrayToDate(row.createdDate!).toDateString()}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">
                      {convertArrayToDate(
                        row.lastModifiedDateTime!,
                      ).toDateString()}
                    </Typography>
                  </td>

                  <td>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <RowMenu
                        request={row}
                        setRejectOpen={setRejectOpen}
                        setRequest={setReq}
                        loading={loading}
                        setLoading={setLoading}
                        handleGetAllRequests={handleGetAllRequests}
                      />
                    </Box>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Sheet>

      <Modal
        aria-labelledby="decline-modal-dialog"
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
      >
        <ModalDialog
          aria-labelledby="decline-modal-dialog-title"
          aria-describedby="decline-modal-dialog-description"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose
            variant="outlined"
            sx={{
              top: "calc(-1/4 * var(--IconButton-size))",
              right: "calc(-1/4 * var(--IconButton-size))",
              boxShadow: "0 2px 12px 0 rgba(0 0 0 / 0.2)",
              borderRadius: "50%",
              bgcolor: "background.surface",
            }}
          />

          <Typography
            id="decline-modal-dialog-title"
            component="h2"
            level="h4"
            textColor="inherit"
            fontWeight="lg"
            mb={1}
          >
            Decline Request
          </Typography>

          <Typography
            id="decline-modal-dialog-description"
            textColor="text.tertiary"
            mb={3}
          >
            Please provide a reason for declining this request.
          </Typography>

          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Reason for declining</FormLabel>
            <Textarea
              minRows={3}
              sx={{ mt: 1 }}
              placeholder="Enter your reason here..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </FormControl>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setRejectOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={() => handleReject(req!)}
              disabled={!rejectReason.trim()}
            >
              Decline Request
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
