// Render one of the cards to a PNG file, for pages on the static site (e.g. assets/og-rank.jpg):
//   node og/tools/static-card.mjs rank out.png
import fs from 'fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { cardTree, FONTS } from '../lib/card.js';
const [, , kind = 'rank', out = 'card.png'] = process.argv;
const svg = await satori(cardTree({ kind, rows: [] }), { width: 1200, height: 630, fonts: FONTS });
fs.writeFileSync(out, new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng());
console.log(out);
