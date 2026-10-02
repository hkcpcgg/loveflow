/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ memoir/kit.js · v1 · 261002 — ★새 부품 (자서전 공사 칸 12)
   자서전 화면 넷(ritual · ask · sign · book)이 함께 쓰는 작은 도구 한 벌.
     ① LFM.story(s)      서버가 주는 「여섯째 자리 · …」를 화면에는 「여섯째 이야기 · …」로
                         (대표 결정 261002 (가) 1안 — 「자리」는 손님 화면에 내지 않음.
                          서버·대장의 이름은 그대로 둡니다 — 거기서 바꾸면 지난 기록과 짝이 끊김)
     ② LFM.HONOR         호칭 「선생님」 — 한 곳에만 둡니다(청소년 경로를 열 때 여기만 바꿈)
     ③ LFM.title(...)    결과물 제목 두 갈래 (대표 결정 261002)
                         여덟 이야기를 다 마치면 「○○○ 선생님의 삶의 여정」
                         아니면 「○○○ 선생님의 기록」 + 「여덟 이야기 가운데 세 번째 이야기까지」
     ④ LFM.consent(pp, go)  동의 기록이 없는 사랑흐름 여권번호면 /consent.html 을 먼저(개2)
                         여권조회(ZJ9X) 답 needConsent 가 true 일 때만. 조회가 늦거나 실패하면 그냥 go()
   [원칙] 백틱 금지 · 문자열 연결(+)만
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var HAVE_GAS = 'https://script.google.com/macros/s/AKfycbyTroJxyBICtL516b6l9KQ45eQRSaKspj35IXOKET2sHvbS_pAlH2gxM9mvBsVsZJ9X/exec';
  var NTH = ['첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟'];
  var HONOR = '선생님';

  function story(s){
    return String(s == null ? '' : s).replace(/(첫|둘|셋|넷|다섯|여섯|일곱|여덟)째 자리/g, '$1째 이야기');
  }
  function nth(n){
    n = parseInt(n, 10);
    if (isNaN(n) || n < 1) { n = 1; }
    if (n > 8) { n = 8; }
    return NTH[n - 1] + ' 번째';
  }
  /* name · 마친 이야기 수 · 여덟 이야기를 다 마쳤나 → { who, whoHtml, sub, journey } */
  function title(name, doneCount, isJourney){
    var n = parseInt(doneCount, 10);
    if (isNaN(n) || n < 1) { n = 1; }
    var journey = !!isJourney || n >= 8;
    var head = (name ? name + ' ' : '') + HONOR + '의';
    var tail = journey ? '삶의 여정' : '기록';
    return {
      journey: journey,
      who: head + ' ' + tail,
      whoHtml: head + '<br>' + tail,
      sub: journey ? '' : ('여덟 이야기 가운데 ' + nth(n) + ' 이야기까지')
    };
  }

  function consent(pp, go){
    pp = String(pp || '').trim().toUpperCase();
    if (!/^LF[ML]?-[A-Z0-9]{4,8}$/.test(pp)) { go(); return; }
    try { if (sessionStorage.getItem('lf_consent_' + pp) === '1') { go(); return; } } catch (e) {}
    var cb = 'lfmcons_' + Date.now() + '_' + Math.floor(Math.random() * 1e6), done = false;
    function fin(){ if (done) { return; } done = true; try { delete window[cb]; } catch (e) {} go(); }
    window[cb] = function(res){
      if (done) { return; }
      if (res && res.ok && res.needConsent === true) {
        done = true;
        location.href = '/consent.html?id=' + encodeURIComponent(pp) + '&next=' + encodeURIComponent(location.pathname + location.search);
        return;
      }
      if (res && res.ok && res.needConsent === false) {
        try { sessionStorage.setItem('lf_consent_' + pp, '1'); } catch (e) {}
      }
      fin();
    };
    var s = document.createElement('script');
    s.src = HAVE_GAS + '?action=have&id=' + encodeURIComponent(pp) + '&callback=' + cb;
    s.onerror = fin;
    setTimeout(fin, 5000);
    (document.head || document.body).appendChild(s);
  }

  window.LFM = { story:story, nth:nth, title:title, consent:consent, HONOR:HONOR };
})();
