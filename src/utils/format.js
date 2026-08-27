/** 数字千分位格式化 */
export function formatNumber(n) {
  return Number(n).toLocaleString('en-US')
}

/** #RRGGBB → rgba() */
export function hexToRgba(hex, alpha = 1) {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '')
  if (!m) return hex || 'transparent'
  const [, r, g, b] = m
  return `rgba(${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}, ${alpha})`
}

/**
 * 子站跳转路径。
 * 外部站点原样返回（新窗口打开）；内部路径统一补尾斜杠，兼容 Caddy handle_path 前缀匹配。
 */
export function toPath(site) {
  if (site.isExternal) return site.path
  return (site.path || '/').replace(/\/?$/, '/')
}
