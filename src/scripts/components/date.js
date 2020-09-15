// Set today's date
const dateEl = document.querySelector("#top-section__date");

const todayDate = new Date();
const options = {
  weekday: "long",
  month: "long",
  day: "numeric",
};
dateEl.textContent = todayDate.toLocaleDateString("en-GB", options);
