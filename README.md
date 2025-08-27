# 2048

## Running

Run:

```bash
npm run dev
```

Then go to `localhost:3000` in the browser.

## Customizable Colors

Modify `src/styles/defaultTheme.json`, or load a theme json file with the same format using the "Load Theme" button to customize colors.

### Theme Configuration

Themes are defined in a JSON file with the following keys:

* `text` – Default text color.
* `boardBackground` – Background of the board.
* `windowBackground` – Background behind the board.
* `tileTextColors` – Map of tile values → text color.
* `tileBackgroundColors` – Map of tile values → background color.

All values accept any valid CSS color.
Additionally, `text`, `boardBackground`, and `windowBackground` support:

* `"dynamic-tile-text"` - Uses the highest tile’s text color.
* `"dynamic-tile-background"` - Uses the highest tile’s background color.

See `src/styles/defaultTheme.json` for an example.

### Loading a Theme

Edit `src/styles/defaultTheme.json` or load a custom theme file (same format) with the **Load Theme** button.
