import React, { createContext, ReactNode, useContext, useState } from "react";
import IFile from "../../interfaces/IFile";

interface FileContextType {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  fileData: IFile[];
  setFileData: (data: IFile[]) => void;
  selectedFile: IFile | null;
  setSelectedFile: (file: IFile | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [fileData, setFileData] = useState<IFile[]>([
    // ... (initial file data)
  ]);
  const [selectedFile, setSelectedFile] = useState<IFile | null>(null);

  return (
    <FileContext.Provider
      value={{
        selectedTag,
        setSelectedTag,
        fileData,
        setFileData,
        selectedFile,
        setSelectedFile,
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error("useFileContext must be used within a FileProvider");
  }
  return context;
};
