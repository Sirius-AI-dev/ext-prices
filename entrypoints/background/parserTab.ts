import { parserTabStore } from "@/store";
// Import the parserTabStore for accessing and managing the parser tab information.

// Define the interface for options when creating a parser tab.
interface CreateParserTabOptions {
  active?: boolean;
  // Optional boolean to indicate if the created tab should be active.
}

// Async function to create a new parser tab.
// It opens a new popup window and creates a tab within it.
export const createParserTab = async (options?: CreateParserTabOptions) => {
  // const parserTab = await browser.tabs.create({
  //   url: "https://google.com",
  //   active: Boolean(options?.active),
  // });

  // await parserTabStore.setValue(parserTab);

  // Logical block: Create a new popup window.
  const newWindow = await browser.windows.create({
    type: "popup",
    state: "maximized",
    // url: browser.runtime.getURL("test.html"), // Commented out, suggests initial URL might be different
  });

  // Logical block: Create a new tab inside the newly created popup window.
  const parserTab = await browser.tabs.create({
    windowId: newWindow.id,
    url: "https://google.com", // Initial URL for the parser tab
  });

  // Logical block: Store the created parser tab information in the parserTabStore.
  await parserTabStore.setValue(parserTab);

  // console.log(newWindow.tabs![0]); // Commented out logging

  // const parserTab = await browser.tabs.update(newWindow.tabs![0].id!, { autoDiscardable: false }); // Commented out

  // await parserTabStore.setValue(parserTab.id!); // Commented out
};

// Async function to check if the parser tab is currently open.
export const parserTabIsOpen = async () => {
  // Logical block: Get the parser tab information from the store.
  const parserTab = await parserTabStore.getValue();

  // Logical block: Check if parserTab exists and has an ID.
  if (!parserTab || !parserTab?.id) {
    return false;
  }

  // Logical block: Attempt to get the tab by its ID to confirm it's open.
  try {
    const tab = await browser.tabs.get(parserTab?.id);

    // Logical block: If getting the tab by ID is successful and returns a tab with an ID, it's open.
    if (tab?.id) {
      return true;
    }
  } catch (e: any) {
    // Logical block: If there's an error (e.g., tab doesn't exist), log the error and return false.
    console.log(e);
    return false;
  }
};

// Async function to update the URL of the parser tab.
// Takes the new URL as an argument.
export const updateParserTabUrl = async (url: string) => {
  // Logical block: Get the parser tab information from the store.
  const parserTab = await parserTabStore.getValue();

  // Logical block: Update the tab's URL using its ID.
  await browser.tabs.update(parserTab.id!, {
    url,
  });

  // Logical block: Update the stored parser tab information (although the URL update might not change the stored object immediately, this ensures the latest tab object is stored if needed later).
  await parserTabStore.setValue(parserTab);
};

// Async function to inject a script into the parser tab.
export const injectParserTabScript = async () => {
  // Logical block: Get the parser tab information from the store.
  const parserTab = await parserTabStore.getValue();

  // Logical block: Execute the content-injector.js script in the parser tab.
  await browser.scripting.executeScript({
    target: { tabId: parserTab?.id! },
    files: ["/content-injector.js"],
  });
};

// Async function to check if a given tab ID belongs to the parser tab.
// Takes an optional tab ID as an argument.
export const isParserTab = async (tabId?: number) => {
  // Logical block: Get the parser tab information from the store and compare its ID with the provided tabId.
  const parserTab = await parserTabStore.getValue();
  return tabId === parserTab?.id;
};

// Async function to check if the parser tab is the currently active tab in the last focused window.
// Takes an optional tab ID as an argument (though the function logic relies on querying active tab).
export const isParserTabActive = async (tabId?: number) => {
  // Logical block: Get the parser tab information from the store.
  const parserTab = await parserTabStore.getValue();

  // Logical block: Query for the active tab in the last focused window.
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  // Logical block: Compare the active tab's ID with the parser tab's ID.
  return tab.id === parserTab?.id;
};
