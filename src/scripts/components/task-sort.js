export function sortTasks(tasksArray) {
  // Create mock urgency array to sort
  const mockUrgencyArray = ["High", "Medium", "Low", "None"];

  return tasksArray.sort(
    (a, b) =>
      mockUrgencyArray.indexOf(a.urgency) - mockUrgencyArray.indexOf(b.urgency)
  );
}
