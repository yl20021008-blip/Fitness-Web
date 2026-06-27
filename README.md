# FitPersona Mobile Supabase v4

手机端优先 + Supabase 后台数据收集版。

## 功能

- 手机端优先测试页
- 20 道运动习惯画像题
- 16 种健身抽象人格
- 默认开启匿名上传测试结果到 Supabase，用户可在首页手动关闭
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


## v4.1 说明

这一版已经改成默认开启匿名提交。  
首页会显示说明：不收集手机号、微信、姓名和精准定位，只记录测试答案、结果、设备宽度、浏览器信息等匿名数据。  
用户可以在首页手动关闭匿名提交。


## v4.1.1 修复

修复测试页移动端布局问题：

- 第 4 个选项不再被“上一题 / 重测”按钮遮挡
- 测试题标题字号在手机端进一步压缩
- 选项卡片间距和高度优化
- 操作按钮改为普通底部区域，不再 sticky 覆盖内容


## v4.1.2 修复

修复 Streamlit iframe 导致底部工具栏出现在页面最底部的问题：

- Streamlit iframe 改为当前视口高度
- App 内部自己滚动
- 底部 Tab 固定在可视窗口底部
- 增加底部安全距离，避免内容被 Tabbar 遮挡


## v4.1.3 修复

移除用户端顶部的 Streamlit 展开栏：

- 删除 “后台数据说明 / Data Notice”
- 前台页面更干净，适合小红书用户直接进入测试
- 匿名提交和后台分析功能不受影响


## v4.1.4 修复

针对手机端小红书/浏览器 WebView 顶部区域做了压缩：

- 移除 App 内部顶部品牌栏
- 移除用户端顶部空白
- 页面内容更贴近浏览器标题栏下方
- 底部 Tabbar 仍保持固定
- 外部浏览器 / 小红书 WebView 自带标题栏无法由网页代码删除


## v4.1.5 修复

尽量隐藏 Streamlit Cloud 外层控件：

- `.streamlit/config.toml` 增加 `client.toolbarMode = "minimal"`
- `app.py` 增加隐藏 MainMenu、footer、toolbar、status widget 等样式
- 注意：Streamlit Cloud 的 “Manage app” 浮窗在管理员登录状态下可能仍由平台显示；普通用户通常不会看到。


## v4.1.6 修复

修复 v4.1.5 中 `app.py` 的 f-string CSS 大括号导致的 `NameError`。
同时确认用户端不显示 `后台数据说明 / Data Notice`。
