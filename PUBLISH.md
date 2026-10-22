# GitHub Pages 发布与维护

本仓库的页面入口为根目录的 `index.html`。

## 现有网站更新

保持仓库 **Settings → Pages → Build and deployment** 为：

- Source：`Deploy from a branch`
- Branch：`main`
- Folder：`/(root)`

将更新提交到 `main` 后，GitHub Pages 会按仓库设置进行部署。请在 **Actions** 中确认 Pages 工作流完成后，再打开网站核对实际内容：

https://kimio-hub.github.io/loop-transformer-atlas/

“已提交代码”“Pages 构建成功”和“已验证公网页面”是三个不同状态，发布记录应如实区分。

## 必须一起发布的文件

`index.html`、`assets/site.css`、`assets/site.js`、`catalog.json`、`editorial.json` 和 `.nojekyll`。

只上传 `index.html` 会丢失样式、交互或数据。`site_template.html` 是入口源文件，`build_site.py` 是本地构建和校验工具；GitHub Pages 不需要运行 Python。

## 编辑与自检

```bash
python build_site.py --check
python -m http.server 8000
```

修改 `site_template.html` 后，先运行 `python build_site.py` 重新生成入口。修改目录或导读 JSON 后，网页会在下次加载时读取新数据。

样式或交互有更新时，可以同时更新模板里的静态资源版本查询参数，并重新构建。浏览器仍显示旧版时可强制刷新；不要为了刷新页面清除网站存储，否则读者会丢失本地书架。

## 回退

保留 Git 历史。出现问题时，可以通过正常的 revert 提交回退对应更新；不要强制覆盖分支历史，也不要删除整个仓库。涉及多人同时修改时，先核对分支最新提交。

## 可离线打开的版本

```bash
python build_site.py --standalone dist/loop-atlas.html
```

该文件用于分享或离线阅读；日常维护仍应修改源文件，而不是编辑导出的单文件。
