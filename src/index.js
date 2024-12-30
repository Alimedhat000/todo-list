import "./styles/main.css";
import { TodoManager } from "./js/services/todoManager";
import { Project } from "./js/models/todoProject";
import { makeTaskCard } from "./js/components/taskcardmaker";
import { Todo } from "./js/models/todo";
import { TaskHandler } from "./js/handlers/addtaskhandler";
import { sidebarHandler } from "./js/handlers/sidebarhandler";

const todoManager = new TodoManager(Project, Todo);
const taskHandler = new TaskHandler(todoManager);
const sidebar = new sidebarHandler();
