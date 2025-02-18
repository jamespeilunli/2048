// note: most of the args inside parseInt are strings with "px" suffix
const styles = getComputedStyle(document.documentElement);
const tilesPerRow = parseInt(styles.getPropertyValue('--tiles-per-row'));
const tileSize = parseInt(styles.getPropertyValue('--tile-size'));
const tileMargin = parseInt(styles.getPropertyValue('--tile-margin'));
const tileFontSize = parseInt(styles.getPropertyValue('--tile-font-size'));

const boardBoundingRect = document.getElementById("board")!.getBoundingClientRect();
const boardMarginTop = boardBoundingRect.top + window.scrollY;
const boardMarginLeft = boardBoundingRect.left + window.scrollX;

const getColumn = (matrix: any[][], column: number) => matrix.map((row) => row[column]);

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

type Direction = "Up" | "Down" | "Left" | "Right";

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
    this.element.classList.add("fade-in");
    this.element.classList.add("animated-move");
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

  setValue(newValue: number) {
    this.value = newValue;
    this.element.innerText = newValue.toString();
  }
}

class Board {
  tiles: Tile[];
  board: (Tile | null)[][];
  moved: boolean = false; // have any tiles moved this turn?

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
    if (posesEqual(from, to)) return;

    this.moved = true;

    this.board[to.i][to.j] = this.board[from.i][from.j];
    this.board[from.i][from.j] = null;

    this.tiles.forEach((tile) => {
      if (posesEqual(tile.pos, from)) {
        tile.moveTo(to);
        return;
      }
    })
  }

  moveTile(from: Tile, index: number, direction: Direction) {
    if (direction === "Up") this.moveTileTo(from.pos, { i: index, j: from.pos.j });
    if (direction === "Down") this.moveTileTo(from.pos, { i: tilesPerRow - index - 1, j: from.pos.j });
    if (direction === "Left") this.moveTileTo(from.pos, { i: from.pos.i, j: index });
    if (direction === "Right") this.moveTileTo(from.pos, { i: from.pos.i, j: tilesPerRow - index - 1 });
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

  shiftLine(line: (Tile | null)[], direction: Direction) {
    let i = 0;
    let prevTile = null;

    for (let tile of line) {
      if (tile) {
        if (prevTile) {
          if (prevTile.value === tile.value) {
            this.removeTile(prevTile);
            this.moveTile(tile, i, direction);
            tile.setValue(tile.value * 2);
            prevTile = null;
          } else {
            this.moveTile(prevTile, i, direction);
            prevTile = tile;
          }
          i++;
        } else {
          prevTile = tile;
        }
      }
    }

    if (prevTile) {
      prevTile.setValue(prevTile.value);
      this.moveTile(prevTile, i, direction);
    }
  }

  move(direction: Direction) {
    if (direction === "Left") {
      this.board.forEach((row) => this.shiftLine(row, direction));
    } if (direction === "Right") {
      this.board.forEach((row) => this.shiftLine([...row].reverse(), direction));
    } if (direction === "Up") {
      this.board.forEach((row, index) => this.shiftLine(getColumn(this.board, index), direction));
    } if (direction === "Down") {
      this.board.forEach((row, index) => this.shiftLine(getColumn(this.board, index).reverse(), direction));
    }
  }

  tick(key: Direction) {
    this.moved = false;
    this.move(key);
    if (this.moved) this.spawnTile();
  }
}

const board = new Board();

board.spawnTile();

window.addEventListener("keydown", (ev) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.key)) {
    board.tick(ev.key.slice(5) as Direction);
  }
})
