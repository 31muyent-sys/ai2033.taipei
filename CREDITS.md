# Credits and licences

臺北 2033 is a non-official fan site. This page lists the third-party code, fonts, data, photos and sounds it uses or
ships, with their licences. Where a licence asks for credit, the credit is also shown on the pages that use the item.

## Map data

- **OpenStreetMap** — © OpenStreetMap contributors, [Open Database License 1.0](https://opendatacommons.org/licenses/odbl/1-0/)
  ([attribution](https://www.openstreetmap.org/copyright)). Source of the 3D city, the minimap and every render,
  screenshot, card and video frame made from it. `3d/data/city.json` is a derived database under ODbL 1.0
  (see `3d/data/NOTICE.md`); the raw extracts are in `research/osm*/`. Credited in the 3D game (on screen next to the
  minimap, on the intro screen and in the help), on the main site's sources section, the slides and the video end card.

## Code

| Component | Where | Licence |
|---|---|---|
| [three.js](https://threejs.org/) r160 and addons | `vendor/three/` (the 3D game) | MIT, `vendor/three/LICENSE` |
| [satori](https://github.com/vercel/satori) 0.33 | `og/` share-card service (server side) | MPL-2.0 |
| [@resvg/resvg-js](https://github.com/yisibl/resvg-js) 2.6 | `og/` (server side) | MPL-2.0 |
| [harfbuzzjs](https://github.com/harfbuzz/harfbuzzjs), opentype.js, yoga-layout and other `og/` dependencies | `og/` (server side) | MIT / ISC / Apache-2.0, see `og/package-lock.json` |
| [Remotion](https://www.remotion.dev/), React | `video/` (builds the intro videos; not served) | Remotion licence / MIT |

The `og/` and `video/` dependencies are installed from npm when those projects are built; they are not copied into
this repository.

## Fonts

- **Noto Sans TC** (SIL Open Font License 1.1). Loaded from Google Fonts on the web pages; the share cards use subsets
  in `og/lib/fonts/` with the licence in `og/lib/fonts/OFL.txt`.

## Photos

From Wikimedia Commons, resized or cropped for the site:

- Photos by **臺北市政府**, **臺北市政府秘書處媒體事務組**, **高雄市政府** and **立法院**, used with attribution as their Commons
  pages state.
- **Solomon203**, CC BY-SA 4.0.
- **曾 成訓**, CC BY 2.0.
- **毛貓大少爺** and **ynes95**, CC BY-SA 2.0.
- **Lord Koxinga**, CC BY-SA 3.0.

Each file's title, author, licence and source link are listed on the main site (`index.html#sources`, generated from
`assets/photos/credits.json` by `tools/build/credits_html.py`). The 3D game credits each photo where it appears.

## Text and other sources

- Taipei City Government press release of 2026-10-08 and the press conference video: linked on the main site and the
  transcript page.
- `research/pages/`: research copies of news pages and two Wikipedia articles (CC BY-SA 4.0); see
  `research/pages/NOTICE.md`.

## Sounds

- `video/public/sfx/`: sound effects and music from Mixkit, see `video/public/sfx/ATTRIBUTION.md`.
- Narration in the intro videos was generated with ElevenLabs.
