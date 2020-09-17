import swal from "sweetalert";

const categoryInput = document.querySelector("#add-new-task__category__input");
const urgencyInput = document.querySelector("#add-new-task__urgency__input");

export function isValid(input) {
  if (!isTaskValid(input.task)) {
    return false;
  } else if (!isCategoryValid(input.category)) {
    return false;
  } else if (!isUrgencyValid(input.urgency)) {
    return false;
  } else {
    return true;
  }
}

function isTaskValid(task) {
  return task !== "";
}

const regex = /\s/;

function isCategoryValid(category) {
  if (regex.test(category)) {
    categoryInput.style.boxShadow = "inset 0 0 0 0.5px red";
    swal({
      title: "Error",
      text: "No whitespaces allowed in the category and urgency level",
      icon: "error",
      button: false,
    });
    return false;
  } else {
    categoryInput.style.boxShadow = "none";
    return true;
  }
}

function isUrgencyValid(urgency) {
  if (regex.test(urgency)) {
    urgencyInput.style.boxShadow = "inset 0 0 0 0.5px red";
    swal({
      title: "Error",
      text: "No whitespaces allowed in the category and urgency level",
      icon: "error",
      button: false,
    });
    return false;
  } else {
    urgencyInput.style.boxShadow = "none";
    return true;
  }
}

export function defaultCategory(category) {
  if (category === "") {
    return "Inbox";
  }
  return category;
}

export function defaultUrgency(urgency) {
  if (urgency === "") {
    return "None";
  }
  return urgency;
}
