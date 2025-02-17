// note: most of the args inside parseInt are strings with "px" suffix
const styles = getComputedStyle(document.documentElement);
const tilesPerRow = parseInt(styles.getPropertyValue('--tiles-per-row'));
const tileSize = parseInt(styles.getPropertyValue('--tile-size'));
const tileMargin = parseInt(styles.getPropertyValue('--tile-margin'));
const tileFontSize = parseInt(styles.getPropertyValue('--tile-font-size'));

const boardBoundingRect = document.getElementById("board")!.getBoundingClientRect();
const boardMarginTop = boardBoundingRect.top + window.scrollY;
const boardMarginLeft = boardBoundingRect.left + window.scrollX;

class Tile {
  i: number;
  j: number;
  element: HTMLDivElement;

  constructor(value: number, i: number, j: number) {
    this.i = i;
    this.j = j;

    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.style.backgroundColor = "black";
    this.element.style.color = "pink";
    this.element.style.left = `${boardMarginLeft + tileMargin + j * (tileSize + tileMargin)}px`;
    this.element.style.top = `${boardMarginTop + tileMargin + i * (tileSize + tileMargin)}px`;
    this.element.innerText = value.toString();
    document.getElementById("board")?.appendChild(this.element);
  }

  destroy() {
    this.element.remove();
  }

  moveTo(i: number, j: number) {
    this.i = i;
    this.j = j;
    this.element.style.left = `${boardMarginLeft + tileMargin + j * (tileSize + tileMargin)}px`;
    this.element.style.top = `${boardMarginTop + tileMargin + i * (tileSize + tileMargin)}px`;
  }
}

class Board {
  tiles: Tile[];
  board: number[][];

  constructor() {
    this.tiles = [];
    this.board = Array(tilesPerRow).fill(null).map(() => Array(tilesPerRow).fill(0));
  }

  createTile(value: number, i: number, j: number) {
    this.tiles.push(new Tile(value, i, j));
    this.board[i][j] = value;
  }

  removeTile(i: number, j: number) {
    this.board[i][j] = 0;

    this.tiles.forEach((tile, index) => {
      if (tile.i === i && tile.j === j) {
        tile.destroy();
        this.tiles.splice(index, 1);
        return;
      }
    })
  }

  moveTile(fromI: number, fromJ: number, toI: number, toJ: number) {
    this.tiles.forEach((tile) => {
      if (tile.i === fromI && tile.j === fromJ) {
        tile.moveTo(toI, toJ);
        return;
      }
    })
    this.board[toI][toJ] = this.board[fromI][fromJ];
    this.board[fromI][fromJ] = 0;
  }
}

const board = new Board();
for (let i = 0; i < 4; i++) {
  for (let j = 0; j < 4; j++) {
    if (i === j) {
      board.createTile(2, i, j);
    }
  }
}

board.removeTile(2, 2);
board.moveTile(3, 3, 2, 2);

console.log(board)
