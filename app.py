import streamlit as st
import streamlit.components.v1 as components
from pathlib import Path

st.set_page_config(
    page_title="FitPersona Mobile｜健身人格抽象图鉴",
    page_icon="💪",
    layout="wide",
    initial_sidebar_state="collapsed",
)

BASE = Path(__file__).parent
UI = BASE / "ui"

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
    header[data-testid="stHeader"] {
        display: none;
    }
    footer {
        display: none;
    }
    iframe {
        border: 0 !important;
        border-radius: 22px;
        box-shadow: 0 18px 54px rgba(52, 43, 37, 0.13);
        background: #F7F0E8;
    }
    @media (max-width: 640px) {
        .block-container {
            padding: 0;
        }
        iframe {
            border-radius: 0;
            box-shadow: none;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
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
<script>{data_js}</script>
<script>{app_js}</script>
</body>
</html>
"""

components.html(full_html, height=1180, scrolling=True)
