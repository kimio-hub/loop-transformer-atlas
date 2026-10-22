from pathlib import Path
import json
base=Path(__file__).parent
records=json.loads((base/'catalog.json').read_text(encoding='utf-8'))
assert len(records) >= 70
assert len({r['id'] for r in records}) == len(records)
required={'title','short','year','month','tier','desc','why','caveat','author','kind','scope','url','tags'}
assert all(required <= set(r) for r in records)
text=(base/'site_template.html').read_text(encoding='utf-8')
payload=json.dumps(records,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
text=text.replace('__CATALOG_DATA__',payload)
(base/'index.html').write_text(text,encoding='utf-8')
Path('/mnt/data/loop_transformer_atlas.html').write_text(text,encoding='utf-8')
print(f'Built {base/"index.html"}, {len(records)} records, {len(text):,} HTML chars')
