# 主站开发计划（动态配置驱动版）

> 技术栈：Vue3 + JavaScript + UnoCSS + Vue I18n  
> 国际化：中文（默认）+ 英文  
> 架构核心：所有子站信息通过 `public/config/sub-sites.json` 静态配置驱动，零代码新增子站

---

## 一、架构理念

### 1.1 核心设计

主站作为**纯展示型门户**，所有子站入口、分类、介绍等信息**不硬编码在组件中**，而是通过一个放置在 `public/` 目录下的静态 JSON 配置文件驱动。

**新增子站流程**：

```
开发/部署子站（独立进行，主站不关心细节）
    │
    ▼
修改 public/config/sub-sites.json
    │  ├─ 在 subSites 数组中新增子站对象
    │  ├─ 如需新分类，在 categories 数组中新增
    │  └─ 如需在首页展示，在 featuredGroups 中引用
    ▼
仅替换 JSON 文件
    │
    ▼
主站自动渲染新的子站入口
```

> **关键优势**：新增子站无需修改任何 Vue 组件代码，只需更新一个 JSON 文件，主站即自动适配。

### 1.2 数据流向

```
sub-sites.json (public/config/)
    │
    ├─→ App 启动时 fetch 加载
    │
    ├─→ 存入 Pinia Store（useSubSiteStore）
    │
    ├─→ Navbar 下拉菜单（动态渲染子站快捷入口）
    ├─→ SubSiteShowcase 区块（首页子站大卡片）
    ├─→ ToolCategoryTabs（分类筛选）
    ├─→ ToolGrid（工具卡片网格）
    └─→ Footer 子站链接列表
```

---

## 二、配置文件设计（sub-sites.json）

### 2.1 文件位置

```
public/
└── config/
    └── sub-sites.json          # 子站总配置
```

> 放在 `public` 目录下确保构建后可通过绝对路径 `/config/sub-sites.json` 直接访问，无需经过打包处理。

### 2.2 完整 Schema

```json
{
  "_meta": {
    "version": "1.0.0",
    "lastUpdated": "2026-08-27",
    "description": "子站及工具分类全局配置"
  },
  "categories": [
    {
      "id": "image",
      "name": {
        "zh": "图片工具",
        "en": "Image Tools"
      },
      "shortName": {
        "zh": "图片",
        "en": "Image"
      },
      "icon": "image",
      "iconType": "lucide",
      "color": "#10B981",
      "bgColor": "#D1FAE5",
      "sort": 1,
      "visible": true
    },
    {
      "id": "ai",
      "name": {
        "zh": "AI 工具",
        "en": "AI Tools"
      },
      "shortName": {
        "zh": "AI",
        "en": "AI"
      },
      "icon": "sparkles",
      "iconType": "lucide",
      "color": "#06B6D4",
      "bgColor": "#CFFAFE",
      "sort": 2,
      "visible": true
    },
    {
      "id": "utility",
      "name": {
        "zh": "实用工具",
        "en": "Utilities"
      },
      "shortName": {
        "zh": "工具",
        "en": "Tools"
      },
      "icon": "wrench",
      "iconType": "lucide",
      "color": "#6366F1",
      "bgColor": "#E0E7FF",
      "sort": 3,
      "visible": true
    }
  ],
  "subSites": [
    {
      "id": "image-compression",
      "path": "/app/image-compression",
      "name": {
        "zh": "图片压缩",
        "en": "Image Compression"
      },
      "description": {
        "zh": "智能无损压缩，支持 JPG/PNG/WebP，批量处理不损画质",
        "en": "Smart lossless compression for JPG/PNG/WebP with batch processing"
      },
      "shortDesc": {
        "zh": "无损压缩图片",
        "en": "Compress Images"
      },
      "category": "image",
      "icon": "compress",
      "iconType": "lucide",
      "coverImage": "/images/covers/image-compression.jpg",
      "badge": "hot",
      "badgeText": {
        "zh": "热门",
        "en": "Hot"
      },
      "color": "#10B981",
      "features": [
        { "zh": "无损压缩", "en": "Lossless" },
        { "zh": "批量处理", "en": "Batch" },
        { "zh": "多格式支持", "en": "Multi-format" }
      ],
      "stats": {
        "users": { "value": 150000, "suffix": { "zh": "万用户", "en": "K Users" } },
        "files": { "value": 1200000, "suffix": { "zh": "万文件", "en": "M Files" } }
      },
      "tags": ["image", "compression", "batch"],
      "isNew": false,
      "isExternal": false,
      "sort": 1,
      "visible": true
    },
    {
      "id": "image-editing",
      "path": "/app/image-editing",
      "name": {
        "zh": "图片编辑",
        "en": "Image Editing"
      },
      "description": {
        "zh": "在线裁剪、旋转、滤镜、调色，无需安装软件",
        "en": "Online crop, rotate, filter and adjust colors — no install needed"
      },
      "shortDesc": {
        "zh": "在线编辑图片",
        "en": "Edit Images"
      },
      "category": "image",
      "icon": "palette",
      "iconType": "lucide",
      "coverImage": "/images/covers/image-editing.jpg",
      "badge": null,
      "badgeText": null,
      "color": "#F59E0B",
      "features": [
        { "zh": "在线裁剪", "en": "Crop" },
        { "zh": "滤镜特效", "en": "Filters" },
        { "zh": "色彩调节", "en": "Color Adjust" }
      ],
      "stats": null,
      "tags": ["image", "edit", "filter"],
      "isNew": false,
      "isExternal": false,
      "sort": 2,
      "visible": true
    },
    {
      "id": "image-ai",
      "path": "/app/image-ai",
      "name": {
        "zh": "图片 AI",
        "en": "Image AI"
      },
      "description": {
        "zh": "AI 抠图、智能放大、背景替换、风格迁移",
        "en": "AI background removal, upscaling, replacement and style transfer"
      },
      "shortDesc": {
        "zh": "AI 处理图片",
        "en": "AI Image"
      },
      "category": "ai",
      "icon": "sparkles",
      "iconType": "lucide",
      "coverImage": "/images/covers/image-ai.jpg",
      "badge": "new",
      "badgeText": {
        "zh": "新上线",
        "en": "New"
      },
      "color": "#06B6D4",
      "features": [
        { "zh": "AI 抠图", "en": "AI Remove BG" },
        { "zh": "智能放大", "en": "AI Upscale" },
        { "zh": "风格迁移", "en": "Style Transfer" }
      ],
      "stats": null,
      "tags": ["ai", "image", "remove-bg", "upscale"],
      "isNew": true,
      "isExternal": false,
      "sort": 1,
      "visible": true
    },
    {
      "id": "web-tools",
      "path": "/app/web-tools",
      "name": {
        "zh": "工具箱",
        "en": "Web Tools"
      },
      "description": {
        "zh": "JSON 格式化、Base64 编解码、二维码生成、正则测试等实用小工具",
        "en": "JSON formatter, Base64 codec, QR code generator, regex tester and more"
      },
      "shortDesc": {
        "zh": "开发者工具集",
        "en": "Dev Toolkit"
      },
      "category": "utility",
      "icon": "wrench",
      "iconType": "lucide",
      "coverImage": "/images/covers/web-tools.jpg",
      "badge": null,
      "badgeText": null,
      "color": "#6366F1",
      "features": [
        { "zh": "JSON 工具", "en": "JSON Tools" },
        { "zh": "编码转换", "en": "Encoding" },
        { "zh": "二维码", "en": "QR Code" }
      ],
      "stats": null,
      "tags": ["json", "base64", "qr-code", "regex"],
      "isNew": false,
      "isExternal": false,
      "sort": 1,
      "visible": true
    }
  ],
  "featuredGroups": [
    {
      "id": "popular",
      "title": {
        "zh": "热门工具",
        "en": "Popular Tools"
      },
      "subtitle": {
        "zh": "最受欢迎的工具集合",
        "en": "Most popular tools"
      },
      "layout": "grid",
      "columns": 4,
      "siteIds": ["image-compression", "image-ai", "image-editing", "web-tools"]
    },
    {
      "id": "image-suite",
      "title": {
        "zh": "图片工具套件",
        "en": "Image Tool Suite"
      },
      "subtitle": {
        "zh": "一站式图片处理解决方案",
        "en": "One-stop image processing"
      },
      "layout": "horizontal",
      "columns": 3,
      "siteIds": ["image-compression", "image-editing", "image-ai"]
    }
  ],
  "homePage": {
    "stats": [
      {
        "id": "users",
        "value": 1000000,
        "suffix": { "zh": "+", "en": "+" },
        "label": { "zh": "活跃用户", "en": "Active Users" },
        "icon": "users"
      },
      {
        "id": "files",
        "value": 10000000,
        "suffix": { "zh": "+", "en": "+" },
        "label": { "zh": "文件处理", "en": "Files Processed" },
        "icon": "file-check"
      },
      {
        "id": "tools",
        "value": 50,
        "suffix": { "zh": "+", "en": "+" },
        "label": { "zh": "在线工具", "en": "Online Tools" },
        "icon": "box"
      },
      {
        "id": "uptime",
        "value": 99.9,
        "suffix": { "zh": "%", "en": "%" },
        "label": { "zh": "服务可用性", "en": "Uptime" },
        "icon": "activity"
      }
    ],
    "heroKeywords": [
      { "text": { "zh": "图片", "en": "Images" }, "color": "#F43F5E" },
      { "text": { "zh": "压缩", "en": "Compress" }, "color": "#10B981" },
      { "text": { "zh": "编辑", "en": "Edit" }, "color": "#F59E0B" },
      { "text": { "zh": "AI", "en": "AI" }, "color": "#06B6D4" },
      { "text": { "zh": "工具", "en": "Tools" }, "color": "#6366F1" }
    ]
  }
}
```

### 2.3 字段详解

#### `categories` — 分类定义

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 分类唯一标识，用于关联 subSites.category |
| `name` | object | ✅ | 分类全称，支持 zh/en |
| `shortName` | object | ✅ | 分类简称，用于 Tab 等紧凑场景 |
| `icon` | string | ✅ | 图标名称（对应 lucide 图标库）|
| `iconType` | string | ✅ | 图标库类型，默认 `lucide` |
| `color` | string | ✅ | 主题色（十六进制）|
| `bgColor` | string | ✅ | 浅色背景色（用于图标底色、标签底色）|
| `sort` | number | ✅ | 排序权重，越小越靠前 |
| `visible` | boolean | ✅ | 是否在前端展示 |

#### `subSites` — 子站定义

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 子站唯一标识 |
| `path` | string | ✅ | 跳转路径（如 `/app/image-compression`）|
| `name` | object | ✅ | 子站名称，zh/en |
| `description` | object | ✅ | 详细描述，用于大卡片展示 |
| `shortDesc` | object | ✅ | 短描述，用于小卡片/下拉菜单 |
| `category` | string | ✅ | 关联分类 id |
| `icon` | string | ✅ | 图标名称 |
| `iconType` | string | ✅ | 图标库类型 |
| `coverImage` | string | ❌ | 封面图路径（用于大卡片背景或配图）|
| `badge` | string | ❌ | 标签类型：`hot` / `new` / `beta` / `premium` / null |
| `badgeText` | object | ❌ | 标签文案，zh/en |
| `color` | string | ✅ | 子站主题色（可覆盖分类色）|
| `features` | array | ❌ | 功能点列表，每项含 zh/en |
| `stats` | object | ❌ | 子站统计数据（用户量、处理文件数等）|
| `tags` | array | ❌ | 搜索标签，用于首页搜索过滤 |
| `isNew` | boolean | ✅ | 是否标记为新上线 |
| `isExternal` | boolean | ✅ | 是否为外部链接（决定跳转方式）|
| `sort` | number | ✅ | 同分类内排序权重 |
| `visible` | boolean | ✅ | 是否展示 |

#### `featuredGroups` — 首页展示区块

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 区块唯一标识 |
| `title` | object | ✅ | 区块标题 |
| `subtitle` | object | ✅ | 区块副标题 |
| `layout` | string | ✅ | 布局模式：`grid`（网格）/ `horizontal`（横向卡片）/ `list`（列表）|
| `columns` | number | ✅ | 列数（响应式下自动降级）|
| `siteIds` | array | ✅ | 引用的子站 id 数组，决定展示顺序 |

#### `homePage` — 首页其他配置

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `stats` | array | ✅ | 首页统计数据条配置 |
| `heroKeywords` | array | ✅ | Hero 标题彩色关键词配置 |

---

## 三、主站组件适配方案

### 3.1 数据层：Pinia Store

```
stores/
└── subSite.js          # 子站配置全局状态
```

**核心状态**：

| State | 类型 | 说明 |
|-------|------|------|
| `config` | object | 完整的 sub-sites.json 数据 |
| `loading` | boolean | 配置加载状态 |
| `error` | string | 加载错误信息 |

**核心 Getters**：

| Getter | 说明 |
|--------|------|
| `visibleCategories` | 过滤出 visible=true 的分类，按 sort 排序 |
| `visibleSubSites` | 过滤出 visible=true 的子站，按 sort 排序 |
| `subSitesByCategory(categoryId)` | 按分类 id 筛选子站 |
| `featuredSubSites(groupId)` | 按 featuredGroup 的 siteIds 提取子站对象 |
| `subSiteById(id)` | 按 id 查找单个子站 |
| `searchSubSites(keyword)` | 按 keyword 匹配 name/description/tags |

**加载时机**：`App.vue` 的 `onMounted` 中发起 `fetch('/config/sub-sites.json')`，加载完成后全局可用。

### 3.2 组件与 JSON 的映射关系

| 组件 | 数据来源 | 动态行为 |
|------|----------|----------|
| **Navbar** | `visibleCategories` + `visibleSubSites` | 下拉菜单按分类分组渲染子站；新增分类/子站自动出现 |
| **HeroSection** | `homePage.heroKeywords` | 标题彩色关键词自动渲染；修改 JSON 即可换词换色 |
| **StatsBar** | `homePage.stats` | 统计数据、图标、标签全部来自配置；数字滚动动画保持 |
| **ToolCategoryTabs** | `visibleCategories` | Tab 列表完全由 categories 驱动；点击切换筛选 |
| **ToolGrid** | `visibleSubSites`（经分类/搜索筛选后）| 网格卡片根据子站数据动态渲染图标、颜色、徽章 |
| **SubSiteShowcase** | `featuredGroups` | 首页展示区块完全由 featuredGroups 定义；支持多种布局 |
| **Footer** | `visibleSubSites` | 子站链接列表自动更新 |

### 3.3 关键组件设计要点

#### SubSiteCard（子站卡片）

```
Props:
  - site: Object          # subSites 中的单个对象
  - layout: 'compact' | 'full' | 'horizontal'

动态渲染:
  - 图标: 根据 site.icon + site.iconType 渲染对应图标组件
  - 颜色: site.color 用于左侧色条、图标背景、hover 边框
  - 徽章: site.badge 非空时渲染 Badge 组件（颜色根据 badge 类型映射）
  - 文案: 根据当前语言（i18n locale）读取 site.name.zh 或 site.name.en
  - 跳转: site.isExternal ? 新窗口打开 : 当前页跳转 site.path
```

#### SubSiteShowcase（子站展示区块）

```
Props:
  - groupId: String       # 对应 featuredGroups 中的 id

动态渲染:
  - 标题: featuredGroup.title[locale]
  - 副标题: featuredGroup.subtitle[locale]
  - 布局: 根据 featuredGroup.layout 切换 grid/horizontal/list 模板
  - 子站: 通过 siteIds 从 Store 中提取子站对象数组，按 siteIds 顺序渲染
```

#### ToolCategoryTabs（分类筛选器）

```
动态渲染:
  - 第一个 Tab 固定为「全部」（All）
  - 后续 Tabs 按 categories.sort 渲染
  - Tab 文字: category.shortName[locale]（紧凑）或 name[locale]（宽松）
  - Tab 激活态颜色: category.color
```

---

## 四、开发阶段计划

### Phase 1：基础设施（第 1 周）

| 任务 | 产出 |
|------|------|
| 初始化 Vue3 + Vite + UnoCSS 项目 | 可运行的脚手架 |
| 配置 UnoCSS 主题预设 | colors、fonts、shortcuts、breakpoints |
| 接入 Vue I18n | `zh-CN` / `en` 切换、语言文件目录规范 |
| 搭建 Pinia + 配置加载机制 | `useSubSiteStore`，启动时自动 fetch JSON |
| 创建 JSON Schema 初版 | `public/config/sub-sites.json` 含 4 个现有子站数据 |
| 封装 Icon 组件 | 支持 `icon` + `iconType` 动态渲染（默认 lucide-vue-next）|

**里程碑**：修改 JSON 中的子站名称，页面上对应位置自动更新。

---

### Phase 2：核心组件开发（第 2-3 周）

#### 第 2 周：布局 + Hero + Stats

| 任务 | 说明 |
|------|------|
| AppLayout.vue | Navbar + Footer 外壳，语言切换逻辑 |
| Navbar.vue | 响应式导航，移动端汉堡菜单，子站下拉分组菜单（动态） |
| HeroSection.vue | 多色关键词标题（读取 `homePage.heroKeywords`）、副标题、搜索框 |
| StatsBar.vue | 4 项数据卡片，数字滚动动画，数据来自 `homePage.stats` |
| Footer.vue | 三栏布局，子站链接自动从 Store 生成 |

#### 第 3 周：工具展示 + 子站专区

| 任务 | 说明 |
|------|------|
| ToolCategoryTabs.vue | 动态分类 Tab，点击筛选 |
| ToolGrid.vue | 响应式网格，卡片数据驱动 |
| ToolCard.vue | 紧凑卡片：图标 + 名称 + 短描述 + 徽章 |
| SubSiteShowcase.vue | 大区块容器，支持多组 featuredGroups |
| SubSiteCard.vue | 大卡片：色条 + 图标 + 名称 + 详细描述 + 功能标签 + 跳转 |
| SearchInput.vue | 首页搜索框，实时过滤 subSites（匹配 name/description/tags） |

**里程碑**：首页完整可用，所有内容来自 JSON 配置，修改 JSON 即可增删改子站展示。

---

### Phase 3：交互与响应式（第 4 周）

| 任务 | 说明 |
|------|------|
| 页面加载动效 | 各区块 stagger 淡入上滑（100ms 间隔） |
| 数字滚动动画 | StatsBar 数字从 0 滚动到目标值 |
| 卡片悬停效果 | Y 轴上移 4px + 阴影加深，过渡 200ms |
| 搜索交互 | 输入时实时过滤 ToolGrid，无结果展示空状态 |
| 响应式适配 | Mobile（1-2 列）/ Tablet（3 列）/ Desktop（4 列） |
| 语言切换 | 切换时所有 JSON 中的多语言字段即时响应 |
| 错误处理 | JSON 加载失败时展示友好错误页 + 重试按钮 |

**里程碑**：所有交互流畅，三端响应式正常，语言切换无闪烁。

---

### Phase 4：配置化验证与文档（第 5 周）

| 任务 | 说明 |
|------|------|
| 新增虚拟子站测试 | 在 JSON 中新增一个测试子站，验证全链路自动渲染 |
| 修改分类测试 | 调整分类颜色、排序，验证 Tab 和分组菜单同步更新 |
| 隐藏子站测试 | 将 visible 设为 false，验证该子站从所有位置消失 |
| JSON 校验 | 编写 JSON Schema 校验（可选，用于 CI 阶段检查配置合法性） |
| 编写配置文档 | 为运营/产品人员编写「如何通过修改 JSON 新增子站」的操作手册 |

**里程碑**：非开发人员可通过修改 JSON 文件独立完成子站上线/下线/调整。

---

## 五、新增子站标准操作流程（SOP）

### 5.1 操作步骤

```
Step 1: 确认子站已可访问（无论部署在何处，主站只关心 path 是否可跳转）

Step 2: 准备子站素材
        ├─ 图标名称（从 lucide 图标库选择）
        ├─ 主题色（十六进制）
        ├─ 封面图（可选，放入 public/images/covers/）
        └─ 多语言文案（名称、描述、功能点）

Step 3: 编辑 public/config/sub-sites.json
        ├─ 如为新分类：在 categories 数组中新增分类对象
        └─ 在 subSites 数组中新增子站对象（参考现有结构）

Step 4: 如需在首页展示
        └─ 在 featuredGroups 中对应分组的 siteIds 里添加新子站 id

Step 5: 构建并部署主站（npm run build → 部署 dist/）

Step 6: 验证
        ├─ Navbar 下拉菜单中是否出现
        ├─ 对应分类 Tab 下是否出现
        ├─ 首页 featured 区块是否出现
        └─ 点击跳转是否正常
```

### 5.2 零代码原则检查表

- [ ] 新增子站**不需要**修改任何 `.vue` 文件
- [ ] 新增子站**不需要**修改任何 `.js` 逻辑文件
- [ ] 新增子站**不需要**修改路由配置
- [ ] 新增子站**不需要**修改 UnoCSS 配置
- [ ] 仅需修改 `sub-sites.json` 一个文件
- [ ] 构建部署后主站自动适配

---

## 六、文件目录结构

```
src/
├── components/
│   ├── ui/                     # 原子组件
│   │   ├── IconBox.vue         # 带背景色的图标容器
│   │   ├── Badge.vue           # 徽章标签（hot/new/beta）
│   │   └── AnimatedNumber.vue  # 数字滚动动画组件
│   ├── layout/
│   │   ├── Navbar.vue          # 导航栏（动态子站下拉）
│   │   └── Footer.vue          # 页脚（动态子站链接）
│   └── home/
│       ├── HeroSection.vue     # 首屏（动态彩色关键词）
│       ├── StatsBar.vue        # 数据统计条（动态数据）
│       ├── ToolCategoryTabs.vue # 分类筛选（动态分类）
│       ├── ToolGrid.vue        # 工具网格（动态卡片）
│       ├── ToolCard.vue        # 工具卡片
│       ├── SubSiteShowcase.vue # 子站展示区块（动态分组）
│       ├── SubSiteCard.vue     # 子站大卡片
│       └── SearchInput.vue     # 搜索框
├── stores/
│   └── subSite.js              # 子站配置 Pinia Store
├── composables/
│   ├── useI18n.js              # 语言切换
│   └── useSearch.js            # 搜索过滤逻辑
├── locales/
│   ├── zh-CN.json              # 通用 UI 文案（非子站内容）
│   └── en.json
├── views/
│   └── Home.vue                # 首页组装
├── App.vue
└── main.js

public/
├── config/
│   └── sub-sites.json          # ⭐ 子站核心配置文件
└── images/
    └── covers/                 # 子站封面图
        ├── image-compression.jpg
        ├── image-editing.jpg
        ├── image-ai.jpg
        └── web-tools.jpg
```

---

## 七、JSON 配置与组件的联动示例

### 场景：新增「PDF 转换」子站

**Step 1 — 修改 sub-sites.json**：

```json
{
  "categories": [
    // ... 现有分类
    {
      "id": "pdf",
      "name": { "zh": "PDF 工具", "en": "PDF Tools" },
      "shortName": { "zh": "PDF", "en": "PDF" },
      "icon": "file-text",
      "iconType": "lucide",
      "color": "#EF4444",
      "bgColor": "#FEE2E2",
      "sort": 4,
      "visible": true
    }
  ],
  "subSites": [
    // ... 现有子站
    {
      "id": "pdf-convert",
      "path": "/app/pdf-convert",
      "name": { "zh": "PDF 转换", "en": "PDF Converter" },
      "description": { "zh": "PDF 与 Word/Excel/PPT 互转，保持排版", "en": "Convert PDF to/from Word, Excel, PPT" },
      "shortDesc": { "zh": "PDF 格式转换", "en": "Convert PDF" },
      "category": "pdf",
      "icon": "file-text",
      "iconType": "lucide",
      "badge": "new",
      "badgeText": { "zh": "新上线", "en": "New" },
      "color": "#EF4444",
      "features": [
        { "zh": "多格式互转", "en": "Multi-format" },
        { "zh": "保留排版", "en": "Keep Layout" }
      ],
      "tags": ["pdf", "convert", "word"],
      "isNew": true,
      "isExternal": false,
      "sort": 1,
      "visible": true
    }
  ],
  "featuredGroups": [
    {
      "id": "popular",
      // ... 在 siteIds 末尾追加 "pdf-convert"
      "siteIds": ["image-compression", "image-ai", "image-editing", "web-tools", "pdf-convert"]
    }
  ]
}
```

**Step 2 — 效果（自动生效）**：

| 位置 | 自动变化 |
|------|----------|
| Navbar 下拉 | 新增「PDF 工具」分组，内含「PDF 转换」入口 |
| 分类 Tab | 新增「PDF」Tab，点击筛选出 PDF 转换卡片 |
| 热门区块 | 末尾新增 PDF 转换卡片，带红色主题 + New 徽章 |
| 搜索结果 | 搜索「pdf」或「转换」可匹配到该子站 |
| Footer | 子站链接列表自动追加 |

**全程无需修改任何 Vue 组件代码。**

---

## 八、风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| JSON 文件加载失败 | 高 | 添加加载状态与错误重试；失败时展示骨架屏 + 重试按钮 |
| JSON 格式错误 | 高 | 部署前人工检查；后续可引入 JSON Schema 校验到 CI 流程 |
| 子站 path 不可访问 | 中 | 主站只做链接跳转，不校验目标可用性；由子站自身保证 |
| 图片资源 404 | 低 | coverImage 为可选字段；404 时卡片降级为纯色背景 + 图标 |
| 配置字段缺失 | 中 | 组件中使用可选链 `site.badge?.text` + 提供默认值 |
| 多语言文案遗漏 | 低 | JSON 中所有文案字段强制要求 zh/en 双键，缺失时 fallback 到另一种语言 |

---

## 九、附录

### 9.1 图标命名规范

统一使用 [Lucide](https://lucide.dev/icons/) 图标库，命名直接采用其 kebab-case 名称：

| 用途 | 图标名 |
|------|--------|
| 图片相关 | `image`, `palette`, `compress`, `sparkles` |
| 工具相关 | `wrench`, `box`, `settings`, `zap` |
| 通用 | `users`, `file-check`, `activity`, `arrow-right` |

### 9.2 颜色使用规范

| 场景 | 规则 |
|------|------|
| 图标背景 | 使用 `category.bgColor` 或 `site.color` 的 10% 透明度 |
| 左侧色条 | 使用 `site.color` 纯色，宽度 4px |
| 徽章背景 | `hot`→rose, `new`→cyan, `beta`→amber, `premium`→indigo |
| 文字高亮 | Hero 关键词严格使用 `homePage.heroKeywords` 中定义的 color |

### 9.3 JSON 版本管理建议

- 每次修改 `sub-sites.json` 时，同步更新 `_meta.version` 和 `_meta.lastUpdated`
- 考虑将 JSON 文件独立托管到 CDN（如 `/config/sub-sites.json` 改为 CDN 地址），实现配置热更新无需重新构建主站
- 如需更灵活，可为主站添加「刷新配置」按钮，重新 fetch 最新 JSON

---

*文档版本：v1.0*  
*更新日期：2026-08-27*
