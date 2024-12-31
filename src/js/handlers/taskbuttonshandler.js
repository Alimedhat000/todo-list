export class taskButtonHandler {
  constructor(todoManager) {
    this.taskContainer = document.querySelector(".tasks-container");
    this.todoManager = todoManager;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.taskContainer.addEventListener("click", (e) => {
      if (e.target.closest(".task-delete")) {
        this.handleDelete(e);
      }
    });
  }

  handleDelete(e) {
    const taskCard = e.target.closest(".task");
    if (!taskCard) return;

    const taskId = taskCard.dataset.taskId || taskCard.id;

    if (this.todoManager && this.todoManager.activeProject) {
      // Remove from TodoManager/Storage
      this.todoManager.activeProject.todos =
        this.todoManager.activeProject.todos.filter(
          (todo) => todo.id !== taskId
        );

      // Save changes
      this.todoManager.saveToStorage();

      // Remove from UI with animation
      taskCard.style.opacity = "0";
      taskCard.style.transform = "translateX(20px)";
      setTimeout(() => {
        taskCard.remove();
      }, 300);
    } else {
      console.error("TodoManager or active project is not initialized");
    }
  }
}
