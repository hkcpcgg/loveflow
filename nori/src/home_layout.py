# 그때 그 놀이 · 첫 화면 새 배치 (표준 v1 · 261122)
# 위: 「그때 그 놀이」 한 줄 + 「다복에서 준비한 푸짐한 선물 받아가세요」
# 가운데: 세 묶음(혼자서 바로 · 둘이서 겨루기 · 여럿이 함께) · 한 줄 세 칸 · 「새」 표시 없음 · 칸을 누르면 바로 놀이
# 아래: 다복 이야기방 · 우리 이야기 · 사랑흐름 바로가기 → 사랑흐름 공용 푸터(lf-foot.js, 환불정책 뺌) · 고정 아래 막대(내 선물함 · 홈 · 공유하기)
import re

SK = '#F4C9A0'; LN = '#7A4A28'
def _svg(body):
    return '<svg class="pic" viewBox="0 0 84 68" aria-hidden="true">' + body + '</svg>'
NEW_PICS = {
 'rp': _svg('<g fill="%s" stroke="%s" stroke-width="2" stroke-linejoin="round"><rect x="6" y="26" width="30" height="30" rx="11"/><rect x="48" y="30" width="28" height="26" rx="10"/><rect x="54" y="8" width="8" height="28" rx="4" transform="rotate(10 58 22)"/><rect x="64" y="12" width="8" height="26" rx="4" transform="rotate(28 68 25)"/></g><path d="M14 40c4-3 9-3 13 0" fill="none" stroke="%s" stroke-width="2"/>' % (SK, LN, LN)),
 'hj': _svg('<g fill="%s" stroke="%s" stroke-width="2" stroke-linejoin="round"><rect x="10" y="22" width="34" height="34" rx="13"/></g><circle cx="56" cy="44" r="7" fill="#4E97A8" stroke="#2C5F6B" stroke-width="1.5"/><circle cx="70" cy="40" r="7" fill="#E1262D" stroke="#8E1418" stroke-width="1.5"/><circle cx="63" cy="54" r="7" fill="#2E9E4F" stroke="#1B5E2F" stroke-width="1.5"/><text x="27" y="17" text-anchor="middle" font-family="Black Han Sans,sans-serif" font-size="13" fill="#16181D">홀? 짝?</text>' % (SK, LN)),
 'mj': _svg('<g fill="%s" stroke="%s" stroke-width="2" stroke-linejoin="round"><rect x="8" y="24" width="30" height="30" rx="11"/><rect x="46" y="24" width="30" height="30" rx="11"/></g><text x="42" y="16" text-anchor="middle" font-family="Black Han Sans,sans-serif" font-size="13" fill="#7A3E9D">묵 찌 빠</text>' % (SK, LN)),
 'br': _svg('<g fill="%s" stroke="%s" stroke-width="2" stroke-linejoin="round"><path d="M8 44c0-12 10-18 22-18s22 6 22 18-10 18-22 18S8 56 8 44z"/><ellipse cx="30" cy="38" rx="13" ry="6" fill="#E8B48A"/><rect x="46" y="14" width="26" height="26" rx="10"/></g><text x="66" y="62" text-anchor="middle" font-family="Black Han Sans,sans-serif" font-size="12" fill="#C0392B">쌀!</text>' % (SK, LN)),
 'mg': _svg('<g stroke="#7A3E9D" stroke-width="2"><circle cx="42" cy="30" r="8" fill="#F28CB1"/><g fill="#F7B9D0"><circle cx="42" cy="16" r="8"/><circle cx="55" cy="25" r="8"/><circle cx="50" cy="41" r="8"/><circle cx="34" cy="41" r="8"/><circle cx="29" cy="25" r="8"/></g><circle cx="42" cy="30" r="5" fill="#FFC21A"/></g><path d="M42 50v14" stroke="#2E9E4F" stroke-width="3"/>'),
 'yn': _svg('<g fill="#E8C98E" stroke="#7A4E25" stroke-width="2"><rect x="10" y="10" width="11" height="50" rx="5"/><rect x="27" y="10" width="11" height="50" rx="5"/><rect x="46" y="10" width="11" height="50" rx="5" fill="#F4E3BE"/><rect x="63" y="10" width="11" height="50" rx="5"/></g><g stroke="#7A4E25" stroke-width="2"><path d="M13 22h5M13 35h5M13 48h5M30 22h5M30 35h5M66 22h5M66 48h5"/></g>'),
 'sg': _svg('<g fill="#2457D6"><circle cx="42" cy="12" r="6"/><circle cx="66" cy="30" r="6"/><circle cx="58" cy="56" r="6"/><circle cx="26" cy="56" r="6"/><circle cx="18" cy="30" r="6"/></g><circle cx="42" cy="34" r="16" fill="none" stroke="#C9B48A" stroke-width="2" stroke-dasharray="4 4"/><path d="M60 40l10 6-10 6z" fill="#E1262D"/>'),
 'db': _svg('<g fill="#E1262D"><circle cx="20" cy="20" r="7"/><rect x="15" y="28" width="10" height="18" rx="4"/></g><g fill="#2457D6"><circle cx="52" cy="18" r="7"/><rect x="47" y="26" width="10" height="18" rx="4"/><circle cx="68" cy="26" r="7"/><rect x="63" y="34" width="10" height="18" rx="4"/></g><path d="M6 60h72" stroke="#C9B48A" stroke-width="2"/>'),
 'sb': _svg('<g fill="none" stroke="#7A4E25" stroke-width="2"><rect x="28" y="4" width="28" height="14"/><rect x="28" y="18" width="14" height="14"/><rect x="42" y="18" width="14" height="14"/><rect x="28" y="32" width="28" height="14"/><rect x="28" y="46" width="28" height="18"/></g><ellipse cx="49" cy="25" rx="5" ry="3" fill="#8A8A8A"/>'),
}
# 261122 손놀이 칸 = 이모지 손 (대표 확정)
def _em(t, n): return '<span class="pic em n%d" aria-hidden="true">%s</span>' % (n, t)
NEW_PICS.update({'rp': _em('✌️✊✋',3), 'hj': _em('🤲',1), 'mj': _em('👊✌️✋',3), 'br': _em('🤲👊',2)})
NEW_PICS.update({'aw': _em('💪',1), 'yt': _svg('<g fill="#E8C98E"><rect x="22" y="8" width="11" height="52" rx="5.5"/><rect x="37" y="8" width="11" height="52" rx="5.5" fill="#F0CB8A"/><rect x="52" y="8" width="11" height="52" rx="5.5"/></g>')})
NAMES = {'jg':'제기차기','gg':'공기놀이','aw':'팔씨름','yt':'엿치기','rp':'가위바위보','hj':'구슬 홀짝','mj':'묵찌빠','br':'쌀보리','mg':'무궁화 꽃이 피었습니다','yn':'윷놀이','sg':'수건돌리기','db':'다방구','sb':'사방치기','bn':'번데기 돌림판','ru':'운동회 달리기','bk':'박 터뜨리기','gm':'고무줄놀이','gr':'굴렁쇠','gl':'공 굴리기'}
SHORT = {'mg':'무궁화꽃','bn':'번데기 뽑기','ru':'운동회 달리기'}
# 새 혼자 놀이 (261123): 제기차기 · 공기놀이 그림 — 면 색만, 선 · 그림자 없음
NEW_PICS['jg']=_svg('<g><rect x="30" y="6" width="7" height="34" rx="3.5" fill="#FFC21A" transform="rotate(-10 33 40)"/><rect x="38" y="4" width="7" height="36" rx="3.5" fill="#2E9E4F"/><rect x="46" y="6" width="7" height="34" rx="3.5" fill="#2F64E0" transform="rotate(10 50 40)"/></g><ellipse cx="42" cy="46" rx="15" ry="8" fill="#B98A3E"/><rect x="38" y="42" width="8" height="6" fill="#7A5A24"/><rect x="28" y="60" width="28" height="6" rx="3" fill="#3B3F4A"/>')
NEW_PICS['gg']=_svg('<ellipse cx="42" cy="12" rx="8" ry="7" fill="#8A5A36"/><rect x="6" y="40" width="72" height="26" rx="8" fill="#F3E6C8"/><g fill="#C98A5A"><ellipse cx="20" cy="52" rx="8" ry="7"/><ellipse cx="36" cy="58" rx="8" ry="7"/><ellipse cx="52" cy="50" rx="8" ry="7"/><ellipse cx="66" cy="58" rx="8" ry="7"/></g><path d="M42 22v12" stroke="#C9B48A" stroke-width="2" stroke-dasharray="3 3"/>')

# 윷놀이 칸 그림 (261123): 면 색만(선 · 그림자 없음) — 납작한 면(연한 색 · 가로 무늬) 둘 · 둥근 등(진한 색) 둘
NEW_PICS['yn']=_svg('<g><rect x="12" y="8" width="11" height="52" rx="5.5" fill="#B98A4E"/><rect x="28" y="8" width="11" height="52" rx="5.5" fill="#F3DFB4"/><rect x="45" y="8" width="11" height="52" rx="5.5" fill="#B98A4E"/><rect x="61" y="8" width="11" height="52" rx="5.5" fill="#F3DFB4"/></g><g fill="#B98A4E"><rect x="28" y="22" width="11" height="2.5"/><rect x="28" y="44" width="11" height="2.5"/><rect x="61" y="22" width="11" height="2.5"/><rect x="61" y="44" width="11" height="2.5"/></g>')

# 번데기 돌림판 칸 그림 (261124): 나무판 · 미색 칸 · 못 바늘 — 화려하지 않게
NEW_PICS['bn']=_svg('<circle cx="42" cy="36" r="31" fill="#B98A4E"/><path d="M42 36L42.0 9.0A27 27 0 0 1 62.7 18.6Z" fill="#E3DACB"/><path d="M42 36L62.7 18.6A27 27 0 0 1 68.9 38.4Z" fill="#F6ECD6"/><path d="M42 36L68.9 38.4A27 27 0 0 1 64.1 51.5Z" fill="#EBD7AE"/><path d="M42 36L64.1 51.5A27 27 0 0 1 60.4 55.7Z" fill="#F6ECD6"/><path d="M42 36L60.4 55.7A27 27 0 0 1 38.7 62.8Z" fill="#E3DACB"/><path d="M42 36L38.7 62.8A27 27 0 0 1 28.1 59.1Z" fill="#F6ECD6"/><path d="M42 36L28.1 59.1A27 27 0 0 1 15.8 42.5Z" fill="#EBD7AE"/><path d="M42 36L15.8 42.5A27 27 0 0 1 20.2 20.1Z" fill="#E3DACB"/><path d="M42 36L20.2 20.1A27 27 0 0 1 31.0 11.3Z" fill="#EBD7AE"/><path d="M42 36L31.0 11.3A27 27 0 0 1 36.4 9.6Z" fill="#F6ECD6"/><path d="M42 36L36.4 9.6A27 27 0 0 1 42.0 9.0Z" fill="#EBD7AE"/><circle cx="42" cy="36" r="4" fill="#55493C"/><rect x="39" y="0" width="6" height="9" rx="2" fill="#55493C"/><rect x="41" y="6" width="2" height="10" fill="#3B3229"/>')
NEW_PICS['ru']=_svg('<rect x="0" y="50" width="84" height="22" fill="#E4CFA6"/><path d="M70 18v42" stroke="#fff" stroke-width="3"/><g transform="translate(38 10)"><path d="M0 32L-9 46M0 32L10 44" stroke="#F0C79A" stroke-width="5" stroke-linecap="round"/><rect x="-8" y="25" width="16" height="9" rx="3" fill="#2A3A66"/><rect x="-8" y="10" width="16" height="18" rx="5" fill="#FBF8F1"/><path d="M-7 14l-8 7M7 14l7-8" stroke="#F0C79A" stroke-width="4.5" stroke-linecap="round"/><circle cx="0" cy="2" r="8" fill="#F6C99B"/><path d="M-8 -.5h16M-8 -.5l-8 4" stroke="#2F64E0" stroke-width="4" stroke-linecap="round"/></g>')

# 고무줄놀이 칸 그림 (261125): 노란 고무줄 · 뛰는 아이 · 면 색만
NEW_PICS['gm']=_svg('<rect x="0" y="58" width="84" height="14" fill="#E4CFA6"/><path d="M6 46Q42 52 78 46" stroke="#E7B23B" stroke-width="3.5" fill="none" stroke-linecap="round"/><g transform="translate(42 8)"><path d="M-4 30L-11 40M4 30L10 36" stroke="#F0C79A" stroke-width="4.5" stroke-linecap="round"/><path d="M-9 30L0 12L9 30Z" fill="#2F64E0"/><path d="M-5 14l-9-8M5 14l9-8" stroke="#F0C79A" stroke-width="4" stroke-linecap="round"/><circle cx="0" cy="3" r="7" fill="#F6C99B"/><path d="M-7 0q7-9 14 0" fill="#3B3229"/></g><rect x="2" y="40" width="5" height="18" rx="2.5" fill="#8C7B5C"/><rect x="77" y="40" width="5" height="18" rx="2.5" fill="#8C7B5C"/>')
# 굴렁쇠 칸 그림 (261125): 흙 골목 · 쇠 테 · 나무 채 · 아이 — 면 색만 · 선 굵기만
NEW_PICS['gr']=_svg('<rect x="0" y="58" width="84" height="14" fill="#E4CFA6"/><circle cx="54" cy="40" r="17" fill="none" stroke="#6E7680" stroke-width="4"/><path d="M30 30L40 50" stroke="#7A5A24" stroke-width="3" stroke-linecap="round"/><g transform="translate(22 10)"><path d="M-3 30L-8 46M3 30L7 45" stroke="#F0C79A" stroke-width="4.5" stroke-linecap="round"/><rect x="-7" y="10" width="14" height="22" rx="5" fill="#2F64E0"/><path d="M5 15l8 7" stroke="#F0C79A" stroke-width="4" stroke-linecap="round"/><circle cx="1" cy="3" r="7" fill="#F6C99B"/><path d="M-6 0q7-9 14 0" fill="#3B3229"/></g>')
# 공 굴리기 칸 그림 (261125): 흙 운동장 · 흰 줄 · 큰 파란 공 · 뒤에서 미는 아이 — 면 색만 · 선 · 그림자 없음
NEW_PICS['gl']=_svg('<rect x="0" y="0" width="84" height="72" fill="#E4CFA6"/><rect x="8" y="0" width="3" height="72" fill="#fff"/><rect x="73" y="0" width="3" height="72" fill="#fff"/><circle cx="42" cy="26" r="20" fill="#2F64E0"/><rect x="22" y="23" width="40" height="5" fill="#fff" opacity=".55"/><g transform="translate(42 44)"><path d="M-8 8L-12 -2M8 8L12 -2" stroke="#F0C79A" stroke-width="4.5" stroke-linecap="round"/><rect x="-9" y="6" width="18" height="15" rx="5" fill="#FBF8F1"/><circle cx="0" cy="10" r="6.5" fill="#3B3229"/><path d="M-6.5 8h13" stroke="#2F64E0" stroke-width="3"/><path d="M-4 21v7M4 21v7" stroke="#F0C79A" stroke-width="4.5" stroke-linecap="round"/></g>')
# 박 터뜨리기 칸 그림 (261125): 장대 · 박(미색 · 청군 띠) · 갈라진 금 · 오재미 — 면 색만 · 빨간 원 금지
NEW_PICS['bk']=_svg('<rect x="40" y="16" width="4" height="52" rx="2" fill="#9C7A4E"/><path d="M42 4A15 15 0 0 0 42 34Z" fill="#F7EFDD"/><path d="M42 4A15 15 0 0 1 42 34Z" fill="#F2E8D2"/><rect x="27.5" y="15" width="29" height="5" fill="#2F64E0"/><path d="M40 6l3 7-3 6M43 22l-3 6 2 5" stroke="#6B5A42" stroke-width="1.6" fill="none" stroke-linecap="round"/><rect x="12" y="52" width="10" height="10" rx="3" fill="#2F64E0" transform="rotate(-15 17 57)"/><rect x="62" y="56" width="10" height="10" rx="3" fill="#8C7B5C" transform="rotate(12 67 61)"/><rect x="20" y="36" width="9" height="9" rx="3" fill="#2F64E0" transform="rotate(20 24 40)"/>')

def restructure(scr):
    # 지금 칸(그림) 모으기 — 「새」 표시는 뺌
    tiles = {}
    for m in re.finditer(r'<button class="g" type="button" data-s="(\w+)" data-go="(\w+)">(.*?)</button>', scr, re.S):
        inner = re.sub(r'<span class="new">새</span>\s*', '', m.group(3))
        tiles[m.group(2)] = '<button class="g" type="button" data-s="%s" data-go="%s">%s</button>' % (m.group(1), m.group(2), inner.strip())
    def newt(k):
        return '<button class="g" type="button" data-go="%s">%s<b>%s</b></button>' % (k, NEW_PICS[k], SHORT.get(k, NAMES[k]))
    def soon(k):
        return '<button class="g soon" type="button" data-soon="1" aria-label="%s · 준비 중">%s<b>%s</b><small>준비 중</small></button>' % (NAMES[k], NEW_PICS[k], SHORT.get(k, NAMES[k]))
    def sec(title, sub, items):
        return ('<section class="grp"><h2>%s<small>%s</small></h2><div class="games">' % (title, sub)) + ''.join(items) + '</div></section>'
    body = ('<div class="body">'
      '<p class="lure"><b class="shopN">다복</b>에서 준비한 <b>푸짐한 선물</b> 받아가세요</p><p class="eduN">교육 시간 연습 판이에요 · 선물 없이 함께 놀아요</p>'
      + sec('혼자서 바로', '사장님과 한 판', [newt('rp'), newt('hj'), newt('mj'), newt('br'), newt('aw'), newt('yt'), tiles['dt'], tiles['th'], tiles['pt'], tiles['bw'], newt('jg'), newt('gg'), newt('mg'), newt('bn'), newt('ru'), newt('gm'), newt('gr'), newt('gl')])
      + sec('둘이서 겨루기', '폰 하나로 번갈아', [tiles['om'], tiles['ak'], tiles['tk'], tiles['rd'], tiles['mb'], newt('yn')])
      + sec('여럿이 함께', '폰 하나로 돌려 가며', [newt('sb'), newt('sg'), newt('bk')])
      + '<script>/* 261123 대표 지적: 손 그림 칸이 한데 몰림 → 열 때마다 칸 섞기 · 닮은 그림 칸끼리 옆·위아래로 붙지 않게 · 「준비 중」은 맨 끝 */(function(){var L={rp:\'h\',hj:\'h\',mj:\'h\',br:\'h\',aw:\'h\',dt:\'t\',bw:\'t\',bn:\'t\',om:\'s\',ak:\'s\',tk:\'d\',rd:\'d\',ru:\'u\',gm:\'u\',gr:\'u\',gl:\'u\'},C=3;function lk(b){return L[b.getAttribute(\'data-go\')]||b.getAttribute(\'data-go\')||\'x\';}function ok(a){for(var i=0;i<a.length;i++){var k=lk(a[i]);if(i%C<C-1&&i+1<a.length&&lk(a[i+1])===k)return false;if(i+C<a.length&&lk(a[i+C])===k)return false;}return true;}function mix(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t;}return a;}var gs=document.querySelectorAll(\'.grp .games\');for(var g=0;g<gs.length;g++){var box=gs[g],all=[].slice.call(box.children),on=[],off=[];for(var i=0;i<all.length;i++){(all[i].classList.contains(\'soon\')?off:on).push(all[i]);}var a=on.slice();for(var n=0;n<3000;n++){mix(a);if(ok(a))break;}if(!ok(a))a=on;a=a.concat(off);for(var i=0;i<a.length;i++)box.appendChild(a[i]);}})();</script>'
      + '@@ROOM@@'
      + '<div class="fam-h">함께하는 곳</div>@@FAM@@'
      + '<p class="fuse"><a href="https://www.loveflow.ai.kr/use/#p" target="_blank" rel="noopener">사랑흐름 서비스 이용 ›</a></p>'  # 261126 사랑흐름 총괄 47번 · 놀이 22번 v1.1
      + '<p class="own"><button type="button" data-own="admin">사장님 관리자 창</button><span>·</span><button type="button" data-own="home">홈 화면에 추가</button></p>'
      + '</div><div id="lfFoot" data-refund="0"></div>'
      + '<nav class="fbar" aria-label="아래 막대"><div>'
        '<button type="button" id="fGift"><svg viewBox="0 0 24 24"><rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M2.5 9h19V6h-19zM12 6v14"/></svg>내 선물함</button>'
        '<button type="button" id="fHome" class="home" aria-label="맨 위로"><svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7M6 9.5V20h12V9.5M10 20v-6h4v6"/></svg></button>'
        '<button type="button" id="fShare"><svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.4M8.3 13.2l7.4 4.4"/></svg>공유하기</button>'
        '</div></nav>')
    room = re.search(r'<a class="room".*?</a>', scr, re.S).group(0)
    # 디자인 A (261122): 이야기방 칸 = 그림 칸 · 두 줄 · 오른쪽 ›
    href = re.search(r'href="([^"]+)"', room).group(1)
    room = ('<a class="room" href="%s" target="_blank" rel="noopener"><span class="ri" aria-hidden="true">📖</span>'
            '<span class="rt"><b><span class="shopN">다복</span> 이야기방</b><small>오늘 놀이 추억을 남겨요</small></span><span class="rv" aria-hidden="true">›</span></a>') % href
    fam = re.search(r'<div class="fam">.*?</div>', scr, re.S).group(0)
    # 261125 대표: 함께하는 곳은 사랑흐름이 메인이라 항상 먼저 (016 원본에서 가져온 뒤 순서만 바꿈)
    fa = re.findall(r'<a [^>]*>.*?</a>', fam, re.S)
    fa.sort(key=lambda x: 0 if 'loveflow.ai.kr' in x else 1)
    fam = '<div class="fam">\n              ' + '\n              '.join(fa) + '\n            </div>'
    body = body.replace('@@ROOM@@', room).replace('@@FAM@@', fam)
    a = scr.index('<div class="body">')
    head = scr[:a]
    head = head.replace('<span class="ttl">다복</span>', '<span class="ttl">그때 <i>그</i> 놀이</span>')
    return head + body + '\n'

HOME_CSS = '''
/* ★첫째 원칙 (대표 261122): 놀이는 복고여도 화면은 산만하지 않게 — 테두리 · 음영 없음 */
button,.btn,.bt,.pk,.pick button,.say,.vs div,.vs .p,.hb,.act .spd,.rl,.card,.room,.fam a,.tabs button,.half,.two button,.set select,.shopset input,.shopset select,.sheet,.done,.cap2,.box{box-shadow:none!important;border:0!important;text-shadow:none!important}
.pick button,.pk,.hb,.half,.two button,.bt.o,.act .spd{background:#EFEAE0!important}
.say,.rl{background:#fff!important}
.vs div,.vs .p{background:#fff!important}
button:active{filter:brightness(.93)}
.bt.o[aria-pressed=true]{background:#FFC21A!important}

/* ── 첫 화면 새 배치 (표준 v1 · 261122) ── */
.top .ttl{font-family:var(--brand),serif;font-size:23px;letter-spacing:.05em}
.top .ttl i{font-style:normal;color:var(--yel)}
.body{gap:8px!important;padding:12px 12px 0!important}
.lure{margin:2px 0 4px!important;font-size:18px!important}
.grp{display:flex;flex-direction:column;gap:8px;margin-top:6px}
.grp h2{margin:0 2px;display:flex;align-items:baseline;gap:8px;font-family:var(--sign),var(--body);font-weight:400;font-size:19px;letter-spacing:.03em;color:#16181D}
.grp h2 small{font-family:var(--body);font-size:12.5px;font-weight:700;color:var(--muted);letter-spacing:0}
.games{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:8px!important}
.g{padding:8px 4px 9px!important;border-radius:16px!important;min-height:104px}
.g svg.pic,.g .fan{width:72px!important;height:58px!important}
.g .fan span{left:15px!important;top:5px!important;width:40px!important;height:40px!important}
.g b{font-size:13.5px!important;line-height:1.2;text-align:center;word-break:keep-all}
.g.soon{background:#F4F2EC!important;box-shadow:inset 0 0 0 1.5px #E2DDD0;border:0}
.g.soon svg.pic{opacity:.45;filter:grayscale(.6)}
.g .em{width:72px;height:58px;display:flex;align-items:center;justify-content:center;line-height:1;font-family:"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif}.g .em.n1{font-size:44px}.g .em.n2{font-size:32px}.g .em.n3{font-size:23px;letter-spacing:-1px}
.g.soon b{color:#8A8272}
.g.soon small{font-size:10.5px;font-weight:800;color:#A39A86}
.fam-h{text-align:center;font-size:12px;font-weight:800;color:var(--muted);margin-top:6px}
.room{margin-top:8px;border:0!important;background:#EFEAE0!important}
.fam a{border:0!important;background:#EFEAE0!important}
.fam .ar{display:none!important}
#lfFoot{margin-top:10px}
.app{padding-bottom:calc(74px + env(safe-area-inset-bottom,0px))}
.fbar{position:fixed;left:0;right:0;bottom:0;z-index:15;display:flex;justify-content:center;background:rgba(22,24,29,.96);padding:8px 10px calc(8px + env(safe-area-inset-bottom,0px))}
.fbar>div{width:100%;max-width:480px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.fbar button{font:inherit;font-family:"Noto Sans KR",system-ui,sans-serif;font-size:14px;font-weight:800;color:#fff;background:rgba(255,255,255,.1);border:0;border-radius:12px;min-height:48px;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer}
.fbar button svg{width:18px;height:18px;fill:none;stroke:#FFC21A;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
.fbar button.home{background:#FFC21A;color:#16181D;font-size:16px}
.fbar button.home svg{stroke:#16181D}

'''

# ══ 디자인 A (대표 확정 261122 22:26 · 22:47) — 밝은 크림 · 진한 노랑 머리 막대(#FFC93C) · 오른쪽 위 「🔈 소리」 · 아래 막대 밝게 ══
HOME_CSS += '''
html,body{background:#E6E1D7}
.app{background:#FFF8E6;color:#1C1D21}
.top{position:sticky;height:48px;background:#FFC93C!important;color:#1C1D21;justify-content:center;padding:0 10px}
.top::after{display:none!important}
.top .logo,.top .burger,.top #sndslot{display:none!important}
.top .ttl{flex:none;font-family:var(--brand),serif;font-size:21px;letter-spacing:.02em;color:#1C1D21}
.top .ttl i{color:#1C1D21}
.top .topr{position:absolute;right:8px;top:calc(7px + env(safe-area-inset-top,0px))}
/* 흐르는 선물 띠 — 대표 261123: 「푸짐한 선물」 띠가 있어야 효과가 있다 → A 색으로 되살림(내용은 관리자 선물 설정에서 자동) */
.mq{display:flex!important;margin:0!important;height:32px!important;background:#FFF1C7!important;position:sticky;top:48px;z-index:4}
.mq-in{animation:flow 24s linear infinite!important;padding-left:100%!important}
.mq span{font-size:13px!important;color:#6A4D00!important;font-weight:600}
.mq b{color:#C23434!important}
.mq .tag{background:#E04848!important;color:#fff!important;border-radius:999px!important;padding:2px 9px!important}
@media (prefers-reduced-motion:reduce){.mq-in{animation:none!important;padding-left:0!important}}
.body{padding:4px 14px 0!important;gap:0!important}
.lure{font-family:var(--body)!important;font-size:15px!important;font-weight:700;color:#1C1D21!important;margin:12px 0 4px!important;letter-spacing:0}
.lure b{font-weight:700!important;color:#E04848!important}.lure b.shopN{color:#1C1D21!important}
.grp{margin-top:12px;gap:8px}
.grp h2{font-family:var(--body);font-weight:800;font-size:15px;letter-spacing:0;color:#1C1D21}
.grp h2 small{font-size:11.5px;color:#7A6E55}
.g{background:#fff!important;border-radius:16px!important;min-height:96px;padding:8px 4px 9px!important;justify-content:center}
.g b{font-weight:800!important;font-size:13px!important;color:#1C1D21}
.g.soon{background:#fff!important;box-shadow:none!important;opacity:.5}
.g.soon svg.pic{opacity:1;filter:grayscale(.5)}
.g.soon b{color:#7A6E55}.g.soon small{color:#9A8E70}
.room{display:flex!important;align-items:center;gap:10px;margin:16px 0 0!important;padding:12px!important;min-height:0;border-radius:16px;background:#fff!important;color:#1C1D21;text-decoration:none}
.room .ri{width:38px;height:38px;border-radius:12px;background:#FFF1C7;display:flex;align-items:center;justify-content:center;font-size:20px;flex:none}
.room .rt b{display:block;font-size:14px;font-weight:800}.room .rt small{display:block;font-size:11.5px;color:#7A6E55;font-weight:600}
.room .rv{margin-left:auto;font-size:22px;color:#7A6E55}
.fam-h{margin-top:16px!important;font-size:12px;color:#7A6E55}
.fam{margin-top:8px}
.fam a{background:#F2EBDB!important;color:#1C1D21;font-weight:800;font-size:12.5px;padding:6px 12px 6px 8px}
.own{display:flex;justify-content:center;align-items:center;gap:6px;margin:14px 0 2px;font-size:11.5px;color:#B3A889}
.own button{border:0;background:none;padding:6px 2px;font:700 11.5px var(--body);color:#9A8E70;cursor:pointer}
#lfFoot{margin:14px -14px 0!important}
.app{padding-bottom:calc(62px + env(safe-area-inset-bottom,0px))}
.fbar{background:#fff;padding:6px 8px calc(8px + env(safe-area-inset-bottom,0px))}
.fbar>div{grid-template-columns:1fr 1.15fr 1fr;gap:8px}
.fbar button{background:transparent;color:#7A6E55;font-size:11.5px;flex-direction:column;gap:2px;min-height:48px;border-radius:12px}
.fbar button svg{width:21px;height:21px;stroke:currentColor;stroke-width:2}
.fbar button.home{background:#FFC21A;color:#1C1D21}
.fbar button.home svg{width:26px;height:26px;stroke:#1C1D21}
.toast{background:rgba(28,29,33,.88)}
'''

# 통합 표준 v0.2 (대표 승인 261124 · 가 안) — 첫 화면 CSS 맨 끝에 붙음(build017)
V02_HOME = '''
/* 통합 표준 v0.2 화면 틀 색 · 누르는 곳 48 (대표 승인 261124 · 가 안) — 흐르는 「푸짐한 선물」 띠 · 놀이 칸 그림은 그대로 */
html,body,.app,.body{background:#FFFCF7!important}
.top{background:#1E4A76!important;color:#fff!important}.top .ttl,.top .ttl i{color:#fff!important}.top button{background:rgba(255,255,255,.14)!important;color:#fff!important}.top .snd,.na-snd{position:relative}.top .snd::before,.na-snd::before{content:"";position:absolute;left:-4px;right:-4px;top:-7px;bottom:-7px}
.lure{color:#2E3A46!important}.lure b{color:#7A3520!important}.lure b.shopN{color:#2E3A46!important}
.grp h2{color:#2E3A46!important}.grp h2 small{color:#4A525C!important}.g b{color:#2E3A46!important}
.fbar{background:#1E4A76!important}.fbar button{color:#fff!important}.fbar button svg{stroke:#C9A96E!important}.fbar .home{background:#C9A96E!important;color:#1E4A76!important}.fbar .home svg{stroke:#1E4A76!important}
.fam a,.own button{min-height:48px!important;display:inline-flex!important;align-items:center;justify-content:center}
/* 261126 사랑흐름 서비스 이용 입구 한 줄 (총괄 47번) — 글자 링크 · 누르는 곳 48 · 교육용에서는 감춤 */
.fuse{margin:6px 0 0;text-align:center}.fuse a{display:inline-flex;align-items:center;min-height:48px;padding:0 10px;font-size:13.5px;font-weight:800;color:#1E4A76;text-decoration:none}.edu .fuse{display:none!important}
/* 교육용 주소 /nori/?edu=1 (사랑흐름-총괄-019 · 놀이-총괄-007 · 대표 261125 15:43 진행): 선물 띠 · 선물 문구 · 내 선물함 감춤(아래 띠 가운데 맞춤은 그대로) · 판 기록 안 남김 */
.eduN{display:none}.edu .eduN{display:block;margin:12px 0 4px;text-align:center;font-size:15px;font-weight:700;color:#2E3A46}.edu .mq,.edu .lure{display:none!important}.edu #fGift{visibility:hidden}
/* 흐르는 「푸짐한 선물」 띠: 띠는 그대로 · 색만 v0.2 (대표 결정 261125 14:47 · 사랑흐름-놀이-004) */
.mq{background:#F4EEE4!important}.mq .tag{background:#7A3520!important;color:#fff!important}
'''
