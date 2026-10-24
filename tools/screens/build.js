/* ★ 현재 버전 ▶ tools/screens/build.js · v1 · 261024 · [칸 7-나 428] 화면 목록 자동 짓기
   저장소의 .html 파일을 모두 훑어 lf/screens.json 을 만든다 — 본부 ⑥ 「화면 목록」이 읽음.
   설명(이름 · 묶음)은 lf/screens-notes.json 에서 덧붙이고, 거기 없는 새 파일은 「새로 생긴 화면」으로 저절로 나옴.
   GitHub 자동 실행(.github/workflows/screens.yml)이 화면을 올릴 때마다 돌림. 손으로: node tools/screens/build.js */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..', '..');
const SKIP = /^(\.git|\.github|backup|node_modules)(\/|$)/;
const TEST = /(^|\/)(pptest|share|home-new)\.html$|_old\.html$|_v\d+\.html$|(^|\/)lab\/|(^|\/)tools\/|gatecheck\.html$/;

function walk(dir, out) {
  fs.readdirSync(path.join(ROOT, dir)).forEach(function (n) {
    const rel = dir ? dir + '/' + n : n;
    if (SKIP.test(rel)) { return; }
    const st = fs.statSync(path.join(ROOT, rel));
    if (st.isDirectory()) { walk(rel, out); } else if (/\.html$/.test(n)) { out.push(rel); }
  });
  return out;
}
function fileOf(p) {   /* 주소 → 저장소 파일 */
  let u = String(p || '').split('?')[0].split('#')[0].replace(/^\//, '');
  if (u === '' || /\/$/.test(u)) { u += 'index.html'; }
  return u;
}
function info(rel) {
  const s = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const head = s.slice(0, 4000);
  const t = (/<title>([^<]*)<\/title>/i.exec(s) || [])[1] || '';
  const v = /현재 버전 ▶\s*[^·]*·\s*(v[\w.-]+)\s*·\s*(\d{6})/.exec(head) || /·\s*(v\d+[\w.-]*)\s*·\s*(\d{6})/.exec(head.slice(0, 600)) || [];
  return { title: t.replace(/\s+/g, ' ').trim(), ver: v[1] || '', day: v[2] || '', noindex: /<meta[^>]+noindex/i.test(s), kb: Math.round(Buffer.byteLength(s) / 1024) };
}
const notes = JSON.parse(fs.readFileSync(path.join(ROOT, 'lf/screens-notes.json'), 'utf8'));
const files = walk('', []).sort();
const INFO = {}; files.forEach(function (f) { INFO[f] = info(f); });
const used = {};
const groups = notes.groups.map(function (g) {
  return { title: g.title, reserve: !!g.reserve, items: g.items.map(function (x) {
    const f = fileOf(x.path), isJs = /\.js$/.test(f), ok = isJs ? fs.existsSync(path.join(ROOT, f)) : !!INFO[f];
    if (INFO[f]) { used[f] = 1; }
    const o = { name: x.name, path: x.path, file: f };
    ['note', 'lock', 'pcode'].forEach(function (k) { if (x[k]) { o[k] = x[k]; } });
    if (!ok) { o.missing = 1; }
    if (INFO[f]) { o.ver = INFO[f].ver; o.day = INFO[f].day; o.noindex = INFO[f].noindex ? 1 : 0; o.title = INFO[f].title; }
    if (TEST.test(f)) { o.test = 1; }
    return o;
  }) };
});
const fresh = [], test = [];
files.forEach(function (f) {
  if (used[f]) { return; }
  const i = INFO[f], p = '/' + f.replace(/(^|\/)index\.html$/, '$1');
  const o = { name: i.title || f, path: p, file: f, ver: i.ver, day: i.day, noindex: i.noindex ? 1 : 0, title: i.title };
  if (TEST.test(f)) { o.test = 1; test.push(o); } else { fresh.push(o); }
});
const out = { _: '자동으로 지은 파일 — 손으로 고치지 않음(설명은 lf/screens-notes.json)', files: files.length, groups: groups, fresh: fresh, test: test };
const dest = path.join(ROOT, 'lf/screens.json');
const next = JSON.stringify(out, null, 1) + '\n';
if (!fs.existsSync(dest) || fs.readFileSync(dest, 'utf8') !== next) { fs.writeFileSync(dest, next); console.log('lf/screens.json 바꿈 · 파일 ' + files.length + ' · 새로 생긴 화면 ' + fresh.length + ' · 시험 · 옛 ' + test.length); }
else { console.log('바뀐 것 없음'); }
