"""Curate the owner's SkyinQ / Tilda source selection.
Run after the base archive: python build-tilda.py /path/to/tilda-source
With no source argument, refresh only the archive card and manifest.
"""
from pathlib import Path
import sys, json, re, io, html
import fitz
from PIL import Image

ROOT=Path(__file__).resolve().parent
PAGE='project-skyinq-tilda.html'
E=html.escape

def add_to_archive():
    path=ROOT/'work.html';text=path.read_text()
    text=re.sub(r'<article class="archive-card" data-project="tilda"[^>]*>.*?</article>','',text,flags=re.S)
    card=f'''<article class="archive-card" data-project="tilda" data-work-category="branding" data-search="skyinq skyinq tilda argmax power brand consultant brand design consultancy branding icons brochure campaign energy ems"><a href="{PAGE}" aria-label="View SkyinQ / Tilda: Brand Consultant and Brand Design"><div class="archive-image" style="background:#09212a"><img src="tilda-linkedin-01.webp" width="2200" height="2200" alt="Tilda ArgMax Power — brand campaign visual" loading="eager" decoding="async"><span class="archive-open" aria-hidden="true">↗</span></div><div class="archive-meta"><span>SkyinQ / Tilda</span><span>NEW</span></div><h2>Brand consultant &amp; brand design.</h2><p>Branding<span>View project ↗</span></p></a></article>'''
    text=text.replace('<div class="archive-grid">','<div class="archive-grid">'+card)
    total=text.count('<article class="archive-card"')
    text=re.sub(r'\d+ projects spanning',f'{total} projects spanning',text)
    text=re.sub(r'\d+ PROJECTS · ONE CURIOUS DESIGNER',f'{total} PROJECTS · ONE CURIOUS DESIGNER',text)
    text=re.sub(r'(id="project-count"[^>]*>)\d+ projects',lambda m:m[1]+f'{total} projects',text)
    path.write_text(text)
    path=ROOT/'portfolio-projects.json';data=[p for p in json.loads(path.read_text()) if p['slug']!='skyinq-tilda']
    data.insert(0,dict(slug='skyinq-tilda',client='SkyinQ / Tilda',title='Brand consultant & brand design.',category='branding',role='Brand Consultant & Brand Design',scope='Campaign visuals · EMS icons · Brochure · Digital product visuals',image_count=6))
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2))

def build(source):
    source=Path(source);assets={}
    for name in ['linkedin-01','linkedin-02','website-02']:
        im=Image.open(source/(name+'.png')).convert('RGB');im.thumbnail((2200,2200))
        b=io.BytesIO();im.save(b,'WEBP',quality=96,method=6)
        filename='tilda-'+name+'.webp';(ROOT/filename).write_bytes(b.getvalue());assets[name]=(filename,im.width,im.height)
    for name in ['ems-icons','argmax-brochure']:
        d=fitz.open(source/(name+'.pdf'))
        for index,page in enumerate(d):
            key=name if len(d)==1 else name+'-'+str(index+1)
            filename='tilda-'+key+'.svg';(ROOT/filename).write_text(page.get_svg_image(text_as_path=True))
            assets[key]=(filename,round(page.rect.width),round(page.rect.height))
    def fig(name,caption,wide=False):
        src,w,h=assets[name]
        return f'''<figure class="gallery-item {'gallery-wide' if wide else ''}"><button class="artwork-button" type="button" aria-label="Enlarge {E(caption)}"><img src="{src}" width="{w}" height="{h}" alt="Tilda — {E(caption)}" loading="{'eager' if name.startswith('linkedin') else 'lazy'}" decoding="async"><span class="zoom-hint" aria-hidden="true">＋</span></button><figcaption>{E(caption)}</figcaption></figure>'''
    def chapter(number,ident,title,copy,images):
        return f'''<section class="utmb-chapter" id="{ident}" aria-labelledby="{ident}-title"><header><p class="eyebrow">{number} / SELECTED WORK</p><h2 id="{ident}-title">{title}</h2><p>{copy}</p></header><div class="case-gallery">{''.join(fig(*im) for im in images)}</div></section>'''
    template=(ROOT/'project-highlands-product-visuals.html').read_text();head=template.split('<main')[0]
    head=re.sub(r'<title>.*?</title>','<title>SkyinQ / Tilda — Brand Consultant &amp; Brand Design — Truong Thong</title>',head)
    head=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Selected brand consultancy and brand design for Tilda through SkyinQ: ArgMax Power campaign visuals, EMS icons, brochure and digital product visuals.">',head)
    head=head.replace('</head>','<link rel="stylesheet" href="utmb-case.css"></head>')
    out=head+'''<main id="main" class="shell case-main utmb-case"><div class="case-breadcrumb"><a href="work.html">← All work</a><span>BRANDING / SELECTED WORK</span></div><header class="case-heading"><p class="eyebrow">SKYINQ / TILDA</p><h1>Brand consultant<br>&amp; brand design.</h1><p class="case-deck">Selected brand consultancy and design work for Tilda, delivered through SkyinQ. A focused selection of ArgMax Power campaign visuals, product iconography, sales collateral and digital product visuals.</p></header><dl class="case-facts"><div><dt>Contribution</dt><dd>Brand Consultant &amp; Brand Design</dd></div><div><dt>Agency</dt><dd>SkyinQ</dd></div><div><dt>Client</dt><dd>Tilda</dd></div></dl><nav class="utmb-jump" aria-label="Project chapters"><a href="#campaign">01 / Campaign ↘</a><a href="#icons">02 / Icons ↘</a><a href="#brochure">03 / Brochure ↘</a><a href="#digital">04 / Digital ↘</a></nav>'''
    out+=chapter('01','campaign','ArgMax Power.','Campaign visuals introduce Tilda’s AI-driven energy optimisation product through a consistent mix of product imagery, technology cues and clear typographic hierarchy.', [('linkedin-01','ArgMax Power — campaign visual 01'),('linkedin-02','ArgMax Power — campaign visual 02')])
    out+=chapter('02','icons','A consistent icon family.','A selection from the EMS icon system gives technical features a shared visual vocabulary.', [('ems-icons','EMS — 60-icon family',True)])
    out+=chapter('03','brochure','From screen to print.','A Japanese-market brochure brings the product story, feature explanations and visual system into one sales communication piece.', [('argmax-brochure-2','ArgMax Power — Japanese brochure, outside panels',True),('argmax-brochure-1','ArgMax Power — Japanese brochure, inside panels',True)])
    out+=chapter('04','digital','Making information visible.','A selected digital product view shows energy flows, operating status and performance information within a clear interface.', [('website-02','Digital product visual — energy operation dashboard',True)])
    out+='''<nav class="project-pagination" aria-label="Project navigation"><a href="project-vietnam-highlands-trail-utmb.html"><small>← Previous project</small><span>Vietnam Highlands Trail by UTMB</span></a><a href="work.html"><small>Back to archive →</small><span>All projects</span></a></nav><section class="case-contact"><p>Have something in mind?</p><a href="contact.html">Let’s make it happen ↗</a></section></main><dialog class="artwork-dialog" aria-label="Enlarged project artwork"><div class="lightbox-bar"><p id="lightbox-caption"></p><button type="button" class="lightbox-close" aria-label="Close enlarged artwork">CLOSE ×</button></div><div class="lightbox-scroll"><img alt=""></div></dialog>'''
    out+='<footer'+template.split('<footer',1)[1];(ROOT/PAGE).write_text(out)
    add_to_archive()
    print('Built SkyinQ / Tilda with six selected artwork images.')

if __name__=='__main__':
    if len(sys.argv)>1:build(sys.argv[1])
    else:add_to_archive()
