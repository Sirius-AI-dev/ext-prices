// Define the interface for the ListItem component's props.
interface ListItemProps {
  text: string;
  // The text content to display in the list item.
}

// The ListItem functional component.
const ListItem: React.FC<ListItemProps> = ({ text }) => {
  // Logical block: Render the list item div.
  return (
    // Div element with styling for a list item.
    <div className="bg-white rounded-2xl p-2 text-sm font-normal">{text}</div>
  );
};

// Export the ListItem component as the default export.
export default ListItem;
