export class StorageService {
  static save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static load(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static removeProjects() {
    localStorage.removeItem("projects");
  }

  static saveProjects(projects) {
    if (projects.length === 0) {
      this.removeProjects();
      return;
    }

    this.save(
      "projects",
      projects.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        todos: project.todos.map((todo) => ({
          title: todo.title,
          description: todo.description,
          due_date: todo.due_date,
          priority: todo.priority,
          tags: todo.tags,
          status: todo.status,
        })),
      }))
    );
  }

  static loadProjects() {
    return this.load("projects") || [];
  }
}
