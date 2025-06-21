import { Folder, Locale, Task } from "@/types";
// Import necessary types: Folder, Locale, and Task.
import axios from "axios";
// Import the axios library for making HTTP requests.
import { handleNewTasks } from "../tasks";
// Import the handleNewTasks function from the tasks module.

// Define the interface for the data structure expected in the request body.
interface RequestData {
  data?: object;
  // Optional object containing data for the request.
  service?: object;
  // Optional object containing service-related information.
  key: string;
  // A key identifying the type of request being made.
}

// Define the interface for the structure of the data expected in the successful response.
interface ResponseData {
  folders: Folder[];
  // An array of Folder objects.
  tasks: Task[];
  // An array of Task objects.
  locale: Locale[];
  // An array of Locale objects.
  url_icon: string[];
  // An array of strings, possibly URLs or identifiers for icons.
  message?: string;
  // Optional message string in the response.
}

// Get the API URL from environment variables.
const apiUrl = import.meta.env.WXT_API_URL;

// Async function to make a request to the backend API.
// Takes a RequestData object as input and returns a Promise resolving to ResponseData or an object with an error.
export const makeRequest = async (requestBody: RequestData): Promise<ResponseData | { error: unknown }> => {
  // Logical block: Use a try-catch block to handle potential errors during the request.
  try {
    // Logical block: Attempt to retrieve local service data from storage.
    const localService = await storage.getItem("local:service");

    // Logical block: If local service data exists, add it to the request body.
    if (localService) {
      requestBody.service = localService;
    }

    // Logical block: Make a POST request to the API URL using axios.
    // Specify the expected response data structure.
    const response = await axios.post<{ service: object; data: ResponseData }>(apiUrl, requestBody);

    // Logical block: Destructure the response data to get service and data.
    const { service, data } = response.data;

    // Logical block: If no data is present in the response, return an error object.
    if (!data) return { error: "no data" };

    // Logical block: If service data is present in the response, update the local service storage.
    if (service) {
      await storage.setItem("local:service", service);
    }

    // Logical block: If 'folders' are in the response data, update the local folders storage.
    if ("folders" in data) {
      await storage.setItem("local:folders", data.folders);
    }

    // Logical block: If 'tasks' are in the response data, handle the new tasks using the handleNewTasks function.
    if ("tasks" in data) {
      await handleNewTasks(data.tasks);
    }

    // Logical block: If 'locale' is in the response data, update the local locale storage.
    if ("locale" in data) {
      await storage.setItem("local:locale", data.locale);
    }

    // Logical block: If 'url_icon' is in the response data, update the local url_icon storage.
    if ("url_icon" in data) {
      await storage.setItem("local:url_icon", data.url_icon);
    }

    // Logical block: If 'region' is in the response data, update the region setting in local storage.
    if ("region" in data) {
      const settings = await storage.getItem("local:settings");
      await storage.setItem("local:settings", { ...(settings as {}), region: data.region });
    }

    // Logical block: If 'contactUrl' is in the response data, update the contactUrl setting in local storage.
    if ("contactUrl" in data) {
      const settings = await storage.getItem("local:settings");
      await storage.setItem("local:settings", { ...(settings as {}), contactUrl: data.contactUrl });
    }

    // Logical block: Return the data received in the response.
    return data;
  } catch (error: unknown) {
    // Logical block: Catch any errors that occurred during the try block.
    // If the error is an instance of Error, throw a new error with the original message.
    if (error instanceof Error) {
      throw new Error(error?.message);
    } else {
      // If the error is not an Error instance, throw a generic error message.
      throw new Error("Something went wrong in makeRequest");
    }
  }
};
