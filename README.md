# FitPersona Mobile Streamlit v3

手机端优先的健身人格抽象图鉴 Web App。  
可以直接上传 GitHub，然后用 Streamlit Community Cloud 部署。

## 项目结构

```txt
fitpersona-mobile-streamlit-v3/
├── app.py
├── requirements.txt
├── index.html
├── README.md
├── DEPLOYMENT.md
├── .gitignore
├── .streamlit/
│   └── config.toml
├── assets/
│   └── favicon.svg
└── ui/
    ├── styles.css
    ├── data.js
    └── app.js
```

## 本地运行

```bash
pip install -r requirements.txt
streamlit run app.py
```

## Streamlit Cloud 部署

Main file path 填：

```txt
app.py
```

## v3 升级点

- 手机端优先布局
- 底部 Tab 导航
- 大按钮、大卡片、适配 iPhone/Android
- 20 道题，按真实运动社交词条重构
- 首页、测试、今日任务、图鉴、搭子匹配、记录
- localStorage 本地保存
- 下载分享海报
- 导出 JSON

## 修改题目和人格

改 `ui/data.js`。

## 修改视觉

改 `ui/styles.css`。
