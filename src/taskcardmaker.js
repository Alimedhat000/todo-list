import { Todo } from "./todo";

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

  const content_container = document.createElement("div");
  content_container.classList.add("content-container");
  content_container.appendChild(card_checkbox);
  content_container.appendChild(task_content);

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

  return card;
};
