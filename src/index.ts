// note: most of the things inside parseInt are strings with "px" suffix
const styles = getComputedStyle(document.documentElement);
const tilesPerRow = parseInt(styles.getPropertyValue('--tiles-per-row'));
const tileSize = parseInt(styles.getPropertyValue('--tile-size'));
const tileMargin = parseInt(styles.getPropertyValue('--tile-margin'));
const tileFontSize = parseInt(styles.getPropertyValue('--tile-font-size'));

const boardBoundingRect = document.getElementById("board")!.getBoundingClientRect();
const boardMarginTop = boardBoundingRect.top + window.scrollY;
const boardMarginLeft = boardBoundingRect.left + window.scrollX;

class Tile {
  element: HTMLDivElement;

  constructor(value: number, i: number, j: number) {
    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.style.backgroundColor = "black";
    this.element.style.color = "pink";
    this.element.style.left = `${boardMarginLeft + tileMargin + j * (tileSize + tileMargin)}px`;
    this.element.style.top = `${boardMarginTop + tileMargin + i * (tileSize + tileMargin)}px`;
    this.element.innerText = value.toString();
    document.getElementById("board")?.appendChild(this.element);
  }
}

class Board {
  board: Tile[];

  constructor() {
    this.board = [];
  }

  createTile(value: number, i: number, j: number) {
    this.board.push(new Tile(value, i, j));
  }
}

const board = new Board();
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if (i === j) board.createTile(2, i, j);
  }
}

