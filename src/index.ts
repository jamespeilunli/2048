// note: most of the args inside parseInt are strings with "px" suffix
const styles = getComputedStyle(document.documentElement);
const tilesPerRow = parseInt(styles.getPropertyValue('--tiles-per-row'));
const tileSize = parseInt(styles.getPropertyValue('--tile-size'));
const tileMargin = parseInt(styles.getPropertyValue('--tile-margin'));
const tileFontSize = parseInt(styles.getPropertyValue('--tile-font-size'));

const boardBoundingRect = document.getElementById("board")!.getBoundingClientRect();
const boardMarginTop = boardBoundingRect.top + window.scrollY;
const boardMarginLeft = boardBoundingRect.left + window.scrollX;

function randint(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

type Pos = {
  i: number,
  j: number,
}

class Tile {
  pos: Pos;
  element: HTMLDivElement;

  constructor(value: number, pos: Pos) {
    this.pos = pos;

    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.style.backgroundColor = "black";
    this.element.style.color = "pink";
    this.element.style.left = `${boardMarginLeft + tileMargin + pos.j * (tileSize + tileMargin)}px`;
    this.element.style.top = `${boardMarginTop + tileMargin + pos.i * (tileSize + tileMargin)}px`;
    this.element.innerText = value.toString();
    document.getElementById("board")?.appendChild(this.element);
  }

  destroy() {
    this.element.remove();
  }

  moveTo(pos: Pos) {
    this.pos = pos;
    this.element.style.left = `${boardMarginLeft + tileMargin + pos.j * (tileSize + tileMargin)}px`;
    this.element.style.top = `${boardMarginTop + tileMargin + pos.i * (tileSize + tileMargin)}px`;
  }
}

class Board {
  tiles: Tile[];
  board: number[][];

  constructor() {
    this.tiles = [];
    this.board = Array(tilesPerRow).fill(null).map(() => Array(tilesPerRow).fill(0));
  }

  createTile(value: number, pos: Pos) {
    this.tiles.push(new Tile(value, pos));
    this.board[pos.i][pos.j] = value;
  }

  removeTile(pos: Pos) {
    this.board[pos.i][pos.j] = 0;

    this.tiles.forEach((tile, index) => {
      if (tile.pos === pos) {
        tile.destroy();
        this.tiles.splice(index, 1);
        return;
      }
    })
  }

  moveTile(from: Pos, to: Pos) {
    this.tiles.forEach((tile) => {
      if (tile.pos === from) {
        tile.moveTo(to);
        return;
      }
    })
    this.board[to.i][to.j] = this.board[from.i][from.j];
    this.board[from.i][from.j] = 0;
  }

  spawnTile() {
    let emptyTiles: Pos[] = [];

    for (let i = 0; i < tilesPerRow; i++) {
      for (let j = 0; j < tilesPerRow; j++) {
        if (this.board[i][j] === 0) {
          emptyTiles.push({ i, j })
        }
      }
    }

    if (emptyTiles.length === 0) {
      alert("You Lose!");
    } else {
      const newPos = emptyTiles[randint(0, emptyTiles.length - 1)];
      const newValue = randint(1, 100) > 20 ? 2 : 4;

      this.createTile(newValue, newPos);
    }
  }

  shiftLine(line: number[]) {
    let newLine = Array(tilesPerRow).fill(0);

    let i = 0;
    let prevValue = 0;
    for (let value of line) {
      if (value !== 0) {
        if (value === prevValue) {
          newLine[i] = value * 2;
          i++;
          prevValue = 0;
        } else {
          if (prevValue !== 0) {
            newLine[i] = prevValue;
            i++;
          }
          prevValue = value;
        }
      }
    }
    if (i < tilesPerRow) newLine[i] = prevValue;

    return newLine;
  }
}

const board = new Board();

console.log(board.shiftLine([0, 0, 0, 0]))
console.log(board.shiftLine([2, 0, 0, 0]))
console.log(board.shiftLine([0, 0, 2, 0]))
console.log(board.shiftLine([4, 4, 0, 0]))
console.log(board.shiftLine([4, 8, 2, 0]))
console.log(board.shiftLine([8, 8, 2, 2]))
console.log(board.shiftLine([8, 2, 0, 2]))
