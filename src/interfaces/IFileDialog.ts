interface FileUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onFileCreate: (fileData: {
    fileName: string;
    status: string;
    responsiblePerson: string;
    folder: string;
    caseStudy: string;
    boxNumber: string;
    PIDInfant: string;
    PIDMother: string;
  }) => void;
}
export default FileUploadDialogProps;
