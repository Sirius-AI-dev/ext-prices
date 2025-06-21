import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
// Define the configuration for the WXT extension build.
export default defineConfig({
  // Specify the modules to be used, in this case, the React module.
  modules: ["@wxt-dev/module-react"],
  // Define the extension manifest properties.
  manifest: {
    // Set the name of the extension.
    name: "Price extension",
    // Define the permissions required by the extension.
    permissions: ["storage", "alarms", "activeTab", "scripting"],
    // Configure the browser action (the extension icon in the toolbar).
    action: {},
    // Define host permissions to allow the extension to interact with specified URLs.
    host_permissions: ["<all_urls>"],
    // Define resources that are accessible by web pages.
    web_accessible_resources: [
      {
        // Specify the resource file.
        resources: ["content-injector.js"],
        // Define which URLs can access this resource.
        matches: ["<all_urls>"],
      },
      {
        // Specify another resource file.
        resources: ["htmlGetter.js"],
        // Define which URLs can access this resource.
        matches: ["<all_urls>"],
      },
    ],
  },
});
