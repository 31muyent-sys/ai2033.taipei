// Vercel's classic Node.js function signature (req, res) around a Web-standard handler(Request) -> Response.
export const toNode = (handle) => async (req, res) => {
  // Canonical origin is deployment configuration, never a caller-controlled forwarded header.
  const origin = process.env.SHARE_ORIGIN || 'https://go.ai2033.taipei';
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.statusCode = 405; res.setHeader('Allow', 'GET, HEAD'); res.end(); return;
  }
  if (!req.url?.startsWith('/') || req.url.startsWith('//') || req.url.length > 2048) {
    res.statusCode = 400; res.end('Bad request'); return;
  }
  const url = new URL(req.url, origin);
  if (url.origin !== new URL(origin).origin) { res.statusCode = 400; res.end('Bad request'); return; }
  const r = await handle(new Request(url, { method: req.method }));
  res.statusCode = r.status;
  r.headers.forEach((v, k) => res.setHeader(k, v));
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.end(req.method === 'HEAD' ? undefined : Buffer.from(await r.arrayBuffer()));
};
