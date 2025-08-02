import { themeManager } from "./themeManager.js";
export class DynamicColors {
    constructor() {
        // set up proper default values and requestAnimationFrame so that we don't have a color transition at the start
        requestAnimationFrame(() => {
            document.getElementById("body").style.transition = "color 0.5s ease-in-out";
            document.getElementById("full-window").style.transition = "background-color 0.5s ease-in-out";
            document.getElementById("board").style.transition = "background-color 0.5s ease-in-out";
        });
        this.updateColors(themeManager.getTileTextColor(2), themeManager.getTileBackgroundColor(2));
    }
    // replace dynamic color elements with the text or background color of the highest tile
    updateColors(highestTileTextColor, highestTileBackgroundColor) {
        if (themeManager.getWindowBackground() === "dynamic-tile-background") {
            document.getElementById("full-window").style.background = highestTileBackgroundColor;
        }
        if (themeManager.getWindowBackground() === "dynamic-tile-text") {
            document.getElementById("full-window").style.background = highestTileTextColor;
        }
        if (themeManager.getBoardBackground() === "dynamic-tile-background") {
            document.getElementById("board").style.background = highestTileBackgroundColor;
        }
        if (themeManager.getBoardBackground() === "dynamic-tile-text") {
            document.getElementById("board").style.background = highestTileTextColor;
        }
        if (themeManager.getText() === "dynamic-tile-background") {
            document.getElementById("body").style.color = highestTileBackgroundColor;
        }
        if (themeManager.getText() === "dynamic-tile-text") {
            document.getElementById("body").style.color = highestTileTextColor;
        }
    }
}
