#!/usr/bin/env python3
# ★ 현재 버전 ▶ tools/rooms.py · v1 · 261113 · [572 ⑤ 490 카톡 미리보기 카드] 우리 이야기 공개 목록 시트(plaza 줄)를 읽어 열린 방마다 r/방번호/index.html(미리보기 머리말 og + 그 방으로 넘김)을 만듦
#   · 마당에 나오는 열린 방만(닫힌 · 숨긴 · 운영 멈춤 방은 공개 목록에 없음 → 그 파일을 지움) · 대표 사진은 마당 첫 장(관리자가 정한 대표 사진 먼저 · 아이 · 비공개 빠짐)
#   · 검색에 안 내보냄(noindex · 사이트맵 · 화면 목록에 안 넣음) · 바뀐 방만 파일이 달라짐(때 · 순번 같은 흔들리는 값은 넣지 않음)
#   사용: python3 tools/rooms.py [plaza.json]   (없으면 공개 목록 시트에서 받음)
# © 2026 사랑흐름 · LFRI™. 무단 복제 · 배포 · 상업적 이용 금지.
import html, json, os, re, shutil, sys, urllib.parse, urllib.request

SID = '1vGOfMMbQPciv3T-uIpr0VEpV_qDHcIiAGCAXiDTi_9A'   # lf/pub.js 와 같은 시트
SITE = 'https://www.loveflow.ai.kr'
OUT = 'r'
DESC = '사진과 이야기를 함께 남기는 곳 · 사랑흐름 우리 이야기'

def plaza():
    if len(sys.argv) > 1:
        return json.load(open(sys.argv[1], encoding='utf-8'))
    q = urllib.parse.quote("select * where A='plaza'")
    u = 'https://docs.google.com/spreadsheets/d/%s/gviz/tq?tqx=out:json&headers=1&tq=%s' % (SID, q)
    tx = urllib.request.urlopen(u, timeout=60).read().decode('utf-8')
    j = json.loads(tx[tx.index('{'):tx.rindex('}') + 1])
    if j.get('status') != 'ok' or not j['table']['rows']:
        raise SystemExit('공개 목록을 받지 못함 — 아무것도 바꾸지 않음')
    s = ''.join((c or {}).get('v') or '' for c in j['table']['rows'][0]['c'][2:])
    return json.loads(s)

def img(cv):
    if not cv: return SITE + '/og-image.png'
    if cv.get('yt'): return 'https://i.ytimg.com/vi/%s/hqdefault.jpg' % urllib.parse.quote(cv['yt'])
    if cv.get('u') and re.fullmatch(r'[A-Za-z0-9_-]{10,80}', cv['u']): return 'https://drive.google.com/thumbnail?id=%s&sz=w1200' % cv['u']
    return SITE + '/og-image.png'

def page(r):
    com = r['com']; e = lambda s: html.escape(str(s or ''), quote=True)
    name = r.get('name') or '우리 이야기'
    intro = re.sub(r'\s+', ' ', r.get('intro') or '').strip()
    desc = (intro[:90] + ' · 사랑흐름 우리 이야기') if intro else DESC
    go = '/rec/?c=' + urllib.parse.quote(com)
    return '''<!DOCTYPE html>
<!-- ★ 사랑흐름 우리 이야기 · 방 미리보기 카드 · tools/rooms.py 가 만든 파일 — 손으로 고치지 않음 -->
<html lang="ko"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>%(name)s · 사랑흐름 우리 이야기</title>
<meta name="description" content="%(desc)s">
<link rel="canonical" href="%(site)s/r/%(com)s/">
<meta property="og:type" content="website">
<meta property="og:site_name" content="사랑흐름">
<meta property="og:title" content="%(name)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:image" content="%(img)s">
<meta property="og:url" content="%(site)s/r/%(com)s/">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<script>(function(){ var q=location.search.replace(/^\\?/,'').replace(/(^|&)c=[^&]*/g,''); location.replace('%(go)s'+(q?'&'+q.replace(/^&/,''):'')); })();</script>
<noscript><meta http-equiv="refresh" content="0;url=%(go)s"></noscript>
</head><body style="font-family:sans-serif;text-align:center;padding:40px 16px">
<p><a href="%(go)s">%(name)s 열기 ›</a></p>
<p style="font-size:12px;color:#888">© 2026 사랑흐름 · LFRI™. 무단 복제 · 배포 · 상업적 이용 금지.<br>Unauthorized copying, distribution or commercial use is prohibited.</p>
</body></html>
''' % {'name': e(name), 'desc': e(desc), 'img': e(img(r.get('cover'))), 'site': SITE, 'com': e(com), 'go': e(go)}

def main():
    o = plaza(); rooms = [r for r in (o.get('rooms') or []) if re.fullmatch(r'C-\d{2,6}', str(r.get('com', '')))]
    if not rooms: raise SystemExit('방이 하나도 없음 — 잘못 받았을 수 있어 아무것도 바꾸지 않음')
    keep = set()
    for r in rooms:
        d = os.path.join(OUT, r['com']); os.makedirs(d, exist_ok=True); keep.add(r['com'])
        p = os.path.join(d, 'index.html'); new = page(r)
        old = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
        if new != old: open(p, 'w', encoding='utf-8').write(new); print('고침', r['com'], r.get('name'))
    if os.path.isdir(OUT):
        for c in os.listdir(OUT):
            if re.fullmatch(r'C-\d{2,6}', c) and c not in keep: shutil.rmtree(os.path.join(OUT, c)); print('지움', c)
    print('열린 방', len(keep))

if __name__ == '__main__': main()
