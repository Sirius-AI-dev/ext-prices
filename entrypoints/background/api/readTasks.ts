import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.

// Async function to read tasks from the backend API.
export const readTasks = async () => {
  // Logical block: Prepare the payload for the request to read tasks.
  const payload = {
    key: "ext_read_tasks",
    // The API key or identifier for the 'read tasks' action.
  };

  // Logical block: Make the API request with the prepared payload and return the result.
  return await makeRequest(payload);
};
