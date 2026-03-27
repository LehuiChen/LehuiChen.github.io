const content_dir = 'contents/'
const config_file = 'config.yml'
const section_names = ['home', 'publications', 'awards', 'team', 'news']

function setSafeExternalLinkDefaults(root) {
  root.querySelectorAll('a[target="_blank"]').forEach((link) => {
    link.rel = 'noopener noreferrer'
  })
}

function removeInlinePresentation(root) {
  root.querySelectorAll('[style]').forEach((element) => {
    element.removeAttribute('style')
  })

  root.querySelectorAll('[onmouseover],[onmouseout]').forEach((element) => {
    element.removeAttribute('onmouseover')
    element.removeAttribute('onmouseout')
  })
}

function enhanceCardSection(sectionName, container) {
  removeInlinePresentation(container)

  const firstParagraph = Array.from(container.children).find((element) => element.tagName === 'P')
  if (firstParagraph) {
    firstParagraph.classList.add('section-intro')
  }

  const headings = Array.from(container.children).filter((element) => /^H[1-6]$/.test(element.tagName))
  headings.forEach((heading) => {
    heading.classList.add('section-redundant-heading')
  })

  const cardGrid = Array.from(container.children).find((element) => {
    return element.tagName === 'DIV' && Array.from(element.children).some((child) => child.tagName === 'DIV')
  })

  if (!cardGrid) {
    return
  }

  cardGrid.classList.add('card-grid')

  Array.from(cardGrid.children).forEach((card) => {
    if (card.tagName !== 'DIV') {
      return
    }

    card.classList.add('content-card', `${sectionName}-card`)

    const title = card.querySelector('h3')
    if (title) {
      title.classList.add('content-card-title')
    }

    const text = card.querySelector('p')
    if (text) {
      text.classList.add('content-card-text')
    }

    const media = card.querySelector('img')
    if (media) {
      media.classList.add('content-card-media')
      media.loading = 'lazy'
      media.decoding = 'async'
    }
  })
}

function enhanceSectionContent(sectionName, container) {
  setSafeExternalLinkDefaults(container)

  if (sectionName === 'home') {
    const firstParagraph = Array.from(container.children).find((element) => element.tagName === 'P')
    if (firstParagraph) {
      firstParagraph.classList.add('section-intro', 'section-intro-highlight')
    }
  }

  if (sectionName === 'team' || sectionName === 'news') {
    enhanceCardSection(sectionName, container)
  }
}

function typesetSection(container) {
  if (!window.MathJax) {
    return Promise.resolve()
  }

  if (typeof window.MathJax.typesetPromise === 'function') {
    return window.MathJax.typesetPromise([container])
  }

  if (typeof window.MathJax.typeset === 'function') {
    window.MathJax.typeset([container])
  }

  return Promise.resolve()
}

window.addEventListener('DOMContentLoaded', () => {
  const mainNav = document.body.querySelector('#mainNav')
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      offset: 74,
    })
  }

  const navbarToggler = document.body.querySelector('.navbar-toggler')
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  )

  responsiveNavItems.forEach((responsiveNavItem) => {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click()
      }
    })
  })

  fetch(content_dir + config_file)
    .then(response => response.text())
    .then(text => {
      const yml = jsyaml.load(text)
      Object.keys(yml).forEach((key) => {
        try {
          document.getElementById(key).innerHTML = yml[key]
        } catch {
          console.log('Unknown id and value: ' + key + ',' + yml[key].toString())
        }
      })
    })
    .catch(error => console.log(error))

  setSafeExternalLinkDefaults(document)
  marked.use({ mangle: false, headerIds: false })

  section_names.forEach((name) => {
    fetch(content_dir + name + '.md')
      .then(response => response.text())
      .then(markdown => {
        const html = marked.parse(markdown)
        const container = document.getElementById(name + '-md')
        container.innerHTML = html
        enhanceSectionContent(name, container)
        return typesetSection(container)
      })
      .catch(error => console.log(error))
  })
})
