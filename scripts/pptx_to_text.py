"""Extracts slide text and speaker notes from .pptx files (stdlib only).

Usage: python -I scripts/pptx_to_text.py <pptx_dir> <out_dir>
Writes <out_dir>/<name>.md with one "## Slide N" section per slide, in presentation order.
Images on slides with little text are saved to <out_dir>/img/<name>/ so they can be read visually.
"""
import posixpath
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'rel': 'http://schemas.openxmlformats.org/package/2006/relationships',
}
R_ID = '{%s}id' % NS['r']


def rels(z, part):
    folder, name = posixpath.split(part)
    rels_path = posixpath.join(folder, '_rels', name + '.rels')
    if rels_path not in z.namelist():
        return {}
    out = {}
    for rel in ET.fromstring(z.read(rels_path)).findall('rel:Relationship', NS):
        target = rel.get('Target')
        if rel.get('TargetMode') != 'External':
            target = posixpath.normpath(posixpath.join(folder, target))
        out[rel.get('Id')] = (rel.get('Type').rsplit('/', 1)[-1], target)
    return out


def paragraphs(xml):
    lines = []
    for para in ET.fromstring(xml).iter('{%s}p' % NS['a']):
        text = ''.join(t.text or '' for t in para.iter('{%s}t' % NS['a'])).strip()
        if text:
            lines.append(text)
    return lines


def convert(pptx, out):
    with zipfile.ZipFile(pptx) as z:
        pres = 'ppt/presentation.xml'
        pres_rels = rels(z, pres)
        slide_ids = ET.fromstring(z.read(pres)).find('p:sldIdLst', NS)
        parts = [pres_rels[s.get(R_ID)][1] for s in slide_ids]
        sections = [f'# {pptx.stem}\n']
        for n, part in enumerate(parts, 1):
            slide_rels = rels(z, part)
            images = [target for kind, target in slide_rels.values() if kind == 'image']
            body = paragraphs(z.read(part))
            saved = []
            if images and len(' '.join(body).split()) < 40:
                img_dir = out.parent / 'img' / pptx.stem
                img_dir.mkdir(parents=True, exist_ok=True)
                for k, target in enumerate(images, 1):
                    name = f'slide{n:02d}-{k}{posixpath.splitext(target)[1].lower()}'
                    (img_dir / name).write_bytes(z.read(target))
                    saved.append(f'img/{pptx.stem}/{name}')
            notes = []
            for kind, target in slide_rels.values():
                if kind == 'notesSlide':
                    notes = [l for l in paragraphs(z.read(target)) if not re.fullmatch(r'\d+', l)]
            header = f'## Slide {n}'
            if images:
                header += f'  [images: {len(images)}]'
            sections.append(header)
            sections.append('\n'.join(body) if body else '(no text)')
            if saved:
                sections.append('Slide images (read these for content): ' + ', '.join(saved))
            if notes:
                sections.append('Notes:\n' + '\n'.join(notes))
            sections.append('')
    out.write_text('\n'.join(sections), encoding='utf-8')
    words = sum(len(s.split()) for s in sections)
    print(f'{pptx.name}: {len(parts)} slides, ~{words} words')


def main():
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    dst.mkdir(parents=True, exist_ok=True)
    for pptx in sorted(src.glob('*.pptx')):
        convert(pptx, dst / (pptx.stem + '.md'))


if __name__ == '__main__':
    main()
