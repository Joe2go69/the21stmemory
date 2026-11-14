#!/usr/bin/env python3
"""
Share cards (1200x630) for every live topic, built from that topic's own art.

  python3 scripts/generate-share-cards.py          # only missing or outdated cards
  python3 scripts/generate-share-cards.py --force  # rebuild every card

Output: images/og-default.webp (site-wide card, from the homepage lotus art)
and images/og/{source}/{id}.jpg — used as og:image / twitter:image by the
topic page and its quiz (build-static-dives.js, sync-quiz-chrome.js). If a card
is missing, those pages fall back to the topic image, as before.

The card is the topic's existing illustration, cropped to 1.91:1, with the
series name, the topic title and the 21st Memory mark set in the site fonts.
The on-page images are never touched. Needs Pillow (pip install pillow).
"""
import json, os, re, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
W, H = 1200, 630
FORCE = '--force' in sys.argv
GROTESK = os.path.join(ROOT, 'assets/fonts/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.woff2')
INTER = os.path.join(ROOT, 'assets/fonts/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2')
MARK = os.path.join(ROOT, 'images/21st-mark.webp')
SOURCES = ['alice', 'breakdown', 'ascension', 'revelations', 'special-requests']


def font(path, size, weight):
    f = ImageFont.truetype(path, size)
    f.set_variation_by_axes([weight])
    return f


def cover(img, focus_y=None):
    """Scale to fill 1200x630 and crop; portrait/square art keeps its upper-middle."""
    img = img.convert('RGB')
    if focus_y is None:
        focus_y = 0.35 if img.height > img.width else 0.5
    s = max(W / img.width, H / img.height)
    img = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x = (img.width - W) // 2
    y = int((img.height - H) * focus_y) if img.height > H else 0
    return img.crop((x, y, x + W, y + H))


def wrap(draw, text, fnt, width, max_lines):
    words, lines, cur = text.split(), [], ''
    for w in words:
        trial = (cur + ' ' + w).strip()
        if draw.textlength(trial, font=fnt) <= width:
            cur = trial
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    if len(lines) > max_lines:
        return None
    return lines


def render(art_path, kicker, title, out_path):
    base = cover(Image.open(art_path))
    # Bottom scrim so the type always clears AA on any art.
    scrim = Image.new('L', (1, H))
    for yy in range(H):
        t = max(0.0, (yy - H * 0.15) / (H * 0.6))
        scrim.putpixel((0, yy), int(240 * min(1.0, t) ** 0.9))
    scrim = scrim.resize((W, H))
    vault = Image.new('RGB', (W, H), (12, 8, 26))
    base = Image.composite(vault, base, scrim)
    d = ImageDraw.Draw(base)

    pad = 64
    # Title: largest size that fits in 2 lines (3 for long titles).
    for size in (68, 62, 56, 50, 46, 42):
        tf = font(GROTESK, size, 600)
        lines = wrap(d, title, tf, W - pad * 2, 2 if size > 50 else 3)
        if lines:
            break
    else:
        tf = font(GROTESK, 42, 600)
        lines = wrap(d, title, tf, W - pad * 2, 99)[:3]
    line_h = int(tf.size * 1.1)
    brand_h = 54
    y = H - pad - brand_h - 22 - line_h * len(lines)
    kf = font(INTER, 22, 600)
    # Soft shadow under the type for busy, bright art.
    shadow = Image.new('L', (W, H), 0)
    sd = ImageDraw.Draw(shadow)
    sd.text((pad, y - 40), kicker.upper(), font=kf, fill=200)
    for i, line in enumerate(lines):
        sd.text((pad, y + i * line_h), line, font=tf, fill=200)
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    base = Image.composite(Image.new('RGB', (W, H), (8, 5, 18)), base, shadow)
    d = ImageDraw.Draw(base)
    d.text((pad, y - 40), kicker.upper(), font=kf, fill=(196, 181, 253), spacing=0)
    for i, line in enumerate(lines):
        d.text((pad, y + i * line_h), line, font=tf, fill=(248, 250, 252))

    # Brand row: mark + wordmark left, address right.
    by = H - pad - brand_h + 6
    mark = Image.open(MARK).convert('RGBA').resize((48, 48), Image.LANCZOS)
    base.paste(mark, (pad - 4, by), mark)
    wf = font(GROTESK, 26, 600)
    d.text((pad + 54, by + 9), '21ST MEMORY', font=wf, fill=(248, 250, 252))
    uf = font(INTER, 22, 500)
    url = '21stmemory.com'
    d.text((W - pad - d.textlength(url, font=uf), by + 13), url, font=uf, fill=(196, 181, 253))

    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    base.save(out_path, 'JPEG', quality=80, optimize=True, progressive=True)


def render_default(out_path):
    """Site-wide card: the homepage lotus on the right, name and line on the left."""
    hero = Image.open(os.path.join(ROOT, 'images/hero-atmosphere.webp')).convert('RGB')
    hh = 760
    hw = round(hero.width * hh / hero.height)
    hero = hero.resize((hw, hh), Image.LANCZOS)
    base = Image.new('RGB', (W, H), (10, 6, 24))
    base.paste(hero, (835 - hw // 2, (H - hh) // 2 - 10))
    # Fade the left side into the vault colour so the type sits on calm ground.
    fade = Image.new('L', (W, 1))
    for xx in range(W):
        t = 1 - min(1.0, max(0.0, (xx - 300) / 380))
        fade.putpixel((xx, 0), int(235 * t))
    fade = fade.resize((W, H))
    base = Image.composite(Image.new('RGB', (W, H), (10, 6, 24)), base, fade)
    d = ImageDraw.Draw(base)
    pad = 80
    mark = Image.open(MARK).convert('RGBA').resize((96, 96), Image.LANCZOS)
    base.paste(mark, (pad - 8, 150), mark)
    d.text((pad, 268), '21ST MEMORY', font=font(GROTESK, 76, 600), fill=(248, 250, 252))
    lf = font(INTER, 30, 500)
    d.text((pad, 370), 'A reading of Thalon Thor’s', font=lf, fill=(221, 214, 254))
    d.text((pad, 410), 'transmissions', font=lf, fill=(221, 214, 254))
    d.text((pad, 492), '21stmemory.com', font=font(INTER, 24, 500), fill=(196, 181, 253))
    base.save(out_path, 'WEBP', quality=90, method=6)


def walk(topics):
    for t in topics:
        yield t
        yield from walk(t.get('subtopics') or [])


def is_live(source, topic_id):
    p = os.path.join(ROOT, 'dive', source, f'{topic_id}.html')
    if not os.path.exists(p):
        return False
    head = open(p, encoding='utf8').read(6000)
    return 'noindex' not in head


def main():
    default_out = os.path.join(ROOT, 'images', 'og-default.webp')
    hero_src = os.path.join(ROOT, 'images', 'hero-atmosphere.webp')
    if FORCE or not os.path.exists(default_out) or os.path.getmtime(default_out) < max(
            os.path.getmtime(hero_src), os.path.getmtime(os.path.abspath(__file__))):
        render_default(default_out)
        print('wrote images/og-default.webp')
    made = skipped = 0
    missing_art = []
    for source in SOURCES:
        idx_path = os.path.join(ROOT, 'data', f'{source}-topics-index.json')
        if not os.path.exists(idx_path):
            continue
        idx = json.load(open(idx_path, encoding='utf8'))
        series = idx.get('title') or source
        for t in walk(idx.get('topics') or []):
            tid = t.get('id')
            if not tid or not is_live(source, tid):
                continue
            art = t.get('topic_image') or ''
            content_path = os.path.join(ROOT, 'data', f'{source}-topics', f'{tid}.json')
            if not art and os.path.exists(content_path):
                c = json.load(open(content_path, encoding='utf8'))
                art = c.get('topic_image') or c.get('infographic_image') or ''
            art_path = os.path.join(ROOT, art) if art else ''
            if not art_path or not os.path.exists(art_path) or 'placeholder' in art:
                missing_art.append(f'{source}/{tid}')
                continue
            out = os.path.join(ROOT, 'images', 'og', source, f'{tid}.jpg')
            inputs = [art_path, os.path.abspath(__file__), idx_path]
            if not FORCE and os.path.exists(out) and os.path.getmtime(out) >= max(os.path.getmtime(p) for p in inputs):
                skipped += 1
                continue
            render(art_path, series, t.get('title') or tid, out)
            made += 1
    print(f'share cards: {made} written, {skipped} up to date')
    if missing_art:
        print(f'no usable art (page keeps its current share image): {", ".join(missing_art)}')


if __name__ == '__main__':
    main()
