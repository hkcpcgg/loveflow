/* ═══════════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/research.js · v4 · 261121 · [대표 261121 16:33 같은 뜻] % 숫자도 세어 올라가지 않고 처음부터 그 숫자로(세는 도중 91% 가 54% 로 읽힘) · 고리 움직임은 그대로.
   (이전) lf/research.js · v3 · 261121 · [대표 261121 16:33 「3:1 · 5:1 숫자가 다르게 보임」] 5:1(Gottman) 비율은 0에서 세어 올라가지 않고 처음부터 5:1 로 — 세어 올라가는 동안 3:1 처럼 다른 숫자로 읽히던 것 · 고리 움직임 · % 숫자 세기는 그대로.
   (이전) lf/research.js · v2 · 261118 · [735 · 대표 261118 16:51 「타이틀 · 내용에 맞게 · 알아서」] 상품 칸 머리글 영어(WHY A MAP 등) → 「관련 연구 · 학술 근거」(상품 다섯 · youth 포함). 그 밖 v1 그대로.
   (이전) lf/research.js · v1 · 261118 · [734 · 대표 OK 261118 15:33 「나머지 작업은 오케이」 · 시안 research_preview 261118]
   과학적 근거 한 부품 — 화면에 <div data-lf-research="main|memoir|set|map|life|youth"></div> 를 두고 이 파일을 부르면 그 자리에 그려짐.
     · main  = 메인 「과학적 근거」 칸 — 6월 홈 v14 모양 그대로(네이비 띠 · 누르면 다섯 축 카드 펼침 · 아이콘 다섯이 차례로 피어남).
               고친 것 둘 — 표현 축: 근거를 못 찾은 「Pennebaker 1997 · 34%」 → Slatcher & Pennebaker 2006(77% · 52%) /
               회복 축: 「유의미하게 상승」 → Chochinov 외 2005 실제 숫자(91% · 81%) · 「끝내 꺼내지 못한」 → 「아직 꺼내지 못한」.
     · 상품 다섯 = 「연구가 말하는 것」 숫자 카드 — 화면에 들어오면 숫자 · 둥근 띠가 0 에서 차오름(움직임을 꺼 둔 휴대폰은 바로 숫자).
   숫자 출처(원문 초록 확인 261118): Chochinov 외 2005 J Clin Oncol 23(24) · 100명 · 91/76/68/81% ·
     Pinquart & Forstmeier 2012 Aging Ment Health 16(5) · 128개 연구 · Pennebaker & Beall 1986 J Abnorm Psychol 95(3) · 나흘 15분 · 보건소 ·
     Slatcher & Pennebaker 2006 Psychol Sci 17(8) · 86쌍 · 77% / 52% · 청소년 셋은 이사회 32차 근거표 「확인」 줄.
   ※ 연구는 사랑흐름 자체가 아니라 같은 원리를 다룬 것 — 「이 원리 위에 설계했습니다」로만 씀 · 치료 · 효과 약속 문구 쓰지 않음.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.LFResearch) { return; }

  var CSS = ''
    + '.lfr{font-family:inherit;max-width:560px;margin:0 auto;box-sizing:border-box}.lfr *{box-sizing:border-box}'
    /* main — v14 */
    + '.lfr-sb{border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(10,22,43,.14);text-align:left}'
    + '.lfr-sh{background:linear-gradient(180deg,#16294A,#0A162B);color:#fff;padding:24px 22px;cursor:pointer;-webkit-tap-highlight-color:transparent}'
    + '.lfr-eye{font-size:11px;letter-spacing:.2em;color:#D4AF37;font-weight:700;text-align:center}'
    + '.lfr-tt{font-size:22px;font-weight:800;text-align:center;margin:8px 0 10px;display:flex;align-items:center;justify-content:center;gap:10px;color:#fff}'
    + '.lfr-ar{font-size:13px;color:#D4AF37;transition:.3s}.lfr-sb.open .lfr-ar{transform:rotate(180deg)}'
    + '.lfr-ds{font-size:13.5px;color:rgba(255,255,255,.82);text-align:center;line-height:1.7}'
    + '.lfr-x5{display:flex;justify-content:center;gap:10px;margin-top:14px}'
    + '.lfr-x5 span{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:18px;opacity:.55;transform:scale(.85);transition:.45s}'
    + '.lfr-sb.open .lfr-x5 span{opacity:1;transform:none;background:rgba(212,175,55,.18)}'
    + '.lfr-sb.open .lfr-x5 span:nth-child(2){transition-delay:.08s}.lfr-sb.open .lfr-x5 span:nth-child(3){transition-delay:.16s}.lfr-sb.open .lfr-x5 span:nth-child(4){transition-delay:.24s}.lfr-sb.open .lfr-x5 span:nth-child(5){transition-delay:.32s}'
    + '.lfr-bd{background:#fff;max-height:0;overflow:hidden;transition:max-height .5s ease}.lfr-sb.open .lfr-bd{max-height:2600px}'
    + '.lfr-bi{padding:18px 16px}'
    + '.lfr-it{border:1px solid #E2E8F0;border-radius:12px;padding:15px;margin-bottom:10px;opacity:0;transform:translateY(8px);transition:.45s}.lfr-it:last-child{margin-bottom:0}'
    + '.lfr-sb.open .lfr-it,.lfr-pk .lfr-it{opacity:1;transform:none}'
    + '.lfr-sb.open .lfr-it:nth-child(2){transition-delay:.1s}.lfr-sb.open .lfr-it:nth-child(3){transition-delay:.2s}.lfr-sb.open .lfr-it:nth-child(4){transition-delay:.3s}.lfr-sb.open .lfr-it:nth-child(5){transition-delay:.4s}'
    + '.lfr-ax{display:inline-block;font-size:10px;font-weight:800;letter-spacing:.08em;color:#fff;background:linear-gradient(135deg,#B8923E,#D4AF37);padding:4px 12px;border-radius:20px;margin-bottom:8px}'
    + '.lfr-au{font-size:15px;font-weight:700;color:#1E4A76;margin-bottom:6px}'
    + '.lfr-fd{font-size:13px;color:#4B5563;line-height:1.75;margin-bottom:8px}'
    + '.lfr-ap{font-size:12.5px;color:#1E4A76;line-height:1.6;font-weight:600}'
    /* 상품 칸 */
    + '.lfr-pk{border-radius:20px;overflow:hidden;color:#fff;padding:26px 18px 22px;text-align:center}'
    + '.lfr-pk.k-memoir{background:linear-gradient(170deg,#2B1650 0%,#3E2270 45%,#1D3D5C 100%);box-shadow:0 10px 30px rgba(43,22,80,.25)}'
    + '.lfr-pk.k-set{background:linear-gradient(170deg,#3A1838 0%,#5A2550 45%,#1F3550 100%);box-shadow:0 10px 30px rgba(58,24,56,.25)}'
    + '.lfr-pk.k-map{background:linear-gradient(170deg,#0F3B3A 0%,#155550 45%,#16294A 100%);box-shadow:0 10px 30px rgba(15,59,58,.25)}'
    + '.lfr-pk.k-life{background:linear-gradient(170deg,#3B1730 0%,#2B1650 50%,#16294A 100%);box-shadow:0 10px 30px rgba(59,23,48,.25)}'
    + '.lfr-pk.k-youth{background:linear-gradient(170deg,#123A5C 0%,#1F5C7A 45%,#1E3D2E 100%);box-shadow:0 10px 30px rgba(18,58,92,.25)}'
    + '.lfr-pe{font-size:11px;letter-spacing:.22em;color:#E6C978;font-weight:700}'
    + '.lfr-pt{font-size:23px;font-weight:800;margin:8px 0 6px;line-height:1.35;color:#fff}'
    + '.lfr-ps{font-size:13px;color:rgba(255,255,255,.8);line-height:1.7}'
    + '.lfr-hero{display:flex;flex-direction:column;align-items:center;margin:20px 0 6px}'
    + '.lfr-ring{position:relative;width:170px;height:170px}.lfr-ring svg{transform:rotate(-90deg);display:block}'
    + '.lfr-ring .n{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}'
    + '.lfr-ring .n b{font-size:46px;font-weight:900;color:#F3D58A;line-height:1}.lfr-ring .n small{font-size:12px;color:rgba(255,255,255,.75);margin-top:4px}'
    + '.lfr-hero p{font-size:14px;line-height:1.65;margin:12px 0 0;color:#fff}'
    + '.lfr-g{display:grid;gap:8px;margin-top:16px}.lfr-g.c3{grid-template-columns:repeat(3,1fr)}.lfr-g.c2{grid-template-columns:repeat(2,1fr)}'
    + '.lfr-g>div{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 6px}'
    + '.lfr-g b{display:block;font-size:26px;font-weight:900;color:#9FE3D6}.lfr-g .dim b{color:rgba(255,255,255,.6)}'
    + '.lfr-g .lb{font-size:11.5px;line-height:1.45;color:rgba(255,255,255,.88);display:block;margin-top:4px}'
    + '.lfr-src{font-size:10.5px;color:rgba(255,255,255,.55);margin-top:10px;line-height:1.5}'
    + '.lfr-cd{background:#fff;color:#1E2A3A;border-radius:16px;padding:16px;margin-top:12px;display:flex;gap:14px;align-items:flex-start;text-align:left}'
    + '.lfr-cd .bg{flex:0 0 74px;height:74px;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-weight:900}'
    + '.lfr-cd .bg b{font-size:26px;line-height:1}.lfr-cd .bg small{font-size:10px;font-weight:600;margin-top:3px}'
    + '.lfr-cd h4{margin:0 0 4px;font-size:15px;color:#4A2A7A}.lfr-cd p{margin:0;font-size:13px;line-height:1.7;color:#4B5563}'
    + '.lfr-cd .s{font-size:10.5px;color:#9CA3AF;margin-top:6px}'
    + '.lfr-ft{font-size:12.5px;line-height:1.75;color:rgba(255,255,255,.85);margin-top:16px;padding-top:14px;border-top:1px dashed rgba(255,255,255,.2)}'
    + '.lfr-pk .lfr-bi{padding:0}.lfr-pk .lfr-it{background:#fff;color:#1E2A3A;text-align:left}';

  var AX = [
    ['👁️', '관심 · ATTENTION', 'Gottman (1994)', '관계에서 긍정적 관심과 부정적 반응의 비율이 <b>5:1 이상</b>일 때, 관계가 안정적으로 유지된다는 것을 수천 쌍의 관찰로 밝혀냈습니다.', '사랑흐름은 이 관심의 흐름이 아직 살아있는지를 가장 먼저 읽습니다.'],
    ['🔗', '연결 · CONNECTION', 'Bowen (1978)', '가족 체계 이론. 특정 사람 앞에서 유독 흔들리는 것은 <b>자아 분화</b>와 정서적 거리의 문제이며, 이것이 관계 연결의 질을 결정합니다.', '사랑흐름은 두 사람 사이의 정서적 거리를 좌표로 그려냅니다.'],
    ['🔥', '온기 · WARMTH', 'Neff (2003)', '<b>자기 자비</b>(self-compassion)가 높은 사람일수록, 관계에서 받은 상처를 회복하는 탄력성이 유의미하게 높았습니다.', '사랑흐름은 상대를 보기 전에, 먼저 나를 따뜻하게 대하는 법부터 짚습니다.'],
    ['💬', '표현 · EXPRESSION', 'Slatcher &amp; Pennebaker (2006)', '연인 86쌍 가운데 한 사람이 사흘 동안 관계에 대한 속마음을 글로 썼더니, 석 달 뒤 <b>77%</b>가 그 사람과 계속 만나고 있었습니다. 일상만 쓴 쪽은 <b>52%</b>였습니다.', '사랑흐름은 아직 꺼내지 못한 한 문장을 글로 옮기게 합니다.'],
    ['🌱', '회복 · RECOVERY', 'Chochinov 외 (2005)', '<b>존엄 치료</b>(Dignity Therapy). 자기 이야기를 정리해 가족에게 남긴 분들의 <b>91%</b>가 만족했고, <b>81%</b>는 가족에게 도움이 된다고 답했습니다.', '사랑흐름은 관계의 이야기를 기록해, 다시 다가설 힘을 만듭니다.']
  ];
  function axItems() {
    return AX.map(function (a) {
      return '<div class="lfr-it"><span class="lfr-ax">' + a[1] + '</span><div class="lfr-au">' + a[2] + '</div><div class="lfr-fd">' + a[3] + '</div><div class="lfr-ap">&rarr; ' + a[4] + '</div></div>';
    }).join('');
  }
  function cnt(n) { return '<span class="lfr-c">' + n + '</span>'; }   /* ★v4 세어 올라가지 않고 처음부터 그 숫자 */
  function ring(n, lab) {
    return '<div class="lfr-ring"><svg width="170" height="170"><circle cx="85" cy="85" r="74" stroke="rgba(255,255,255,.12)" stroke-width="12" fill="none"/>'
      + '<circle class="lfr-rg" data-p="' + n + '" cx="85" cy="85" r="74" stroke="#F3D58A" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="465" stroke-dashoffset="465"/></svg>'
      + '<div class="n"><b>' + cnt(n) + '%</b><small>' + lab + '</small></div></div>';
  }
  function card(bg, big, small, h, p, s, col) {
    return '<div class="lfr-cd"><div class="bg" style="background:' + bg + (col ? ';color:' + col : '') + '"><b>' + big + '</b><small>' + small + '</small></div>'
      + '<div><h4>' + h + '</h4><p>' + p + '</p><div class="s">' + s + '</div></div></div>';
  }
  var C_128 = card('linear-gradient(135deg,#6B3FA0,#4A2A7A)', cnt(128), '개 연구', '삶을 돌아보는 일의 힘', '삶을 돌아보는 활동을 다룬 연구 128개를 모아 보니, 돌아본 뒤 <b>자아통합감</b>이 높아지고 <b>우울</b>이 줄었습니다.', 'Pinquart &amp; Forstmeier (2012) · Aging &amp; Mental Health');
  var C_EAR = card('linear-gradient(135deg,#F7E9C9,#F4DDE4)', '<span style="font-size:30px">👂</span>', '당나귀 귀', '「임금님 귀는 당나귀 귀」', '마음속에 담아 둔 이야기를 나흘 동안 하루 15분씩 글로 쓴 학생들은, 그 뒤 여섯 달 동안 학교 보건소를 덜 찾았습니다.', 'Pennebaker &amp; Beall (1986) · Journal of Abnormal Psychology', '#4A2A7A');
  var C_1963 = card('linear-gradient(135deg,#1F7A72,#165C56)', '1963', '인생회고', '돌아보는 것은 자연스럽고 건강한 일', '나이 들며 지난 삶을 돌아보는 것은 누구에게나 찾아오는 자연스러운 과정이라는 「인생회고」 개념이 이때 처음 세워졌습니다.', 'Butler (1963) · Psychiatry');
  var C_91 = '<div class="lfr-g c3"><div><b>' + cnt(76) + '%</b><span class="lb">존엄감이<br>높아졌다</span></div><div><b>' + cnt(68) + '%</b><span class="lb">삶의 목적감이<br>커졌다</span></div><div><b>' + cnt(81) + '%</b><span class="lb">가족에게<br>도움이 된다</span></div></div>'
    + '<div class="lfr-src">Chochinov 외 (2005) · Journal of Clinical Oncology · 100명 · 존엄 치료</div>';
  function head(eye, tt, sub) { return '<div class="lfr-pe">' + eye + '</div><div class="lfr-pt">' + tt + '</div><div class="lfr-ps">' + sub + '</div>'; }
  function foot(name, more) { return '<div class="lfr-ft">사랑흐름 「' + name + '」은 이 연구들이 밝힌 원리 위에 설계했습니다.' + (more ? '<br>' + more : '') + '</div>'; }

  var KIND = {
    main: function () {
      return '<div class="lfr-sb"><div class="lfr-sh" role="button" tabindex="0" aria-expanded="false"><div class="lfr-eye">WHY IT WORKS</div>'
        + '<div class="lfr-tt">과학적 근거 <span class="lfr-ar">&#9662;</span></div>'
        + '<div class="lfr-ds">LFRI&trade;의 다섯 축은 검증된 심리학 연구에 뿌리를 둡니다</div>'
        + '<div class="lfr-x5">' + AX.map(function (a) { return '<span>' + a[0] + '</span>'; }).join('') + '</div></div>'
        + '<div class="lfr-bd"><div class="lfr-bi">' + axItems() + '</div></div></div>';
    },
    memoir: function () {
      return '<div class="lfr-pk k-memoir">' + head('관련 연구 · 학술 근거', '왜 내 이야기를<br>남겨야 할까요', '삶을 돌아보고 이야기로 남기는 일이<br>마음에 무엇을 남기는지, 연구가 말해 줍니다')
        + '<div class="lfr-hero">' + ring(91, '만족') + '<p>자기 삶의 이야기를 나누고, 그 기록을<br>가족에게 남긴 분들이 답했습니다</p></div>'
        + C_91 + C_128 + C_EAR + C_1963
        + foot('한 편의 기록', '치료가 아니라, 당신의 이야기를 오래 기억되는 형태로 옮기는 일입니다.') + '</div>';
    },
    set: function () {
      return '<div class="lfr-pk k-set">' + head('관련 연구 · 학술 근거', '왜 마음을<br>글로 전할까요', '하고 싶었던 말을 글로 옮기는 일이<br>두 사람 사이에 무엇을 남기는지, 연구가 말해 줍니다')
        + '<div class="lfr-hero">' + ring(77, '석 달 뒤에도 함께') + '<p>관계에 대한 속마음을 사흘 동안<br>글로 쓴 쪽이 답했습니다</p></div>'
        + '<div class="lfr-g c2"><div><b>' + cnt(77) + '%</b><span class="lb">속마음을<br>글로 쓴 쪽</span></div><div class="dim"><b>' + cnt(52) + '%</b><span class="lb">일상만<br>쓴 쪽</span></div></div>'
        + '<div class="lfr-src">Slatcher &amp; Pennebaker (2006) · Psychological Science · 연인 86쌍</div>'
        + C_EAR
        + card('linear-gradient(135deg,#B8923E,#D4AF37)', '5:1', '관심', '관심이 관계를 지킵니다', '긍정적 관심과 부정적 반응의 비율이 5:1 이상일 때 관계가 안정적으로 유지됩니다. 편지는 그 관심을 건네는 가장 오래된 방법입니다.', 'Gottman (1994)')
        + foot('마음여행') + '</div>';
    },
    map: function () {
      return '<div class="lfr-pk k-map">' + head('관련 연구 · 학술 근거', '왜 두 사람 사이를<br>지도로 그릴까요', '사랑흐름 LFRI&trade;의 다섯 축은<br>관계 심리 연구에서 가져왔습니다')
        + '<div class="lfr-hero"><div class="lfr-ring"><svg width="170" height="170"><circle cx="85" cy="85" r="74" stroke="rgba(255,255,255,.12)" stroke-width="12" fill="none"/><circle class="lfr-rg" data-p="83" cx="85" cy="85" r="74" stroke="#F3D58A" stroke-width="12" fill="none" stroke-linecap="round" stroke-dasharray="465" stroke-dashoffset="465"/></svg>'
        + '<div class="n"><b>5:1</b><small>관심 : 부정</small></div></div><p>긍정적 관심이 부정적 반응보다<br>다섯 배 많을 때 관계는 안정됩니다</p></div>'
        + '<div class="lfr-src">Gottman (1994)</div>'
        + '<div class="lfr-bi" style="margin-top:14px">' + axItems() + '</div>'
        + foot('마음 여행지도') + '</div>';
    },
    life: function () {
      return '<div class="lfr-pk k-life">' + head('관련 연구 · 학술 근거', '왜 지도 · 편지 · 기록을<br>함께 남길까요', '알고, 전하고, 남기는 세 걸음 —<br>걸음마다 연구가 있습니다')
        + '<div class="lfr-g c3" style="margin-top:20px"><div><b>5:1</b><span class="lb">지도<br>관심의 비율</span></div><div><b>' + cnt(77) + '%</b><span class="lb">편지<br>석 달 뒤에도 함께</span></div><div><b>' + cnt(91) + '%</b><span class="lb">기록<br>남긴 분들의 만족</span></div></div>'
        + '<div class="lfr-src">Gottman (1994) · Slatcher &amp; Pennebaker (2006) · Chochinov 외 (2005)</div>'
        + C_128 + C_EAR
        + foot('두 분의 여정') + '</div>';
    },
    youth: function () {
      return '<div class="lfr-pk k-youth">' + head('관련 연구 · 학술 근거', '왜 미리<br>자서전을 써 볼까요', '미래의 나를 글로 그려 보는 일이<br>오늘의 나를 어떻게 바꾸는지, 연구가 말해 줍니다')
        + card('linear-gradient(135deg,#1F5C7A,#123A5C)', '2001', '미래의 나', '가장 잘 풀린 미래의 나를 써 보면', '「모든 것이 잘 풀린 미래의 나」를 글로 써 본 사람들은 기분이 나아지고 건강 지표가 좋아졌습니다.', 'King (2001) · Personality and Social Psychology Bulletin')
        + card('linear-gradient(135deg,#1F7A72,#165C56)', '2006', '될 수 있는 나', '길과 걸림돌까지 그려 보면', '중학생이 「될 수 있는 나」와 그리로 가는 길 · 걸림돌을 그려 보니 성적과 출석이 나아졌습니다.', 'Oyserman, Bybee &amp; Terry (2006) · Journal of Personality and Social Psychology')
        + card('linear-gradient(135deg,#B8923E,#D4AF37)', '2011', '하면 · 하겠다', '「이런 일이 생기면, 나는 이렇게」', '고등학생이 원하는 미래와 걸림돌, 「그런 일이 생기면 나는 ○○ 하겠다」를 함께 쓰니 공부에 들인 노력이 늘었습니다.', 'Duckworth 외 (2011) · Educational Psychology')
        + foot('미리 써 보는 나의 자서전') + '</div>';
    }
  };

  function css() {
    if (document.getElementById('lfr-css')) { return; }
    var s = document.createElement('style'); s.id = 'lfr-css'; s.textContent = CSS; document.head.appendChild(s);
  }
  var still = false;
  try { still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function fill(root) {
    var cs = root.querySelectorAll('.lfr-c');
    for (var i = 0; i < cs.length; i++) {
      (function (el) {
        if (!el.hasAttribute('data-to')) { return; }   /* ★v4 숫자는 처음부터 그대로 */
        var to = +el.getAttribute('data-to'), t0 = null;
        if (still || !window.requestAnimationFrame) { el.textContent = to; return; }
        function step(t) { if (!t0) { t0 = t; } var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e); if (p < 1) { requestAnimationFrame(step); } }
        requestAnimationFrame(step);
      })(cs[i]);
    }
    var rs = root.querySelectorAll('.lfr-rg');
    for (var j = 0; j < rs.length; j++) {
      var r = rs[j], p = +r.getAttribute('data-p') / 100;
      if (!still) { r.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.7,.2,1)'; }
      r.style.strokeDashoffset = String(465 * (1 - p));
    }
  }
  function watch(el) {
    if (!('IntersectionObserver' in window)) { fill(el); return; }
    var io = new IntersectionObserver(function (es) {
      for (var i = 0; i < es.length; i++) { if (es[i].isIntersecting) { fill(el); io.disconnect(); } }
    }, { threshold: 0.25 });
    io.observe(el);
  }
  function draw() {
    var hs = document.querySelectorAll('[data-lf-research]');
    if (!hs.length) { return; }
    css();
    for (var i = 0; i < hs.length; i++) {
      var h = hs[i], k = h.getAttribute('data-lf-research');
      if (!KIND[k] || h.getAttribute('data-lfr-on')) { continue; }
      h.setAttribute('data-lfr-on', '1');
      h.innerHTML = '<div class="lfr">' + KIND[k]() + '</div>';
      if (k === 'main') {
        (function (box) {
          var sh = box.querySelector('.lfr-sh');
          function tg() { box.classList.toggle('open'); sh.setAttribute('aria-expanded', box.classList.contains('open') ? 'true' : 'false'); }
          sh.addEventListener('click', tg);
          sh.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } });
        })(h.querySelector('.lfr-sb'));
      } else { watch(h); }
    }
  }
  window.LFResearch = { draw: draw };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', draw); } else { draw(); }
})();
