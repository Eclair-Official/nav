// 电池配置
const BATTERY_CONFIG = {
    // 电池类型列表
    types: [
        {
            name: '低谷地电',
            value: 220,
            id: 'lowGudi',
            price: 16,
            currency: '谷地券'
        },
        {
            name: '中谷地电',
            value: 420,
            id: 'midGudi',
            price: 30,
            currency: '谷地券'
        },
        {
            name: '高谷地电',
            value: 1100,
            id: 'highGudi',
            price: 70,
            currency: '谷地券'
        },
        {
            name: '低武陵电',
            value: 1600,
            id: 'lowWuling',
            price: 25,
            currency: '武陵券'
        },
        {
            name: '中武陵电',
            value: 3200,
            id: 'midWuling',
            price: 54,
            currency: '武陵券'
        }
    ]
}

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BATTERY_CONFIG
}
