// Set listeners
const newTask = document.querySelector("#add-new-task__input");
const addTaskBtn = document.querySelector("#add-new-task__button");
const clearCompletedBtn = document.querySelector("#tasks__header__button");
const taskList = document.querySelector("#tasks__list");
const taskTemplate = document.querySelector("#task-template");

// Set the index of the first task
let id = 1;

// Add a task after pressing "Enter"
newTask.addEventListener("keyup", (e) => {
  if (e.keyCode == 13 && newTask.value != "") {
    addTask(newTask.value);
  }
});

// Add a task after pressing the custom button
addTaskBtn.addEventListener("click", () => {
  if (newTask.value != "") {
    addTask(newTask.value);
  }
});

// Add a task with DOM manipulation
// After function execution, text from input form deleted and new id created
function addTask(taskString, taskCheck = false) {
  const taskElement = document.importNode(taskTemplate.content, true);
  const checkbox = taskElement.querySelector("input");
  const label = taskElement.querySelector("label");
  const cross = taskElement.querySelectorAll(".task-template__item__cross");

  cross[0].id = id;
  checkbox.id = id;

  // Making sure that the check animation doesn't restart onload page
  if (taskCheck) {
    const checkCustom = label.querySelector("svg");
    const path = checkCustom.querySelector("path");
    path.style.strokeDashoffset = 0;
    checkbox.checked = taskCheck;
  } else {
    checkbox.checked = taskCheck;
  }

  label.htmlFor = id;

  const textPlace = taskElement.querySelector("p");
  textPlace.append(taskString);
  taskList.appendChild(taskElement);

  newTask.value = "";
  id++;
}

clearCompletedBtn.addEventListener("click", () => {
  const tasks = document.querySelectorAll(".task-template__item");
  tasks.forEach((task) => {
    const checked = task.querySelector("input").checked;
    if (checked) {
      task.remove();
    }
  });
});

// Before closing the tab, load the info on the localStorage
window.addEventListener("beforeunload", () => {
  // Clear previous cache
  localStorage.clear();

  // Set the array where we'll store the objects with task info
  let tasksArray = [];

  let liElements = document.getElementsByTagName("li");

  for (let i = 0; i < liElements.length; i++) {
    // Get check info
    let input = liElements[i].querySelector("input");
    let checkedItem = input.checked;

    // Get task text
    let text = liElements[i].querySelector("p");
    let taskItem = text.outerText;

    let allItems = {
      checked: checkedItem,
      task: taskItem,
    };

    tasksArray.push(allItems);
  }

  localStorage.setItem("tasks", JSON.stringify(tasksArray));
});

// Onload, download the info from the localStorage
window.addEventListener("load", () => {
  const data = JSON.parse(localStorage.getItem("tasks"));
  data.forEach((item) => {
    addTask(item.task, item.checked);
  });
});

// Set a mutation observer so that the eventListeners are up to date with the current crosses and the drag-and-drop symbols

// We are only observing if a task (i.e. a li element) gets added or deleted
const config = { attributes: true, childList: true };

// Callback function to execute when mutation are observed
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      setListenersCrosses();
      makeElementsDraggable();
    }
  }
};

// Create the observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start checking for DOM tree mutations
observer.observe(taskList, config);

// Set a loop listening to all crosses
function setListenersCrosses() {
  let crossDeleteBtns = document.getElementsByClassName(
    "task-template__item__cross"
  );
  for (let i = 0; i < crossDeleteBtns.length; i++) {
    let cross = crossDeleteBtns[i];
    cross.addEventListener("click", () => {
      let crossId = cross.id;
      const tasks = document.querySelectorAll(".task-template__item");
      tasks.forEach((task) => {
        const inputId = task.querySelector("input").id;
        if (inputId == crossId) {
          task.remove();
        }
      });
    });
  }
}

// Make elements draggable
function makeElementsDraggable() {
  const tasks = document.querySelectorAll(".task-template__item");

  tasks.forEach((task) => {
    const dragLogo = task.querySelector(".task-template__item__drag");
    task.addEventListener("dragstart", function (e) {
      task.classList.add("task-template__item--dragging");
      dragLogo.classList.add("task-template__item--ongoing-drag");
    });

    task.addEventListener("dragend", () => {
      task.classList.remove("task-template__item--dragging");
      dragLogo.classList.remove("task-template__item--ongoing-drag");
    });
  });
}

taskList.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(taskList, e.clientY);
  const task = document.querySelector(".task-template__item--dragging");
  taskList.insertBefore(task, afterElement);
});

function getDragAfterElement(container, y) {
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
