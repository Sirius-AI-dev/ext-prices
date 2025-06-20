import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.

// Define the interface for the properties required to add a link.
interface AddLinkProps {
  html: string;
  // The HTML content of the page to be tracked.
  url: string;
  // The URL of the page to be tracked.
  title: string;
  // The title of the page to be tracked.
}

// Async function to add a new link for tracking.
// Takes an object containing the html, url, and title of the page.
export const addLink = async (data: AddLinkProps) => {
  // Logical block: Prepare the payload for the API request.
  const payload = {
    key: "ext_add_item",
    // The API key or identifier for the 'add item' action.
    data,
    // The data object containing html, url, and title.
  };

  // Logical block: Make the API request with the prepared payload and return the result.
  return await makeRequest(payload);
};
