import { CiBoxList } from "react-icons/ci";
// Import the list icon from react-icons.
import { GoPlus } from "react-icons/go";
// Import the plus icon from react-icons.

// Define the structure for a LinkObject, representing a link with its associated data.
interface LinkObject {
  url: string;
  html: string;
  title: string;
}

// Define the props for the FloatingButton component.
interface FloatingButtonProps {
  // Function to call when the popup toggle button is clicked.
  onTogglePopup: () => void;
  // Function to call when the add link button is clicked, passing the LinkObject.
  onAddLink: (link: LinkObject) => void;
}

// FloatingButton functional component.
const FloatingButton: React.FC<FloatingButtonProps> = ({ onTogglePopup, onAddLink }) => {
  // Function to create a LinkObject from the current page's information and call the onAddLink prop.
  const addLink = () => {
    // Create a LinkObject with the current URL, document inner HTML, and document title.
    onAddLink({
      url: location?.href,
      html: document.body.innerHTML,
      title: document.title,
    });
  };
  
  // Logical block: Render the floating button container and the two buttons.
  return (
    // Container div for the floating buttons.
    <div className="" style={buttonCntStyles}>
      {/* Button to toggle the popup. */}
      <button className="" onClick={onTogglePopup} style={{ ...buttonStyles, backgroundColor: "black" }}>
        {/* List icon for the toggle button. */}
        <CiBoxList size={28} />
      </button>
      {/* Button to add the current page as a link. */}
      <button className="" onClick={addLink} style={{ ...buttonStyles, backgroundColor: "#3faf2a" }}>
        {/* Plus icon for the add link button. */}
        <GoPlus size={28} />
      </button>
    </div>
  );
};

// Define the common styles for the buttons.
const buttonStyles: React.CSSProperties = {
  backgroundColor: "#df4755",
  border: "none",
  borderRadius: ".5rem",
  padding: "0.2rem 0.3rem",
  color: "white",
  cursor: "pointer",
  outline: "none",
};

// Define the styles for the floating button container.
const buttonCntStyles: React.CSSProperties = {
  position: "fixed",
  right: 0,
  top: "50%",
  zIndex: 9999999,
  display: "flex",
  flexDirection: "column",
  gap: ".5rem",
  backgroundColor: "white",
  boxShadow: "0 0 10px 5px #0000001c",
  padding: "4px",
  borderRadius: ".5rem",
};

// Export the FloatingButton component.
export default FloatingButton;
