# FitPersona v4 部署教程

## 一、创建 Supabase 数据库

1. 打开 Supabase，新建项目
2. 进入 SQL Editor
3. 打开本项目的 `sql/supabase_schema.sql`
4. 复制全部 SQL，运行

这会创建：

- `fitpersona_responses`：测试结果表
- `fitpersona_events`：事件表

并且开启 RLS，只允许匿名用户 insert，不允许匿名读取。

## 二、获取 Supabase Keys

在 Supabase：

```txt
Project Settings -> API
```

复制：

```txt
Project URL
anon public key
service_role key
```

注意：

- `anon public key` 可以给前台写入用
- `service_role key` 只能给后台用，绝对不要写进前端代码或 GitHub

## 三、上传 GitHub

解压 ZIP 后，把文件夹里的所有内容上传到 GitHub 仓库根目录。

根目录应该直接看到：

```txt
app.py
admin_dashboard.py
requirements.txt
ui/
sql/
.streamlit/
```

不要多套一层文件夹。

## 四、部署前台 app.py

在 Streamlit Community Cloud：

```txt
Create app
Repository: 你的仓库
Branch: main
Main file path: app.py
```

然后在 Secrets 里填：

```toml
[supabase]
url = "https://你的项目id.supabase.co"
anon_key = "你的 anon public key"
service_role_key = "你的 service_role key"

[admin]
password = "你自己设置一个后台密码"
```

前台只会把 `url` 和 `anon_key` 注入前端。

## 五、部署后台 admin_dashboard.py

你可以再创建一个 Streamlit App，指向同一个仓库：

```txt
Main file path: admin_dashboard.py
```

Secrets 填同样内容。

打开后台后，需要输入 `[admin] password` 才能查看数据。

## 六、数据字段

`fitpersona_responses` 会记录：

- participant_id：匿名用户 ID
- result_code：人格代码
- persona_name：人格名称
- score：原始分数
- dimensions：四维百分比
- answers：每题题干、选项、加分
- user_agent：浏览器信息
- screen_width / screen_height：屏幕尺寸
- timezone / language：时区与语言
- referrer / page_url：来源与页面
- created_at：提交时间

不收集手机号、微信、姓名和精准定位。


## v4.1 默认匿名提交

这一版前台默认 `consent = true`。  
用户进入页面后，如果不关闭匿名提交，完成测试后会自动写入 `fitpersona_responses`。


## v4.1.1 页面修复

如果你已经部署过旧版，上传本版覆盖 GitHub 后，在 Streamlit Cloud 点击 Reboot / Rerun 即可刷新。


## v4.1.2 底部工具栏修复

如果底部 Tabbar 仍然没有刷新，请在 Streamlit Cloud 里点击：

```txt
Manage app -> Reboot app
```

手机端也建议清理浏览器缓存或重新打开链接。


## v4.1.3 用户端顶部说明移除

本版移除了前台顶部的 “后台数据说明 / Data Notice”。  
覆盖 GitHub 后，请在 Streamlit Cloud 里点击：

```txt
Manage app -> Reboot app
```


## v4.1.4 顶部区域压缩

本版移除了 App 内部顶部品牌栏，减少手机端浏览器标题栏下方的空白。  
外部浏览器或小红书 WebView 自带的标题栏不是网页内容，无法通过代码删除。


## v4.1.5 右下角 Streamlit 浮窗

本版已尽量隐藏 Streamlit 外层控件。  
如果你自己登录 Streamlit 管理员账号访问，平台仍可能显示 Manage app 浮窗。请用无痕模式或另一台未登录 Streamlit 的手机测试真实用户视角。
