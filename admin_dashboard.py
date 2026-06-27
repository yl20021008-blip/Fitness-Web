from __future__ import annotations

import io
import json
from datetime import date, datetime, timedelta
from typing import Any
from urllib.parse import parse_qs, urlparse

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
import streamlit as st


st.set_page_config(
    page_title="FitPersona 后台分析",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="collapsed",
)


# =========================
# Theme / CSS
# =========================

st.markdown(
    """
    <style>
    :root {
        --bg: #F7F0E8;
        --paper: #FFF9F2;
        --paper2: #EFE3D8;
        --ink: #40352F;
        --muted: #817269;
        --line: rgba(64, 53, 47, .14);
        --shadow: 0 18px 54px rgba(64, 53, 47, .12);
        --sage: #AAB6A1;
        --rose: #D8AAA7;
        --blue: #A9B8C8;
        --clay: #C7A08A;
    }

    html, body, [data-testid="stAppViewContainer"] {
        background:
            radial-gradient(circle at 0 0, rgba(216,170,167,.30), transparent 360px),
            radial-gradient(circle at 100% 0, rgba(169,184,200,.28), transparent 420px),
            linear-gradient(135deg, #F7F0E8, #F2E6DA) !important;
        color: var(--ink);
    }

    .block-container {
        padding-top: 1.4rem;
        padding-bottom: 3rem;
        max-width: 1440px;
    }

    header[data-testid="stHeader"] {
        background: rgba(247,240,232,.72);
        backdrop-filter: blur(12px);
    }

    #MainMenu, footer {
        visibility: hidden;
    }

    h1, h2, h3 {
        letter-spacing: -0.045em;
        color: var(--ink);
    }

    .fp-hero {
        position: relative;
        overflow: hidden;
        padding: 34px 36px;
        border: 1px solid var(--line);
        border-radius: 34px;
        background:
            linear-gradient(145deg, rgba(255,249,242,.94), rgba(239,227,216,.74)),
            radial-gradient(circle at 90% 15%, rgba(216,170,167,.28), transparent 280px);
        box-shadow: var(--shadow);
        margin-bottom: 20px;
    }

    .fp-hero::after {
        content: "";
        position: absolute;
        right: -80px;
        bottom: -110px;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: rgba(170,182,161,.24);
    }

    .fp-hero * {
        position: relative;
        z-index: 1;
    }

    .fp-kicker {
        display: inline-flex;
        padding: 7px 12px;
        border-radius: 999px;
        border: 1px solid var(--line);
        background: rgba(255,249,242,.72);
        color: var(--muted);
        font-weight: 900;
        font-size: 12px;
        letter-spacing: .06em;
        text-transform: uppercase;
    }

    .fp-hero h1 {
        font-size: clamp(42px, 6vw, 76px);
        line-height: 1.02;
        margin: 14px 0 10px;
        font-weight: 950;
    }

    .fp-hero p {
        color: var(--muted);
        font-size: 16px;
        line-height: 1.75;
        max-width: 860px;
        margin-bottom: 0;
    }

    .fp-card {
        border: 1px solid var(--line);
        border-radius: 28px;
        background: rgba(255,249,242,.82);
        box-shadow: 0 12px 38px rgba(64,53,47,.08);
        padding: 20px;
        height: 100%;
    }

    .metric-card {
        border: 1px solid var(--line);
        border-radius: 28px;
        background: rgba(255,249,242,.82);
        box-shadow: 0 12px 34px rgba(64,53,47,.08);
        padding: 20px 22px;
        min-height: 138px;
    }

    .metric-card .label {
        color: var(--muted);
        font-weight: 900;
        font-size: 13px;
    }

    .metric-card .value {
        margin-top: 10px;
        font-size: clamp(34px, 4vw, 58px);
        line-height: .95;
        letter-spacing: -0.07em;
        font-weight: 950;
        color: var(--ink);
    }

    .metric-card .sub {
        margin-top: 8px;
        color: var(--muted);
        font-size: 13px;
    }

    .section-title {
        margin: 28px 0 12px;
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 16px;
    }

    .section-title h2 {
        margin: 0;
        font-size: 32px;
        font-weight: 950;
    }

    .section-title p {
        margin: 5px 0 0;
        color: var(--muted);
    }

    .stTabs [data-baseweb="tab-list"] {
        gap: 8px;
        background: rgba(255,249,242,.58);
        padding: 8px;
        border-radius: 999px;
        border: 1px solid var(--line);
    }

    .stTabs [data-baseweb="tab"] {
        border-radius: 999px;
        padding: 10px 18px;
        color: var(--muted);
        font-weight: 850;
    }

    .stTabs [aria-selected="true"] {
        background: var(--ink) !important;
        color: var(--paper) !important;
    }

    div[data-testid="stMetric"] {
        background: rgba(255,249,242,.74);
        border: 1px solid var(--line);
        border-radius: 22px;
        padding: 14px;
        box-shadow: 0 10px 28px rgba(64,53,47,.06);
    }

    div[data-testid="stDataFrame"] {
        border-radius: 22px;
        overflow: hidden;
        border: 1px solid var(--line);
    }

    .stButton>button, .stDownloadButton>button {
        border-radius: 999px;
        border: 1px solid var(--line);
        background: var(--ink);
        color: var(--paper);
        font-weight: 900;
        min-height: 44px;
        padding: 0 18px;
    }

    .stTextInput input, .stSelectbox div[data-baseweb="select"] > div,
    .stMultiSelect div[data-baseweb="select"] > div,
    .stDateInput input {
        border-radius: 16px !important;
        border-color: rgba(64,53,47,.18) !important;
        background: rgba(255,249,242,.78) !important;
    }

    .small-note {
        color: var(--muted);
        font-size: 13px;
        line-height: 1.7;
    }

    .privacy-box {
        border: 1px dashed rgba(64,53,47,.24);
        border-radius: 22px;
        background: rgba(255,249,242,.58);
        padding: 16px 18px;
        color: var(--muted);
        line-height: 1.7;
    }

    @media (max-width: 900px) {
        .block-container {
            padding-left: .75rem;
            padding-right: .75rem;
        }

        .fp-hero {
            padding: 24px 22px;
            border-radius: 28px;
        }
    }
    </style>
    """,
    unsafe_allow_html=True,
)


PLOT_LAYOUT = dict(
    paper_bgcolor="rgba(0,0,0,0)",
    plot_bgcolor="rgba(0,0,0,0)",
    font=dict(family="Arial, Microsoft YaHei, sans-serif", color="#40352F"),
    margin=dict(l=24, r=24, t=52, b=28),
    hoverlabel=dict(bgcolor="#FFF9F2", font_size=13),
    legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
)

COLOR_SEQ = ["#40352F", "#C7A08A", "#AAB6A1", "#A9B8C8", "#D8AAA7", "#DCCAA7", "#B7AA9B", "#C7D0BC"]


# =========================
# Secrets / Data
# =========================

def get_secret(section: str, key: str, default: str = "") -> str:
    try:
        return st.secrets.get(section, {}).get(key, default)
    except Exception:
        return default


SUPABASE_URL = get_secret("supabase", "url").rstrip("/")
SERVICE_ROLE_KEY = get_secret("supabase", "service_role_key")
ADMIN_PASSWORD = get_secret("admin", "password")


def need_setup() -> bool:
    return not (SUPABASE_URL and SERVICE_ROLE_KEY and ADMIN_PASSWORD)


def render_password_gate() -> None:
    st.markdown(
        """
        <div class="fp-hero">
            <span class="fp-kicker">FitPersona Admin</span>
            <h1>后台分析</h1>
            <p>用于查看小红书投放后的匿名测试数据。不要把这个后台链接公开。</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    if need_setup():
        st.error("缺少配置。请在 Streamlit Secrets 里填写 [supabase] url / service_role_key 和 [admin] password。")
        with st.expander("Secrets 格式"):
            st.code(
                """
[supabase]
url = "https://你的项目id.supabase.co"
anon_key = "你的 anon public key"
service_role_key = "你的 service_role key"

[admin]
password = "你自己设置的后台密码"
                """.strip(),
                language="toml",
            )
        st.stop()

    c1, c2, c3 = st.columns([1.2, 1, 1])
    with c1:
        password = st.text_input("后台密码", type="password", placeholder="输入你在 Secrets 里设置的密码")
    with c2:
        st.markdown("<br>", unsafe_allow_html=True)
        login = st.button("进入后台", use_container_width=True)
    with c3:
        st.markdown("<br>", unsafe_allow_html=True)
        st.caption("提示：后台链接不要发到小红书。")

    if not login and "admin_authed" not in st.session_state:
        st.stop()

    if password == ADMIN_PASSWORD:
        st.session_state["admin_authed"] = True
    elif not st.session_state.get("admin_authed"):
        st.info("请输入后台密码。")
        st.stop()


@st.cache_data(ttl=120, show_spinner=False)
def fetch_table(table: str, limit: int = 20000) -> pd.DataFrame:
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Content-Type": "application/json",
    }
    url = f"{SUPABASE_URL}/rest/v1/{table}?select=*&order=created_at.desc&limit={limit}"
    resp = requests.get(url, headers=headers, timeout=35)
    if resp.status_code >= 400:
        raise RuntimeError(f"{resp.status_code}: {resp.text}")
    data = resp.json()
    return pd.DataFrame(data)


def as_dict(value: Any) -> dict:
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, dict) else {}
        except Exception:
            return {}
    return {}


def as_list(value: Any) -> list:
    if isinstance(value, list):
        return value
    if isinstance(value, str):
        try:
            parsed = json.loads(value)
            return parsed if isinstance(parsed, list) else []
        except Exception:
            return []
    return []


def safe_col(df: pd.DataFrame, col: str, default: Any = "") -> pd.Series:
    if col in df.columns:
        return df[col]
    return pd.Series([default] * len(df), index=df.index)


def extract_src(url: Any) -> str:
    if not isinstance(url, str) or not url:
        return ""
    try:
        query = parse_qs(urlparse(url).query)
        for key in ["src", "utm_source", "utm_campaign", "utm_content"]:
            if key in query and query[key]:
                return query[key][0]
    except Exception:
        return ""
    return ""


def prepare_df(raw: pd.DataFrame) -> pd.DataFrame:
    df = raw.copy()

    if "created_at" in df.columns:
        df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
    else:
        df["created_at"] = pd.NaT

    df["date"] = df["created_at"].dt.date
    df["hour"] = df["created_at"].dt.hour
    df["result_code"] = safe_col(df, "result_code", "UNKNOWN").fillna("UNKNOWN")
    df["persona_name"] = safe_col(df, "persona_name", "").fillna("")
    df["participant_id"] = safe_col(df, "participant_id", "").fillna("")
    df["page_url"] = safe_col(df, "page_url", "").fillna("")
    df["referrer"] = safe_col(df, "referrer", "").fillna("")
    df["source_tag"] = df["page_url"].apply(extract_src)
    df["source_tag"] = df["source_tag"].where(df["source_tag"].astype(bool), "direct/unknown")

    if "dimensions" in df.columns:
        dims = df["dimensions"].apply(as_dict)
    else:
        dims = pd.Series([{}] * len(df), index=df.index)

    df["计划R%"] = dims.apply(lambda x: x.get("R_percent"))
    df["功能F%"] = dims.apply(lambda x: x.get("F_percent"))
    df["搭子C%"] = dims.apply(lambda x: x.get("C_percent"))
    df["场馆G%"] = dims.apply(lambda x: x.get("G_percent"))

    return df


def flatten_answers(df: pd.DataFrame) -> pd.DataFrame:
    rows: list[dict[str, Any]] = []
    if "answers" not in df.columns:
        return pd.DataFrame(rows)

    for _, row in df.iterrows():
        answers = as_list(row.get("answers"))
        for item in answers:
            if not isinstance(item, dict):
                continue
            rows.append(
                {
                    "提交时间": row.get("created_at"),
                    "日期": row.get("date"),
                    "匿名用户": row.get("participant_id"),
                    "人格代码": row.get("result_code"),
                    "人格名称": row.get("persona_name"),
                    "来源": row.get("source_tag"),
                    "题号": item.get("question_id"),
                    "题组": item.get("group"),
                    "维度": item.get("axis"),
                    "题目": item.get("question"),
                    "选项序号": item.get("answer_index"),
                    "选项文本": item.get("answer_text"),
                    "选项说明": item.get("answer_hint"),
                }
            )
    return pd.DataFrame(rows)


def filter_df(df: pd.DataFrame) -> pd.DataFrame:
    st.markdown('<div class="section-title"><div><h2>筛选器</h2><p>先选时间、人群和来源，再看下面所有图表。</p></div></div>', unsafe_allow_html=True)

    min_date = df["date"].dropna().min()
    max_date = df["date"].dropna().max()
    if pd.isna(min_date) or pd.isna(max_date):
        min_date = max_date = date.today()

    c1, c2, c3, c4 = st.columns([1.1, 1.4, 1.4, 1.2])
    with c1:
        date_range = st.date_input(
            "日期范围",
            value=(min_date, max_date),
            min_value=min_date,
            max_value=max_date,
        )
    with c2:
        personas = sorted(df["result_code"].dropna().unique())
        chosen_personas = st.multiselect("人格代码", personas, default=personas)
    with c3:
        sources = sorted(df["source_tag"].dropna().unique())
        chosen_sources = st.multiselect("来源 src", sources, default=sources)
    with c4:
        limit = st.slider("最多显示记录", 100, 20000, min(5000, len(df)), step=100)

    if isinstance(date_range, tuple) and len(date_range) == 2:
        start, end = date_range
    else:
        start = end = date_range

    mask = (
        (df["date"] >= start)
        & (df["date"] <= end)
        & (df["result_code"].isin(chosen_personas))
        & (df["source_tag"].isin(chosen_sources))
    )
    return df.loc[mask].head(limit).copy()


def kpi_cards(df: pd.DataFrame, full_df: pd.DataFrame) -> None:
    total = len(df)
    users = df["participant_id"].nunique() if "participant_id" in df else 0
    persona_count = df["result_code"].nunique() if "result_code" in df else 0
    latest = df["created_at"].max()
    latest_text = latest.strftime("%m-%d %H:%M") if pd.notna(latest) else "-"
    top_code = df["result_code"].value_counts().idxmax() if total else "-"
    completion_today = len(df[df["date"] == date.today()]) if "date" in df else 0

    c1, c2, c3, c4, c5 = st.columns(5)
    metrics = [
        ("完成测试", f"{total:,}", f"当前筛选 / 全量 {len(full_df):,}"),
        ("匿名用户", f"{users:,}", "按 participant_id 去重"),
        ("人格类型", f"{persona_count}", f"Top: {top_code}"),
        ("今日新增", f"{completion_today}", f"最近提交 {latest_text}"),
        ("数据来源", f"{df['source_tag'].nunique() if total else 0}", "src / direct"),
    ]
    for col, (label, value, sub) in zip([c1, c2, c3, c4, c5], metrics):
        with col:
            st.markdown(
                f"""
                <div class="metric-card">
                    <div class="label">{label}</div>
                    <div class="value">{value}</div>
                    <div class="sub">{sub}</div>
                </div>
                """,
                unsafe_allow_html=True,
            )


def render_overview(df: pd.DataFrame) -> None:
    c1, c2 = st.columns([1.15, 0.85])

    with c1:
        st.markdown('<div class="fp-card">', unsafe_allow_html=True)
        if len(df):
            dist = df["result_code"].value_counts().reset_index()
            dist.columns = ["人格代码", "数量"]
            fig = px.bar(
                dist,
                x="人格代码",
                y="数量",
                text="数量",
                title="人格分布",
                color="人格代码",
                color_discrete_sequence=COLOR_SEQ,
            )
            fig.update_traces(textposition="outside", marker_line_width=0)
            fig.update_layout(**PLOT_LAYOUT, showlegend=False, height=430)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("当前筛选下没有数据。")
        st.markdown("</div>", unsafe_allow_html=True)

    with c2:
        st.markdown('<div class="fp-card">', unsafe_allow_html=True)
        dims = df[["计划R%", "功能F%", "搭子C%", "场馆G%"]].apply(pd.to_numeric, errors="coerce")
        if len(df) and dims.notna().any().any():
            mean_dims = dims.mean().reset_index()
            mean_dims.columns = ["维度", "平均倾向"]
            fig = px.bar(
                mean_dims,
                x="维度",
                y="平均倾向",
                text=mean_dims["平均倾向"].round(1),
                title="四维倾向均值",
                color="维度",
                color_discrete_sequence=COLOR_SEQ,
            )
            fig.update_yaxes(range=[0, 100])
            fig.update_traces(textposition="outside")
            fig.update_layout(**PLOT_LAYOUT, showlegend=False, height=430)
            st.plotly_chart(fig, use_container_width=True)
        else:
            st.info("暂无四维数据。")
        st.markdown("</div>", unsafe_allow_html=True)

    c3, c4 = st.columns([1, 1])

    with c3:
        st.markdown('<div class="fp-card">', unsafe_allow_html=True)
        if len(df):
            daily = df.groupby("date", dropna=True).size().reset_index(name="提交数")
            fig = px.line(
                daily,
                x="date",
                y="提交数",
                markers=True,
                title="每日提交趋势",
                color_discrete_sequence=["#40352F"],
            )
            fig.update_traces(line_width=4, marker_size=9)
            fig.update_layout(**PLOT_LAYOUT, height=360)
            st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with c4:
        st.markdown('<div class="fp-card">', unsafe_allow_html=True)
        if len(df):
            hourly = df.groupby("hour", dropna=True).size().reindex(range(24), fill_value=0).reset_index()
            hourly.columns = ["小时", "提交数"]
            fig = px.bar(
                hourly,
                x="小时",
                y="提交数",
                title="一天内提交时段",
                color_discrete_sequence=["#C7A08A"],
            )
            fig.update_layout(**PLOT_LAYOUT, height=360)
            st.plotly_chart(fig, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)


def render_answers(ans_df: pd.DataFrame) -> None:
    if ans_df.empty:
        st.info("暂无题目选择数据。")
        return

    c1, c2 = st.columns([0.8, 1.2])
    with c1:
        qids = sorted(ans_df["题号"].dropna().unique())
        qid = st.selectbox("选择题目", qids, format_func=lambda x: f"Q{int(x)}")
    sub = ans_df[ans_df["题号"] == qid].copy()
    q_text = sub["题目"].iloc[0] if len(sub) else ""

    with c2:
        st.markdown(
            f"""
            <div class="privacy-box">
                <b>Q{int(qid)}｜{q_text}</b><br>
                <span>下面展示该题各选项被选择的次数，并可按人格代码交叉查看。</span>
            </div>
            """,
            unsafe_allow_html=True,
        )

    c3, c4 = st.columns([1.05, 0.95])

    with c3:
        option_counts = sub["选项文本"].value_counts().reset_index()
        option_counts.columns = ["选项", "数量"]
        fig = px.bar(
            option_counts,
            x="数量",
            y="选项",
            orientation="h",
            text="数量",
            title="选项分布",
            color="选项",
            color_discrete_sequence=COLOR_SEQ,
        )
        fig.update_traces(textposition="outside")
        fig.update_layout(**PLOT_LAYOUT, showlegend=False, height=440)
        st.plotly_chart(fig, use_container_width=True)

    with c4:
        cross = pd.crosstab(sub["人格代码"], sub["选项文本"])
        if not cross.empty:
            fig = px.imshow(
                cross,
                text_auto=True,
                aspect="auto",
                title="人格 × 选项交叉热力图",
                color_continuous_scale=["#FFF9F2", "#D8AAA7", "#40352F"],
            )
            fig.update_layout(**PLOT_LAYOUT, height=440)
            st.plotly_chart(fig, use_container_width=True)

    with st.expander("查看该题明细"):
        st.dataframe(sub, use_container_width=True, height=320)


def render_sources(df: pd.DataFrame) -> None:
    c1, c2 = st.columns([1, 1])

    with c1:
        if len(df):
            src = df["source_tag"].value_counts().reset_index()
            src.columns = ["来源", "提交数"]
            fig = px.pie(
                src,
                names="来源",
                values="提交数",
                title="来源占比",
                hole=0.52,
                color_discrete_sequence=COLOR_SEQ,
            )
            fig.update_layout(**PLOT_LAYOUT, height=430)
            st.plotly_chart(fig, use_container_width=True)

    with c2:
        if len(df):
            width_series = pd.to_numeric(df.get("screen_width"), errors="coerce")
            device = pd.cut(
                width_series,
                bins=[0, 390, 430, 768, 1200, 99999],
                labels=["小屏手机", "常规手机", "平板/折叠", "桌面", "大屏桌面"],
            ).astype(str).replace("nan", "未知")
            device_df = device.value_counts().reset_index()
            device_df.columns = ["设备类型", "数量"]
            fig = px.bar(
                device_df,
                x="设备类型",
                y="数量",
                text="数量",
                title="设备宽度分布",
                color="设备类型",
                color_discrete_sequence=COLOR_SEQ,
            )
            fig.update_layout(**PLOT_LAYOUT, showlegend=False, height=430)
            st.plotly_chart(fig, use_container_width=True)

    st.markdown('<div class="section-title"><div><h2>来源明细</h2><p>建议你以后每篇小红书用不同链接参数，例如 ?src=xhs_note_01。</p></div></div>', unsafe_allow_html=True)
    cols = ["created_at", "result_code", "persona_name", "source_tag", "referrer", "page_url", "screen_width", "language", "timezone"]
    cols = [c for c in cols if c in df.columns]
    st.dataframe(df[cols], use_container_width=True, height=360)


def render_raw(df: pd.DataFrame, ans_df: pd.DataFrame) -> None:
    st.markdown(
        """
        <div class="privacy-box">
        <b>隐私说明：</b>当前版本不收集手机号、微信、姓名、照片和精准定位。
        后台数据主要用于统计人格分布、题目选择和来源效果。
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.dataframe(df, use_container_width=True, height=420)

    raw_csv = df.to_csv(index=False).encode("utf-8-sig")
    ans_csv = ans_df.to_csv(index=False).encode("utf-8-sig") if not ans_df.empty else b""

    c1, c2, c3 = st.columns([1, 1, 2])
    with c1:
        st.download_button(
            "下载原始数据 CSV",
            data=raw_csv,
            file_name=f"fitpersona_raw_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
            mime="text/csv",
            use_container_width=True,
        )
    with c2:
        st.download_button(
            "下载题目明细 CSV",
            data=ans_csv,
            file_name=f"fitpersona_answers_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
            mime="text/csv",
            disabled=ans_df.empty,
            use_container_width=True,
        )
    with c3:
        st.caption("建议每晚导出一次备份；正式大规模投放前，先用 5–10 个样本检查字段是否完整。")


# =========================
# Main
# =========================

render_password_gate()

st.markdown(
    """
    <div class="fp-hero">
        <span class="fp-kicker">FitPersona Admin Dashboard</span>
        <h1>后台分析</h1>
        <p>查看小红书投放后的匿名测试数据：人格分布、每日提交趋势、题目选择、四维倾向、来源追踪和 CSV 导出。</p>
    </div>
    """,
    unsafe_allow_html=True,
)

top_l, top_r = st.columns([1, 0.28])
with top_r:
    if st.button("刷新数据", use_container_width=True):
        st.cache_data.clear()
        st.rerun()

try:
    raw_df = fetch_table("fitpersona_responses")
except Exception as exc:
    st.error(f"读取 Supabase 数据失败：{exc}")
    st.stop()

if raw_df.empty:
    st.warning("数据库里还没有测试数据。先用前台完整测试一次，并确认首页显示“匿名上传已开启”。")
    st.stop()

df_all = prepare_df(raw_df)
df = filter_df(df_all)

if df.empty:
    st.warning("当前筛选条件下没有数据。")
    st.stop()

ans_df = flatten_answers(df)

st.markdown('<div class="section-title"><div><h2>数据总览</h2><p>先看整体表现，再进入具体题目和来源分析。</p></div></div>', unsafe_allow_html=True)
kpi_cards(df, df_all)

tab1, tab2, tab3, tab4 = st.tabs(["总览", "题目分析", "来源与设备", "原始数据"])

with tab1:
    render_overview(df)

with tab2:
    render_answers(ans_df)

with tab3:
    render_sources(df)

with tab4:
    render_raw(df, ans_df)
