import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { ArticleRounded } from "@mui/icons-material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import IFile from "../../interfaces/IFile";
import { convertArrayToDate } from "../../utils/helpers";

interface TableFilesProps {
  data: IFile[];
  onFileClick: (file: IFile) => void;
}

export default function TableFiles({ data, onFileClick }: TableFilesProps) {
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
              <Typography level="title-sm">Status</Typography>
            </th>
            <th>
              <Typography level="title-sm">Responsible User</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((file, index) => (
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
              <td>
                {file.responsibleUser?.first_name +
                  " " +
                  file.responsibleUser?.last_name}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
