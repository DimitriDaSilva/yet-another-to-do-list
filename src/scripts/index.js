/* Import stylesheets */
import "../styles/01-reset.css";
import "../styles/02-header.css";
import "../styles/03-main.css";
import "../styles/04-footer.css";

/* Import favicon */
require("../assets/logo.png");

/* Import scripts */
import { setNewTaskListener } from "./components/task-new.js";
import { setLoadListener } from "./components/load-page.js";
import { setUnloadListener } from "./components/unload-page.js";
import { setClearListener } from "./components/remove-complete.js";
import {
  setBackgroundListener,
  setResizeListener,
} from "./components/wallpaper.js";
import { setDarkModeListener } from "./components/dark-mode.js";
import { setDate } from "./components/date.js";

/* Helper arrrays and variable */
export let categoryArray = [];
export let urgencyArray = [];
export let id = 1;

/* Setters for the id */
export function setId(updatedValue) {
  id = updatedValue;
}

/* Set event listeners */
setNewTaskListener();
setUnloadListener();
setLoadListener();
setClearListener();
setBackgroundListener();
setDarkModeListener();
setResizeListener();

/* Others */
setDate();
