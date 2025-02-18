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

function posesEqual(a: Pos, b: Pos) {
  return a.i === b.i && a.j === b.j;
}

type Direction = "ArrowUp" | "ArrowDown" | "ArrowLeft" | "ArrowRight";

class Tile {
  pos: Pos;
  value: number;
  element: HTMLDivElement;

  constructor(value: number, pos: Pos) {
    this.pos = pos;
    this.value = value;

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
  board: (Tile | null)[][];

  constructor() {
    this.tiles = [];
    this.board = Array(tilesPerRow).fill(null).map(() => Array(tilesPerRow).fill(null));
  }

  createTile(value: number, pos: Pos) {
    this.board[pos.i][pos.j] = new Tile(value, pos);
    this.tiles.push(this.board[pos.i][pos.j]!);
  }

  removeTile(tile: Tile) {
    this.board[tile.pos.i][tile.pos.j] = null;
    tile.destroy();

    this.tiles.splice(this.tiles.indexOf(tile), 1);
  }

  moveTileTo(from: Pos, to: Pos) {
    this.board[to.i][to.j] = this.board[from.i][from.j];
    this.board[from.i][from.j] = null;

    this.tiles.forEach((tile) => {
      if (posesEqual(tile.pos, from)) {
        tile.moveTo(to);
        return;
      }
    })
  }

  spawnTile() {
    let emptyTiles: Pos[] = [];

    for (let i = 0; i < tilesPerRow; i++) {
      for (let j = 0; j < tilesPerRow; j++) {
        if (!this.board[i][j]) {
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

board.createTile(2, { i: 0, j: 0 });
board.createTile(2, { i: 1, j: 1 });
board.createTile(2, { i: 2, j: 2 });
board.createTile(2, { i: 3, j: 3 });
board.createTile(2, { i: 3, j: 2 });
board.createTile(2, { i: 3, j: 1 });

board.removeTile(board.board[2][2]!);

console.log(board.shiftLine(board.board[1].map((tile) => tile?.value ?? 0)))
console.log(board.shiftLine(board.board[3].map((tile) => tile?.value ?? 0)))
