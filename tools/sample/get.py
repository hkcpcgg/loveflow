# 견본 방 사진 받기 v5 · 261110 — 위키미디어 공용(Wikimedia Commons) 「CC0 · 퍼블릭 도메인」 사진(출처 표시 의무 없음) 중 클로드 이사가 눈으로 골라 정한 것만 받음
# rec/seed/sample/<폴더>/<이름>.jpg(1600) · _t.jpg(320) · 받은 목록 rec/seed/sample/list.json(파일 · 원본 쪽 · 사용 허락)
import json, os, subprocess, urllib.parse, urllib.request
UA = 'LoveflowSampleBot/1.0 (https://www.loveflow.ai.kr; loveflow.ai.kr@gmail.com)'
PICK = {
 'bike': ['Alex Baum Bicycle Bridge looking south at night 2015-09-27.jpg',
          "ENJOYING THE NEW BICYCLE PATH IN ROCK RIVER RESERVATION, PART OF THE METROPOLITAN PARK SYSTEM - NARA - 550069.jpg",
          "GETTING READY TO ENJOY THE NEW BICYCLE PATH IN ROCKY RIVER RESERVATION, PART OF THE METROPOLITAN PARK SYSTEM - NARA - 550084.jpg",
          'LA river riverside bike path.jpg', 'Cycling in the countryside (Unsplash).jpg', 'Inclined elevator at Hangang.jpg',
          'Andong Dam Certification Center.jpg', 'Ara Hangang Sea Lock Certification Center.jpg', 'Damyang Bamboo Forest Certification Center.jpg'],
 'swim': ['Sea Lanes Brighton swimming pool 2025-08-07.jpg', 'Access ramp on indoor pool, Runcorn Swimming Pool, Runcorn DSCF6198.jpg',
          'Tokyo Metropolitan Indoor Swimming Pool.jpg', 'Swimming laps (Unsplash rAyIvNqlwCY).jpg', 'Access ramp on indoor pool, Runcorn Swimming Pool, Runcorn DSCF6202.jpg',
          '160511-N-HV737-099 160511-N-HV737-099.jpg', 'Swimming pool aboard the Hamburg-American Line ship Vaterland (28115076451).jpg'],
 'hike': ['Bukhansan Spring in Korea.jpg', 'Bukhansan Summer in Korea.jpg', 'Bukhansan Winter in Korea.jpg', 'Insoo peak.jpg',
          'Insubong Peak of Bukhansan in spring in Korea.jpg', 'Seogang Bridge and Bukhansan from Bamseom.jpg', '20190925-FS-LSC-0196 (49618769251).jpg',
          'Mangyeongdae Terrace of Bukhansan in Spring in Korea.jpg', 'Baegundae Terrace of Bukhansan in Spring in Korea.jpg'],
}
CH = {'bike': 'b', 'swim': 's', 'hike': 'h'}
OK_LIC = ('cc0', 'public domain', 'pd', 'cc-zero')
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60) as r: return r.read()
man = {}
for folder, titles in PICK.items():
    os.makedirs('rec/seed/sample/' + folder, exist_ok=True); man[folder] = []
    for n, t in enumerate(titles, 1):
        p = {'action': 'query', 'format': 'json', 'titles': 'File:' + t, 'prop': 'imageinfo', 'iiprop': 'url|extmetadata', 'iiurlwidth': '1600'}
        try:
            d = json.loads(get('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(p)))
            pg = list(d['query']['pages'].values())[0]; ii = pg['imageinfo'][0]; md = ii.get('extmetadata') or {}
            lic = md.get('LicenseShortName', {}).get('value', '')
            if not any(k in lic.lower() for k in OK_LIC): print('★허락이 다름', t, lic); continue
            open('/tmp/p.jpg', 'wb').write(get(ii.get('thumburl') or ii['url']))
            base = 'rec/seed/sample/%s/%s%d' % (folder, CH[folder], n)
            subprocess.run(['convert', '/tmp/p.jpg', '-auto-orient', '-resize', '1600x1600>', '-strip', '-quality', '80', base + '.jpg'], check=True)
            subprocess.run(['convert', '/tmp/p.jpg', '-auto-orient', '-resize', '320x320>', '-strip', '-quality', '55', base + '_t.jpg'], check=True)
            man[folder].append({'file': '%s/%s%d' % (folder, CH[folder], n), 'title': t, 'page': ii.get('descriptionurl'), 'license': lic}); print('받음', folder, n, lic, t)
        except Exception as e: print('★받기 실패', t, e)
json.dump(man, open('rec/seed/sample/list.json', 'w'), ensure_ascii=False, indent=1)
