/**
 * 主站冒烟测试（无头浏览器）
 * 用法：node scripts/smoke.mjs [url]
 * 需要本机 Edge/Chrome；验证配置驱动渲染 + 搜索/筛选/语言切换联动。
 */
import puppeteer from 'puppeteer-core'
import { existsSync } from 'node:fs'

const url = process.argv[2] || 'http://127.0.0.1:4317/'

const edgeCandidates = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
]
const executablePath = edgeCandidates.find((p) => existsSync(p))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  if (!executablePath) throw new Error('未找到 Edge/Chrome')

  const browser = await puppeteer.launch({
    executablePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  })

  const page = await browser.newPage()
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`))

  const results = []
  const check = (name, ok, extra = '') => {
    results.push({ name, ok, extra })
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? `  (${extra})` : ''}`)
  }

  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.waitForSelector('.card', { timeout: 15000 }).catch(() => {})
  await sleep(1200)

  // 1. 基础结构
  const title = await page.title()
  check('页面标题', title.includes('ToolBox'), title)

  const brand = await page.$eval('header', (h) => h.textContent.includes('ToolBox'))
  check('Navbar 品牌', brand)

  const heroH1 = await page.$eval('h1', (h) => h.textContent)
  check('Hero 标题渲染', heroH1.length > 4, heroH1)

  const statCards = await page.$$eval('section .grid > .card', (els) => els.length)
  check('统计卡片(4)', statCards === 4, `got ${statCards}`)

  // 2. 配置驱动的工具卡片
  const toolCardNames = await page.$$eval('#tools a[href^="/app/"]', (els) =>
    els.map((e) => e.textContent.trim().split('\n')[0]),
  )
  check('全部工具卡片(4)', toolCardNames.length === 4, toolCardNames.join(' | '))

  const hasImageCompression = toolCardNames.some((n) => n.includes('图片压缩'))
  check('含"图片压缩"卡片', hasImageCompression)

  // 3. 展示区块
  const sectionTitles = await page.$$eval('h2', (els) => els.map((e) => e.textContent.trim()))
  check('展示区块"热门工具"', sectionTitles.includes('热门工具'), sectionTitles.join(' | '))
  check('展示区块"图片工具套件"', sectionTitles.includes('图片工具套件'))

  // 4. 搜索联动
  await page.type('input[type="text"]', '压缩')
  await sleep(500)
  const filtered = await page.$$eval('#tools a[href^="/app/"]', (els) => els.length)
  const resultText = await page.$eval('#tools .text-sm.font-medium', (e) => e.textContent).catch(() => '')
  check('搜索"压缩"过滤', filtered > 0 && filtered < 4, `cards=${filtered} ${resultText}`)
  await page.click('button[aria-label="clear"]')
  await sleep(400)

  // 5. 分类 Tab 筛选
  const tabBtns = await page.$$eval('#tools .no-scrollbar button', (els) => els.map((e) => e.textContent.trim()))
  check('分类 Tab(全部+3)', tabBtns.length === 4, tabBtns.join(' | '))
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#tools .no-scrollbar button')]
    const ai = btns.find((b) => b.textContent.trim() === 'AI')
    ai && ai.click()
  })
  await sleep(400)
  const aiCards = await page.$$eval('#tools a[href^="/app/"]', (els) => els.length)
  check('AI 分类筛选=1', aiCards === 1, `cards=${aiCards}`)
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('#tools .no-scrollbar button')]
    const all = btns.find((b) => b.textContent.trim() === '全部')
    all && all.click()
  })
  await sleep(300)

  // 6. 语言切换 → EN
  await page.evaluate(() => {
    const langBtn = [...document.querySelectorAll('[data-dropdown] button')].find((b) =>
      b.textContent.includes('中文'),
    )
    langBtn && langBtn.click()
  })
  await sleep(200)
  const enOptions = await page.$$eval('[data-dropdown] [data-dropdown] button, [data-dropdown] > div button', (els) =>
    els.map((e) => e.textContent.trim()),
  ).catch(() => [])
  const enBtn = await page.evaluateHandle(() => {
    const all = [...document.querySelectorAll('button')]
    return all.find((b) => b.textContent.trim() === 'English') || null
  })
  if (enBtn) {
    await enBtn.asElement().click()
    await sleep(600)
    const h1En = await page.$eval('h1', (h) => h.textContent)
    check('切换英文 Hero', /Make .* easier/.test(h1En), h1En)
    const allToolsEn = await page.$$eval('h2', (els) => els.map((e) => e.textContent.trim()))
    check('英文区块标题', allToolsEn.includes('Popular Tools'), allToolsEn.join(' | '))
    // 切回中文
    await page.evaluate(() => {
      const langBtn = [...document.querySelectorAll('[data-dropdown] button')].find((b) =>
        b.textContent.includes('EN'),
      )
      langBtn && langBtn.click()
    })
    await sleep(200)
    const zhBtn = await page.evaluateHandle(() =>
      [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === '简体中文'),
    )
    if (zhBtn) {
      await zhBtn.asElement().click()
      await sleep(500)
    }
  } else {
    check('英文切换入口', false, '未找到 English 按钮')
  }

  // 7. 子站链接（整页跳转目标）
  const hrefs = await page.$$eval('a[href^="/app/"]', (els) => [...new Set(els.map((e) => e.getAttribute('href')))])
  const expect = ['/app/image-compression/', '/app/image-editing/', '/app/image-ai/', '/app/web-tools/']
  const missing = expect.filter((h) => !hrefs.includes(h))
  check('子站跳转路径', missing.length === 0, hrefs.join(' '))

  // 8. 错误收集
  check('无控制台错误', errors.length === 0, errors.slice(0, 3).join(' || '))

  await page.screenshot({ path: 'smoke-shot.png', fullPage: false })
  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error('SMOKE FAILED:', e.message)
  process.exit(1)
})
