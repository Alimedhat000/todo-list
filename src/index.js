import "./styles/main.css";
import { TodoManager } from "./js/services/todoManager";
import { Project } from "./js/models/todoProject";
import { makeTaskCard } from "./js/components/taskcardmaker";
import { Todo } from "./js/models/todo";
import { TaskHandler } from "./js/handlers/addtaskhandler";
import { sidebarHandler } from "./js/handlers/sidebarhandler";
import { taskButtonHandler } from "./js/handlers/taskbuttonshandler";
import { createEditTaskCard } from "./js/components/taskeditormaker";
import { ProjectHandler } from "./js/handlers/projectHandler";

const todoManager = new TodoManager(Project, Todo);
const taskHandler = new TaskHandler(todoManager);
const sidebar = new sidebarHandler(todoManager);
const taskedit = new taskButtonHandler(todoManager);
const projectHandler = new ProjectHandler(todoManager);
