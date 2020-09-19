import { filterMode } from "./filter.js";

// Adding new option to datalist When new category is inputed
export function addOptionToDatalist(userInput, type) {
  // Get existing option data list
  const id = `add-new-task__${type}__list`;
  const datalist = document.getElementById(id);
  const options = datalist.querySelectorAll("option");
  const optionsArray = [];

  options.forEach((option) => {
    optionsArray.push(option.value);
  });

  // Check if inputed category already exist. If not, add it
  if (optionsArray.indexOf(userInput) !== -1) {
    return;
  } else {
    const newOption = document.createElement("option");
    newOption.value = userInput;
    datalist.appendChild(newOption);
  }
}

export function deleteOptionDatalist(optionToBeDeleted) {
  // Delete the option passed in as parameter
  const id = `add-new-task__${filterMode}__list`;
  const datalist = document.getElementById(id);
  const options = datalist.querySelectorAll("option");

  options.forEach((option) => {
    if (option.value === optionToBeDeleted) {
      option.remove();
      return;
    }
  });
}

export function updateOptionDatalist(oldOption, newOption) {
  // Delete the option passed in as parameter
  const id = `add-new-task__${filterMode}__list`;
  const datalist = document.getElementById(id);
  const options = datalist.querySelectorAll("option");

  options.forEach((option) => {
    if (option.value === oldOption) {
      option.value = newOption;
      return;
    }
  });
}
