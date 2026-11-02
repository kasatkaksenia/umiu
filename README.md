# umiu

Mobile-first Train / Food / Cycle app. The whole app is one self-contained file: `index.html`.

- No image files are needed. All pictures (hero art, quote pictures, icons, wordmark, exercise figures) are drawn in code.
- Fonts load from Google Fonts. Optional sync uses the Claude Artifact runtime capabilities (`db`, `user`, `sample`, `downloads`). Without them the app works locally in the browser.
- `previews/` holds two example images only; the app does not use them.

## Rebuilding index.html

The source lives in `build/` and is assembled by a chain of scripts:

    cd build
    python3 assemble10.py      # writes v10.html
    cp v10.html ../index.html

`assemble10.py` first runs the earlier steps in `assemble5.py`, then applies its own patches, using `v3.html`, `v4.html`, `v5.html` and the `head*.html` / `p*.js` / `part*.js` files.
Edit the newest files (`head12.html`, `head_add12.css`, `p3_12.js`, `p8a.js`, `p8b.js`, `p9.js`, `patch10.py`) for new work.
