const CONTENT_DIRECTORY = 'contents/'
const CONTENT_SECTIONS = ['home', 'publications']

function applyConfig(config) {
  Object.entries(config).forEach(([id, value]) => {
    const element = document.getElementById(id)
    if (element) {
      element.textContent = value
    }
  })
}

async function loadConfig() {
  const response = await fetch(`${CONTENT_DIRECTORY}config.yml`)
  if (!response.ok) {
    throw new Error(`Unable to load config.yml (${response.status})`)
  }

  const config = jsyaml.load(await response.text())
  applyConfig(config)
}

async function loadMarkdown(sectionName) {
  const container = document.getElementById(`${sectionName}-md`)
  const response = await fetch(`${CONTENT_DIRECTORY}${sectionName}.md`)

  if (!response.ok) {
    throw new Error(`Unable to load ${sectionName}.md (${response.status})`)
  }

  container.innerHTML = marked.parse(await response.text())

  // Markdown 中可能包含外部链接，统一补充安全属性以避免新页面获得 opener 权限。
  container.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = 'noopener noreferrer'
  })
}

function showLoadError(sectionName) {
  const container = document.getElementById(`${sectionName}-md`)
  container.innerHTML = '<p class="error-message">This section could not be loaded. Please refresh the page and try again.</p>'
}

function updateActiveNavigation() {
  const navigationLinks = Array.from(document.querySelectorAll('.site-nav a'))
  const sections = navigationLinks
    .map((link) => document.getElementById(link.dataset.section))
    .filter(Boolean)

  // 选取最接近视口上缘的已到达区块，避免长页面滚动时导航状态频繁跳动。
  const activeSection = sections.reduce((active, section) => {
    return section.getBoundingClientRect().top <= 140 ? section : active
  }, sections[0])

  navigationLinks.forEach((link) => {
    const isActive = link.dataset.section === activeSection.id
    if (isActive) {
      link.setAttribute('aria-current', 'true')
    } else {
      link.removeAttribute('aria-current')
    }
  })
}

window.addEventListener('DOMContentLoaded', async () => {
  marked.use({ mangle: false, headerIds: false })

  const configTask = loadConfig().catch((error) => {
    console.error(error)
  })

  const contentTasks = CONTENT_SECTIONS.map((sectionName) => {
    return loadMarkdown(sectionName).catch((error) => {
      console.error(error)
      showLoadError(sectionName)
    })
  })

  await Promise.all([configTask, ...contentTasks])
  updateActiveNavigation()

  window.addEventListener('scroll', updateActiveNavigation, { passive: true })
})
