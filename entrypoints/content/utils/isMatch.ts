import { matchesStore } from "@/store/matches";
// Import the matchesStore for accessing stored URL patterns.

// Async function to check if a given URL matches any of the stored patterns.
// Takes a URL string as input.
export const isMatch = async (url: string) => {
  // Logical block: Retrieve the array of allowed URL patterns from the matches store.
  const allowedUrls = await matchesStore.getValue();
  // Logical block: Use the .some() array method to check if at least one allowed URL pattern matches the input URL.
  // A new RegExp object is created for each allowed URL pattern to perform the test.
  return allowedUrls?.some((allowedUrl) => new RegExp(allowedUrl).test(url));
};
