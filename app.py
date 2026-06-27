import json
from pathlib import Path
import streamlit as st
import streamlit.components.v1 as components

st.set_page_config(
    page_title="FitPersona Mobile｜健身人格抽象图鉴",
    page_icon="💪",
    layout="wide",
    initial_sidebar_state="collapsed",
)

BASE = Path(__file__).parent
UI = BASE / "ui"

def get_secret(section: str, key: str, default: str = "") -> str:
    try:
        return st.secrets.get(section, {}).get(key, default)
    except Exception:
        return default

supabase_url = get_secret("supabase", "url")
supabase_anon_key = get_secret("supabase", "anon_key")

config = {
    "enabled": bool(supabase_url and supabase_anon_key),
    "url": supabase_url,
    "anonKey": supabase_anon_key,
    "appVersion": "v4.0-mobile-supabase",
}

css = (UI / "styles.css").read_text(encoding="utf-8")
data_js = (UI / "data.js").read_text(encoding="utf-8")
app_js = (UI / "app.js").read_text(encoding="utf-8")

st.markdown(
    """
    <style>
    .block-container {
        padding: 0.35rem 0.35rem 0.8rem;
        max-width: 980px;
    }
    header[data-testid="stHeader"] { display: none; }
    footer { display: none; }
    div[data-testid="stExpander"] { display: none !important; }
    details { display: none !important; }
    iframe {
        border: 0 !important;
        border-radius: 22px;
        box-shadow: 0 18px 54px rgba(52, 43, 37, 0.13);
        background: #F7F0E8;
        height: calc(100dvh - 18px) !important;
        min-height: 640px;
        max-height: 100dvh;
    }
    @media (max-width: 640px) {
        .block-container { padding: 0; }
        iframe {
            border-radius: 0;
            box-shadow: none;
            height: 100dvh !important;
            min-height: 100dvh;
            max-height: 100dvh;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)

with st.expander("后台数据说明 / Data Notice", expanded=False):
    st.markdown(
        """
        这个前台会在用户同意后，把匿名测试结果写入 Supabase。
        如果没有配置 Supabase Secrets，App 仍可正常使用，但不会上传数据。

        需要在 Streamlit Secrets 里配置：

        ```toml
        [supabase]
        url = "https://xxxx.supabase.co"
        anon_key = "你的 anon public key"
        ```
        """
    )

full_html = f"""
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<style>{css}</style>
</head>
<body>
<div id="fitpersona-root"></div>
<script>
window.SUPABASE_CONFIG = {json.dumps(config, ensure_ascii=False)};
</script>
<script>{data_js}</script>
<script>{app_js}</script>
</body>
</html>
"""

components.html(full_html, height=820, scrolling=True)
