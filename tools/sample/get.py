# 견본 방 사진 받기 v4(아이 · 학교 · 군 · 경주 사진 빼고 · 같은 연작은 하나만) · 261110 — 위키미디어 공용(Wikimedia Commons)에서 「CC0 · 퍼블릭 도메인」 사진만(출처 표시 의무 없음) 골라 받음
# rec/seed/sample/<폴더>/<글자><번호>.jpg(1600) · _t.jpg(320) · 받은 목록 rec/seed/sample/list.json(파일 · 원본 주소 · 사용 허락)
import json, os, subprocess, urllib.parse, urllib.request
UA = 'LoveflowSampleBot/1.0 (https://www.loveflow.ai.kr; loveflow.ai.kr@gmail.com)'
ROOMS = [
  ('bike', 'b', 9, ['Han River bicycle', 'bicycle path Korea', 'cycling road countryside', 'LA river riverside bike path', 'bicycle trail forest', 'bicycle path river', 'cyclists road']),
  ('swim', 's', 8, ['swimming pool lanes', 'indoor swimming pool', 'swimming pool lane rope', 'lap swimming pool', 'public swimming pool', 'swimming pool water surface', 'olympic swimming pool']),
  ('hike', 'h', 8, ['Bukhansan', 'Korea hiking trail', 'Seoraksan', 'Jirisan', 'mountain hiking trail', 'mountain ridge autumn Korea']),
]
BAN = ('boy', 'girl', 'child', 'kid', 'school', 'student', 'graffiti', 'navy', 'army', 'nara', 'race', 'champs', 'baby', 'teen')
import re
def series(t): return re.sub(r'[^a-z]', '', re.sub(r'\(.*?\)|dscf\d+|\d+', '', t.lower()))[:28]
OK_LIC = ('cc0', 'public domain', 'pd', 'cc-zero')
def get(url):
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()
def search(q):
    p = {'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': '6', 'gsrlimit': '40', 'gsrsearch': q + ' filetype:bitmap',
         'prop': 'imageinfo', 'iiprop': 'url|size|mime|extmetadata', 'iiurlwidth': '1600'}
    d = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)))
    out = []
    for pg in (d.get('query', {}).get('pages', {}) or {}).values():
        ii = (pg.get('imageinfo') or [{}])[0]; md = ii.get('extmetadata') or {}
        lic = (md.get('LicenseShortName', {}).get('value', '') + ' ' + md.get('License', {}).get('value', '')).lower()
        if ii.get('mime') != 'image/jpeg' or ii.get('width', 0) < 1200 or ii.get('width', 0) < ii.get('height', 0) * 0.6: continue
        if not any(k in lic for k in OK_LIC): continue
        t = (pg.get('title') or '').lower()
        if any(w in t for w in BAN): continue   # 아이 · 학교 · 낙서 같은 사진은 빼고
        out.append({'title': pg.get('title'), 'thumb': ii.get('thumburl') or ii.get('url'), 'page': ii.get('descriptionurl'), 'license': md.get('LicenseShortName', {}).get('value', '')})
    return out
man = {}
for folder, ch, want, qs in ROOMS:
    os.makedirs('rec/seed/sample/' + folder, exist_ok=True); got = []; seen = set()
    for q in qs:
        if len(got) >= want: break
        try: cand = search(q)
        except Exception as e: print('★검색 실패', q, e); continue
        for c in cand:
            if len(got) >= want: break
            k = series(c['title'])
            if c['title'] in seen or k in seen: continue
            seen.add(c['title']); seen.add(k)   # 같은 연작(번호만 다른 사진)은 하나만
            n = len(got) + 1; base = 'rec/seed/sample/%s/%s%d' % (folder, ch, n)
            try:
                open('/tmp/p.jpg', 'wb').write(get(c['thumb']))
                subprocess.run(['convert', '/tmp/p.jpg', '-auto-orient', '-resize', '1600x1600>', '-strip', '-quality', '80', base + '.jpg'], check=True)
                subprocess.run(['convert', '/tmp/p.jpg', '-auto-orient', '-resize', '320x320>', '-strip', '-quality', '55', base + '_t.jpg'], check=True)
            except Exception as e: print('★받기 실패', c['title'], e); continue
            got.append({'file': '%s/%s%d' % (folder, ch, n), 'title': c['title'], 'page': c['page'], 'license': c['license'], 'q': q})
            print('받음', folder, n, c['license'], c['title'])
    man[folder] = got; print('==', folder, len(got), '/', want)
json.dump(man, open('rec/seed/sample/list.json', 'w'), ensure_ascii=False, indent=1)
