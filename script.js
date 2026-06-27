const DIMENSION_META = {
  R: { label: "计划流", pair: "R/V", description: "稳定训练周期、记录、渐进" },
  V: { label: "氛围流", pair: "R/V", description: "看状态、看心情、低压力行动" },
  F: { label: "功能派", pair: "F/A", description: "体能、睡眠、耐力、恢复" },
  A: { label: "视觉派", pair: "F/A", description: "体态、线条、穿搭、镜子反馈" },
  C: { label: "搭子派", pair: "C/S", description: "团课、搭子、社群、互相监督" },
  S: { label: "独练派", pair: "C/S", description: "耳机、安静、个人节奏" },
  G: { label: "场馆派", pair: "G/L", description: "健身房、器械、课程、正式训练" },
  L: { label: "生活派", pair: "G/L", description: "居家、通勤、户外、碎片运动" }
};

const QUESTIONS = [
  {
    id: 1,
    axis: "训练组织方式",
    text: "你最可能因为什么开始运动？",
    options: [
      { text: "我想建立一个稳定训练周期。", hint: "有计划才有安全感。", score: { R: 1 } },
      { text: "最近状态不太行，先动起来再说。", hint: "行动比完美计划重要。", score: { V: 1 } }
    ]
  },
  {
    id: 2,
    axis: "训练组织方式",
    text: "你打开健身 App 最想看到什么？",
    options: [
      { text: "本周训练计划和完成率。", hint: "完成率是一种精神奖励。", score: { R: 1 } },
      { text: "今天适合我状态的随机推荐。", hint: "让我今天别太痛苦就行。", score: { V: 1 } }
    ]
  },
  {
    id: 3,
    axis: "训练组织方式",
    text: "你最讨厌哪种健身状态？",
    options: [
      { text: "练了很久但没有进步逻辑。", hint: "不能白练，必须可追踪。", score: { R: 1 } },
      { text: "计划太死，像给自己上班。", hint: "健身不是再开一个班。", score: { V: 1 } }
    ]
  },
  {
    id: 4,
    axis: "训练组织方式",
    text: "你断练一周后会怎么想？",
    options: [
      { text: "需要重新安排周期。", hint: "从恢复计划开始重启。", score: { R: 1 } },
      { text: "没事，身体需要休息，明天再说。", hint: "人生本来就有波动。", score: { V: 1 } }
    ]
  },
  {
    id: 5,
    axis: "目标语言",
    text: "你更在意哪种变化？",
    options: [
      { text: "能跑更久、蹲更稳、睡得更好。", hint: "身体好用是第一目标。", score: { F: 1 } },
      { text: "体态更好、线条更清楚、穿衣更顺。", hint: "状态被看见也很重要。", score: { A: 1 } }
    ]
  },
  {
    id: 6,
    axis: "目标语言",
    text: "你看到一个训练动作，第一反应是？",
    options: [
      { text: "它练哪块？对功能有什么帮助？", hint: "动作背后的收益很关键。", score: { F: 1 } },
      { text: "它能不能改善体态或线条？", hint: "动作要服务整体气质。", score: { A: 1 } }
    ]
  },
  {
    id: 7,
    axis: "目标语言",
    text: "你更愿意记录什么？",
    options: [
      { text: "重量、次数、心率、步数、睡眠。", hint: "数据会让努力变清楚。", score: { F: 1 } },
      { text: "围度、照片、体态、穿搭状态。", hint: "镜子也可以是记录工具。", score: { A: 1 } }
    ]
  },
  {
    id: 8,
    axis: "目标语言",
    text: "你最想得到哪种反馈？",
    options: [
      { text: "你的体能比上个月提升了。", hint: "这是真正的进步。", score: { F: 1 } },
      { text: "你整个人状态看起来更好了。", hint: "这句话可以撑一整天。", score: { A: 1 } }
    ]
  },
  {
    id: 9,
    axis: "社交半径",
    text: "你更喜欢哪种运动场景？",
    options: [
      { text: "有搭子、有团课、有气氛。", hint: "有人一起才更容易开始。", score: { C: 1 } },
      { text: "一个人安静练，别打扰我。", hint: "耳机一戴，世界暂停。", score: { S: 1 } }
    ]
  },
  {
    id: 10,
    axis: "社交半径",
    text: "你最容易坚持哪种方式？",
    options: [
      { text: "和别人约好，不好意思鸽。", hint: "社交压力也是生产力。", score: { C: 1 } },
      { text: "自己安排，不被别人影响。", hint: "我的节奏我自己守。", score: { S: 1 } }
    ]
  },
  {
    id: 11,
    axis: "社交半径",
    text: "你发运动动态的原因更像是？",
    options: [
      { text: "找同好、互相鼓励、顺便记录。", hint: "运动也可以是一种连接。", score: { C: 1 } },
      { text: "只是存档，不太需要别人评价。", hint: "我发了，但不是给你审判的。", score: { S: 1 } }
    ]
  },
  {
    id: 12,
    axis: "社交半径",
    text: "健身房里你最怕什么？",
    options: [
      { text: "没人一起练，气氛太冷。", hint: "孤独感会劝退我。", score: { C: 1 } },
      { text: "太多人看我、问我、打扰我。", hint: "请让我安静做一只运动生物。", score: { S: 1 } }
    ]
  },
  {
    id: 13,
    axis: "运动场域",
    text: "你觉得“正式运动”更像什么？",
    options: [
      { text: "去健身房或场馆，换衣服，进入状态。", hint: "仪式感让我认真起来。", score: { G: 1 } },
      { text: "在生活里完成，走路、拉伸、居家练也算。", hint: "能动起来就已经很好。", score: { L: 1 } }
    ]
  },
  {
    id: 14,
    axis: "运动场域",
    text: "你更容易被什么吸引？",
    options: [
      { text: "器械、重量、课程、训练空间。", hint: "场馆本身就是氛围。", score: { G: 1 } },
      { text: "通勤步数、居家垫子、户外路线。", hint: "生活缝隙就是训练场。", score: { L: 1 } }
    ]
  },
  {
    id: 15,
    axis: "运动场域",
    text: "你买运动装备更可能买？",
    options: [
      { text: "手套、腰带、训练鞋、速干衣。", hint: "装备是认真训练的开关。", score: { G: 1 } },
      { text: "手环、瑜伽垫、筋膜球、舒适运动鞋。", hint: "舒适和可持续更重要。", score: { L: 1 } }
    ]
  },
  {
    id: 16,
    axis: "运动场域",
    text: "你理想的一周运动是？",
    options: [
      { text: "固定几次去健身房。", hint: "把训练放进日程表。", score: { G: 1 } },
      { text: "每天都用小动作攒一点。", hint: "不求完美，但求不断线。", score: { L: 1 } }
    ]
  }
];

const RESULTS = {
  RFCG: {
    name: "铁馆指挥官",
    emoji: "🧭",
    color: "#c9a58f",
    quote: "训练计划写得像项目排期，搭子只是你的执行部门。",
    summary: "你适合清晰、稳定、可追踪的训练系统。你喜欢把动作、重量、次数和恢复都纳入安排，一旦进入节奏，就会越练越稳。",
    strength: "执行力强、适合长期进阶，也很适合带朋友入门。",
    trap: "容易把每次训练都变成任务，忽略身体疲劳和情绪波动。",
    advice: "保留主计划，但每周给自己一个“低压力训练日”，只要求完成，不要求完美。",
    tags: ["计划流", "场馆派", "搭子队长", "训练排期"]
  },
  RFCL: {
    name: "城市体能队长",
    emoji: "🚶",
    color: "#aeb9a0",
    quote: "今天走路，明天骑行，后天拉伸，整座城市都是你的训练场。",
    summary: "你重视身体功能，也擅长把运动安排进生活。你不一定每天去健身房，但会努力让身体保持在线。",
    strength: "可持续性强，容易把运动变成生活方式。",
    trap: "可能什么都做一点，但缺少阶段性重点。",
    advice: "每月选一个主目标：心肺、力量或灵活性。其他运动作为辅助，不要同时追太多。",
    tags: ["城市运动", "体能派", "搭子友好", "低压力坚持"]
  },
  RFSG: {
    name: "深蹲修行僧",
    emoji: "🏋️",
    color: "#b7aa9b",
    quote: "耳机、记录本、深蹲架，是你的健身房三件套。",
    summary: "你是典型的安静进阶型选手。比起热闹，你更喜欢自己和数字较劲，在一次次重复里找到稳定感。",
    strength: "专注度高，进步路径清楚，抗干扰能力强。",
    trap: "容易陷入单一训练目标，对恢复、拉伸和情绪管理不够重视。",
    advice: "每周固定一次恢复训练，把拉伸、低强度有氧和睡眠也纳入训练成果。",
    tags: ["独练派", "力量进阶", "耳机结界", "稳定输出"]
  },
  RFSL: {
    name: "数据养生师",
    emoji: "⌚",
    color: "#a8b7c9",
    quote: "你的手表比朋友更懂你，心率、步数、睡眠都要被温柔管理。",
    summary: "你喜欢通过数据理解身体，也愿意用轻量行动改善生活状态。你不是盲目卷，而是想让自己更健康、更稳定。",
    strength: "自我观察能力强，适合建立长期健康习惯。",
    trap: "容易被数据牵着走，某天没完成就开始焦虑。",
    advice: "给数据设置弹性区间，不要只看单日表现，更要看一周趋势。",
    tags: ["数据控", "生活派", "健康管理", "温和自律"]
  },
  RACG: {
    name: "镜前团课导演",
    emoji: "🪩",
    color: "#d9aaa7",
    quote: "练得认真，穿得完整，拍照角度也不能输。",
    summary: "你在运动里追求状态感、画面感和社交氛围。你会被好看的课程、空间、穿搭和同伴激励。",
    strength: "很会制造氛围，也容易带动朋友一起行动。",
    trap: "可能过度在意外部反馈，忘了身体真正的感受。",
    advice: "拍照和打卡都可以保留，但每次训练后加一句身体感受记录，而不只是看照片。",
    tags: ["团课", "镜前状态", "视觉派", "气氛担当"]
  },
  RACL: {
    name: "轻盈打卡策展人",
    emoji: "📒",
    color: "#dfc7bd",
    quote: "你不是在运动，你是在策展一种健康生活方式。",
    summary: "你擅长把运动、饮食、穿搭、散步和日常记录组合成一套轻盈的生活叙事。",
    strength: "审美强、表达力强，容易把习惯做得好看又可持续。",
    trap: "容易把记录本身当成目标，实际运动量反而被稀释。",
    advice: "每周保留两个必须完成的核心动作，其余内容都可以自由装饰。",
    tags: ["手账健身", "低饱和生活", "打卡", "健康策展"]
  },
  RASG: {
    name: "体态雕塑师",
    emoji: "🗿",
    color: "#cbb7a2",
    quote: "每一个动作都要对称，每一块肌肉都要有交代。",
    summary: "你关注线条、体态、局部控制和训练细节。你适合有结构的塑形训练，也很容易在细节里获得成就感。",
    strength: "动作意识强，审美敏感，适合长期体态优化。",
    trap: "容易对局部变化过度敏感，放大身体缺点。",
    advice: "把目标从“哪里不够好”改成“哪个动作更稳定”，训练会更健康。",
    tags: ["体态", "塑形", "动作细节", "场馆训练"]
  },
  RASL: {
    name: "垫上美学研究员",
    emoji: "🧘",
    color: "#d7cdbf",
    quote: "普拉提、拉伸、体态矫正，是你的私人精神花园。",
    summary: "你追求一种温和、干净、有秩序的身体状态。比起爆汗，你更喜欢细腻控制和慢慢变好的感觉。",
    strength: "稳定、细致，适合长期体态管理和柔韧训练。",
    trap: "可能低估力量训练的重要性。",
    advice: "在垫上训练之外，每周加入两次基础力量动作，例如深蹲、划船、臀桥或推举。",
    tags: ["普拉提感", "体态管理", "居家垫上", "慢变好"]
  },
  VFCG: {
    name: "随缘撸铁搭子王",
    emoji: "🤝",
    color: "#bfc6b2",
    quote: "你不一定有计划，但你总能把朋友喊到健身房。",
    summary: "你重视身体变强，也喜欢有人一起动起来。你未必最自律，但很会用社交气氛点燃行动。",
    strength: "感染力强，适合组局、约练、拉新人。",
    trap: "容易因为搭子没空就一起摆烂。",
    advice: "准备一个“没人陪也能做”的30分钟备用训练，避免完全断线。",
    tags: ["搭子王", "氛围流", "撸铁局", "一起变强"]
  },
  VFCL: {
    name: "运动游牧民",
    emoji: "🧳",
    color: "#aeb9a0",
    quote: "今天飞盘，明天徒步，后天骑行，哪里有局你在哪里。",
    summary: "你不喜欢被单一运动困住。你通过不断尝试新场景、新朋友和新路线来保持活力。",
    strength: "探索欲强，不容易厌倦，运动体验丰富。",
    trap: "缺少持续刺激后，容易突然停摆。",
    advice: "保持探索，但给自己一个底线：每周至少一次力量训练，保护关节和基础体能。",
    tags: ["户外", "运动搭子", "新鲜感", "生活派"]
  },
  VFSG: {
    name: "耳机区黑熊",
    emoji: "🐻",
    color: "#b7aa9b",
    quote: "看起来很随缘，其实默默把重量加上去了。",
    summary: "你不一定爱讲计划，但一进健身房就会进入自己的节奏。你喜欢低社交、高沉浸的训练状态。",
    strength: "不张扬但能坚持，适合安静积累。",
    trap: "容易凭感觉训练，进步和疲劳都没有被记录。",
    advice: "不用写复杂计划，只记录三个数：动作、重量、主观疲劳感。",
    tags: ["耳机结界", "隐形高手", "场馆派", "低调训练"]
  },
  VFSL: {
    name: "工位拉伸小妖怪",
    emoji: "🪑",
    color: "#c7d0bc",
    quote: "不去健身房也能动，主打一个随时随地抢救身体。",
    summary: "你很适合碎片化运动。你不一定追求大目标，但会在肩颈酸痛、久坐疲惫、精神卡顿时主动自救。",
    strength: "启动门槛低，适合长期维持基础活力。",
    trap: "容易永远停留在“轻轻动一下”，缺少真正的强度。",
    advice: "每天轻量自救很好，但每周至少安排一次让你微微喘、微微累的训练。",
    tags: ["工位拉伸", "碎片运动", "久坐自救", "低门槛"]
  },
  VACG: {
    name: "氛围燃脂星人",
    emoji: "✨",
    color: "#d9aaa7",
    quote: "音乐、灯光、团课、汗水，缺一不可。",
    summary: "你很容易被气氛点燃，也很擅长从运动里获得快乐、释放和社交能量。",
    strength: "行动启动快，适合团课、有氧、舞蹈和高氛围运动。",
    trap: "容易追求爆汗爽感，忽视力量、恢复和动作质量。",
    advice: "保留你喜欢的高氛围训练，但每周加一次慢速力量或拉伸，平衡身体负荷。",
    tags: ["团课", "爆汗", "音乐驱动", "气氛感"]
  },
  VACL: {
    name: "健康生活蒲公英",
    emoji: "🌼",
    color: "#dccaa7",
    quote: "什么都想试一点，晒背、散步、拉伸、打卡都能开花。",
    summary: "你把健身看作生活灵感，而不是硬核任务。你适合柔软、有变化、低压力的运动方式。",
    strength: "接受度高，容易被新鲜生活方式激励。",
    trap: "容易收藏很多，执行很少；尝试很多，沉淀很少。",
    advice: "每次只保留一个新习惯，连续做7天，再换下一个。",
    tags: ["生活方式", "轻量打卡", "新鲜感", "健康灵感"]
  },
  VASG: {
    name: "复古健身房幽灵",
    emoji: "👻",
    color: "#b8b2a8",
    quote: "穿得像临时路过，练得像秘密备赛。",
    summary: "你不想被过度精致的健身审美绑架，但你又确实在意状态和线条。你适合松弛外表下的稳定行动。",
    strength: "反内耗能力强，不太容易被表面气氛困住。",
    trap: "有时会用“我很松弛”掩盖训练不连续。",
    advice: "给自己设一个很低但真实的标准：到场、完成三组、记录一句，就算有效。",
    tags: ["gym goblin", "反精致", "隐形塑形", "松弛场馆"]
  },
  VASL: {
    name: "松弛自救生物",
    emoji: "☁️",
    color: "#d6dfeb",
    quote: "你不是不自律，你只是讨厌把人生过成训练营。",
    summary: "你需要的不是更严厉的计划，而是更温和的开始。运动对你来说像一种情绪修复和身体重启。",
    strength: "对身体感受敏感，适合低压力、可持续的健康改变。",
    trap: "容易把松弛变成完全不动，把明天再说变成下个月再说。",
    advice: "设一个最低行动：每天走路15分钟或拉伸8分钟。先不断线，再谈升级。",
    tags: ["松弛健身", "健康自救", "生活派", "低压力"]
  }
};

const PAIRS = [
  ["R", "V"],
  ["F", "A"],
  ["C", "S"],
  ["G", "L"]
];

const state = {
  index: 0,
  answers: new Array(QUESTIONS.length).fill(null)
};

const $ = (selector) => document.querySelector(selector);
const testApp = $("#testApp");
const galleryGrid = $("#galleryGrid");
const toast = $("#toast");

function init() {
  renderTest();
  renderGallery();
  bindGlobalEvents();
  loadLastResult();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }
}

function bindGlobalEvents() {
  $("#restartBtn").addEventListener("click", restart);
  $("#matchBtn").addEventListener("click", renderMatch);
  $("#codeA").addEventListener("input", sanitizeCodeInput);
  $("#codeB").addEventListener("input", sanitizeCodeInput);
}

function sanitizeCodeInput(event) {
  event.target.value = event.target.value.toUpperCase().replace(/[^RVFACSGL]/g, "").slice(0, 4);
}

function restart() {
  state.index = 0;
  state.answers = new Array(QUESTIONS.length).fill(null);
  localStorage.removeItem("fitnessPersonaLast");
  renderTest();
  location.hash = "test";
}

function renderTest() {
  const completed = state.answers.every((item) => item !== null);
  if (completed) {
    renderResult();
    return;
  }

  const q = QUESTIONS[state.index];
  const selected = state.answers[state.index];
  const progress = Math.round((state.answers.filter((item) => item !== null).length / QUESTIONS.length) * 100);

  testApp.innerHTML = `
    <div class="progress-wrap">
      <div class="progress" aria-label="测试进度">
        <div class="progress-bar" style="width:${progress}%"></div>
      </div>
      <div class="progress-label">${progress}%</div>
    </div>

    <article class="question-card">
      <div class="question-meta">Q${q.id} / ${QUESTIONS.length} · ${q.axis}</div>
      <h3 class="question-title">${q.text}</h3>
      <div class="option-grid">
        ${q.options.map((option, idx) => `
          <button class="option ${selected === idx ? "selected" : ""}" type="button" data-option="${idx}">
            <b>${option.text}</b>
            <span>${option.hint}</span>
          </button>
        `).join("")}
      </div>
      <div class="test-controls">
        <button class="button ghost" type="button" id="prevQuestion" ${state.index === 0 ? "disabled" : ""}>上一题</button>
        <button class="button primary" type="button" id="nextQuestion">${state.index === QUESTIONS.length - 1 ? "看结果" : "下一题"}</button>
      </div>
    </article>
  `;

  testApp.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => {
      state.answers[state.index] = Number(button.dataset.option);
      if (state.index < QUESTIONS.length - 1) {
        state.index += 1;
      }
      renderTest();
    });
  });

  $("#prevQuestion").addEventListener("click", () => {
    if (state.index > 0) {
      state.index -= 1;
      renderTest();
    }
  });

  $("#nextQuestion").addEventListener("click", () => {
    if (state.answers[state.index] === null) {
      showToast("先选一个更像你的答案。");
      return;
    }
    if (state.index < QUESTIONS.length - 1) {
      state.index += 1;
      renderTest();
    } else {
      renderResult();
    }
  });
}

function calculateScore() {
  const score = { R: 0, V: 0, F: 0, A: 0, C: 0, S: 0, G: 0, L: 0 };
  state.answers.forEach((answer, idx) => {
    if (answer === null) return;
    const optionScore = QUESTIONS[idx].options[answer].score;
    Object.entries(optionScore).forEach(([key, value]) => {
      score[key] += value;
    });
  });
  return score;
}

function getCode(score) {
  return PAIRS.map(([left, right]) => score[left] >= score[right] ? left : right).join("");
}

function getPairPercent(score, left, right) {
  const total = score[left] + score[right] || 1;
  return Math.round((score[left] / total) * 100);
}

function renderResult() {
  const score = calculateScore();
  const code = getCode(score);
  const result = RESULTS[code];

  const payload = { code, score, time: Date.now() };
  localStorage.setItem("fitnessPersonaLast", JSON.stringify(payload));

  testApp.innerHTML = `
    <div class="result-layout">
      <aside class="result-visual">
        <span class="result-code">${code}</span>
        <div class="result-emoji" style="background:${hexToRgba(result.color, 0.24)}">${result.emoji}</div>
        <canvas id="radarCanvas" class="radar" width="420" height="420" aria-label="人格四维雷达图"></canvas>
      </aside>

      <article class="result-info">
        <span class="pill">你的健身物种是</span>
        <h3>${result.name}</h3>
        <div class="quote">${result.quote}</div>
        <p>${result.summary}</p>

        <div class="tag-list">
          ${result.tags.map(tag => `<span class="tag">#${tag}</span>`).join("")}
        </div>

        <div class="info-grid">
          <div class="info-card">
            <b>高光行为</b>
            <p>${result.strength}</p>
          </div>
          <div class="info-card">
            <b>危险误区</b>
            <p>${result.trap}</p>
          </div>
          <div class="info-card">
            <b>轻量建议</b>
            <p>${result.advice}</p>
          </div>
          <div class="info-card">
            <b>四维倾向</b>
            <p>
              ${PAIRS.map(([l, r]) => `${DIMENSION_META[l].label}/${DIMENSION_META[r].label}：${getPairPercent(score, l, r)}%`).join("<br>")}
            </p>
          </div>
        </div>

        <div class="action-row">
          <button class="button primary" type="button" id="posterBtn">生成结果海报 PNG</button>
          <button class="button ghost" type="button" id="copyBtn">复制结果文案</button>
          <button class="button ghost" type="button" id="againBtn">重测一次</button>
        </div>
      </article>
    </div>
  `;

  drawRadar(score, result.color);

  $("#posterBtn").addEventListener("click", () => downloadPoster(code, result, score));
  $("#copyBtn").addEventListener("click", () => copyResultText(code, result));
  $("#againBtn").addEventListener("click", restart);
}

function loadLastResult() {
  try {
    const last = JSON.parse(localStorage.getItem("fitnessPersonaLast"));
    if (!last || !last.code || !RESULTS[last.code]) return;
    $("#codeA").value = last.code;
  } catch (error) {}
}

function renderGallery() {
  galleryGrid.innerHTML = Object.entries(RESULTS).map(([code, item]) => `
    <article class="gallery-card" style="background: linear-gradient(160deg, ${hexToRgba(item.color, 0.22)}, rgba(255,250,243,0.82));">
      <div class="gallery-top">
        <div class="gallery-emoji">${item.emoji}</div>
        <div class="code-mini">${code}</div>
      </div>
      <h3>${item.name}</h3>
      <p>${item.quote}</p>
      <div class="tag-list">
        ${item.tags.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");
}

function renderMatch() {
  const codeA = $("#codeA").value.toUpperCase();
  const codeB = $("#codeB").value.toUpperCase();
  const box = $("#matchResult");

  if (!RESULTS[codeA] || !RESULTS[codeB]) {
    box.innerHTML = `<p>请输入有效的四字母代码，例如 <b>VASL</b>、<b>RFSG</b>、<b>RACG</b>。可以先完成测试获得自己的代码。</p>`;
    return;
  }

  const sameCount = [...codeA].filter((char, idx) => char === codeB[idx]).length;
  const score = Math.min(96, 38 + sameCount * 13 + getSoftBonus(codeA, codeB));
  const relation = getRelationText(codeA, codeB, sameCount);

  box.innerHTML = `
    <span class="pill">${RESULTS[codeA].name} × ${RESULTS[codeB].name}</span>
    <div class="score-big">${score}%</div>
    <h3>${relation.title}</h3>
    <p>${relation.text}</p>
    <div class="tag-list">
      <span class="tag">共同点 ${sameCount}/4</span>
      <span class="tag">建议：${relation.advice}</span>
    </div>
  `;
}

function getSoftBonus(a, b) {
  let bonus = 0;
  if (a[2] !== b[2]) bonus += 5; // 社交互补
  if (a[0] !== b[0]) bonus += 4; // 计划/氛围互补
  if (a[3] === b[3]) bonus += 5; // 场景一致更容易约
  return bonus;
}

function getRelationText(a, b, sameCount) {
  if (sameCount === 4) {
    return {
      title: "同物种高频共振",
      text: "你们的运动逻辑非常接近，适合一起建立固定习惯。但也要注意，不要一起陷入同一个误区。",
      advice: "一起打卡"
    };
  }

  if (a[2] !== b[2] && a[3] === b[3]) {
    return {
      title: "一人开麦，一人戴耳机",
      text: "你们运动场景一致，但社交需求不同。很适合一起到场，然后各练各的，结束后再集合喝水复盘。",
      advice: "同场不同练"
    };
  }

  if (a[0] !== b[0] && a[1] === b[1]) {
    return {
      title: "一个定计划，一个救气氛",
      text: "你们目标相近，但行动方式不同。一个负责不跑偏，一个负责不无聊，是很实用的互补组合。",
      advice: "互补约练"
    };
  }

  if (a[3] !== b[3]) {
    return {
      title: "一个去场馆，一个在生活里移动",
      text: "你们对运动场景的想象不同。不要强行绑定，可以约低门槛项目，比如散步、拉伸、轻徒步。",
      advice: "先从散步开始"
    };
  }

  return {
    title: "可以一起动，但别互相改造",
    text: "你们有共同点，也有差异。最适合的方式是共享目标，不共享压力。",
    advice: "低压力同行"
  };
}

function drawRadar(score, color) {
  const canvas = $("#radarCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const maxR = 145;
  const axes = [
    { label: "计划", value: getPairPercent(score, "R", "V") },
    { label: "功能", value: getPairPercent(score, "F", "A") },
    { label: "社交", value: getPairPercent(score, "C", "S") },
    { label: "场馆", value: getPairPercent(score, "G", "L") }
  ];

  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(75,64,57,0.15)";
  ctx.fillStyle = "rgba(255,250,243,0.58)";

  for (let level = 4; level >= 1; level--) {
    const r = (maxR / 4) * level;
    drawPolygon(ctx, cx, cy, r, axes.length);
    ctx.fill();
    ctx.stroke();
  }

  axes.forEach((axis, idx) => {
    const angle = getAngle(idx, axes.length);
    const x = cx + Math.cos(angle) * (maxR + 28);
    const y = cy + Math.sin(angle) * (maxR + 28);
    ctx.fillStyle = "#4b4039";
    ctx.font = "700 22px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(axis.label, x, y);
  });

  ctx.beginPath();
  axes.forEach((axis, idx) => {
    const angle = getAngle(idx, axes.length);
    const r = maxR * (axis.value / 100);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = hexToRgba(color, 0.45);
  ctx.strokeStyle = "#4b4039";
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  axes.forEach((axis, idx) => {
    const angle = getAngle(idx, axes.length);
    const r = maxR * (axis.value / 100);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = "#4b4039";
    ctx.fill();
  });
}

function drawPolygon(ctx, cx, cy, r, sides) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = getAngle(i, sides);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function getAngle(index, total) {
  return -Math.PI / 2 + (index * Math.PI * 2) / total;
}

function copyResultText(code, result) {
  const text = `我的健身人格是 ${code}｜${result.name}\n${result.quote}\n#健身人格抽象图鉴 #${result.tags.join(" #")}`;
  navigator.clipboard.writeText(text)
    .then(() => showToast("结果文案已复制。"))
    .catch(() => showToast("复制失败，可以手动截图保存。"));
}

function downloadPoster(code, result, score) {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1500;
  const ctx = canvas.getContext("2d");

  drawRoundedRect(ctx, 0, 0, 1080, 1500, 0, "#f7f1ea");
  ctx.fillStyle = hexToRgba(result.color, 0.28);
  ctx.beginPath();
  ctx.arc(120, 120, 360, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(168,183,201,0.24)";
  ctx.beginPath();
  ctx.arc(980, 50, 360, 0, Math.PI * 2);
  ctx.fill();

  drawRoundedRect(ctx, 70, 76, 940, 1348, 58, "rgba(255,250,243,0.92)");
  strokeRoundedRect(ctx, 70, 76, 940, 1348, 58, "rgba(75,64,57,0.16)", 3);

  drawRoundedRect(ctx, 120, 126, 220, 62, 31, "#4b4039");
  drawText(ctx, code, 154, 168, 34, 900, "#fffaf3", 1.6);

  drawText(ctx, "健身人格抽象图鉴", 120, 254, 42, 900, "#4b4039", 1.2);
  drawText(ctx, "我的健身物种是", 120, 318, 32, 700, "#84756c", 1.2);
  drawText(ctx, result.name, 120, 410, 86, 950, "#4b4039", 0.9);

  drawText(ctx, result.emoji, 760, 310, 130, 800, "#4b4039", 1);
  wrapText(ctx, `“${result.quote}”`, 120, 520, 840, 48, 38, "#4b4039", 800);
  wrapText(ctx, result.summary, 120, 690, 840, 40, 30, "#84756c", 520);

  const pairRows = [
    ["计划流", "氛围流", getPairPercent(score, "R", "V")],
    ["功能派", "视觉派", getPairPercent(score, "F", "A")],
    ["搭子派", "独练派", getPairPercent(score, "C", "S")],
    ["场馆派", "生活派", getPairPercent(score, "G", "L")]
  ];

  let y = 890;
  pairRows.forEach(([left, right, percent]) => {
    drawText(ctx, `${left}`, 120, y, 30, 800, "#4b4039", 1);
    drawText(ctx, `${right}`, 838, y, 30, 800, "#4b4039", 1);
    drawRoundedRect(ctx, 120, y + 24, 840, 24, 12, "rgba(75,64,57,0.08)");
    drawRoundedRect(ctx, 120, y + 24, 840 * (percent / 100), 24, 12, result.color);
    y += 86;
  });

  wrapText(ctx, `轻量建议：${result.advice}`, 120, 1248, 840, 38, 28, "#4b4039", 750);
  drawText(ctx, result.tags.map(t => `#${t}`).join("  "), 120, 1380, 26, 700, "#84756c", 1);
  drawText(ctx, "结果仅供娱乐与习惯建议，不是医学或专业运动诊断。", 120, 1432, 22, 500, "#a09188", 1);

  const link = document.createElement("a");
  link.download = `fitness-persona-${code}-${result.name}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("结果海报已生成。");
}

function drawText(ctx, text, x, y, size, weight, color, letterSpacing = 1) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif`;
  ctx.textBaseline = "alphabetic";
  if (letterSpacing === 1) {
    ctx.fillText(text, x, y);
    return;
  }
  let currentX = x;
  [...text].forEach((char) => {
    ctx.fillText(char, currentX, y);
    currentX += ctx.measureText(char).width * letterSpacing;
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight, size, color, weight = 500) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px system-ui, -apple-system, BlinkMacSystemFont, "Microsoft YaHei", sans-serif`;
  const chars = [...text];
  let line = "";
  let currentY = y;
  chars.forEach((char, idx) => {
    const test = line + char;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = char;
      currentY += lineHeight;
    } else {
      line = test;
    }
    if (idx === chars.length - 1) {
      ctx.fillText(line, x, currentY);
    }
  });
}

function drawRoundedRect(ctx, x, y, w, h, r, fillStyle) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.fill();
}

function strokeRoundedRect(ctx, x, y, w, h, r, strokeStyle, lineWidth) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function hexToRgba(hex, alpha) {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1900);
}

init();
