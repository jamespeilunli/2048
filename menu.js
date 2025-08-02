export class Menu {
    menu;
    menuButton;
    closeButton;
    menuContent;
    gameContainer;
    isOpen = false;
    constructor() {
        this.menu = document.getElementById("menu");
        this.menuButton = document.getElementById("menu-button");
        this.closeButton = document.getElementById("close-menu");
        this.menuContent = document.getElementById("menu-content");
        this.gameContainer = document.getElementById("full-window");
        this.menuButton.addEventListener("click", () => this.toggle());
        this.closeButton.addEventListener("click", () => this.close());
    }
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    open(content) {
        if (content)
            this.menuContent.innerHTML = content;
        this.menu.classList.add("open");
        this.gameContainer.classList.add("shifted");
        this.isOpen = true;
    }
    close() {
        this.menu.classList.remove("open");
        this.gameContainer.classList.remove("shifted");
        this.isOpen = false;
    }
    showGameOver(score, highScore) {
        const content = `
      <h2>Game Over</h2>
      <p>Score: ${score}</p>
      <p>High Score: ${highScore}</p>
      <button id="restart">Play Again</button>
    `;
        this.open(content);
        document.getElementById("restart")?.addEventListener("click", () => {
            location.reload();
        });
    }
}
