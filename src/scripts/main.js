"use strict";

/* Imports */
import { setNewTaskListeners } from "./components/task-new.js";
import { accessibility } from "./components/accessibility.js";
import { setLoadListener } from "./components/load-page.js";
import { setUnloadListener } from "./components/unload-page.js";
import { setClearListener } from "./components/remove-complete.js";
import { setBackgroundBtn } from "./components/wallpaper.js";
import { setDarkModeBtn } from "./components/dark-mode.js";
import { setDate } from "./components/date.js";

/* Helper arrrays and variable */
export let categoryArray = [];
export let urgencyArray = [];
export let id = 1;

/* Setters for the id */
export function setId(updatedValue) {
  id = updatedValue;
}

/* Call starter functions, mainly event listeners */
setNewTaskListeners();
accessibility();
setUnloadListener();
setLoadListener();
setClearListener();
setBackgroundBtn();
setDarkModeBtn();
setDate();
