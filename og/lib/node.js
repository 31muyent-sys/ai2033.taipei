// Vercel's classic Node.js function signature (req, res) around a Web-standard handler(Request) -> Response.
export const toNode = (handle) => async (req, res) => {
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost';
  const proto = (req.headers['x-forwarded-proto'] || 'https').split(',')[0];
  const r = await handle(new Request(`${proto}://${host}${req.url}`, { method: req.method, headers: req.headers }));
  res.statusCode = r.status;
  r.headers.forEach((v, k) => res.setHeader(k, v));
  res.end(Buffer.from(await r.arrayBuffer()));
};
