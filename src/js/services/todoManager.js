import { StorageService } from "./storageservice";

export class TodoManager {
  constructor(ProjectClass, TodoClass) {
    // Use Dependency Injdection to allow improvalbity in the future and
    // make the classes less coupled
    this.ProjectClass = ProjectClass;
    this.TodoClass = TodoClass;

    // this.defaultProject = new this.ProjectClass(
    //   "Home",
    //   "Default project for all todos"
    // );
    // this.projects = [this.defaultProject];
    this.projects = [];
    // this.activeProject = this.defaultProject;
    this.activeProject = null;
    this.loadFromStorage();
  }

  loadFromStorage() {
    const savedProjects = StorageService.loadProjects();

    // If there are no saved projects, create a default project
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
          const todo = new this.TodoClass(
            todoData.title,
            todoData.description,
            new Date(todoData.due_date),
            todoData.priority,
            todoData.tags
          );
          todo.status = todoData.status;
          return todo;
        });
        return project;
      });
      this.activeProject = this.projects[0];
    }
    this.saveToStorage();
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

  createTodo(
    title,
    description = "",
    due_date = null,
    priority = "low",
    tags = []
  ) {
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

  removeTodo(todo) {
    this.activeProject.todos = this.activeProject.todos.filter(t => t !== todo);
    this.saveToStorage();
  }
}
