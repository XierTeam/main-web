# 主站及子站集群开发计划

> 技术栈：Vue3 + JavaScript + UnoCSS + Caddy  
> 国际化：中文（默认）+ 英文  

---

## 一、总体架构

### 1.1 部署拓扑

```
用户请求
    │
    ▼
┌─────────────┐
│   Caddy     │  ← 统一入口、自动 HTTPS、路由分发
│  (443/80)   │
└──────┬──────┘
       │
       ├─ /                → 主站 (Main Site)
       ├─ /app/image-compression  → 图片压缩子站
       ├─ /app/image-editing      → 图片编辑子站
       ├─ /app/image-ai           → 图片 AI 子站
       ├─ /app/web-tools          → 工具箱子站
       └─ /app/xxx                → 未来新增子站（动态扩展）
```

### 1.2 核心设计原则

| 原则 | 说明 |
|------|------|
| **子站独立构建** | 每个子站是独立的 Vue3 SPA，独立 `vite build`，互不影响 |
| **子路径路由** | Caddy 通过 `handle_path` 按 `/app/{name}/*` 分发，自动剥离前缀 |
| **统一域名品牌** | 所有站点共享同一域名，用户感知为「一个平台的多个工具」|
| **新增即插即用** | 新增子站只需：① 开发子站 ② 配置 Caddy 路由 ③ 部署构建产物 |

---

## 二、Caddy 路由分发方案

### 2.1 Caddyfile 配置

```caddyfile
yourdomain.com {
    # ── 安全响应头（全站通用） ──
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
    }

    # ── 子站：图片压缩 ──
    handle_path /app/image-compression/* {
        root /var/www/sites/image-compression
        try_files {path} /index.html
        file_server
    }

    # ── 子站：图片编辑 ──
    handle_path /app/image-editing/* {
        root /var/www/sites/image-editing
        try_files {path} /index.html
        file_server
    }

    # ── 子站：图片 AI ──
    handle_path /app/image-ai/* {
        root /var/www/sites/image-ai
        try_files {path} /index.html
        file_server
    }

    # ── 子站：工具箱 ──
    handle_path /app/tool-box/* {
        root /var/www/sites/tool-box
        try_files {path} /index.html
        file_server
    }

    # ── 主站兜底（必须放在最后） ──
    handle {
        root /var/www/sites/main
        try_files {path} /index.html
        file_server
    }
}
```

### 2.2 配置要点说明

| 要点 | 说明 |
|------|------|
| `handle_path` | 匹配路径前缀并**自动剥离**该前缀后再转发。例如请求 `/app/image-compression/upload` 到达子站时变为 `/upload` |
| `try_files {path} /index.html` | SPA 必备：前端路由（如 `/app/image-compression/editor`）由 Vue Router 接管，刷新页面不 404 |
| `handle` 兜底 | 必须置于最后，作为默认路由处理主站请求及未匹配子站的 fallback |
| 顺序无关性 | `handle_path` 与 `handle` 是互斥的，Caddy 按定义顺序匹配，首个命中即停止 |

### 2.3 各子站构建配置

每个子站的 `vite.config.js` 必须设置对应的 `base` 路径：

```js
// 主站
base: '/'

// 图片压缩子站
base: '/app/image-compression/'

// 图片编辑子站
base: '/app/image-editing/'

// 图片 AI 子站
base: '/app/image-ai/'

// 工具箱子站
base: '/app/web-tools/'
```

> **注意**：`base` 必须以 `/` 开头和结尾，确保资源引用（JS/CSS 等）路径正确。

---

## 三、目录与工程结构

### 3.1 仓库组织（Monorepo 建议）

```
tools-platform/
├── caddy/
│   └── Caddyfile
├── sites/
│   ├── main/                    # 主站
│   │   ├── src/
│   │   ├── public/
│   │   ├── vite.config.js       # base: '/'
│   │   └── package.json
│   ├── image-compression/       # 图片压缩子站
│   │   ├── src/
│   │   ├── vite.config.js       # base: '/app/image-compression/'
│   │   └── package.json
│   ├── image-editing/           # 图片编辑子站
│   │   ├── src/
│   │   ├── vite.config.js       # base: '/app/image-editing/'
│   │   └── package.json
│   ├── image-ai/                # 图片 AI 子站
│   │   ├── src/
│   │   ├── vite.config.js       # base: '/app/image-ai/'
│   │   └── package.json
│   └── web-tools/               # 工具箱子站
│       ├── src/
│       ├── vite.config.js       # base: '/app/web-tools/'
│       └── package.json
├── packages/                    # 共享包（可选）
│   ├── ui-kit/                  # 通用组件库
│   ├── utils/                   # 工具函数
│   └── uno-preset/              # UnoCSS 预设配置
└── package.json
```

### 3.2 构建产物部署目录（服务器）

```
/var/www/sites/
├── main/                   # 主站 dist 产物
│   ├── index.html
│   └── assets/
├── image-compression/      # 图片压缩子站 dist 产物
│   ├── index.html
│   └── assets/
├── image-editing/
├── image-ai/
└── web-tools/
```

---

## 四、开发阶段计划

### Phase 1：基础设施搭建（第 1-2 周）

| 任务 | 产出 | 负责人 |
|------|------|--------|
| 初始化 Monorepo 结构 | 目录规范、根 package.json、workspace 配置 | 前端基建 |
| 配置 UnoCSS 全局预设 | `uno-preset` 包：色板、字体、 shortcuts、 breakpoints | 前端基建 |
| 搭建 Vue3 + Vite 主站脚手架 | 主站可运行、热更新正常 | 前端基建 |
| 接入 Vue I18n | `zh-CN` / `en` 双语切换、语言文件目录规范 | 前端基建 |
| 搭建 Caddy 本地代理环境 | 本地 Caddyfile，支持 `localhost` 子路径分发调试 | 运维/前端 |
| 制定组件规范 | IconBox、Badge、Card、Button 等原子组件 API | 前端基建 |

**Phase 1 里程碑**：本地访问 `localhost` 可看到主站骨架，语言切换正常。

---

### Phase 2：主站首页开发（第 3-4 周）

| 任务 | 产出 |
|------|------|
| Navbar 组件 | Logo、导航、语言切换、子站下拉入口 |
| HeroSection 组件 | 彩色关键词标题、副标题、搜索框 |
| StatsBar 组件 | 4 项数据卡片 + 数字滚动动画 |
| ToolCategoryTabs + ToolGrid | 分类筛选 + 工具卡片网格 |
| SubSiteShowcase 组件 | 4 个子站入口大卡片 |
| Footer 组件 | 三栏页脚 |
| 响应式适配 | Mobile / Tablet / Desktop 三端布局 |
| 首页动效 | 淡入上滑、悬停提升、数字滚动 |

**Phase 2 里程碑**：主站首页完整可用，所有区块与 TinyWow 参考一致，响应式正常。

---

### Phase 3：子站接入与联调（第 5-7 周）

| 周次 | 任务 |
|------|------|
| 第 5 周 | 图片压缩子站（`image-compression`）独立构建 + Caddy 路由联调 |
| 第 6 周 | 图片编辑子站（`image-editing`）+ 图片 AI 子站（`image-ai`）并行开发 |
| 第 7 周 | 工具箱子站（`web-tools`）开发 + 全站跳转链路测试 |

**关键动作**：
- 每个子站独立配置 `vite.config.js` 的 `base` 字段
- 子站内部使用 `vue-router` 时，路由路径无需带 `/app/xxx` 前缀（Caddy 已剥离）
- 主站 → 子站跳转使用 `<a href="/app/image-compression/">` 或 `window.location.href`，保持整页刷新（子站独立 SPA）
- 子站 → 主站返回统一使用 `/` 或面包屑导航

**Phase 3 里程碑**：4 个子站全部可通过主域名 `/app/xxx` 访问，主站入口跳转正常。

---

### Phase 4：新增子站标准化流程（持续）

后续每新增一个子站，执行以下标准化流程：

```
Step 1: 在 sites/ 下新建子站目录，复制子站模板
        └─ 模板包含：vite.config.js（预留 base 占位）、目录结构、基础布局

Step 2: 开发子站业务逻辑（独立迭代，不影响其他站点）

Step 3: 修改 vite.config.js → base: '/app/{new-site-name}/'

Step 4: 执行构建 → 产物输出到 dist/

Step 5: 部署到服务器 /var/www/sites/{new-site-name}/

Step 6: 修改 Caddyfile，新增 handle_path 块（一行配置）
        handle_path /app/{new-site-name}/* {
            root /var/www/sites/{new-site-name}
            try_files {path} /index.html
            file_server
        }

Step 7: 重载 Caddy（caddy reload）

Step 8: 主站 SubSiteShowcase 中新增入口卡片（可选，视是否需要在首页展示）
```

**预计耗时**：新增一个标准子站，从开发到上线约 **3-5 天**（不含复杂业务逻辑）。

---

### Phase 5：运维与优化（第 8 周及以后）

| 任务 | 说明 |
|------|------|
| CI/CD 流水线 | GitHub Actions / GitLab CI：自动构建各站点 → 自动部署到服务器 → 自动重载 Caddy |
| 资源缓存策略 | Caddy 中为 `*.js`、`*.css` 配置长期缓存（`Cache-Control: max-age=31536000`），配合 Vite 的 hash 文件名 |
| Gzip/Brotli 压缩 | Caddy 开启 `encode gzip zstd` |
| 日志与监控 | Caddy 访问日志统一输出，按子站路径过滤分析 |
| 回滚机制 | 各站点构建产物保留最近 3 个版本，支持快速回滚 |

---

## 五、主站 → 子站跳转规范

### 5.1 跳转方式

由于各子站是**独立 SPA**，非微前端架构，主站跳转子站采用**整页跳转**：

```html
<!-- 主站中链接到子站 -->
<a href="/app/image-compression/">图片压缩</a>
```

```js
// 或编程式跳转
window.location.href = '/app/image-compression/'
```

### 5.2 子站返回主站

每个子站 Navbar 保留「返回首页」入口：

```html
<a href="/">🏠 返回首页</a>
```

### 5.3 子站间跳转

```html
<a href="/app/image-editing/">去图片编辑</a>
```

> 所有跨站跳转均为整页刷新，避免 Vue Router 跨域/路径冲突问题。

---

## 六、风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| 子站资源路径 404 | 高 | 严格检查 `vite.config.js` 的 `base` 配置，与 Caddy `handle_path` 前缀保持一致 |
| 子站刷新 404 | 高 | 每个子站 Caddy 配置必须包含 `try_files {path} /index.html` |
| 新增子站 Caddy 配置遗漏 | 中 | 将 Caddyfile 纳入版本控制，新增子站必须同步修改并 Code Review |
| 构建产物体积过大 | 中 | 各子站独立构建，Vite 自动分包；主站不打包子站代码 |
| 子站样式/组件重复 | 低 | 提取 `packages/ui-kit` 共享包，各子站引入；或允许子站轻微差异化 |

---

## 七、附录：快速参考

### 7.1 新增子站 Checklist

- [ ] 新建 `sites/{site-name}/` 目录
- [ ] 配置 `vite.config.js`：`base: '/app/{site-name}/'`
- [ ] 开发完成并构建：`npm run build`
- [ ] 部署产物到 `/var/www/sites/{site-name}/`
- [ ] Caddyfile 新增 `handle_path /app/{site-name}/*` 块
- [ ] 执行 `caddy reload` 或 `systemctl reload caddy`
- [ ] 主站新增入口卡片（如需在首页展示）
- [ ] 测试访问 `https://yourdomain.com/app/{site-name}/`

### 7.2 Caddy 常用命令

```bash
# 验证配置
caddy validate --config /etc/caddy/Caddyfile

# 重载配置（零停机）
caddy reload --config /etc/caddy/Caddyfile

# 查看实时日志
caddy log

# 停止/启动
systemctl stop caddy
systemctl start caddy
```

---

*文档版本：v1.0*  
*更新日期：2026-08-27*
