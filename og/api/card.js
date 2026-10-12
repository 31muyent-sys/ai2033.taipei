// The 1200×630 share image for the same query as /api/share: laid out by satori, rasterised by resvg.
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { lookup } from '../lib/common.js';
import { cardTree, FONTS } from '../lib/card.js';
import { toNode } from '../lib/node.js';

export async function handle(request) {
  const x = await lookup(new URL(request.url).searchParams);
  const svg = await satori(cardTree(x), { width: 1200, height: 630, fonts: FONTS });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
  return new Response(png, {
    headers: {
      'content-type': 'image/png',
      'cache-control': x.kind === 'site' ? 'public, s-maxage=86400' : 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600',
    },
  });
}

export default toNode(handle);
