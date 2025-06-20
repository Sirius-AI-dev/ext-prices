import { parserTabStore, settingsStore } from "@/store";
// Import stores for parser tab and settings.
import { initRequest, readTasks, addLink, makeRequest, updateTasks } from "./api";
// Import API functions for background scripts.
import { checkTasks } from "./tasks";
// Import the checkTasks function.
import { QueueController } from "./QueueController";
// Import the QueueController class.
import {
  parserTabIsOpen,
  createParserTab,
  updateParserTabUrl,
  isParserTab,
  injectParserTabScript,
  isParserTabActive,
} from "./parserTab";
// Import utility functions related to the parser tab.

// Determine if debug mode is enabled based on the environment variable.
const debugMode = import.meta.env.WXT_DEBUG;

// Define intervals for reading and checking tasks, with different values for debug mode.
const READ_TASKS_INTERVAL_IN_MINUTES = debugMode ? 0.5 : 4.5;
const CHECK_TASKS_INTERVAL_IN_MINUTES = debugMode ? 0.6 : 5;

// Initialize a new QueueController instance, using the updateTab function to process items.
let queueController = new QueueController(updateTab);

// Define the background script entry point using WXT's defineBackground.
export default defineBackground(() => {
  // console.log(import.meta.env.WXT_API_URL, { id: browser.runtime.id });

  // Logical block: Create the parser tab when the background script starts.
  // parserTabIsOpen().then((isOpen) => {
  //   if (!isOpen) {
  //     queueController.finish();
  //   }
  // });
  createParserTab();

  // Add a listener for the browser's onInstalled event.
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    console.log({ reason });

    // Logical block: Initialize the extension after installation.
    await init();
  });

  // Add a listener for browser alarms.
  browser.alarms.onAlarm.addListener(async (alarm) => {
    // Logical block: Check if the user is registered before processing alarms.
    const registered = await isRegistered();

    if (!registered) {
      return;
    }

    // Logical block: Handle different alarm names.
    switch (alarm.name) {
      case "read-tasks": {
        console.log("reading tasks");

        // Logical block: Read tasks from the API and handle potential errors.
        try {
          await readTasks();
        } catch (error) {
          console.error("Error while reading tasks: ", error);
        }
        break;
      }
      case "check-tasks": {
        // Logical block: Check tasks and add them to the queue if needed, handle potential errors.
        try {
          await checkTasks(CHECK_TASKS_INTERVAL_IN_MINUTES, queueController);
        } catch (error) {
          console.error("Error while checking tasks: ", error);
        }
        break;
      }
    }
  });

  // Add a listener for when a browser tab is removed.
  browser.tabs.onRemoved.addListener(async (tabId) => {
    // Logical block: Get the current parser tab information.
    const parserTab = await parserTabStore.getValue();

    // Logical block: If the removed tab is the parser tab, finish the current queue item.
    if (tabId === parserTab?.id) {
      console.log(`parser tab closed`);
      queueController.finish();
    }
  });

  // Add a listener for when a browser tab is updated.
  browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    // Logical block: Get the current parser tab information.
    const parserTab = await parserTabStore.getValue();

    // Logical block: If the updated tab is the parser tab and the status is 'complete', inject the parser script.
    if (tabId === parserTab?.id && changeInfo.status === "complete") {
      try {
        // Logical block: Inject the parser tab script and handle potential errors.
        await injectParserTabScript();
      } catch (error) {
        console.error("Error injecting script:", error);
        queueController.finish();

        // Logical block: Check if the parser tab is active and decide whether to create a new one or restart.
        const isActive = await isParserTabActive();

        if (isActive) {
          console.log(`Opening new parser tab`);
          // createParserTab(); // Commented out, potentially for future implementation
        } else {
          console.log(`Restarting parser tab`);
          // restartParserTab(); // Commented out, potentially for future implementation
        }
      }
    }
  });

  // Add a listener for messages received from other parts of the extension (e.g., popup, content scripts).
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Define an async function to handle the message.
    (async () => {
      // Logical block: Handle different message types.
      switch (message.type) {
        case "isParserTab": {
          // Logical block: Check if the sender's tab is the parser tab and send the result.
          try {
            const result = await isParserTab(sender.tab?.id);
            sendResponse(result);
          } catch (error) {
            console.error("Error trying to get parser tab: ", error);
            sendResponse(error);
          }
          break;
        }
        case "makeRequest": {
          // Logical block: Make an API request using the provided payload and send the result.
          try {
            const result = await makeRequest(message.payload);
            sendResponse(result);
          } catch (error) {
            console.error("Error executing makeRequest: ", error);
            sendResponse(error);
          }
          break;
        }
        case "closeUIPopup": {
          // Logical block: Query for the active tab and send a message to close the UI popup.
          try {
            const queryOptions = { active: true, lastFocusedWindow: true };
            const [tab] = await chrome.tabs.query(queryOptions);

            if (tab?.id) {
              browser.tabs.sendMessage(tab.id, { type: "closeUIPopup" });
            }
          } catch (error) {
            console.error("Error while closing UI popup: ", error);
          } finally {
            return false; // Indicate that the response will not be sent asynchronously.
          }
        }
        case "parsedPage": {
          // Logical block: Process parsed page data received from a content script.
          try {
            // If there is no current item in the queue, do nothing.
            if (!queueController.currentItem) return;

            // Combine the received payload with the current queue item's ID.
            const data = { ...message.payload, id: queueController.currentItem?.id };
            // Update tasks with the parsed data.
            await updateTasks(data);
          } catch (error) {
            console.error("Error sending a parsed page: ", error);
          } finally {
            // Finish the current queue item after processing.
            queueController.finish();
            return false; // Indicate that the response will not be sent asynchronously.
          }
        }
        case "addItem": {
          // Logical block: Handle the request to add a new item (link) to track.
          try {
            // Query for the active tab.
            const queryOptions = { active: true, lastFocusedWindow: true };
            const [tab] = await chrome.tabs.query(queryOptions);

            // Execute the htmlGetter.js script in the active tab to get page data.
            await browser.scripting.executeScript({
              target: { tabId: tab?.id! },
              files: ["/htmlGetter.js"],
            });
          } catch (error) {
            console.error("Error while executing htmlGetter script: ", error);
          } finally {
            return false; // Indicate that the response will not be sent asynchronously.
          }
        }
        case "addItemData": {
          // Logical block: Handle the data received from htmlGetter.js to add a new link.
          // Query for the active tab.
          const queryOptions = { active: true, lastFocusedWindow: true };
          const [tab] = await chrome.tabs.query(queryOptions);

          try {
            // Call the addLink API function with the received payload.
            const response = await addLink(message.payload);

            // If there is an active tab, send a toast message indicating success.
            if (tab?.id) {
              browser.tabs.sendMessage(tab.id, {
                type: "showToast",
                payload: {
                  text: "message" in response ? response.message : "Link added", // Use response message if available, otherwise default text
                  type: "success",
                },
              });
            }
          } catch (error: unknown) {
            console.error("Error while adding link: ", error);

            // Finish the current queue item in case of an error.
            queueController.finish();

            // If there is an active tab, send a toast message indicating the error.
            if (tab?.id) {
              browser.tabs.sendMessage(tab.id, {
                type: "showToast",
                payload: {
                  text: error instanceof Error ? error.message : "Error adding link", // Use error message if available, otherwise default text
                  type: "error",
                },
              });
            }
          } finally {
            return false; // Indicate that the response will not be sent asynchronously.
          }
        }
        case "getActiveTabUrl": {
          // Logical block: Handle the request to get the URL of the active tab.
          try {
            // Query for the active tab.
            const queryOptions = { active: true, lastFocusedWindow: true };
            const [tab] = await chrome.tabs.query(queryOptions);

            // If an active tab is found, send its URL as the response.
            if (tab?.id) {
              sendResponse(tab.url);
            }
          } catch (error) {
            console.error("Error while getting active tab URL: ", error);
            sendResponse(error);
          }
          break;
        }
      }
    })();
    return true; // Indicate that the response will be sent asynchronously.
  });
});

// Async function to restart the parser tab.
async function restartParserTab() {
  // Logical block: Get the current parser tab information.
  const parserTab = await parserTabStore.getValue();

  // Logical block: Remove the existing parser tab and create a new one.
  browser.tabs.remove(parserTab?.id!);
  createParserTab({ active: true });
}

// Async function to initialize the background script.
const init = async () => {
  // Logical block: Create alarms for reading and checking tasks.
  browser.alarms.create("read-tasks", {
    periodInMinutes: READ_TASKS_INTERVAL_IN_MINUTES,
  });
  browser.alarms.create("check-tasks", {
    periodInMinutes: CHECK_TASKS_INTERVAL_IN_MINUTES,
  });
  // Logical block: Check if the user is registered.
  const registered = await isRegistered();
  // Logical block: If not registered, initialize the request (likely for registration). Otherwise, read tasks.
  if (!registered) {
    console.log(`user is not registered`);
    await initRequest();
  } else {
    console.log(`user is registered`);
    await readTasks();
  }
};

// Async function to update the parser tab with a new URL.
async function updateTab(item: { id: string; url?: string }) {
  // Logical block: Check if the parser tab is open.
  const isOpen = await parserTabIsOpen();

  // Logical block: If the parser tab is not open, finish the current queue item and create a new parser tab.
  if (!isOpen) {
    queueController.finish();
    await createParserTab();
  }

  // Destructure the item to get the URL.
  const { url } = item;

  // Logical block: If no URL is provided, do nothing.
  if (!url) {
    return;
  }

  // Logical block: Update the URL of the parser tab.
  await updateParserTabUrl(url);
}

// Async function to check if the user is registered.
const isRegistered = async () => {
  // Logical block: Get the settings from the settings store and check the 'registered' property.
  const settings = await settingsStore.getValue();
  return !!settings?.registered;
};
