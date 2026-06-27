const DATA = window.FITPERSONA;
const STORE = "fitpersona_streamlit_v1";

const defaultState = {
  page: "dashboard",
  qIndex: 0,
  answers: [],
  history: [],
  tasks: {},
  notes: [],
  profile: { name: "", goal: "状态更好" }
};

let state = loadState();
const root = document.getElementById("fitpersona-root");

function loadState(){
  try {
    return Object.assign({}, defaultState, JSON.parse(localStorage.getItem(STORE) || "{}"));
  } catch(e) {
    return JSON.parse(JSON.stringify(defaultState));
  }
}
function saveState(){ localStorage.setItem(STORE, JSON.stringify(state)); }
function today(){ return new Date().toISOString().slice(0,10); }
function go(page){ state.page = page; saveState(); render(); }
function scoreAnswers(){
  const score = {R:0,V:0,F:0,A:0,C:0,S:0,G:0,L:0};
  state.answers.forEach((answerIndex, qIndex)=>{
    if(answerIndex === null || answerIndex === undefined) return;
    const opt = DATA.questions[qIndex].a[answerIndex];
    Object.entries(opt.s).forEach(([k,v])=> score[k] += v);
  });
  return score;
}
function getCode(score){
  return DATA.pairs.map(([a,b]) => score[a] >= score[b] ? a : b).join("");
}
function pct(score,a,b){
  const total = score[a] + score[b] || 1;
  return Math.round(score[a] / total * 100);
}
function lastResult(){ return state.history[0] || null; }
function persona(code){ return DATA.personas[code]; }
function hexToRgba(hex, alpha){
  const h = hex.replace("#","");
  const n = parseInt(h,16);
  return `rgba(${(n>>16)&255}, ${(n>>8)&255}, ${n&255}, ${alpha})`;
}
function escapeHtml(s){
  return String(s || "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}
function formatTime(t){
  return new Date(t).toLocaleString("zh-CN", {month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});
}

function nav(){
  const items = [
    ["dashboard","首页"],["test","测试"],["plan","今日任务"],
    ["gallery","人格图鉴"],["match","搭子匹配"],["history","记录"]
  ];
  return `<nav class="nav">${items.map(([id,name])=>`<button class="${state.page===id?"active":""}" onclick="go('${id}')">${name}</button>`).join("")}</nav>`;
}

function render(){
  root.innerHTML = `
    <div class="shell">
      <aside class="sidebar">
        <div class="brand"><div class="logo">FP</div><div><b>FitPersona</b><span>健身人格抽象图鉴</span></div></div>
        ${nav()}
        <div class="side-card">
          <b>Streamlit 部署版</b>
          <p>测试记录、每日任务和反馈保存在用户浏览器 localStorage。</p>
        </div>
      </aside>
      <main class="main">${pageHtml()}</main>
    </div>
  `;
  afterRender();
}
function pageHtml(){
  if(state.page === "test") return testPage();
  if(state.page === "plan") return planPage();
  if(state.page === "gallery") return galleryPage();
  if(state.page === "match") return matchPage();
  if(state.page === "history") return historyPage();
  return dashboardPage();
}
function afterRender(){
  if(state.page === "test") bindTest();
  if(state.page === "plan") bindPlan();
  if(state.page === "gallery") bindGallery();
  if(state.page === "match") bindMatch();
  if(state.page === "history") bindHistory();
  if(document.getElementById("radarCanvas")){
    const res = lastResult();
    if(res) drawRadar("radarCanvas", res.score, persona(res.code).color);
  }
}

function dashboardPage(){
  const res = lastResult();
  const p = res ? persona(res.code) : null;
  const taskInfo = todayTaskInfo();
  return `
    <section class="hero">
      <span class="pill">Fitness Persona Web App</span>
      <h1>你不是不健身，<br>你只是还没找到自己的健身物种。</h1>
      <p>这是一套“健身人格抽象测试 + 每日任务 + 结果记录 + 搭子匹配”的轻量 Web App。适合先做 Demo，后面再升级小程序或接数据库。</p>
      <div class="actions">
        <button class="primary" onclick="startTest()">开始测试</button>
        <button onclick="go('gallery')">查看图鉴</button>
      </div>
    </section>

    <section class="grid four">
      <div class="card stat"><span>最近人格</span><b>${res ? res.code : "--"}</b><p>${p ? p.name : "还未测试"}</p></div>
      <div class="card stat"><span>测试次数</span><b>${state.history.length}</b><p>本地历史记录</p></div>
      <div class="card stat"><span>今日任务</span><b>${taskInfo.done}/${taskInfo.total}</b><p>像背单词一样打卡</p></div>
      <div class="card stat"><span>连续打卡</span><b>${streak()}</b><p>streak days</p></div>
    </section>

    <section class="grid two">
      <div class="card">
        <span class="pill">你的当前画像</span>
        ${p ? resultMini(res) : `<div class="empty">完成一次测试后，这里会展示你的人格、建议和今日任务。</div>`}
      </div>
      <div class="card">
        <span class="pill">今日轻任务</span>
        <h2>每天一点点，比突然猛练更重要</h2>
        <div class="tasks">${taskList(false)}</div>
        <div class="actions"><button onclick="go('plan')">进入任务页</button></div>
      </div>
    </section>
  `;
}
function resultMini(res){
  const p = persona(res.code);
  return `
    <div class="mini-result">
      <div class="emoji" style="background:${hexToRgba(p.color,.25)}">${p.emoji}</div>
      <div>
        <h2>${res.code}｜${p.name}</h2>
        <p>${p.quote}</p>
        <div class="tags">${p.tags.map(t=>`<span>#${t}</span>`).join("")}</div>
      </div>
    </div>
    <div class="actions">
      <button class="primary" onclick="downloadPoster('${res.id}')">下载海报</button>
      <button onclick="copyResult('${res.id}')">复制文案</button>
    </div>
  `;
}

window.startTest = function(){
  state.qIndex = 0;
  state.answers = [];
  state.page = "test";
  saveState();
  render();
};

function testPage(){
  if(state.answers.length >= DATA.questions.length) return completeTest();
  const q = DATA.questions[state.qIndex];
  const progress = Math.round(state.answers.length / DATA.questions.length * 100);
  return `
    <section class="card question-card">
      <div class="progress-row"><span>Q${state.qIndex+1}/${DATA.questions.length} · ${q.axis}</span><span>${progress}%</span></div>
      <div class="progress"><i style="width:${progress}%"></i></div>
      <h1>${q.q}</h1>
      <div class="options">
        ${q.a.map((o,i)=>`<button class="option" data-pick="${i}"><b>${o.t}</b><span>${o.h}</span></button>`).join("")}
      </div>
      <div class="actions">
        <button ${state.qIndex===0?"disabled":""} onclick="prevQuestion()">上一题</button>
        <button onclick="startTest()">重新开始</button>
      </div>
    </section>
  `;
}
function bindTest(){
  document.querySelectorAll("[data-pick]").forEach(btn=>{
    btn.onclick = () => {
      state.answers[state.qIndex] = Number(btn.dataset.pick);
      state.qIndex += 1;
      saveState();
      render();
    };
  });
}
window.prevQuestion = function(){
  if(state.qIndex > 0){
    state.qIndex -= 1;
    state.answers = state.answers.slice(0, state.qIndex);
    saveState();
    render();
  }
};
function completeTest(){
  const score = scoreAnswers();
  const code = getCode(score);
  const id = "r" + Date.now();
  const res = {id, code, score, time: Date.now()};
  state.history.unshift(res);
  state.history = state.history.slice(0, 30);
  state.qIndex = 0;
  state.answers = [];
  saveState();
  state.page = "dashboard";
  saveState();
  return resultPage(res);
}
function resultPage(res){
  const p = persona(res.code);
  return `
    <section class="grid two result-grid">
      <div class="poster" style="background:linear-gradient(150deg, ${hexToRgba(p.color,.32)}, rgba(255,249,240,.92));">
        <span class="code">${res.code}</span>
        <div class="big-emoji">${p.emoji}</div>
        <h1>${p.name}</h1>
        <p class="quote">“${p.quote}”</p>
        <canvas id="radarCanvas" width="440" height="440"></canvas>
      </div>
      <div class="card">
        <span class="pill">测试完成</span>
        <h1>${p.name}</h1>
        <p>${p.summary}</p>
        ${dimensionBars(res.score)}
        <div class="info-box"><b>高光行为</b><p>${p.strength}</p></div>
        <div class="info-box"><b>危险误区</b><p>${p.trap}</p></div>
        <div class="info-box"><b>轻量建议</b><p>${p.advice}</p></div>
        <div class="actions">
          <button class="primary" onclick="downloadPoster('${res.id}')">下载海报</button>
          <button onclick="copyResult('${res.id}')">复制文案</button>
          <button onclick="go('plan')">生成今日任务</button>
        </div>
      </div>
    </section>
  `;
}
function dimensionBars(score){
  return `<div class="bars">${DATA.pairs.map(([a,b])=>{
    const value = pct(score,a,b);
    return `<div class="barline"><b>${DATA.dimensions[a].label}</b><div><i style="width:${value}%"></i></div><b>${DATA.dimensions[b].label}</b></div>`;
  }).join("")}</div>`;
}

function planPage(){
  const res = lastResult();
  const p = res ? persona(res.code) : null;
  return `
    <section class="grid two">
      <div class="card">
        <span class="pill">Daily Mission</span>
        <h1>今日任务</h1>
        <p>按你最近一次人格生成轻量任务。目标不是卷，是不断线。</p>
        ${p ? resultMini(res) : `<div class="empty">还没测试，先完成一次人格测试会更准。</div>`}
      </div>
      <div class="card stat"><span>今日完成度</span><b>${todayTaskInfo().done}/${todayTaskInfo().total}</b><p>${today()}</p></div>
    </section>
    <section class="card">
      <h2>任务清单</h2>
      <div class="tasks">${taskList(true)}</div>
      <div class="actions"><button onclick="resetToday()">重置今日</button></div>
    </section>
    <section class="card">
      <h2>今日身体反馈</h2>
      <textarea id="note" placeholder="例如：今天肩颈轻松一点；训练前很累，但走完路之后状态变好了。"></textarea>
      <div class="actions"><button class="primary" onclick="saveNote()">保存反馈</button></div>
    </section>
  `;
}
function currentDaily(){
  const res = lastResult();
  return res ? persona(res.code).daily : ["走路 15 分钟","拉伸 8 分钟","写一句身体反馈"];
}
function todayTaskInfo(){
  const key = today();
  const doneMap = state.tasks[key] || {};
  const tasks = currentDaily();
  return {total: tasks.length, done: tasks.filter((_,i)=>doneMap[i]).length};
}
function taskList(interactive){
  const key = today();
  const doneMap = state.tasks[key] || {};
  return currentDaily().map((t,i)=>`
    <div class="task">
      <button class="check ${doneMap[i]?"done":""}" ${interactive ? `data-task="${i}"` : "disabled"}>${doneMap[i]?"✓":""}</button>
      <div><b>${t}</b><p>${doneMap[i] ? "已完成" : "待完成"}</p></div>
    </div>
  `).join("");
}
function bindPlan(){
  document.querySelectorAll("[data-task]").forEach(btn=>{
    btn.onclick = () => {
      const key = today();
      state.tasks[key] = state.tasks[key] || {};
      const i = btn.dataset.task;
      state.tasks[key][i] = !state.tasks[key][i];
      saveState();
      render();
    };
  });
}
window.resetToday = function(){
  state.tasks[today()] = {};
  saveState(); render();
};
window.saveNote = function(){
  const text = document.getElementById("note").value.trim();
  if(!text) return alert("先写一点反馈再保存。");
  state.notes.unshift({time: Date.now(), text});
  state.notes = state.notes.slice(0,50);
  saveState();
  alert("已保存。");
  render();
};
function streak(){
  let count = 0;
  const d = new Date();
  for(let i=0;i<365;i++){
    const key = d.toISOString().slice(0,10);
    if(state.tasks[key] && Object.values(state.tasks[key]).some(Boolean)){
      count++;
      d.setDate(d.getDate()-1);
    } else break;
  }
  return count;
}

function galleryPage(){
  return `
    <section class="card">
      <span class="pill">Persona Gallery</span>
      <h1>16 种健身抽象人格</h1>
      <input id="search" placeholder="搜索：松弛 / 搭子 / RASL" />
      <div class="persona-grid">
        ${Object.entries(DATA.personas).map(([code,p])=>`
          <div class="persona-card" data-code="${code}" style="background:linear-gradient(150deg, ${hexToRgba(p.color,.22)}, rgba(255,249,240,.86));">
            <div class="emoji">${p.emoji}</div><span>${code}</span><h2>${p.name}</h2><p>${p.quote}</p>
            <div class="tags">${p.tags.map(t=>`<i>#${t}</i>`).join("")}</div>
          </div>
        `).join("")}
      </div>
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
    card.onclick = () => openPersona(card.dataset.code);
  });
}
function openPersona(code){
  const p = persona(code);
  alert(`${code}｜${p.name}\n\n${p.quote}\n\n${p.summary}\n\n建议：${p.advice}`);
}

function matchPage(){
  const res = lastResult();
  return `
    <section class="grid two">
      <div class="card">
        <span class="pill">Gym Buddy Match</span>
        <h1>健身搭子匹配</h1>
        <p>输入两个四字母人格代码，看看你们适合一起撸铁、散步、团课还是互相劝退。</p>
        <input id="codeA" maxlength="4" placeholder="你的代码，例如 VASL" value="${res ? res.code : ""}">
        <input id="codeB" maxlength="4" placeholder="搭子的代码，例如 RFSG">
        <div class="actions"><button class="primary" id="matchBtn">生成匹配报告</button></div>
      </div>
      <div class="card" id="matchResult"><div class="empty">匹配结果会显示在这里。</div></div>
    </section>
  `;
}
function bindMatch(){
  ["codeA","codeB"].forEach(id=>{
    document.getElementById(id).oninput = e => e.target.value = e.target.value.toUpperCase().replace(/[^RVFACSGL]/g,"").slice(0,4);
  });
  document.getElementById("matchBtn").onclick = () => {
    const a = document.getElementById("codeA").value;
    const b = document.getElementById("codeB").value;
    const box = document.getElementById("matchResult");
    if(!DATA.personas[a] || !DATA.personas[b]){
      box.innerHTML = `<div class="empty">请输入有效代码，例如 VASL、RFSG、RACG。</div>`;
      return;
    }
    const same = [...a].filter((ch,i)=>ch===b[i]).length;
    const score = Math.min(96, 40 + same * 13 + (a[2]!==b[2]?5:0) + (a[3]===b[3]?5:0));
    const text = same===4 ? "同物种高频共振，适合一起建立固定习惯。" :
      a[3]!==b[3] ? "一个去场馆，一个在生活里移动，建议从散步/拉伸开始。" :
      a[2]!==b[2] ? "一人开麦，一人戴耳机，适合同场不同练。" :
      "可以一起动，但别互相改造。";
    box.innerHTML = `<span class="pill">${persona(a).name} × ${persona(b).name}</span><h1 class="score">${score}%</h1><p>${text}</p>`;
  };
}

function historyPage(){
  return `
    <section class="card">
      <span class="pill">History</span>
      <h1>历史记录</h1>
      <div class="actions">
        <button class="primary" onclick="exportData()">导出 JSON</button>
        <button onclick="clearHistory()">清空历史</button>
      </div>
      <div class="history-list">
        ${state.history.length ? state.history.map(res=>{
          const p = persona(res.code);
          return `<div class="history-item"><div class="emoji">${p.emoji}</div><div><b>${res.code}｜${p.name}</b><p>${formatTime(res.time)}</p></div><button onclick="downloadPoster('${res.id}')">海报</button></div>`;
        }).join("") : `<div class="empty">暂无历史记录。</div>`}
      </div>
    </section>
    <section class="card">
      <h2>身体反馈记录</h2>
      <div class="history-list">
        ${state.notes.length ? state.notes.map(n=>`<div class="history-item"><div class="emoji">📝</div><div><b>${formatTime(n.time)}</b><p>${escapeHtml(n.text)}</p></div></div>`).join("") : `<div class="empty">暂无反馈。</div>`}
      </div>
    </section>
  `;
}
function bindHistory(){}

window.exportData = function(){
  const blob = new Blob([JSON.stringify(state,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `fitpersona-data-${today()}.json`;
  a.click();
};
window.clearHistory = function(){
  if(confirm("确定清空历史记录？")){
    state.history = [];
    saveState(); render();
  }
};
window.copyResult = function(id){
  const res = state.history.find(x=>x.id===id) || lastResult();
  if(!res) return;
  const p = persona(res.code);
  navigator.clipboard.writeText(`我的健身人格是 ${res.code}｜${p.name}：${p.quote} #健身人格抽象图鉴`)
    .then(()=>alert("已复制"))
    .catch(()=>alert("复制失败，可以手动截图"));
};

window.downloadPoster = function(id){
  const res = state.history.find(x=>x.id===id) || lastResult();
  if(!res) return;
  const p = persona(res.code);
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 1500;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#F6EFE7"; ctx.fillRect(0,0,1080,1500);
  ctx.fillStyle = hexToRgba(p.color,.36); ctx.beginPath(); ctx.arc(160,140,360,0,Math.PI*2); ctx.fill();
  round(ctx,70,78,940,1344,62,"rgba(255,249,240,.92)");
  drawText(ctx,res.code,130,170,34,900,"#FFF9F0","#463B34");
  text(ctx,"FitPersona 健身人格抽象图鉴",130,270,40,900,"#463B34");
  text(ctx,"我的健身物种是",130,340,32,800,"#817269");
  text(ctx,p.name,130,455,86,950,"#463B34");
  text(ctx,p.emoji,790,390,130,900,"#463B34");
  wrap(ctx,`“${p.quote}”`,130,555,820,48,38,"#463B34",850);
  wrap(ctx,p.summary,130,720,820,38,28,"#817269",520);
  let y = 920;
  DATA.pairs.forEach(([a,b])=>{
    const value = pct(res.score,a,b);
    text(ctx,DATA.dimensions[a].label,130,y,28,850,"#463B34");
    ctx.textAlign = "right"; text(ctx,DATA.dimensions[b].label,950,y,28,850,"#463B34"); ctx.textAlign = "left";
    round(ctx,130,y+25,820,24,12,"rgba(70,59,52,.08)");
    round(ctx,130,y+25,820*value/100,24,12,p.color);
    y += 82;
  });
  wrap(ctx,`轻量建议：${p.advice}`,130,1250,820,38,28,"#463B34",760);
  wrap(ctx,p.tags.map(t=>`#${t}`).join("  "),130,1385,820,32,24,"#817269",700);
  text(ctx,"结果仅供娱乐与习惯建议，不是医学或专业运动诊断。",130,1445,22,520,"#A39389");
  const a = document.createElement("a");
  a.download = `FitPersona-${res.code}-${p.name}.png`;
  a.href = canvas.toDataURL("image/png");
  a.click();
};
function text(ctx,str,x,y,size,weight,color){
  ctx.fillStyle=color; ctx.font=`${weight} ${size}px system-ui, Microsoft YaHei, sans-serif`; ctx.textBaseline="alphabetic"; ctx.fillText(str,x,y);
}
function drawText(ctx,str,x,y,size,weight,color,bg){
  ctx.font=`${weight} ${size}px system-ui`; const w=ctx.measureText(str).width+44;
  round(ctx,x,y-44,w,58,29,bg); text(ctx,str,x+22,y-5,size,weight,color);
}
function wrap(ctx,str,x,y,maxW,lineH,size,color,weight){
  ctx.fillStyle=color; ctx.font=`${weight} ${size}px system-ui, Microsoft YaHei, sans-serif`;
  let line="", cy=y;
  [...str].forEach((ch,i)=>{
    const test=line+ch;
    if(ctx.measureText(test).width>maxW && line){ ctx.fillText(line,x,cy); line=ch; cy+=lineH; }
    else line=test;
    if(i===[...str].length-1) ctx.fillText(line,x,cy);
  });
}
function round(ctx,x,y,w,h,r,fill){
  ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); ctx.fillStyle=fill; ctx.fill();
}

function drawRadar(id, score, color){
  const c = document.getElementById(id); if(!c) return;
  const ctx = c.getContext("2d"); const cx=c.width/2, cy=c.height/2, maxR=145;
  ctx.clearRect(0,0,c.width,c.height);
  for(let level=4; level>=1; level--){
    poly(ctx,cx,cy,maxR/4*level,4);
    ctx.fillStyle="rgba(255,249,240,.55)"; ctx.fill(); ctx.strokeStyle="rgba(70,59,52,.16)"; ctx.stroke();
  }
  const axes = [["计划",pct(score,"R","V")],["功能",pct(score,"F","A")],["社交",pct(score,"C","S")],["场馆",pct(score,"G","L")]];
  ctx.beginPath();
  axes.forEach((a,i)=>{
    const ang=-Math.PI/2+i*Math.PI*2/4, r=maxR*a[1]/100, x=cx+Math.cos(ang)*r, y=cy+Math.sin(ang)*r;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  });
  ctx.closePath(); ctx.fillStyle=hexToRgba(color,.5); ctx.fill(); ctx.strokeStyle="#463B34"; ctx.lineWidth=3; ctx.stroke();
  axes.forEach((a,i)=>{
    const ang=-Math.PI/2+i*Math.PI*2/4;
    ctx.fillStyle="#463B34"; ctx.font="800 22px system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(a[0],cx+Math.cos(ang)*(maxR+35),cy+Math.sin(ang)*(maxR+35));
  });
}
function poly(ctx,cx,cy,r,n){
  ctx.beginPath();
  for(let i=0;i<n;i++){
    const ang=-Math.PI/2+i*Math.PI*2/n, x=cx+Math.cos(ang)*r, y=cy+Math.sin(ang)*r;
    i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  ctx.closePath();
}

render();