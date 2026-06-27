# 健身人格抽象图鉴 Web App

一个可以直接上传到 GitHub Pages 的纯前端小项目。  
风格：小红书低饱和贴纸风 / Morandi sticker journal。  
玩法：16题健身人格测试 + 16种人格图鉴 + 健身搭子匹配 + 结果海报 PNG 生成。

## 功能

- 16 道健身人格测试题
- 4 个维度：计划/氛围、功能/视觉、搭子/独练、场馆/生活
- 16 种抽象人格结果
- 结果雷达图
- 一键复制结果文案
- 一键生成结果海报 PNG
- 人格图鉴页面
- 健身搭子匹配页面
- PWA 基础配置，可离线缓存

## 文件结构

```txt
fitness-personality-webapp/
├── index.html
├── styles.css
├── script.js
├── manifest.json
├── service-worker.js
├── README.md
└── assets/
    └── favicon.svg
```

## 本地预览

直接双击 `index.html` 可以查看大部分效果。

如果想完整测试 PWA 和 service worker，建议用本地服务器：

```bash
python -m http.server 8000
```

然后打开：

```txt
http://localhost:8000
```

## 上传 GitHub Pages

1. 新建 GitHub 仓库，例如 `fitness-personality-webapp`
2. 把本文件夹里的所有文件上传到仓库根目录
3. 打开仓库 `Settings`
4. 找到 `Pages`
5. Source 选择 `Deploy from a branch`
6. Branch 选择 `main` 和 `/root`
7. 保存后等待 1-2 分钟
8. GitHub 会生成一个可访问的网址

## 修改人格文案

打开 `script.js`，找到：

```js
const RESULTS = {
  VASL: {
    name: "松弛自救生物",
    ...
  }
}
```

可以直接修改名称、文案、标签、建议和 emoji。

## 修改问题

打开 `script.js`，找到：

```js
const QUESTIONS = [
  {
    id: 1,
    axis: "训练组织方式",
    text: "你最可能因为什么开始运动？",
    options: [...]
  }
]
```

每个选项的 `score` 决定加分方向：

```js
score: { R: 1 }
```

四个维度分别是：

- R / V：计划流 / 氛围流
- F / A：功能派 / 视觉派
- C / S：搭子派 / 独练派
- G / L：场馆派 / 生活派

## 注意

这个测试是娱乐型画像，不是医学诊断、运动处方或心理测评。上线时建议保留页面中的免责声明，避免制造身材焦虑。
