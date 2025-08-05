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

    this.resetBackgrounds();
    this.setupThemeFileLoading();
  }

  resetBackgrounds() {
    document.getElementById("full-window")!.style.backgroundColor = this.getWindowBackground() ?? "white";
    document.getElementById("board")!.style.backgroundColor = this.getBoardBackground() ?? "white";
  }

  loadTheme(theme: Theme) {
    this.theme = theme;
  }

  setupThemeFileLoading() {
    const input = document.getElementById("load-theme-button") as HTMLInputElement;

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];

      try {
        const text = await file.text();
        const parsed = JSON.parse(text);

        if (this.isValidTheme(parsed)) {
          this.loadTheme(parsed);
          this.resetBackgrounds();
        } else {
          alert("Invalid theme file structure.");
        }
      } catch (e) {
        alert("Failed to load or parse the theme file.");
      }

      // Clear value so re-selecting same file works
      input.value = "";
    };
  }

  private isValidTheme(obj: any): obj is Theme {
    if (
      typeof obj.text !== "string" ||
      typeof obj.boardBackground !== "string" ||
      typeof obj.windowBackground !== "string" ||
      typeof obj.tileTextColors !== "object" ||
      typeof obj.tileBackgroundColors !== "object"
    ) {
      return false;
    }

    const allValuesAreStrings = (o: any) => Object.values(o).every((v) => typeof v === "string");

    return allValuesAreStrings(obj.tileTextColors) && allValuesAreStrings(obj.tileBackgroundColors);
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
