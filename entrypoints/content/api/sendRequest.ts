// Async function to send a request from the content script to the background script.
// This function is a wrapper around browser.runtime.sendMessage for sending requests.
// It takes a payload of unknown type as input.
export const sendRequest = async (payload: unknown) => {
  // Logical block: Send a message of type 'makeRequest' to the extension's runtime (background script).
  // The payload contains the actual data and key for the request.
  const response = await browser.runtime.sendMessage({ type: "makeRequest", payload });

  // Logical block: Check if the response object contains an 'error' property.
  if ("error" in response) {
    // Logical block: If an error is indicated in the response, throw a new Error with the error message.
    return new Error(response.error);
  }

  // Logical block: If no error is present, return the successful response.
  return response;
};
