import swal from "sweetalert";
import { categoryArray, urgencyArray } from "../index.js";
import { updateColorPair } from "./category-color.js";
import { updateOptionDatalist } from "./dropdown-list.js";
import { filterMode, filters } from "./filter.js";

export function setListenerEdit(summaryEl, moreMenu) {
  createListener(summaryEl, moreMenu).then((res) => {
    setCheckEditEnd(res.pElement, res.details);
  });
}

function createListener(summaryEl, moreMenu) {
  return new Promise((resolve) => {
    const editBtn = document.querySelector(
      ".more-menu-template__container__pencil"
    );
    editBtn.addEventListener("click", () => {
      const pElement = summaryEl.querySelector("p");

      pElement.setAttribute("contenteditable", true);
      pElement.focus();

      const details = summaryEl.parentElement;
      details.addEventListener("click", disableToggle, true);

      const updatedMoreMenu = document.querySelector(
        ".task-list-template__details__more-menu"
      );
      updatedMoreMenu.textContent = "";

      resolve({ pElement: pElement, details: details });
    });
  });
}

function setCheckEditEnd(pElement, details) {
  return new Promise((resolve) => {
    pElement.addEventListener("keydown", (e) => {
      const newName = pElement.textContent;
      if (e.keyCode === 13 && isValidEdit(newName)) {
        details.removeEventListener("click", disableToggle, true);
        pElement.setAttribute("contenteditable", false);
        updateTaskEdit(newName, details);
      }
    });

    window.addEventListener("mousedown", (e) => {
      const newName = pElement.textContent;
      if (!pElement.contains(e.target) && isValidEdit(newName)) {
        details.removeEventListener("click", disableToggle, true);
        pElement.setAttribute("contenteditable", false);
        updateTaskEdit(newName, details);
      }
    });
    resolve(pElement);
  });
}

function disableToggle(e) {
  e.preventDefault();
}

function updateTaskEdit(newValue, detailsEl) {
  const liElements = detailsEl.querySelectorAll("li");
  let classToBeReplaced = "";

  classToBeReplaced = detailsEl.classList.item(1);
  updateColorPair(classToBeReplaced, newValue);
  updateOptionDatalist(classToBeReplaced, newValue);

  if (filterMode === filters[0]) {
    updateCategoryArray(classToBeReplaced, newValue);
  } else {
    updateUrgencyArray(classToBeReplaced, newValue);
  }

  liElements.forEach((task) => {
    task.classList.replace(classToBeReplaced, newValue);
  });

  detailsEl.classList.replace(classToBeReplaced, newValue);
}

function isValidEdit(newValue) {
  const regex = /\s/;

  if (regex.test(newValue)) {
    swal({
      title: "Error",
      text: "No whitespaces allowed. Please change the new name given",
      icon: "error",
      button: false,
    });
    return false;
  } else {
    return true;
  }
}

function updateCategoryArray(oldCategory, newCategory) {
  const index = categoryArray.indexOf(oldCategory);
  categoryArray.splice(index, 1, newCategory);
}

function updateUrgencyArray(oldUrgency, newUrgency) {
  const index = urgencyArray.indexOf(oldUrgency);
  urgencyArray.splice(index, 1, newUrgency);
}
