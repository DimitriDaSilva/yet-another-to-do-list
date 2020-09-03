// Select buttons
const addTaskBtn = document.querySelector("#add-new-task__button");
const clearCompletedBtn = document.querySelector("#buttons__clear");
const filterBtn = document.querySelector("#buttons__filter");
const darkModeBtn = document.querySelector("#top-section__dark-mode");
const reloadBackgroundBtn = document.querySelector("#top-section__reload");

// Select input value
const newTask = document.querySelector("#add-new-task__input");
const categoryInput = document.querySelector("#add-new-task__category__input");
const urgencyInput = document.querySelector("#add-new-task__urgency__input");

// Select the div where the tasks will go and the templates
const tasksContainer = document.querySelector("#tasks");
const taskListTemplate = document.querySelector("#task-list-template");
const taskTemplate = document.querySelector("#task-template");

// Set the arrays with the categories and levels of urgency
let categoryArray = [];
let urgencyArray = [];

// Set the index of the first task
let id = 1;

// Handling the filter
const filters = ["category", "urgency"];
let filterMode = "";
filterBtn.addEventListener("click", () => {
  if (filterMode == filters[0]) {
    filterMode = filters[1];
    filterBtn.textContent = "Filter by category";
  } else {
    filterMode = filters[0];
    filterBtn.textContent = "Filter by urgency";
  }
});

// Give default value to categoryInput and urgencyInput if they are left empty
function checkInput() {
  if (categoryInput.value == "") {
    categoryInput.value = "Inbox";
  }
  if (urgencyInput.value == "") {
    urgencyInput.value = "None";
  }
}

// Add a task after pressing "Enter"
newTask.addEventListener("keyup", (e) => {
  if (e.keyCode == 13 && newTask.value != "") {
    checkInput();
    addTask(newTask.value, categoryInput.value, urgencyInput.value);
  }
});

// Add a task after pressing the custom + button
addTaskBtn.addEventListener("click", () => {
  if (newTask.value != "") {
    checkInput();
    addTask(newTask.value, categoryInput.value, urgencyInput.value);
  }
});

// Add a task with DOM manipulation
function addTask(taskString, category, urgency, taskCheck = false) {
  // Filling the task template
  const taskTemplateNode = document.importNode(taskTemplate.content, true);
  const copyTaskNode = taskTemplateNode.querySelector("li");
  const checkbox = taskTemplateNode.querySelector("input");
  const label = taskTemplateNode.querySelector("label");
  const cross = taskTemplateNode.querySelectorAll(
    ".task-template__item__cross"
  );

  cross[0].id = id;
  checkbox.id = id;
  label.htmlFor = id;

  copyTaskNode.classList.add(category);
  copyTaskNode.classList.add(urgency);

  addOptionToDatalist(category, "category");
  addOptionToDatalist(urgency, "urgency");

  const pElement = taskTemplateNode.querySelector("p");
  pElement.append(taskString);

  // Based on the filterMode, filling the new list if needed
  const taskListTemplateNode = document.importNode(
    taskListTemplate.content,
    true
  );
  const copyListNode = taskListTemplateNode.querySelector("details");

  // Check if category exists already
  // If not, create it and append it to tasksContainer
  // If yes, do nothing
  if (filterMode == filters[0] && categoryArray.indexOf(category) == -1) {
    // Insert category to existing ones
    categoryArray.push(category);

    // Change title
    const title = copyListNode.querySelector(
      ".task-list-template__details__title"
    );
    title.textContent = category;

    // Add category and urgency to the class of the parentNode
    copyListNode.classList.add(category);

    tasksContainer.append(copyListNode);

    setTaskListListeners();
    setTaskListListenersTouch();
  } else if (filterMode == filters[1] && urgencyArray.indexOf(urgency) == -1) {
    // Insert category to existing ones
    urgencyArray.push(urgency);

    // Change title
    const title = copyListNode.querySelector(
      ".task-list-template__details__title"
    );
    title.textContent = urgency;

    // Add category and urgency to the class of the parentNode
    copyListNode.classList.add(urgency);

    tasksContainer.append(copyListNode);

    setTaskListListeners();
    setTaskListListenersTouch();
  }

  const allDetails = tasksContainer.querySelectorAll("details");
  // Appending the task in the right category
  if (filterMode == filters[0]) {
    allDetails.forEach((list) => {
      const hasClass = list.classList.contains(category);
      if (hasClass) {
        const ul = list.querySelector("ul");
        ul.append(taskTemplateNode);
        if (list.open != true) {
          list.open = true;
        }
      }
    });
  } else {
    allDetails.forEach((list) => {
      const hasClass = list.classList.contains(urgency);
      if (hasClass) {
        const ul = list.querySelector("ul");
        ul.append(taskTemplateNode);
        if (list.open != true) {
          list.open = true;
        }
      }
    });
  }

  // Making sure that the check animation doesn't restart onload page
  if (taskCheck) {
    const checkCustom = label.querySelector("svg");
    const path = checkCustom.querySelector("path");
    path.style.strokeDashoffset = 0;
    checkbox.checked = taskCheck;
  } else {
    checkbox.checked = taskCheck;
  }

  // Reseting input boxes and incrementing id
  newTask.value = "";
  categoryInput.value = "";
  urgencyInput.value = "";
  id++;

  setListenersCrosses();
  makeElementsDraggable();
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

// Adding new option to datalist When new category is inputed
function addOptionToDatalist(userInput, type) {
  // Get current datalist
  const id = `add-new-task__${type}__list`;
  const datalist = document.getElementById(id);
  const options = datalist.querySelectorAll("option");
  const optionsArray = [];

  options.forEach((option) => {
    optionsArray.push(option.value);
  });

  // Check if inputed category already exist. If not, add it
  if (optionsArray.indexOf(userInput) != -1) {
    return;
  } else {
    const newOption = document.createElement("option");
    newOption.value = userInput;
    datalist.appendChild(newOption);
  }
}

// Before closing the tab, load the info on the localStorage
window.addEventListener("beforeunload", () => {
  // Clear previous cache
  localStorage.clear();

  // Set the array where we'll store the objects with task info
  const tasksArray = [];

  const liElements = document.getElementsByTagName("li");

  for (let i = 0; i < liElements.length; i++) {
    // Get check info
    const input = liElements[i].querySelector("input");
    const checkedItem = input.checked;

    // Get task text
    const text = liElements[i].querySelector("p");
    const taskItem = text.outerText;

    // Get category
    const category = liElements[i].classList.item(1);

    // Get urgency
    const urgency = liElements[i].classList.item(2);

    // Put each task in an object and store them in an array
    const allItems = {
      checked: checkedItem,
      task: taskItem,
      category: category,
      urgency: urgency,
    };

    tasksArray.push(allItems);
  }

  localStorage.setItem("tasks", JSON.stringify(tasksArray));
  localStorage.setItem("filterMode", filterMode);
  // localStorage.clear();
});

// Onload, download the info from the localStorage
window.addEventListener("load", () => {
  // Setting the last filterMode used
  filterMode = localStorage.getItem("filterMode");
  if (filterMode == null) {
    filterMode = filters[0];
  }
  if (filterMode == filters[0]) {
    filterBtn.textContent = "Filter by urgency";
  } else {
    filterBtn.textContent = "Filter by category";
  }

  if (localStorage.getItem("tasks") != null) {
    const data = JSON.parse(localStorage.getItem("tasks"));
    data.forEach((item) => {
      addTask(item.task, item.category, item.urgency, item.checked);
    });
  }

  // if (localStorage.length == 1 && data.length == 0) {
  //   addTask("Crush my goals of the month", true);
  //   addTask("Go find Voldemort's nose");
  //   addTask("Date my best friend's little sister");
  // }
});

// Set a mutation observer so that the eventListeners are up to date with the current crosses and the drag-and-drop symbols

// We are only observing if a task (i.e. a li element) gets added or deleted
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutation are observed
const callback = function (mutationsList, observer) {
  for (let mutation of mutationsList) {
    if (mutation.type == "childList") {
      // setListenersCrosses();
      // makeElementsDraggable();
    }
  }
};

// Create the observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start checking for DOM tree mutations
observer.observe(tasksContainer, config);

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
    // dragLogo is the 6-dots logo representing the UI elements for drag-and-drop
    // Its default behaviour was not logical, so I fixed it
    // It's being called in both startDragStyle and endDragStyle so I'm setting it before so that it doesn't run twice
    const dragLogo = task.querySelector(".task-template__item__drag");

    // Extract the value of draggable of the task
    // Which is initially false but becomes temporarely true onclick
    let draggable = task.draggable;

    // Set the style of the task while it's being dragged
    // Handle the behaviour for touch-based devices
    let touchTimeout;

    task.addEventListener("touchstart", () => {
      touchTimeout = setTimeout(() => {
        task.draggable = true;
        task.classList.add("task-template__item--dragging");
        dragLogo.classList.add("task-template__item--ongoing-drag");
      }, 200);
    });

    task.addEventListener("touchend", () => {
      clearTimeout(touchTimeout);
      task.draggable = false;
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
      task.classList.remove("task-template__item--dragging");
      dragLogo.classList.remove("task-template__item--ongoing-drag");
      task.draggable = false;
    });
  });
}

// For touch-based devices
function setTaskListListenersTouch() {
  const tasksList = document.querySelectorAll(
    ".task-list-template__details__list"
  );

  document.addEventListener("touchmove", function (e) {
    const touchY = e.touches[0].clientY;
    const task = document.querySelector(".task-template__item--dragging");
    tasksList.forEach((taskList) => {
      taskList.addEventListener("touchmove", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(taskList, touchY);
        // console.log(afterElement);

        if (afterElement == null) {
          taskList.appendChild(task);
        } else {
          taskList.insertBefore(task, afterElement);
        }
      });
    });
  });
}

// For mouse-based devices
function setTaskListListeners() {
  const tasksList = document.querySelectorAll(
    ".task-list-template__details__list"
  );
  tasksList.forEach((taskList) => {
    // dragover for mouse-based devices
    taskList.addEventListener("dragover", (e) => {
      e.preventDefault();
      const afterElement = getDragAfterElement(taskList, e.clientY);
      const task = document.querySelector(".task-template__item--dragging");
      // if (afterElement == null) {
      //   taskList.appendChild(task);
      // } else {
      taskList.insertBefore(task, afterElement);
      // }
    });
  });
}

// Function that actually returns the tasks over which the user hovers with the dragged element
// Credit to Web Dev Simplified's YouTube channel for this sweet piece of code
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

// // Set an autosave every 5 minutes just in case the browser crashes
// setTimeout(() => {
//   location = location;
// }, 300000);
