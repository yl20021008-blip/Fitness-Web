# FitPersona Streamlit GitHub 版

这是一个可以直接上传 GitHub 并部署到 Streamlit Community Cloud 的 Web App 项目。

## 项目结构

```txt
fitpersona-streamlit-github/
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

打开浏览器中的本地地址即可。

## Streamlit Cloud 部署入口

部署时主文件路径填写：

```txt
app.py
```

## 主要功能

- 健身人格测试
- 16 种抽象人格
- 首页仪表盘
- 今日任务打卡
- 历史记录
- 身体反馈
- 搭子匹配
- 下载分享海报
- 导出 JSON 数据

## 修改内容

主要修改 `ui/data.js`：

- `questions`：测试题库
- `personas`：16 种人格文案
- `daily`：每日任务
- `tags`：分享标签

视觉样式主要修改 `ui/styles.css`。
