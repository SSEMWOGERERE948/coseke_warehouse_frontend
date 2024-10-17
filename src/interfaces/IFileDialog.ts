import IFile from "./IFile";

interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileCreate: (fileData: IFile) => void;
}
export default FileUploadDialogProps;
