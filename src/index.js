import "./styles/main.css";
import { TodoManager } from "./js/services/todoManager";
import { Project } from "./js/models/todoProject";
import { makeTaskCard } from "./js/components/taskcardmaker";
import { Todo } from "./js/models/todo";
import { TaskHandler } from "./js/handlers/addtaskhandler";
import { sidebarHandler } from "./js/handlers/sidebarhandler";
import { taskButtonHandler } from "./js/handlers/taskbuttonshandler";
import { createEditTaskCard } from "./js/components/taskeditormaker";

const todoManager = new TodoManager(Project, Todo);
const taskHandler = new TaskHandler(todoManager);
const sidebar = new sidebarHandler();
const taskedit = new taskButtonHandler(todoManager);

// const container = document.querySelector(".tasks-container");
// container.appendChild(createEditTaskCard(todoManager.activeProject.todos[0]));
// console.log(createEditTaskCard(todoManager.activeProject.todos[0]));
// console.log(todoManager.activeProject.todos[0]);
