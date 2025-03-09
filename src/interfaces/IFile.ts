export default interface IFile {
  organizationName?: string;
  organizationId?: number;
  id?: number;
  archivalBoxId: number;
  boxNumber: number;
  status?: string;
  folder?: any;
  checkedOutBy?: number | null;
  checkedOutByName?: string | null;
  checkedOutByEmail?: string | null;
  checkedOutByFirstName?: string | null;
  checkedOutByLastName?: string | null;

  // Archival box details
  archivalBoxName?: string;
  archivalBoxType?: string;
  rackId?: number;
  rackName?: string;
  rackType?: string;
  shelfId?: number;
  shelfName?: string;
  shelfType?: string;

  metadataJson: Record<string, any>[]; // Always an array of metadata
}

export interface FileResponse {
  organizationId?: number;
  id?: number;
  archivalBoxId: number;
  boxNumber: number;
  status?: string;
  archivalBoxName?: string;
  archivalBoxType?: string;
  metadataJson?: Record<string, any>[] | string; // ✅ Can be an array OR stringified JSON
}
