import { sendRequest } from "./index";
// Import the sendRequest function from the API index file in the content script directory.

// Define the interface for the properties required to add an item.
interface AddItemProps {
  url: string;
  // The URL of the page where the item is located.
  html: string;
  // The HTML content of the page containing the item.
  title: string;
  // The title of the page.
}

// Async function to send a request to the background script to add a new item (link) for tracking.
// This function is called from the content script.
export const addItem = async (data: AddItemProps) => {
  // Logical block: Prepare the payload for the message to the background script.
  const payload = {
    key: "ext_add_item",
    // The key identifying the action to be performed by the background script.
    data,
    // The data object containing the url, html, and title of the item to add.
  };

  // Logical block: Send the payload to the background script using the sendRequest utility and return the result.
  return await sendRequest(payload);
};
