import { rgbToHex } from "/src/scripts//utils.js";

const moreMenuTemplate = document.querySelector("#more-menu-template");

// Set the colors of the color palette
const colorPaletteTemplateNode = document.importNode(
  moreMenuTemplate.content,
  true
);
export const colorPalette = colorPaletteTemplateNode.querySelector(
  ".more-menu-template__container__colors"
);
const colors = colorPalette.querySelectorAll("button");

const presetColors = [
  { color: "#111455", used: false },
  { color: "#e63946", used: false },
  { color: "#2a9d8f", used: false },
  { color: "#f4a261", used: false },
  { color: "#a8dadc", used: false },
  { color: "#ffb4a2", used: false },
  { color: "#a5a58d", used: false },
  { color: "#f2cc8f", used: false },
  { color: "#ef476f", used: false },
  { color: "#fee440", used: false },
];
let index = 0;

colors.forEach((color) => {
  color.style.background = presetColors[index].color;
  index++;
});

export function setRandColor() {
  const numbColors = presetColors.length;
  let isUsed;
  let randIndex;

  // Use case where there are more than 10 categories being used, we reset the used properties
  if (
    presetColors.filter((color) => color.used === true).length === numbColors
  ) {
    presetColors.forEach((color) => {
      color.used = false;
    });
  }

  // We check pick a color at random and check if the color is currently being used
  do {
    randIndex = Math.floor(Math.random() * numbColors);

    isUsed = presetColors[randIndex].used;
  } while (isUsed);

  presetColors[randIndex].used = true;

  return presetColors[randIndex].color;
}

export function setListenerBrush(summaryEl, xPosition, yPosition) {
  const brushIcon = document.querySelector(
    ".more-menu-template__container__color"
  );

  // Set the listener over the brush click
  brushIcon.addEventListener("click", () => {
    // Position palette on X and Y axis
    colorPalette.style.left = xPosition + "px";
    colorPalette.style.top = yPosition - 7 + "px";

    // Get existing color from the bottom border
    const borderColor = getBottomBorderColor(summaryEl);

    // Format the circle that represents the current color
    formatColorCircle(borderColor);

    const placeholder = summaryEl.querySelector(
      ".task-list-template__details__more-menu"
    );
    placeholder.appendChild(colorPalette);

    // Make it appear
    colorPalette.style.animation = "appearColor 0.4s forwards ease-in-out";

    setListenerColors(summaryEl);
  });
}

function formatColorCircle(borderColor) {
  colors.forEach((color) => {
    color.style.boxShadow = "none";
    const rgbColor = color.style.background;
    const hexColor = rgbToHex(rgbColor);
    if (rgbColor === borderColor) {
      color.style.boxShadow = `0 0 0 3px ${hexColor}44`;
    }
  });
}

export function getBottomBorderColor(summaryEl) {
  const borderStyle = window.getComputedStyle(summaryEl);
  return borderStyle.getPropertyValue("border-bottom-color");
}

function getCheckboxColor(liEl) {
  const checkbox = liEl.querySelector(".task-template__item__custom-checkbox");
  const checkboxStyle = window.getComputedStyle(checkbox);
  return rgbToHex(checkboxStyle.getPropertyValue("background-color"));
}

// Set the listener over each color
function setListenerColors(summaryEl) {
  colorPalette.addEventListener("click", colorListenerHandler, true);
}

export function colorListenerHandler(e) {
  const target = e.target;
  const classTargeted = "more-menu-template__container__colors__btn";
  const hasClass = target.classList.contains(classTargeted);
  if (hasClass) {
    const summaryEl = getParentElement(target, "SUMMARY");
    const pickedColor = target.style.background;

    changeColorStatus(summaryEl, pickedColor);

    formatColorCircle(pickedColor);

    setColors(summaryEl, pickedColor);
  }
}

// Use the default value for when we only want to delete and category and no longer use a color
export function changeColorStatus(summaryEl = null, pickedColor = null) {
  let detailsEl, oldColor, rgbPickedColor;
  if (summaryEl !== null) {
    detailsEl = summaryEl.parentElement;
    oldColor = detailsEl.classList.item(2);
  }

  if (/^#/.test(pickedColor)) {
    rgbPickedColor = pickedColor;
  } else if (pickedColor !== null) {
    rgbPickedColor = rgbToHex(pickedColor);
    detailsEl.classList.replace(oldColor, rgbPickedColor);
  }

  presetColors.forEach((color) => {
    if (color.color === oldColor) {
      color.used = false;
    } else if (color.color === rgbPickedColor) {
      color.used = true;
    }
  });
}

export function setColors(summaryEl, pickedColor) {
  // Set the stroke with the new color
  summaryEl.style.setProperty("border-bottom-color", pickedColor);

  // Set the checkboxed with the new color
  const details = summaryEl.parentElement;
  const ul = details.querySelector("ul");
  const checkboxes = ul.querySelectorAll(
    ".task-template__item__custom-checkbox"
  );
  checkboxes.forEach((checkbox) => {
    checkbox.style.setProperty("background", pickedColor);
  });
}
