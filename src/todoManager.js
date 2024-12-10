class TodoManager {
  constructor(ProjectClass, TodoClass) {
    // Use Dependency Injdection to allow improvalbity in the future and
    // make the classes less coupled
    this.ProjectClass = ProjectClass;
    this.TodoClass = TodoClass;

    this.defaultProject = new this.ProjectClass(
      "My Todo",
      "Default project for all todos"
    );
    this.projects = [this.defaultProject];
    this.activeProject = this.defaultProject;
  }

  createProject(name, description = "") {
    const newProject = new this.ProjectClass(name, description);
    this.projects.push(newProject);
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
    return this.activeProject.createTodo(
      title,
      description,
      due_date,
      priority,
      tags
    );
  }
}
