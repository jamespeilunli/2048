class DynamicColors {
  type = styles.getPropertyValue("--dynamic-color") as "color" | "background-color";
  changeFullWindow = styles.getPropertyValue("--window-bg") === "none";
  changeBoard = styles.getPropertyValue("--board-bg") === "none";
  changeText = styles.getPropertyValue("--text") === "none";

  init() {
    // set up proper default values so that we don't have a color transition at the start

    if (this.changeText) {
      let style = document.getElementById("body")!.style;
      style.color = styles.getPropertyValue("--text-2");
      requestAnimationFrame(() => {
        style.transition = "color 0.5s ease-in-out";
      });
    } else if (this.changeFullWindow) {
      let style = document.getElementById("full-window")!.style;
      requestAnimationFrame(() => {
        style.transition = "background-color 0.5s ease-in-out";
      });
    } else if (this.changeBoard) {
      let style = document.getElementById("board")!.style;
      style.backgroundColor = styles.getPropertyValue("--bg-2");
      requestAnimationFrame(() => {
        style.transition = "background-color 0.5s ease-in-out";
      });
    }
  }

  updateColors(highestTileStyle: CSSStyleDeclaration) {
    // replace dynamic color elements with the color of the highest tile

    if (this.changeFullWindow) {
      document.getElementById("full-window")!.style.background = highestTileStyle.getPropertyValue(this.type);
    }
    if (this.changeBoard) {
      document.getElementById("board")!.style.background = highestTileStyle.getPropertyValue(this.type);
    }
    if (this.changeText) {
      document.getElementById("body")!.style.color = highestTileStyle.getPropertyValue(this.type);
    }
  }
}
