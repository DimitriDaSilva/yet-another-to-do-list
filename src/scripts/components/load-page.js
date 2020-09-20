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
  localStorage.clear();
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

  if (localStorage.length === 0) {
    addTask(
      "Date my best friend's little sister",
      "Personal",
      "High",
      "#e63946",
      true
    );

    addTask(
      "Buy Dobby a new hat for his birthday",
      "Chores",
      "High",
      "#e63946",
      false
    );
    addTask("Take Sirius to the vet", "Chores", "Medium", "#666CE1", false);
    addTask(
      "Kick Malefoy's ass in Defence Against the Dark Arts' class",
      "School",
      "Medium",
      "#666CE1",
      false
    );
    addTask(
      "Ask Dumbledore and Hagrid for tips on how to grow a beard",
      "Personal",
      "Low",
      "#a8dadc",
      true
    );
    addTask(
      "Take in the fact that I can't grow a beard",
      "Personal",
      "Low",
      "#a8dadc",
      false
    );
    addTask("Find Voldemort's nose", "Chores", "Low", "#a8dadc", false);
    addTask(
      "Make up a dream for Divination class",
      "School",
      "None",
      "#ffb4a2",
      false
    );
  }
}
