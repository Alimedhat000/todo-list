import { Todo } from "./todo";
import { makeTaskCard } from "./taskcardmaker";

export class TaskHandler {
  constructor(todoManager) {
    this.todoManager = todoManager;
    this.taskInput = document.querySelector(".task-input");
    this.taskDescription = document.querySelector(".task-description");
    this.addTaskButton = document.querySelector(".add-task-button");
    this.cancelButton = document.querySelector(".cancel-button");
    this.tasksContainer = document.querySelector(".tasks-container");
    this.dueDateButton = document.querySelector(
      ".action-button:has(input[type='date'])"
    );

    // Update button selectors
    this.priorityDropdownButton = document.querySelector(
      "#priorityDropdown button"
    );
    this.priorityDropdownspan =
      this.priorityDropdownButton.querySelector("span");
    this.tagsDropdownButton = document.querySelector("#tagsDropdown button");

    this.currentPriority = "none";
    this.currentDueDate = null;
    this.currentTags = new Set();

    this.initializeEventListeners();
    this.initializeDropdowns();
  }

  initializeEventListeners() {
    this.addTaskButton.addEventListener("click", () => this.handleAddTask());
    this.cancelButton.addEventListener("click", () => this.clearInputs());
    this.dueDateButton.addEventListener("click", () => this.handleDueDate());
    this.tasksContainer.addEventListener("click", (e) =>
      this.handleTaskClick(e)
    );
  }

  handleAddTask() {
    if (!this.taskInput.value.trim()) return;

    try {
      const newTodo = this.todoManager.createTodo(
        this.taskInput.value,
        this.taskDescription.value,
        this.currentDueDate,
        this.currentPriority
      );

      // Add tags to the todo
      newTodo.tags = Array.from(this.currentTags);

      const taskCard = makeTaskCard(newTodo);
      this.tasksContainer.prepend(taskCard);
      this.clearInputs();
      this.resetTaskForm();
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }

  handleTaskClick(e) {
    const taskElement = e.target.closest(".task");
    if (!taskElement) return;

    if (e.target.classList.contains("task-checkbox")) {
      this.toggleTaskComplete(taskElement);
    }
  }

  toggleTaskComplete(taskElement) {
    const checkbox = taskElement.querySelector(".task-checkbox");
    checkbox.classList.toggle("checked");
    taskElement.classList.toggle("completed");

    // Update the todo object in the active project
    // You would need to add an id to the task element to properly identify it
  }

  handleDueDate() {
    // Create a date input dynamically
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.style.display = "none";
    document.body.appendChild(dateInput);

    dateInput.addEventListener("change", (e) => {
      this.currentDueDate = new Date(e.target.value);
      this.dueDateButton.classList.add("active");
      dateInput.remove();
    });

    dateInput.click();
  }

  clearInputs() {
    // Clear text inputs
    this.taskInput.value = "";
    this.taskDescription.value = "";

    // Reset priority dropdown
    const prioritySvg =
      this.priorityDropdownButton.querySelector("svg").outerHTML;
    this.priorityDropdownButton.innerHTML = prioritySvg + " Priority";
    this.priorityDropdownButton.style.color = "var(--grey)";

    // Reset tags dropdown
    const tagsSvg = this.tagsDropdownButton.querySelector("svg").outerHTML;
    this.tagsDropdownButton.innerHTML = tagsSvg + " Tags";
    this.tagsDropdownButton.style.color = "var(--grey)";

    // Unselect all tags
    document.querySelectorAll(".dropdown-item.selected").forEach((item) => {
      item.classList.remove("selected");
    });

    // Reset date
    this.dueDateButton.classList.remove("active");
    const dateInput = this.dueDateButton.querySelector('input[type="date"]');
    if (dateInput) {
      dateInput.value = "";
    }

    // Reset internal state
    this.currentPriority = "none";
    this.currentDueDate = null;
    this.currentTags.clear();
  }

  resetTaskForm() {
    this.clearInputs(); // Now we can just call clearInputs since it handles everything
  }

  initializeDropdowns() {
    // Priority dropdown
    const priorityDropdown = this.priorityDropdownButton.nextElementSibling;
    const tagsDropdown = this.tagsDropdownButton.nextElementSibling;

    this.priorityDropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tagsDropdown.classList.contains("show")) {
        tagsDropdown.classList.remove("show");
      }
      priorityDropdown.classList.toggle("show");
    });

    priorityDropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.currentPriority = e.target.dataset.priority;

        // Update button content while preserving the SVG
        const svg = this.priorityDropdownButton.querySelector("svg").outerHTML;
        this.priorityDropdownButton.innerHTML =
          svg + " " + e.target.textContent;

        // Update button color based on priority
        this.priorityDropdownButton.style.color = getComputedStyle(
          e.target
        ).color;

        priorityDropdown.classList.remove("show");
      });
    });

    // Tags dropdown

    this.tagsDropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      if (priorityDropdown.classList.contains("show")) {
        priorityDropdown.classList.remove("show");
      }
      tagsDropdown.classList.toggle("show");
    });

    const newTagInput = document.getElementById("newTagInput");
    newTagInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && newTagInput.value.trim()) {
        this.addNewTag(newTagInput.value.trim(), tagsDropdown);
        newTagInput.value = "";
      }
    });

    // Handle existing tags
    tagsDropdown
      .querySelectorAll(".dropdown-item:not(:first-child)")
      .forEach((item) => {
        item.addEventListener("click", (e) => {
          e.stopPropagation();
          e.target.classList.toggle("selected");
          if (e.target.classList.contains("selected")) {
            this.currentTags.add(e.target.textContent);
          } else {
            this.currentTags.delete(e.target.textContent);
          }
          this.updateTagsButton();
        });
      });

    // Close dropdowns when clicking outside
    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
        dropdown.classList.remove("show");
      });
    });

    document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
  }

  addNewTag(tagName, dropdownContent) {
    const newTag = document.createElement("div");
    newTag.className = "dropdown-item";
    newTag.textContent = tagName;

    newTag.addEventListener("click", (e) => {
      e.stopPropagation();
      e.target.classList.toggle("selected");
      if (e.target.classList.contains("selected")) {
        this.currentTags.add(tagName);
      } else {
        this.currentTags.delete(tagName);
      }
      this.updateTagsButton();
    });

    dropdownContent.appendChild(newTag);
  }

  updateTagsButton() {
    const tagCount = this.currentTags.size;
    const svg = this.tagsDropdownButton.querySelector("svg").outerHTML;

    if (tagCount === 0) {
      this.tagsDropdownButton.innerHTML = svg + " Tags";
    } else {
      this.tagsDropdownButton.innerHTML = `${svg} Tags (${tagCount})`;
      this.tagsDropdownButton.style.color = "var(--blue)";
    }
  }
}
