// const { default: fetch } = require("node-fetch");

("use strick");

// Select buttons
const addTaskBtn = document.querySelector("#add-new-task__button");
const clearCompletedBtn = document.querySelector("#buttons__clear");
const filterBtn = document.querySelector("#buttons__filter");
const darkModeBtn = document.querySelector("#top-section__dark-mode");
const backgroundBtn = document.querySelector("#top-section__background");

// Select input value
const newTask = document.querySelector("#add-new-task__input");
const categoryInput = document.querySelector("#add-new-task__category__input");
const urgencyInput = document.querySelector("#add-new-task__urgency__input");

// Select the div where the tasks will go and the templates
const tasksContainer = document.querySelector("#tasks");
const taskListTemplate = document.querySelector("#task-list-template");
const taskTemplate = document.querySelector("#task-template");
const moreMenuTemplate = document.querySelector("#more-menu-template");
const backgroundPickerTemplate = document.querySelector("#background-image");

// Set the arrays with the categories and levels of urgency
let categoryArray = [];
let urgencyArray = [];

// Set the index of the first task
let id = 1;

// Setting the dark mode
let darkMode = "";
darkModeBtn.addEventListener("click", switchTheme);

function switchTheme(e) {
  if (darkMode == "light") {
    darkMode = "dark";
  } else {
    darkMode = "light";
  }
  document.documentElement.setAttribute("data-theme", darkMode);
}

// Handling the filter
const filterText = filterBtn.querySelector("p");
const filters = ["category", "urgency"];
let filterMode = "";
filterBtn.addEventListener("click", () => {
  if (filterMode == filters[0]) {
    filterMode = filters[1];
    filterText.textContent = "Filter by category";
  } else {
    filterMode = filters[0];
    filterText.textContent = "Filter by urgency";
  }

  const savedTasks = saveTasks();

  tasksContainer.textContent = "";
  categoryArray = [];
  urgencyArray = [];

  savedTasks.forEach((item) => {
    addTask(item.task, item.category, item.urgency, item.color, item.checked);
  });
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
newTask.addEventListener("keyup", checkValidInput);
categoryInput.addEventListener("keyup", checkValidInput);
urgencyInput.addEventListener("keyup", checkValidInput);

function checkValidInput(e) {
  if (e.keyCode == 13 && newTask.value != "") {
    checkInput();
    addTask(newTask.value, categoryInput.value, urgencyInput.value);
  }
}

// Add a task after pressing the custom + button
addTaskBtn.addEventListener("click", () => {
  if (newTask.value != "") {
    checkInput();
    addTask(newTask.value, categoryInput.value, urgencyInput.value);
  }
});

// Add a task with DOM manipulation
function addTask(
  taskString,
  category,
  urgency,
  pickedColor = setRandColor(),
  taskCheck = false
) {
  // Based on the filterMode, filling the new list if needed
  const taskListTemplateNode = document.importNode(
    taskListTemplate.content,
    true
  );
  const copyListNode = taskListTemplateNode.querySelector("details");
  const summary = taskListTemplateNode.querySelector("summary");

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

    // Set the colors to the stroke
    setColors(summary, pickedColor);

    // Asign the pickedColor to the category as a class
    copyListNode.classList.add(pickedColor);
    changeColorStatus(null, pickedColor);

    tasksContainer.append(copyListNode);

    setListenersDots(copyListNode);
  } else if (filterMode == filters[1] && urgencyArray.indexOf(urgency) == -1) {
    // Insert category to existing ones
    urgencyArray.push(urgency);

    // Change title
    const title = copyListNode.querySelector(
      ".task-list-template__details__title"
    );
    title.textContent = urgency;

    // Change title
    const dots = copyListNode.querySelector(
      ".task-list-template__details__button"
    );
    dots.id = urgency;

    // Add category and urgency to the class of the parentNode
    copyListNode.classList.add(urgency);

    // Set the colors to the stroke
    setColors(summary, pickedColor);

    // Asign the pickedColor to the category as a class
    copyListNode.classList.add(pickedColor);
    changeColorStatus(null, pickedColor);

    tasksContainer.append(copyListNode);

    setListenersDots(copyListNode);
  }

  // Filling the task template

  // Selecting the task template elements
  const taskTemplateNode = document.importNode(taskTemplate.content, true);
  const copyTaskNode = taskTemplateNode.querySelector("li");
  const checkbox = taskTemplateNode.querySelector("input");
  const label = taskTemplateNode.querySelector("label");
  const tag = taskTemplateNode.querySelector(".task-template__item__tag");
  const cross = taskTemplateNode.querySelector(".task-template__item__cross");

  // Selecting the existing categories
  const allDetails = tasksContainer.querySelectorAll("details");

  cross.id = id;
  checkbox.id = id;
  label.htmlFor = id;

  copyTaskNode.classList.add(category);
  copyTaskNode.classList.add(urgency);

  addOptionToDatalist(category, "category");
  addOptionToDatalist(urgency, "urgency");

  const pElement = taskTemplateNode.querySelector("p");
  pElement.append(taskString);

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

        // Add tag
        tag.textContent = urgency;

        // Detect stroke color and apply it to the task
        const summaryEl = list.querySelector("summary");
        setColors(summaryEl, getBottomBorderColor(summaryEl));
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

        // Add tag
        tag.textContent = category;

        // Detect stroke color and apply it to the task
        const summaryEl = list.querySelector("summary");
        setColors(summaryEl, getBottomBorderColor(summaryEl));
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

// Save everything
function saveTasks() {
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

    // Get color from box
    const checkboxColor = getCheckboxColor(liElements[i]);

    // Put each task in an object and store them in an array
    const allItems = {
      checked: checkedItem,
      task: taskItem,
      category: category,
      urgency: urgency,
      color: checkboxColor,
    };

    tasksArray.push(allItems);
  }

  return tasksArray;
}

// Before closing the tab, load the info on the localStorage
window.addEventListener("beforeunload", () => {
  // Clear previous cache
  localStorage.clear();

  const savedTasks = saveTasks();

  // Get url of background
  if (pictureCounter > 0) {
    const header = document.querySelector("header");
    const value = header.style.backgroundImage;
    const regex = /(?:\(['"]?)(.*?)(?:['"]?\))/;
    const url = regex.exec(value)[1];
    localStorage.setItem("backgroundImage", url);
  }

  localStorage.setItem("tasks", JSON.stringify(savedTasks));
  localStorage.setItem("darkMode", darkMode);
  localStorage.setItem("filterMode", filterMode);
  // localStorage.clear();
});

// Onload, download the info from the localStorage
window.addEventListener("load", loadingPage);
async function loadingPage() {
  // Setting the dark mode previously set. Default light
  darkMode = localStorage.getItem("darkMode");
  if (darkMode == null || darkMode == "light") {
    darkMode = "light";
  } else {
    darkMode = "dark";
  }
  document.documentElement.setAttribute("data-theme", darkMode);

  // Setting the previously set background image
  let backgroundImage = localStorage.getItem("backgroundImage");
  console.log(backgroundImage);
  if (backgroundImage == null || backgroundImage == "") {
    console.log("test");
    backgroundImage = await callRandomPhoto();
    console.log(backgroundImage);
  }
  updatePicture(backgroundImage);

  // Setting the previously set background image
  // const backgroundImage = localStorage.getItem("backgroundImage");
  // const header = document.querySelector("header");
  // header.style.backgroundImage = backgroundImage;

  // Setting the last filterMode used
  filterMode = localStorage.getItem("filterMode");
  if (filterMode == null) {
    filterMode = filters[0];
  }
  if (filterMode == filters[0]) {
    filterText.textContent = "Filter by urgency";
  } else {
    filterText.textContent = "Filter by category";
  }

  // Adding all the tasks
  if (localStorage.getItem("tasks") != null) {
    const data = JSON.parse(localStorage.getItem("tasks"));
    data.forEach((item) => {
      addTask(item.task, item.category, item.urgency, item.color, item.checked);
    });
  }

  // if (localStorage.length == 1 && data.length == 0) {
  //   addTask("Crush my goals of the month", true);
  //   addTask("Go find Voldemort's nose");
  //   addTask("Date my best friend's little sister");
  // }
}

// Set a loop listening to all crosses
function setListenersCrosses() {
  const crossDeleteBtns = document.getElementsByClassName(
    "task-template__item__cross"
  );
  for (let i = 0; i < crossDeleteBtns.length; i++) {
    const cross = crossDeleteBtns[i];
    cross.addEventListener("click", () => {
      const crossId = cross.id;
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
      updateTask(task);
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
      updateTask(task);
      task.classList.remove("task-template__item--dragging");
      dragLogo.classList.remove("task-template__item--ongoing-drag");
      task.draggable = false;
    });
  });
}

// MOdify the category of the task upon drop and change its color
function updateTask(task) {
  const detailsEl = getParentElement(task, "DETAILS");

  // Modify its category
  const groupName = detailsEl.classList.item(1);
  let classToBeReplaced = "";

  if (filterMode == filters[0]) {
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

// For touch-based devices
tasksContainer.addEventListener("touchmove", (e) => {
  const myLocation = e.targetTouches[0];
  const target = document.elementFromPoint(myLocation.pageX, myLocation.pageY);
  if (target != null) {
    const targetUl = getParentElement(target, "UL");
    if (targetUl.tagName == "UL") {
      e.preventDefault();
      const touchY = e.targetTouches[0].pageY;
      const afterElement = getDragAfterElement(targetUl, touchY);
      const task = document.querySelector(".task-template__item--dragging");
      if (afterElement == null) {
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
  if (target != null) {
    const targetUl = getParentElement(target, "UL");
    if (targetUl.tagName == "UL") {
      e.preventDefault();
      const afterElement = getDragAfterElement(targetUl, e.clientY);
      const task = document.querySelector(".task-template__item--dragging");
      if (afterElement == null) {
        targetUl.appendChild(task);
      } else {
        targetUl.insertBefore(task, afterElement);
      }
    }
  }
});

function getParentElement(object, tag) {
  if (object.tagName == tag) {
    return object;
  }
  if (object.tagName == "BODY") {
    return {};
  }
  return getParentElement(object.parentElement, tag);
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

function setListenersDots(detailsEl) {
  // Importing the template which is a document fragment
  const moreMenuTemplateNode = document.importNode(
    moreMenuTemplate.content,
    true
  );

  // We need to convert the template into a more convinient format
  const copyMoreMenu = moreMenuTemplateNode.querySelector(
    ".more-menu-template__container__buttons"
  );

  // Creating the more menu after click on dots
  detailsEl.addEventListener("click", (e) => {
    const dotBtn = e.target;
    const summaryEl = dotBtn.parentElement;
    const classTargeted = "task-list-template__details__button";
    const hasClass = dotBtn.classList.contains(classTargeted);

    const placeholder = summaryEl.querySelector(
      ".task-list-template__details__more-menu"
    );

    if (hasClass) {
      // We need to make it appear so that we can take its measures
      // We then set its position
      // We append it with opacity 0 and turn it to 1
      placeholder.appendChild(copyMoreMenu);

      const halfHeight = copyMoreMenu.offsetHeight / 2;
      const yPosition = e.clientY - halfHeight;
      copyMoreMenu.style.top = yPosition + "px";

      // Position more menu on X axis
      const width = copyMoreMenu.offsetWidth;
      const xPosition = e.clientX - width - 10;
      copyMoreMenu.style.left = xPosition + "px";

      // Make it appear
      copyMoreMenu.style.animation = "appear 0.2s forwards ease-in-out";

      // Listening to each icon
      // We need to pass down a yPosition adjusted for the height of the contrainer
      const adjYPosition = yPosition + copyMoreMenu.offsetHeight;
      setListenerBrush(summaryEl, xPosition, adjYPosition);

      setListenerEdit(summaryEl, copyMoreMenu);

      setListenerTrash(summaryEl);

      // We are setting the listener for the click outside the menu that will make it go away
      window.addEventListener("mousedown", setListenerExitMoreMenu, true);
      function setListenerExitMoreMenu(e) {
        if (!placeholder.contains(e.target)) {
          // Removing the event listeners of the color buttons, otherwise they stack each other
          if (placeholder.childElementCount == 2) {
            colorPalette.removeEventListener(
              "click",
              colorListenerHandler,
              true
            );
          }

          placeholder.textContent = "";
        }
      }
    }
  });
}

// Set the colors of the color palette
const colorPaletteTemplateNode = document.importNode(
  moreMenuTemplate.content,
  true
);
const colorPalette = colorPaletteTemplateNode.querySelector(
  ".more-menu-template__container__colors"
);
const colors = colorPalette.querySelectorAll("button");

const presetColors = [
  { color: "#111455", used: false },
  { color: "#e63946", used: false },
  { color: "#2a9d8f", used: false },
  { color: "#f4a261", used: false },
  { color: "#a8dadc", used: false },
  { color: "#ffb4a2", used: false },
  { color: "#a5a58d", used: false },
  { color: "#f2cc8f", used: false },
  { color: "#ef476f", used: false },
  { color: "#fee440", used: false },
];
let index = 0;

colors.forEach((color) => {
  color.style.background = presetColors[index].color;
  index++;
});

function setRandColor() {
  const numbColors = presetColors.length;
  let isUsed;
  let randIndex;

  // Use case where there are more than 10 categories being used, we reset the used properties
  if (presetColors.filter((color) => color.used == true).length == numbColors) {
    presetColors.forEach((color) => {
      color.used = false;
    });
  }

  // We check pick a color at random and check if the color is currently being used
  do {
    randIndex = Math.floor(Math.random() * numbColors);

    isUsed = presetColors[randIndex].used;
  } while (isUsed);

  presetColors[randIndex].used = true;

  return presetColors[randIndex].color;
}

function setListenerBrush(summaryEl, xPosition, yPosition) {
  const brushIcon = document.querySelector(
    ".more-menu-template__container__color"
  );

  // Set the listener over the brush click
  brushIcon.addEventListener("click", () => {
    // Position palette on X and Y axis
    colorPalette.style.left = xPosition + "px";
    colorPalette.style.top = yPosition - 7 + "px";

    // Get existing color from the bottom border
    const borderColor = getBottomBorderColor(summaryEl);
    // const borderStyle = window.getComputedStyle(parent);
    // const borderColor = borderStyle.getPropertyValue("border-bottom-color");

    // Format the circle that represents the current color
    formatColorCircle(borderColor);

    const placeholder = summaryEl.querySelector(
      ".task-list-template__details__more-menu"
    );
    placeholder.appendChild(colorPalette);

    // Make it appear
    colorPalette.style.animation = "appearColor 0.4s forwards ease-in-out";

    setListenerColors(summaryEl);
  });
}

function formatColorCircle(borderColor) {
  colors.forEach((color) => {
    color.style.boxShadow = "none";
    const rgbColor = color.style.background;
    const hexColor = rgbToHex(rgbColor);
    if (rgbColor == borderColor) {
      color.style.boxShadow = `0 0 0 3px ${hexColor}44`;
    }
  });
}

function getBottomBorderColor(summaryEl) {
  const borderStyle = window.getComputedStyle(summaryEl);
  return borderStyle.getPropertyValue("border-bottom-color");
}

function getCheckboxColor(liEl) {
  const checkbox = liEl.querySelector(".task-template__item__custom-checkbox");
  const checkboxStyle = window.getComputedStyle(checkbox);
  return rgbToHex(checkboxStyle.getPropertyValue("background-color"));
}

// Set the listener over each color
function setListenerColors(summaryEl) {
  colorPalette.addEventListener("click", colorListenerHandler, true);
}

function colorListenerHandler(e) {
  const target = e.target;
  const classTargeted = "more-menu-template__container__colors__btn";
  const hasClass = target.classList.contains(classTargeted);
  if (hasClass) {
    const summaryEl = getParentElement(target, "SUMMARY");
    const pickedColor = target.style.background;

    changeColorStatus(summaryEl, pickedColor);

    formatColorCircle(pickedColor);

    setColors(summaryEl, pickedColor);
  }
}

// Use the default value for when we only want to delete and category and no longer use a color
function changeColorStatus(summaryEl = null, pickedColor = null) {
  let detailsEl, oldColor, rgbPickedColor;
  if (summaryEl != null) {
    detailsEl = summaryEl.parentElement;
    oldColor = detailsEl.classList.item(2);
  }

  if (/^#/.test(pickedColor)) {
    rgbPickedColor = pickedColor;
  } else if (pickedColor != null) {
    rgbPickedColor = rgbToHex(pickedColor);
    detailsEl.classList.replace(oldColor, rgbPickedColor);
  }

  presetColors.forEach((color) => {
    if (color.color == oldColor) {
      color.used = false;
    } else if (color.color == rgbPickedColor) {
      color.used = true;
    }
  });
}

function setColors(summaryNode, pickedColor) {
  // Set the stroke with the new color
  summaryNode.style.setProperty("border-bottom-color", pickedColor);

  // Set the checkboxed with the new color
  const details = summaryNode.parentElement;
  const ul = details.querySelector("ul");
  const checkboxes = ul.querySelectorAll(
    ".task-template__item__custom-checkbox"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.style.setProperty("background", pickedColor);
  });
}

function setListenerTrash(summaryEl) {
  const trashIcon = document.querySelector(
    ".more-menu-template__container__trash"
  );

  const detailsEl = summaryEl.parentElement;
  const classDetailsEl = detailsEl.classList.item(1);
  trashIcon.addEventListener("click", (e) => {
    // Delete the category from array
    if (categoryArray.indexOf(classDetailsEl) != -1) {
      const indexCat = categoryArray.indexOf(classDetailsEl);
      categoryArray.splice(indexCat, 1);
    } else {
      const indexUrg = urgencyArray.indexOf(classDetailsEl);
      urgencyArray.splice(indexUrg, 1);
    }

    // Pass the color used as not used
    changeColorStatus(summaryEl);

    // Delete the task group
    detailsEl.remove();
  });
}

function setListenerEdit(summaryEl, moreMenu) {
  function createListener(summaryEl, moreMenu) {
    return new Promise((resolve) => {
      const editBtn = document.querySelector(
        ".more-menu-template__container__pencil"
      );
      editBtn.addEventListener("click", () => {
        const pElement = summaryEl.querySelector("p");

        pElement.setAttribute("contenteditable", true);
        pElement.focus();

        const details = node.parentElement;
        details.addEventListener("click", disableToggle, true);

        moreMenu.parentElement.remove();

        resolve({ pElement: pElement, details: details });
      });
    });
  }

  function setCheckEditEnd(pElement, details) {
    return new Promise((resolve) => {
      pElement.addEventListener("keydown", (e) => {
        if (e.keyCode == 13) {
          details.removeEventListener("click", disableToggle, true);
          pElement.setAttribute("contenteditable", false);
        }
      });

      window.addEventListener("mousedown", (e) => {
        if (!pElement.contains(e.target)) {
          details.removeEventListener("click", disableToggle, true);
          pElement.setAttribute("contenteditable", false);
        }
      });
      resolve(pElement);
    });
  }

  function disableToggle(e) {
    e.preventDefault();
  }

  createListener(summaryEl, moreMenu).then((res) => {
    setCheckEditEnd(res.pElement, res.details);
  });
}

function rgbToHex(rgb) {
  rgb = rgb.toString();
  let a = rgb.split("(")[1].split(")")[0];

  a = a.split(",");

  let b = a.map(function (x) {
    //For each array element
    x = parseInt(x).toString(16); //Convert to a base16 string
    return x.length == 1 ? "0" + x : x; //Add zero if we get only one character
  });

  b = "#" + b.join("");

  return b;
}

//

backgroundBtn.addEventListener("click", createBackgroundPicker);

function createBackgroundPicker(e) {
  const backgroundPicker = document.importNode(
    backgroundPickerTemplate.content,
    true
  );
  const imgSearchBar = backgroundPicker.querySelector("input");
  const imageContainer = backgroundPicker.querySelector(
    ".background-image__container__images"
  );

  // const requestUrl = `https://api.unsplash.com/search/photos?orientation=landscape&client_id=${unsplashApiKey}&query=`;
  document.body.appendChild(backgroundPicker);

  imgSearchBar.focus();

  // We are setting the listener for the key strokes in the search-bar. The API calls will be done in real time
  imgSearchBar.addEventListener("keyup", callPhotos);

  function callPhotos() {
    async function success() {
      const resultImg = await fetch(
        `./.netlify/functions/searchImg?search=${imgSearchBar.value}`
      );
      if (resultImg.ok) {
        const photosUnsplash = await resultImg.json();
        setThumbnails(photosUnsplash);
        setListenersPictures(photosUnsplash);
      }
    }

    success();
  }

  function setThumbnails(resultImg) {
    imageContainer.textContent = "";
    let id = 0;
    resultImg.forEach((pic) => {
      const div = document.createElement("div");
      div.classList.add("background-image__container__images__img");
      const img = document.createElement("img");
      img.src = pic.thumbnail;
      img.id = id;
      div.appendChild(img);
      imageContainer.appendChild(div);
      id++;
    });
  }

  let pictureCounter = 0;
  function setListenersPictures(resultImg) {
    document.addEventListener("click", setListenerAllsPictures, true);
    function setListenerAllsPictures(e) {
      const img = e.target;
      const div = img.parentElement;
      const classTargeted = "background-image__container__images__img";
      const hasClass = div.classList.contains(classTargeted);
      if (hasClass) {
        const pictureSelected = resultImg[img.id].large;
        updatePicture(pictureSelected);
        pictureCounter++;
      }
    }
  }

  // We are setting the listener for the click outside the background-image__container that will make it go away
  const container = document.querySelector(".background-image__container");
  window.addEventListener("mousedown", setListenerExit);
  function setListenerExit(e) {
    if (!container.contains(e.target)) {
      container.remove();
    }
  }
}

function updatePicture(image, id = null) {
  const header = document.querySelector("header");
  let picture;
  if (id != null) {
    picture = image[id].large;
  } else {
    picture = image;
  }
  header.style.backgroundImage = `url(${picture})`;
}

async function callRandomPhoto() {
  const response = await fetch("./.netlify/functions/randomImg");
  if (response.ok) {
    const randomPicture = await response.json();
    return randomPicture;
  }
  return null;
}

// updatePicture(callRandomPhoto());

// Set today's date
const dateEl = document.querySelector("#top-section__date");

let todayDate = new Date();
const options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
dateEl.textContent = todayDate.toLocaleDateString("en-GB", options);

// Change color of text and icon if dark background
function changeTopSectionColors() {}
