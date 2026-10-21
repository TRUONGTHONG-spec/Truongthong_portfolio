"""Apply generated 3D pixel covers to the Work archive only.
Run after regenerating any portfolio content: python apply-work-thumbnails.py
Original artwork on project detail pages is deliberately preserved.
"""
from pathlib import Path
import json,re,html

ROOT=Path(__file__).resolve().parent

def apply():
    covers=json.loads((ROOT/'work-thumbnails.json').read_text())
    page=ROOT/'work.html'
    text=page.read_text()
    seen=set()
    def replace_card(match):
        card=match[0]
        link=re.search(r'href="project-([a-z0-9-]+)\.html"',card)
        if not link or link[1] not in covers:return card
        slug=link[1];data=covers[slug];seen.add(slug)
        card=re.sub(r'(<div class="archive-image") style="[^"]*"',r'\1',card)
        img=f'<img src="{html.escape(data["src"])}" width="{data["width"]}" height="{data["height"]}" alt="{html.escape(data["alt"])}" loading="{data.get("loading","lazy")}" decoding="async">'
        return re.sub(r'<img\b[^>]*>',lambda _:img,card,count=1)
    text=re.sub(r'<article\b[^>]*>.*?</article>',replace_card,text,flags=re.S)
    page.write_text(text)
    manifest=ROOT/'portfolio-projects.json'
    projects=json.loads(manifest.read_text())
    for project in projects:
        cover=covers.get(project['slug'])
        if cover:project['thumbnail']=cover['src']
    manifest.write_text(json.dumps(projects,ensure_ascii=False,indent=2))
    return len(seen)

if __name__=='__main__':print('Applied',apply(),'3D pixel Work thumbnails.')
