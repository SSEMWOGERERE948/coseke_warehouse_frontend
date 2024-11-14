import { ArticleRounded } from "@mui/icons-material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import IFile from "../../interfaces/IFile";
import { convertArrayToDate } from "../../utils/helpers";

interface TableFilesProps {
  data: IFile[];
  onFileClick: (file: IFile) => void;
}

export default function TableFiles({ data, onFileClick }: TableFilesProps) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Calculate the start and end index for the current page
  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: any, newValue: number | null) => {
    if (newValue) {
      setRowsPerPage(newValue);
      setPage(0); // Reset to first page when changing rows per page
    }
  };

  return (
    <div>
      <Table
        hoverRow
        size="sm"
        borderAxis="none"
        variant="soft"
        sx={{
          "--TableCell-paddingX": "1rem",
          "--TableCell-paddingY": "1rem",
          "& tr": {
            cursor: "pointer",
          },
        }}
      >
        <thead>
          <tr>
            <th>
              <Typography level="title-sm">Files</Typography>
            </th>
            <th>
              <Typography
                level="title-sm"
                endDecorator={<ArrowDropDownRoundedIcon />}
              >
                Last Modified
              </Typography>
            </th>
            <th>
              <Typography level="title-md">Status</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((file, index) => (
            <tr key={index} onClick={() => onFileClick(file)}>
              <td>
                <Typography
                  level="title-sm"
                  startDecorator={<ArticleRounded color="primary" />}
                  sx={{ alignItems: "flex-start" }}
                >
                  {file.pid}
                </Typography>
              </td>
              <td>
                <Typography level="body-sm">
                  {Array.isArray(file.lastModifiedDateTime)
                    ? convertArrayToDate(
                        file.lastModifiedDateTime,
                      )?.toDateString()
                    : ""}
                </Typography>
              </td>
              <td>
                <Typography level="body-sm">{file.status}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 2,
          mt: 2,
          px: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography level="body-sm">Rows per page:</Typography>
          <Select
            size="sm"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            sx={{ minWidth: 80 }}
          >
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
            <Option value={50}>50</Option>
          </Select>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography level="body-sm">
            {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
          </Typography>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              disabled={page === 0}
              onClick={() => handlePageChange(page - 1)}
              sx={{ minWidth: "unset" }}
            >
              <KeyboardArrowLeftIcon />
            </Button>
            <Button
              size="sm"
              variant="plain"
              color="neutral"
              disabled={page >= totalPages - 1}
              onClick={() => handlePageChange(page + 1)}
              sx={{ minWidth: "unset" }}
            >
              <KeyboardArrowRightIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </div>
  );
}
