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

  checkbox.id = id;
  checkbox.checked = taskCheck;
  label.htmlFor = id;

  const textPlace = label.querySelector("p");
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
    let label = liElements[i].querySelector("label");
    let text = label.lastElementChild;
    let taskItem = text.outerText;

    let allItems = {
      checked: checkedItem,
      task: taskItem,
    };

    tasksArray.push(allItems);
  }

  localStorage.setItem("tasks", JSON.stringify(tasksArray));
});

window.addEventListener("load", () => {
  const data = JSON.parse(localStorage.getItem("tasks"));
  console.log(data);
  data.forEach((item) => {
    addTask(item.task, item.checked);
  });
});
