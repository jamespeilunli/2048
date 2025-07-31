import theme from "./styles/defaultTheme.json" with { type: "json" };

interface Theme {
  text: string;
  boardBackground: string;
  windowBackground: string;
  tileTextColors: { [key: string]: string };
  tileBackgroundColors: { [key: string]: string };
}

export class ThemeManager {
  private theme: Theme;

  constructor() {
    this.theme = theme as Theme;

    document.getElementById("full-window")!.style.backgroundColor = this.getWindowBackground() ?? "white";
    document.getElementById("board")!.style.backgroundColor = this.getBoardBackground() ?? "white";
  }

  public getText(): string {
    return this.theme.text;
  }

  public getBoardBackground(): string {
    return this.theme.boardBackground;
  }

  public getWindowBackground(): string {
    return this.theme.windowBackground;
  }

  public getTileTextColor(tileValue: number): string {
    return this.theme.tileTextColors[tileValue.toString()];
  }

  public getTileBackgroundColor(tileValue: number): string {
    return this.theme.tileBackgroundColors[tileValue.toString()];
  }
}

export const themeManager = new ThemeManager();

