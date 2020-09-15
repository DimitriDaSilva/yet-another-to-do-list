const darkModeBtn = document.querySelector("#top-section__dark-mode");

// Setting the dark mode
let darkMode = "";
export function setDarkModeBtn() {
  darkModeBtn.addEventListener("click", switchTheme);
}

function switchTheme(e) {
  if (darkMode === "light") {
    darkMode = "dark";
  } else {
    darkMode = "light";
  }
  document.documentElement.setAttribute("data-theme", darkMode);
}

export function updateDarkMode(updatedDarkMode) {
  darkMode = updatedDarkMode;
}
