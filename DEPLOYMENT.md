# 部署教程

## 1. 上传到 GitHub

1. 新建 GitHub 仓库，比如 `fitpersona-streamlit`
2. 把这个文件夹里的所有文件上传到仓库根目录
3. 确认根目录里能看到：
   - `app.py`
   - `requirements.txt`
   - `ui/`
   - `.streamlit/`

## 2. 本地测试

在项目文件夹里运行：

```bash
pip install -r requirements.txt
streamlit run app.py
```

浏览器会打开本地 Streamlit 页面。

## 3. Streamlit Community Cloud 部署

1. 打开 https://share.streamlit.io
2. 登录 GitHub
3. 点击 Create app
4. 选择你的仓库和 branch
5. Main file path 填写：

```txt
app.py
```

6. 点击 Deploy

## 4. 常见问题

### 页面空白

检查 GitHub 仓库里是否有：

```txt
ui/styles.css
ui/data.js
ui/app.js
```

### 部署失败

检查 `requirements.txt` 是否存在，且内容至少有：

```txt
streamlit>=1.36
```

### 国内访问不稳定

Streamlit Community Cloud 是海外服务。国内访问不稳定时，建议后续迁移到阿里云 / 腾讯云服务器，用 Nginx 反向代理 Streamlit 的 8501 端口。
