/* ═══════════════════════════════════════════════════════════════
   현재 버전 ▶ lf/ident.js · v3 · 261005 — ★[약관 확정 · 대표 ok 261005] 동의 기록 버전 draft-261001 → v2-261012 · 「문구 초안」 표시 걷음.
   ── 이전 ── v2 · 261002 — ★문구를 사랑흐름 말로(대표 지적 261002): 「성함」→「성명」, 「여권」을 앞말 없이 쓰던 자리 → 「사랑흐름 여권번호」, 연락처 앞자리는 번호만(02 · 031 … 070), 연락처 밑 안내 글 삭제, 알림 문구를 한 틀로(성명을 적어 주세요 · 연락처를 적어 주세요 · 연락처를 다시 확인해 주세요 · 개인정보 수집·이용 동의에 체크해 주세요). 칸 모양은 그 화면에 원래 있는 칸 클래스를 넘겨받아 같게(labelClass · inputClass · selectClass). — v1 · 261001 — ★새 부품 (자서전 공사 칸 11)
   성명 + 연락처(앞자리 고르기 + 뒷번호) + 개인정보 필수 동의 — 한 곳에서 그립니다.
   쓰는 화면: gate.html · apply.html · consent.html
   ─ 부르는 법 ─
     <div id="lfIdent"></div>
     <script src="/lf/ident.js?v=2"></script>
     LFIdent.mount('lfIdent', { consent:true, checked:false, optional:false });
     var r = LFIdent.read();   // { ok, msg, name, contact, phone4, agree, optAgree, termsVer }
   ─ 규칙 ─
     연락처 = 휴대전화(010·011·016~019) · 집 전화(02·지역번호 031~064) · 070  (대표 결정 261001 개1 변경)
     ★서버(발권 lfNormPhone_ · 게시판 normContact_)와 같은 규칙입니다. 한쪽만 고치면 안 됩니다.
     전화뒤4 = 연락처 끝 네 자리 — 서버 입금 검문소가 아직 이 값을 봅니다.
   ★동의 문구 확정(261005 · 이사회 약관 확정 검토 · 대표 ok). 동의 기록 버전 = v2-261012.
   [원칙] 백틱 금지 · 문자열 연결(+)만
   ═══════════════════════════════════════════════════════════════ */
(function(){
  var TERMS_VER = 'v2-261012';   /* 이용약관 · 개인정보처리방침 · 환불정책 v2 (2026.10.12 시행) */
  var PREFIX = [
    ['010','010'],['011','011'],['016','016'],['017','017'],['018','018'],['019','019'],
    ['02','02'],['031','031'],['032','032'],['033','033'],
    ['041','041'],['042','042'],['043','043'],['044','044'],
    ['051','051'],['052','052'],['053','053'],['054','054'],['055','055'],
    ['061','061'],['062','062'],['063','063'],['064','064'],
    ['070','070']
  ];
  var CSS = ''
    + '.lfi{display:block;text-align:left;margin:4px 0 6px}'
    + '.lfi-l{font-size:13px;font-weight:700;color:#1E4A76;margin:12px 0 6px}'
    + '.lfi-in,.lfi-sel{box-sizing:border-box;height:46px;border:1.5px solid #D9D4C7;border-radius:12px;background:#fff;'
    +   'font-size:16px;color:#1E4A76;padding:0 12px;font-family:inherit;outline:none}'
    + '.lfi-in:focus,.lfi-sel:focus{border-color:#D4AF37}'
    + '.lfi-name{width:100%}'
    + '.lfi-row{display:flex;gap:6px}'
    + '.lfi-row .lfi-sel{flex:0 0 112px!important;width:112px!important;min-width:0!important;padding:0 28px 0 12px!important;text-align:left!important;'
    +   '-webkit-appearance:none;appearance:none;background-color:#fff;'
    +   'background-image:url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23C6A94A%27 stroke-width=%272.5%27%3e%3cpath d=%27M6 9l6 6 6-6%27/%3e%3c/svg%3e")!important;'
    +   'background-repeat:no-repeat!important;background-position:right 9px center!important;background-size:16px!important}'
    + '.lfi-row .lfi-num{flex:1 1 auto!important;width:auto!important;min-width:0!important}'
    + '.lfi-hint{font-size:12px;color:#7A7F88;margin-top:5px;line-height:1.5}'
    + '.lfi-agree{margin-top:14px;border:1px solid #E6E0D2;border-radius:12px;background:#FBF9F4;padding:12px 12px 10px}'
    + '.lfi-chk{display:flex;gap:9px;align-items:flex-start;font-size:14px;color:#1E4A76;line-height:1.5;cursor:pointer}'
    + '.lfi-chk input{width:20px;height:20px;margin:1px 0 0;accent-color:#1E4A76;flex:0 0 auto}'
    + '.lfi-chk b{color:#B0412E;font-weight:700}'
    + '.lfi-more{margin-top:8px;font-size:12.5px;color:#5B6070}'
    + '.lfi-more summary{cursor:pointer;color:#8A6D2B;font-weight:700}'
    + '.lfi-more table{border-collapse:collapse;width:100%;margin-top:8px}'
    + '.lfi-more th,.lfi-more td{border-top:1px solid #E6E0D2;padding:6px 4px;text-align:left;vertical-align:top;font-weight:400}'
    + '.lfi-more th{width:86px;color:#1E4A76;font-weight:700}'
    + '.lfi-draft{display:inline-block;font-size:11px;color:#B0412E;border:1px solid #E7B9AF;border-radius:4px;padding:0 5px;margin-left:4px}';

  function css(){
    if (document.getElementById('lfi-css')) { return; }
    var s = document.createElement('style'); s.id = 'lfi-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  function digits(v){ return String(v == null ? '' : v).replace(/[^0-9]/g, ''); }

  /* 서버와 같은 규칙 — 맞으면 숫자열, 아니면 '' */
  function norm(v){
    var s = digits(v);
    if (/^010[0-9]{8}$/.test(s)) { return s; }
    if (/^01[16789][0-9]{7,8}$/.test(s)) { return s; }
    if (/^02[0-9]{7,8}$/.test(s)) { return s; }
    if (/^0(3[1-3]|4[1-4]|5[1-5]|6[1-4])[0-9]{7,8}$/.test(s)) { return s; }
    if (/^070[0-9]{8}$/.test(s)) { return s; }
    return '';
  }

  var OPT = {};

  function mount(id, opt){
    OPT = opt || {};
    var el = (typeof id === 'string') ? document.getElementById(id) : id;
    if (!el) { return; }
    css();
    /* ★[v2] 칸 모양은 그 화면에 원래 있는 칸을 그대로 씁니다 — 라벨·입력칸·고르기 클래스를 화면이 넘겨줍니다 */
    var cL = OPT.labelClass  || 'lfi-l';
    var cI = OPT.inputClass  || 'lfi-in';
    var cS = OPT.selectClass || 'lfi-in';
    var sel = '<select class="' + cS + ' lfi-sel" id="lfiPre" aria-label="연락처 앞자리">';
    for (var i = 0; i < PREFIX.length; i++) {
      sel += '<option value="' + PREFIX[i][0] + '">' + PREFIX[i][1] + '</option>';
    }
    sel += '</select>';
    var h = '<div class="lfi">'
      + '<div class="' + cL + '">성명</div>'
      + '<input class="' + cI + ' lfi-name" id="lfiName" maxlength="20" autocomplete="name" placeholder="성명을 적어 주세요">'
      + '<div class="' + cL + '">연락처</div>'
      + '<div class="lfi-row">' + sel
      + '<input class="' + cI + ' lfi-num" id="lfiNum" inputmode="numeric" maxlength="9" autocomplete="off" placeholder="뒷번호">'
      + '</div>';
    if (OPT.consent !== false) {
      h += '<div class="lfi-agree">'
        + '<label class="lfi-chk"><input type="checkbox" id="lfiAgree"' + (OPT.checked ? ' checked' : '') + '>'
        + '<span><b>[필수]</b> 개인정보 수집·이용에 동의합니다.</span></label>'
        + '<details class="lfi-more"><summary>무엇을 왜 받나요</summary>'
        + '<table>'
        + '<tr><th>받는 것</th><td>성명 · 연락처</td></tr>'
        + '<tr><th>쓰는 곳</th><td>사랑흐름 여권번호를 잊으셨을 때 찾아 드리고, 쓰시던 기록을 이어 드리는 데만 씁니다.</td></tr>'
        + '<tr><th>두는 기간</th><td>남기신 기록을 보관하는 동안. 지워 달라고 하시면 바로 지웁니다.</td></tr>'
        + '<tr><th>동의 안 하시면</th><td>사랑흐름 여권번호를 발급해 드릴 수 없어요.</td></tr>'
        + '</table>'
        + '<div style="margin-top:6px">자세한 내용은 개인정보 처리방침에 있어요.</div>'
        + '</details>'
        + '</div>';
    }
    h += '</div>';
    el.innerHTML = h;
    var num = document.getElementById('lfiNum');
    num.addEventListener('input', function(){ this.value = digits(this.value).slice(0, 9); });
    if (OPT.onEnter) {
      num.addEventListener('keydown', function(e){ if (e.key === 'Enter') { OPT.onEnter(); } });
    }
  }

  function read(){
    var name = (document.getElementById('lfiName') || {}).value || '';
    name = String(name).trim();
    var pre = (document.getElementById('lfiPre') || {}).value || '';
    var back = digits((document.getElementById('lfiNum') || {}).value || '');
    var contact = norm(pre + back);
    var ag = document.getElementById('lfiAgree');
    var agree = ag ? !!ag.checked : true;
    if (!name)    { return { ok:false, msg:'성명을 적어 주세요.', field:'lfiName' }; }
    if (!back)    { return { ok:false, msg:'연락처를 적어 주세요.', field:'lfiNum' }; }
    if (!contact) { return { ok:false, msg:'연락처를 다시 확인해 주세요.', field:'lfiNum' }; }
    if (OPT.consent !== false && !agree) {
      return { ok:false, msg:'개인정보 수집·이용 동의에 체크해 주세요.', field:'lfiAgree' };
    }
    return { ok:true, name:name, contact:contact, phone4:contact.slice(-4),
             agree:(agree ? '1' : ''), optAgree:'', termsVer:TERMS_VER };
  }

  function focus(field){ try{ var f = document.getElementById(field); if (f) { f.focus(); } }catch(e){} }

  window.LFIdent = { mount:mount, read:read, focus:focus, norm:norm, TERMS_VER:TERMS_VER };
})();
