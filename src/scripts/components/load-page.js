import { addTask } from "./task-new.js";
import { darkMode, setDarkMode } from "./dark-mode.js";
import { filterMode, filters, filterText, updateFilter } from "./filter.js";
import {
  callRandomPhoto,
  setBackground,
  resizeBackground,
} from "./wallpaper.js";
import { colorPairs, setColorPairLoad } from "./category-color.js";

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
  resizeBackground();
  setBackground(backgroundImage);

  // Setting the last filterMode used
  updateFilter(localStorage.getItem("filterMode"));
  if (filterMode === null) {
    updateFilter(filters[1]);
  }
  if (filterMode === filters[0]) {
    filterText.textContent = "Filter by urgency";
  } else {
    filterText.textContent = "Filter by category";
  }

  // Adding all the tasks
  setColorPairLoad(JSON.parse(localStorage.getItem("colorPairs")));
  if (localStorage.getItem("tasks") !== null) {
    const data = JSON.parse(localStorage.getItem("tasks"));
    data.forEach((item) => {
      let color = "";
      if (filterMode === filters[0]) {
        color = colorPairs[filterMode][item.category];
      } else {
        color = colorPairs[filterMode][item.urgency];
      }
      addTask(item.task, item.category, item.urgency, color, item.checked);
    });
  }

  // if (localStorage.length === 1 && data.length === 0) {
  //   addTask("Crush my goals of the month", true);
  //   addTask("Go find Voldemort's nose");
  //   addTask("Date my best friend's little sister");
  // }
}
