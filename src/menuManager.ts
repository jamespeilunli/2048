class MenuManager {
  menuToggle = document.getElementById("menu-toggle")!;
  menuPanel = document.getElementById("menu")!;
  board = document.getElementById("board")!;

  constructor() {
    this.menuToggle.addEventListener("click", () => this.toggleMenu());
    window.addEventListener("keydown", (ev) => {
      if (ev.key == " " && document.activeElement?.id != "menu-toggle") {
        this.toggleMenu();
      }
    });
  }

  isOpen() {
    return this.menuPanel.classList.contains("open");
  }

  gameOver(score: number, highScore: number) {
    this.openMenu();

    document.getElementById("menu-header")!.textContent = "Game Over";
    document.getElementById("game-summary")!.innerHTML = `<p>SCORE: ${score}</p>
       <p>HIGH SCORE: ${highScore}</p>`;
  }

  reset() {
    this.closeMenu();

    document.getElementById("menu-header")!.textContent = "Paused";
    document.getElementById("game-summary")!.innerHTML = "";
  }

  openMenu() {
    this.menuPanel.classList.add("open");
    this.board.classList.add("dimmed");
  }

  closeMenu() {
    this.menuPanel.classList.remove("open");
    this.board.classList.remove("dimmed");
  }

  toggleMenu() {
    if (this.menuPanel.classList.contains("open")) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }
}

export const menuManager = new MenuManager();
