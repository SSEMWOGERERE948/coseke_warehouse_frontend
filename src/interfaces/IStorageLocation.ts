import { MouseEvent } from "react";
import IUser from "./IUser";

export default interface IStorageLocation {
  id: number;
  name: string;
  type: "Rack" | "Shelf" | "Archival Box" | "Box"; // Define storage types
  parentId?: number | null; // Parent location ID (null if it's a Rack)
  parentName?: string; // Optional: Parent location name for display
  createdAt: string; // Date string format
  updatedAt?: string; // Optional for update tracking
  folders?: number[]; // List of assigned folder IDs
  parent?: { id: number; name: string } | null; // Include parent object with name
}
