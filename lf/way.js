/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/way.js · v1 · 261004 · [자서전 공사 칸 18]
   들어온 길 — 손님이 어떤 길로 왔는지 「갈래」만 적습니다(35차 결의 3).
   누가 데려왔는지는 적지 않습니다(40차 — 개인 추천은 추적 안 함).
   안내자 링크(?lf=ORG-…)는 지금처럼 lfOrg() 가 따로 잡습니다.

   ─ 주소 꼬리표 ─
     ?way=invite  → 초대장          ?way=guide   → 안내 받아보기
     ?way=partner → 안내자          ?way=org     → 기관
     ?way=ad      → 광고            ?way=direct  → 직접
     그 밖의 값   → 그 밖
     꼬리표가 없으면: 안내자 링크로 왔으면 「안내자」 · utm_ 꼬리표면 「광고」 · 아니면 「직접」
   ─ 기억 ─ 이 기기에 30일(마지막으로 받은 꼬리표가 이깁니다)
   ─ 쓰는 법 ─ LFWay.get()  → '직접' 같은 말 하나
   [원칙] 백틱 금지 · 문자열 연결(+)만
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var MAP = { invite:'초대장', guide:'안내 받아보기', partner:'안내자', org:'기관', ad:'광고', direct:'직접' };
  var KEEP = 30 * 24 * 3600 * 1000;
  function now(){ return (new Date()).getTime(); }
  function save(v){ try{ localStorage.setItem('lf_way', v + '|' + now()); }catch(e){} }
  function read(){
    try{
      var raw = localStorage.getItem('lf_way') || '';
      if (!raw) { return ''; }
      var a = raw.split('|');
      if (now() - Number(a[1] || 0) > KEEP) { localStorage.removeItem('lf_way'); return ''; }
      return a[0] || '';
    }catch(e){ return ''; }
  }
  (function pick(){
    try{
      var q = new URLSearchParams(location.search);
      var w = (q.get('way') || '').toLowerCase();
      if (w) { save(MAP[w] || '그 밖'); return; }
      if (q.get('utm_source') || q.get('utm_medium')) { save('광고'); }
    }catch(e){}
  })();
  function org(){
    try{ return ((localStorage.getItem('lf_org') || '').split('|')[0] || ''); }catch(e){ return ''; }
  }
  window.LFWay = {
    get: function(){
      var v = read();
      if (v) { return v; }
      if (org()) { return '안내자'; }
      return '직접';
    }
  };
})();
