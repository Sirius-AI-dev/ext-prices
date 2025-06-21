import { changeSetting, settingsStore } from "@/store";
// Import functions and stores related to settings: changeSetting function and settingsStore.
import Button from "./ui/Button";
// Import the Button UI component.
import RegisterBlock from "./ui/RegisterBlock";
// Import the RegisterBlock component.
import { useState } from "react";
// Import the useState hook from React for managing component local state.

// Define the props for the WelcomePopup component.
interface WelcomePopupProps {
  onClose: () => void;
  // Function to call when the welcome popup should be closed.
}

// The WelcomePopup functional component.
const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  // State variable to track whether the user wants to hide the welcome screen in the future.
  const [noWelcome, setNoWelcome] = useState(false);

  // Function to handle the submission of the welcome popup.
  const handleSubmit = async () => {
    // Logical block: If the user checked the 'Do not show again' box, update the setting.
    if (noWelcome) {
      await changeSetting({ welcomePopup: false });
    }
    // Call the onClose function to close the popup.
    onClose();
  };

  // Logical block: Render the welcome popup UI.
  return (
    // Use a React Fragment to group elements without adding an extra node to the DOM.
    <>
      {/* Description text for the extension. */}
      <p className="text-sm font-normal text-neutral-500">
        This extension lets you track prices on any websites and get notifications on price changes
      </p>
      {/* Render the RegisterBlock component. */}
      <RegisterBlock />
      {/* Container for the 'Do not show again' checkbox and label. */}
      <div className="flex gap-2">
        {/* Checkbox input. */}
        <input
          className="cursor-pointer"
          type="checkbox"
          checked={noWelcome}
          onChange={(e) => setNoWelcome(e.target.checked)}
        />
        {/* Label for the checkbox. */}
        <label className="text-xs text-normal text-neutral-500">Do not show welcome screen again</label>
      </div>
      {/* Button to submit the welcome popup and close it. */}
      <Button onClick={handleSubmit}>Got It!</Button>
    </>
  );
};

// Export the WelcomePopup component as the default export.
export default WelcomePopup;
