import Button from "./ui/Button";
// Import the Button UI component.
import Input from "./ui/Input";
// Import the Input UI component (currently commented out in JSX).
import { changeSetting, folderStore, settingsStore } from "@/store";
// Import store-related functions and stores: changeSetting function, folderStore, and settingsStore.
import { useState } from "react";
// Import the useState hook from React for managing component local state.
import { IoIosClose } from "react-icons/io";
// Import the close icon from react-icons (currently not used in JSX).
import { useEffect } from "react";
// Import the useEffect hook from React for performing side effects.
import { Folder } from "@/types";
// Import the Folder type definition.
import ListItem from "./ui/ListItem";
// Import the ListItem UI component.
import { isMatch } from "@/entrypoints/content/utils";
// Import the isMatch utility function from content scripts.
import { addItem } from "@/entrypoints/content/api";
// Import the addItem API function from content scripts (commented out in code, but used via message).
import RegisterBlock from "./ui/RegisterBlock";
// Import the RegisterBlock component.

// Define the props for the Popup component.
interface PopupProps {
  onClose?: () => void;
  // Optional function to call when the popup should be closed.
  embedded?: boolean;
  // Optional boolean indicating if the popup is embedded (e.g., in a sidebar) or a standard browser popup.
}

// Define the structure for the Settings state.
interface Settings {
  registered: boolean;
  // Boolean indicating if the user is registered.
}

// The main Popup functional component.
const Popup: React.FC<PopupProps> = ({ onClose, embedded }) => {
  // State variable to hold input value (currently not used in JSX input).
  const [input, setInput] = useState("");
  // State variable to hold the list of folders.
  const [folders, setFolders] = useState<Folder[]>([]);
  // State variable to hold user settings.
  const [settings, setSettings] = useState<Settings>();
  // State variable to indicate if the current domain matches a registered pattern.
  const [match, setMatch] = useState(false);

  // Effect hook to load initial data when the component mounts.
  useEffect(() => {
    // Define an async function to fetch data.
    (async () => {
      // Logical block: Fetch folders from the folder store.
      const folders = await folderStore.getValue();
      // Update the folders state.
      setFolders(folders);

      // Logical block: Fetch settings from the settings store.
      const settings = await settingsStore.getValue();
      // Update the settings state.
      setSettings(settings);

      // Logical block: Determine the current URL.
      let href = location.href;

      // If not embedded, get the active tab URL via a message to the background script.
      if (!embedded) {
        href = await browser.runtime.sendMessage({ type: "getActiveTabUrl" });
      }

      // Logical block: Check if the current URL matches a registered pattern.
      const match = await isMatch(href);
      // Update the match state.
      setMatch(match);
    })();
  }, []); // Empty dependency array means this effect runs once on mount.

  // Logical block: Watch for changes in the folder store and update the folders state.
  const unwatchFolders = folderStore.watch((value) => {
    setFolders(value);
  });

  // Logical block: Watch for changes in the settings store and update the settings state.
  const unwatchSettings = settingsStore.watch((value) => {
    setSettings(value);
  });

  // Function to handle adding a link.
  const addLink = () => {
    // If not embedded, send a message to the background script to trigger the addItem action.
    if (!embedded) {
      browser.runtime.sendMessage({ type: "addItem" });
    }
  };

  // Logical block: Render the popup UI.
  return (
    // Main container div with flex column layout and gap.
    <div className="flex flex-col gap-2">
      {/* Conditional rendering: Display a warning if the domain is not matched. */}
      {!match && (
        <div>
          <span>⚠️ Domain is not registered. But you can track it anyway.</span>
        </div>
      )}

      {/* Conditional rendering: Display 'Track Product' or 'Start Tracking Anyway' button based on 'match' and 'embedded' state. */}
      {/* {!embedded && <Button onClick={addLink}>Start Tracking</Button>} */}
      {!embedded && match && <Button onClick={addLink}>Track Product</Button>}
      {!embedded && !match && <Button onClick={addLink}>Start Tracking Anyway</Button>}

      {/* Container for the list of tracked folders/links with max height and overflow. */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-auto">
        {/* Map through the folders array and render a ListItem for each folder. */}
        {folders.map((folder) => (
          <ListItem key={folder.id} text={folder.name} />
        ))}

        {/* Conditional rendering: Display a message if there are no tracked folders/links. */}
        {!folders.length && (
          <span className="text-neutral-400 text-sm font-normal mt-4">
            Your tracked links will be here. Press 'Start Tracking' on a product page that you want to track
          </span>
        )}
      </div>
      {/* Input component (commented out). */}
      {/* <Input
          label="Label"
          placeholder="Please enter a value"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        /> */}

      {/* Conditional rendering: Display the RegisterBlock component if the user is not registered. */}
      {!settings?.registered && <RegisterBlock />}
    </div>
  );
};

// Export the Popup component as the default export.
export default Popup;
