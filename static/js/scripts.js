function initializeTheme() {
  const button = document.getElementById('themeToggle')
  const preference = window.matchMedia('(prefers-color-scheme: dark)')
  let savedTheme = null

  // 隐私模式或存储被禁用时，仍允许本次访问切换主题。
  try { savedTheme = localStorage.getItem('theme') } catch {}

  function setTheme(isDark) {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    button.setAttribute('aria-pressed', String(isDark))
    button.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode')
    const visitorMap = document.getElementById('visitor-map')
    if (visitorMap) {
      // 使用服务端配色保留真实统计标记，避免 CSS 滤镜改变访客标记颜色。
      const mapUrl = new URL(visitorMap.src)
      mapUrl.searchParams.set('cl', isDark ? '69788b' : 'd8e3ee')
      mapUrl.searchParams.set('co', isDark ? '1A1917' : 'FAF9F7')
      mapUrl.searchParams.set('ct', isDark ? 'b8c4d2' : '65758a')
      if (mapUrl.href !== visitorMap.src) visitorMap.src = mapUrl.href
    }
  }

  setTheme(savedTheme ? savedTheme === 'dark' : preference.matches)
  button.addEventListener('click', () => {
    const isDark = document.documentElement.dataset.theme !== 'dark'
    savedTheme = isDark ? 'dark' : 'light'
    setTheme(isDark)
    try { localStorage.setItem('theme', savedTheme) } catch {}
  })
  preference.addEventListener('change', (event) => {
    if (!savedTheme) setTheme(event.matches)
  })
}

function renderSections(container, markdown, initialTitle) {
  const source = document.createElement('div')
  source.innerHTML = marked.parse(markdown)
  const output = document.createDocumentFragment()
  let body = null

  function createSection(title) {
    const section = document.createElement('section')
    section.className = 'section visible'
    const heading = document.createElement('h2')
    heading.className = 'section-title'
    heading.textContent = title
    body = document.createElement('div')
    body.className = 'section-body'
    section.append(heading, body)
    output.appendChild(section)
  }

  if (initialTitle) createSection(initialTitle)
  // 保留两个 Markdown 作为唯一资料入口，把标题转换为原模板的独立内容块。
  Array.from(source.children).forEach((element) => {
    if (/^H[1-4]$/.test(element.tagName)) {
      createSection(element.textContent)
    } else {
      if (!body) createSection('Publications')
      body.appendChild(element)
    }
  })
  container.replaceChildren(output)
  container.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = 'noopener noreferrer'
  })
}

async function loadContent(name, initialTitle) {
  const container = document.getElementById(name + '-md')
  try {
    const response = await fetch('contents/' + name + '.md')
    if (!response.ok) throw new Error('HTTP ' + response.status)
    renderSections(container, await response.text(), initialTitle)
  } catch (error) {
    // 显示可操作的失败提示，避免网络错误留下永久加载占位。
    container.innerHTML = '<p class="error-message">This section could not be loaded. Please refresh and try again.</p>'
    console.error('Unable to load ' + name, error)
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  initializeTheme()
  marked.use({ mangle: false, headerIds: false })
  await Promise.all([loadContent('home', 'About Me'), loadContent('publications')])
})
