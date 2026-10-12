# Cut Noto Sans TC down to the characters the share cards can show (og/lib/*.js text plus ASCII), so the
# function ships two small fonts instead of 14 MB. Run after changing any card wording:
#   python3 og/tools/subset.py /path/to/NotoSansTC-900.ttf /path/to/NotoSansTC-700.ttf
import pathlib, re, subprocess, sys
root = pathlib.Path(__file__).resolve().parents[1]
text = ''.join(p.read_text(encoding='utf8') for p in (root / 'lib').glob('*.js'))
chars = sorted({c for c in text if ord(c) > 127} | {chr(c) for c in range(32, 127)} | set('・→，、：！？（）｜'))
(root / 'tools' / 'chars.txt').write_text(''.join(chars), encoding='utf8')
for src in sys.argv[1:]:
    w = re.search(r'-(\d{3})\.ttf$', src).group(1)
    out = root / 'lib' / 'fonts' / f'NotoSansTC-{w}.subset.ttf'
    subprocess.run(['pyftsubset', src, f'--text-file={root / "tools" / "chars.txt"}', f'--output-file={out}', '--layout-features=*', '--no-hinting'], check=True)
    print(out.name, out.stat().st_size, 'bytes')
