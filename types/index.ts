// Define the interface for an Item.
export interface Item {
  discount: number;
  // The discount value for the item.
  id: string;
  // A unique identifier for the item.
  name: string;
  // The name of the item.
  price: number;
  // The price of the item.
  url: string;
  // The URL where the item can be found.
}

// Define the interface for a Folder.
export interface Folder {
  discount: number;
  // The total discount for items within this folder.
  id: string;
  // A unique identifier for the folder.
  items: Item[];
  // An array of Item objects contained within this folder.
  itemCnt: number;
  // The count of items in the folder.
  name: string;
  // The name of the folder.
  timer: string; // "16:25"
  // A string representing a timer, possibly for updates.
}

// Define the interface for a Task.
export interface Task {
  id: string;
  // A unique identifier for the task.
  period: number; // in seconds
  // The period (in seconds) for the task to be performed.
  url: string;
  // The URL associated with the task.
  updateIn?: number;
  // Optional property indicating time until the next update (in seconds).
}

// Define the interface for Locale, essentially a key-value pair for localization strings.
export interface Locale {
  [key: string]: string;
  // Allows any string key with a string value.
}
