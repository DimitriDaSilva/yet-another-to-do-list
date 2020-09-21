import { filterMode, filters } from "./filter.js";
import { getParentElement } from "../utils.js";

const tasksContainer = document.querySelector("#tasks");

// Make elements draggable
export function makeElementsDraggable() {
  const tasks = document.querySelectorAll(".task-template__item");

  tasks.forEach((task) => {
    // dragLogo is the 6-dots logo representing the UI elements for drag-and-drop
    // Its default behaviour was not logical, so I fixed it
    // It's being called in both startDragStyle and endDragStyle so I'm setting it before so that it doesn't run twice
    const dragLogo = task.querySelector(".task-template__item__drag");

    // Set the style of the task while it's being dragged
    // Handle the behaviour for touch-based devices
    let touchTimeout;

    task.addEventListener("touchstart", (e) => {
      touchTimeout = setTimeout(() => {
        task.draggable = true;
        document.body.classList.add("stop-scroll");
        task.classList.add("task-template__item--dragging");
        dragLogo.classList.add("task-template__item--ongoing-drag");
      }, 200);
    });

    task.addEventListener("touchend", () => {
      clearTimeout(touchTimeout);
      updateTaskColor(task);
      task.draggable = false;
      document.body.classList.remove("stop-scroll");
      task.classList.remove("task-template__item--dragging");
      dragLogo.classList.remove("task-template__item--ongoing-drag");
    });

    // Set the style of the task while it's being dragged
    // Handle the behaviour for mouse-based devices
    task.addEventListener("mousedown", () => {
      task.draggable = true;
    });

    task.addEventListener("dragstart", () => {
      task.classList.add("task-template__item--dragging");
      dragLogo.classList.add("task-template__item--ongoing-drag");
    });

    task.addEventListener("dragend", () => {
      updateTaskColor(task);
      task.classList.remove("task-template__item--dragging");
      dragLogo.classList.remove("task-template__item--ongoing-drag");
      task.draggable = false;
    });
  });
}

// For touch-based devices
tasksContainer.addEventListener("touchmove", (e) => {
  const myLocation = e.targetTouches[0];
  const target = document.elementFromPoint(myLocation.pageX, myLocation.pageY);
  if (target !== null) {
    const targetUl = getParentElement(target, "UL");
    if (targetUl.tagName === "UL") {
      if (e.cancelable) {
        e.preventDefault();
      }
      const touchY = e.targetTouches[0].pageY;
      const afterElement = getDragAfterElement(targetUl, touchY);
      const task = document.querySelector(".task-template__item--dragging");
      if (afterElement === null) {
        targetUl.appendChild(task);
      } else {
        targetUl.insertBefore(task, afterElement);
      }
    }
  }
});

// For mouse-based devices
tasksContainer.addEventListener("dragover", (e) => {
  const target = document.elementFromPoint(e.clientX, e.clientY);
  if (target !== null) {
    const targetUl = getParentElement(target, "UL");
    if (targetUl.tagName === "UL") {
      e.preventDefault();
      const afterElement = getDragAfterElement(targetUl, e.clientY);
      const task = document.querySelector(".task-template__item--dragging");
      if (afterElement === null) {
        targetUl.appendChild(task);
      } else {
        targetUl.insertBefore(task, afterElement);
      }
    }
  }
});

// Function that actually returns the tasks over which the user hovers with the dragged element
// Credit to Web Dev Simplified's YouTube channel for this sweet piece of code
export function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(
      ".task-template__item:not(.task-template__item--dragging)"
    ),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

// Modify the category of the task upon drop and change its color
function updateTaskColor(task) {
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
