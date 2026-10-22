"""Offline browser QA: render the real standalone build; mock storage only for the
opaque about:blank origin used by this sandbox. No external requests are made."""
from pathlib import Path
import json
import argparse
import shutil
import subprocess
import sys
import tempfile
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument("--output",type=Path,default=BASE/".qa")
args=parser.parse_args()
OUT=args.output
OUT.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory() as temp:
    html_path=Path(temp)/"standalone.html"
    subprocess.run([sys.executable,str(BASE/"build_site.py"),"--standalone",str(html_path)],check=True)
    html=html_path.read_text(encoding="utf-8")
mock = """<script>
if(!window.qaStorage){
 const data={'loop-atlas-favorites-2026':'["1807.03819"]'};
 window.qaStorage={getItem:k=>data[k]??null,setItem:(k,v)=>{data[k]=String(v)},removeItem:k=>{delete data[k]}};
 Object.defineProperty(window,'localStorage',{value:window.qaStorage,configurable:true});
 Object.defineProperty(navigator,'clipboard',{value:{writeText:async v=>{window.qaClipboard=v}},configurable:true});
}
</script>"""
html = html.replace('<script>try{', mock + '<script>try{', 1)
checks=[]
def check(name, condition):
    if not condition:
        raise AssertionError(name)
    checks.append(name)

with sync_playwright() as p:
    executable=shutil.which("chromium") or shutil.which("google-chrome")
    browser=p.chromium.launch(**({"executable_path":executable} if executable else {}),headless=True)
    page=browser.new_page(viewport={"width":1440,"height":1000},accept_downloads=True)
    errors=[]
    page.on("pageerror",lambda e:errors.append(str(e)))
    page.set_content(html,wait_until="load")
    check("six featured papers",page.locator(".pick").count()==6)
    check("v1 bookmarks migrate",page.locator("#saved-count").inner_text()=="1")
    page.locator("#loop-range").fill("7")
    check("illustration updates",page.locator("#loop-value").inner_text()=="7\u00d7")
    page.locator('.pick [data-save="2502.05171"]').click()
    check("bookmark count updates",page.locator("#saved-count").inner_text()=="2")
    page.locator('.pick [data-open="2502.05171"]').first.click()
    check("dialog opens",page.locator("#reader").is_visible())
    check("source and review status visible",page.locator(".review-note").is_visible())
    page.locator('#reader [data-read="2502.05171"]').click()
    check("read status saves",page.locator('#reader [data-read="2502.05171"]').get_attribute("aria-pressed")=="true")
    page.locator("#reader [data-share]").click()
    page.wait_for_timeout(50)
    check("share link is public and specific","https://kimio-hub.github.io/loop-transformer-atlas/?paper=2502.05171#library"==page.evaluate("window.qaClipboard"))
    page.keyboard.press("Escape")
    check("escape closes modal",not page.locator("#reader").is_visible())
    page.locator('[data-nav="library"]').click()
    page.wait_for_selector("#search")
    page.locator("#scope-filter").check()
    check("all resources accessible",page.locator(".paper-row").count()==82)
    page.locator("#search").fill("1807.03819")
    check("arxiv id search exact",page.locator(".paper-row").count()==1)
    page.locator("#search").fill("no-such-resource-xyz")
    check("empty state",page.locator(".empty").count()==1)
    page.locator(".empty [data-reset]").click()
    page.locator("#scope-filter").check()
    page.locator('[data-kind="blog"]').click()
    check("8 blogs",page.locator(".paper-row").count()==8)
    page.locator('[data-kind="project"]').click()
    check("7 projects",page.locator(".paper-row").count()==7)
    page.locator('[data-kind=""]').click()
    page.locator("#notes-filter").check()
    check("14 reviewed guides",page.locator(".paper-row").count()==14)
    page.locator("#notes-filter").uncheck()
    page.locator("#sort").select_option("oldest")
    check("sort oldest",page.locator(".paper-row").first.get_attribute("data-record")=="1603.08983")
    with page.expect_download() as download:
        page.locator("[data-export]").click()
    exported=download.value.path()
    content=Path(exported).read_text(encoding="utf-8")
    check("markdown exports 82 original links",content.count("\n- [")==82)
    page.screenshot(path=str(OUT/"loop_atlas_v2_library.png"),full_page=False)
    page.locator('[data-nav="paths"]').click()
    check("3 ordered learning paths",page.locator(".route-detail").count()==3)
    check("13 route steps",page.locator(".route-step").count()==13)
    check("read progress reflected",page.locator('[data-indicator="2502.05171"]').get_attribute("class").endswith("done"))
    page.locator('[data-nav="understand"]').click()
    check("3 conceptual distinctions",page.locator(".concept-card").count()==3)
    page.locator('[data-nav="saved"]').click()
    check("2 saved resources",page.locator(".paper-row").count()==2)
    page.locator('[data-shelf="read"]').click()
    check("read shelf",page.locator(".paper-row").count()==1)
    page.locator("#theme").click()
    check("dark theme",page.evaluate("document.documentElement.dataset.theme")=="dark")
    page.locator('[data-nav="discover"]').click()
    page.screenshot(path=str(OUT/"loop_atlas_v2_dark.png"),full_page=False)
    page.locator("#theme").click()
    page.set_content(html,wait_until="load")
    check("stored bookmarks restored on initialization",page.locator("#saved-count").inner_text()=="2")
    for width in [1440,1024,768,600,390,360]:
        page.set_viewport_size({"width":width,"height":900})
        page.locator('[data-nav="discover"]').click()
        check(f"home no horizontal overflow at {width}",page.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        page.locator('[data-nav="library"]').click()
        page.wait_for_selector("#search")
        check(f"library no horizontal overflow at {width}",page.evaluate("document.documentElement.scrollWidth <= innerWidth"))
        if width==390:
            page.screenshot(path=str(OUT/"loop_atlas_v2_library_mobile.png"),full_page=False)
        page.locator("#search").fill("1807.03819")
        page.locator(".paper-row [data-open]").first.click()
        check(f"modal fits at {width}",page.locator("#reader").bounding_box()["width"]<=width)
        page.keyboard.press("Escape")
    page.set_viewport_size({"width":1440,"height":1000})
    page.locator('[data-nav="discover"]').click()
    page.locator('.pick [data-open="1807.03819"]').first.click()
    page.screenshot(path=str(OUT/"loop_atlas_v2_reader.png"),full_page=False)
    check("no uncaught JavaScript errors",not errors)
    browser.close()

report={"mode":"offline standalone; localStorage and clipboard mocked for opaque origin",
        "checks_passed":len(checks),"checks":checks,"javascript_errors":errors}
(OUT/"qa-results.json").write_text(json.dumps(report,indent=2),encoding="utf-8")
print(json.dumps(report,indent=2))
