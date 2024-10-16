interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileCreate: (fileData: {
    fileName: string;
    status: string;
    responsiblePerson: string;
    folder: number | null;
    caseStudy: number | null;
    boxNumber: string;
    PIDInfant: string;
    PIDMother: string;
  }) => void;
}
export default FileUploadDialogProps;
