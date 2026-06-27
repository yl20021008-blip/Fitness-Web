# FitPersona Mobile Supabase v4

手机端优先 + Supabase 后台数据收集版。

## 功能

- 手机端优先测试页
- 20 道运动习惯画像题
- 16 种健身抽象人格
- 用户同意后匿名上传测试结果到 Supabase
- 本地保留历史记录、任务、反馈
- 后台分析页 `admin_dashboard.py`
- CSV 导出
- 分享海报下载

## 文件结构

```txt
fitpersona-mobile-supabase-v4/
├── app.py                  # 小红书用户访问的前台
├── admin_dashboard.py      # 你自己看的后台分析页
├── requirements.txt
├── index.html
├── README.md
├── DEPLOYMENT.md
├── .gitignore
├── .streamlit/
│   ├── config.toml
│   └── secrets.example.toml
├── sql/
│   └── supabase_schema.sql
├── assets/
│   └── favicon.svg
└── ui/
    ├── styles.css
    ├── data.js
    └── app.js
```

## 运行

```bash
pip install -r requirements.txt
streamlit run app.py
```

后台：

```bash
streamlit run admin_dashboard.py
```

## 注意

不要把真实 `.streamlit/secrets.toml` 上传 GitHub。  
真实密钥请放在 Streamlit Cloud 的 Secrets 页面。
