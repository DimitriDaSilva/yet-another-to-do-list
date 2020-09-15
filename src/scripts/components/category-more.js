import { setListenerBrush } from "./category-color.js";
import { setListenerEdit } from "./category-edit-name.js";
import { setListenerTrash } from "./category-delete.js";
import { colorPalette, colorListenerHandler } from "./category-color.js";

const moreMenuTemplate = document.querySelector("#more-menu-template");

export function setListenersDots(detailsEl) {
  // Importing the template which is a document fragment
  const moreMenuTemplateNode = document.importNode(
    moreMenuTemplate.content,
    true
  );

  // We need to convert the template into a more convinient format
  const copyMoreMenu = moreMenuTemplateNode.querySelector(
    ".more-menu-template__container__buttons"
  );

  // Creating the more menu after click on dots
  detailsEl.addEventListener("click", listenerDotsHandler);

  function listenerDotsHandler(e) {
    const dotBtn = e.target;
    const summaryEl = dotBtn.parentElement;
    const classTargeted = "task-list-template__details__button";
    const hasClass = dotBtn.classList.contains(classTargeted);

    const placeholder = summaryEl.querySelector(
      ".task-list-template__details__more-menu"
    );

    if (hasClass) {
      // We need to make it appear so that we can take its measures
      // We then set its position
      // We append it with opacity 0 and turn it to 1
      placeholder.appendChild(copyMoreMenu);

      const halfHeight = copyMoreMenu.offsetHeight / 2;
      const yPosition = e.clientY - halfHeight;
      copyMoreMenu.style.top = yPosition + "px";

      // Position more menu on X axis
      const width = copyMoreMenu.offsetWidth;
      const xPosition = e.clientX - width - 10;
      copyMoreMenu.style.left = xPosition + "px";

      // Make it appear
      copyMoreMenu.style.animation = "appear 0.2s forwards ease-in-out";

      // Listening to each icon
      // We need to pass down a yPosition adjusted for the height of the contrainer
      const adjYPosition = yPosition + copyMoreMenu.offsetHeight;
      setListenerBrush(summaryEl, xPosition, adjYPosition);

      setListenerEdit(summaryEl, copyMoreMenu);

      setListenerTrash(summaryEl);

      // We are setting the listener for the click outside the menu that will make it go away
      window.addEventListener("mousedown", setListenerExitMoreMenu, true);

      function setListenerExitMoreMenu(e) {
        if (!placeholder.contains(e.target)) {
          // Removing the event listeners of the color buttons, otherwise they stack each other
          if (placeholder.childElementCount === 2) {
            colorPalette.removeEventListener(
              "click",
              colorListenerHandler,
              true
            );
          }

          placeholder.textContent = "";
        }
      }
    }
  }
}
