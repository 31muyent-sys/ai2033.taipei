// A share link (/r/123, /r?n=ABC&ms=83450&k=0, /b): Open Graph tags made for this one run, then the person is sent on
// to the game (or the boards). Link-preview crawlers don't run scripts, so they stop here and read the tags.
import { lookup, words, cardQuery, esc } from '../lib/common.js';
import { toNode } from '../lib/node.js';

export async function handle(request) {
  const url = new URL(request.url), q = url.searchParams;
  const x = await lookup(q), w = words(x);
  // the link people see and crawlers cache: /r/123, /r?n=…, /b
  const self = q.get('board') ? `${url.origin}/b` : x.id ? `${url.origin}/r/${x.id}` : `${url.origin}/r?${cardQuery(q)}`;
  const card = `${url.origin}/card?${cardQuery(q)}`;
  const html = `<!doctype html>
<html lang="zh-Hant-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(w.title)}</title>
<meta name="description" content="${esc(w.desc)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="臺北 2033">
<meta property="og:title" content="${esc(w.title)}">
<meta property="og:description" content="${esc(w.desc)}">
<meta property="og:url" content="${esc(self)}">
<meta property="og:image" content="${esc(card)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(w.title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(w.title)}">
<meta name="twitter:description" content="${esc(w.desc)}">
<meta name="twitter:image" content="${esc(card)}">
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#0b1730;color:#fff;font:20px/1.6 "Noto Sans TC","PingFang TC","Microsoft JhengHei",sans-serif;text-align:center;padding:24px}
  a{color:#0b1730;background:#ffc83d;padding:.6em 1.2em;border-radius:12px;font-weight:700;text-decoration:none;display:inline-block;margin-top:12px}
</style>
</head>
<body>
<main>
  <p>${esc(w.title)}</p>
  <a href="${esc(w.go)}">🚕 前往臺北 2033</a>
</main>
<script>location.replace(${JSON.stringify(w.go)});</script>
</body>
</html>`;
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=600' },
  });
}

export default toNode(handle);
