// Define the interface for an object to be stored in the queue.
interface QueueObject {
  id: string;
  // A unique identifier for the item in the queue.
}

// Controller class to manage a queue of tasks or items.
export class QueueController {
  // Private array to store the queue items.
  private _queue: QueueObject[] = [];
  // Private boolean flag to indicate if the controller is currently processing an item.
  private isBusy: boolean = false;
  // Private function that will be called to process each item from the queue.
  private parseFn: (queueObject: QueueObject) => void;
  // Private variable to hold the current item being processed.
  private _currentItem: QueueObject | null = null;

  // Constructor for the QueueController.
  // Takes a function `parseFn` as an argument, which is the function to execute for each queue item.
  constructor(parseFn: (queueObject: QueueObject) => void) {
    // Initialize the parseFn with the provided function.
    this.parseFn = parseFn;
  }

  // Private method to process the next item in the queue.
  private next() {
    // Logical block: Check if the controller is not currently busy.
    if (!this.isBusy) {
      // Logical block: Remove and get the first item from the queue array.
      const nextItem = this._queue.shift();

      // Logical block: Check if there is a next item in the queue.
      if (nextItem) {
        // Log message indicating switching to the next item.
        console.log(`switching to next item in queue`);
        // Log the current state of the queue.
        console.log({ currentQueue: this._queue });

        // Logical block: Set the current item to the next item.
        this._currentItem = nextItem;
        // Logical block: Call the parse function with the current item.
        this.parseFn(nextItem);
        // Logical block: Set isBusy flag to true as processing begins.
        this.isBusy = true;
      }
    }
  }

  // Public method to add an item to the queue.
  // Takes a QueueObject as an argument.
  add(queueObject: QueueObject) {
    // Logical block: Check if the item with the same id is already in the queue.
    if (!this._queue.find((item) => item.id === queueObject.id)) {
      // Logical block: If not already in queue, add the item to the end of the queue.
      this._queue.push(queueObject);
      // Log message indicating adding an item.
      console.log(`adding an item to queue`);
      // Log the current state of the queue.
      console.log({ currentQueue: this._queue });
    } else {
      // Log message if the item is already in the queue.
      console.log(`item already in queue`);
      // Log the current state of the queue.
      console.log({ currentQueue: this._queue });
    }

    // Logical block: If the controller is not busy, immediately start processing the next item.
    if (!this.isBusy) {
      this.next();
    }
  }

  // Public method to signal the completion of processing the current item.
  finish() {
    // Logical block: Set isBusy flag to false as processing finishes.
    this.isBusy = false;
    // Logical block: Clear the current item.
    this._currentItem = null;

    // Logical block: Set a timeout to process the next item after a delay (e.g., 5 seconds).
    setTimeout(() => {
      this.next();
    }, 5000);
  }

  // Getter property to get the current item being processed.
  get currentItem() {
    return this._currentItem;
  }

  // Getter property to get the current state of the queue.
  get queue() {
    return this._queue;
  }
}
