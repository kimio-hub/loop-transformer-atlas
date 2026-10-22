(() => {
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const app = $('#app'), dialog = $('#reader');
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icon = (name, cls='') => `<svg class="icon ${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
const safeUrl = value => { try { const u = new URL(value); return ['http:','https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
const external = (url, label, cls='') => safeUrl(url) ? `<a class="${cls}" href="${esc(safeUrl(url))}" target="_blank" rel="noopener noreferrer">${label}</a>` : '';
const kinds = {paper:'论文',blog:'博客',project:'项目 / 索引'};
const scopes = {core:'核心方向',foundation:'理论前身',adjacent:'关联方向'};
const savedKey = 'loop-atlas-favorites-2026', readKey = 'loop-atlas-read-v2';
let records=[], editorial={}, byId={}, state={}, activeId=null, lastFocus=null, currentList=[], toastTimer;
let storageWarned=false;
function loadSet(key) { try { const a=JSON.parse(localStorage.getItem(key)||'[]'); return new Set(Array.isArray(a)?a.filter(x=>typeof x==='string'):[]); } catch { return new Set(); } }
let saved=loadSet(savedKey), read=loadSet(readKey);
function notify(text) { const t=$('#toast'); t.textContent=text; t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),2600); }
function persist(key,set) { try { localStorage.setItem(key,JSON.stringify([...set])); return true; } catch { if(!storageWarned){notify('浏览器禁止本地存储；本次操作仅在当前页面保留。');storageWarned=true;} return false; } }
function parseRoute() {
 const [view,query='']=location.hash.slice(1).split('?'), p=new URLSearchParams(query);
 return {view:['discover','library','paths','understand','saved'].includes(view)?view:'discover',q:p.get('q')||'',kind:p.get('type')||'',topic:p.get('topic')||'',scope:p.get('scope')==='all'?'all':'core',sort:['newest','oldest'].includes(p.get('sort'))?p.get('sort'):'recommended',annotated:p.get('notes')==='1',shelf:p.get('shelf')==='read'?'read':'saved'};
}
function routeHash(s) {
 const p=new URLSearchParams();
 if(s.q)p.set('q',s.q);if(s.kind)p.set('type',s.kind);if(s.topic)p.set('topic',s.topic);
 if(s.scope==='all')p.set('scope','all');if(s.sort&&s.sort!=='recommended')p.set('sort',s.sort);
 if(s.annotated)p.set('notes','1');if(s.shelf==='read')p.set('shelf','read');
 return '#'+s.view+(p.size?'?'+p.toString():'');
}
function updateRoute() { const u=new URL(location.href);u.hash=routeHash(state);try{history.replaceState(null,'',u);}catch{location.hash=routeHash(state);} }
function note(r){return editorial.notes[r.id]||null;}
function saveButton(r){return `<button class="icon-button" data-save="${esc(r.id)}" aria-label="${saved.has(r.id)?'取消收藏':'收藏'}：${esc(r.short)}" aria-pressed="${saved.has(r.id)}" title="${saved.has(r.id)?'取消收藏':'收藏到书架'}">${icon('bookmark')}</button>`;}
function readButton(r){return `<button class="icon-button" data-read="${esc(r.id)}" aria-label="${read.has(r.id)?'标为未读':'标为已读'}：${esc(r.short)}" aria-pressed="${read.has(r.id)}" title="${read.has(r.id)?'标为未读':'标为已读'}">${icon('check')}</button>`;}
function sourceMeta(r){return `<div class="meta"><span>${esc(kinds[r.kind]||r.kind)}</span><span class="sep">/</span><span>${esc(r.month||r.year)}</span>${r.scope!=='core'?`<span class="tag">${esc(scopes[r.scope])}</span>`:''}${note(r)?`<span class="tag green">${esc(note(r).level)}导读</span>`:''}</div>`;}
function pick(r,i){const n=note(r);return `<article class="pick"><div class="pick-top"><span class="pick-num">${String(i+1).padStart(2,'0')}</span><div class="meta"><span>${r.year}</span>${n?`<span class="tag green">${esc(n.level)}</span>`:''}</div></div><h3><button class="title-button" data-open="${esc(r.id)}">${esc(r.short)}</button></h3><p class="zh-title">${esc(n?.heading||r.why)}</p><p class="pick-question">${esc(n?.question||r.desc)}</p><div class="pick-foot"><button class="text-link" data-open="${esc(r.id)}">阅读导览 ${icon('arrow')}</button>${saveButton(r)}</div></article>`;}
function paperRow(r){
 const n=note(r);
 return `<article class="paper-row" data-record="${esc(r.id)}"><div>${sourceMeta(r)}<h3><button class="title-button" data-open="${esc(r.id)}">${esc(n?.heading||r.short)}</button></h3><p class="english-title">${esc(r.title)}</p><p class="summary">${esc(n?.takeaway||r.desc)}</p><div class="row-links"><button data-open="${esc(r.id)}">${n?'阅读导览':'查看详情'} →</button>${external(r.url,'原文 ↗')}${r.code?external(r.code,'代码 ↗'):''}<span>${esc(r.topic)}</span></div></div><div class="row-actions">${saveButton(r)}${readButton(r)}</div></article>`;
}
function routeTeaser(r){return `<a class="route-teaser" href="#paths" data-route-scroll="${esc(r.id)}"><div class="actions"><span class="route-no">${r.number}</span><span class="route-mini-meta">${r.steps.length} 篇 · 有序阅读</span></div><h3>${esc(r.title)}</h3><p>${esc(r.audience)}。<br>${esc(r.subtitle)}。</p><span class="text-link">进入这条路线 ${icon('arrow')}</span></a>`;}
function home(){
 const counts={paper:records.filter(r=>r.kind==='paper').length,blog:records.filter(r=>r.kind==='blog').length,project:records.filter(r=>r.kind==='project').length};
 return `<section class="hero"><div class="hero-copy"><span class="eyebrow"><span class="kicker-dot"></span>A READING ROOM FOR LOOPED TRANSFORMERS</span><h1>读懂循环，<br>找到<span>下一篇。</span></h1><p class="hero-intro">从一组反复使用的参数，到更深的模型计算。<br>沿着精选论文、作者博客和阅读路线，<br>建立你对 Loop Transformer 的完整理解。</p><div class="actions"><a class="button primary" href="#paths">从这里开始 ${icon('arrow')}</a><a class="text-link" href="#library?scope=all">浏览全部资料 ↗</a></div><div class="hero-meta"><span><strong>${counts.paper}</strong> 篇论文</span><span><strong>${counts.blog}</strong> 篇博客</span><span><strong>${counts.project}</strong> 个项目与索引</span></div></div><div class="hero-visual"><div class="diagram-head"><span>THE IDEA, AT A GLANCE</span><span>01 / DEPTH</span></div><p class="visual-title">Same weights.<br><em>Deeper thinking.</em></p><div class="diagram-stage" role="img" aria-label="输入隐藏状态 h0，经共享模块 F theta 循环更新，得到 hT"><span class="state-symbol">h₀</span><span class="stage-line"></span><div class="shared-block"><b>F<sub>θ</sub></b><small>SHARED BLOCK</small></div><span class="stage-line"></span><span class="state-symbol">h<sub>T</sub></span><div class="loop-return"><span>REUSE · REFINE · REPEAT</span></div></div><div class="loop-control"><label for="loop-range">循环次数</label><input id="loop-range" type="range" min="1" max="8" value="4" aria-describedby="diagram-note"><output id="loop-value" for="loop-range">4×</output></div><p class="diagram-note" id="diagram-note">同一模块调用 4 次，权重仍是一份。<br>计算结构示意，不代表性能随次数线性提升。</p></div></section>
 <div class="intro-strip"><span><strong>不只是论文清单。</strong> 每篇都回答“为什么读”；重点资料补充先修知识、阅读问题和结论边界。</span><a href="#understand">了解收录标准 ↗</a></div>
 <section class="section"><div class="section-head"><div><span class="eyebrow">THE ESSENTIALS</span><h2>六篇，先把主线读通。</h2><p>按理解顺序推荐，而不是按热度排序。</p></div><a class="text-link" href="#library?notes=1&scope=all">全部重点导读 ${icon('arrow')}</a></div><div class="discovery-grid"><div class="picks">${editorial.featured.map(id=>byId[id]).filter(Boolean).map(pick).join('')}</div><aside class="reading-desk"><div class="desk-heading"><span class="eyebrow">ON THE READING DESK</span><h3>Beyond the paper.</h3><p class="desk-intro">从伪代码和成本分析，补上实践这一面。</p></div>${['looped-gpt','loop-flops-memory'].map(id=>{const r=byId[id],n=note(r);return `<article class="blog-item"><div class="meta"><span>作者博客</span><span class="sep">/</span><span>${esc(n.level)}</span></div><h4><button class="title-button" data-open="${id}">${esc(n.heading)}</button></h4><p>${esc(n.question)}</p><button class="text-link" data-open="${id}">看阅读提示 ↗</button></article>`;}).join('')}<p class="desk-note">博客适合解释思路和工程取舍；引用具体实验时，仍应回到原文与代码。</p><a class="text-link desk-all" style="margin-top:17px" href="#library?type=blog&scope=all">浏览 ${counts.blog} 篇技术博客 ${icon('arrow')}</a></aside></div></section>
 <section class="section"><div class="section-head"><div><span class="eyebrow">CHOOSE YOUR PATH</span><h2>下一步，取决于你的问题。</h2></div><a class="text-link" href="#paths">查看学习路线 ${icon('arrow')}</a></div><div class="route-teasers">${editorial.routes.map(routeTeaser).join('')}</div></section>`;
}
const topicNames=()=>[...new Set(records.map(r=>r.topic))];
function library(){
 const topics=topicNames();
 return `<header class="view-header"><span class="eyebrow">THE LIBRARY</span><h1>把下一篇，找得更准。</h1><p>${records.length} 条资源，按问题而非榜单探索。搜索中英文标题、作者、主题或关键词；点开标题查看贡献、阅读价值和局限。</p></header><div class="searchbox">${icon('search')}<label class="sr-only" for="search">搜索资料</label><input id="search" type="search" value="${esc(state.q)}" placeholder="试试 Huginn、KV cache、动态计算、固定点…" autocomplete="off" spellcheck="false"><kbd>/</kbd></div><div class="library-layout"><aside class="filters" aria-label="筛选条件"><p class="filter-title">研究主题</p><div class="topic-list"><button class="topic-button" data-topic="" aria-pressed="${!state.topic}">全部主题<span>${records.length}</span></button>${topics.map(t=>`<button class="topic-button" data-topic="${esc(t)}" aria-pressed="${state.topic===t}">${esc(t)}<span>${records.filter(r=>r.topic===t).length}</span></button>`).join('')}</div><label class="sr-only" for="mobile-topic">研究主题</label><select id="mobile-topic" class="mobile-filter"><option value="">全部研究主题</option>${topics.map(t=>`<option value="${esc(t)}" ${state.topic===t?'selected':''}>${esc(t)}</option>`).join('')}</select><div class="filter-rule"></div><label class="filter-check"><input id="scope-filter" type="checkbox" ${state.scope==='all'?'checked':''}>包括关联方向</label><label class="filter-check"><input id="notes-filter" type="checkbox" ${state.annotated?'checked':''}>只看本轮重点导读</label><p class="filter-help">默认聚焦循环架构及其理论前身。Coconut、HRM 等关联路线单独标注；不是同一种架构。</p><button class="reset-button" data-reset>清除筛选</button></aside><div class="library-main"><div class="library-toolbar"><div class="type-tabs" role="group" aria-label="资源类型">${[['','全部'],['paper','论文'],['blog','博客'],['project','项目']].map(([v,t])=>`<button class="type-tab" data-kind="${v}" aria-pressed="${state.kind===v}">${t}</button>`).join('')}</div><label class="sr-only" for="sort">排序方式</label><select id="sort"><option value="recommended" ${state.sort==='recommended'?'selected':''}>推荐阅读顺序</option><option value="newest" ${state.sort==='newest'?'selected':''}>时间：从新到旧</option><option value="oldest" ${state.sort==='oldest'?'selected':''}>时间：从旧到新</option></select></div><div class="result-bar"><span id="result-count" role="status" aria-live="polite"></span><button data-export>导出当前书单 ↓</button></div><div id="results"></div><p class="library-note">推荐顺序属于编辑判断，不是学术质量评分。时间使用目录记录的年月，可能对应预印本或正式发表年份；精确日期请以原文为准。</p></div></div>`;
}
function filtered(){
 const tokens=state.q.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
 const list=records.filter(r=>{
 if(state.kind&&r.kind!==state.kind)return false;
 if(state.topic&&r.topic!==state.topic)return false;
 if(state.scope!=='all'&&r.scope==='adjacent')return false;
 if(state.annotated&&!note(r))return false;
 const n=note(r);
 const hay=[r.title,r.short,r.author,r.desc,r.why,r.caveat,r.topic,r.arxiv,...r.tags||[],n?.heading,n?.question,n?.takeaway,n?.focus].join(' ').toLocaleLowerCase();
 return tokens.every(x=>hay.includes(x));
 });
 const date=r=>String(r.year)+'-'+((String(r.month).match(/^\d{4}-(\d{2})/)||[])[1]||'00');
 const ranks={S:0,A:1,B:2};
 list.sort((a,b)=>{
 if(state.sort==='newest')return date(b).localeCompare(date(a))||a.title.localeCompare(b.title);
 if(state.sort==='oldest')return date(a).localeCompare(date(b))||a.title.localeCompare(b.title);
 const ia=editorial.featured.indexOf(a.id),ib=editorial.featured.indexOf(b.id);
 const ra=ia<0?100+(note(a)?0:20)+(ranks[a.tier]??3):ia,rb=ib<0?100+(note(b)?0:20)+(ranks[b.tier]??3):ib;
 return ra-rb||date(b).localeCompare(date(a))||a.title.localeCompare(b.title);
 });
 return list;
}
function refreshLibrary(){
 currentList=filtered();
 $('#result-count').textContent=`显示 ${currentList.length} / ${records.length} 条${state.scope!=='all'?' · 核心方向与理论前身':''}`;
 $('#results').innerHTML=currentList.length?currentList.map(paperRow).join(''):`<div class="empty"><h2>这组条件下，还没有匹配资料。</h2><p>尝试更短的关键词，或把关联方向加入范围。</p><button class="button" data-reset>清除全部筛选</button></div>`;
 $$('.topic-button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===state.topic)));
 $$('.type-tab').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.kind===state.kind)));
 $('#mobile-topic').value=state.topic;
}
function paths(){
 return `<header class="view-header"><span class="eyebrow">READ WITH A PURPOSE</span><h1>不必从第一篇读到第八十二篇。</h1><p>选一条符合目标的路线。每一步都有阅读任务；读完后点击勾选，进度会保存在当前浏览器。</p></header><div class="routes-page">${editorial.routes.map(r=>{const done=r.steps.filter(s=>read.has(s.id)).length;return `<section class="route-detail" id="route-${r.id}"><div class="route-intro"><span class="route-no">${r.number}</span><h2>${esc(r.title)}</h2><p>${esc(r.subtitle)}。</p><h4>适合谁</h4><p>${esc(r.audience)}。</p><h4>先修知识</h4><p>${esc(r.prerequisite)}</p><div class="route-target">${esc(r.outcome)}</div><div class="route-progress" data-route-progress="${r.id}"><span>${done} / ${r.steps.length} 篇已读</span><div class="progress-track"><span style="width:${done/r.steps.length*100}%"></span></div></div></div><ol class="route-steps">${r.steps.map((s,i)=>{const p=byId[s.id];return `<li class="route-step"><span class="step-number ${read.has(s.id)?'done':''}" data-indicator="${s.id}" data-step="${i+1}">${read.has(s.id)?icon('check'):i+1}</span><div class="step-body"><div class="meta"><span>${esc(kinds[p.kind])}</span><span>·</span><span>${p.year}</span></div><h3><button class="title-button" data-open="${s.id}">${esc(p.short)}</button></h3><p>${esc(s.goal)}</p><p class="step-question">带着这个问题读：${esc(s.question)}</p><button class="text-link" data-open="${s.id}">打开导览 ${icon('arrow')}</button></div>${readButton(p)}</li>`;}).join('')}</ol></section>`;}).join('')}</div>`;
}
function understand(){
 return `<header class="view-header"><span class="eyebrow">CONCEPTS & EDITORIAL NOTES</span><h1>先把几个容易混淆的概念分开。</h1><p>这些说明是本站的阅读框架，不是统一术语标准，也不替代论文里的模型定义。进一步阅读可直接打开下方关联原文。</p></header>
 <div class="concept-layout"><section class="concept-lead"><span class="eyebrow">THE CORE IDEA</span><h2>重复使用计算模块，更新隐藏状态。</h2><p>普通深层网络通常为不同层配备不同参数。循环深度模型则反复调用共享模块，让隐藏表示经历多轮更新。循环可以覆盖整组层，也可以只发生在中间部分。</p><div class="formula">h<sub>t+1</sub> = F<sub>θ</sub>(h<sub>t</sub>, x)</div><p>这里的 t 是<strong>循环步数</strong>，不是文本里的第几个 token。θ 被重复使用；输入 x 是否每步注入，以及怎样注入，取决于具体架构。</p><div class="source-links"><button class="text-link" data-open="1807.03819">Universal Transformer ↗</button><button class="text-link" data-open="2502.05171">Huginn ↗</button></div></section><aside class="concept-aside"><span class="eyebrow">KEEP THESE SEPARATE</span><h3>共享权重、循环训练、测试外推，是三个问题。</h3><p><strong>共享权重：</strong>多次调用是否使用同一组参数？</p><p><strong>循环训练：</strong>训练期间有没有让模型经历这样的重复计算？损失和梯度如何传播？</p><p><strong>测试外推：</strong>测试时多跑几轮，是否仍能稳定改善效果？</p><p>前一个问题的答案是“是”，并不能保证后两个也是。</p></aside></div>
 <div class="concept-grid"><article class="concept-card"><span class="num">01</span><h3>Loop ≠ 所有潜在推理</h3><p>Latent reasoning 是更宽泛的研究方向。Coconut 等方法沿连续隐藏状态组织推理，不宜与共享深度模块的架构直接画等号。</p><button class="text-link" data-open="2412.06769">对照 Coconut ${icon('arrow')}</button></article><article class="concept-card"><span class="num">02</span><h3>Loop 与 diffusion 有联系，但不宜一概等同</h3><p>二者都可能通过迭代细化状态。具体联系仍取决于训练目标、因果结构和采样方式；要比较具体模型，而不是只比较“都循环”。</p><button class="text-link" data-open="2510.14961">看连接两者的工作 ${icon('arrow')}</button></article><article class="concept-card"><span class="num">03</span><h3>省参数，不等于自动省计算</h3><p>共享权重减少独有参数，但多次调用仍需要计算；激活与 KV cache 也未必只保存一份。内存、FLOPs 和墙钟时间需要分别报告。</p><button class="text-link" data-open="loop-flops-memory">阅读成本分析 ${icon('arrow')}</button></article></div>
 <section class="section"><div class="section-head"><div><span class="eyebrow">BEFORE YOU TRUST THE CHART</span><h2>读实验，先问四个问题。</h2><p>下面是阅读与复现时的检查清单，不是任何单篇论文已经证明的通则。</p></div></div><div class="comparison"><div class="comparison-row"><strong>比较的是什么参数？</strong><span>独有参数、驻留参数、每次激活参数，还是循环展开后的等效层数？这些数字不能混着使用。</span></div><div class="comparison-row"><strong>训练预算是否一致？</strong><span>相同 token 数不代表相同 FLOPs；相同训练步数也不代表相同成本。检查基线与学习率等训练配置。</span></div><div class="comparison-row"><strong>推理预算如何控制？</strong><span>同时看循环次数、生成 token 数、KV cache、batch size 和延迟；不能只凭更少参数判断更快。</span></div><div class="comparison-row"><strong>结论能推广多远？</strong><span>分清理论构造、合成任务、语言预训练和真实系统测量。看种子、消融、误差范围与失败案例。</span></div></div></section>
 <section class="method-note"><h2>本站如何收录与核对资料</h2><p>目录保留 ${records.length} 条资源，包括核心循环架构、理论前身与明确标注的关联方向。它是一个精选快照，不声称覆盖全网，也不把转载数量当作价值。</p><p>本轮为 ${Object.keys(editorial.notes).length} 条重点资源补充了阅读导览。详情页逐条注明核对的来源、日期和范围：摘要、原文 HTML、博客正文或作者公开稿。<strong>核对来源不代表独立复现实验，也不等于完成同行评审。</strong></p><p>其余条目沿用上一版目录摘要，并标注尚未在本轮逐项复核。原目录的 S / A / B 仅用于辅助推荐排序，不再显示为论文评分。先修要求、阅读问题和路线顺序属于本站的编辑建议。</p><p>论文、博客与项目分别标注；所有来源内容的版权归原作者。发现错误或新的论文版本，请通过 <a href="https://github.com/kimio-hub/loop-transformer-atlas/issues/new?template=report-problem.yml" target="_blank" rel="noopener noreferrer">纠错表单</a> 提供原始证据。资料快照与本轮核对日期：2026-10-22。</p></section>`;
}
function shelf(){
 const list=records.filter(r=>(state.shelf==='read'?read:saved).has(r.id));currentList=list;
 return `<header class="view-header"><span class="eyebrow">YOUR READING SHELF</span><h1>留给下一次阅读。</h1><p>把值得读的资料留下，把读完的进度记住。</p><div class="shelf-summary"><span><strong>${saved.size}</strong> 已收藏</span><span><strong>${read.size}</strong> 已读</span></div></header><div class="privacy-note">书架只保存在当前浏览器，不上传服务器，也不会跨设备同步。清除浏览器数据会移除记录；可以导出 Markdown 书单留存。</div><div class="library-toolbar"><div class="type-tabs" role="group" aria-label="书架视图"><button class="type-tab" data-shelf="saved" aria-pressed="${state.shelf!=='read'}">已收藏 · ${saved.size}</button><button class="type-tab" data-shelf="read" aria-pressed="${state.shelf==='read'}">已读 · ${read.size}</button></div><button class="text-link" data-export>${icon('download')} 导出书单</button></div><div class="saved-list">${list.length?list.map(paperRow).join(''):`<div class="empty"><h2>${state.shelf==='read'?'读完一篇，就在这里记下来。':'你的下一篇，还没放进书架。'}</h2><p>${state.shelf==='read'?'点资料旁的勾选按钮，学习路线也会同步显示进度。':'点击资料旁的书签，即可保存在这个浏览器里。'}</p><div class="actions"><a class="button primary" href="#library">去资料库看看 ${icon('arrow')}</a><a class="button" href="#paths">选择学习路线</a></div></div>`}</div>`;
}
let routeScroll=null;
function render(){
 state=parseRoute();
 const views={discover:home,library,paths,understand,saved:shelf};
 app.innerHTML=views[state.view]();
 $$('[data-nav]').forEach(a=>{if(a.dataset.nav===state.view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 if(state.view==='library')refreshLibrary();
 $('#saved-count').textContent=saved.size;
 const titles={discover:'读懂循环，找到下一篇',library:'资料库',paths:'学习路线',understand:'概念与方法',saved:'我的书架'};
 document.title=`${titles[state.view]} · Loop Atlas`;
 if(routeScroll&&state.view==='paths'){const target=$('#route-'+routeScroll);if(target)requestAnimationFrame(()=>target.scrollIntoView());routeScroll=null;}
}
function refreshButtons(){
 $('#saved-count').textContent=saved.size;
 $$('[data-save]').forEach(b=>{const id=b.dataset.save,on=saved.has(id);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',`${on?'取消收藏':'收藏'}：${byId[id]?.short||id}`);b.title=on?'取消收藏':'收藏到书架';if(b.classList.contains('reader-save'))b.innerHTML=icon('bookmark')+(on?'已收藏':'收藏');});
 $$('[data-read]').forEach(b=>{const id=b.dataset.read,on=read.has(id);b.setAttribute('aria-pressed',String(on));b.setAttribute('aria-label',`${on?'标为未读':'标为已读'}：${byId[id]?.short||id}`);b.title=on?'标为未读':'标为已读';if(b.classList.contains('reader-read'))b.innerHTML=icon('check')+(on?'已读':'标为已读');});
 $$('[data-indicator]').forEach(el=>{const on=read.has(el.dataset.indicator);el.classList.toggle('done',on);el.innerHTML=on?icon('check'):esc(el.dataset.step);});
 $$('[data-route-progress]').forEach(el=>{const r=editorial.routes.find(x=>x.id===el.dataset.routeProgress);if(!r)return;const n=r.steps.filter(x=>read.has(x.id)).length;el.innerHTML=`<span>${n} / ${r.steps.length} 篇已读</span><div class="progress-track"><span style="width:${n/r.steps.length*100}%"></span></div>`;});
}
function readerHTML(r){
 const n=note(r);
 const q=n?.question||r.why;
 return `<div class="reader-top">${sourceMeta(r)}<h2 id="reader-title">${esc(n?.heading||r.short)}</h2><p class="reader-original">${esc(r.title)}</p><p class="reader-authors">${esc(r.author)} · ${esc(r.topic)} · ${esc(scopes[r.scope]||r.scope)}</p></div><div class="reader-actions">${external(r.url,`阅读原文 ${icon('external')}`,'button primary')}${r.code?external(r.code,'查看代码 ↗','button'):''}${r.project?external(r.project,'项目主页 ↗','button'):''}<button class="button reader-save" data-save="${esc(r.id)}" aria-pressed="${saved.has(r.id)}">${icon('bookmark')}${saved.has(r.id)?'已收藏':'收藏'}</button><button class="button reader-read" data-read="${esc(r.id)}" aria-pressed="${read.has(r.id)}">${icon('check')}${read.has(r.id)?'已读':'标为已读'}</button><button class="button" data-share="${esc(r.id)}">复制分享链接</button></div>
 <div class="reader-question"><small>${n?'带着一个问题读':'为什么值得读'}</small><p>${esc(q)}</p></div><section class="reader-section"><h3>这篇在做什么</h3><p>${esc(n?.takeaway||r.desc)}</p></section>${n?`<section class="reader-section"><h3>建议先准备什么</h3><p>${esc(n.prerequisite)}</p></section><section class="reader-section"><h3>读的时候，重点看什么</h3><p>${esc(n.focus)}</p></section>`:`<section class="reader-section"><h3>阅读价值</h3><p>${esc(r.why)}</p></section>`}<section class="reader-section reader-boundary"><h3>结论的边界</h3><p>${esc(n?.boundary||r.caveat||'具体结论请以原文的实验条件和版本为准。')}</p></section>${n?.related?.length?`<section class="reader-section"><h3>接着读 / 对照着读</h3><div class="related-links">${n.related.filter(id=>byId[id]).map(id=>`<button data-open="${esc(id)}">${esc(byId[id].short)} →</button>`).join('')}</div></section>`:''}<div class="review-note">${n?`本轮核对：${esc(n.checked)} · ${esc(n.review)}。<br>${external(n.source,'查看核对来源 ↗')} · 导读与阅读问题为本站编辑整理；未独立复现实验。`:'此条目沿用上一版目录摘要，尚未在本轮逐项复核原文。引用前请自行核对链接、版本和实验条件。'}<br>${external('https://github.com/kimio-hub/loop-transformer-atlas/issues/new?template=report-problem.yml','这条资料有误？提交纠正 ↗')}</div>`;
}
function openReader(id,push=true){
 const r=byId[id];if(!r){notify('目录中没有这条资料。');return;}
 if(!dialog.open)lastFocus=document.activeElement;
 activeId=id;$('#reader-content').innerHTML=readerHTML(r);
 if(!dialog.open)dialog.showModal();dialog.scrollTop=0;document.body.classList.add('modal-open');
 if(push&&['http:','https:','file:'].includes(location.protocol)){const u=new URL(location.href);u.searchParams.set('paper',id);try{history.pushState(null,'',u);}catch{}}
 $('#close-reader').focus({preventScroll:true});
}
function closeReader(update=true){
 if(dialog.open)dialog.close();activeId=null;document.body.classList.remove('modal-open');
 if(update&&['http:','https:','file:'].includes(location.protocol)){const u=new URL(location.href);u.searchParams.delete('paper');try{history.replaceState(null,'',u);}catch{}}
 if(lastFocus?.isConnected)lastFocus.focus({preventScroll:true});
}
function syncReader(){const id=new URLSearchParams(location.search).get('paper');if(id&&byId[id]){if(activeId!==id||!dialog.open)openReader(id,false);}else if(dialog.open)closeReader(false);}
function exportList(){
 const list=state.view==='library'?filtered():currentList;
 if(!list.length){notify('当前书单为空，先选几篇资料吧。');return;}
 const lines=['# Loop Atlas 阅读书单','','目录快照：2026-10-22。推荐与导读是编辑建议，不代表独立复现。',''];
 list.forEach(r=>{const n=note(r);lines.push(`- [${r.title}](${r.url})`, `  - ${r.year} · ${kinds[r.kind]} · ${scopes[r.scope]} · ${read.has(r.id)?'已读':'未读'}`,`  - ${n?.question||r.why}`,`  - 边界：${n?.boundary||r.caveat}`,'');});
 const blob=new Blob([lines.join('\n')],{type:'text/markdown;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='loop-atlas-reading-list.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify(`已导出 ${list.length} 条资料。`);
}
async function share(id){
 const u=new URL('https://kimio-hub.github.io/loop-transformer-atlas/');u.searchParams.set('paper',id);u.hash='library';
 try{if(!navigator.clipboard)throw new Error();await navigator.clipboard.writeText(u.href);notify('已复制这篇资料的分享链接。');}
 catch{const t=document.createElement('textarea');t.value=u.href;t.style.position='fixed';t.style.opacity='0';(dialog.open?dialog:document.body).append(t);t.select();const ok=document.execCommand('copy');t.remove();notify(ok?'已复制这篇资料的分享链接。':'无法自动复制，请复制地址栏里的链接。');}
}
function setTheme(){
 const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';
 try{localStorage.setItem('loop-atlas-theme',dark?'dark':'light');}catch{}
 $('#theme').setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式');
 document.querySelector('meta[name="theme-color"]').content=dark?'#141c18':'#f8f9f5';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('button,a');if(!b)return;
 if(b.classList.contains('skip')){e.preventDefault();$('#main').focus();$('#main').scrollIntoView();return;}
 if(b.dataset.open){openReader(b.dataset.open);return;}
 if(b.dataset.save){const id=b.dataset.save;if(saved.has(id))saved.delete(id);else saved.add(id);const ok=persist(savedKey,saved);if(state.view==='saved')render();refreshButtons();if(ok)notify(saved.has(id)?'已放入书架。':'已从书架移除。');return;}
 if(b.dataset.read){const id=b.dataset.read;if(read.has(id))read.delete(id);else read.add(id);const ok=persist(readKey,read);if(state.view==='saved')render();refreshButtons();if(ok)notify(read.has(id)?'已标记读完，路线进度已更新。':'已标记为未读。');return;}
 if(b.dataset.share){share(b.dataset.share);return;}
 if(b.hasAttribute('data-topic')){state.topic=b.dataset.topic;updateRoute();refreshLibrary();return;}
 if(b.hasAttribute('data-kind')){state.kind=b.dataset.kind;updateRoute();refreshLibrary();return;}
 if(b.hasAttribute('data-reset')){state={...state,q:'',kind:'',topic:'',scope:'core',sort:'recommended',annotated:false};updateRoute();render();return;}
 if(b.hasAttribute('data-export')){exportList();return;}
 if(b.hasAttribute('data-shelf')){state.shelf=b.dataset.shelf;updateRoute();render();return;}
 if(b.dataset.routeScroll){routeScroll=b.dataset.routeScroll;if(state.view==='paths'){e.preventDefault();$('#route-'+routeScroll)?.scrollIntoView();routeScroll=null;}return;}
 if(b.id==='theme'){setTheme();return;}
 if(b.id==='close-reader'){closeReader();return;}
});
document.addEventListener('input',e=>{
 if(e.target.id==='search'){state.q=e.target.value;updateRoute();refreshLibrary();}
 if(e.target.id==='loop-range'){const n=e.target.value;$('#loop-value').textContent=n+'×';$('#diagram-note').innerHTML=`同一模块调用 ${n} 次，权重仍是一份。<br>计算结构示意，不代表性能随次数线性提升。`;}
});
document.addEventListener('change',e=>{
 const id=e.target.id;
 if(id==='scope-filter')state.scope=e.target.checked?'all':'core';
 else if(id==='notes-filter')state.annotated=e.target.checked;
 else if(id==='sort')state.sort=e.target.value;
 else if(id==='mobile-topic')state.topic=e.target.value;
 else return;
 updateRoute();refreshLibrary();
});
document.addEventListener('keydown',e=>{
 if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!dialog.open&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!document.activeElement.isContentEditable){
 e.preventDefault();if(state.view!=='library'){location.hash='library';setTimeout(()=>$('#search')?.focus(),30);}else $('#search')?.focus();
 }
});
dialog.addEventListener('cancel',e=>{e.preventDefault();closeReader();});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeReader();}});
window.addEventListener('hashchange',()=>{if(!records.length)return;render();syncReader();if(!routeScroll)window.scrollTo({top:0,behavior:'instant'});});
window.addEventListener('popstate',()=>{if(records.length)syncReader();});
window.addEventListener('storage',e=>{if(e.key===savedKey||e.key===readKey){saved=loadSet(savedKey);read=loadSet(readKey);if(records.length){render();refreshButtons();}}});
async function start(){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{
 const data=window.LOOP_DATA||await Promise.all(['catalog.json','editorial.json'].map(async path=>{const r=await fetch(path+'?v=2.0',{signal:controller.signal});if(!r.ok)throw new Error('HTTP '+r.status);return r.json();}));
 clearTimeout(timer);records=data[0];editorial=data[1];
 if(!Array.isArray(records)||!records.length||!editorial.notes||!editorial.routes)throw new Error('Invalid catalog');
 byId=Object.fromEntries(records.map(r=>[r.id,r]));saved=new Set([...saved].filter(id=>byId[id]));read=new Set([...read].filter(id=>byId[id]));
 render();syncReader();const isDark=document.documentElement.dataset.theme==='dark';$('#theme').setAttribute('aria-label',isDark?'切换浅色模式':'切换深色模式');document.querySelector('meta[name="theme-color"]').content=isDark?'#141c18':'#f8f9f5';
 }catch(err){clearTimeout(timer);console.error('Loop Atlas failed to load:',err);app.innerHTML=`<section class="loading"><span class="eyebrow">LOOP / ATLAS</span><h1>资料暂时没有加载出来。</h1><p>请刷新页面重试。直接双击源码里的 HTML 时，需要先启动本地 HTTP 服务；也可以使用构建脚本导出的独立版本。</p><div class="actions"><a class="button primary" href="${esc(location.pathname)}">重新加载</a>${external('https://github.com/kimio-hub/loop-transformer-atlas/blob/main/bibliography.md','去 GitHub 阅读完整目录 ↗','button')}</div></section>`;}
}
start();
})();
