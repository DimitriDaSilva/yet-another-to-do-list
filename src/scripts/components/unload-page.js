import { saveTasks } from "./task-save.js";
import { sortTasks } from "./task-sort.js";
import { darkMode } from "./dark-mode.js";
import { filterMode } from "./filter.js";

// Before closing the tab, load the info on the localStorage
window.addEventListener("beforeunload", () => {
  const savedTasks = saveTasks();
  const sortedTasks = sortTasks(savedTasks);

  localStorage.setItem("tasks", JSON.stringify(sortedTasks));
  localStorage.setItem("darkMode", darkMode);
  localStorage.setItem("filterMode", filterMode);
});