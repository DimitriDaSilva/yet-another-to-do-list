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

      moreMenu.parentElement.remove();

      resolve({ pElement: pElement, details: details });
    });
  });
}

function setCheckEditEnd(pElement, details) {
  return new Promise((resolve) => {
    pElement.addEventListener("keydown", (e) => {
      if (e.keyCode === 13) {
        details.removeEventListener("click", disableToggle, true);
        pElement.setAttribute("contenteditable", false);
      }
    });

    window.addEventListener("mousedown", (e) => {
      if (!pElement.contains(e.target)) {
        details.removeEventListener("click", disableToggle, true);
        pElement.setAttribute("contenteditable", false);
      }
    });
    resolve(pElement);
  });
}

function disableToggle(e) {
  e.preventDefault();
}
