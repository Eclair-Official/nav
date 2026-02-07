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
        // 自定义你的版权信息
        copyright: '© 2026 MyNav. All Rights Reserved.',
        // 自定义你的技术栈或说明
        poweredBy: 'Powered with ❤️ by GitHub Pages.'
        // 你还可以添加更多内容，例如链接
        // extraLinks: [
        //     { name: "隐私政策", url: "#" },
        //     { name: "联系我", url: "#" }
        // ]
    },
    // --- 默认图标配置 ---
    // 当导航项未指定图标时使用
    defaultIcon: 'material-symbols:link',

    // --- 主题配置 (完全可自定义) ---
    // 每个主题对象包含其所有视觉变量
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
        // 保底渐变，当特定主题渐变未定义或外部资源加载失败时使用
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
                name: 'GitHub',
                url: 'https://www.bilibili.com/',
                description: '全球最大的代码托管平台',
                icon: 'mingcute:github-line'
            }
        ]
    }
    // {
    //     category: '常用工具',
    //     items: [
    //         {
    //             name: 'GitHub',
    //             url: 'https://github.com',
    //             description: '全球最大的代码托管平台',
    //             icon: 'mingcute:github-line',
    //             target: 'iframe'
    //         },
    //         {
    //             name: 'Google',
    //             url: 'https://www.google.com',
    //             description: '全球最大的搜索引擎',
    //             icon: 'simple-icons:google',
    //             target: 'iframe'
    //         },
    //         {
    //             name: 'ChatGPT',
    //             url: 'https://chat.openai.com',
    //             description: 'OpenAI 出品的大语言模型',
    //             icon: 'simple-icons:openai'
    //         },
    //         { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: '程序员的问答社区' } // 使用默认图标
    //     ]
    // },
]
// --- 新增：Iframe 全局配置 ---
// 这个配置不是必需的，但把它放在这里能更好地体现配置化的思想
window.siteConfig.iframe = {
    // 一些网站（如 Google, Facebook）不允许被 iframe 嵌入（X-Frame-Options 响应头）。
    // 我们可以在这里维护一个黑名单，当用户尝试打开这些网站时，给出提示。
    blockedHosts: ['www.google.com', 'facebook.com']
}
