// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 初始化与元素获取 ---
    const content = document.getElementById('content');
    const searchInput = document.getElementById('search-input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bgToggleBtn = document.getElementById('bg-toggle');
    const bgRefreshBtn = document.getElementById('bg-refresh-btn');
    const clockWidget = document.getElementById('clock-widget');
    const siteTitle = document.getElementById('site-title');
    const siteSubtitle = document.getElementById('site-subtitle');

    let currentBgType = 'gradient';
    let currentTheme = 'dark';
    let availableThemes = Object.keys(window.siteConfig.themes);
    let bgIntervalId;
    
    // --- 2. 核心渲染函数 ---
    function renderCards(data) { /* ... 保持不变 ... */ 
        content.innerHTML = ''; if (!data || data.length === 0) { content.innerHTML = '<p id="no-results">没有找到匹配的网站。</p>'; return; }
        data.forEach(category => { const categorySection = document.createElement('section'); categorySection.classList.add('nav-category'); const categoryTitle = document.createElement('h2'); categoryTitle.classList.add('category-title'); categoryTitle.textContent = category.category; categorySection.appendChild(categoryTitle); const cardGrid = document.createElement('div'); cardGrid.classList.add('nav-cards');
        category.items.forEach(item => { const card = document.createElement('a'); card.href = item.url; card.classList.add('nav-card'); card.target = '_blank'; card.rel = 'noopener noreferrer';
        card.innerHTML = `<span class="iconify" data-icon="${item.icon || 'simple-icons:default-icon'}"></span><div class="card-title">${item.name}</div><div class="card-description">${item.description}</div>`; cardGrid.appendChild(card); });
        categorySection.appendChild(cardGrid); content.appendChild(categorySection); });
    }

    // --- 3. 搜索功能 ---
    searchInput.addEventListener('input', (e) => { /* ... 保持不变 ... */
        const searchTerm = e.target.value.toLowerCase(); if (!searchTerm) { renderCards(window.navData); return; }
        const filteredData = window.navData.map(category => ({ ...category, items: category.items.filter(item => item.name.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm)) })).filter(category => category.items.length > 0);
        renderCards(filteredData);
    });

    // --- 4. 主题切换功能 (核心更新) ---
    function applyTheme(themeName) {
        if (!siteConfig.themes[themeName]) return;
        
        currentTheme = themeName;
        const theme = siteConfig.themes[themeName];
        const root = document.documentElement;

        // 将主题颜色注入到CSS变量中
        root.style.setProperty('--card-bg', theme.cardBg);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--border', theme.border);
        root.style.setProperty('--shadow', theme.shadow);

        // 更新图标
        themeToggleBtn.innerHTML = `<span class="iconify" data-icon="${theme.name === '白天模式' ? 'ph:moon-bold' : 'ph:sun-bold'}"></span>`;
        
        localStorage.setItem('theme', themeName);
        // 主题切换后，重新应用背景，以更新渐变色
        applyBackground(currentBgType);
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentIndex = availableThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        const nextThemeName = availableThemes[nextIndex];
        applyTheme(nextThemeName);
    });

    // --- 5. 背景切换与刷新功能 ---
    function applyBackground(type) { /* ... 保持不变，但会使用新的背景配置 ... */
        currentBgType = type; if (bgIntervalId) clearInterval(bgIntervalId); const { gradients, unsplash } = siteConfig.background;
        if (type === 'unsplash') { bgRefreshBtn.classList.remove('hidden'); const setUnsplashBg = () => { const url = `https://source.unsplash.com/collection/${unsplash.collectionId}/1600x900`; document.body.style.backgroundImage = `url(${url}?${Date.now()})`; }; setUnsplashBg(); if (unsplash.refreshInterval > 0) { bgIntervalId = setInterval(setUnsplashBg, unsplash.refreshInterval * 1000); } }
        else { bgRefreshBtn.classList.add('hidden'); document.body.style.backgroundImage = gradients[currentTheme] || gradients.dark; }
        localStorage.setItem('backgroundType', type);
    }
    bgToggleBtn.addEventListener('click', () => { const newType = currentBgType === 'gradient' ? 'unsplash' : 'gradient'; applyBackground(newType); });
    bgRefreshBtn.addEventListener('click', () => { if(currentBgType === 'unsplash') { const url = `https://source.unsplash.com/collection/${siteConfig.background.unsplash.collectionId}/1600x900`; document.body.style.backgroundImage = `url(${url}?${Date.now()})`; }});

    // --- 6. 时钟功能 --- 
    function updateClock() { const now = new Date(); clockWidget.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`; }

    // --- 7. 页面初始化 ---
    function init() {
        if (window.siteConfig) { document.title = siteConfig.title; siteTitle.textContent = siteConfig.title; siteSubtitle.textContent = siteConfig.subtitle; }
        const savedTheme = localStorage.getItem('theme'); applyTheme(savedTheme && availableThemes.includes(savedTheme) ? savedTheme : 'dark');
        const savedBgType = localStorage.getItem('backgroundType'); applyBackground(savedBgType || siteConfig.background.defaultType);
        updateClock(); setInterval(updateClock, 1000);
        renderCards(window.navData);
    }
    init();
});