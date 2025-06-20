import "@/assets/styles/styles.css";
// Import the main stylesheet for the content script.
import "sonner/dist/styles.css";
// Import the stylesheet for the Sonner toast library.

import { ContentScriptContext } from "#imports";
// Import ContentScriptContext type from WXT imports.

import React from "react";
// Import the React library for building UI components.
import ReactDOM, { Root } from "react-dom/client";
// Import ReactDOM and Root type for rendering React components into shadow DOM.
import { toast, Toaster } from "sonner";
// Import toast and Toaster components from Sonner for notifications.

import { addItem, isParserTab } from "./api";
// Import API functions specific to content scripts: addItem and isParserTab.
import { isMatch } from "./utils";
// Import utility function isMatch from content script utilities.
import { changeSetting, settingsStore } from "@/store";
// Import settings-related functions and store: changeSetting and settingsStore.

import WelcomePopup from "@/components/WelcomePopup";
// Import the WelcomePopup React component.
import Popup from "@/components/Popup";
// Import the main Popup React component.
import Modal from "@/components/ui/Modal";
// Import the Modal UI component.

// Variable to hold the integrated UI for the floating button.
let floatingButton: globalThis.IntegratedContentScriptUi<ReactDOM.Root>;
// Variable to hold the shadow root UI for the main popup.
let popup: ShadowRootContentScriptUi<Root> | null;
// Variable to hold the shadow root UI for the welcome popup.
let welcomePopup: ShadowRootContentScriptUi<Root> | null;
// Variable to hold the shadow root UI for the toaster notifications.
let toaster: ShadowRootContentScriptUi<Root> | null;

// Define the content script entry point using WXT's defineContentScript.
export default defineContentScript({
  // Specify that this content script should run on all URLs.
  matches: ["<all_urls>"],
  // Define how CSS should be injected (into a UI layer).
  cssInjectionMode: "ui",
  // The main function of the content script, executed when it's injected into a page.
  async main(ctx) {
    // Logical block: Check if the current tab is the parser tab and load user settings.
    const parserTab = await isParserTab();
    const settings = await settingsStore.getValue();

    // Logical block: If the welcome popup should be shown and hasn't been mounted yet, mount it.
    if (settings.welcomePopup && !welcomePopup) {
      mountWelcomePopup(ctx);
    }

    // Logical block: If the current tab is the parser tab, stop execution of this content script instance.
    if (parserTab) return;

    // Logical block: If the toaster hasn't been mounted yet, mount it.
    if (!toaster) {
      mountToaster(ctx);
    }

    // Logical block: Add an event listener for WXT's custom location change event.
    ctx.addEventListener(window, "wxt:locationchange", async ({ newUrl }) => {
      console.log(`location change`);

      // Logical block: Check if the new URL matches a registered pattern.
      const match = await isMatch(newUrl.href);

      // Logical block: If the URL doesn't match, do nothing further for this event.
      if (!match) return;

      // Logical block: If the floating button hasn't been mounted yet, mount it.
      if (!floatingButton) {
        mountFloatingButton(ctx);
      }
    });

    // Logical block: Add an event listener for the 'contextlost' event on the window (potentially for error handling/debugging).
    ctx.addEventListener(window, "contextlost", () => {
      console.error(`Houston, we just lost context`);
    });

    // Logical block: Check if the initial current URL matches a registered pattern when the script first runs.
    const currentUrl = window.location.href;
    const match = await isMatch(currentUrl);

    // Logical block: If the initial URL doesn't match, stop execution of the rest of this main function.
    if (!match) return;

    // Logical block: If the floating button hasn't been mounted yet, mount it.
    if (!floatingButton) {
      mountFloatingButton(ctx);
    }
  },
});

// Function to mount the FloatingButton component as an integrated UI overlay.
function mountFloatingButton(ctx: ContentScriptContext) {
  console.log(`mounting floating button`);

  // Logical block: Create an integrated UI instance for the floating button.
  floatingButton = createIntegratedUi(ctx, {
    position: "overlay", // Position the UI as an overlay.
    anchor: "body", // Anchor the UI to the document body.
    // Define the onMount function, which is called when the container element is ready.
    onMount: (container) => {
      // Create a React root within the provided container.
      const root = ReactDOM.createRoot(container);
      // Render the FloatingButton component inside the React root.
      root.render(
        // Use React.StrictMode for development checks.
        <React.StrictMode>
          {/* Render the FloatingButton component. */}
          <FloatingButton
            // Pass the onTogglePopup function to handle button clicks.
            onTogglePopup={() => {
              // Logical block: Toggle the popup visibility.
              if (popup) {
                closePopup();
                return;
              }
              closeWelcomePopup(); // Close welcome popup if open before showing main popup.
              showPopup(ctx); // Show the main popup.
            }}
            // Pass the onAddLink function to handle adding a link.
            onAddLink={(link) => onAddLink(link)} // Call the local onAddLink function.
          />
        </React.StrictMode>
      );
      // Return the React root instance.
      return root;
    },
    // Define the onRemove function, called when the UI is removed.
    onRemove: (root) => {
      // Unmount the React root to clean up.
      root?.unmount();
    },
  });

  // Mount the created floating button UI.
  floatingButton.mount();
}

// Async function to mount the WelcomePopup component as a shadow root UI overlay.
async function mountWelcomePopup(ctx: ContentScriptContext) {
  console.log(`mounting welcome screen`);

  // Logical block: Create a shadow root UI instance for the welcome popup.
  welcomePopup = await createShadowRootUi(ctx, {
    name: "welcome-popup", // Assign a name to the shadow root UI.
    anchor: "body", // Anchor the UI to the document body.
    position: "overlay", // Position the UI as an overlay.
    // Define the onMount function.
    onMount: (container) => {
      // Create a React root within the provided container.
      const root = ReactDOM.createRoot(container);
      // Render the welcome popup structure inside the React root.
      root.render(
        // Wrapper div for positioning and styling.
        <div className="fixed top-1 right-1 z-[999999] border border-neutral-400 rounded">
          {/* Render the Modal component as a container for the welcome popup. */}
          <Modal onClose={closeWelcomePopup} title="Welcome to the Discount extension!">
            {/* Render the WelcomePopup component inside the modal. */}
            <WelcomePopup onClose={closeWelcomePopup} /> {/* Pass the close function to the component. */}
          </Modal>
        </div>
      );
      // Return the React root instance.
      return root;
    },
    // Define the onRemove function.
    onRemove: (root) => root?.unmount(), // Unmount the React root on removal.
  });

  // Mount the created welcome popup UI.
  welcomePopup.mount();
}

// Async function to mount the Toaster component for displaying notifications.
async function mountToaster(ctx: ContentScriptContext) {
  console.log(`mounting toaster`);

  // Logical block: Create a shadow root UI instance for the toaster.
  toaster = await createShadowRootUi(ctx, {
    name: "toaster-overlay", // Assign a name to the shadow root UI.
    anchor: "body", // Anchor the UI to the document body.
    position: "overlay", // Position the UI as an overlay.
    // Define the onMount function.
    onMount: (container) => {
      // Create a React root within the provided container.
      const root = ReactDOM.createRoot(container);
      // Render the Toaster component inside the React root.
      root.render(
        // Wrapper div for positioning and ensuring it's above other content.
        <div className="fixed inset-0 pointer-events-none z-[9999999]">
          {/* Render the Toaster component. */}
          <Toaster position="top-center" richColors={true} /> {/* Configure Toaster position and appearance. */}
        </div>
      );
      // Return the React root instance.
      return root;
    },
    // Define the onRemove function.
    onRemove: (root) => root?.unmount(), // Unmount the React root on removal.
  });

  // Mount the created toaster UI.
  toaster.mount();
}

// Async function to show the main Popup component as a shadow root UI overlay.
async function showPopup(ctx: ContentScriptContext) {
  // Logical block: Create a shadow root UI instance for the main popup.
  popup = await createShadowRootUi(ctx, {
    name: "inline-popup", // Assign a name to the shadow root UI.
    anchor: "body", // Anchor the UI to the document body.
    position: "overlay", // Position the UI as an overlay.
    // Define the onMount function.
    onMount: (container) => {
      // Create a React root within the provided container.
      const root = ReactDOM.createRoot(container);
      // Render the popup structure inside the React root.
      root.render(
        // Wrapper div for positioning and styling.
        <div className="fixed top-1 right-1 z-[999999] border border-neutral-400 rounded">
          {/* Render the Modal component as a container for the popup. */}
          <Modal onClose={closePopup} title="Discount Extension">
            {/* Render the main Popup component inside the modal. */}
            <Popup embedded={true} /> {/* Render Popup and indicate it's embedded. */}
          </Modal>
        </div>
      );
      // Return the React root instance.
      return root;
    },
    // Define the onRemove function.
    onRemove: (root) => root?.unmount(), // Unmount the React root on removal.
  });

  // Mount the created main popup UI.
  popup.mount();
}

// Add a listener for messages received from other parts of the extension (e.g., background script, popup).
browser.runtime.onMessage.addListener((message) => {
  // Logical block: Handle different message types received.
  switch (message.type) {
    case "closeUIPopup": {
      // Logical block: Attempt to close the main popup and welcome popup.
      try {
        closePopup();
        closeWelcomePopup();
      } catch (error) {
        console.error(error);
      }
      break;
    }
    case "showToast": {
      // Logical block: Handle the request to show a toast notification.
      const { text, type } = message.payload;

      // Logical block: Validate that text and type are provided for the toast.
      if (!text || !type) {
        console.warn(`Toast needs a text and a type`);
        return;
      }

      // Logical block: Display the toast based on the specified type.
      if (type === "success") {
        toast.success("Discount Extension", { description: text }); // Show a success toast.
      } else if (type === "error") {
        toast.error("Discount Extension", { description: text }); // Show an error toast.
      }
      break;
    }
  }
});

// Function to close the main popup UI.
function closePopup() {
  // Logical block: Check if the popup UI instance exists.
  if (popup) {
    // Logical block: Remove the popup UI from the DOM.
    popup.remove();
    // Logical block: Set the popup variable back to null.
    popup = null;
  }
}

// Async function to close the welcome popup UI.
async function closeWelcomePopup() {
  // Logical block: Check if the welcome popup UI instance exists.
  if (welcomePopup) {
    // Logical block: Remove the welcome popup UI from the DOM.
    welcomePopup.remove();
    // Logical block: Set the welcomePopup variable back to null.
    welcomePopup = null;
  }
}

// Define the interface for the properties required when adding a link from the content script.
interface AddLinkProps {
  html: string;
  // The HTML content of the page.
  url: string;
  // The URL of the page.
  title: string;
  // The title of the page.
}

// Function to handle the action of adding a link.
// It uses the toast.promise utility to show loading, success, or error states for the addItem API call.
function onAddLink(link: AddLinkProps) {
  // Logical block: Call the addItem API function and wrap it with toast notifications.
  toast.promise(addItem(link), {
    loading: "Adding link...", // Message shown while the promise is pending.
    success: "Link added", // Message shown if the promise resolves successfully.
    error: "Error adding link", // Message shown if the promise is rejected.
  });
}
