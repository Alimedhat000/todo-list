import { makeTaskCard } from "../components/taskcardmaker";
import { createEditTaskCard } from "../components/taskeditormaker";

export class taskButtonHandler {
  constructor(todoManager) {
    this.taskContainer = document.querySelector(".tasks-container");
    this.completedbutton = document.querySelector(".completed-button");
    this.completedTasks = document.querySelector("#completedTasks");
    this.completedContainer = document.getElementById("completedTasks");
    this.taskCount = document.querySelector(".task-count");
    this.todoManager = todoManager;
    this.currentPriority = "none";
    this.currentTags = new Set();
    this.updateCompletedCount();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.completedbutton.addEventListener("click", () =>
      this.handleCompleted()
    );

    [this.taskContainer, this.completedContainer].forEach((container) => {
      container.addEventListener("click", (e) => {
        if (e.target.closest(".task-checkbox")) {
          this.handleTaskCheck(e);
        }
        if (e.target.closest(".task-delete")) {
          this.handleDelete(e);
        }
        if (e.target.closest(".task-editor")) {
          this.handleEdit(e);
        }
      });
    });
  }

  handleTaskCheck(e) {
    const taskElement = e.target.closest(".task");
    if (!taskElement) return;

    const taskId = taskElement.id;
    const task = this.todoManager.toggleTodoStatus(taskId);
    const checkbox = taskElement.querySelector(".task-checkbox");

    if (task.status === "completed") {
      taskElement.classList.add("completed");
      checkbox.classList.add("checked");
      taskElement.style.opacity = "0";
      taskElement.style.transform = "translateY(20px)";
      setTimeout(() => {
        taskElement.remove();
        if (this.completedContainer.classList.contains("show")) {
          this.renderCompletedTasks();
        }
      }, 300);
    } else {
      taskElement.classList.remove("completed");
      checkbox.classList.remove("checked");
      taskElement.style.opacity = "0";
      taskElement.style.transform = "translateY(-20px)";
      setTimeout(() => {
        taskElement.remove();
        this.taskContainer.prepend(taskElement);
        taskElement.style.opacity = "1";
        taskElement.style.transform = "translateY(0)";
      }, 300);
    }
    this.updateCompletedCount();
  }

  updateCompletedCount() {
    const completedCount = this.todoManager.getCompletedTodos().length;
    this.taskCount.textContent = completedCount;
  }

  handleCompleted() {
    const chevron = document.querySelector(".chevron");
    chevron.classList.toggle("expanded");
    this.completedTasks.classList.toggle("show");
    if (this.completedContainer.classList.contains("show")) {
      this.renderCompletedTasks();
    }
  }

  renderCompletedTasks() {
    const completedTasks = this.todoManager.getCompletedTodos();
    this.completedContainer.innerHTML = "";

    completedTasks.forEach((task) => {
      const taskCard = makeTaskCard(task);
      taskCard.classList.add("completed");
      this.completedContainer.appendChild(taskCard);
    });
  }

  handleEdit(e) {
    const taskCard = e.target.closest(".task");
    if (!taskCard) return;

    const taskId = taskCard.id;
    const task = this.todoManager.findtask(taskId);
    if (!task) {
      console.error("Task not found");
      return;
    }

    const editForm = createEditTaskCard(task);
    taskCard.replaceWith(editForm);

    this.currentPriority = task.priority;
    this.currentTags = new Set(task.tags);

    this.initializeDropdowns(editForm);
    this.setupFormHandlers(editForm, taskCard, task);
  }

  initializeDropdowns(editForm) {
    const priorityDropdown = editForm.querySelector("#priorityDropdown");
    const tagsDropdown = editForm.querySelector("#tagsDropdown");

    // Initialize priority dropdown
    this.initializePriorityDropdown(priorityDropdown, tagsDropdown);

    // Initialize tags dropdown
    this.initializeTagsDropdown(tagsDropdown, priorityDropdown);

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    });
  }

  initializePriorityDropdown(priorityDropdown, tagsDropdown) {
    const button = priorityDropdown.querySelector("button");
    const dropdownContent = priorityDropdown.querySelector(".dropdown-content");

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        tagsDropdown
          .querySelector(".dropdown-content")
          .classList.contains("show")
      ) {
        tagsDropdown
          .querySelector(".dropdown-content")
          .classList.remove("show");
      }
      dropdownContent.classList.toggle("show");
    });

    dropdownContent.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.currentPriority = item.dataset.priority;

        const svg = button.querySelector("svg").outerHTML;
        button.innerHTML = `${svg} ${item.textContent}`;
        button.style.color = getComputedStyle(item).color;

        dropdownContent
          .querySelectorAll(".dropdown-item")
          .forEach((i) => i.classList.remove("selected"));
        item.classList.add("selected");
        dropdownContent.classList.remove("show");
      });
    });
  }

  initializeTagsDropdown(tagsDropdown, priorityDropdown) {
    const button = tagsDropdown.querySelector("button");
    const dropdownContent = tagsDropdown.querySelector(".dropdown-content");
    const newTagInput = dropdownContent.querySelector("input");

    button.addEventListener("click", (e) => {
      e.stopPropagation();
      if (
        priorityDropdown
          .querySelector(".dropdown-content")
          .classList.contains("show")
      ) {
        priorityDropdown
          .querySelector(".dropdown-content")
          .classList.remove("show");
      }
      dropdownContent.classList.toggle("show");
    });

    if (newTagInput) {
      // Add check for newTagInput
      this.setupNewTagInput(newTagInput);
    }
    this.setupExistingTags(dropdownContent);

    // Prevent dropdown from closing when typing
    dropdownContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  setupNewTagInput(newTagInput) {
    newTagInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && newTagInput.value.trim()) {
        const tagName = newTagInput.value.trim();
        const dropdownContentElement = newTagInput.closest(".dropdown-content");
        this.addNewTag(tagName, dropdownContentElement);
        newTagInput.value = "";
        this.updateTagsButton();
      }
    });
  }

  setupExistingTags(dropdownContent) {
    dropdownContent
      .querySelectorAll(".dropdown-item:not(:first-child)")
      .forEach((item) => {
        const tagName = item.querySelector("span").textContent;
        const deleteButton = item.querySelector("button");

        if (deleteButton) {
          deleteButton.addEventListener("click", (e) => {
            e.stopPropagation();
            this.deleteTag(item, tagName);
          });
        }

        item.addEventListener("click", (e) => {
          if (
            e.target !== deleteButton &&
            e.target !== deleteButton.querySelector("svg")
          ) {
            e.stopPropagation();
            item.classList.toggle("selected");
            if (item.classList.contains("selected")) {
              this.currentTags.add(tagName);
            } else {
              this.currentTags.delete(tagName);
            }
            this.updateTagsButton();
          }
        });
      });
  }

  setupFormHandlers(editForm, originalCard, task) {
    const cancelButton = editForm.querySelector(".cancel-button");
    const saveButton = editForm.querySelector(".add-task-button");

    cancelButton.addEventListener("click", () => {
      editForm.replaceWith(originalCard);
    });

    saveButton.addEventListener("click", () => {
      const updates = {
        title: editForm.querySelector(".task-input").value,
        description: editForm.querySelector(".task-description").value,
        dateObj: new Date(editForm.querySelector('input[type="date"]').value),
        due_date: new Date(
          editForm.querySelector('input[type="date"]').value
        ).toLocaleDateString("en-US", { month: "short", day: "2-digit" }),
        priority: this.currentPriority,
        tags: Array.from(this.currentTags),
      };

      this.todoManager.updateTodo(task, updates);
      editForm.replaceWith(makeTaskCard(task));
    });
  }

  addNewTag(tagName, dropdownContent) {
    const newTag = document.createElement("div");
    newTag.className = "dropdown-item";

    const tagSpan = document.createElement("span");
    tagSpan.textContent = tagName;

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9.89575 15.1042L9.89575 11.9792" stroke="#d84c4c"
                                            stroke-linecap="round" />
                                        <path d="M15.1042 15.1042L15.1042 11.9792" stroke="#d84c4c"
                                            stroke-linecap="round" />
                                        <path
                                            d="M3.125 6.77083H21.875V6.77083C20.3312 6.77083 19.5594 6.77083 19.0247 7.17421C18.8764 7.28608 18.7444 7.41805 18.6326 7.56633C18.2292 8.10103 18.2292 8.87291 18.2292 10.4167V16.3125C18.2292 18.1981 18.2292 19.1409 17.6434 19.7267C17.0576 20.3125 16.1148 20.3125 14.2292 20.3125H10.7708C8.88521 20.3125 7.94241 20.3125 7.35662 19.7267C6.77083 19.1409 6.77083 18.1981 6.77083 16.3125V10.4167C6.77083 8.87291 6.77083 8.10103 6.36745 7.56633C6.25558 7.41805 6.12361 7.28608 5.97533 7.17421C5.44063 6.77083 4.66875 6.77083 3.125 6.77083V6.77083Z"
                                            stroke="#d84c4c" stroke-linecap="round" />
                                        <path
                                            d="M9.89591 3.64609C9.89591 3.64609 10.4167 2.60417 12.5001 2.60417C14.5834 2.60417 15.1042 3.64584 15.1042 3.64584"
                                            stroke="#d84c4c" stroke-linecap="round" />
                                    </svg>`;

    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteTag(newTag, tagName);
    });

    newTag.appendChild(tagSpan);
    newTag.appendChild(deleteButton);

    newTag.addEventListener("click", (e) => {
      if (
        e.target !== deleteButton &&
        e.target !== deleteButton.querySelector("svg")
      ) {
        e.stopPropagation();
        newTag.classList.toggle("selected");
        if (newTag.classList.contains("selected")) {
          this.currentTags.add(tagName);
        } else {
          this.currentTags.delete(tagName);
        }
        this.updateTagsButton();
      }
    });

    dropdownContent.appendChild(newTag);
  }

  deleteTag(tagElement, tagName) {
    tagElement.remove();
    this.currentTags.delete(tagName);
    this.updateTagsButton();
  }

  updateTagsButton() {
    const button = document.querySelector("#tagsDropdown button");
    const svg = button.querySelector("svg").outerHTML;
    button.innerHTML = `${svg} Tags ${
      this.currentTags.size ? `(${this.currentTags.size})` : ""
    }`;
    button.style.color = this.currentTags.size ? "var(--blue)" : "var(--grey)";
  }

  handleDelete(e) {
    const taskCard = e.target.closest(".task");
    if (!taskCard) return;

    const taskId = taskCard.id;
    if (!this.todoManager || !this.todoManager.activeProject) {
      console.error("TodoManager or active project is not initialized");
      return;
    }

    this.todoManager.removeTodo(taskId);
    taskCard.style.opacity = "0";
    taskCard.style.transform = "translateX(20px)";
    setTimeout(() => taskCard.remove(), 300);
  }
}
