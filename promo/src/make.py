N='node_modules/@fontsource'
O='#E8771E'; K='#2E2A24'; S='#6B6357'; CR='#FBF7F0'
BAND="linear-gradient(90deg,#2E8B57,#5FA14A 35%,#C9B43A 70%,#E8771E)"
links=''.join(f'<link rel="stylesheet" href="{N}/{f}">' for f in ['nanum-myeongjo/700.css','nanum-myeongjo/800.css','gowun-dodum/400.css'])
M=4  # px per mm
def mm(x): return f'{x*M}px'
logo=lambda w,fs: (f'<div style="display:flex;align-items:center;gap:{w*0.18}px;justify-content:center"><img src="emblem_t.png" style="width:{w}px">'
                    f'<div style="text-align:left"><div style="font-family:\'Noto Sans CJK KR\';font-weight:700;color:{O};font-size:{fs}px;line-height:1.1">사랑흐름</div>'
                    f'<div style="font-size:{fs*0.45}px;letter-spacing:{fs*0.2}px;color:{O};opacity:.85">LOVE FLOW</div></div></div>')
qr=lambda src,w: f'<div style="background:#fff;border:1px solid #EADFCB;border-radius:{w*0.06}px;padding:{w*0.05}px;display:inline-block"><img src="{src}" style="width:{w}px;display:block"></div>'
myeong="font-family:'Nanum Myeongjo';font-weight:800;color:"+K
P={}
# ① 원형 50mm
P['1_원형_50mm']=f'''<div class="p" style="width:{mm(50)};height:{mm(50)};border-radius:50%;background:{BAND};padding:{mm(1.6)};box-sizing:border-box">
<div style="width:100%;height:100%;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:{mm(1.6)}">
{logo(30,15)}{qr('qr_ad.png',mm(19).replace('px','') and 76)}
<div style="font-size:10.5px;color:{K};text-align:center;line-height:1.35">가장 소중한 사람을<br>더 알아가는 시간</div></div></div>'''
# ② 사각 60mm — 마음 한마디
P['2_사각_60mm_마음한마디']=f'''<div class="p" style="width:{mm(60)};height:{mm(60)};background:{CR};border-radius:{mm(3)};position:relative;overflow:hidden;text-align:center">
<div style="padding:{mm(5)} {mm(4)} 0;{myeong};font-size:15px;line-height:1.5">그 사람의 마음에는,<br>아직 닿지 못한 말이 있습니다.</div>
<div style="margin-top:{mm(3)}">{qr('qr_hm.png',92)}</div>
<div style="margin-top:{mm(2)};font-size:12px;color:{O};font-weight:700">찍어서 마음 한마디 전하기</div>
<div style="position:absolute;left:0;right:0;bottom:0;height:{mm(7)};background:{BAND};display:flex;align-items:center;justify-content:center;gap:6px;color:#fff;font-size:11px">
<img src="emblem_t.png" style="width:16px;filter:brightness(0) invert(1)"><b style="font-family:'Noto Sans CJK KR'">사랑흐름</b></div></div>'''
# ③ 띠 90×30
P['3_띠_90x30mm']=f'''<div class="p" style="width:{mm(90)};height:{mm(30)};background:#fff;border-radius:{mm(2)};position:relative;overflow:hidden;display:flex;align-items:center;padding:0 {mm(4)};box-sizing:border-box;gap:{mm(3)}">
<img src="emblem_t.png" style="width:52px">
<div style="flex:1"><div style="font-family:'Noto Sans CJK KR';font-weight:700;color:{O};font-size:19px">사랑흐름</div>
<div style="font-size:11.5px;white-space:nowrap;color:{K};margin-top:3px">가장 소중한 사람을 더 알아가는 시간</div></div>
{qr('qr_ad.png',72)}
<div style="position:absolute;left:0;right:0;bottom:0;height:{mm(2)};background:{BAND}"></div></div>'''
# ④ 책갈피 50×150
P['4_책갈피_50x150mm']=f'''<div class="p" style="width:{mm(50)};height:{mm(150)};background:{CR};border-radius:{mm(2)};position:relative;overflow:hidden;text-align:center">
<div style="height:{mm(3)};background:{BAND}"></div>
<div style="margin-top:{mm(8)}">{logo(30,15)}</div>
<div style="margin-top:{mm(14)};{myeong};font-size:21px;line-height:1.8">우리의<br>관계는<br>이미<br>시작되었습니다</div>
<div style="margin:{mm(8)} auto 0;width:{mm(30)};height:1px;background:#E2D6C2"></div>
<div style="margin-top:{mm(6)};font-size:11.5px;color:{S};line-height:1.7">마음을 묻고,<br>이야기를 듣고,<br>기록으로 남깁니다</div>
<div style="position:absolute;left:0;right:0;bottom:{mm(9)}">{qr('qr_ad.png',84)}<div style="font-size:10px;color:{O};margin-top:4px">www.loveflow.ai.kr</div></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:{mm(3)};background:{BAND}"></div></div>'''
# ⑤ LD 개인 스티커 60×40
P['5_LD개인_60x40mm']=f'''<div class="p" style="width:{mm(60)};height:{mm(40)};background:#fff;border-radius:{mm(2)};position:relative;overflow:hidden;display:flex;align-items:center;padding:0 {mm(3.5)};box-sizing:border-box;gap:{mm(3)}">
<div style="flex:1">{logo(24,13).replace('justify-content:center','justify-content:flex-start')}
<div style="margin-top:{mm(3)};font-size:10px;color:{O}">사랑흐름 안내자(LD)</div>
<div style="{myeong};font-size:19px;letter-spacing:3px;margin-top:1px">○○○</div>
<div style="font-size:9.5px;color:{S};margin-top:3px">찍으시면 저와 이어집니다</div></div>
{qr('qr_ld.png',76)}
<div style="position:absolute;left:0;right:0;bottom:0;height:{mm(2)};background:{BAND}"></div></div>'''
# ⑥ A4 포스터 (210×297 → 절반 축척)
h=0.5
P['6_포스터_A4']=f'''<div class="p" style="width:{210*M*h}px;height:{297*M*h}px;background:{CR};position:relative;overflow:hidden;text-align:center">
<div style="height:14px;background:{BAND}"></div>
<div style="margin-top:24px">{logo(42,20)}</div>
<div style="margin-top:24px;{myeong};font-size:28px;line-height:1.55">가장 소중한 사람을<br>더 알아가는 시간</div>
<div style="margin-top:18px;font-size:14px;color:{S}">마음을 묻고, 이야기를 듣고, 기록으로 남깁니다</div>
<div style="display:flex;justify-content:center;gap:14px;margin-top:18px">
{''.join(f'<div style="width:70px;height:70px;border-radius:50%;background:#fff;border:2px solid {c};display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;color:{K};font-family:Noto Sans CJK KR">{t}</div>' for t,c in (('묻기','#5FA14A'),('듣기','#C9B43A'),('남기기',O)))}</div>
<div style="margin-top:18px">{qr('qr_hm.png',104)}</div>
<div style="margin-top:10px;font-size:15px;color:{O};font-weight:700">휴대폰 카메라로 찍어 마음 한마디부터</div>
<div style="position:absolute;left:0;right:0;bottom:24px;font-size:11px;color:{S}">함께하는 곳 &nbsp;공공기관 · 기업 · 군부대 · 교육기관 · 복지기관<br><b style="color:{O}">www.loveflow.ai.kr</b></div>
<div style="position:absolute;left:0;right:0;bottom:0;height:14px;background:{BAND}"></div></div>'''
css="body{margin:0;background:#fff;font-family:'Gowun Dodum'} .wrap{display:inline-block;padding:10px}"
for k,v in P.items():
    open(f'{k}.html','w').write(f'<html><head>{links}<style>{css}</style></head><body><div class="wrap">{v}</div></body></html>')
# 모아 보기
cells=''.join(f'<div style="display:flex;flex-direction:column;align-items:center;gap:8px">{v}<div style="font-family:Noto Sans CJK KR;font-size:13px;color:#555">{k.replace("_"," ")}</div></div>' for k,v in P.items())
open('all.html','w').write(f'<html><head>{links}<style>body{{margin:0;background:#E9E5DD;padding:28px;font-family:\'Gowun Dodum\'}} .p{{box-shadow:0 3px 10px #0003}}</style></head><body><div style="display:flex;flex-wrap:wrap;gap:30px;align-items:flex-end;width:1500px">{cells}</div></body></html>')
print(list(P))
