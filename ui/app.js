const DATA = window.FITPERSONA;
const CONFIG = window.SUPABASE_CONFIG || { enabled:false };
const STORE = "fitpersona_mobile_v4_supabase";

const defaultState = {
  page: "home",
  qIndex: 0,
  answers: [],
  history: [],
  tasks: {},
  notes: [],
  consent: false,
  participantId: "",
  lastSubmitStatus: ""
};

let state = load();
if (!state.participantId) {
  state.participantId = crypto.randomUUID ? crypto.randomUUID() : "p_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  save();
}

const root = document.getElementById("fitpersona-root");

function load() {
  try {
    return Object.assign({}, defaultState, JSON.parse(localStorage.getItem(STORE) || "{}"));
  } catch(e) {
    return structuredClone(defaultState);
  }
}
function save() { localStorage.setItem(STORE, JSON.stringify(state)); }
function go(page) { state.page = page; save(); render(); window.scrollTo(0,0); }
function today() { return new Date().toISOString().slice(0,10); }
function lastResult(){ return state.history[0] || null; }
function persona(code){ return DATA.personas[code]; }
function scoreAnswers() {
  const s = {R:0,V:0,F:0,A:0,C:0,S:0,G:0,L:0};
  state.answers.forEach((answer, qi) => {
    if(answer === null || answer === undefined) return;
    const opt = DATA.questions[qi].a[answer];
    Object.entries(opt.s).forEach(([k,v]) => s[k] += v);
  });
  return s;
}
function codeFromScore(s) {
  return DATA.pairs.map(([a,b]) => s[a] >= s[b] ? a : b).join("");
}
function dimensionPayload(score) {
  return {
    R_percent: pct(score,"R","V"),
    F_percent: pct(score,"F","A"),
    C_percent: pct(score,"C","S"),
    G_percent: pct(score,"G","L"),
    raw: score
  };
}
function answerPayload() {
  return state.answers.map((answer, qi) => {
    const q = DATA.questions[qi];
    const opt = q.a[answer];
    return {
      question_id: qi + 1,
      group: q.group,
      axis: q.axis,
      question: q.q,
      answer_index: answer,
      answer_text: opt.t,
      answer_hint: opt.h,
      score: opt.s
    };
  });
}
function pct(s,a,b) {
  const total = s[a] + s[b] || 1;
  return Math.round(s[a] / total * 100);
}
function rgba(hex, alpha) {
  const n = parseInt(hex.replace("#",""), 16);
  return `rgba(${(n>>16)&255}, ${(n>>8)&255}, ${n&255}, ${alpha})`;
}
function fmt(t) {
  return new Date(t).toLocaleString("zh-CN", {month:"2-digit", day:"2-digit", hour:"2-digit", minute:"2-digit"});
}
function esc(x){ return String(x || "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c])); }

async function supabaseInsert(table, row) {
  if (!CONFIG.enabled || !CONFIG.url || !CONFIG.anonKey || !state.consent) return { skipped:true };
  const url = `${CONFIG.url.replace(/\/$/,"")}/rest/v1/${table}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "apikey": CONFIG.anonKey,
      "Authorization": `Bearer ${CONFIG.anonKey}`,
      "Content-Type": "application/json",
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(row)
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || `HTTP ${resp.status}`);
  }
  return { ok:true };
}
async function submitResponse(res) {
  if (!state.consent) {
    state.lastSubmitStatus = "未上传：用户未开启匿名数据提交。";
    save();
    return;
  }
  if (!CONFIG.enabled) {
    state.lastSubmitStatus = "未上传：Supabase 未配置。";
    save();
    return;
  }
  const p = persona(res.code);
  const row = {
    participant_id: state.participantId,
    result_id: res.id,
    result_code: res.code,
    persona_name: p.name,
    score: res.score,
    dimensions: res.dimensions,
    answers: res.answers,
    consent: true,
    app_version: CONFIG.appVersion || DATA.meta.version,
    user_agent: navigator.userAgent.slice(0, 500),
    screen_width: window.screen.width || null,
    screen_height: window.screen.height || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    language: navigator.language || "",
    referrer: document.referrer || "",
    page_url: location.href,
    payload: {
      trend_keywords: DATA.meta.trendKeywords,
      local_time: new Date().toISOString()
    }
  };
  try {
    await supabaseInsert("fitpersona_responses", row);
    state.lastSubmitStatus = "已匿名上传到后台。";
  } catch (e) {
    state.lastSubmitStatus = "上传失败：" + e.message.slice(0, 160);
  }
  save();
}
async function logEvent(eventName, payload={}) {
  if (!CONFIG.enabled || !state.consent) return;
  try {
    await supabaseInsert("fitpersona_events", {
      participant_id: state.participantId,
      event_name: eventName,
      result_code: lastResult() ? lastResult().code : null,
      app_version: CONFIG.appVersion || DATA.meta.version,
      payload,
      user_agent: navigator.userAgent.slice(0, 500),
      page_url: location.href
    });
  } catch(e) {}
}

function render() {
  root.innerHTML = `
    <div class="app">
      <header class="top">
        <div class="brand" onclick="go('home')">
          <div class="logo">FP</div>
          <div><b>FitPersona</b><span>健身人格抽象图鉴</span></div>
        </div>
        <button class="mini" onclick="resetAll()">清空</button>
      </header>
      <main class="view">${page()}</main>
      ${tabbar()}
    </div>
  `;
  bind();
}
function tabbar() {
  const items = [
    ["home","首页","⌂"],["test","测试","✎"],["plan","任务","✓"],
    ["gallery","图鉴","▦"],["match","搭子","♡"],["history","记录","◎"]
  ];
  return `<nav class="tabbar">${items.map(([id,name,icon])=>`
    <button class="${state.page===id?'on':''}" onclick="go('${id}')"><i>${icon}</i><span>${name}</span></button>
  `).join("")}</nav>`;
}
function page(){
  if(state.page === "test") return testPage();
  if(state.page === "plan") return planPage();
  if(state.page === "gallery") return galleryPage();
  if(state.page === "match") return matchPage();
  if(state.page === "history") return historyPage();
  return homePage();
}
function bind(){
  if(state.page === "test") bindTest();
  if(state.page === "plan") bindPlan();
  if(state.page === "gallery") bindGallery();
  if(state.page === "match") bindMatch();
  const canvas = document.getElementById("radarCanvas");
  if(canvas && lastResult()) drawRadar(canvas, lastResult().score, persona(lastResult().code).color);
}
function startTest(){
  state.page = "test";
  state.qIndex = 0;
  state.answers = [];
  save();
  logEvent("start_test");
  render();
}
window.startTest = startTest;
window.go = go;
window.toggleConsent = function(){
  state.consent = !state.consent;
  save();
  render();
  logEvent("toggle_consent", {consent: state.consent});
};
window.resetAll = function(){
  if(confirm("确定清空本地测试、任务和记录吗？不会删除已上传到后台的数据。")) {
    const oldParticipant = state.participantId;
    state = structuredClone(defaultState);
    state.participantId = oldParticipant || "";
    save();
    render();
  }
};

function analyticsBadge(){
  if(!CONFIG.enabled) return `<span class="badge warn">后台未配置</span>`;
  if(state.consent) return `<span class="badge ok">匿名上传已开启</span>`;
  return `<span class="badge">匿名上传未开启</span>`;
}
function homePage(){
  const res = lastResult();
  const p = res ? persona(res.code) : null;
  const task = taskInfo();
  return `
    <section class="hero">
      <div class="section-head"><span class="pill">mobile-first · v4 数据版</span>${analyticsBadge()}</div>
      <h1>测测你是哪种健身物种</h1>
      <p>发到小红书后，用户同意即可把匿名测试结果写入后台，方便你后续分析人群画像、题目选择、设备和来源。</p>
      <div class="consent">
        <button class="switch ${state.consent?'on':''}" onclick="toggleConsent()"><i></i></button>
        <div><b>允许匿名提交测试结果用于研究分析</b><p>不收集手机号、微信、姓名和精准定位；只记录答案、结果、设备宽度、浏览器信息等匿名数据。</p></div>
      </div>
      <div class="hero-actions">
        <button class="primary big" onclick="startTest()">开始测试</button>
        <button class="big" onclick="go('gallery')">看16种人格</button>
      </div>
    </section>

    <section class="stats">
      <div><b>${res ? res.code : "--"}</b><span>最近人格</span></div>
      <div><b>${state.history.length}</b><span>本机测试</span></div>
      <div><b>${task.done}/${task.total}</b><span>今日任务</span></div>
    </section>

    <section class="card">
      <div class="section-head"><span class="pill">当前画像</span>${res ? `<button class="mini" onclick="downloadPoster('${res.id}')">海报</button>` : ""}</div>
      ${p ? resultMini(res) : `<div class="empty">完成一次测试后，会生成你的人格、雷达图、每日任务和分享海报。</div>`}
      ${state.lastSubmitStatus ? `<p class="submit-status">${state.lastSubmitStatus}</p>` : ""}
    </section>

    <section class="card">
      <span class="pill">趋势词条</span>
      <h2>问题围绕真实运动内容习惯重做</h2>
      <div class="chips">${DATA.meta.trendKeywords.map(k=>`<span>${k}</span>`).join("")}</div>
    </section>
  `;
}
function resultMini(res){
  const p = persona(res.code);
  return `
    <div class="result-mini">
      <div class="emoji" style="background:${rgba(p.color,.25)}">${p.emoji}</div>
      <div>
        <h2>${res.code}｜${p.name}</h2>
        <p class="quote">“${p.quote}”</p>
        <p>${p.summary}</p>
        <div class="chips">${p.tags.map(t=>`<span>#${t}</span>`).join("")}</div>
      </div>
    </div>
    ${bars(res.score)}
    <div class="actions">
      <button class="primary" onclick="copyResult('${res.id}')">复制文案</button>
      <button onclick="go('plan')">今日任务</button>
    </div>
  `;
}

function testPage(){
  if(state.answers.length >= DATA.questions.length) return finishTest();
  const q = DATA.questions[state.qIndex];
  const progress = Math.round(state.answers.length / DATA.questions.length * 100);
  return `
    <section class="question">
      <div class="progress-label"><span>${q.group} · ${q.axis}</span><span>${state.qIndex+1}/${DATA.questions.length}</span></div>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <h1>${q.q}</h1>
      <div class="options">${q.a.map((o,i)=>`
        <button class="option" data-answer="${i}">
          <b>${o.t}</b><span>${o.h}</span>
        </button>
      `).join("")}</div>
      <div class="actions sticky-actions">
        <button ${state.qIndex===0?"disabled":""} onclick="prevQ()">上一题</button>
        <button onclick="startTest()">重测</button>
      </div>
    </section>
  `;
}
function bindTest(){
  document.querySelectorAll("[data-answer]").forEach(btn=>{
    btn.onclick = () => {
      state.answers[state.qIndex] = Number(btn.dataset.answer);
      state.qIndex += 1;
      save(); render();
    };
  });
}
window.prevQ = function(){
  if(state.qIndex > 0) {
    state.qIndex -= 1;
    state.answers = state.answers.slice(0, state.qIndex);
    save(); render();
  }
};
function finishTest(){
  const score = scoreAnswers();
  const code = codeFromScore(score);
  const res = {
    id:"r"+Date.now(),
    code,
    score,
    dimensions: dimensionPayload(score),
    answers: answerPayload(),
    time:Date.now()
  };
  state.history.unshift(res);
  state.history = state.history.slice(0, 60);
  state.qIndex = 0;
  state.answers = [];
  save();
  submitResponse(res);
  logEvent("complete_test", { result_code: code });
  state.page = "home";
  save();
  return resultPage(res);
}
function resultPage(res){
  const p = persona(res.code);
  return `
    <section class="poster-card" style="background:linear-gradient(150deg, ${rgba(p.color,.38)}, rgba(255,249,242,.94));">
      <span class="code">${res.code}</span>
      <div class="big-emoji">${p.emoji}</div>
      <h1>${p.name}</h1>
      <p class="quote">“${p.quote}”</p>
      <canvas id="radarCanvas" width="360" height="360"></canvas>
      <div class="actions">
        <button class="primary" onclick="downloadPoster('${res.id}')">下载海报</button>
        <button onclick="copyResult('${res.id}')">复制</button>
      </div>
    </section>
    <section class="card">
      <h2>你的画像解释</h2>
      <p>${p.summary}</p>
      ${bars(res.score)}
      <div class="info"><b>高光行为</b><p>${p.strength}</p></div>
      <div class="info"><b>危险误区</b><p>${p.trap}</p></div>
      <div class="info"><b>轻量建议</b><p>${p.advice}</p></div>
    </section>
  `;
}
function bars(score){
  return `<div class="bars">${DATA.pairs.map(([a,b])=>{
    const val = pct(score,a,b);
    return `<div class="bar-row"><b>${DATA.dimensions[a].short}</b><div><i style="width:${val}%"></i></div><b>${DATA.dimensions[b].short}</b></div>`;
  }).join("")}</div>`;
}

function currentTasks(){
  const res = lastResult();
  return res ? persona(res.code).daily : ["走路 15 分钟","拉伸 8 分钟","睡前写一句身体反馈"];
}
function taskInfo(){
  const done = state.tasks[today()] || {};
  const tasks = currentTasks();
  return {total:tasks.length, done:tasks.filter((_,i)=>done[i]).length};
}
function planPage(){
  const res = lastResult(), p = res ? persona(res.code) : null, info = taskInfo();
  return `
    <section class="card">
      <span class="pill">Daily Mission</span>
      <h1>今日任务</h1>
      <p>像背单词一样，每天只完成一点点。先不断线，再谈升级。</p>
      ${p ? `<div class="small-profile"><div class="emoji">${p.emoji}</div><div><b>${res.code}｜${p.name}</b><p>${p.advice}</p></div></div>` : `<div class="empty">先完成测试，会生成更贴合你的人格任务。</div>`}
    </section>
    <section class="stats one"><div><b>${info.done}/${info.total}</b><span>${today()} 完成度</span></div></section>
    <section class="card">
      <h2>任务清单</h2>
      <div class="task-list">${taskList(true)}</div>
      <div class="actions"><button onclick="resetToday()">重置今日</button></div>
    </section>
    <section class="card">
      <h2>身体反馈</h2>
      <textarea id="noteInput" placeholder="例如：今天肩颈轻松了一点；散步之后状态变好了。"></textarea>
      <div class="actions"><button class="primary" onclick="saveNote()">保存反馈</button></div>
    </section>
  `;
}
function taskList(interactive){
  const done = state.tasks[today()] || {};
  return currentTasks().map((t,i)=>`
    <div class="task">
      <button class="check ${done[i]?'done':''}" ${interactive?`data-task="${i}"`:"disabled"}>${done[i]?'✓':''}</button>
      <div><b>${t}</b><span>${done[i]?'已完成':'待完成'}</span></div>
    </div>
  `).join("");
}
function bindPlan(){
  document.querySelectorAll("[data-task]").forEach(btn=>{
    btn.onclick = () => {
      const key = today();
      state.tasks[key] = state.tasks[key] || {};
      state.tasks[key][btn.dataset.task] = !state.tasks[key][btn.dataset.task];
      save();
      logEvent("task_toggle", {task_index: btn.dataset.task, done: state.tasks[key][btn.dataset.task]});
      render();
    };
  });
}
window.resetToday = function(){ state.tasks[today()] = {}; save(); render(); };
window.saveNote = function(){
  const input = document.getElementById("noteInput");
  const text = input.value.trim();
  if(!text) return alert("先写一点反馈再保存。");
  state.notes.unshift({time:Date.now(), text});
  state.notes = state.notes.slice(0,80);
  save();
  logEvent("save_note", {text_length: text.length});
  alert("已保存");
  render();
};

function galleryPage(){
  return `
    <section class="card">
      <span class="pill">Persona Gallery</span>
      <h1>16种健身物种</h1>
      <input id="search" placeholder="搜索：松弛 / 搭子 / RASL / 工位" />
    </section>
    <section class="persona-grid">
      ${Object.entries(DATA.personas).map(([code,p])=>`
        <article class="persona-card" data-code="${code}" style="background:linear-gradient(150deg, ${rgba(p.color,.25)}, rgba(255,249,242,.92));">
          <div class="emoji">${p.emoji}</div>
          <span>${code}</span>
          <h2>${p.name}</h2>
          <p>${p.quote}</p>
          <div class="chips">${p.tags.slice(0,3).map(t=>`<i>#${t}</i>`).join("")}</div>
        </article>
      `).join("")}
    </section>
  `;
}
function bindGallery(){
  const input = document.getElementById("search");
  input.oninput = () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll(".persona-card").forEach(card=>{
      card.style.display = card.textContent.toLowerCase().includes(q) ? "" : "none";
    });
  };
  document.querySelectorAll(".persona-card").forEach(card=>{
    card.onclick = () => {
      const p = persona(card.dataset.code);
      alert(`${card.dataset.code}｜${p.name}\n\n${p.quote}\n\n${p.summary}\n\n建议：${p.advice}`);
    };
  });
}
function matchPage(){
  const res = lastResult();
  return `
    <section class="card">
      <span class="pill">Gym Buddy Match</span>
      <h1>搭子匹配</h1>
      <p>输入两个四字母代码，看看你们适合一起撸铁、散步、团课还是互相劝退。</p>
      <input id="codeA" maxlength="4" placeholder="你的代码，例如 VASL" value="${res ? res.code : ""}">
      <input id="codeB" maxlength="4" placeholder="搭子的代码，例如 RFSG">
      <div class="actions"><button class="primary" id="matchBtn">生成匹配报告</button></div>
    </section>
    <section class="card" id="matchResult"><div class="empty">匹配结果会显示在这里。</div></section>
  `;
}
function bindMatch(){
  ["codeA","codeB"].forEach(id=>{
    document.getElementById(id).oninput = e => e.target.value = e.target.value.toUpperCase().replace(/[^RVFACSGL]/g,"").slice(0,4);
  });
  document.getElementById("matchBtn").onclick = () => {
    const a = document.getElementById("codeA").value, b = document.getElementById("codeB").value;
    const box = document.getElementById("matchResult");
    if(!DATA.personas[a] || !DATA.personas[b]) return box.innerHTML = `<div class="empty">请输入有效代码，例如 VASL、RFSG、RACG。</div>`;
    const same = [...a].filter((ch,i)=>ch===b[i]).length;
    const score = Math.min(96, 38 + same*13 + (a[2]!==b[2]?6:0) + (a[3]===b[3]?5:0));
    let text = "可以一起动，但别互相改造。";
    if(same===4) text = "同物种高频共振，适合一起建立固定习惯。";
    else if(a[3]!==b[3]) text = "一个去场馆，一个在生活里移动，建议先约散步/拉伸/轻徒步。";
    else if(a[2]!==b[2]) text = "一人开麦，一人戴耳机，适合同场不同练。";
    box.innerHTML = `<span class="pill">${persona(a).name} × ${persona(b).name}</span><h1 class="score">${score}%</h1><p>${text}</p>`;
    logEvent("match", {code_a:a, code_b:b, match_score:score});
  };
}
function historyPage(){
  return `
    <section class="card">
      <span class="pill">History</span>
      <h1>记录</h1>
      <p>本页是本机记录。后台分析请打开 admin_dashboard.py 部署页。</p>
      <div class="actions"><button class="primary" onclick="exportData()">导出JSON</button><button onclick="clearHistory()">清空历史</button></div>
    </section>
    <section class="list">
      ${state.history.length ? state.history.map(res=>{
        const p = persona(res.code);
        return `<div class="history"><div class="emoji">${p.emoji}</div><div><b>${res.code}｜${p.name}</b><span>${fmt(res.time)}</span></div><button onclick="downloadPoster('${res.id}')">海报</button></div>`;
      }).join("") : `<div class="empty">暂无测试记录。</div>`}
    </section>
    <section class="card">
      <h2>身体反馈</h2>
      <div class="list">${state.notes.length ? state.notes.map(n=>`<div class="history note"><div>📝</div><div><b>${fmt(n.time)}</b><p>${esc(n.text)}</p></div></div>`).join("") : `<div class="empty">暂无反馈记录。</div>`}</div>
    </section>
  `;
}
window.clearHistory = function(){
  if(confirm("确定清空本机历史？不会删除已上传到后台的数据。")) { state.history=[]; save(); render(); }
};
window.exportData = function(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `fitpersona-mobile-${today()}.json`;
  a.click();
};
window.copyResult = function(id){
  const res = state.history.find(x=>x.id===id) || lastResult(); if(!res) return;
  const p = persona(res.code);
  navigator.clipboard.writeText(`我的健身人格是 ${res.code}｜${p.name}：${p.quote} #健身人格抽象图鉴`)
    .then(()=>alert("已复制"))
    .catch(()=>alert("复制失败，可以截图保存"));
};
window.downloadPoster = function(id){
  const res = state.history.find(x=>x.id===id) || lastResult(); if(!res) return;
  const p = persona(res.code);
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 1500;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#F7F0E8"; ctx.fillRect(0,0,1080,1500);
  ctx.fillStyle = rgba(p.color,.38); ctx.beginPath(); ctx.arc(120,120,360,0,Math.PI*2); ctx.fill();
  round(ctx,70,70,940,1360,64,"rgba(255,249,242,.94)");
  pill(ctx,res.code,126,132);
  txt(ctx,"FitPersona 健身人格抽象图鉴",126,250,40,900,"#40352F");
  txt(ctx,"我的健身物种是",126,320,32,800,"#817269");
  txt(ctx,p.name,126,432,84,950,"#40352F");
  txt(ctx,p.emoji,800,380,130,900,"#40352F");
  wrap(ctx,`“${p.quote}”`,126,548,820,48,38,"#40352F",850);
  wrap(ctx,p.summary,126,710,820,38,28,"#817269",520);
  let y = 900;
  DATA.pairs.forEach(([a,b])=>{
    const value = pct(res.score,a,b);
    txt(ctx,DATA.dimensions[a].label,126,y,28,850,"#40352F");
    ctx.textAlign="right"; txt(ctx,DATA.dimensions[b].label,956,y,28,850,"#40352F"); ctx.textAlign="left";
    round(ctx,126,y+24,830,24,12,"rgba(64,53,47,.08)");
    round(ctx,126,y+24,830*value/100,24,12,p.color);
    y += 82;
  });
  wrap(ctx,`轻量建议：${p.advice}`,126,1248,820,38,28,"#40352F",760);
  wrap(ctx,p.tags.map(t=>`#${t}`).join("  "),126,1384,820,32,24,"#817269",700);
  txt(ctx,"结果仅供娱乐与习惯建议，不是医学或专业运动诊断。",126,1450,22,520,"#A39389");
  const a = document.createElement("a");
  a.download = `FitPersona-${res.code}-${p.name}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
};

function drawRadar(canvas, score, color){
  const ctx = canvas.getContext("2d"), cx=180, cy=180, maxR=110;
  ctx.clearRect(0,0,360,360);
  for(let l=4;l>=1;l--){ poly(ctx,cx,cy,maxR/4*l,4); ctx.fillStyle="rgba(255,249,242,.58)"; ctx.fill(); ctx.strokeStyle="rgba(64,53,47,.16)"; ctx.stroke(); }
  const axes=[["计划",pct(score,"R","V")],["功能",pct(score,"F","A")],["搭子",pct(score,"C","S")],["场馆",pct(score,"G","L")]];
  ctx.beginPath();
  axes.forEach((a,i)=>{ const ang=-Math.PI/2+i*Math.PI*2/4, r=maxR*a[1]/100, x=cx+Math.cos(ang)*r, y=cy+Math.sin(ang)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y); });
  ctx.closePath(); ctx.fillStyle=rgba(color,.5); ctx.fill(); ctx.strokeStyle="#40352F"; ctx.lineWidth=3; ctx.stroke();
  axes.forEach((a,i)=>{ const ang=-Math.PI/2+i*Math.PI*2/4; ctx.fillStyle="#40352F"; ctx.font="800 19px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(a[0],cx+Math.cos(ang)*(maxR+35),cy+Math.sin(ang)*(maxR+35)); });
}
function poly(ctx,cx,cy,r,n){ ctx.beginPath(); for(let i=0;i<n;i++){ const a=-Math.PI/2+i*Math.PI*2/n, x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r; i?ctx.lineTo(x,y):ctx.moveTo(x,y); } ctx.closePath(); }
function round(ctx,x,y,w,h,r,fill){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); ctx.fillStyle=fill; ctx.fill(); }
function txt(ctx,s,x,y,size,weight,color){ ctx.fillStyle=color; ctx.font=`${weight} ${size}px system-ui, Microsoft YaHei, sans-serif`; ctx.textBaseline="alphabetic"; ctx.fillText(s,x,y); }
function pill(ctx,s,x,y){ ctx.font="900 32px system-ui"; const w=ctx.measureText(s).width+46; round(ctx,x,y-44,w,58,29,"#40352F"); txt(ctx,s,x+23,y-5,32,900,"#FFF9F2"); }
function wrap(ctx,s,x,y,maxW,lineH,size,color,weight){ ctx.fillStyle=color; ctx.font=`${weight} ${size}px system-ui, Microsoft YaHei, sans-serif`; let line="", cy=y; [...s].forEach((ch,i)=>{ const test=line+ch; if(ctx.measureText(test).width>maxW && line){ctx.fillText(line,x,cy); line=ch; cy+=lineH;} else line=test; if(i===[...s].length-1) ctx.fillText(line,x,cy); }); }

render();