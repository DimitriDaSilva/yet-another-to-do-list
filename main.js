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
    addTask();
  }
});

// Add a task after pressing the custom button
addTaskBtn.addEventListener("click", () => {
  if (newTask.value != "") {
    addTask();
  }
});

function addTask() {
  const taskElement = document.importNode(taskTemplate.content, true);
  const checkbox = taskElement.querySelector("input");
  const label = taskElement.querySelector("label");
  console.log(label);

  checkbox.id = id;
  label.htmlFor = id;

  const textPlace = label.querySelector("p");
  textPlace.append(newTask.value);
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
