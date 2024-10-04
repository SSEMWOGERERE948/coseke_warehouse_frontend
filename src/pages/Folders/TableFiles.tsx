import Avatar from "@mui/joy/Avatar";
import AvatarGroup from "@mui/joy/AvatarGroup";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import { ArticleRounded } from "@mui/icons-material";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";

interface FileData {
  folderName: string;
  lastModified: string;
  size: string;
  avatars: string[];
}

interface TableFilesProps {
  data: FileData[];
  onFileClick: (file: FileData) => void;
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
                Last modified
              </Typography>
            </th>
            <th>
              <Typography level="title-sm">Size</Typography>
            </th>
            <th>
              <Typography level="title-sm">Users</Typography>
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
                  {file.folderName}
                </Typography>
              </td>
              <td>
                <Typography level="body-sm">{file.lastModified}</Typography>
              </td>
              <td>
                <Typography level="body-sm">{file.size}</Typography>
              </td>
              <td>
                {file.avatars.length > 1 ? (
                  <AvatarGroup
                    size="sm"
                    sx={{
                      "--AvatarGroup-gap": "-8px",
                      "--Avatar-size": "24px",
                    }}
                  >
                    {file.avatars.map((src, avatarIndex) => (
                      <Avatar
                        key={avatarIndex}
                        src={src}
                        srcSet={`${src} 2x`}
                      />
                    ))}
                    {file.avatars.length > 3 && (
                      <Avatar>+{file.avatars.length - 3}</Avatar>
                    )}
                  </AvatarGroup>
                ) : (
                  <Avatar
                    size="sm"
                    src={file.avatars[0]}
                    srcSet={`${file.avatars[0]} 2x`}
                    sx={{ "--Avatar-size": "24px" }}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
