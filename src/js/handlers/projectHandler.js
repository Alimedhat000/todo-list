export class ProjectHandler {
  constructor(todoManager) {
    this.todoManager = todoManager;
    this.newProjectButton = document.querySelector(".menu-new-button");
    this.projectList = document.querySelector(".menu");
    this.setupEventListeners();
    // this.renderProjects();
  }

  setupEventListeners() {
    this.newProjectButton.addEventListener("click", () =>
      this.handleNewProject()
    );
    this.projectList.addEventListener("click", (e) =>
      this.handleProjectSwitch(e)
    );
  }

  handleNewProject() {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    try {
      const newProject = this.todoManager.createProject(projectName);
      this.todoManager.setActiveProject(newProject);
      this.renderProjects();
      this.clearTasksContainer();
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  }

  handleProjectSwitch(e) {
    const projectItem = e.target.closest(".menu li");
    if (!projectItem) return;

    const allProjects = this.projectList.querySelectorAll("li");
    allProjects.forEach((item) => item.classList.remove("active"));
    projectItem.classList.add("active");

    const projectName = projectItem.querySelector("span").textContent;
    const project = this.todoManager.projects.find(
      (p) => p.name === projectName
    );

    if (project) {
      this.todoManager.setActiveProject(project);
      this.updateHeader(project.name);
      this.clearTasksContainer();
      this.todoManager.renderSavedTasks();
    }
  }

  renderProjects() {
    const projects = this.todoManager.getAllProjects();
    const projectsHTML = projects
      .map((project) => this.createProjectElement(project))
      .join("");

    // Keep the empty li and new project button
    const emptyLi = this.projectList.querySelector("#empty");
    this.projectList.innerHTML = projectsHTML;
    this.projectList.appendChild(emptyLi);
  }

  createProjectElement(project) {
    const isActive = project === this.todoManager.activeProject;
    return `
        <li class="${isActive ? "active" : ""}">
          <button class="menu-button">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5.20833V3.125" stroke="currentColor" stroke-linecap="round"/>
              <circle cx="12.5" cy="12.5" r="3.66667" stroke="currentColor"/>
            </svg>
            <span>${project.name}</span>
          </button>
        </li>
      `;
  }

  clearTasksContainer() {
    const tasksContainer = document.querySelector(".tasks-container");
    tasksContainer.innerHTML = "";
  }

  updateHeader(projectName) {
    const headerTitle = document.querySelector(".header-title span");
    headerTitle.textContent = projectName;
  }
}
