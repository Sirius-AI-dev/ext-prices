// Async function to check if the current tab is the parser tab.
// This function sends a message to the background script to perform the check.
export const isParserTab = async () => {
  // Logical block: Send a message of type 'isParserTab' to the extension's runtime (background script).
  // The background script will determine if the sender's tab is the parser tab and send back the result.
  return await browser.runtime.sendMessage({ type: "isParserTab" });
};
