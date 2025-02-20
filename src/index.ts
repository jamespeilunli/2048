// note: most of the args inside parseInt are strings with "px" suffix
const styles = getComputedStyle(document.documentElement);
const tilesPerRow = parseInt(styles.getPropertyValue('--tiles-per-row'));
const tileSize = parseInt(styles.getPropertyValue('--tile-size'));
const tileMargin = parseInt(styles.getPropertyValue('--tile-margin'));
const tileFontSize = parseInt(styles.getPropertyValue('--tile-font-size'));

const getColumn = (matrix: any[][], column: number) => matrix.map((row) => row[column]);

type Pos = {
  i: number,
  j: number,
};

type Direction = "Up" | "Down" | "Left" | "Right";

function randint(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

class Tile {
  pos: Pos;
  value: number;
  element: HTMLDivElement;

  constructor(value: number, pos: Pos) {
    this.pos = pos;
    this.value = value;

    this.element = document.createElement("div");
    this.setValue(value);
    this.moveTo(pos);
    this.element.classList.add("tile");
    this.element.style.backgroundColor = "black";
    this.element.classList.add("fade-in");
    this.element.classList.add("animated-move");
    document.getElementById("board")?.appendChild(this.element);
  }

  destroy() {
    this.element.classList.remove("fade-in");

    requestAnimationFrame(() => {
      this.element.classList.add("fade-out");
    });

    this.element.addEventListener("animationend", () => {
      this.element.remove();
    });
  }

  moveTo(pos: Pos) {
    this.pos = pos;
    this.element.style.left = `${tileMargin + pos.j * (tileSize + tileMargin)}px`;
    this.element.style.top = `${tileMargin + pos.i * (tileSize + tileMargin)}px`;
  }

  setValue(newValue: number) {
    this.value = newValue;
    this.element.innerText = newValue.toString();

    // correct font size for large values
    if (newValue > 9999) {
      this.element.style.fontSize = `${2 * tileFontSize / 3}px`;
    } else if (newValue > 999) {
      this.element.style.fontSize = `${4 * tileFontSize / 5}px`;
    }

    // set new text color
    this.element.style.color = styles.getPropertyValue(`--text-${newValue}`);
  }
}

class Board {
  board: (Tile | null)[][];
  moved: boolean = false; // have any tiles moved this turn?
  score: number = 0;
  highestTile: Tile | null = null;

  constructor() {
    this.board = Array(tilesPerRow).fill(null).map(() => Array(tilesPerRow).fill(null));
  }

  createTile(value: number, pos: Pos) {
    this.board[pos.i][pos.j] = new Tile(value, pos);
    this.updateHighestTile(this.board[pos.i][pos.j]!);
  }

  removeTile(tile: Tile) {
    this.board[tile.pos.i][tile.pos.j] = null;
    tile.destroy();
  }

  moveTileTo(from: Pos, to: Pos) {
    if (from.i === to.i && from.j === to.j) return; // can't do (from === to) directly

    this.moved = true;

    this.board[from.i][from.j]?.moveTo(to);

    this.board[to.i][to.j] = this.board[from.i][from.j];
    this.board[from.i][from.j] = null;
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
          emptyTiles.push({ i, j });
        }
      }
    }

    if (emptyTiles.length !== 0) {
      const newPos = emptyTiles[randint(0, emptyTiles.length - 1)];
      const newValue = randint(1, 100) > 10 ? 2 : 4;

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
            this.score += tile.value;
            this.updateHighestTile(tile);
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

  displayScore() {
    document.getElementById("score")!.textContent = `SCORE: ${this.score}`;
  }

  updateHighestTile(newTile: Tile) {
    if (this.highestTile) {
      if (newTile.value > this.highestTile.value) {
        this.highestTile = newTile;
      }
    } else {
      this.highestTile = newTile;
    }

    document.getElementById("full-window")!.style.background =
      getComputedStyle(this.highestTile.element).getPropertyValue("color");
  }

  lost() {
    // if there are empty tiles the game is not lost
    for (let i = 0; i < tilesPerRow; i++) {
      for (let j = 0; j < tilesPerRow; j++) {
        if (!this.board[i][j]) return false;
      }
    }

    // if there horizontally adjacent identical value tiles the game is not lost
    for (let i = 0; i < tilesPerRow; i++) {
      for (let j = 0; j < tilesPerRow - 1; j++) {
        if (this.board[i][j]?.value === this.board[i][j + 1]?.value) return false;
      }
    }

    // if there vertically adjacent identical value tiles the game is not lost
    for (let i = 0; i < tilesPerRow - 1; i++) {
      for (let j = 0; j < tilesPerRow; j++) {
        if (this.board[i][j]?.value === this.board[i + 1][j]?.value) return false;
      }
    }

    return true;
  }

  tick(key: Direction) {
    this.moved = false;
    this.move(key);
    this.displayScore();
    if (this.moved) this.spawnTile();
    if (this.lost()) alert("You Lose!");
  }
}

const board = new Board();

board.spawnTile();

window.addEventListener("keydown", (ev) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.key)) {
    board.tick(ev.key.slice(5) as Direction);
  }
});
