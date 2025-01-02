import { StorageService } from "./storageservice";
import { makeTaskCard } from "../components/taskcardmaker";

export class TodoManager {
  constructor(ProjectClass, TodoClass) {
    // Use Dependency Injdection to allow improvalbity in the future and
    // make the classes less coupled
    this.ProjectClass = ProjectClass;
    this.TodoClass = TodoClass;
    this.projects = [];
    this.activeProject = null;
    this.loadFromStorage();
    this.renderSavedTasks();
  }

  loadFromStorage() {
    const savedProjects = StorageService.loadProjects();

    if (savedProjects.length === 0) {
      this.defaultProject = new this.ProjectClass("Home", "Default project");
      this.projects = [this.defaultProject];
      this.activeProject = this.defaultProject;
    } else {
      this.projects = savedProjects.map((projectData) => {
        const project = new this.ProjectClass(
          projectData.name,
          projectData.description
        );
        project.id = projectData.id;
        project.todos = projectData.todos.map((todoData) => {
          console.log("Todo data being loaded:", todoData);
          console.log("Tags from storage:", todoData.tags);
          const todo = new this.TodoClass(
            todoData.title,
            todoData.description,
            new Date(todoData.due_date),
            todoData.priority,
            todoData.tags
          );
          todo.id = todoData.id;
          todo.status = todoData.status;
          console.log("Created todo object:", todo);
          console.log("Tags after creation:", todo.tags);
          return todo;
        });
        return project;
      });
      this.activeProject = this.projects[0];
    }
    this.saveToStorage();
  }

  renderSavedTasks() {
    const tasksContainer = document.querySelector(".tasks-container");
    tasksContainer.innerHTML = ""; // Clear existing content

    if (this.activeProject && this.activeProject.todos.length > 0) {
      this.activeProject.todos.forEach((todo) => {
        if (todo.status === "completed") return;
        const taskCard = makeTaskCard(todo);
        tasksContainer.appendChild(taskCard);
      });
    }
  }

  saveToStorage() {
    StorageService.saveProjects(this.projects);
  }

  createProject(name, description = "") {
    const newProject = new this.ProjectClass(name, description);
    this.projects.push(newProject);
    this.saveToStorage();
    return newProject;
  }

  setActiveProject(project) {
    if (!(project instanceof this.ProjectClass)) {
      throw new Error("invalid Project");
    }
    this.activeProject = project;
  }

  getAllProjects() {
    return [...this.projects];
  }

  removeProject(project) {
    if (project === this.defaultProject) {
      throw new Error("Cannot Remove Default Project");
    }
    this.projects = this.projects.filter((p) => p !== project);

    // Handle active project when removed
    if (project === this.activeProject) {
      this.activeProject = this.projects[0] || null;
    }

    this.saveToStorage();
  }

  createTodo(title, description = "", due_date = null, priority = "low", tags) {
    if (!this.TodoClass.PRIORITIES.includes(priority)) {
      throw new Error(
        `Invalid priority. Allowed priorities are: ${this.TodoClass.PRIORITIES.join(
          ", "
        )}`
      );
    }
    const todo = this.activeProject.createTodo(
      title,
      description,
      due_date,
      priority,
      tags
    );
    this.saveToStorage();
    return todo;
  }

  updateProject(project, name, description) {
    project.name = name;
    project.description = description;
    this.saveToStorage();
  }

  updateTodo(todo, updates) {
    Object.assign(todo, updates);
    this.saveToStorage();
  }

  removeTodo(id) {
    this.activeProject.todos = this.activeProject.todos.filter(
      (t) => t.id !== id
    );
    this.saveToStorage();
  }
  findtask(id) {
    return this.activeProject.todos.find((todo) => todo.id === id);
  }

  toggleTodoStatus(todoId) {
    const todo = this.findtask(todoId);
    if (!todo) throw new Error("Todo not found");

    todo.status = todo.status === "completed" ? "pending" : "completed";
    this.saveToStorage();
    return todo;
  }

  getCompletedTodos() {
    return this.activeProject.todos.filter(
      (todo) => todo.status === "completed"
    );
  }

  getTodayTodos() {
    const today = new Date();
    return this.activeProject.todos.filter((todo) => {
      if (!todo.dateObj) return false;
      return todo.dateObj.toDateString() === today.toDateString();
    });
  }

  getImportantTodos() {
    return this.activeProject.todos.filter((todo) => todo.priority === "high");
  }

  getPlannedTodos() {
    return this.activeProject.todos.filter((todo) => todo.dateObj !== null);
  }
}
