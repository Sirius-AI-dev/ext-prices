// Define the interface for the settings store.
interface SettingsStore {
  registered: boolean;
  // Indicates if the user has registered.
  welcomePopup: boolean;
  // Indicates if the welcome popup should be shown.
}

// Define and export the settingsStore using the storage API.
// This store is used to persistently store user settings in local storage.
export const settingsStore = storage.defineItem<SettingsStore>("local:settings", {
  // Initialize the store with default values if no value is found.
  init: () => ({
    registered: false,
    welcomePopup: true,
  }),
});

// Async function to change one or more settings.
// Takes an object where keys are setting names and values are the new values.
export const changeSetting = async (setting: {}) => {
  // Logical block: Get the current settings from the store.
  const store = await settingsStore.getValue();
  // Logical block: Create a new object by merging the current settings with the provided new settings.
  const updatedStore = { ...store, ...setting };

  // Logical block: Save the updated settings back to the store.
  await settingsStore.setValue(updatedStore);
  // Return the updated settings object.
  return updatedStore;
};
