import { AxiosInstance } from "../../core/baseURL";
import IFile, { FileResponse } from "../../interfaces/IFile";
import { getCurrentUser } from "../../utils/helpers";

export const getAllFilesService = async (
  organizationId?: number,
  isSuperAdmin: boolean = false,
): Promise<IFile[]> => {
  try {
    const url = new URL("https://warehouse.cosekeservices.com");

    if (organizationId !== undefined) {
      url.searchParams.append("organizationId", organizationId.toString());
    }

    url.searchParams.append("isSuperAdmin", String(isSuperAdmin));

    console.log("Fetching Files with Params:", url.toString());

    const response = await AxiosInstance.get<any>(url.toString());

    // Handle the nested response format (files & archivalBoxes)
    const fileData = Array.isArray(response.data)
      ? response.data
      : response.data.files || [];
    const archivalBoxes = Array.isArray(response.data)
      ? []
      : response.data.archivalBoxes || [];

    // Create a lookup map for archival boxes
    const boxMap = new Map();
    archivalBoxes.forEach((box: any) => {
      boxMap.set(box.archivalBoxId, box);
    });

    return fileData.map((file: any) => {
      let parsedMetadataJson: Record<string, any>[] = [];

      try {
        // Handle string metadataJson
        if (typeof file.metadataJson === "string") {
          parsedMetadataJson = JSON.parse(file.metadataJson);
        }
        // Handle array metadataJson
        else if (Array.isArray(file.metadataJson)) {
          parsedMetadataJson = file.metadataJson;
        }

        // Ensure it's always an array
        if (!Array.isArray(parsedMetadataJson)) {
          parsedMetadataJson = [parsedMetadataJson];
        }
      } catch (error) {
        console.error(`Error parsing metadataJson for file ${file.id}:`, error);
        parsedMetadataJson = [];
      }

      // Get archival box & organization details
      const box = boxMap.get(file.archivalBoxId);
      const organizationName = file.organization?.name || "N/A"; // ✅ Extract organization name

      return {
        id: file.id ?? undefined,
        archivalBoxId: file.archivalBoxId ?? 0,
        boxNumber: file.boxNumber,
        metadataJson: parsedMetadataJson,
        status: file.status ?? "Available",
        checkedOutBy: file.checkedOutBy ?? null, // ✅ Include checkedOutBy
        organizationId: file.organization?.id ?? null, // ✅ Store organization ID
        organizationName, // ✅ Store organization name
        archivalBoxName: box?.archivalBoxName || "N/A",
        rackName: box?.rackName || "N/A",
        shelfName: box?.shelfName || "N/A",
      };
    });
  } catch (error: any) {
    console.error("Error fetching files:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch files");
  }
};

// Add a single file
export const addFileService = async (file: IFile): Promise<IFile> => {
  try {
    const requestData = {
      archivalBoxId: file.archivalBoxId,
      boxNumber: file.boxNumber,
      metadataJson: file.metadataJson, // ✅ Send metadataJson as is (array of objects)
    };

    const response = await AxiosInstance.post<FileResponse>(
      "files/add",
      requestData,
    );
    return {
      ...response.data,
      metadataJson: Array.isArray(response.data.metadataJson)
        ? response.data.metadataJson
        : [],
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to add file");
  }
};

export const bulkUploadFilesService = async (
  archivalBoxId: number,
  boxNumber: number,
  organizationId: number,
  metadataJson: Record<string, any>[],
) => {
  try {
    const structuredData = metadataJson.map((file) => ({
      ...file,
      status: "Available", // ✅ Ensure all files start as "Available"
    }));

    const requestData = {
      archivalBoxId,
      boxNumber,
      organizationId,
      metadataJson: structuredData,
    };

    await AxiosInstance.post("files/bulk-upload", requestData);
  } catch (error: any) {
    console.error("Bulk upload failed:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to bulk upload files",
    );
  }
};

// Get a file by ID with metadataJson
export const getFileByIdService = async (id: number): Promise<IFile> => {
  try {
    const response = await AxiosInstance.get<FileResponse>(`files/${id}`);

    return {
      ...response.data,
      metadataJson: (() => {
        if (Array.isArray(response.data.metadataJson)) {
          return response.data.metadataJson;
        }
        if (typeof response.data.metadataJson === "string") {
          return [JSON.parse(response.data.metadataJson)];
        }
        return [];
      })(),
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to fetch file with ID: ${id}`,
    );
  }
};

// Delete a file by ID
export const deleteFileService = async (id: number): Promise<void> => {
  try {
    await AxiosInstance.delete(`files/delete/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || `Failed to delete file with ID: ${id}`,
    );
  }
};

// Delete multiple files
export const deleteMultipleFilesService = async (
  ids: number[],
): Promise<void> => {
  try {
    await AxiosInstance.delete("files/delete-multiple", { data: ids });
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to delete multiple files",
    );
  }
};

export const checkOutFileService = async (fileId: number) => {
  try {
    const currentUser = getCurrentUser();
    const requestData = {
      fileId: fileId,
      checkedOutBy: currentUser.id,
      organizationId: currentUser.organizationId, // Add organization ID to payload
    };

    const response = await AxiosInstance.post(
      `files/${fileId}/check-out`,
      requestData,
    );
    console.log(`✅ API Response (Check Out):`, response.data);
  } catch (error: any) {
    console.error(
      `❌ Check-Out Error for file ${fileId}:`,
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to check out file with ID: ${fileId}`,
    );
  }
};

export const checkInFileService = async (fileId: number): Promise<void> => {
  try {
    const response = await AxiosInstance.post(`files/${fileId}/check-in`);
    console.log(`✅ API Response (Check In):`, response.data);
  } catch (error: any) {
    console.error(
      `❌ Check-In Error for file ${fileId}:`,
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to check in file with ID: ${fileId}`,
    );
  }
};

// Fetch all available archival boxes for file storage
export const getAllArchivalBoxes = async (): Promise<any[]> => {
  try {
    const response = await AxiosInstance.get("storage-locations/all");

    // Filter only archival boxes
    const archivalBoxes = response.data.filter(
      (location: any) => location.type === "Archival Box",
    );

    return archivalBoxes;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch archival boxes",
    );
  }
};

export const getUserCheckedOutFiles = async (): Promise<IFile[]> => {
  try {
    const currentUser = getCurrentUser();
    const isSuperAdmin = currentUser?.roles?.some(
      (role) => role.name === "SUPER_ADMIN",
    );

    const url = new URL("https://warehouse.cosekeservices.com");

    if (!isSuperAdmin) {
      url.searchParams.append("checkedOutBy", currentUser.id.toString()); // ✅ Filter by user ID
    }

    console.log("Fetching Checked-Out Files:", url.toString());

    const response = await AxiosInstance.get<any>(url.toString());

    const files = response.data.files || [];
    return files.map((file: any) => ({
      id: file.id ?? undefined,
      boxNumber: file.boxNumber,
      status: file.status ?? "Available",
      checkedOutBy: file.checkedOutBy ?? null, // ✅ Include checkedOutBy
      organizationName: file.organization?.name || "N/A", // ✅ Store organization name
    }));
  } catch (error: any) {
    console.error("Error fetching checked-out files:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch checked-out files",
    );
  }
};
