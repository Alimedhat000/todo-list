export function createEditTaskCard(task = null) {
  // Create the main section
  const section = document.createElement("section");
  section.className = "edit-task-card";

  // Create input fields with initial values if task exists
  const taskInput = document.createElement("input");
  taskInput.type = "text";
  taskInput.className = "task-input";
  taskInput.placeholder = "Task Name";
  taskInput.value = task.title;

  const descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.className = "task-description";
  descriptionInput.placeholder = "Description";
  descriptionInput.value = task.description;

  // Create buttons row
  const buttonsRow = document.createElement("div");
  buttonsRow.className = "buttons-row";

  // Date button with initial date
  const dateButton = createDateButton(task);

  // Priority dropdown with initial priority
  const priorityDropdown = createPriorityDropdown(task?.priority || "none");

  // Tags dropdown with initial tags
  const tagsDropdown = createTagsDropdown(task?.tags || []);
  // Add all buttons to the buttons row
  buttonsRow.appendChild(dateButton);
  buttonsRow.appendChild(priorityDropdown);
  buttonsRow.appendChild(tagsDropdown);

  // Create bottom row with action buttons
  const bottomRow = createBottomRow(task ? true : false);

  // Append all elements to the section
  section.appendChild(taskInput);
  section.appendChild(descriptionInput);
  section.appendChild(buttonsRow);
  section.appendChild(bottomRow);

  return section;
}

function createDateButton(task) {
  const dateButton = document.createElement("div");
  dateButton.className = "action-button";
  dateButton.id = "dateButton";

  const today = new Date().toISOString().split("T")[0];
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  dateButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
        <input type="date" placeholder="dd/mm/yyyy" 
               value="${task.dateObj.toISOString().substr(0, 10)}" 
               min="${today}" 
               max="${nextYear.toISOString().split("T")[0]}" 
               pattern="\\d{2}/\\d{2}/\\d{4}">
    `;

  return dateButton;
}

function createPriorityDropdown(initialPriority = "none") {
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.id = "priorityDropdown";

  // Map of priority to emoji
  const priorities = {
    high: "🔴",
    medium: "🟡",
    low: "🔵",
    none: "",
  };
  const priorityColors = {
    high: "var(--priority-2)",
    medium: "var(--priority-3)",
    low: "var(--priority-4)",
    none: "var(--priority-1)",
  };

  const currentPriorityEmoji = priorities[initialPriority] || "";
  const currentPriorityText =
    initialPriority.charAt(0).toUpperCase() + initialPriority.slice(1);

  dropdown.innerHTML = `
        <button class="action-button" style="color: ${
          priorityColors[initialPriority]
        }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
            <span>${currentPriorityEmoji} ${currentPriorityText}</span>
        </button>
        <div class="dropdown-content">
            <div class="dropdown-item ${
              initialPriority === "high" ? "selected" : ""
            }" data-priority="high">🔴 High</div>
            <div class="dropdown-item ${
              initialPriority === "medium" ? "selected" : ""
            }" data-priority="medium">🟡 Medium</div>
            <div class="dropdown-item ${
              initialPriority === "low" ? "selected" : ""
            }" data-priority="low">🔵 Low</div>
            <div class="dropdown-item ${
              initialPriority === "none" ? "selected" : ""
            }" data-priority="none">None</div>
        </div>
    `;

  return dropdown;
}

function createTagsDropdown(initialTags = []) {
  const dropdown = document.createElement("div");
  dropdown.className = "dropdown";
  dropdown.id = "tagsDropdown";
  let tagscolor = "var(--grey)";
  if (initialTags.length !== 0) {
    tagscolor = "var(--blue)";
  }

  dropdown.innerHTML = `
        <button class="action-button" style="color: ${tagscolor}">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="-2 0 16 12"
                                class="icon">
                                <path fill="currentColor" fill-rule="evenodd"
                                    d="M9.357 1C10.264 1 11 1.736 11 2.643V6.07c0 .436-.173.854-.481 1.162L7.232 10.52a1.643 1.643 0 0 1-2.323 0L1.48 7.09c-.64-.64-.64-1.68.001-2.322L4.768 1.48C5.076 1.173 5.494 1 5.93 1h3.427zm-.07.91H5.93a.805.805 0 0 0-.569.235L2.145 5.362a.805.805 0 0 0 0 1.138L5.5 9.855a.805.805 0 0 0 1.138 0l3.217-3.217a.805.805 0 0 0 .236-.569V2.713a.804.804 0 0 0-.804-.804zM7.364 3.726a.91.91 0 1 1 0 1.818.91.91 0 0 1 0-1.818z">
                                </path>
                            </svg>
            <span>Tags ${
              initialTags.length ? `(${initialTags.length})` : ""
            }</span>
        </button>
        <div class="dropdown-content">
            <input type="text" placeholder="Add new tag" id="newTagInput">
            ${createDefaultTags(initialTags)}
        </div>
    `;

  return dropdown;
}

function createDefaultTags(selectedTags = []) {
  const defaultTags = ["Work", "Personal", "Important"];
  const allTags = [...new Set([...defaultTags, ...selectedTags])];

  return allTags
    .map(
      (tag) => `
        <div class="dropdown-item ${
          selectedTags.includes(tag) ? "selected" : ""
        }">
            <span>${tag}</span>
            <button>
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.89575 15.1042L9.89575 11.9792" stroke="#d84c4c" stroke-linecap="round" />
                    <path d="M15.1042 15.1042L15.1042 11.9792" stroke="#d84c4c" stroke-linecap="round" />
                    <path d="M3.125 6.77083H21.875V6.77083C20.3312 6.77083 19.5594 6.77083 19.0247 7.17421C18.8764 7.28608 18.7444 7.41805 18.6326 7.56633C18.2292 8.10103 18.2292 8.87291 18.2292 10.4167V16.3125C18.2292 18.1981 18.2292 19.1409 17.6434 19.7267C17.0576 20.3125 16.1148 20.3125 14.2292 20.3125H10.7708C8.88521 20.3125 7.94241 20.3125 7.35662 19.7267C6.77083 19.1409 6.77083 18.1981 6.77083 16.3125V10.4167C6.77083 8.87291 6.77083 8.10103 6.36745 7.56633C6.25558 7.41805 6.12361 7.28608 5.97533 7.17421C5.44063 6.77083 4.66875 6.77083 3.125 6.77083V6.77083Z" stroke="#d84c4c" stroke-linecap="round" />
                    <path d="M9.89591 3.64609C9.89591 3.64609 10.4167 2.60417 12.5001 2.60417C14.5834 2.60417 15.1042 3.64584 15.1042 3.64584" stroke="#d84c4c" stroke-linecap="round" />
                </svg>
            </button>
        </div>
    `
    )
    .join("");
}

function createBottomRow(isEditing = false) {
  const bottomRow = document.createElement("div");
  bottomRow.className = "bottom-row";

  const rightButtons = document.createElement("div");
  rightButtons.className = "right-buttons";

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-button";
  cancelButton.textContent = "Cancel";

  const addTaskButton = document.createElement("button");
  addTaskButton.className = "add-task-button";
  addTaskButton.textContent = isEditing ? "Save changes" : "Add task";

  rightButtons.appendChild(cancelButton);
  rightButtons.appendChild(addTaskButton);
  bottomRow.appendChild(rightButtons);

  return bottomRow;
}
