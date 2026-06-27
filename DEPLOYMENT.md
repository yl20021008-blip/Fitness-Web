# 部署教程

## 1. 上传 GitHub

解压 ZIP 后，把文件夹里的所有内容上传到 GitHub 仓库根目录。  
仓库根目录必须直接看到：

```txt
app.py
requirements.txt
ui/
.streamlit/
assets/
```

## 2. 本地测试

```bash
pip install -r requirements.txt
streamlit run app.py
```

打开浏览器显示的地址。

## 3. Streamlit Community Cloud

1. 打开 https://share.streamlit.io
2. 登录 GitHub
3. Create app
4. 选择你的仓库
5. Branch 选择 main
6. Main file path 填 `app.py`
7. Deploy

## 4. 国内访问

Streamlit Cloud 是海外服务，国内访问可能不稳定。  
后续正式上线国内用户，建议迁移到阿里云/腾讯云服务器 + Streamlit + Nginx + 域名。
