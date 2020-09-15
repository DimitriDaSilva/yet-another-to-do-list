const clearCompletedBtn = document.querySelector("#buttons__clear");

export function setClearListener() {
  clearCompletedBtn.addEventListener("click", () => {
    const tasks = document.querySelectorAll(".task-template__item");
    tasks.forEach((task) => {
      const checked = task.querySelector("input").checked;
      if (checked) {
        task.remove();
      }
    });
  });
}
