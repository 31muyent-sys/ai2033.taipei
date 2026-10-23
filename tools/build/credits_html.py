"""Write the photo credits into index.html (between the CREDITS markers) from assets/photos/credits.json.

Each line names the Commons file, its author, the licence (linked to its text for CC licences) and the source page,
and says the site shows a resized or cropped copy. Static HTML, so the credits are there without JavaScript.
Run from the repo root after tools/fetch/photos.py: python3 tools/build/credits_html.py
"""
import html, json, re, pathlib

CC = {
    'CC BY-SA 4.0': 'https://creativecommons.org/licenses/by-sa/4.0/deed.zh-hant',
    'CC BY-SA 3.0': 'https://creativecommons.org/licenses/by-sa/3.0/deed.zh-hant',
    'CC BY-SA 2.0': 'https://creativecommons.org/licenses/by-sa/2.0/deed.zh-hant',
    'CC BY 2.0': 'https://creativecommons.org/licenses/by/2.0/deed.zh-hant',
}
# Commons gives no author for this one; the photo comes from the Legislative Yuan's site
AUTHOR_FIX = {'chiang-podium.jpg': '立法院'}

root = pathlib.Path(__file__).resolve().parents[2]
credits = json.loads((root / 'assets/photos/credits.json').read_text())
lines = []
for c in credits:
    name = c['file'].split('/')[-1]
    title = c['title'].removeprefix('File:')
    who = AUTHOR_FIX.get(name) or re.sub(r'Unknown author|​', '', c.get('artist') or '').strip() or '—'
    lic = c.get('license') or '見原始頁面'
    lic_html = (f'<a href="{CC[lic]}" target="_blank" rel="noopener">{lic}</a>' if lic in CC
                else '姓名標示' if lic == 'Attribution' else html.escape(lic))
    lines.append(f'      <li><a href="{html.escape(c["page"])}" target="_blank" rel="noopener">{html.escape(title)}</a>'
                 f'（本站 {name}）：{html.escape(who)}，{lic_html}，Wikimedia Commons。本站使用縮圖／裁切版本。</li>')

page = root / 'index.html'
s = page.read_text()
block = '<ul class="credits" id="credits">\n' + '\n'.join(lines) + '\n    </ul>'
s, n = re.subn(r'<ul class="credits" id="credits">.*?</ul>', lambda m: block, s, count=1, flags=re.S)
assert n == 1, 'credits list not found in index.html'
page.write_text(s)
print(f'{len(lines)} photo credits written to index.html')
