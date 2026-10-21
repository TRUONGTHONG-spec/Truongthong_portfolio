"""Add the UTMB branding case study after build-portfolio.py.
Run: python build-utmb.py /path/to/exported-project-deck.pdf
Reuses original embedded artwork; requires PyMuPDF and Pillow.
"""
from pathlib import Path
import fitz, io, json, re, sys, html
from PIL import Image

ROOT = Path(__file__).resolve().parent
SLUG = 'vietnam-highlands-trail-utmb'
PAGE = 'project-' + SLUG + '.html'
SOURCE = 'https://docs.google.com/presentation/d/1Rt2-ux04PN8c_KIiNIVUZd60jCmz3vSrFJ8Haw1hbcM/edit'
E = html.escape

def add_to_archive():
    work = ROOT / 'work.html'
    text = work.read_text()
    text = re.sub(r'<article class="archive-card" data-project="utmb"[^>]*>.*?</article>', '', text, flags=re.S)
    card = f'''<article class="archive-card" data-project="utmb" data-work-category="branding" data-search="vietnam highlands trail utmb da lat dalat lam dong branding key visual medal merchandise pattern saola 2027"><a href="{PAGE}" aria-label="View Vietnam Highlands Trail by UTMB branding"><div class="archive-image"><img src="utmb-pinhatt-kv.webp" width="1675" height="939" alt="Vietnam Highlands Trail by UTMB — Pinhatt key visual" loading="eager" decoding="async"><span class="archive-open" aria-hidden="true">↗</span></div><div class="archive-meta"><span>Vietnam Highlands Trail by UTMB</span><span>NEW</span></div><h2>Meet you in the Highlands.</h2><p>Branding<span>View project ↗</span></p></a></article>'''
    text = text.replace('<div class="archive-grid">', '<div class="archive-grid">' + card)
    total=text.count('<article class="archive-card"')
    text=re.sub(r'\d+ projects spanning',f'{total} projects spanning',text).replace('2016–2025 portfolio.', 'portfolio and selected branding presentations.')
    text=text.replace('DESIGN ARCHIVE / 2016—2025', 'DESIGN ARCHIVE / SELECTED PROJECTS')
    text=re.sub(r'\d+ PROJECTS · ONE CURIOUS DESIGNER',f'{total} PROJECTS · ONE CURIOUS DESIGNER',text)
    text=re.sub(r'(id="project-count"[^>]*>)\d+ projects',lambda m:m[1]+f'{total} projects',text)
    work.write_text(text)
    manifest = ROOT / 'portfolio-projects.json'
    data = [p for p in json.loads(manifest.read_text()) if p['slug'] != SLUG]
    data.insert(0, dict(slug=SLUG, client='Vietnam Highlands Trail by UTMB', title='Meet you in the Highlands.', category='branding', role='Brand & visual design', scope='Key visuals · Pattern & icons · Medal concepts · Merchandise', edition='2027', source=SOURCE, image_count=19))
    manifest.write_text(json.dumps(data, ensure_ascii=False, indent=2))
    if (ROOT/"work-thumbnails.json").exists():
        import runpy
        runpy.run_path(str(ROOT/"apply-work-thumbnails.py"))["apply"]()

def build(pdf_path):
    doc = fitz.open(pdf_path)
    assets = {}
    def save(name, im):
        im = im.convert('RGB')
        im.thumbnail((2400, 3200))
        filename = 'utmb-' + name + '.webp'
        buffer = io.BytesIO()
        im.save(buffer, 'WEBP', quality=95, method=6)
        (ROOT / filename).write_bytes(buffer.getvalue())
        assets[name] = (filename, im.width, im.height)
    def native(name, xref):
        save(name, Image.open(io.BytesIO(doc.extract_image(xref)['image'])))
    def board(name, number, box):
        pix = doc[number-1].get_pixmap(matrix=fitz.Matrix(3.5,3.5), clip=fitz.Rect(box), alpha=False)
        save(name, Image.frombytes('RGB', [pix.width,pix.height], pix.samples))
    for name,xref in [('pinhatt-kv',727),('runner-kv',193),('saola-patterns',743),('icons',108),('topographic-patterns',109),('medal-silver-01',435),('medal-silver-02',437),('medal-saola',468),('tshirt-black',812),('tshirt-white',813),('socks',750),('totes',779),('tumblers',790),('flasks',615),('buffs',840),('saola-plush',674)]:
        native(name,xref)
    board('jackets',74,(42,51,675,359))
    board('headwear',68,(14,52,706,352))
    board('patches',61,(27,21,685,363))
    def figure(name, caption, wide=False):
        src,w,h = assets[name]
        return f'''<figure class="gallery-item {'gallery-wide' if wide else ''}"><button class="artwork-button" type="button" aria-label="Enlarge {E(caption)}"><img src="{src}" width="{w}" height="{h}" alt="Vietnam Highlands Trail by UTMB — {E(caption)}" loading="{'eager' if name=='pinhatt-kv' else 'lazy'}" decoding="async"><span class="zoom-hint" aria-hidden="true">＋</span></button><figcaption>{E(caption)}</figcaption></figure>'''
    def chapter(number, ident, title, copy, images):
        return f'''<section class="utmb-chapter" id="{ident}" aria-labelledby="{ident}-title"><header><p class="eyebrow">{number} / {title.upper()}</p><h2 id="{ident}-title">{title}</h2><p>{copy}</p></header><div class="case-gallery">{''.join(figure(*im) for im in images)}</div></section>'''
    template = (ROOT / 'project-highlands-product-visuals.html').read_text()
    head = template.split('<main')[0]
    head = re.sub(r'<title>.*?</title>', '<title>Vietnam Highlands Trail by UTMB — Truong Thong</title>', head)
    head = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="An event branding exploration for Vietnam Highlands Trail by UTMB: key visuals, saola patterns, medal concepts and merchandise.">', head)
    head = head.replace('</head>', '<link rel="stylesheet" href="utmb-case.css"></head>')
    out = head + '''<main id="main" class="shell case-main utmb-case"><div class="case-breadcrumb"><a href="work.html">← All work</a><span>BRANDING / 2027 EDITION</span></div><header class="case-heading"><p class="eyebrow">VIETNAM HIGHLANDS TRAIL BY UTMB</p><h1>Meet you in<br>the Highlands.</h1><p class="case-deck">An event branding exploration rooted in Đà Lạt and Vietnam’s Central Highlands. A saola-led visual language connects campaign key visuals, finisher medal concepts and a collectible merchandise range.</p></header><dl class="case-facts"><div><dt>Contribution</dt><dd>Brand &amp; visual design</dd></div><div><dt>Scope</dt><dd>Key visuals · Pattern &amp; icons<br>Medal concepts · Merchandise</dd></div><div><dt>Event edition</dt><dd>2027</dd></div></dl><p class="case-note">Selected design concepts and mockups from the project presentation.</p>'''
    out += f'<a class="case-source" href="{SOURCE}" target="_blank" rel="noopener noreferrer">View project presentation <span>↗</span></a>'
    out += '<div class="case-gallery utmb-hero">' + figure('pinhatt-kv','Pinhatt landscape — campaign key visual',True) + '</div>'
    out += '''<nav class="utmb-jump" aria-label="Project chapters"><a href="#key-visual">01 / Key visual ↘</a><a href="#visual-system">02 / Pattern &amp; icons ↘</a><a href="#medal">03 / Medal ↘</a><a href="#merchandise">04 / Merchandise ↘</a></nav>'''
    out += chapter('01','key-visual','A sense of place.','Landscape, trail running and the “Meet you in the Highlands” message bring the campaign together. The Pinhatt landscape and runner-led direction explore two ways into the same highland story.', [('runner-kv','Runner-led campaign key visual',True)])
    out += chapter('02','visual-system','One saola. Many stories.','A flexible system of saola motifs, local icons and cultural patterns draws on the region’s mountains, forests, flowers and cultural references. Orange, deep green and warm neutrals connect the applications.', [('saola-patterns','Saola pattern system — eight visual variations',True),('icons','Local icon family'),('topographic-patterns','Traditional motif and pattern studies')])
    out += chapter('03','medal','Something worth keeping.','Finisher medal concepts translate the saola, mountain landscape and floral motifs into a physical keepsake. Silver relief and orange accents give the different directions a shared visual identity.', [('medal-silver-01','Finisher medal — silver concept 01'),('medal-silver-02','Finisher medal — silver concept 02'),('medal-saola','Finisher medal — orange saola concept')])
    out += chapter('04','merchandise','Beyond the finish line.','The identity extends into apparel and everyday objects: running jackets, T-shirts, headwear, socks, totes, drinkware and accessories. Patterns and the saola motif adapt across the collection while preserving a recognisable family.', [('jackets','Running jacket concepts',True),('tshirt-black','Black finisher T-shirt — front and back'),('tshirt-white','White finisher T-shirt — front and back'),('headwear','Cap colourways and pattern applications',True),('socks','Running sock colourways'),('totes','Tote bag graphic directions'),('tumblers','Drinkware — orange, black and ceramic-inspired concepts'),('flasks','Soft flask design'),('buffs','Multifunctional buff designs'),('saola-plush','Saola plush concept'),('patches','Collectible patches inspired by Đà Lạt and the Highlands',True)])
    out += '''<nav class="project-pagination" aria-label="Project navigation"><a href="project-doodles-and-paintings.html"><small>← Previous project</small><span>Doodles &amp; paintings</span></a><a href="project-dpi-final-project.html"><small>Next project →</small><span>DPI final project</span></a></nav><section class="case-contact"><p>Have something in mind?</p><a href="contact.html">Let’s make it happen ↗</a></section></main><dialog class="artwork-dialog" aria-label="Enlarged project artwork"><div class="lightbox-bar"><p id="lightbox-caption"></p><button type="button" class="lightbox-close" aria-label="Close enlarged artwork">CLOSE ×</button></div><div class="lightbox-scroll"><img alt=""></div></dialog>'''
    out += '<footer' + template.split('<footer',1)[1]
    (ROOT / PAGE).write_text(out)
    add_to_archive()
    print(f'Built UTMB case study with {len(assets)} original artwork images; archive now has 28 projects.')

if __name__ == '__main__':
    if len(sys.argv)>1: build(sys.argv[1])
    else: add_to_archive()
