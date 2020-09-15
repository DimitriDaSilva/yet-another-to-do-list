import { categoryArray, urgencyArray } from "../main.js";
import { changeColorStatus } from "./category-color.js";

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

    // Delete the task group
    detailsEl.remove();
  });
}
