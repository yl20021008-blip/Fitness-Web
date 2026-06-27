import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="FitPersona 健身人格抽象图鉴",
    page_icon="💪",
    layout="wide",
    initial_sidebar_state="collapsed",
)

BASE_DIR = Path(__file__).parent
UI_DIR = BASE_DIR / "ui"

css = (UI_DIR / "styles.css").read_text(encoding="utf-8")
data_js = (UI_DIR / "data.js").read_text(encoding="utf-8")
app_js = (UI_DIR / "app.js").read_text(encoding="utf-8")

st.markdown(
    """
    <style>
    .block-container {
        padding-top: 1rem;
        padding-bottom: 1rem;
        max-width: 1400px;
    }
    header[data-testid="stHeader"] {
        background: rgba(246, 239, 231, 0.72);
        backdrop-filter: blur(12px);
    }
    iframe {
        border-radius: 24px;
        box-shadow: 0 18px 60px rgba(70, 59, 52, 0.12);
    }
    </style>
    """,
    unsafe_allow_html=True,
)

with st.expander("部署说明 / Deployment Notes", expanded=False):
    st.markdown(
        """
        **这是 Streamlit 部署外壳 + 前端 App 的版本。**

        - 正式入口：`app.py`
        - 前端文件：`ui/styles.css`、`ui/data.js`、`ui/app.js`
        - 用户测试记录、今日任务、历史记录保存在浏览器 `localStorage` 里。
        - 不需要数据库，适合先做 Demo。
        - 后续如果要做用户登录、排行榜、云端同步，可以接 Supabase / Firebase。
        """
    )

full_html = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>{css}</style>
</head>
<body>
<div id="fitpersona-root"></div>
<script>{data_js}</script>
<script>{app_js}</script>
</body>
</html>
"""

components.html(full_html, height=950, scrolling=True)
