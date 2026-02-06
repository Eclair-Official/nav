// script.js

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
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// =========================================================================
// 2. 应用状态与元素获取
// =========================================================================

// --- DOM 元素 ---
const elements = {
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
};

// --- 应用状态 ---
const state = {
    currentBgType: window.siteConfig.background.defaultType,
    currentTheme: 'dark',
    availableThemes: Object.keys(window.siteConfig.themes),
    bgIntervalId: null,
};

// =========================================================================
// 3. 核心渲染功能
// =========================================================================

/**
 * 渲染导航卡片到DOM
 * @param {Array} data - 要渲染的导航数据
 */
function renderCards(data) {
    const { content } = elements;

    if (!data || data.length === 0) {
        content.innerHTML = '<p id="no-results">没有找到匹配的网站。</p>';
        return;
    }

    content.innerHTML = ''; // 清空现有内容

    for (const category of data) {
        const categorySection = document.createElement('section');
        categorySection.classList.add('nav-category');

        const categoryTitle = document.createElement('h2');
        categoryTitle.classList.add('category-title');
        categoryTitle.textContent = category.category;
        categorySection.appendChild(categoryTitle);

        const cardGrid = document.createElement('div');
        cardGrid.classList.add('nav-cards');
        
        for (const item of category.items) {
            const card = document.createElement('a');
            card.href = item.url;
            card.classList.add('nav-card');
            card.target = '_blank';
            card.rel = 'noopener noreferrer';

            const icon = item.icon || window.siteConfig.defaultIcon;
            card.innerHTML = `
                <span class="iconify" data-icon="${icon}" data-fallback="链接"></span>
                <div class="card-title">${item.name}</div>
                <div class="card-description">${item.description}</div>
            `;
            cardGrid.appendChild(card);
        }

        categorySection.appendChild(cardGrid);
        content.appendChild(categorySection);
    }
}

// =========================================================================
// 4. 功能模块
// -------------------------------------------------------------------------

// --- 搜索功能 ---
const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (!searchTerm) {
        renderCards(window.navData);
        return;
    }

    const filteredData = window.navData
        .map(category => ({
            ...category,
            items: category.items.filter(
                item => item.name.toLowerCase().includes(searchTerm) ||
                        item.description.toLowerCase().includes(searchTerm)
            ),
        }))
        .filter(category => category.items.length > 0);

    renderCards(filteredData);
};
elements.searchInput.addEventListener('input', debounce(handleSearch, 300));


// --- 主题切换功能 ---
/**
 * 应用指定的主题
 * @param {string} themeName - 主题名称
 */
function applyTheme(themeName) {
    const { themes } = window.siteConfig;
    if (!themes[themeName]) return;

    state.currentTheme = themeName;
    const theme = themes[themeName];
    const { root, themeToggleBtn } = elements;

    // 应用 CSS 变量
    for (const [key, value] of Object.entries(theme)) {
        if (typeof value === 'string') { // 确保只处理颜色/字符串值
            root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
        }
    }
    
    // 切换按钮图标
    themeToggleBtn.innerHTML = `<span class="iconify" data-icon="${
        theme.isLight ? 'ph:moon-bold' : 'ph:sun-bold'
    }"></span>`;

    localStorage.setItem('theme', themeName);
    // 主题切换后，重新应用背景，以更新可能的渐变色
    applyBackground(state.currentBgType);
}

elements.themeToggleBtn.addEventListener('click', () => {
    const currentIndex = state.availableThemes.indexOf(state.currentTheme);
    const nextIndex = (currentIndex + 1) % state.availableThemes.length;
    applyTheme(state.availableThemes[nextIndex]);
});


// --- 背景应用功能 ---
/**
 * 应用背景（渐变）
 * @param {string} type - 背景类型 ('gradient')
 */
function applyBackground(type) {
    state.currentBgType = type;
    if (state.bgIntervalId) clearInterval(state.bgIntervalId);
    state.bgIntervalId = null;

    const { background } = window.siteConfig;
    const { body } = elements;
    

    body.style.backgroundImage = background.gradients[state.currentTheme] || background.defaultGradient;


    // localStorage.setItem('backgroundType', type);
}


// --- 时钟功能 ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', { hour12: false });
    const dateString = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const weekdayString = '星期' + '日一二三四五六'.charAt(now.getDay());

    const timeEl = elements.clockWidget?.querySelector('.clock-time');
    const dateEl = elements.clockWidget?.querySelector('.clock-date');
    const weekdayEl = elements.clockWidget?.querySelector('.clock-weekday');

    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
    if (weekdayEl) weekdayEl.textContent = weekdayString;
}


// --- 动态布局功能 ---
function setMainPadding() {
  
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main#content');

    if (!header || !footer || !main) {
        console.warn("Layout elements not found, cannot set dynamic padding.");
        return;
    }

    // 1. 为固定的 header 留出空间
    const headerHeight = header.offsetHeight;
    main.style.paddingTop = `${headerHeight}px`;

    // 2. 判断是否需要让页脚“吸底”
    const footerHeight = footer.offsetHeight;
    const viewportHeight = window.innerHeight;
    const mainContentHeight = main.scrollHeight - parseInt(main.style.paddingTop || 0);
    const availableHeight = viewportHeight - headerHeight - footerHeight;

    if (mainContentHeight < availableHeight) {
        const requiredBottomPadding = availableHeight - mainContentHeight;
        main.style.paddingBottom = `${requiredBottomPadding}px`;
    } else {
        main.style.paddingBottom = `${footerHeight}px`;
    }
}
window.addEventListener('resize', debounce(setMainPadding, 100));


// =========================================================================
// 5. 应用初始化
// -------------------------------------------------------------------------

function init() {
    // 应用网站配置
    if (window.siteConfig) {
        const { title, subtitle, githubRepoUrl,footer } = window.siteConfig;
        document.title = title;
        elements.siteTitle.textContent = title;
        elements.siteSubtitle.textContent = subtitle;
        elements.siteFooter.textContent=footer;
        if (elements.githubLink && githubRepoUrl) {
            elements.githubLink.href = githubRepoUrl;
        }
           // --- 新增：应用 Footer 配置 ---
           if (elements.siteFooter && footer) {
            let footerHTML = '';
            if (footer.copyright) {
                footerHTML += `<p>${footer.copyright}</p>`;
            }
            if (footer.poweredBy) {
                footerHTML += `<p>${footer.poweredBy}</p>`;
            }
            // 如果未来添加了 extraLinks，可以在这里循环渲染
            // if (footer.extraLinks && footer.extraLinks.length > 0) {
            //     footerHTML += '<nav>';
            //     footer.extraLinks.forEach(link => {
            //         footerHTML += `<a href="${link.url}" target="_blank">${link.name}</a>`;
            //     });
            //     footerHTML += '</nav>';
            // }
            elements.siteFooter.innerHTML = footerHTML;
        }
    }

    // 恢复或应用默认主题/背景
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = (savedTheme && state.availableThemes.includes(savedTheme)) ? savedTheme : 'dark';
    applyTheme(initialTheme);

    // const savedBgType = localStorage.getItem('backgroundType');
    // const initialBgType = savedBgType || window.siteConfig.background.defaultType;
    applyBackground(window.siteConfig.background.defaultType);

    // 启动功能
    updateClock();
    setInterval(updateClock, 1000);
    renderCards(window.navData);
    // 使用 setTimeout 确保 DOM 和样式已完全渲染后再计算布局
    setTimeout(setMainPadding, 0);
}

// 当DOM加载完毕后初始化应用
document.addEventListener('DOMContentLoaded', init);