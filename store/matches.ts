// Define and export the matchesStore using the storage API.
// This store is used to persistently store an array of strings, likely representing URL patterns or matched domains.
export const matchesStore = storage.defineItem<string[]>("local:url_icon", {
  // Provide a fallback value (an empty array) if the stored value is not found or is invalid.
  fallback: [],
});
