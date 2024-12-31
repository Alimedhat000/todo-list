import { Todo } from "../models/todo";

export const makeTaskCard = (task) => {
  const card = document.createElement("div");
  card.classList.add("task");

  const card_checkbox = document.createElement("div");
  card_checkbox.classList.add("task-checkbox");

  if (task.status === Todo.STATUS.COMPLETED) {
    card_checkbox.classList.add("completed");
  }

  switch (task.priority) {
    case Todo.PRIORITIES[1]:
      card.classList.add("p4");
      break;
    case Todo.PRIORITIES[2]:
      card.classList.add("p3");
      break;
    case Todo.PRIORITIES[3]:
      card.classList.add("p2");
      break;
    default:
      card.classList.add("p1");
  }

  const task_content = document.createElement("div");
  task_content.classList.add("task-content");
  task_content.innerHTML = `<div class="task-title">${task.title}</div>
                            <div class="task-description">${task.description}</div>`;

  const task_editor = document.createElement("button");
  task_editor.classList.add("task-editor");
  task_editor.innerHTML = `<svg width="24" height="24">
                                <g fill="none" fill-rule="evenodd">
                                    <path fill="currentColor" d="M9.5 19h10a.5.5 0 1 1 0 1h-10a.5.5 0 1 1 0-1z"
                                        data-darkreader-inline-fill="" style="--darkreader-inline-fill: currentColor;">
                                    </path>
                                    <path stroke="currentColor"
                                        d="M4.42 16.03a1.5 1.5 0 0 0-.43.9l-.22 2.02a.5.5 0 0 0 .55.55l2.02-.21a1.5 1.5 0 0 0 .9-.44L18.7 7.4a1.5 1.5 0 0 0 0-2.12l-.7-.7a1.5 1.5 0 0 0-2.13 0L4.42 16.02z"
                                        data-darkreader-inline-stroke=""
                                        style="--darkreader-inline-stroke: currentColor;">
                                    </path>
                                </g>
                            </svg>`;

  const task_delete = document.createElement("button");
  task_delete.classList.add("task-delete");
  task_delete.innerHTML = `<svg viewBox="0 0 24 24" class="hf94KxN" width="18" height="18">
                                <path fill="currentColor" fill-rule="nonzero"
                                    d="M5.146 5.146a.5.5 0 0 1 .708 0L12 11.293l6.146-6.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 0 .708L12.707 12l6.147 6.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.708 0L12 12.707l-6.146 6.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1 0-.708L11.293 12 5.146 5.854a.5.5 0 0 1-.057-.638z"
                                    data-darkreader-inline-fill="" style="--darkreader-inline-fill: currentColor;">
                                </path>
                            </svg>`;

  const content_container = document.createElement("div");
  content_container.classList.add("content-container");
  content_container.appendChild(card_checkbox);
  content_container.appendChild(task_content);
  content_container.appendChild(task_editor);
  content_container.appendChild(task_delete);

  const task_meta = document.createElement("div");
  task_meta.classList.add("task-meta");
  task_meta.innerHTML = `<span class="task-date">${task.due_date}</span>`;

  for (const tag of task.tags) {
    const tag_element = document.createElement("span");
    tag_element.classList.add("tag");
    tag_element.textContent = tag;
    task_meta.appendChild(tag_element);
  }

  card.appendChild(content_container);
  card.appendChild(task_meta);

  card.id = task.getID();

  return card;
};
