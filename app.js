
const app = document.getElementById("app");

let state = {
  i:0,
  score:{R:0,V:0,F:0,A:0,C:0,S:0,G:0,L:0}
};

function render(){
  if(state.i>=QUESTIONS.length){
    return result();
  }

  const q = QUESTIONS[state.i];

  app.innerHTML = `
    <div class="card">
      <h2>${q.q}</h2>
      ${q.a.map((o,idx)=>`
        <button onclick="pick(${idx})">${o.t}</button>
      `).join("")}
    </div>
  `;
}

window.pick = function(idx){
  const opt = QUESTIONS[state.i].a[idx];
  for(const k in opt.s){
    state.score[k] += opt.s[k];
  }
  state.i++;
  render();
}

function code(){
  const pairs = [["R","V"],["F","A"],["C","S"],["G","L"]];
  return pairs.map(([a,b])=>state.score[a]>=state.score[b]?a:b).join("");
}

function result(){
  const c = code();
  const history = JSON.parse(localStorage.getItem("history")||"[]");
  history.push({c,time:Date.now()});
  localStorage.setItem("history",JSON.stringify(history));

  const p = PERSONAS[c] || {name:"未知",emoji:"?"};

  app.innerHTML = `
    <div class="card">
      <h1>${p.emoji} ${p.name}</h1>
      <p>你的代码：${c}</p>
      <button onclick="location.reload()">再测一次</button>
      <button onclick="exportData()">导出记录</button>
      <button onclick="showHistory()">历史</button>
    </div>
  `;
}

window.exportData = function(){
  const data = localStorage.getItem("history");
  const blob = new Blob([data],{type:"application/json"});
  const a=document.createElement("a");
  a.href=URL.createObjectURL(blob);
  a.download="fitness-history.json";
  a.click();
}

window.showHistory = function(){
  const h = JSON.parse(localStorage.getItem("history")||"[]");
  alert("测试次数："+h.length);
}

render();
