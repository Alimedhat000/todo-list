export class sidebarHandler {
  constructor() {
    // Add sidebar toggle functionality
    this.menuToggleButton = document.querySelector(".menu-toggle-button");
    this.sidebar = document.querySelector(".sidebar");
    this.sidebarHandler();
  }

  sidebarHandler() {
    this.menuToggleButton.addEventListener("click", () => {
      this.sidebar.classList.toggle("collapsed");
      this.menuToggleButton.classList.toggle("rotated");
    });
  }
}
