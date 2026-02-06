// script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. 初始化与元素获取 ---
    const content = document.getElementById('content');
    const searchInput = document.getElementById('search-input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const clockWidget = document.getElementById('clock-widget');
    const siteTitle = document.getElementById('site-title');
    const siteSubtitle = document.getElementById('site-subtitle');
    const githubLink = document.getElementById('github-link'); // 新增

    let currentBgType = siteConfig.background.defaultType;
    let currentTheme = 'dark';
    const availableThemes = Object.keys(window.siteConfig.themes);
    let bgIntervalId;
    
    // --- 2. 核心渲染函数 (已格式化优化) ---
    function renderCards(data) {
        content.innerHTML = ''; 

        if (!data || data.length === 0) {
            content.innerHTML = '<p id="no-results">没有找到匹配的网站。</p>';
            return;
        }

        data.forEach(category => {
            const categorySection = document.createElement('section');
            categorySection.classList.add('nav-category');

            const categoryTitle = document.createElement('h2');
            categoryTitle.classList.add('category-title');
            categoryTitle.textContent = category.category;
            categorySection.appendChild(categoryTitle);

            const cardGrid = document.createElement('div');
            cardGrid.classList.add('nav-cards');

            category.items.forEach(item => {
                const card = document.createElement('a');
                card.href = item.url;
                card.classList.add('nav-card');
                card.target = '_blank';
                card.rel = 'noopener noreferrer';
                
                card.innerHTML = `
                    <span class="iconify" data-icon="${item.icon || 'simple-icons:default-icon'}"></span>
                    <div class="card-title">${item.name}</div>
                    <div class="card-description">${item.description}</div>
                `;
                cardGrid.appendChild(card);
            });

            categorySection.appendChild(cardGrid);
            content.appendChild(categorySection);
        });
    }

    // --- 3. 搜索功能 ---
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        if (!searchTerm) {
            renderCards(window.navData);
            return;
        }
        const filteredData = window.navData.map(category => ({
            ...category,
            items: category.items.filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            )
        })).filter(category => category.items.length > 0);
        renderCards(filteredData);
    });

    // --- 4. 主题切换功能 (已优化) ---
    function applyTheme(themeName) {
        if (!siteConfig.themes[themeName]) return;
        
        currentTheme = themeName;
        const theme = siteConfig.themes[themeName];
        const root = document.documentElement;

        root.style.setProperty('--card-bg', theme.cardBg);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);
        root.style.setProperty('--title-color', theme.titleColor); // 优化
        root.style.setProperty('--subtitle-color', theme.subtitleColor); // 优化
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--border', theme.border);
        root.style.setProperty('--shadow', theme.shadow);

        // 优化：使用配置项判断图标
        themeToggleBtn.innerHTML = `<span class="iconify" data-icon="${theme.isLight ? 'ph:moon-bold' : 'ph:sun-bold'}"></span>`;
        
        localStorage.setItem('theme', themeName);

        // 主题切换后，重新应用背景，以更新可能的渐变色
        applyBackground(currentBgType);
    }
    
    themeToggleBtn.addEventListener('click', () => {
        const currentIndex = availableThemes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % availableThemes.length;
        const nextThemeName = availableThemes[nextIndex];
        applyTheme(nextThemeName);
    });

    // --- 5. 背景应用功能 (已优化并保留) ---
    function applyBackground(type) {
        currentBgType = type;
        if (bgIntervalId) clearInterval(bgIntervalId);
        
        const { gradients, unsplash, defaultGradient } = siteConfig.background;

        if (type === 'unsplash') {
            const setUnsplashBg = () => {
                const img = new Image();
                img.src = `https://source.unsplash.com/collection/${unsplash.collectionId}/1600x900`;
                img.onload = () => document.body.style.backgroundImage = `url(${img.src})`;
                img.onerror = () => {
                    console.error("Unsplash image failed to load. Falling back to gradient.");
                    document.body.style.backgroundImage = defaultGradient;
                };
            };
            setUnsplashBg();
            if (unsplash.refreshInterval > 0) {
                bgIntervalId = setInterval(setUnsplashBg, unsplash.refreshInterval * 1000);
            }
        } else { // gradient
            document.body.style.backgroundImage = gradients[currentTheme] || defaultGradient;
        }
        
        localStorage.setItem('backgroundType', type);
    }

    // --- 6. 时钟功能 --- 
    // function updateClock() {
    //     const now = new Date();
    //     clockWidget.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    // }
// --- 6. 时钟功能 (已优化) --- 
function updateClock() {
    const now = new Date();

    // 获取时间部分
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // 获取日期部分
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // 获取星期部分
    const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    const weekdayString = weekdays[now.getDay()];

    // 更新DOM内容
    const timeElement = document.querySelector('.clock-time');
    const dateElement = document.querySelector('.clock-date');
    const weekdayElement = document.querySelector('.clock-weekday');

    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
    if (weekdayElement) weekdayElement.textContent = weekdayString;
}
    // --- 7. 页面初始化 (已精简和优化) ---
    function init() {
        // 应用网站配置
        if (window.siteConfig) {
            document.title = siteConfig.title;
            siteTitle.textContent = siteConfig.title;
            siteSubtitle.textContent = siteConfig.subtitle;
            // 优化：动态设置GitHub链接
            if (githubLink && siteConfig.githubRepoUrl) {
                githubLink.href = siteConfig.githubRepoUrl;
            }
        }

        // 恢复或应用默认主题
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme && availableThemes.includes(savedTheme) ? savedTheme : 'dark';
        
        // 应用背景类型（从localStorage或配置中获取）
        const savedBgType = localStorage.getItem('backgroundType');
        const initialBgType = savedBgType || siteConfig.background.defaultType;

        applyTheme(initialTheme);
        applyBackground(initialBgType);
        
        updateClock();
        setInterval(updateClock, 1000);
        renderCards(window.navData);
    }

    init();
});