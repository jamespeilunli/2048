"use strict";
// note: most of the args inside parseInt are strings with "px" suffix
const styles = getComputedStyle(document.documentElement);
const tilesPerRow = parseInt(styles.getPropertyValue('--tiles-per-row'));
const tileSize = parseInt(styles.getPropertyValue('--tile-size'));
const tileMargin = parseInt(styles.getPropertyValue('--tile-margin'));
const tileFontSize = parseInt(styles.getPropertyValue('--tile-font-size'));
const getColumn = (matrix, column) => matrix.map((row) => row[column]);
function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}
class Tile {
    constructor(value, pos) {
        var _a;
        this.pos = pos;
        this.value = value;
        this.element = document.createElement("div");
        this.setValue(value);
        this.moveTo(pos);
        this.element.classList.add("tile");
        this.element.classList.add("fade-in");
        this.element.classList.add("animated-move");
        (_a = document.getElementById("board")) === null || _a === void 0 ? void 0 : _a.appendChild(this.element);
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
    moveTo(pos) {
        this.pos = pos;
        this.element.style.left = `${tileMargin + pos.j * (tileSize + tileMargin)}px`;
        this.element.style.top = `${tileMargin + pos.i * (tileSize + tileMargin)}px`;
    }
    setValue(newValue) {
        this.value = newValue;
        this.element.innerText = newValue.toString();
        // correct font size for large values
        if (newValue > 9999) {
            this.element.style.fontSize = `${2 * tileFontSize / 3}px`;
        }
        else if (newValue > 999) {
            this.element.style.fontSize = `${4 * tileFontSize / 5}px`;
        }
        // set new tile color
        this.element.style.color = styles.getPropertyValue(`--text-${newValue}`);
        this.element.style.backgroundColor = styles.getPropertyValue(`--bg-${newValue}`);
    }
}
class Game {
    constructor() {
        this.moved = false; // have any tiles moved this turn?
        this.score = 0;
        this.highScore = 0;
        this.highestTile = null;
        this.gameOver = false;
        this.board = Array(tilesPerRow).fill(null).map(() => Array(tilesPerRow).fill(null));
    }
    createTile(value, pos) {
        this.board[pos.i][pos.j] = new Tile(value, pos);
        this.updateHighestTile(this.board[pos.i][pos.j]);
    }
    removeTile(tile) {
        this.board[tile.pos.i][tile.pos.j] = null;
        tile.destroy();
    }
    moveTileTo(from, to) {
        var _a;
        if (from.i === to.i && from.j === to.j)
            return; // can't do (from === to) directly
        this.moved = true;
        (_a = this.board[from.i][from.j]) === null || _a === void 0 ? void 0 : _a.moveTo(to);
        this.board[to.i][to.j] = this.board[from.i][from.j];
        this.board[from.i][from.j] = null;
    }
    moveTile(from, index, direction) {
        if (direction === "Up")
            this.moveTileTo(from.pos, { i: index, j: from.pos.j });
        if (direction === "Down")
            this.moveTileTo(from.pos, { i: tilesPerRow - index - 1, j: from.pos.j });
        if (direction === "Left")
            this.moveTileTo(from.pos, { i: from.pos.i, j: index });
        if (direction === "Right")
            this.moveTileTo(from.pos, { i: from.pos.i, j: tilesPerRow - index - 1 });
    }
    spawnTile() {
        let emptyTiles = [];
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
    shiftLine(line, direction) {
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
                    }
                    else {
                        this.moveTile(prevTile, i, direction);
                        prevTile = tile;
                    }
                    i++;
                }
                else {
                    prevTile = tile;
                }
            }
        }
        if (prevTile) {
            prevTile.setValue(prevTile.value);
            this.moveTile(prevTile, i, direction);
        }
    }
    move(direction) {
        if (direction === "Left") {
            this.board.forEach((row) => this.shiftLine(row, direction));
        }
        if (direction === "Right") {
            this.board.forEach((row) => this.shiftLine([...row].reverse(), direction));
        }
        if (direction === "Up") {
            this.board.forEach((row, index) => this.shiftLine(getColumn(this.board, index), direction));
        }
        if (direction === "Down") {
            this.board.forEach((row, index) => this.shiftLine(getColumn(this.board, index).reverse(), direction));
        }
    }
    displayScore() {
        document.getElementById("score").textContent = `SCORE: ${this.score}`;
    }
    updateHighScore() {
        var _a;
        if (this.score > this.highScore)
            localStorage.setItem("high-score", this.score.toString());
        this.highScore = parseInt((_a = localStorage.getItem("high-score")) !== null && _a !== void 0 ? _a : "0");
        document.getElementById("high-score").textContent = `HIGH SCORE: ${this.highScore}`;
    }
    updateHighestTile(newTile) {
        if (this.highestTile) {
            if (newTile.value > this.highestTile.value) {
                this.highestTile = newTile;
            }
        }
        else {
            this.highestTile = newTile;
        }
        dynamicColors.updateColors(getComputedStyle(this.highestTile.element));
    }
    lost() {
        var _a, _b, _c, _d;
        // if there are empty tiles the game is not lost
        for (let i = 0; i < tilesPerRow; i++) {
            for (let j = 0; j < tilesPerRow; j++) {
                if (!this.board[i][j])
                    return false;
            }
        }
        // if there horizontally adjacent identical value tiles the game is not lost
        for (let i = 0; i < tilesPerRow; i++) {
            for (let j = 0; j < tilesPerRow - 1; j++) {
                if (((_a = this.board[i][j]) === null || _a === void 0 ? void 0 : _a.value) === ((_b = this.board[i][j + 1]) === null || _b === void 0 ? void 0 : _b.value))
                    return false;
            }
        }
        // if there vertically adjacent identical value tiles the game is not lost
        for (let i = 0; i < tilesPerRow - 1; i++) {
            for (let j = 0; j < tilesPerRow; j++) {
                if (((_c = this.board[i][j]) === null || _c === void 0 ? void 0 : _c.value) === ((_d = this.board[i + 1][j]) === null || _d === void 0 ? void 0 : _d.value))
                    return false;
            }
        }
        return true;
    }
    tick(key) {
        this.moved = false;
        this.move(key);
        this.displayScore();
        this.updateHighScore();
        if (this.moved)
            this.spawnTile();
        if (this.lost())
            this.end();
    }
    run() {
        this.spawnTile();
        this.updateHighScore();
        window.addEventListener("keydown", (ev) => {
            if (!this.gameOver && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.key)) {
                this.tick(ev.key.slice(5));
            }
        });
    }
    end() {
        this.gameOver = true;
        document.getElementById("game-over").style.display = "flex";
        document.getElementById("game-over").style.backgroundColor = "rgba(0, 0, 0, 0.65)";
        document.getElementById("game-summary").innerHTML =
            `<p>SCORE: ${this.score}</p>
       <p>HIGH SCORE: ${this.highScore}</p>`;
    }
}
const dynamicColors = new DynamicColors();
dynamicColors.init();
const game = new Game();
game.run();
