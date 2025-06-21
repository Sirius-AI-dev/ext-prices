import { makeRequest } from "./index";
// Import the makeRequest function from the API index file.

// Define the interface for task response details, essentially a key-value pair with arbitrary values.
export interface TaskResponseData {
  [key: string]: any;
  // Allows any string key with any value.
}

// Define the interface for the properties required to update tasks.
interface UpdateTasksProps {
  id: string;
  // The unique identifier of the task to be updated.
  url?: string;
  // The URL associated with the task.
  html?: string;
  // The updated HTML content related to the task.
  data?: TaskResponseData;
  // Collected data related to the task.
}

// Async function to update tasks on the backend API.
// Takes an object containing the updated html, url, and the task id.
export const updateTasks = async (data: UpdateTasksProps) => {
  // Logical block: Prepare the payload for the request to update tasks.
  const payload = {
    key: "ext_update_tasks",
    // The API key or identifier for the 'update tasks' action.
    data,
    // The data object containing html, url, and id for the task update.
  };

  // Logical block: Make the API request with the prepared payload.
  await makeRequest(payload);
};
