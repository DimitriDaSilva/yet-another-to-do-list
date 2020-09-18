import { saveTasks } from "./task-save.js";
import { sortTasks } from "./task-sort.js";
import { darkMode } from "./dark-mode.js";
import { filterMode } from "./filter.js";
import { colorPairs } from "./category-color.js";

// Before closing the tab, load the info on the localStorage
export function setUnloadListener() {
  window.addEventListener("beforeunload", unloadPage);
}

function unloadPage() {
  const savedTasks = saveTasks();
  const sortedTasks = sortTasks(savedTasks);

  localStorage.setItem("tasks", JSON.stringify(sortedTasks));
  localStorage.setItem("darkMode", darkMode);
  localStorage.setItem("filterMode", filterMode);
  localStorage.setItem("colorPairs", JSON.stringify(colorPairs));
}
