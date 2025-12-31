export const initialData = {
  columns: {
    todo: { id: "todo", title: "TO DO", taskIds: ["KAN-1"] },
    progress: { id: "progress", title: "IN PROGRESS", taskIds: ["KAN-2"] },
    review: { id: "review", title: "IN REVIEW", taskIds: [] },
    done: { id: "done", title: "DONE", taskIds: [] },
  },

  tasks: {
    "KAN-1": {
      id: "KAN-1",
      title: "Task 1",
      assignee: "GC",
      date: "Jan 3, 2026",
    },
    "KAN-2": {
      id: "KAN-2",
      title: "Task 2",
      assignee: "GC",
      date: "Jan 8, 2026",
    },
  },

  columnOrder: ["todo", "progress", "review", "done"],
};
