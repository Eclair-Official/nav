// data.js

// =========================================================================
// 1. 站点全局配置
// =========================================================================

window.siteConfig = {
    // --- 基本信息 ---
    title: 'Eclair的导航',
    subtitle: 'Stay Hungry, Stay Foolish.',
    githubRepoUrl: 'https://github.com/Eclair-Official',
    // --- 新增：Footer 配置 ---
    footer: {
        copyright: '© 2026 MyNav. All Rights Reserved.',
        poweredBy: 'Powered with ❤️ by GitHub Pages.'
    },
    // --- 默认图标配置 ---
    defaultIcon: 'material-symbols:link',

    // --- 主题配置 (完全可自定义) ---
    themes: {
        dark: {
            name: '深夜模式',
            isLight: false,
            cardBg: 'rgba(30, 30, 40, 0.7)',
            textPrimary: '#E0E0E0',
            textSecondary: '#B0BEC5',
            titleColor: '#ffffff',
            subtitleColor: '#f0f0f0',
            primary: '#BB86FC',
            secondary: '#03DAC6',
            border: 'rgba(255, 255, 255, 0.1)',
            shadow: 'rgba(0, 0, 0, 0.3)'
        },
        light: {
            name: '白天模式',
            isLight: true,
            cardBg: 'rgba(255, 255, 255, 0.8)',
            textPrimary: '#1C1E21',
            textSecondary: '#606770',
            titleColor: '#1C1E21',
            subtitleColor: '#606770',
            primary: '#6750A4',
            secondary: '#018786',
            border: 'rgba(0, 0, 0, 0.1)',
            shadow: 'rgba(0, 0, 0, 0.1)'
        },
        cyberpunk: {
            name: '赛博朋克',
            isLight: false,
            cardBg: 'rgba(10, 25, 47, 0.8)',
            textPrimary: '#00FFF0',
            textSecondary: '#FF10F0',
            titleColor: '#00FFF0',
            subtitleColor: '#FFD700',
            primary: '#FFD700',
            secondary: '#00FFFF',
            border: 'rgba(255, 0, 255, 0.3)',
            shadow: 'rgba(0, 255, 255, 0.4)'
        }
    },

    // --- 背景配置 ---
    background: {
        defaultType: 'gradient', // 'gradient' 或 'unsplash'
        defaultGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        gradients: {
            dark: 'linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c)',
            light: 'linear-gradient(to top, #ffecd2 0%, #fcb69f 100%)',
            cyberpunk: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
        },
        unsplash: {
            collectionId: 'a8qPq9h1P_M',
            refreshInterval: 60 // 单位：秒
        }
    }
}

// =========================================================================
// 2. 导航数据
// =========================================================================

window.navData = [
    {
        category: '终末地',
        items: [
            {
                name: '电量分流计算器',
                url: 'pages/endfield-calculator/',
                description: '电量分流计算器',
                target: 'iframe'
            },
            {
                name: 'Bilibili', // 修正：名称更符合 URL
                url: 'https://www.bilibili.com/', // 修正：这里是 Bilibili 的 URL
                description: '年轻人的视频社区',
                icon: 'simple-icons:bilibili' // 修正：使用 Bilibili 图标更合适
            }
        ]
    }
    // {
    //     category: '常用工具',
    //     items: [
    //         { ... }
    //     ],
    // }
]

// --- 新增：Iframe 全局配置 ---
window.siteConfig.iframe = {
    blockedHosts: ['www.google.com', 'facebook.com']
}
