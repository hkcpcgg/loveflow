# 그때 그 놀이 · 사용법 쪽 만들기 (261128) — 우리 이야기 /guide/ 꼴(번호 붙은 한 편 · 짧은 글 · 화면 그림 + 노란 말풍선)을 그대로 받아 씀
# 쓰는 법: (w 폴더에서) python3 test/guideshot.py && python3 mkguide.py [lab|live]  → loveflow/nori/lab/guide/ (또는 loveflow/nori/guide/)
import os, sys, glob
from PIL import Image
DEST = 'loveflow/nori/' + ('guide/' if len(sys.argv) > 1 and sys.argv[1] == 'live' else 'lab/guide/')
os.makedirs(DEST + 'img', exist_ok=True)
for f in sorted(glob.glob('shots/guide/*.png')):
    im = Image.open(f).convert('RGB'); w, h = im.size
    im.resize((560, round(h * 560 / w)), Image.LANCZOS).save(DEST + 'img/' + os.path.basename(f)[:-4] + '.jpg', quality=74, optimize=True)

LOOP_C = [('📱', '가게 QR을 찍어요'), ('🪀', '놀이를 골라요'), ('👆', '한 판 해요'), ('🖼️', '결과 사진을 받아요'), ('🎁', '선물 받기'), ('🙌', '직원에게 쿠폰')]
LOOP_O = [('💬', '문의하기'), ('🔗', '가게 주소 · QR 받기'), ('🎁', '선물 정하기'), ('📌', 'QR 붙이기'), ('📊', '손님 기록 보기')]
C = [
 ('가게 QR을 찍어요', '탁자나 벽에 붙은 「그때 그 놀이」 QR을 휴대폰 카메라로 비춰요.\n앱을 깔지 않아도 바로 열려요.\n첫 화면에서 놀이를 하나 골라 눌러요.', ['c1_home']),
 ('누구와 할지 골라요', '「다복 사장님과 한 판」은 가게 사장님과 겨뤄요.\n「친구와 같이 하기」는 폰 하나로 둘이 번갈아 해요.\n무엇을 걸지도 고를 수 있어요. 고른 뒤 「시작!」을 눌러요.', ['c2_ready', 'c2b_go']),
 ('한 판 해요', '화면에 반투명 손가락이 어디를 누를지 알려 줘요.\n누구 차례인지는 양옆 불빛으로 보여요.\n그 시절 이야기도 한 줄씩 나와요.', ['c3_play']),
 ('결과 사진을 받아요', '한 판이 끝나면 결과 카드가 나와요.\n「결과 사진 저장」으로 내 휴대폰에 남기고, 「공유하기」로 친구에게 보내요.\n떠오르는 사람이나 장소를 한 줄 적어 두면 사진에 함께 들어가요.', ['c4_card']),
 ('선물 받기', '결과 카드에서 「선물 받기」를 눌러요.\n이름이나 별명만 적어요. 전화번호는 받지 않아요.\n선물은 하루에 한 번 받을 수 있어요.', ['c5_gift', 'c6_name']),
 ('쿠폰을 직원에게 보여 줘요', '쿠폰 화면을 계산대 직원에게 보여 주면 선물을 드려요.\n받은 쿠폰은 ☰ 메뉴 「내 선물함」에 남아 있어요.', ['c7_coupon']),
 ('가게 이야기방에 남겨요', '첫 화면 「이야기방」 칸이나 결과 카드 「이야기방에 올리기」로 오늘 놀이 추억을 가게 이야기방에 남겨요.', ['c1b_room']),
]
O = [
 ('사랑흐름에 문의해요', '사랑흐름 서비스 이용에서 「개인 사업자 · 그때 그 놀이」의 「문의하기」를 누르면 카카오톡 상담으로 이어져요.\n가게 이름과 드릴 선물만 알려 주세요.', ['o1_use']),
 ('관리자 창을 열어요', '받은 가게 주소에서 ☰ 메뉴 「관리자 창 (사장님)」을 누르고 관리자 번호를 넣어요.', ['o2_menu']),
 ('선물을 정해요', '「선물 설정」에서 이기면 받는 선물 · 참가 선물 · 오늘의 특별 선물과 주는 조건을 골라요.', ['o3_gift']),
 ('QR 포스터를 붙여요', '「매장」에서 우리 가게 QR 포스터를 내려받아 탁자나 계산대에 붙여요.', ['o4_qr']),
 ('손님 기록을 봐요', '「손님 기록」에서 오늘 몇 분이 놀았는지, 선물을 몇 개 드렸는지 보고 직원 번호로 「전달 완료」를 눌러요.', ['o5_rec']),
]
def loop(items, color):
    return '<ol class="loop" style="--c:' + color + '">' + ''.join('<li><span class="ic">' + i + '</span><b>' + str(n + 1) + '</b><span class="lb">' + t + '</span></li>' for n, (i, t) in enumerate(items)) + '</ol>'
def arts(items, pre):
    out = []
    for n, (h, p, ims) in enumerate(items):
        out.append('<article id="' + pre + str(n + 1) + '"><h2><span class="no">' + str(n + 1) + '</span>' + h + '</h2><p>' + p + '</p><div class="ph' + (' two' if len(ims) > 1 else '') + '">' + ''.join('<img src="img/' + i + '.jpg" alt="' + h + ' 화면" loading="lazy" width="280">' for i in ims) + '</div></article>')
    return ''.join(out)
html = '''<!DOCTYPE html>
<!-- 그때 그 놀이 · 사용법 · mkguide.py 로 만듦 · 손으로 고치지 말고 mkguide.py 를 고쳐 다시 돌림 · 꼴은 우리 이야기 /guide/ 를 받아 씀 -->
<html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>그때 그 놀이 사용법</title><meta name="description" content="그때 그 놀이 사용법. 가게 QR 찍기, 놀이 고르기, 한 판, 결과 사진, 선물 받기, 쿠폰까지 그림으로 차근차근. 가게 사장님 사용법도 함께.">
<meta name="robots" content="noindex">
<style>*{box-sizing:border-box}body{margin:0;background:#fff;color:#1B1A1F;font:18px/1.75 -apple-system,BlinkMacSystemFont,'Apple SD Gothic Neo','Noto Sans KR','Malgun Gothic',sans-serif;word-break:keep-all}
a{color:#1E4A76}header{position:sticky;top:0;z-index:2;background:#16181D;color:#fff;display:flex;align-items:center;justify-content:center;padding:12px 16px;min-height:54px}
header b{font-size:19px;letter-spacing:-.01em}header a.back{position:absolute;left:12px;color:#FFC21A;text-decoration:none;font-weight:800;font-size:16px;padding:8px}
main{max-width:640px;margin:0 auto;padding:22px 16px 40px}h1{font-size:28px;line-height:1.35;margin:4px 0 6px;text-align:center}.lead{color:#4A525C;margin:0 0 18px;text-align:center}
.tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 22px}.tabs a{display:flex;align-items:center;justify-content:center;min-height:52px;border-radius:16px;background:#EFEAE0;color:#1B1A1F;text-decoration:none;font-weight:900;font-size:18px}
.tabs a.on{background:#16181D;color:#FFC21A}
section h2.sec{font-size:24px;margin:26px 0 12px;text-align:center}
.loop{list-style:none;margin:0 0 22px;padding:16px 10px;border-radius:20px;background:color-mix(in srgb,var(--c) 12%,#fff);display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px 6px;counter-reset:a}
.loop li{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px}
.loop .ic{width:68px;height:68px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-size:36px;line-height:1}
.loop b{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:var(--c);color:#fff;font-size:15px;margin-top:-18px}
.loop .lb{font-size:16px;font-weight:800;line-height:1.35}
article{border-radius:20px;padding:18px 16px 16px;margin:0 0 18px;background:#F7F5F0}article h2{font-size:21px;line-height:1.4;margin:0 0 8px}
article p{margin:0 0 10px;white-space:pre-line}.ph{display:flex;gap:8px;justify-content:center;margin:10px 0 0}.ph img{border-radius:14px;max-width:100%;height:auto;width:280px}
.ph.two img{width:calc(50% - 4px)}.no{display:inline-flex;align-items:center;justify-content:center;min-width:30px;height:30px;border-radius:15px;background:#E1262D;color:#fff;font-size:15px;margin-right:8px;vertical-align:2px}
#o .no{background:#1E4A76}
.go{display:flex;align-items:center;justify-content:center;min-height:56px;background:#E1262D;color:#fff;border-radius:18px;margin:24px 0 0;text-decoration:none;font-weight:900;font-size:19px}
.go.dark{background:#16181D;color:#FFC21A;margin-top:10px}
footer{text-align:center;color:#888;font-size:13px;padding:10px 0 30px}
@media(max-width:380px){.loop{grid-template-columns:repeat(2,minmax(0,1fr))}.ph.two{flex-direction:column;align-items:center}.ph.two img{width:280px}}</style></head>
<body><header><a class="back" href="../">‹ 놀이</a><b>그때 그 놀이 사용법</b></header><main>
<h1>휴대폰 하나로<br>그 시절 놀이 한 판</h1><p class="lead">처음 오셨다면 그림을 보며 한 편씩 따라 해 보세요.<br>노란 말풍선이 가리키는 곳을 누르면 돼요.</p>
<nav class="tabs"><a href="#c" class="on">손님 사용법</a><a href="#o">사장님 사용법</a></nav>
<section id="c"><h2 class="sec">손님 한 바퀴</h2>''' + loop(LOOP_C, '#E1262D') + arts(C, 'c') + '''</section>
<section id="o"><h2 class="sec">사장님 한 바퀴</h2>''' + loop(LOOP_O, '#1E4A76') + arts(O, 'o') + '''</section>
<a class="go" href="../">놀이하러 가기</a><a class="go dark" href="https://www.loveflow.ai.kr/use/#b-nori" target="_blank" rel="noopener">우리 가게에도 놀이 열기</a>
<footer>© 2026 사랑흐름 · LFRI™. 무단 복제 · 배포 · 상업적 이용 금지.<br>Unauthorized reproduction, distribution, or commercial use is prohibited.</footer></main>
<script>{var c=(location.search.match(/[?&]c=(\\d{3,4})/)||[])[1];if(c){document.querySelectorAll('a[href="../"]').forEach(function(a){a.href='../?c='+c;});}
var T=document.querySelectorAll('.tabs a');function on(){var h=location.hash==='#o'?'#o':'#c';T.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')===h);});}addEventListener('hashchange',on);on();}</script>
</body></html>'''
open(DEST + 'index.html', 'w', encoding='utf-8').write(html)
print('guide ok', DEST, len(html))
