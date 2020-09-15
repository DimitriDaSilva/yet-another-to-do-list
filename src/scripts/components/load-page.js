import { addTask } from "./task-new.js";
import { darkMode, setDarkMode } from "./dark-mode.js";
import { filterMode, filters, filterText, updateFilter } from "./filter.js";
import { callRandomPhoto, updatePicture } from "./wallpaper.js";

// Onload, download the info from the localStorage
export function setLoadListener() {
  window.addEventListener("load", loadingPage);
}

async function loadingPage() {
  // Setting the dark mode previously set. Default light
  setDarkMode(localStorage.getItem("darkMode"));
  if (darkMode === null) {
    setDarkMode("light");
  }
  document.documentElement.setAttribute("data-theme", darkMode);

  // Setting the previously set background image. If not background preivously set then get a random photo
  let backgroundImage = localStorage.getItem("backgroundImage");
  if (backgroundImage === null || backgroundImage === "") {
    backgroundImage = await callRandomPhoto();
  }
  updatePicture(backgroundImage);

  // Setting the last filterMode used
  updateFilter(localStorage.getItem("filterMode"));
  if (filterMode === null) {
    updateFilter(filters[0]);
  }
  if (filterMode === filters[0]) {
    filterText.textContent = "Filter by urgency";
  } else {
    filterText.textContent = "Filter by category";
  }

  // Adding all the tasks
  if (localStorage.getItem("tasks") !== null) {
    const data = JSON.parse(localStorage.getItem("tasks"));
    data.forEach((item) => {
      addTask(item.task, item.category, item.urgency, item.color, item.checked);
    });
  }

  // if (localStorage.length === 1 && data.length === 0) {
  //   addTask("Crush my goals of the month", true);
  //   addTask("Go find Voldemort's nose");
  //   addTask("Date my best friend's little sister");
  // }
}
