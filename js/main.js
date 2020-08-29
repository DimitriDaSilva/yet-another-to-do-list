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
  checkbox.checked = taskCheck;
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

// Set a loop listening to all crosses
document.addEventListener("mousedown", () => {
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
});
