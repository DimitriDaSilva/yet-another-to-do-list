import { categoryArray, urgencyArray } from "../index.js";
import { changeColorStatus, deleteColorPair } from "./category-color.js";
import { filterMode } from "./filter.js";
import { deleteOptionDatalist } from "./dropdown-list.js";

export function setListenerTrash(summaryEl) {
  const trashIcon = document.querySelector(
    ".more-menu-template__container__trash"
  );

  const detailsEl = summaryEl.parentElement;
  const classDetailsEl = detailsEl.classList.item(1);
  trashIcon.addEventListener("click", (e) => {
    // Delete the category from array
    if (categoryArray.indexOf(classDetailsEl) !== -1) {
      const indexCat = categoryArray.indexOf(classDetailsEl);
      categoryArray.splice(indexCat, 1);
    } else {
      const indexUrg = urgencyArray.indexOf(classDetailsEl);
      urgencyArray.splice(indexUrg, 1);
    }

    // Pass the color used as not used
    changeColorStatus(summaryEl);
    deleteColorPair(filterMode, classDetailsEl);

    // Delete the option from dropdown list
    deleteOptionDatalist(classDetailsEl);

    // Delete the task group
    detailsEl.remove();
  });
}
