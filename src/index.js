import "./styles/main.css";
import { TodoManager } from "./todoManager";
import { Project } from "./todoProject";
import { makeTaskCard } from "./taskcardmaker";
import { Todo } from "./todo";
import { TaskHandler } from "./addtaskhandler";

const todoManager = new TodoManager(Project, Todo);
const taskHandler = new TaskHandler(todoManager);

// Add sidebar toggle functionality
const menuToggleButton = document.querySelector(".menu-toggle-button");
const sidebar = document.querySelector(".sidebar");

menuToggleButton.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  menuToggleButton.classList.toggle("rotated");
});
