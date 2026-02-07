// main.js

// =========================================================================
// 1. 工具函数
// =========================================================================

/**
 * 防抖函数：在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。
 * @param {Function} func - 需要防抖的函数。
 * @param {number} delay - 延迟时间（毫秒）。
 * @returns {Function} - 防抖处理后的函数。
 */
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

// --- 应用状态 ---
const state = {
    currentBgType: window.siteConfig.background.defaultType,
    currentTheme: 'dark',
    availableThemes: Object.keys(window.siteConfig.themes),
    bgIntervalId: null
}

// --- 元素获取函数 ---

// --- 全局 elements 对象 ---
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
    // --- Iframe 相关 ---
    iframeView: document.getElementById('iframe-view'),
    contentIframe: document.getElementById('content-iframe'),
    iframeUrlInput: document.getElementById('iframe-url-input'),
    iframeCloseBtn: document.getElementById('iframe-close-btn'),
    iframeBackBtn: document.getElementById('iframe-back-btn'),
    iframeForwardBtn: document.getElementById('iframe-forward-btn'),
    iframeRefreshBtn: document.getElementById('iframe-refresh-btn'),
    iframeLoadingOverlay: document.querySelector('.iframe-loading-overlay')
}

// =========================================================================
// 3.5. Iframe 管理器
// =========================================================================
const IframeManager = {
    init() {
        // 绑定控制栏事件
        elements.iframeCloseBtn.addEventListener('click', () => this.close())
        elements.iframeRefreshBtn.addEventListener('click', () => this.refresh())
        elements.iframeBackBtn.addEventListener('click', () => this.back())
        elements.iframeForwardBtn.addEventListener('click', () => this.forward())

        // 监听 iframe 加载和滚动
        elements.contentIframe.addEventListener('load', () => this.handleLoad())

        document.addEventListener('keydown', (e) => this.handleKeydown(e))
    },

    open(url) {
        const { hostname } = new URL(url)
        if (window.siteConfig.iframe.blockedHosts.includes(hostname)) {
            alert(`安全提示：网站 "${hostname}" 不允许在 iframe 中嵌入，将为您在新标签页打开。`)
            window.open(url, '_blank')
            return
        }

        this.showLoading()
        elements.iframeUrlInput.value = url
        elements.contentIframe.src = url
        // --- 修改开始 ---
        // 1. 防止底层页面滚动
        elements.body.style.overflow = 'hidden'
        // 2. 暂停 setMainPadding 的影响，让弹层布局完全独立
        elements.body.classList.add('iframe-view-is-active')
        // --- 修改结束 ---

        elements.iframeView.classList.add('active')
    },

    close() {
        elements.iframeView.classList.remove('active')
        elements.contentIframe.src = 'about:blank'
        // --- 修改开始 ---
        // 1. 恢复底层页面滚动
        elements.body.style.overflow = ''
        // 2. 恢复 setMainPadding 的正常工作
        elements.body.classList.remove('iframe-view-is-active')
        // --- 修改结束 ---
    },

    refresh() {
        this.showLoading()
        elements.contentIframe.src = elements.contentIframe.src
    },

    back() {
        elements.contentIframe.contentWindow.history.back()
    },

    forward() {
        elements.contentIframe.contentWindow.history.forward()
    },

    handleLoad() {
        this.hideLoading()
        this.updateAddressBar()
        this.applyContentFullscreenStyles()
    },

    handleKeydown(e) {
        if (!elements.iframeView.classList.contains('active')) return

        if (e.key === 'Escape') {
            this.close()
        }
    },

    // --- 内容优化 ---
    updateAddressBar() {
        try {
            elements.iframeUrlInput.value = elements.contentIframe.contentWindow.location.href
        } catch (e) {
            // 跨域时，保持显示初始URL
        }
    },

    applyContentFullscreenStyles() {
        const header = document.getElementById('iframe-header')

        const main = document.getElementById('iframe-main')

        if (!header || !main) {
            console.warn('Layout elements not found, cannot set dynamic padding.')
            return
        }

        const headerHeight = header.offsetHeight
        main.style.paddingTop = `${headerHeight}px`
    },

    // --- UI 状态 ---
    showLoading() {
        elements.iframeLoadingOverlay.classList.remove('hidden')
    },

    hideLoading() {
        elements.iframeLoadingOverlay.classList.add('hidden')
    }
}

// =========================================================================
// 3. 核心渲染功能
// =========================================================================

/**
 * 渲染导航卡片到DOM
 * @param {Array} data - 要渲染的导航数据
 */
function renderCards(data) {
    const { content } = elements

    if (!data || data.length === 0) {
        content.innerHTML = '<p id="no-results">没有找到匹配的网站。</p>'
        return
    }

    content.innerHTML = '' // 清空现有内容

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
            // 改为 <div>，因为我们要自己处理点击
            const card = document.createElement('div')
            card.classList.add('nav-card')
            card.style.cursor = 'pointer'

            const icon = item.icon || window.siteConfig.defaultIcon
            card.innerHTML = `
              <span class="iconify" data-icon="${icon}" data-fallback="${item.name.charAt(0)}"></span>
                <div class="card-title">${item.name}</div>
                <div class="card-description">${item.description}</div>
            `

            // 添加点击事件监听器
            card.addEventListener('click', () => {
                if (item.target === 'iframe') {
                    IframeManager.open(item.url)
                } else {
                    window.open(item.url, '_blank', 'noopener,noreferrer')
                }
            })

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
    // --- 新增：守卫条件 ---
    // 如果 body 有 'iframe-view-is-active' 类，说明 iframe 弹层已打开，此时直接返回，不做任何布局计算。
    if (document.body.classList.contains('iframe-view-is-active')) {
        return
    }
    // --- 新增结束 ---

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

    // 初始化 Iframe Manager
    IframeManager.init()

    setTimeout(setMainPadding, 0)
}

document.addEventListener('DOMContentLoaded', init)
