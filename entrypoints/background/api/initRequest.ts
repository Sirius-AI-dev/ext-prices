import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.

// Async function to send an initial request to the backend.
// This is likely used for initial setup or registration of the extension instance.
export const initRequest = async () => {
  // Logical block: Prepare the payload for the initial request.
  const payload = {
    key: "ext_init",
    // The API key or identifier for the initialization action.
    data: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      // Include the user's timezone information.
      browser_language: navigator.language,
      // Include the user's browser language.
    },
  };

  // Logical block: Make the API request with the prepared payload.
  await makeRequest(payload);
};
