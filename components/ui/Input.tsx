import { ChangeEvent } from "react";
// Import the ChangeEvent type from React.
import React from "react";
// Import React.

// Define the interface for the Input component's props.
interface InputProps {
  label: string;
  // The label text for the input field.
  placeholder: string;
  // The placeholder text for the input field.
  value: string;
  // The current value of the input field.
  disabled?: boolean;
  // Optional boolean to disable the input field.
  required?: boolean;
  // Optional boolean to mark the input field as required.
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  // Function to call when the input value changes, receiving the change event.
}

// The Input functional component.
const Input: React.FC<InputProps> = ({ label, placeholder, value, disabled, required, onChange }) => {
  // Logical block: Render the input container and elements.
  return (
    // Container div with flex column layout.
    <div className="flex flex-col">
      {/* Label for the input field. */}
      <label className="block font-medium text-sm">{label}</label>
      {/* Input element. */}
      <input
        className="border border-neutral-300 rounded h-8 focus:outline-0 focus:ring-1 ring-sky-300 px-2 w-full text-sm"
        type="text"
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        required={required}
        onChange={onChange}
      />
    </div>
  );
};

// Export the Input component as the default export.
export default Input;
