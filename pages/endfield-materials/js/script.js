// 获取当前日期信息
const today = new Date()
// JavaScript的getDay()返回0-6（0=周日，1=周一...）
// 我们需要调整这个映射，因为weekDays现在从周一开始
const jsDayIndex = today.getDay() // 0=周日，1=周一，2=周二...
// 将JavaScript的日期索引映射到我们的weekDays数组
// 如果今天是周日(0)，对应weekDays[6]
// 如果今天是周一(1)，对应weekDays[0]
// 如果今天是周二(2)，对应weekDays[1]
const currentDayName = weekDays[jsDayIndex === 0 ? 6 : jsDayIndex - 1]

// 设置当前日期显示
document.querySelector('.current-date').textContent = currentDayName

// 格式化日期显示
const year = today.getFullYear()
const month = today.getMonth() + 1
const day = today.getDate()
const currentFormattedDate = `${year}年${month}月${day}日`
document.querySelector('.date-info').textContent = currentFormattedDate

// 设置当前地区显示
const defaultRegion = regions[0]
document.querySelector('.current-region').textContent = defaultRegion.displayName

// 动态生成星期按钮
function generateWeekButtons() {
    const weekNav = document.querySelector('.week-nav')
    weekNav.innerHTML = ''

    weekDays.forEach((dayName) => {
        const button = document.createElement('button')
        button.className = 'day-btn'
        button.textContent = dayName
        button.dataset.day = dayName

        // 默认激活当前星期
        if (dayName === currentDayName) {
            button.classList.add('active')
            // 添加"今日"标识
            button.classList.add('today')
        }

        button.addEventListener('click', function () {
            // 移除所有按钮的active类
            document.querySelectorAll('.day-btn').forEach((btn) => btn.classList.remove('active'))

            // 为点击的按钮添加active类
            this.classList.add('active')

            // 更新显示的日期
            const dayText = this.textContent
            document.querySelector('.current-date').textContent = dayText

            // 根据点击的日期更新日期信息
            updateDateInfo(dayText)

            // 检查是否非本日，并添加提醒
            checkAndShowDateWarning(dayText)

            // 更新商品价格（基于当前选择的日期和地区）
            updateProductPrices()
        })

        weekNav.appendChild(button)
    })
}

// 动态生成地区按钮
function generateRegionButtons() {
    const regionNav = document.querySelector('.region-nav')
    regionNav.innerHTML = ''

    regions.forEach((region) => {
        const button = document.createElement('button')
        button.className = 'region-btn'
        button.textContent = region.name
        button.dataset.region = region.name

        // 默认激活第一个地区
        if (region.name === defaultRegion.name) {
            button.classList.add('active')
        }

        button.addEventListener('click', function () {
            // 移除所有按钮的active类
            document.querySelectorAll('.region-btn').forEach((btn) => btn.classList.remove('active'))

            // 为点击的按钮添加active类
            this.classList.add('active')

            // 更新显示的地区
            const regionName = this.dataset.region
            const region = regions.find((r) => r.name === regionName)
            if (region) {
                document.querySelector('.current-region').textContent = region.displayName
            }

            // 更新商品价格（基于当前选择的日期和地区）
            updateProductPrices()
        })

        regionNav.appendChild(button)
    })
}

// 检查并显示日期警告
function checkAndShowDateWarning(selectedDay) {
    const dateInfoElement = document.querySelector('.date-info')

    // 移除之前的警告元素
    const existingWarning = document.querySelector('.date-warning')
    if (existingWarning) {
        existingWarning.remove()
    }

    // 检查是否非本日
    if (selectedDay !== currentDayName) {
        // 创建警告元素
        const warningElement = document.createElement('div')
        warningElement.className = 'date-warning'
        warningElement.innerHTML = `
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">当前查看的是${selectedDay}的价格，非本日价格</span>
        `

        // 在日期信息下方插入警告
        dateInfoElement.parentNode.insertBefore(warningElement, dateInfoElement.nextSibling)
    }
}

// 根据星期更新日期信息
function updateDateInfo(dayName) {
    const dateInfoElement = document.querySelector('.date-info')

    // 如果选择的是当前日期，显示实际日期
    if (dayName === currentDayName) {
        dateInfoElement.textContent = currentFormattedDate
    } else {
        // 否则显示示例日期或特定格式
        const exampleDate = exampleDates[dayName] || `${year}年${month}月${day}日（${dayName}）`
        dateInfoElement.textContent = exampleDate
    }
}

// 更新商品价格（基于当前选择的日期和地区）
function updateProductPrices() {
    // 获取当前选择的日期和地区
    const currentDay = document.querySelector('.day-btn.active').textContent
    const currentRegion = document.querySelector('.region-btn.active').dataset.region

    // 获取当前地区的商品列表
    const currentProducts = regionProducts[currentRegion] || regionProducts[defaultRegion.name]

    // 获取当前日期和地区的价格数据
    const dayPrices = priceData[currentDay] || priceData[currentDayName]
    const regionPrices = dayPrices[currentRegion] || dayPrices[defaultRegion.name]

    // 清空商品容器
    const productsContainer = document.querySelector('.products-container')
    productsContainer.innerHTML = ''

    // 创建商品卡片
    currentProducts.forEach((product) => {
        const productPrice = regionPrices[product.name]
        if (productPrice) {
            // const profitMargin = (((productPrice.sell - productPrice.buy) / productPrice.buy) * 100).toFixed(2)

            const productCard = document.createElement('div')
            productCard.className = 'product-card'

            productCard.innerHTML = `
                <img src="images/${product.image}" alt="${product.name}" class="product-image">
                <div class="product-name">${product.name}</div>
                <div class="price-info">
                    <div class="buy-price">
                        <div class="price-label">买入价格</div>
                        <div class="price-value">¥${productPrice.buy}</div>
                    </div>
                    <div class="sell-price">
                        <div class="price-label">卖出价格</div>
                        <div class="price-value">¥${productPrice.sell}</div>
                    </div>
                </div>
              
            `

            productsContainer.appendChild(productCard)
        }
    })
}

// 动态生成星期按钮
function generatefooter() {
    const footer = document.querySelector('.footer-note')

    footer.innerHTML = `
   <p class="description">
                    数据来源 b站up  卓越行动
                    <a href="https://www.bilibili.com/video/BV1HoABzzEQ6" target="_blank">
                        导购福音！物资调度居然能多赚30%？
                    </a>  
                      <img src="images/image.png"></img>
                </p>
`

    footerNote.appendChild(description)
}
// 初始化函数
function initialize() {
    // 生成星期和地区按钮
    generateWeekButtons()
    generateRegionButtons()
    generatefooter()
    // 初始加载数据
    updateProductPrices()
}

// 执行初始化
initialize()
