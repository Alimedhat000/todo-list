import { Todo } from "../models/todo";
import { makeTaskCard } from "../components/taskcardmaker";

export class TaskHandler {
  constructor(todoManager) {
    this.todoManager = todoManager;
    this.taskInput = document.querySelector(".task-input");
    this.taskDescription = document.querySelector(
      ".add-task-card .task-description"
    );
    this.addTaskButton = document.querySelector(".add-task-button");
    this.cancelButton = document.querySelector(".cancel-button");
    this.tasksContainer = document.querySelector(".tasks-container");
    this.dueDateButton = document.querySelector("#dateButton");
    var today = new Date();
    this.dueDateButton.querySelector("input").value = today
      .toISOString()
      .substr(0, 10);
    this.priorityDropdownButton = document.querySelector(
      "#priorityDropdown button"
    );
    this.priorityDropdownspan =
      this.priorityDropdownButton.querySelector("span");
    this.tagsDropdownButton = document.querySelector("#tagsDropdown button");
    this.showAddTaskButton = document.querySelector(".show-add-task-button");

    this.currentPriority = "none";
    this.currentDueDate = null;
    this.currentTags = new Set();

    this.initializeEventListeners();
    this.initializeDropdowns();
  }

  initializeEventListeners() {
    this.addTaskButton.addEventListener("click", () => this.handleAddTask());
    this.cancelButton.addEventListener("click", () => this.clearInputs());
    this.showAddTaskButton.addEventListener("click", () =>
      this.handleToggleShowAddTask()
    );
    this.tasksContainer.addEventListener("click", (e) =>
      this.handleTaskClick(e)
    );
    this.ClosingListener();
  }
  ClosingListener() {
    document.addEventListener("click", (e) => {
      const addTaskCard = document.querySelector(".add-task-card");
      const showAddTaskButton = document.querySelector(".show-add-task-button");

      // Check if card exists and click is outside card
      if (
        addTaskCard &&
        !addTaskCard.contains(e.target) &&
        !showAddTaskButton.contains(e.target) &&
        !addTaskCard.classList.contains("hidden")
      ) {
        addTaskCard.classList.add("hidden");
        showAddTaskButton.classList.remove("hidden");
        this.clearInputs();
        this.resetTaskForm();
      }
    });
  }
  handleToggleShowAddTask() {
    const addTaskCard = document.querySelector(".add-task-card");
    addTaskCard.classList.toggle("hidden");
    this.showAddTaskButton.classList.toggle("hidden");
  }

  handleAddTask() {
    // Prevent adding empty tasks
    if (!this.taskInput.value.trim()) return;

    try {
      this.currentDueDate = new Date(
        this.dueDateButton.querySelector("input").value
      );

      //create a new todo with values from the form
      const newTodo = this.todoManager.createTodo(
        this.taskInput.value,
        this.taskDescription.value,
        this.currentDueDate,
        this.currentPriority,
        Array.from(this.currentTags)
      );

      // Make the todo card in the DOM and add it to current Project
      // TODO add it to the project logic

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

    // TODO Update the todo object in the active project
    // You would need to add an id to the task element to properly identify it
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
    this.handleToggleShowAddTask();
  }

  resetTaskForm() {
    this.clearInputs(); // Now we can just call clearInputs since it handles everything
  }

  initializeDropdowns() {
    // Get dropdown objects
    const priorityDropdown = this.priorityDropdownButton.nextElementSibling;
    const tagsDropdown = this.tagsDropdownButton.nextElementSibling;

    // Handle priority dropdown
    this.priorityDropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      // Make sure the other dropdown is closed
      if (tagsDropdown.classList.contains("show")) {
        tagsDropdown.classList.remove("show");
      }
      // Toggle the dropdown
      priorityDropdown.classList.toggle("show");
    });

    // Handle priority selection
    priorityDropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        this.currentPriority = e.target.dataset.priority;

        // Update button content while preserving the SVG
        const svg = this.priorityDropdownButton.querySelector("svg").outerHTML;

        this.priorityDropdownButton.innerHTML =
          svg +
          " " +
          (e.target.textContent !== "None" ? e.target.textContent : "Priority");

        // Update button color based on priority
        this.priorityDropdownButton.style.color = getComputedStyle(
          e.target
        ).color;

        // Close the dropdown
        priorityDropdown.classList.remove("show");
      });
    });

    // Tags dropdown
    this.tagsDropdownButton.addEventListener("click", (e) => {
      e.stopPropagation();
      // Make sure the other dropdown is closed
      if (priorityDropdown.classList.contains("show")) {
        priorityDropdown.classList.remove("show");
      }
      // Toggle the dropdown
      tagsDropdown.classList.toggle("show");
    });

    const newTagInput = document.getElementById("newTagInput");
    // Handle new tag input
    newTagInput.addEventListener("keypress", (e) => {
      //handle enter key press
      if (e.key === "Enter" && newTagInput.value.trim()) {
        // Add new tag to the dropdown
        this.addNewTag(newTagInput.value.trim(), tagsDropdown);
        newTagInput.value = "";
      }
    });

    // Handle existing tags
    tagsDropdown
      .querySelectorAll(".dropdown-item:not(:first-child)")
      .forEach((item) => {
        const tagName = item.querySelector("span").textContent;
        const deleteButton = item.querySelector("button");

        // Add delete handler to existing tags
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

    // Create tag content structure
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

    // Add delete functionality
    deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.deleteTag(newTag, tagName);
    });

    newTag.appendChild(tagSpan);
    newTag.appendChild(deleteButton);

    // Add click handler for tag selection
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
    // Remove from UI
    tagElement.remove();

    // Remove from internal state if it was selected
    this.currentTags.delete(tagName);

    // Update the tags button display
    this.updateTagsButton();
  }

  updateTagsButton() {
    const tagCount = this.currentTags.size;
    const svg = this.tagsDropdownButton.querySelector("svg").outerHTML;

    if (tagCount === 0) {
      this.tagsDropdownButton.innerHTML = svg + " Tags";
      this.tagsDropdownButton.style.color = "var(--grey)";
    } else {
      this.tagsDropdownButton.innerHTML = `${svg} Tags (${tagCount})`;
      this.tagsDropdownButton.style.color = "var(--blue)";
    }
  }
}
