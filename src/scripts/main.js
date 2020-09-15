"use strict";

import { addTask } from "./components/task-new.js";
import { accessibility } from "./components/accessibility.js";
import { setLoadListener } from "./components/load-page.js";
import { setClearListener } from "./components/remove-complete.js";
import { setBackgroundBtn } from "./components/wallpaper.js";
import { setDarkModeBtn } from "./components/dark-mode.js";

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
export let categoryArray = [];
export let urgencyArray = [];

// Set the index of the first task
export let id = 1;

let helperVariables;

// Add a task after pressing "Enter"
newTask.addEventListener("keyup", checkValidInputEnter);
categoryInput.addEventListener("keyup", checkValidInputEnter);
urgencyInput.addEventListener("keyup", checkValidInputEnter);

function checkValidInputEnter(e) {
  if (e.keyCode === 13 && newTask.value !== "") {
    helperVariables = addTask(
      newTask.value,
      categoryInput.value,
      urgencyInput.value
    );
  }
}

// Add a task after pressing the custom + button
addTaskBtn.addEventListener("click", checkValidInputClick);

function checkValidInputClick() {
  if (newTask.value !== "") {
    helperVariables = addTask(
      newTask.value,
      categoryInput.value,
      urgencyInput.value
    );
  }
}

export function updateHelperVariables(category, urgency, index = null) {
  categoryArray = category;
  urgencyArray = urgency;
  if (index !== null) {
    id = index;
  }
}

accessibility();
setLoadListener();
setClearListener();
setBackgroundBtn();
setDarkModeBtn();
