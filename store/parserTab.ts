// Define and export the parserTabStore using the storage API.
// This store is used to persistently store information about a browser tab, likely the one used for parsing.
export const parserTabStore = storage.defineItem<globalThis.Browser.tabs.Tab>("local:parserTab", {});
// The storage key is "local:parserTab".
// The type stored is a Browser.tabs.Tab object.