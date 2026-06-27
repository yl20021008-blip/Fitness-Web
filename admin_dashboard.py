import json
from datetime import datetime, timedelta
from pathlib import Path

import pandas as pd
import requests
import streamlit as st

st.set_page_config(
    page_title="FitPersona 后台分析",
    page_icon="📊",
    layout="wide",
)

def get_secret(section: str, key: str, default: str = "") -> str:
    try:
        return st.secrets.get(section, {}).get(key, default)
    except Exception:
        return default

SUPABASE_URL = get_secret("supabase", "url")
SERVICE_ROLE_KEY = get_secret("supabase", "service_role_key")
ADMIN_PASSWORD = get_secret("admin", "password")

st.title("FitPersona 后台分析")
st.caption("用于查看小红书投放后的匿名测试数据。不要把这个后台链接公开。")

if not ADMIN_PASSWORD:
    st.error("还没有配置后台密码。请在 Streamlit Secrets 里添加 [admin] password。")
    st.stop()

password = st.text_input("后台密码", type="password")
if password != ADMIN_PASSWORD:
    st.info("请输入后台密码。")
    st.stop()

if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    st.error("缺少 Supabase 配置。请在 Streamlit Secrets 里添加 url 和 service_role_key。")
    st.stop()

headers = {
    "apikey": SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
}

@st.cache_data(ttl=120)
def fetch_table(table: str, limit: int = 10000) -> pd.DataFrame:
    url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/{table}?select=*&order=created_at.desc&limit={limit}"
    resp = requests.get(url, headers=headers, timeout=30)
    if resp.status_code >= 400:
        raise RuntimeError(f"{resp.status_code}: {resp.text}")
    data = resp.json()
    return pd.DataFrame(data)

try:
    df = fetch_table("fitpersona_responses")
except Exception as e:
    st.error(f"读取数据失败：{e}")
    st.stop()

if df.empty:
    st.warning("数据库里还没有测试数据。")
    st.stop()

df["created_at"] = pd.to_datetime(df["created_at"], errors="coerce")
df["date"] = df["created_at"].dt.date.astype(str)

st.subheader("总览")
c1, c2, c3, c4 = st.columns(4)
c1.metric("完成测试数", len(df))
c2.metric("匿名用户数", df["participant_id"].nunique() if "participant_id" in df else "-")
c3.metric("人格类型数", df["result_code"].nunique() if "result_code" in df else "-")
c4.metric("最近提交", df["created_at"].max().strftime("%Y-%m-%d %H:%M") if df["created_at"].notna().any() else "-")

st.subheader("人格分布")
if "result_code" in df:
    dist = df["result_code"].value_counts().rename_axis("人格代码").reset_index(name="数量")
    st.bar_chart(dist.set_index("人格代码"))

st.subheader("每日提交趋势")
daily = df.groupby("date").size().reset_index(name="数量")
st.line_chart(daily.set_index("date"))

st.subheader("四维倾向均值")
def unpack_dimensions(row):
    d = row if isinstance(row, dict) else {}
    return pd.Series({
        "计划R": d.get("R_percent"),
        "功能F": d.get("F_percent"),
        "搭子C": d.get("C_percent"),
        "场馆G": d.get("G_percent"),
    })

if "dimensions" in df:
    dim_df = df["dimensions"].apply(unpack_dimensions)
    st.dataframe(dim_df.describe().round(2), use_container_width=True)
    st.bar_chart(dim_df.mean(numeric_only=True))

st.subheader("题目选择统计")
if "answers" in df:
    rows = []
    for _, row in df.iterrows():
        answers = row.get("answers")
        if isinstance(answers, list):
            for item in answers:
                rows.append({
                    "question_id": item.get("question_id"),
                    "group": item.get("group"),
                    "axis": item.get("axis"),
                    "question": item.get("question"),
                    "answer_text": item.get("answer_text"),
                    "result_code": row.get("result_code"),
                })
    ans_df = pd.DataFrame(rows)
    if not ans_df.empty:
        qid = st.selectbox(
            "选择题目查看分布",
            sorted(ans_df["question_id"].dropna().unique()),
        )
        sub = ans_df[ans_df["question_id"] == qid]
        st.write(sub["question"].iloc[0])
        st.bar_chart(sub["answer_text"].value_counts())
        st.dataframe(sub, use_container_width=True, height=300)

st.subheader("设备与来源")
cols = st.columns(2)
with cols[0]:
    if "screen_width" in df:
        st.write("屏幕宽度分布")
        st.bar_chart(df["screen_width"].dropna().astype(int).value_counts().sort_index())
with cols[1]:
    if "referrer" in df:
        st.write("Referrer Top 10")
        st.dataframe(df["referrer"].fillna("").value_counts().head(10).reset_index(), use_container_width=True)

st.subheader("原始数据")
st.dataframe(df, use_container_width=True, height=420)

csv = df.to_csv(index=False).encode("utf-8-sig")
st.download_button(
    "下载 CSV",
    data=csv,
    file_name=f"fitpersona_responses_{datetime.now().strftime('%Y%m%d_%H%M')}.csv",
    mime="text/csv",
)
