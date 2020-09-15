import { getParentElement } from "../utils.js";
import { filterMode, filters } from "./filter.js";

// MOdify the category of the task upon drop and change its color
export function updateTask(task) {
  const detailsEl = getParentElement(task, "DETAILS");

  // Modify its category
  const groupName = detailsEl.classList.item(1);
  let classToBeReplaced = "";

  if (filterMode === filters[0]) {
    classToBeReplaced = task.classList.item(1);
  } else {
    classToBeReplaced = task.classList.item(2);
  }

  task.classList.replace(classToBeReplaced, groupName);

  // Update the color
  const strokeColor = detailsEl.classList.item(2);
  const checkboxEl = task.querySelector(
    ".task-template__item__custom-checkbox"
  );
  checkboxEl.style.background = strokeColor;
}
