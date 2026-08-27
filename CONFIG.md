# 主站配置指南（运营 / 产品操作手册）

> 主站是**配置驱动**的纯展示门户：所有子站入口、分类、首页区块均由
> `public/config/sub-sites.json` 一个 JSON 文件驱动。
> **新增 / 下线 / 调整子站，无需修改任何 Vue 组件或代码，改完 JSON 重新构建部署即可。**

---

## 1. 配置文件

| 项 | 说明 |
|---|---|
| 路径 | `public/config/sub-sites.json` |
| 构建后访问 | `/config/sub-sites.json`（public 目录原样拷贝到 dist） |
| 版本管理 | 每次修改请同步更新 `_meta.version` 与 `_meta.lastUpdated` |

---

## 2. 快速上手：新增一个子站

```jsonc
// 在 subSites 数组中追加（示例：新增「PDF 转换」）
{
  "id": "pdf-convert",                       // 唯一 id，不能与其他子站重复
  "path": "/app/pdf-convert",                // 子站访问路径（主站只负责跳转，不校验可用性）
  "name": { "zh": "PDF 转换", "en": "PDF Converter" },
  "description": { "zh": "PDF 与 Word/Excel 互转，保持排版", "en": "Convert PDF to/from Word, Excel, PPT" },
  "shortDesc": { "zh": "PDF 格式转换", "en": "Convert PDF" },
  "category": "utility",                     // 关联 categories 中的 id；新分类需先在 categories 里定义
  "icon": "file-text",                       // lucide 图标名（kebab-case）
  "iconType": "lucide",
  "coverImage": "/images/covers/pdf-convert.svg",   // 可选；缺失时卡片自动降级为纯色渐变
  "badge": "new",                            // 可选：hot / new / beta / premium / null
  "badgeText": { "zh": "新上线", "en": "New" },
  "color": "#EF4444",                        // 主题色，驱动卡片色条 / 图标 / 高亮
  "features": [                              // 可选：功能标签
    { "zh": "多格式互转", "en": "Multi-format" }
  ],
  "stats": null,                             // 可选：大卡片统计，如 {"users":{"value":150000,"suffix":{"zh":"+","en":"+"}}}
  "tags": ["pdf", "convert"],                // 搜索标签（中英文关键词均可命中）
  "isNew": true,
  "isExternal": false,                       // true = 外部链接，新窗口打开
  "sort": 2,                                 // 同分类内排序，越小越靠前
  "visible": true                            // false = 全站隐藏
}
```

### 想让新子站出现在首页展示区？

在 `featuredGroups` 对应分组的 `siteIds` 数组里追加它的 id：

```jsonc
{ "id": "popular", "layout": "grid", "columns": 4,
  "siteIds": ["image-compression", "image-ai", "image-editing", "web-tools", "pdf-convert"] }
```

### 新增一个分类？

在 `categories` 数组追加：

```jsonc
{ "id": "pdf", "name": { "zh": "PDF 工具", "en": "PDF Tools" },
  "shortName": { "zh": "PDF", "en": "PDF" },
  "icon": "file-text", "iconType": "lucide",
  "color": "#EF4444", "bgColor": "#FEE2E2", "sort": 4, "visible": true }
```

---

## 3. 修改 / 隐藏 / 下线子站

| 需求 | 操作 |
|---|---|
| 改名称 / 描述 / 颜色 / 图标 | 直接改对应字段，中英文键 `zh` / `en` 都要写（缺失自动回退另一种语言） |
| 从首页展示区移除 | 把 id 从 `featuredGroups[].siteIds` 中删除 |
| 全站隐藏（含下拉菜单、Tab、Footer） | `"visible": false` |
| 永久下线 | 删除该子站对象 |

---

## 4. 首页其他配置（homePage）

| 字段 | 说明 |
|---|---|
| `homePage.stats` | 统计条数据：value（数字滚动动画）、suffix、label、icon |
| `homePage.heroKeywords` | Hero 标题彩色轮播关键词：text（zh/en）、color |

---

## 5. 发布流程

```bash
# 1. 修改 public/config/sub-sites.json（并更新 _meta 版本号）
# 2. 构建
npm run build
# 3. 部署 dist/ 到服务器主站目录（配合 Caddy：/ → 主站，/app/* → 子站）
# 4. 验证
npm run smoke     # 可选：无头浏览器冒烟（需本机 Edge/Chrome）
```

## 6. 验证清单（上线前）

- [ ] Navbar「工具分类」下拉出现新入口
- [ ] 「全部工具」对应分类 Tab 下出现新卡片
- [ ] featured 首页区块出现新卡片
- [ ] 搜索关键词（中/英）能命中
- [ ] Footer 链接列表已更新
- [ ] 点击跳转到 `/app/{id}/` 正常

## 7. 图标名称参考

统一使用 [Lucide](https://lucide.dev/icons/) 的 kebab-case 名称。
常用：`image`、`palette`、`compress`、`sparkles`、`wrench`、`file-text`、`users`、`file-check`、`box`、`activity`、`zap`、`settings`。
> 注：旧版 `compress` 图标在新版 Lucide 中已更名为 `shrink`，主站同时兼容 `compress` 名称。
