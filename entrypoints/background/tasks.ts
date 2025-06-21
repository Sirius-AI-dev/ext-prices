import { Task } from "@/types";
// Import the Task interface definition.
import { taskStore } from "@/store";
// Import the taskStore for managing tasks in persistent storage.
import { QueueController } from "./QueueController";
// Import the QueueController class for managing the task processing queue.

// Get the debug mode status from environment variables.
const debugMode = import.meta.env.WXT_DEBUG;

// Async function to handle and update tasks based on a new list of tasks.
// It compares new tasks with existing local tasks, updates periods, adds new tasks, and saves changes.
export const handleNewTasks = async (newTasks: Task[]) => {
  // Logical block: Get the current list of tasks from the task store.
  const localTasks = await taskStore.getValue();
  // Initialize an array to hold tasks that have been changed or are new.
  const changedTasks: Task[] = [];

  // Logical block: Iterate through the new tasks received.
  newTasks.forEach((newTask) => {
    // Logical block: Try to find if a local task with the same ID already exists.
    const localTask = localTasks.find((localTask) => localTask.id === newTask.id);

    // Logical block: If a local task exists with the same ID...
    if (localTask) {
      // Logical block: Check if the period of the local task is different from the new task.
      if (localTask.period != newTask.period) {
        // Logical block: If the period has changed, update the local task's period.
        localTask.period = newTask.period;
      }
      
      // Add the (potentially updated) local task to the list of changed tasks.
      changedTasks.push(localTask);
    } else {
      // Logical block: If no local task exists with the same ID (it's a new task)...
      // Add the new task to the changed tasks, initializing its 'updateIn' property with its period.
      changedTasks.push({ ...newTask, updateIn: newTask.updateIn ?? newTask.period });
    }
  });

  // Logical block: Save the updated list of tasks (including new and modified ones) back to the task store.
  await taskStore.setValue(changedTasks);

  // Return the array of tasks that were either new or had their period updated.
  return changedTasks;
};

// Async function to check existing tasks and add tasks to the queue if their update time is due.
// Takes the time interval since the last check (in minutes) and the QueueController instance.
export const checkTasks = async (intervalInMin: number, queueController: QueueController) => {
  // Log that the task checking process is starting.
  console.log(`checking tasks`);

  // Logical block: Get the current list of tasks from the task store.
  const tasks = await taskStore.getValue();
  // Initialize an array to hold tasks after the check (with updated 'updateIn' values).
  const updatedTasks: Task[] = [];

  // Logical block: Conditional logic based on whether debug mode is enabled.
  if (debugMode) {
    // Logical block (Debug Mode): Iterate through all tasks.
    tasks.forEach(async (task) => {
      // Add every task to the queue immediately in debug mode.
      queueController.add(task);
      // Add the task to the updated tasks list.
      updatedTasks.push(task);
    });
  } else {
    // Logical block (Normal Mode): Iterate through all tasks.
    tasks.forEach(async (task) => {

      // if updateIn is less than 0, then skip this task. It will be removed in the next readTasks() call
      if (task.updateIn! >= 0) {

        // Logical block: Decrease the task's 'updateIn' time by the interval converted to milliseconds.
        task.updateIn! -= intervalInMin * 60000;

        // Logical block: Check if the task's update time is due (updateIn is less than or equal to 0).
        if (task.updateIn! < 0) {
          // Logical block: If due, add the task to the processing queue.
          queueController.add(task);

          // Logical block: Reset the task's 'updateIn' time to its full period if period > 0
          if (task.period > 0) {
            task.updateIn = task.period;
          }
        }
      }

      // Add the task (with updated 'updateIn') to the updated tasks list.
      updatedTasks.push(task);
    });
  }

  // Logical block: Save the tasks with their updated 'updateIn' values back to the task store.
  await taskStore.setValue(updatedTasks);

  // Return the array of tasks with updated 'updateIn' values.
  return updatedTasks;
};
