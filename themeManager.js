import theme from "./styles/defaultTheme.json" with { type: "json" };
export class ThemeManager {
    theme;
    constructor() {
        this.theme = theme;
        this.resetTextAndBackgrounds();
        this.setupThemeFileLoading();
    }
    resetTextAndBackgrounds() {
        const text = this.getText();
        const windowBg = this.getWindowBackground();
        const boardBg = this.getBoardBackground();
        if (text !== "dynamic-tile-background" && text !== "dynamic-tile-text") {
            document.getElementById("body").style.color = text ?? "white";
        }
        if (windowBg !== "dynamic-tile-background" && windowBg !== "dynamic-tile-text") {
            document.getElementById("full-window").style.backgroundColor = windowBg ?? "white";
        }
        if (boardBg !== "dynamic-tile-background" && boardBg !== "dynamic-tile-text") {
            document.getElementById("board").style.backgroundColor = boardBg ?? "white";
        }
    }
    themeChangeListeners = [];
    onThemeChange(listener) {
        this.themeChangeListeners.push(listener);
    }
    loadTheme(theme) {
        this.theme = theme;
    }
    setupThemeFileLoading() {
        const input = document.getElementById("load-theme-button");
        input.onchange = async () => {
            if (!input.files || input.files.length === 0)
                return;
            const file = input.files[0];
            try {
                const text = await file.text();
                const parsed = JSON.parse(text);
                if (this.isValidTheme(parsed)) {
                    this.loadTheme(parsed);
                    this.resetTextAndBackgrounds();
                    this.themeChangeListeners.forEach((listener) => listener());
                }
                else {
                    alert("Invalid theme file structure.");
                }
            }
            catch (e) {
                alert("Failed to load or parse the theme file.");
            }
            // Clear value so re-selecting same file works
            input.value = "";
        };
    }
    isValidTheme(obj) {
        if (typeof obj.text !== "string" ||
            typeof obj.boardBackground !== "string" ||
            typeof obj.windowBackground !== "string" ||
            typeof obj.tileTextColors !== "object" ||
            typeof obj.tileBackgroundColors !== "object") {
            return false;
        }
        const allValuesAreStrings = (o) => Object.values(o).every((v) => typeof v === "string");
        return allValuesAreStrings(obj.tileTextColors) && allValuesAreStrings(obj.tileBackgroundColors);
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
