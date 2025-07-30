import theme from './styles/defaultTheme.json' with { type: "json" };

interface Theme {
  text: string | null;
  boardBackground: string | null;
  windowBackground: string | null;
  dynamicColor: string;
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

  public getText(): string | null {
    return this.theme.text;
  }

  public getBoardBackground(): string | null {
    return this.theme.boardBackground;
  }

  public getWindowBackground(): string | null {
    return this.theme.windowBackground;
  }

  public getDynamicColor(): string {
    return this.theme.dynamicColor;
  }

  public getTileTextColor(tileValue: number): string {
    return this.theme.tileTextColors[tileValue.toString()];
  }

  public getTileBackgroundColor(tileValue: number): string {
    return this.theme.tileBackgroundColors[tileValue.toString()];
  }
}

export const themeManager = new ThemeManager();