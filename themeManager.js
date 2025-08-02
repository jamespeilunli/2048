import theme from "./styles/defaultTheme.json" with { type: "json" };
export class ThemeManager {
    theme;
    constructor() {
        this.theme = theme;
        document.getElementById("full-window").style.backgroundColor = this.getWindowBackground() ?? "white";
        document.getElementById("board").style.backgroundColor = this.getBoardBackground() ?? "white";
    }
    getText() {
        return this.theme.text;
    }
    getBoardBackground() {
        return this.theme.boardBackground;
    }
    getWindowBackground() {
        return this.theme.windowBackground;
    }
    getTileTextColor(tileValue) {
        return this.theme.tileTextColors[tileValue.toString()];
    }
    getTileBackgroundColor(tileValue) {
        return this.theme.tileBackgroundColors[tileValue.toString()];
    }
}
export const themeManager = new ThemeManager();
