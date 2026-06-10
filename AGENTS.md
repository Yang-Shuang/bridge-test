# bridge-test - Web ↔ App 交互测试工具

## 📌 项目简介

一个纯静态的 Web 页面，用于测试 Web 与 Android App 之间的交互功能（Scheme URL 跳转、JS Bridge 调用）。可直接部署到 WebView 中运行。

---

## ✨ 核心功能

### Scheme URL 跳转
- `myapp://` / `ugo://` 等自定义协议唤起 App 页面
- 支持带参数传递（如 liveId、token 等）

### JS Bridge 方法调用
- `window.android.showToast()` — Toast 提示
- `window.android.closePage()` — 关闭 WebView
- `window.android.saveImageToGallery()` — 保存图片到相册
- `window.android.toWXAuth()` — 微信授权
- `window.android.toShareNew()` — 分享功能（图片/链接）
- `window.android.getDeviceInfo()` — 获取设备信息

---

## 🎨 UI 设计原则

1. **精美好看** — 面向发布，渐变头部、卡片阴影悬浮效果、响应式布局
2. **移动端优先** — 单列网格自动适配屏幕宽度
3. **零依赖** — 纯 HTML + CSS，无第三方库或框架

---

## 📐 Tab 导航规范

- 使用 `<input type="radio">` + `:checked` 伪类实现纯 CSS tab 切换（零 JavaScript）
- Tab 按钮：普通圆角样式、靠左排列、超出屏幕可横向滚动
- 选中状态：紫色背景 + 白色文字
- 新增模块只需复制三行结构：input → label → section

---

## 💻 代码规范

### HTML (`index.html`)
- 保持简洁，测试项卡片通过注释标注如何新增（复制粘贴即可）
- 布局结构固定：Tab input → Tab 导航 → 各模块 section

### JavaScript (`app.js`)
| 场景 | 存放位置 | 示例 |
|------|----------|------|
| **复杂逻辑**（多行、有数据定义） | `app.js` 中定义函数，HTML onclick 引用 | `saveImageToGallery()`、`shareImg()` |
| **简单一行**（直接调用 Bridge） | HTML 中直接写 onclick | `onclick="window.android.showToast('Hello')"` |

### ⚠️ 关键约束：测试工具代码必须简单直接

> **核心原则：** 此工具的唯一目的是**测试 App 交互功能**，不是展示前端技术。所有测试相关代码必须保持最简单、最直接的实现方式，**严禁使用任何复杂交互逻辑**。
> 
> - **不要用 JS 实现动画、状态管理、事件绑定等复杂逻辑** — Tab 切换用 CSS `:checked`，不要写 JavaScript 控制显示隐藏
> - **避免额外的数据校验、错误处理、条件分支** — 测试代码只负责调用 Bridge/Scheme，不关心返回结果（除非必要）
> - **HTML 中直接写 onclick/href，不要在 JS 中用 addEventListener 绑定事件** — 保持"看到 HTML 就知道会发生什么"
> - **严禁使用第三方库、框架、构建工具** — 纯原生 HTML/CSS/JS
> - **新增测试项必须是复制粘贴修改即可** — 如果某个功能需要超过 3 行解释才能理解，说明太复杂了

### CSS (`styles.css`)
- 使用 CSS 变量管理主题色和样式
- 响应式断点：600px（移动端单列布局）

---

## 🛠️ 如何扩展

### 新增 Tab 模块（3步）
1. 复制一行 `<input type="radio" name="tab" id="tab-xxx">`
2. 复制一行 `<label for="tab-xxx" class="tab-label">模块名</label>`
3. 复制一个 `<section id="panel-xxx">...</section>`

### 新增测试项（1步）
直接复制现有卡片结构，修改 href/onclick/标题即可。

---

## 📁 项目文件

```
bridge-test/
├── index.html    # 主页面（Tab + 模块布局）
├── styles.css    # 样式定义（CSS变量、响应式）
├── app.js        # JavaScript 函数库（Bridge 调用封装）
└── icons.json    # Emoji 图标参考表（150+常用图标）
```

---

## 🚀 使用方式

将项目文件部署到任意静态服务器，或在 Android App 的 WebView 中加载：
```java
webView.loadUrl("file:///android_asset/index.html");
// 或远程 URL: webView.loadUrl("https://your-server.com/bridge-test/");
```
