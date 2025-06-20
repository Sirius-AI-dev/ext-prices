import clsx from "clsx";
// Import the clsx library for conditionally joining class names.
import React from "react";
// Import React.

// Define the interface for the Button component's props.
interface ButtonProps {
  children: string;
  // The content of the button (text).
  secondary?: boolean;
  // Optional boolean to apply secondary styling.
  disabled?: boolean;
  // Optional boolean to disable the button.
  onClick: () => void;
  // Function to call when the button is clicked.
}

// The Button functional component.
const Button: React.FC<ButtonProps> = ({ children, secondary, disabled, onClick }) => {
  // Logical block: Render the button element.
  return (
    // Button element with dynamic class names based on props.
    <button
      className={clsx(
        // Base classes for the button.
        `w-full rounded cursor-pointer h-8 text-sm`,
        // Conditional classes based on the 'secondary' prop.
        secondary
          ? "border border-neutral-300 bg-[#454545] text-white hover:bg-[#555555]"
          : "bg-green-500 text-white hover:bg-green-400"
      )}
      // Set the disabled attribute based on the 'disabled' prop.
      disabled={disabled}
      // Assign the onClick handler.
      onClick={onClick}
    >
      {/* Render the children (button text). */}
      {children}
    </button>
  );
};

// Export the Button component as the default export.
export default Button;
