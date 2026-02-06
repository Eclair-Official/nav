// data.js

// --- 全局配置 ---
window.siteConfig = {
    title: "我的导航",
    subtitle: "Stay Hungry, Stay Foolish.",
    // 新增：GitHub 仓库链接配置
    githubRepoUrl: "https://github.com/YOUR_USERNAME/YOUR_REPO",

    // --- 主题与颜色配置 (完全可自定义) ---
    themes: {
        // 深色主题
        dark: {
            name: "深夜模式",
            isLight: false, // 新增：主题类型标识
            cardBg: "rgba(30, 30, 40, 0.7)",
            textPrimary: "#E0E0E0",
            textSecondary: "#B0BEC5",
            titleColor: "#ffffff", // 新增：标题颜色
            subtitleColor: "#f0f0f0", // 新增：副标题颜色
            primary: "#BB86FC",
            secondary: "#03DAC6",
            border: "rgba(255, 255, 255, 0.1)",
            shadow: "rgba(0, 0, 0, 0.3)",
        },
        // 浅色主题
        light: {
            name: "白天模式",
            isLight: true, // 新增：主题类型标识
            cardBg: "rgba(255, 255, 255, 0.8)",
            textPrimary: "#1C1E21",
            textSecondary: "#606770",
            titleColor: "#1C1E21", // 新增：标题颜色
            subtitleColor: "#606770", // 新增：副标题颜色
            primary: "#6750A4",
            secondary: "#018786",
            border: "rgba(0, 0, 0, 0.1)",
            shadow: "rgba(0, 0, 0, 0.1)",
        },
        // 赛博朋克风
        cyberpunk: {
            name: "赛博朋克",
            isLight: false, // 新增：主题类型标识
            cardBg: "rgba(10, 25, 47, 0.8)",
            textPrimary: "#00FFF0",
            textSecondary: "#FF10F0",
            titleColor: "#00FFF0", // 新增：标题颜色
            subtitleColor: "#FFD700", // 新增：副标题颜色
            primary: "#FFD700",
            secondary: "#00FFFF",
            border: "rgba(255, 0, 255, 0.3)",
            shadow: "rgba(0, 255, 255, 0.4)",
        }
    },

    // --- 背景配置 (优化和增强) ---
    background: {
        defaultType: "gradient", // 'gradient' 或 'unsplash'
        // 新增：一个通用的默认渐变，用于无特定主题渐变时的保底
        defaultGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        gradients: {
            dark: "linear-gradient(135deg, #1a2a6c, #b21f1f, #1a2a6c)",
            light: "linear-gradient(to top, #ffecd2 0%, #fcb69f 100%)",
            cyberpunk: "linear-gradient(to right, #0f0c29, #302b63, #24243e)"
        },
        unsplash: {
            collectionId: "a8qPq9h1P_M",
            refreshInterval: 60
        }
    }
};

// --- 导航数据 ---
window.navData = [
    {
        category: "常用工具",
        items: [
            { name: "GitHub", url: "https://github.com", description: "全球最大的代码托管平台", icon: "mingcute:github-line" },
            { name: "Google", url: "https://www.google.com", description: "全球最大的搜索引擎", icon: "simple-icons:google" },
            { name: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI 出品的大语言模型", icon: "simple-icons:openai" },
        ]
    },
    {
        category: "开发学习",
        items: [
            { name: "MDN Web Docs", url: "https://developer.mozilla.org/zh-CN/", description: "Web 开发者的必读文档", icon: "simple-icons:mdnwebdocs" },
            { name: "Stack Overflow", url: "https://stackoverflow.com", description: "程序员的问答社区", icon: "simple-icons:stackoverflow" },
            { name: "Vue.js", url: "https://cn.vuejs.org/", description: "渐进式 JavaScript 框架", icon: "simple-icons:vuedotjs" },
        ]
    },
    {
        category: "休闲娱乐",
        items: [
            { name: "YouTube", url: "https://www.youtube.com", description: "全球最大的视频分享网站", icon: "simple-icons:youtube" },
            { name: "Bilibili", url: "https://www.bilibili.com", description: "国内知名的视频弹幕网站", icon: "simple-icons:bilibili" },
            { name: "IMDb", url: "https://www.imdb.com", description: "互联网电影资料库", icon: "simple-icons:imdb" },
        ]
    }
];