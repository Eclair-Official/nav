// main.js

// =========================================================================
// 1. 工具函数
// =========================================================================

function debounce(func, delay) {
    let timeoutId
    return function (...args) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}

// =========================================================================
// 2. 应用状态与元素获取
// =========================================================================

const state = {
    currentBgType: window.siteConfig.background.defaultType,
    currentTheme: 'dark',
    availableThemes: Object.keys(window.siteConfig.themes),
    bgIntervalId: null
}

let elements = {
    header: document.getElementById('main-header'),
    content: document.getElementById('content-item'),
    searchInput: document.getElementById('search-input'),
    themeToggleBtn: document.getElementById('theme-toggle'),
    clockWidget: document.getElementById('clock-widget'),
    siteTitle: document.getElementById('site-title'),
    siteSubtitle: document.getElementById('site-subtitle'),
    siteFooter: document.getElementById('site-footer'),
    githubLink: document.getElementById('github-link'),
    body: document.body,
    root: document.documentElement,
    // [增强] 获取 Favicon link 元素
    favicon: document.getElementById('site-favicon')
}

// =========================================================================
// 3. 核心渲染功能
// =========================================================================

function renderCards(data) {
    const { content } = elements

    if (!data || data.length === 0) {
        content.innerHTML = '<p id="no-results">没有找到匹配的网站。</p>'
        return
    }

    content.innerHTML = ''

    for (const category of data) {
        const categorySection = document.createElement('section')
        categorySection.classList.add('nav-category')

        const categoryTitle = document.createElement('h2')
        categoryTitle.classList.add('category-title')
        categoryTitle.textContent = category.category
        categorySection.appendChild(categoryTitle)

        const cardGrid = document.createElement('div')
        cardGrid.classList.add('nav-cards')

        for (const item of category.items) {
            const card = document.createElement('a')
            card.href = item.url
            card.dataset.target = item.target || '_blank'
            card.classList.add('nav-card')

            if (card.dataset.target === '_blank') {
                card.target = '_blank'
            }
            card.rel = 'noopener noreferrer'

            const icon = item.icon || window.siteConfig.defaultIcon
            card.innerHTML = `
                <span class="iconify" data-icon="${icon}" data-fallback="${item.name.charAt(0)}"></span>
                <div class="card-title">${item.name}</div>
                <div class="card-description">${item.description}</div>
            `

            cardGrid.appendChild(card)
        }

        categorySection.appendChild(cardGrid)
        content.appendChild(categorySection)
    }
}

// =========================================================================
// 4. 功能模块
// -------------------------------------------------------------------------

// --- 搜索功能 ---
const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim()
    if (!searchTerm) {
        renderCards(window.navData)
        return
    }

    const filteredData = window.navData
        .map((category) => ({
            ...category,
            items: category.items.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm)
            )
        }))
        .filter((category) => category.items.length > 0)

    renderCards(filteredData)
}
elements.searchInput.addEventListener('input', debounce(handleSearch, 300))

// --- 主题切换功能 ---
function applyTheme(themeName) {
    const { themes } = window.siteConfig
    if (!themes[themeName]) return

    state.currentTheme = themeName
    const theme = themes[themeName]
    const { root, themeToggleBtn } = elements

    for (const [key, value] of Object.entries(theme)) {
        if (typeof value === 'string') {
            root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value)
        }
    }

    themeToggleBtn.innerHTML = `<span class="iconify" data-icon="${
        theme.isLight ? 'ph:moon-bold' : 'ph:sun-bold'
    }"></span>`

    localStorage.setItem('theme', themeName)
    applyBackground(state.currentBgType)
}

elements.themeToggleBtn.addEventListener('click', () => {
    const currentIndex = state.availableThemes.indexOf(state.currentTheme)
    const nextIndex = (currentIndex + 1) % state.availableThemes.length
    applyTheme(state.availableThemes[nextIndex])
})

// --- 背景应用功能 ---
function applyBackground(type) {
    state.currentBgType = type
    if (state.bgIntervalId) clearInterval(state.bgIntervalId)
    state.bgIntervalId = null

    const { background } = window.siteConfig
    const { body } = elements

    body.style.backgroundImage = background.gradients[state.currentTheme] || background.defaultGradient
}

// --- 时钟功能 ---
function updateClock() {
    const now = new Date()
    const timeString = now.toLocaleTimeString('zh-CN', { hour12: false })
    const dateString = now
        .toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .replace(/\//g, '-')
    const weekdayString = '星期' + '日一二三四五六'.charAt(now.getDay())

    const timeEl = elements.clockWidget?.querySelector('.clock-time')
    const dateEl = elements.clockWidget?.querySelector('.clock-date')
    const weekdayEl = elements.clockWidget?.querySelector('.clock-weekday')

    if (timeEl) timeEl.textContent = timeString
    if (dateEl) dateEl.textContent = dateString
    if (weekdayEl) weekdayEl.textContent = weekdayString
}

// --- 动态布局功能 ---
function setMainPadding() {
    // [已清理] 移除了无效的注释代码。

    const header = document.getElementById('main-header')
    const footer = document.getElementById('site-footer')
    const main = document.getElementById('content')

    if (!header || !footer || !main) {
        console.warn('Layout elements not found, cannot set dynamic padding.')
        return
    }

    const headerHeight = header.offsetHeight
    main.style.paddingTop = `${headerHeight}px`

    const footerHeight = footer.offsetHeight
    const viewportHeight = window.innerHeight
    const mainContentHeight = main.scrollHeight - parseInt(main.style.paddingTop || 0)
    const availableHeight = viewportHeight - headerHeight - footerHeight

    if (mainContentHeight < availableHeight) {
        const requiredBottomPadding = availableHeight - mainContentHeight
        main.style.paddingBottom = `${requiredBottomPadding}px`
    } else {
        main.style.paddingBottom = `${footerHeight}px`
    }
}
window.addEventListener('resize', debounce(setMainPadding, 100))

// =========================================================================
// 5. 应用初始化
// -------------------------------------------------------------------------

function init() {
    if (window.siteConfig) {
        const { title, subtitle, githubRepoUrl, footer } = window.siteConfig
        document.title = title
        elements.siteTitle.textContent = title
        elements.siteSubtitle.textContent = subtitle

        if (elements.githubLink && githubRepoUrl && !githubRepoUrl.includes('YOUR_USERNAME')) {
            elements.githubLink.href = githubRepoUrl
        } else {
            elements.githubLink.style.display = 'none'
            console.warn('GitHub repository URL is not configured correctly.')
        }
        if (elements.siteFooter && footer) {
            let footerHTML = ''
            if (footer.copyright) {
                footerHTML += `<p>${footer.copyright}</p>`
            }
            if (footer.poweredBy) {
                footerHTML += `<p>${footer.poweredBy}</p>`
            }
            elements.siteFooter.innerHTML = footerHTML
        }
    }

    const savedTheme = localStorage.getItem('theme')
    const initialTheme = savedTheme && state.availableThemes.includes(savedTheme) ? savedTheme : 'dark'
    applyTheme(initialTheme)

    applyBackground(window.siteConfig.background.defaultType)

    updateClock()
    setInterval(updateClock, 1000)
    renderCards(window.navData)

    setTimeout(setMainPadding, 0)
}

document.addEventListener('DOMContentLoaded', init)
