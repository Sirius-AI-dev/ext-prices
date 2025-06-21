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
  xpath?: string;
  // xpath expression to extract data from html
  data?: TaskResponseData;
  // Collected data related to the task.
}

// Async function to update tasks on the backend API.
// Takes an object containing the updated html, url, and the task id.
export const updateTasks = async (task_data: UpdateTasksProps) => {

  try {
    if (task_data.xpath!) {

      // 1. Parse the HTML string into a Document object
      const parser = new DOMParser();
      const doc = parser.parseFromString(task_data.html, 'text/html');

      // 2. Use XPath to extract data
      // Using createNSResolver to handle potential namespaces, though null is often sufficient for basic HTML
      const resolver = doc.createNSResolver(doc.documentElement);
      const nodesSnapshot = doc.evaluate(
        task_data.xpath,
        doc, // Context node
        resolver, // Namespace resolver
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, // Result type: returns a snapshot of nodes
        null // Existing result
      );

      // 3. Store the extracted data (nodes) in an array
      const extractedData = [];
      for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
        // extract the raw HTML of the elements using .outerHTML
        extractedData.push(nodesSnapshot.snapshotItem(i));
      }

      // 4. Store the array in the task_data.data.extracted
      task_data.html = '';
      task_data.data.extracted = extractedData;
      
    }

  } catch (e) {
    console.error("An error occurred during HTML parsing or XPath extraction:", e);
  }    

  // Prepare the payload for the request to update tasks.
  const payload = {
    key: "ext_update_tasks",
    // The API key or identifier for the 'update tasks' action.
    task_data,
    // The data object containing html, url, and id for the task update.
  };

  // Make the API request with the prepared payload.
  await makeRequest(payload);

};
