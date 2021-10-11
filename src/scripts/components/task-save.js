import { getCheckboxColor } from "./category-color.js";

// Save everything
export function saveTasks() {
  // Set the array where we'll store the objects with task info
  const tasksArray = [];

  const liElements = document.getElementsByTagName("li");

  const liElementsLength = liElements.length;

  for (let i = 0; i < liElementsLength; i++) {
    // Get check info
    const input = liElements[i].querySelector("input");
    const checkedItem = input.checked;

    // Get task text
    const text = liElements[i].querySelector("p");
    const taskItem = text.innerText;

    // Get category
    const category = liElements[i].classList.item(1);

    // Get urgency
    const urgency = liElements[i].classList.item(2);

    // Get color from box
    const checkboxColor = getCheckboxColor(liElements[i]);

    // Put each task in an object and store them in an array
    const allItems = {
      checked: checkedItem,
      task: taskItem,
      category: category,
      urgency: urgency,
      color: checkboxColor,
    };

    tasksArray.push(allItems);
  }

  return tasksArray;
}
