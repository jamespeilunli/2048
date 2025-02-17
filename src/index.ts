const styles = getComputedStyle(document.documentElement);
const tilesPerRow = styles.getPropertyValue('--tiles-per-row');
const tileSize = styles.getPropertyValue('--tile-size');
const tileMargin = styles.getPropertyValue('--tile-margin');
const tileFontSize = styles.getPropertyValue('--tile-font-size');

class Tile {
  element: HTMLDivElement;

  constructor(value: number) {
    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.style.backgroundColor = "black";
    this.element.style.color = "pink";
    this.element.innerText = `${value}`;
    document.getElementById("board")?.appendChild(this.element);
  }
}

new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
new Tile(4);
