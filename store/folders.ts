import { Folder } from "@/types";
// Import the Folder type definition.

// Define and export the folderStore using the storage API.
// This store is used to persistently store an array of Folder objects in local storage.
export const folderStore = storage.defineItem<Folder[]>("local:folders", {
  // Provide a fallback value (an empty array) if the stored value is not found or is invalid.
  fallback: [],
});
