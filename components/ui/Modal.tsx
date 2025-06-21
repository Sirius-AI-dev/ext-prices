import { ReactNode } from "react";
// Import the ReactNode type from React.
import { IoIosClose } from "react-icons/io";
// Import the close icon component.
import React from "react";
// Import React.

// Define the interface for the Modal component's props.
interface ModalProps {
  title: string;
  // The title text for the modal header.
  children: ReactNode;
  // The content to be rendered inside the modal body.
  onClose?: () => void;
  // Optional function to call when the close button is clicked.
}

// The Modal functional component.
const Modal: React.FC<ModalProps> = ({ onClose, children, title }) => {
  // Logical block: Render the modal container and its contents.
  return (
    // Main container div for the modal with fixed width, min height, padding, background, and rounded corners.
    <div className="w-[300px] min-h-[200px] p-4 bg-[#EDF0F8] rounded relative">
      {/* Conditional rendering: Render the close button only if an onClose function is provided. */}
      {onClose && (
        // Container div for positioning the close button.
        <div className="flex justify-end absolute top-2 right-2">
          {/* Button to trigger the onClose function. */}
          <button className="bg-none border-0 cursor-pointer hover:bg-neutral-100 rounded" onClick={onClose}>
            {/* Close icon. */}
            <IoIosClose size={20} color="grey" />
          </button>
        </div>
      )}

      {/* Modal title header. */}
      <h1 className="text-lg text-black font-semibold leading-6">{title}</h1>

      {/* Container div for the modal content with top margin, flex column layout, and gap. */}
      <div className="mt-4 flex flex-col gap-2">{children}</div>
    </div>
  );
};

// Export the Modal component as the default export.
export default Modal;
