// Set a loop listening to all crosses
export function setListenersCrosses() {
  const crossDeleteBtns = document.getElementsByClassName(
    "task-template__item__cross"
  );
  for (let i = 0; i < crossDeleteBtns.length; i++) {
    const cross = crossDeleteBtns[i];
    cross.addEventListener("click", () => {
      const crossId = cross.id;
      const tasks = document.querySelectorAll(".task-template__item");
      tasks.forEach((task) => {
        const inputId = task.querySelector("input").id;
        if (inputId === crossId) {
          task.remove();
        }
      });
    });
  }
}
