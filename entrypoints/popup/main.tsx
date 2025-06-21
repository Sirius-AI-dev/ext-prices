import "@/assets/styles/styles.css";
// Import the main stylesheet for the popup.
import React from "react";
// Import the React library for building UI components.
import ReactDOM from "react-dom/client";
// Import ReactDOM for rendering React components into the DOM.
import Popup from "@/components/Popup";
// Import the main Popup component.
import Modal from "@/components/ui/Modal";
// Import the Modal UI component.

// Send a message to the background script to close any existing UI popups.
browser.runtime.sendMessage({ type: "closeUIPopup" });

// Main logical block: Render the React application.
// Get the root element from the HTML.
ReactDOM.createRoot(document.getElementById("root")!).render(
  // Use React.StrictMode for highlighting potential problems in an application.
  <React.StrictMode>
    {/* Render the Modal component as the main container with a title. */}
    <Modal title="Discount Extension">
      {/* Render the main Popup component inside the Modal. */}
      <Popup />
    </Modal>
  </React.StrictMode>
);
