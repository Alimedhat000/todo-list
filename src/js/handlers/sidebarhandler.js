import { makeTaskCard } from "../components/taskcardmaker";
export class sidebarHandler {
  constructor(todoManager) {
    this.todoManager = todoManager;
    this.menuToggleButton = document.querySelector(".menu-toggle-button");
    this.sidebar = document.querySelector(".sidebar");
    this.menuItems = document.querySelectorAll(".menu li:not(#empty)");
    this.headerTitle = document.querySelector(".header-title span");
    this.tasksContainer = document.querySelector(".tasks-container");
    this.headerIcon = document.querySelector(".header-title svg");
    this.svgTemplates = {
      today: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon">
                            <circle cx="12.5" cy="12.5" r="3.66667" stroke="#414141" />
                            <path d="M12.5 5.20833V3.125" stroke="#414141" stroke-linecap="round" />
                            <path d="M12.5 21.875V19.7917" stroke="#414141" stroke-linecap="round" />
                            <path d="M17.656 7.3437L19.1292 5.87056" stroke="#414141" stroke-linecap="round" />
                            <path d="M5.87092 19.1296L7.34406 17.6564" stroke="#414141" stroke-linecap="round" />
                            <path d="M19.7917 12.5L21.875 12.5" stroke="#414141" stroke-linecap="round" />
                            <path d="M3.12501 12.5L5.20834 12.5" stroke="#414141" stroke-linecap="round" />
                            <path d="M17.656 17.6563L19.1292 19.1294" stroke="#414141" stroke-linecap="round" />
                            <path d="M5.87092 5.87041L7.34406 7.34355" stroke="#414141" stroke-linecap="round" />
                        </svg>`,
      important: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon">
                            <path
                                d="M10.5664 6.90372C11.3858 4.86101 11.7955 3.83966 12.5 3.83966C13.2045 3.83966 13.6142 4.86101 14.4336 6.90372L14.4717 6.99884C14.9346 8.15287 15.1661 8.72989 15.6378 9.0806C16.1095 9.43132 16.7288 9.48678 17.9672 9.59769L18.1911 9.61774C20.218 9.79927 21.2314 9.89003 21.4483 10.5348C21.6651 11.1796 20.9125 11.8643 19.4073 13.2338L18.9049 13.6908C18.1429 14.3841 17.7619 14.7307 17.5843 15.185C17.5512 15.2697 17.5237 15.3566 17.5019 15.4449C17.3852 15.9185 17.4967 16.4214 17.7199 17.4271L17.7893 17.7401C18.1994 19.5884 18.4044 20.5125 18.0464 20.9111C17.9127 21.0601 17.7388 21.1673 17.5457 21.22C17.0288 21.361 16.295 20.7631 14.8273 19.5672C13.8636 18.7819 13.3817 18.3892 12.8285 18.3009C12.6109 18.2661 12.3891 18.2661 12.1715 18.3009C11.6183 18.3892 11.1364 18.7819 10.1727 19.5672C8.70504 20.7631 7.97121 21.361 7.45433 21.22C7.26119 21.1673 7.08733 21.0601 6.95355 20.9111C6.59555 20.5125 6.80059 19.5884 7.21067 17.7401L7.28012 17.4271C7.50326 16.4214 7.61482 15.9185 7.4981 15.4449C7.47633 15.3566 7.44879 15.2697 7.41566 15.185C7.23809 14.7307 6.85709 14.3841 6.09511 13.6908L5.59273 13.2338C4.08748 11.8643 3.33485 11.1796 3.5517 10.5348C3.76856 9.89003 4.782 9.79927 6.80889 9.61774L7.03278 9.59769C8.27124 9.48678 8.89046 9.43132 9.36218 9.0806C9.8339 8.72989 10.0654 8.15287 10.5283 6.99884L10.5664 6.90372Z"
                                stroke="#414141" />
                        </svg>`,
      planned: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon">
                            <path d="M17.7083 3.125L17.7083 7.29167" stroke="#414141" stroke-width="1"
                                stroke-linecap="round" />
                            <path d="M7.29166 3.125L7.29166 7.29167" stroke="#414141" stroke-width="1"
                                stroke-linecap="round" />
                            <path
                                d="M3.125 10.25C3.125 8.36438 3.125 7.42157 3.71079 6.83579C4.29657 6.25 5.23938 6.25 7.125 6.25H17.875C19.7606 6.25 20.7034 6.25 21.2892 6.83579C21.875 7.42157 21.875 8.36438 21.875 10.25V11.4583H3.125V10.25Z"
                                stroke="#414141" stroke-width="1" />
                            <rect x="3.125" y="6.25" width="18.75" height="15.625" rx="2" stroke="#414141"
                                stroke-width="1" />
                            <path d="M6.25 15.625H10.4167" stroke="#414141" stroke-width="1" stroke-linecap="round" />
                            <path d="M14.5833 15.625H18.75" stroke="#414141" stroke-width="1" stroke-linecap="round" />
                            <path d="M6.25 18.75H10.4167" stroke="#414141" stroke-width="1" stroke-linecap="round" />
                            <path d="M14.5833 18.75H18.75" stroke="#414141" stroke-width="1" stroke-linecap="round" />
                        </svg>`,
      home: `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="header-icon">
                            <path
                                d="M5.20834 13.2913C5.20834 11.8769 5.20834 11.1698 5.49424 10.5482C5.78014 9.92656 6.31706 9.46634 7.3909 8.54591L8.43256 7.65305C10.3735 5.98937 11.344 5.15754 12.5 5.15754C13.656 5.15754 14.6265 5.98937 16.5675 7.65305L17.6091 8.54591C18.683 9.46634 19.2199 9.92656 19.5058 10.5482C19.7917 11.1698 19.7917 11.8769 19.7917 13.2913V17.7083C19.7917 19.6725 19.7917 20.6546 19.1815 21.2648C18.5713 21.875 17.5892 21.875 15.625 21.875H9.37501C7.41082 21.875 6.42873 21.875 5.81854 21.2648C5.20834 20.6546 5.20834 19.6725 5.20834 17.7083V13.2913Z"
                                stroke="#414141" />
                            <path
                                d="M15.1042 21.875V16.625C15.1042 16.0727 14.6565 15.625 14.1042 15.625H10.8958C10.3436 15.625 9.89584 16.0727 9.89584 16.625V21.875"
                                stroke="#414141" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>`,
      newlist: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 8H19M8 12H19M8 16H19M5 8V8.00999M5 12V12.01M5 16V16.01" stroke="#868583" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>`,
    };
    this.initializeState();
    this.setupEventListeners();
  }

  initializeState() {
    // Load saved sidebar state
    const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    if (isCollapsed) {
      this.sidebar.classList.add("collapsed");
      this.menuToggleButton.classList.add("rotated");
    }
    this.setupProjectDialogs();
    // Load and render saved projects
    this.renderSavedProjects();
  }

  renderSavedProjects() {
    const projectsList = document.querySelector(".projects-list");
    projectsList.innerHTML = ""; // Clear existing projects

    this.todoManager.getAllProjects().forEach((project) => {
      console.log("Project:", project);
      if (project !== this.todoManager.defaultProject) {
        // Skip default project
        this.addProjectToSidebar(project);
      }
    });
  }

  setupProjectDialogs() {
    // Create dialog elements
    const newProjectDialog = document.createElement("dialog");
    newProjectDialog.innerHTML = `
      <form method="dialog">
        <h3>New Project</h3>
        <input type="text" id="newProjectName" placeholder="Project name" required>
        <input type="text" id="newProjectDesc" placeholder="Description (optional)">
        <div class="dialog-buttons">
          <button type="submit">Create</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    `;
    document.body.appendChild(newProjectDialog);

    const renameProjectDialog = document.createElement("dialog");
    renameProjectDialog.innerHTML = `
      <form method="dialog">
        <h3>Rename Project</h3>
        <input type="text" id="renameProjectName" placeholder="New name" required>
        <input type="text" id="renameProjectDesc" placeholder="New description">
        <div class="dialog-buttons">
          <button type="submit">Rename</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    `;
    document.body.appendChild(renameProjectDialog);

    this.newProjectDialog = newProjectDialog;
    this.renameProjectDialog = renameProjectDialog;

    // Add delete confirmation dialog
    const deleteConfirmDialog = document.createElement("dialog");
    deleteConfirmDialog.innerHTML = `
      <form method="dialog">
        <h3>Delete Project</h3>
        <p>Are you sure you want to delete this project and all its tasks?</p>
        <div class="dialog-buttons">
          <button type="submit" class="delete-btn">Delete</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </div>
      </form>
    `;
    document.body.appendChild(deleteConfirmDialog);
    this.deleteConfirmDialog = deleteConfirmDialog;
    this.setupDialogListeners(deleteConfirmDialog);

    // Add alert dialog for default project
    const alertDialog = document.createElement("dialog");
    alertDialog.innerHTML = `
      <form method="dialog">
        <h3>Cannot Delete Project</h3>
        <p>The default projects cannot be deleted.</p>
        <div class="dialog-buttons">
          <button type="submit" class="ok-btn">OK</button>
        </div>
      </form>
    `;
    document.body.appendChild(alertDialog);
    this.alertDialog = alertDialog;

    // Set up dialog event listeners
    this.setupDialogListeners(newProjectDialog);
    this.setupDialogListeners(renameProjectDialog);
  }

  setupDialogListeners(dialog) {
    dialog.querySelector(".cancel-btn").addEventListener("click", () => {
      dialog.close();
    });
  }

  setupEventListeners() {
    // Toggle sidebar
    this.menuToggleButton.addEventListener("click", () => {
      this.sidebar.classList.toggle("collapsed");
      this.menuToggleButton.classList.toggle("rotated");
      localStorage.setItem(
        "sidebarCollapsed",
        this.sidebar.classList.contains("collapsed")
      );
    });

    // Handle menu item clicks
    document
      .querySelector("#todayButton")
      .addEventListener("click", () => this.handleTodayView());
    document
      .querySelector("#ImportantButton")
      .addEventListener("click", () => this.handleImportantView());
    document
      .querySelector("#PlannedButton")
      .addEventListener("click", () => this.handlePlannedView());
    document
      .querySelector("#homeButton")
      .addEventListener("click", () => this.handleHomeView());
    // Keyboard navigation
    this.sidebar.addEventListener("keydown", (e) =>
      this.handleKeyboardNavigation(e)
    );

    // Close sidebar on mobile when clicking outside
    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 768 &&
        !this.sidebar.contains(e.target) &&
        !this.menuToggleButton.contains(e.target)
      ) {
        this.sidebar.classList.add("collapsed");
        this.menuToggleButton.classList.add("rotated");
      }
    });

    // Add new project button handler
    document.querySelector(".menu-new-button").addEventListener("click", () => {
      this.handleNewProject();
    });

    // Add project rename handler
    document.addEventListener("contextmenu", (e) => {
      const projectItem = e.target.closest(".project-item");
      if (projectItem) {
        e.preventDefault();
        this.handleProjectRename(projectItem.dataset.projectId);
      }
    });

    // Replace confirm prompt with dialog
    const deleteButton = document.querySelector(".header-delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", () => {
        if (
          this.todoManager.activeProject === this.todoManager.defaultProject
        ) {
          // Show custom alert dialog instead of browser alert
          this.alertDialog.showModal();
          return;
        }

        const projectToDelete = this.todoManager.activeProject;
        this.deleteConfirmDialog.showModal();

        const handleDelete = (e) => {
          e.preventDefault();

          const projectElement = document.querySelector(
            `.project-item[data-project-id="${projectToDelete.id}"]`
          );
          if (projectElement) {
            projectElement.remove();
          }

          this.todoManager.removeProject(projectToDelete);
          this.handleHomeView();
          this.deleteConfirmDialog.close();
        };

        // Remove old event listener if exists
        const form = this.deleteConfirmDialog.querySelector("form");
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        // Add new event listener
        newForm.addEventListener("submit", handleDelete);
      });
    }
  }

  handleHomeView() {
    this.updateActiveMenu("#homeButton");
    this.headerTitle.textContent = "Home";
    this.headerIcon.innerHTML = this.svgTemplates.home;
    const defaultProject = this.todoManager.projects[0];
    this.handleProjectSwitch(defaultProject);
  }

  handleMenuItemClick(item) {
    this.menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      this.sidebar.classList.add("collapsed");
      this.menuToggleButton.classList.add("rotated");
    }
  }

  handleKeyboardNavigation(e) {
    const activeItem = document.querySelector(".menu li.active");
    if (!activeItem) return;
    const prev = activeItem.previousElementSibling;
    const next = activeItem.nextElementSibling;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();

        if (prev && prev.id !== "empty") prev.click();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (next && next.id !== "empty") next.click();
        break;
    }
  }
  handleTodayView() {
    this.updateActiveMenu("#todayButton");
    this.headerTitle.textContent = "Today";
    this.headerIcon.innerHTML = this.svgTemplates.today;
    const todayTodos = this.todoManager.getTodayTodos();
    this.renderFilteredTodos(todayTodos);
  }

  handleImportantView() {
    this.updateActiveMenu("#ImportantButton");
    this.headerTitle.textContent = "Important";
    this.headerIcon.innerHTML = this.svgTemplates.important;
    const importantTodos = this.todoManager.getImportantTodos();
    this.renderFilteredTodos(importantTodos);
  }

  handlePlannedView() {
    this.updateActiveMenu("#PlannedButton");
    this.headerTitle.textContent = "Planned";
    this.headerIcon.innerHTML = this.svgTemplates.planned;
    const plannedTodos = this.todoManager.getPlannedTodos();
    this.renderFilteredTodos(plannedTodos);
  }

  updateActiveMenu(selector) {
    this.menuItems.forEach((item) => item.classList.remove("active"));
    const activeItem = document.querySelector(selector).closest("li");
    activeItem.classList.add("active");
  }

  renderFilteredTodos(todos) {
    this.tasksContainer.innerHTML = "";
    todos.forEach((todo) => {
      const taskCard = makeTaskCard(todo);
      this.tasksContainer.appendChild(taskCard);
    });
  }

  handleNewProject() {
    this.newProjectDialog.showModal();

    this.newProjectDialog.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("newProjectName").value;
      const description = document.getElementById("newProjectDesc").value;

      const newProject = this.todoManager.createProject(name, description);
      this.addProjectToSidebar(newProject);
      this.newProjectDialog.close();

      // Clear form
      e.target.reset();
    };
  }

  handleProjectRename(projectId) {
    const project = this.todoManager.findProject(projectId);
    if (!project) return;

    const nameInput = document.getElementById("renameProjectName");
    const descInput = document.getElementById("renameProjectDesc");

    nameInput.value = project.name;
    descInput.value = project.description;

    this.renameProjectDialog.showModal();

    this.renameProjectDialog.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const newName = nameInput.value;
      const newDesc = descInput.value;

      this.todoManager.updateProject(project, newName, newDesc);
      this.updateProjectInSidebar(project);
      this.renameProjectDialog.close();

      // Clear form
      e.target.reset();
    };
  }

  addProjectToSidebar(project) {
    const projectsList = document.querySelector(".projects-list");
    const projectItem = document.createElement("li");
    projectItem.className = "project-item";
    projectItem.dataset.projectId = project.id;
    projectItem.innerHTML = `<button class="menu-button" id="${project.id}">
                                ${this.svgTemplates.newlist}
                                <span>${project.name}</span>
                              </button>
    `;

    // Add click handler for project switching
    projectItem.querySelector("button").addEventListener("click", () => {
      this.handleProjectSwitch(project);
    });
    projectsList.appendChild(projectItem);
  }

  handleProjectSwitch(project) {
    // Update active project in TodoManager
    this.todoManager.setActiveProject(project);

    // Update UI
    this.updateActiveProject(project);
    this.headerTitle.textContent = project.name;
    this.headerIcon.innerHTML = this.svgTemplates.newlist;

    // Render todos for the selected project
    this.renderProjectTodos();
  }

  updateActiveProject(project) {
    // Remove active class from all projects
    document.querySelectorAll(".project-item").forEach((item) => {
      item.classList.remove("active");
    });

    // Add active class to selected project
    const projectItem = document.querySelector(
      `.project-item[data-project-id="${project.id}"]`
    );
    if (projectItem) {
      projectItem.classList.add("active");
    }

    // Remove active class from menu items
    this.menuItems.forEach((item) => item.classList.remove("active"));
  }

  renderProjectTodos() {
    const nonCompletedTodos = this.todoManager.activeProject.todos.filter(
      (todo) => todo.status !== "completed"
    );
    this.renderFilteredTodos(nonCompletedTodos);

    // Update completed section
    this.updateCompletedSection();
  }

  updateCompletedSection() {
    const completedTodos = this.todoManager.getCompletedTodos();
    const completedCount = document.querySelector(".task-count");
    if (completedCount) {
      completedCount.textContent = completedTodos.length;
    }

    const completedTasksContainer = document.getElementById("completedTasks");
    if (completedTasksContainer) {
      completedTasksContainer.innerHTML = "";
      completedTodos.forEach((todo) => {
        const taskCard = makeTaskCard(todo);
        completedTasksContainer.appendChild(taskCard);
      });
    }
  }

  updateProjectInSidebar(project) {
    const projectItem = document.querySelector(
      `.project-item[data-project-id="${project.id}"]`
    );
    if (projectItem) {
      projectItem.querySelector("span").textContent = project.name;
    }
  }
}
