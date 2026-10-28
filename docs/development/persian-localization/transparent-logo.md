# Transparent institutional logo

The white-backed project logo was edited with the built-in `image_gen` tool
using background-extraction mode and `transparent_background: true`.
The original user-supplied file was not overwritten.

The selected output is an RGBA PNG with genuine alpha transparency. Its native
canvas is **1054 × 1492**, compared with the original **1060 × 1500**. It was
copied without resampling into `app/assets/images/university_logo.png` and the
nine matching PNG variants. Four SVG wrappers and the standalone error page
embed those same transparent PNG bytes. SVG view boxes follow the new native
canvas dimensions. Existing ICO files already had transparent backgrounds and
were not changed.

Original PNG SHA256: `d2b5d783f378e504ab03c34c0b07f12040b7ebd785acf7d2b8651823c6467abc`.

Transparent PNG SHA256: `8cd1ee92a27ace0f75bc3d864e30bf606505e72bf30f6a8830fe3c0e23b4c50d`.

## Exact edit prompt

```text
Use case: background-extraction. Input image 1 is the edit target: the exact existing blue institutional logo with Persian calligraphy on a white page. Remove ONLY the white and near-white paper background, including the white negative spaces inside the emblem, letters and between strokes, to genuine alpha transparency. Preserve the original deep blue emblem, all thin strokes, every Persian calligraphic letter, the year ۱۳۶۵ and all typography EXACTLY as the source. Do not redesign, redraw, recolor, reinterpret or replace any part of the mark or Persian text. Preserve original alignment, composition, aspect ratio and full original margins and framing; ideally retain original 1060 by 1500 pixel canvas. Clean antialiased blue edges without white halos. Output one transparent PNG with the exact original blue artwork, no additional text, no shadow, no border, no background, and no simulated checkerboard.
```

## Local checks

All ten PNG assets decode as RGBA with alpha spanning 0–255 and zero-alpha
corner pixels. All five embedded variants contain the exact same output PNG.
Browser verification and image identity are recorded in `VALIDATION.md`.
