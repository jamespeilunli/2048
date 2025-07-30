import { themeManager } from "./themeManager.js";
export class DynamicColors {
    type = themeManager.getDynamicColor();
    changeFullWindow = themeManager.getWindowBackground() === null;
    changeBoard = themeManager.getBoardBackground() === null;
    changeText = themeManager.getText() === null;
    constructor() {
        console.log(this.changeFullWindow, this.changeBoard, this.changeText);
        // set up proper default values so that we don't have a color transition at the start
        if (this.changeText) {
            let style = document.getElementById("body").style;
            style.color = themeManager.getTileTextColor(2);
            requestAnimationFrame(() => {
                style.transition = "color 0.5s ease-in-out";
            });
        }
        else if (this.changeFullWindow) {
            let style = document.getElementById("full-window").style;
            requestAnimationFrame(() => {
                style.transition = "background-color 0.5s ease-in-out";
            });
        }
        else if (this.changeBoard) {
            let style = document.getElementById("board").style;
            style.backgroundColor = themeManager.getTileBackgroundColor(2);
            requestAnimationFrame(() => {
                style.transition = "background-color 0.5s ease-in-out";
            });
        }
    }
    updateColors(highestTileStyle) {
        // replace dynamic color elements with the color of the highest tile
        if (this.changeFullWindow) {
            document.getElementById("full-window").style.background = highestTileStyle.getPropertyValue(this.type);
        }
        if (this.changeBoard) {
            document.getElementById("board").style.background = highestTileStyle.getPropertyValue(this.type);
        }
        if (this.changeText) {
            document.getElementById("body").style.color = highestTileStyle.getPropertyValue(this.type);
        }
    }
}
