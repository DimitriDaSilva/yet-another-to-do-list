export function sortTasks(tasksArray) {
  // Create mock urgency array to sort
  const MockUrgencyArray = ["High", "Medium", "Low", "None"];

  return tasksArray.sort(
    (a, b) =>
      MockUrgencyArray.indexOf(a.urgency) - MockUrgencyArray.indexOf(b.urgency)
  );
}
