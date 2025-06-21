import { changeSetting, settingsStore } from "@/store";
// Import functions and stores related to settings: changeSetting function and settingsStore.
import Button from "./Button";
// Import the Button UI component.
import { toast } from "sonner";
// Import the toast notification library.
import { useState, useEffect } from "react";
// Import useState and useEffect hooks from React.

// Define the interface for the RegisterBlock component's props.
interface RegisterBlockProps {
  // onClose?: () => void; // Currently commented out
}

// Define the interface for the Settings state used within this component.
interface Settings {
  registered: boolean;
  // Boolean indicating if the user is registered.
}

// The RegisterBlock functional component.
const RegisterBlock: React.FC<RegisterBlockProps> = () => {
  // State variable to hold the current settings.
  const [settings, setSettings] = useState<Settings>();

  // Effect hook to load initial settings when the component mounts.
  useEffect(() => {
    // Define an async function to fetch settings.
    (async () => {
      // Logical block: Fetch settings from the settings store.
      const settings = await settingsStore.getValue();
      // Update the settings state.
      setSettings(settings);
    })();
  }, []); // Empty dependency array means this effect runs once on mount.

  // Logical block: Watch for changes in the settings store and update the settings state.
  // The unwatch function is returned to clean up the watcher when the component unmounts.
  const unwatch = settingsStore.watch((settings) => {
    setSettings(settings);
  });

  // Async function to handle the registration process.
  const onRegister = async () => {
    // Logical block: Call the changeSetting function to update the 'registered' setting to true.
    await changeSetting({ registered: true });
    // Logical block: Display a success toast notification.
    toast.success("Discount Extension", { description: "You have successfuly registered" });
  };

  // Logical block: Render the registration block UI.
  return (
    // Use a React Fragment to group elements without adding an extra node to the DOM.
    <>
      {/* Conditional rendering: Display the registration block only if the user is NOT registered. */}
      {!settings?.registered && (
        // Container div for the registration message and button.
        <div className="flex flex-col gap-2 mt-2 border border-[#f7b3b5] p-4 rounded bg-[#ff000014]">
          {/* Registration message text. */}
          <span className="text-xs text-black">
            You are not registered yet. It's free. Please register to unlock all features.
          </span>
          {/* Register button. */}
          <Button secondary onClick={onRegister}>
            Register
          </Button>
        </div>
      )}
    </>
  );
};

// Export the RegisterBlock component as the default export.
export default RegisterBlock;
