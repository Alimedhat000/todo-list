export class Todo {
  static STATUS = {
    PENDING: "pending",
    IN_PROGRESS: "in progress",
    COMPLETED: "completed",
  };
  static PRIORITIES = ["low", "medium", "high"];

  constructor(
    title,
    description = "",
    due_date = null,
    priority = "low",
    tags = []
  ) {
    // Validate input
    if (!title || title.trim() === "") {
      throw new Error("Title is required");
    }

    if (!Todo.PRIORITIES.includes(priority)) {
      throw new Error(
        `Invalid priority. Must be one of: ${Todo.PRIORITIES.join(", ")}`
      );
    }
    if (due_date !== null) {
      if (!(due_date instanceof Date) || isNaN(due_date)) {
        throw new Error("Invalid due date");
      }
    }

    this.title = title;
    this.description = description;
    this.due_date = due_date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
    this.priority = priority;
    this.status = Todo.STATUS.PENDING;
    this.tags = tags;
  }
  toJSON() {
    return JSON.stringify(this);
  }

  markComplete() {
    this.status = Todo.STATUS.COMPLETED;
  }

  markInProgress() {
    this.status = Todo.STATUS.IN_PROGRESS;
  }

  addTag(tag) {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag) {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  formatDueDate() {
    return this.due_date ? this.due_date.toLocaleDateString() : "No due date";
  }

  isOverdue() {
    return (
      this.due_date &&
      this.due_date < new Date() &&
      this.status !== Todo.STATUS.COMPLETED
    );
  }

  reset() {
    this.status = Todo.STATUS.PENDING;
    this.tags = [];
  }
}
