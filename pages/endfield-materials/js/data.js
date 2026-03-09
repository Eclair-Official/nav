// 星期信息配置 - 从周一开始
const weekDays = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']

// 示例日期配置
const exampleDates = {
    星期一: '2026年3月9日',
    星期二: '2026年3月10日',
    星期三: '2026年3月11日',
    星期四: '2026年3月12日',
    星期五: '2026年3月13日',
    星期六: '2026年3月14日',
    星期日: '2026年3月15日'
}

// 商品信息配置 - 按地区分类
const regionProducts = {
    四号谷底: [
        { name: '锚点厨具货组', image: 'tundra_1.webp' },
        { name: '悬空鼷兽骨雕货组', image: 'tundra_2.webp' },
        { name: '巫术矿钻货组', image: 'tundra_3.webp' },
        { name: '天使罐头货组', image: 'tundra_4.webp' },
        { name: '谷地水培肉货组', image: 'tundra_5.webp' },
        { name: '团结牌口服液货组', image: 'tundra_6.webp' },

        { name: '源石树幼苗货组', image: 'tundra_10.webp' },
        { name: '塞什卡髀石货组', image: 'tundra_7.webp' },
        { name: '警戒者矿镐货组', image: 'tundra_11.webp' },
        { name: '星体晶块货组', image: 'tundra_8.webp' },
        { name: '硬脑壳头盔货组', image: 'tundra_12.webp' },
        { name: '边角料积木货组', image: 'tundra_9.webp' }
    ],
    武陵: [
        { name: '岳研避瘴茶货组', image: 'jinlong_2.webp' },
        { name: '武侠电影货组', image: 'jinlong_4.webp' },
        { name: '冬虫夏笋货组', image: 'jinlong_3.webp' },
        { name: '武陵冻梨货组', image: 'jinlong_1.webp' }
    ]
}

// 地区信息配置
const regions = [
    { name: '四号谷底', displayName: '四号谷底地区' },
    { name: '武陵', displayName: '武陵地区' }
]

// 基础买入价格配置
const baseBuyPrices = {
    四号谷底: {
        星期一: 1150,
        星期二: 1200,
        星期三: 1050,
        星期四: 1000,
        星期五: 950,
        星期六: 1000,
        星期日: 1150
    },
    武陵: {
        星期一: 1450,
        星期二: 1500,
        星期三: 1350,
        星期四: 1350,
        星期五: 1250,
        星期六: 1150,
        星期日: 1600
    }
}

// 卖出价格档次
const sellLevels = [4600, 5000, 5300]

// 商品价格调整配置
const productAdjustments = {
    // 四号谷底商品
    锚点厨具货组: { adjust: -700, sellLevel: 0 },
    悬空鼷兽骨雕货组: { adjust: -700, sellLevel: 0 },
    巫术矿钻货组: { adjust: -700, sellLevel: 0 },
    天使罐头货组: { adjust: -700, sellLevel: 0 },

    谷地水培肉货组: { adjust: -300, sellLevel: 1 },
    团结牌口服液货组: { adjust: -300, sellLevel: 1 },
    源石树幼苗货组: { adjust: 0, sellLevel: 2 },
    塞什卡髀石货组: { adjust: -300, sellLevel: 1 },

    警戒者矿镐货组: { adjust: 0, sellLevel: 2 },
    星体晶块货组: { adjust: -300, sellLevel: 1 },
    硬脑壳头盔货组: { adjust: 0, sellLevel: 2 },
    边角料积木货组: { adjust: 0, sellLevel: 2 },

    // 武陵商品

    岳研避瘴茶货组: { adjust: 0, sellLevel: 0 },
    冬虫夏笋货组: { adjust: 0, sellLevel: 0 },
    武陵冻梨货组: { adjust: 0, sellLevel: 0 },
    武侠电影货组: { adjust: 0, sellLevel: 0 }
}

// 生成价格数据的函数
function generatePriceData() {
    const priceData = {}

    // 遍历所有星期
    weekDays.forEach((day) => {
        priceData[day] = {
            四号谷底: {},
            武陵: {}
        }

        // 计算四号谷底商品价格
        regionProducts['四号谷底'].forEach((product) => {
            const productName = product.name
            const adjustConfig = productAdjustments[productName]
            if (adjustConfig) {
                const basePrice = baseBuyPrices['四号谷底'][day] || 1150
                const buyPrice = basePrice + adjustConfig.adjust
                const sellPrice = sellLevels[adjustConfig.sellLevel] || sellLevels[0]

                priceData[day]['四号谷底'][productName] = {
                    buy: buyPrice,
                    sell: sellPrice
                }
            }
        })

        // 计算武陵商品价格
        regionProducts['武陵'].forEach((product) => {
            const productName = product.name
            const adjustConfig = productAdjustments[productName]
            if (adjustConfig) {
                const basePrice = baseBuyPrices['武陵'][day] || 1150
                const buyPrice = basePrice + adjustConfig.adjust
                const sellPrice = sellLevels[adjustConfig.sellLevel] || sellLevels[0]

                priceData[day]['武陵'][productName] = {
                    buy: buyPrice,
                    sell: sellPrice
                }
            }
        })
    })

    return priceData
}

// 生成价格数据
const priceData = generatePriceData()
