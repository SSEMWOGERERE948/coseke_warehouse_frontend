import React, { createContext, useState, useContext, ReactNode } from "react";
import { IFileData } from "../../interfaces/IFileData";

interface FileContextType {
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  fileData: IFileData[];
  setFileData: (data: IFileData[]) => void;
  selectedFile: IFileData | null;
  setSelectedFile: (file: IFileData | null) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [fileData, setFileData] = useState<IFileData[]>([
    // ... (initial file data)
  ]);
  const [selectedFile, setSelectedFile] = useState<IFileData | null>(null);

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
