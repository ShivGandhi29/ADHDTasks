# App icon appearance variants

iOS only has two slots: **light** (default) and **dark**. All assets are in this folder; `Contents.json` chooses which two are used.

| Style   | Light slot file                      | Dark slot file                        |
|--------|--------------------------------------|---------------------------------------|
| Default| `App-Icon-Light-1024x1024@1x.png`    | `App-Icon-Dark-1024x1024@1x.png`      |
| Clear  | `App-Icon-ClearLight-1024x1024@1x.png` | `App-Icon-ClearDark-1024x1024@1x.png` |
| Tinted | `App-Icon-TintedLight-1024x1024@1x.png` | `App-Icon-TintedDark-1024x1024@1x.png` |

To switch style: edit `Contents.json` and set the first image’s `filename` to the desired light file and the second (dark appearance) image’s `filename` to the desired dark file.
