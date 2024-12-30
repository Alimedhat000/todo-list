import { Todo } from "./todo";

export class Project {
  constructor(name, description = "") {
    if (!name || name.trim() === "") {
      throw new Error("Project name is required");
    }
    this.id = Project.generateId();
    this.name = name.trim();
    this.description = description;
    this.todos = [];
    this.createdAt = new Date();
  }

  // Static method to generate unique project ID
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  addTodo(todo) {
    if (!(todo instanceof Todo)) {
      throw new Error("Can only add Todo instances to the TodoList");
    }
    this.todos.push(todo);
    return todo;
  }

  createTodo(
    title,
    description = "",
    due_date = null,
    priority = "low",
    tags = []
  ) {
    const newTodo = new Todo(title, description, due_date, priority, tags);
    this.todos.push(newTodo);
    return newTodo;
  }

  removeTodo(todo) {
    this.todos = this.todos.filter((t) => t !== todo);
  }

  getAllTodos() {
    return [...this.todos];
  }

  getTodosByStatus(status) {
    return this.todos.filter((todo) => todo.status === status);
  }

  getTodosByPriority(priority) {
    return this.todos.filter((todo) => todo.priority === priority);
  }

  getTodosByTag(tag) {
    return this.todos.filter((todo) => todo.tags.includes(tag));
  }

  getOverdueTodos() {
    return this.todos.filter((todo) => todo.isOverdue());
  }

  getTodosByDueDate(date) {
    return this.todos.filter(
      (todo) =>
        todo.due_date && todo.due_date.toDateString() === date.toDateString()
    );
  }
}
