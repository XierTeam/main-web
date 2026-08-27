/** 配置加载失败 → 错误面板 + 重试 路径验证 */
import puppeteer from 'puppeteer-core'
import { existsSync } from 'node:fs'
import { renameSync } from 'node:fs'

const exe = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
].find((p) => existsSync(p))

const url = process.argv[2] || 'http://127.0.0.1:4317/'
const cfg = 'dist/config/sub-sites.json'
const bak = cfg + '.bak'

renameSync(cfg, bak) // 模拟配置缺失
try {
  const browser = await puppeteer.launch({
    executablePath: exe,
    headless: 'new',
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  const errs = []
  page.on('pageerror', (e) => errs.push(e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text())
  })

  await page.goto(url, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 1500))

  const body = await page.evaluate(() => document.body.textContent)
  console.log('error panel title shown:', body.includes('页面加载失败'))
  console.log('retry button shown:', body.includes('重新加载'))

  // 恢复配置后点击重试 → 页面应正常渲染
  renameSync(bak, cfg)
  const retryBtn = await page.evaluateHandle(() =>
    [...document.querySelectorAll('button')].find((b) => b.textContent.includes('重新加载')),
  )
  if (retryBtn) {
    await retryBtn.asElement().click()
    await new Promise((r) => setTimeout(r, 1500))
    const ok = await page.evaluate(() => !!document.querySelector('#tools a[href^="/app/"]'))
    console.log('retry recovers page:', ok)
  } else {
    console.log('retry recovers page: FAIL (no button)')
  }
  console.log('errors:', errs.length ? errs.join(' | ') : 'none')
  await browser.close()
} finally {
  if (existsSync(bak) && !existsSync(cfg)) renameSync(bak, cfg) // 兜底恢复
}
