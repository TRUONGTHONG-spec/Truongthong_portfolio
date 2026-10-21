"""Build the Work archive from the owner's supplied 2016–2025 PDF.
Usage: python build-portfolio.py /path/to/portfolio.pdf
Requires PyMuPDF and Pillow. No build step is needed on Netlify.
"""
from pathlib import Path
import sys, json, re, base64, io, html
import xml.etree.ElementTree as ET
ET.register_namespace("", "http://www.w3.org/2000/svg")
ET.register_namespace("xlink", "http://www.w3.org/1999/xlink")
import fitz
from PIL import Image

ROOT = Path(__file__).resolve().parent
PDF = fitz.open(sys.argv[1])
E = html.escape

# Each entry is an editorial grouping of artwork actually present in the PDF.
# Dates and outcomes are included only where the source states them.
PROJECTS = [
 dict(slug='dpi-final-project', title='The beginning of a design journey', client='DPI Center', category='branding', pages=[7,8], role='Student designer', year='2016', scope='Graduation project · Print · Visual identity', summary='My final-year project at DPI Center, and the first milestone in my design journey. The project received First Prize in Design in the K35 class.', note='An academic project, presented with the original design boards and graduation photographs.'),
 dict(slug='vietnam-football-campaigns', title='A nation behind its team', client='Suzuki · Grab · Acecook / Dentsu', category='campaigns', pages=[10], role='Key visual & banner design', scope='Campaign key visuals · Advertising banners', summary='Creative support for Suzuki, Grab and Acecook during Vietnam’s AFF Suzuki Cup campaign. Working alongside the VNT team, I contributed key visuals and banners celebrating the national football team.', note='The work was shown on national television and in stadiums during the championship celebrations, as documented in my portfolio.'),
 dict(slug='panasonic-social', title='Everyday products, clear stories', client='Panasonic Vietnam / Dentsu', category='campaigns', pages=[11], role='Graphic designer', scope='Social media · Product communication', summary='Social campaign visuals for four Panasonic product lines. Each asset responds to the product’s character while keeping a consistent connection to Panasonic’s brand and the Vietnamese market.'),
 dict(slug='gery-vietnam', title='A playful side of Gery', client='Gery Vietnam / Dentsu', category='campaigns', pages=[12], role='Graphic designer', scope='Social media · Product promotions · Campaign visuals', summary='Playful, youth-focused visuals for Gery in Vietnam. Bright product compositions and everyday humour bring the confectionery brand into social feeds and advertising.'),
 dict(slug='attack-campaign', title='A fresh perspective on laundry', client='Attack / Dentsu', category='campaigns', pages=[13], role='Campaign design support', scope='TVC campaign visuals · Asset adaptations', summary='Design support for Attack’s laundry campaigns in Vietnam, adapting creative assets for liquid and powder detergent promotions.', note='The gallery presents campaign frames and visual development from the portfolio. My contribution was design support, rather than ownership of the entire TVC production.'),
 dict(slug='coffee-house-signature', title='The character of coffee', client='The Coffee House Signature', category='campaigns', pages=[15,16], role='Digital design support', year='2020', scope='Product launch key visuals · Taste cards · Digital assets', summary='Product storytelling for The Coffee House Signature, from seasonal launches to specialty coffee. I supported digital design, developed key visuals and designed taste cards to give each coffee its own character.'),
 dict(slug='coffee-house-signature-renovation', title='A considered coffee experience', client='The Coffee House Signature', category='print', pages=[17,18], role='Graphic designer', scope='Menu boards · Beverage & food menus · Six coffee taste cards', summary='A coordinated set of in-store materials for The Coffee House Signature. Menu boards, food and beverage menus, and taste cards for six specialty coffee lines were designed to support a clear, premium customer experience.'),
 dict(slug='coffee-house-website', title='Coffee, connected', client='The Coffee House', category='web', pages=[19], role='Website design contributor', scope='Website redesign · Digital touchpoints', summary='Website design work during The Coffee House’s shift toward a more connected F&B experience. The project explores product discovery and digital touchpoints alongside delivery and in-store services.'),
 dict(slug='coffee-house-app', title='Small details, one visual system', client='The Coffee House', category='app', pages=[20], role='UI & visual design contributor', year='2020', scope='UI components · Icon set · Membership visuals', summary='A visual refresh of The Coffee House app, updating key components, developing a new icon set and aligning the interface with the brand’s evolving digital direction.', note='I contributed to the redesign and visual system; I was not part of the original app development.'),
 dict(slug='shopee-seller-campaigns', title='Built for the seller community', client='Shopee Seller / OPX', category='campaigns', pages=[22], role='Digital designer', scope='Seller campaign assets · Promotional communication', summary='Campaign-led digital communication for Shopee’s seller community. These visuals introduce promotional programmes through a consistent, recognisable e-commerce design language.'),
 dict(slug='shopee-seller-landing-pages', title='Campaigns that invite action', client='Shopee Seller', category='web', pages=[23], role='Landing page designer', scope='Campaign landing pages · Promotional programmes', summary='Landing pages designed to introduce Shopee seller promotions. Bold campaign identities, structured offers and clear content sections connect seller programmes with their audiences.', note='Full-length artwork extracted from the PDF is included below the overview where available.'),
 dict(slug='shopee-om-advertising', title='One campaign, many touchpoints', client='Shopee', category='campaigns', pages=[24], role='Digital designer', scope='Omni-channel ad frames · GDN · Digital advertising', summary='Ad frames and digital assets for Shopee’s Omni-Channel Marketing programmes, supporting seller visibility and consistent brand expression across GDN and other placements.'),
 dict(slug='highlands-website', title='A familiar brand, refreshed online', client='Highlands Coffee', category='web', pages=[26], role='Website design contributor', scope='Website redesign · Demos · Mockups · Delivery', summary='A contribution to Highlands Coffee’s website redesign, from early demos and mockups through final delivery. The work translates a familiar coffee brand into a refreshed digital experience.', note='The portfolio compares the previous website with the redesigned version.'),
 dict(slug='highlands-app', title='Refreshing the daily coffee ritual', client='Highlands Coffee', category='app', pages=[27], role='UI & visual designer', scope='Onboarding · Membership · Icons · Menu imagery · Banners', summary='A visual revamp of the Highlands Coffee app during its transition to a new agency. I refreshed onboarding, membership sections, product icons, menu images and in-app banners to bring the interface closer to the brand.', note='The agency defined the UX flow. My contribution focused on the UI and visual elements within that flow.'),
 dict(slug='highlands-product-visuals', title='A colour for every craving', client='Highlands Coffee', category='branding', pages=[28], role='Product visual design', scope='Product categorisation · Colour system · Digital menu imagery', summary='Together with my manager, I worked on a renovation of Highlands Coffee’s product visuals. We reorganised product lines and assigned each category a distinct Pantone colour to build contrast, recognition and consistency.'),
 dict(slug='highlands-rewards', title='A little more with every visit', client='Highlands Coffee', category='app', pages=[29], role='Mini app design contributor', scope='Loyalty experience · Zalo Official Account · Rewards', summary='Highlands Rewards brings a loyalty programme into Zalo Official Account. The mini app lets customers earn points and redeem rewards from Highlands Coffee and partners across different lifestyle categories.'),
 dict(slug='highlands-chill-he', title='Chill hè, one playful moment at a time', client='Highlands Coffee', category='app', pages=[30], role='Digital campaign designer', scope='Campaign game interface · Product visuals · Digital assets', summary='Digital design for the “Chill hè” promotional game. The campaign work connects a playful interface with product visuals and the wider Highlands Coffee brand experience.'),
 dict(slug='highlands-giftcards', title='A small card. A thoughtful gift.', client='Highlands Coffee', category='web', pages=[31], role='Landing page UI designer', scope='Giftcard landing page · Purchase interface · Product storytelling', summary='A dedicated landing page introducing Highlands Coffee Giftcards: a way to pay, share a drink or send a thoughtful gift. The interface presents card designs and guides customers through choosing and purchasing a giftcard.'),
 dict(slug='highlands-taste-of-summer', title='The taste of summer', client='Highlands Coffee', category='app', pages=[32], role='Digital campaign designer', scope='Summer game interface · Campaign visuals', summary='A seasonal game interface for Highlands Coffee’s summer campaign. Product imagery and playful interactions are brought together within a consistent campaign identity.'),
 dict(slug='highlands-blind-box', title='A surprise worth discovering', client='Highlands Coffee', category='campaigns', pages=[33], role='Digital campaign design contributor', scope='New-store activation · Zalo campaign · Promotional visuals', summary='A blind-box campaign created in collaboration with Zalo for new store openings. Interactive touchpoints, gifts and promotional visuals were designed to introduce new visitors to the brand and encourage an ongoing connection.'),
 dict(slug='mai-ca-phe', title='A café with a personal story', client='Mai Cà Phê', category='branding', pages=[35], role='Brand designer', scope='Logo · Menu · Drink labels · Signage · Visual identity', summary='A complete brand identity for a former colleague from The Coffee House who opened his own café. A simple, retro-inspired and relaxed visual language carries across the logo, menu, labels, signage and other brand touchpoints.'),
 dict(slug='ai-cha-packaging', title='Tea, wrapped in colour', client='Ai Cha', category='print', pages=[36], role='Packaging designer', scope='Tea packaging · Pack variations · Product presentation', summary='A tea packaging project for Ai Cha, presented through illustrated pack variations and a product gift-box composition. The work brings colour, illustration and packaging together as one family.'),
 dict(slug='my-rewards-app', title='Rewards around the corner', client='Rainbow Digital / My Rewards', category='app', pages=[37], role='UI designer', scope='Loyalty app interface · Points · Rewards', summary='UI design for My Rewards, a loyalty platform connecting customers with casual local eateries. The app helps customers collect points and discover offers while giving vendors a way to build ongoing relationships.', note='Designed during the pandemic using an existing UX flow.'),
 dict(slug='my-hero-app', title='Insurance, closer to everyday life', client='Rainbow Digital / My Hero', category='app', pages=[38], role='UI designer', scope='Insurance app interface · Plan discovery · Policy management', summary='UI design for My Hero, an integrated insurance app. The interface supports discovering, purchasing and managing different insurance products, from life insurance to motorbike and phone-screen protection.', note='My UI contribution followed a supplied UX flow.'),
 dict(slug='enc-hutech', title='Design for a growing community', client='ENC Hutech', category='campaigns', pages=[39,40], role='Graphic design support', scope='Event identities · Promotional materials · Event collateral', summary='Visual support for the ENC English Club at Hutech University. Event identities, promotional designs and community materials support the organisation’s educational mission and its focus on nurturing future leaders.'),
 dict(slug='frame-furniture', title='A quieter frame for living', client='Frame Furniture', category='branding', pages=[41], role='Independent designer', scope='Self-initiated concept · Brand & digital exploration', summary='A self-initiated furniture design study, made for the joy of exploring. A quiet visual direction creates space to experiment with brand presentation, imagery and digital compositions.', note='Personal concept work, not a commissioned client project.'),
 dict(slug='doodles-and-paintings', title='Off the clock, still creating', client='Personal work', category='illustration', pages=[43], role='Illustrator', scope='Doodles · Painting · Personal illustration', summary='A collection of doodles, paintings and playful personal illustrations made in my free time. An open space for curiosity, drawing and enjoying the process.'),
]

# Art-only clips avoid reusing the PDF's slide titles and explanatory paragraphs.
CLIPS = {
7:[(884,362,1856,1030)],8:[(691,143,1856,1027)],
10:[(64,540,936,1031),(1098,125,1856,1016)],
11:[(64,273,1097,1005),(1140,270,1856,760)],12:[(64,288,1070,1042),(1149,110,1768,728)],
13:[(64,443,1049,1030),(1128,443,1856,1016)],15:[(64,318,1367,975)],
16:[(68,87,672,993),(824,101,1280,557),(1419,579,1819,979)],
17:[(64,431,1360,981),(1400,207,1856,988)],18:[(1096,64,1856,596),(64,464,910,990),(976,635,1856,979)],
19:[(977,256,1890,950),(64,406,847,949)],20:[(630,170,1725,930)],
22:[(587,186,1856,1018)],23:[(64,318,1856,1080)],
24:[(520,192,921,593),(64,615,465,1016),(1015,615,1859,1016),(1452,146,1859,614)],
26:[(751,113,1800,940)],27:[(650,165,1856,930)],28:[(640,185,1815,935)],29:[(630,140,1810,880)],
30:[(567,185,1760,910)],31:[(601,163,1780,955)],32:[(567,185,1775,935)],33:[(580,180,1856,940)],
35:[(603,52,1796,931)],36:[(845,56,1766,610),(70,619,1766,917)],
37:[(635,140,1810,895)],38:[(635,145,1810,1030)],39:[(679,189,1802,1020)],
40:[(670,137,1856,580),(64,590,1856,1057)],41:[(1145,149,1825,579),(64,579,744,1076),(745,580,1856,1080)],
43:[(64,219,1900,1016)]}
CATEGORIES={'all':'All projects','branding':'Branding','web':'Web design','app':'App & UI','campaigns':'Campaigns','print':'Print & packaging','illustration':'Illustration'}

def encode(im, width=2400, quality=96, preserve_vector=False):
 if preserve_vector and im.info.get('source_svg'):
  svg=im.info['source_svg'].encode()
  return 'data:image/svg+xml;base64,'+base64.b64encode(svg).decode(),im.info['source_width'],im.info['source_height']
 im=im.convert('RGB'); im.thumbnail((width,6000))
 out=io.BytesIO(); im.save(out,format='WEBP',quality=quality,method=6,lossless=preserve_vector)
 return 'data:image/webp;base64,'+base64.b64encode(out.getvalue()).decode(),im.width,im.height

def render(n,clip):
 page=PDF[n-1]
 pix=page.get_pixmap(matrix=fitz.Matrix(2,2),clip=fitz.Rect(clip),alpha=False)
 im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
 # Export PDF paths as real SVG, preserving outlined text and original image data.
 original_crop=page.cropbox
 page.set_cropbox(fitz.Rect(clip)&page.mediabox)
 svg=ET.fromstring(page.get_svg_image(text_as_path=True))
 page.set_cropbox(original_crop)
 ns='{http://www.w3.org/2000/svg}';href='{http://www.w3.org/1999/xlink}href'
 # The repeating 4096x2304 image is the PDF's decorative slide-paper background.
 # It is unrelated to client artwork and wastes >1MB in every exported crop.
 for node in svg.iter(ns+'image'):
  if node.get('width')=='4096' and node.get('height')=='2304':
   node.set(href,'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII=')
 bg=ET.Element(ns+'rect',{'x':'0','y':'0','width':'100%','height':'100%','fill':'#f4f1ed'})
 svg.insert(0,bg)
 im.info.update(source_svg=ET.tostring(svg,encoding='unicode'),source_width=round(clip[2]-clip[0]),source_height=round(clip[3]-clip[1]))
 return im

def url(p): return 'project-'+p['slug']+'.html'
def head(title,description):
 return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#080a09"><title>{E(title)} — Truong Thong</title><meta name="description" content="{E(description)}"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="portfolio.css"><script defer src="app.js"></script><script defer src="portfolio.js"></script></head><body class="portfolio-page"><a class="skip" href="#main">Skip to content</a><header class="site-header shell"><a class="brand" href="index.html">THONG<span>.</span></a><button id="menu" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">MENU ＋</button><nav id="site-nav" aria-label="Primary navigation"><a href="index.html">Home</a><a href="about.html">About me</a><a href="work.html" aria-current="page">Work</a><a href="contact.html">Contact</a></nav><span class="header-note">DESIGNER / PLAYER 01</span></header>'''
def footer():
 return '''<footer class="shell site-footer"><p>Designed by Truong Thong <span>/</span> © 2026</p><div><a href="work.html">ALL WORK ↗</a><a href="contact.html">CONTACT ↗</a><a href="mailto:nguyenthanhtruongthong@gmail.com">EMAIL ↗</a></div></footer></body></html>'''

cards=[]
for index,p in enumerate(PROJECTS):
 pictures=[]
 for n in p['pages']:
  for clip in CLIPS[n]: pictures.append((render(n,clip),n))
 # Preserve the complete tall landing pages/poster embedded in these PDF pages.
 if p['slug'] in ('shopee-seller-landing-pages','enc-hutech'):
  page=PDF[(23 if p['slug'].startswith('shopee') else 39)-1]
  for info in page.get_image_info(xrefs=True):
   if info['height']>1500 and info['height']/info['width']>2.2 and info['xref']:
    data=PDF.extract_image(info['xref']);pictures.append((Image.open(io.BytesIO(data['image'])),page.number+1))
 cover,w,h=encode(pictures[0][0],width=1400,quality=96)
 p['cover']=cover
 p['image_count']=len(pictures)
 links=[]
 for n in p['pages']:
  raw=PDF[n-1].get_text()
  for link in re.findall(r'https://www\.figma\.com/[^\s]+',raw):
   if link not in links: links.append(link)
 p['figma']=links[:1]
 label=CATEGORIES[p['category']]
 cards.append(f'''<article class="archive-card" data-work-category="{p['category']}" data-search="{E((p['client']+' '+p['title']+' '+p['scope']).lower())}"><a href="{url(p)}" aria-label="View {E(p['client'])}: {E(p['title'])}"><div class="archive-image"><img src="{cover}" width="{w}" height="{h}" alt="{E(p['client'])} — {E(p['scope'])}" loading="{'eager' if index<2 else 'lazy'}" decoding="async"><span class="archive-open" aria-hidden="true">↗</span></div><div class="archive-meta"><span>{E(p['client'])}</span><span>{index+1:02d}</span></div><h2>{E(p['title'])}</h2><p>{E(label)}<span>View project ↗</span></p></a></article>''')
 page=head(p['title'],p['summary'])
 page+=f'''<main id="main" class="shell case-main"><div class="case-breadcrumb"><a href="work.html">← All work</a><span>{index+1:02d} / {len(PROJECTS):02d}</span></div><header class="case-heading"><p class="eyebrow">{E(p['client'])}</p><h1>{E(p['title'])}</h1><p class="case-deck">{E(p['summary'])}</p></header><dl class="case-facts"><div><dt>Contribution</dt><dd>{E(p['role'])}</dd></div><div><dt>Scope</dt><dd>{E(p['scope'])}</dd></div><div><dt>{'Year' if p.get('year') else 'Discipline'}</dt><dd>{E(p.get('year',label))}</dd></div></dl>'''
 if p.get('note'): page+=f'<p class="case-note">{E(p["note"])}</p>'
 if p['figma']: page+=f'<a class="case-source" href="{E(p["figma"][0])}" target="_blank" rel="noopener noreferrer">Explore the original Figma file <span>↗</span></a>'
 page+='<section class="case-gallery" aria-label="Project artwork">'
 for j,(im,n) in enumerate(pictures):
  src,w,h=encode(im,preserve_vector=True)
  wide=j==0 or w/h>1.4
  alt=f'{p["client"]} — {p["scope"]}, artwork {j+1}'
  display_width=760 if p['slug'] in ('dpi-final-project','coffee-house-signature','coffee-house-signature-renovation','mai-ca-phe','attack-campaign','gery-vietnam') else 1040
  page+=f'''<figure class="gallery-item {'gallery-wide' if wide else ''}" style="--art-display-width:{display_width}px"><button class="artwork-button" type="button" aria-label="Enlarge artwork {j+1}: {E(p['client'])}"><img src="{src}" alt="{E(alt)}" width="{w}" height="{h}" loading="{'eager' if j==0 else 'lazy'}" decoding="async"><span class="zoom-hint" aria-hidden="true">＋</span></button><figcaption><span>{j+1:02d} / {len(pictures):02d}</span><span>{E(p['client'])}</span></figcaption></figure>'''
 page+='</section>'
 prev=PROJECTS[(index-1)%len(PROJECTS)];nxt=PROJECTS[(index+1)%len(PROJECTS)]
 page+=f'''<nav class="project-pagination" aria-label="Project navigation"><a href="{url(prev)}"><small>← Previous project</small><span>{E(prev['client'])}</span></a><a href="{url(nxt)}"><small>Next project →</small><span>{E(nxt['client'])}</span></a></nav><section class="case-contact"><p>Have something in mind?</p><a href="contact.html">Let’s make it happen ↗</a></section></main><dialog class="artwork-dialog" aria-label="Enlarged project artwork"><div class="lightbox-bar"><p id="lightbox-caption"></p><button type="button" class="lightbox-close" aria-label="Close enlarged artwork">CLOSE ×</button></div><div class="lightbox-scroll"><img alt=""></div></dialog>'''
 (ROOT/url(p)).write_text(page+footer())
 print(f'{index+1:02d} {p["slug"]}: {len(pictures)} images')

page=head('Work','27 projects spanning branding, campaigns, websites, apps, print and illustration. Original work from Truong Thong’s 2016–2025 portfolio.')
page+='''<main id="main" class="shell archive-main"><header class="archive-intro"><div><p class="eyebrow">DESIGN ARCHIVE / 2016—2025</p><h1>Selected<br><em>work.</em></h1></div><div class="archive-intro-copy"><p>Ideas made visible.<br>Brands, screens, and the details in between.</p><span>27 PROJECTS · ONE CURIOUS DESIGNER</span></div></header><section aria-label="Browse projects"><div class="archive-toolbar"><div class="archive-filters" role="group" aria-label="Filter projects by discipline">'''
for key,label in CATEGORIES.items(): page+=f'<button type="button" data-work-filter="{key}" aria-pressed="{str(key=="all").lower()}">{E(label)}</button>'
page+='''</div><label class="archive-search"><span class="sr-only">Search by project, client or discipline</span><input type="search" id="project-search" placeholder="Search projects…" autocomplete="off"></label></div><div class="archive-status"><p id="project-count" role="status" aria-live="polite">27 projects</p><span>BRAND / DIGITAL / EVERYDAY</span></div><div class="archive-grid">'''+''.join(cards)+'''</div><p id="empty-projects" hidden>No projects match this search. Try another keyword or choose All projects.</p></section><section class="case-contact"><p>Your next project starts with a conversation.</p><a href="contact.html">Let’s work together ↗</a></section></main>'''
(ROOT/'work.html').write_text(page+footer())
# Keep a readable source manifest alongside the generated pages.
(ROOT/'portfolio-projects.json').write_text(json.dumps([{k:v for k,v in p.items() if k!='cover'} for p in PROJECTS],ensure_ascii=False,indent=2))
print('Built',len(PROJECTS),'project pages and Work archive.')
# Retain the separately sourced UTMB project when rebuilding the original PDF archive.
if (ROOT/'project-vietnam-highlands-trail-utmb.html').exists():
 import runpy
 runpy.run_path(str(ROOT/'build-utmb.py'))['add_to_archive']()
if (ROOT/'project-skyinq-tilda.html').exists():
 import runpy
 runpy.run_path(str(ROOT/'build-tilda.py'))['add_to_archive']()

# Preserve the generated 3D pixel cover artwork after a PDF rebuild.
if (ROOT/"work-thumbnails.json").exists():
 import runpy
 runpy.run_path(str(ROOT/"apply-work-thumbnails.py"))["apply"]()
