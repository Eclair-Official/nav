// 初始化电池列表显示
function initBatteryList() {
    const batteryListElement = document.getElementById('battery-list')

    if (!batteryListElement) {
        console.error('电池列表元素不存在')
        return
    }

    // 清空现有内容
    batteryListElement.innerHTML = ''

    // 遍历电池配置生成列表项
    BATTERY_CONFIG.types.forEach((battery) => {
        const li = document.createElement('li')
        li.innerHTML = `<strong>${battery.name}</strong> (${battery.value})`
        batteryListElement.appendChild(li)
    })
}

// 页面加载完成后初始化电池列表
document.addEventListener('DOMContentLoaded', function () {
    initBatteryList()
})

// 验证只能输入数字键
function isNumberKey(evt) {
    const charCode = evt.which ? evt.which : evt.keyCode
    // 允许数字0-9
    if (charCode >= 48 && charCode <= 57) {
        return true
    }
    // 阻止其他字符（包括负号、小数点等）
    evt.preventDefault()
    return false
}

// 验证输入为正整数
function validatePositiveInteger(input) {
    let value = input.value

    // 移除所有非数字字符
    value = value.replace(/[^0-9]/g, '')

    // 移除前导零
    if (value.length > 1 && value[0] === '0') {
        value = value.replace(/^0+/, '')
    }

    // 如果为空，设为空字符串
    if (value === '') {
        input.value = ''
        return
    }

    // 转换为数字并验证
    const numValue = parseInt(value, 10)

    // 确保大于0
    if (numValue <= 0) {
        input.value = ''
        return
    }

    input.value = numValue.toString()
}

function calculate() {
    const x = parseFloat(document.getElementById('consumption').value)
    const y = parseFloat(document.getElementById('production').value)

    // 验证输入是否为空或无效
    if (!x || !y) {
        alert('请填写所有必填项！')
        return
    }

    // 验证是否为正数
    if (x <= 0 || y <= 0) {
        alert('所有数值必须大于0！')
        return
    }

    // 验证是否为整数
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
        alert('请输入整数！')
        return
    }

    // 检查是否能充满电
    if (y >= x) {
        alert('目前生产大于满转消耗，无须充电！')
        return
    }
    // 检查掉电速率 = x - (y - z)
    const dischargeRate = x - y
    if (dischargeRate <= 0) {
        alert('掉电速率必须大于0，请调整参数！')
        return
    }
    // const BatteryList = [
    //     { 低谷地电: 220 },
    //     { 中谷地电: 420 },
    //     { 高谷地电: 1100 },
    //     { 低武陵电: 1600 },
    //     { 中武陵电: 3200 }
    // ]
    // // const BatteryUse = BatteryList.filter((battery) => battery.value > dischargeRate)
    // const BatteryUse = BatteryList.filter((item) => {
    //     const batteryValue = Object.values(item)[0] // 提取电池数值（number类型）
    //     return batteryValue > dischargeRate
    // })
    // // 3. 判断过滤结果是否为空（length === 0），触发对应提示
    // if (BatteryUse.length === 0) {
    //     alert('单电池无法充能，先增加新热能池')
    //     return
    // }
    // const results = document.getElementById('results')
    // const result = document.getElementById('result')
    // results.innerHTML = ''
    // result.innerHTML = ''
    // const solutions = []

    // BatteryUse.forEach((item) => {
    //     const batteryName = Object.keys(item)[0] // 提取电池数值（number类型）
    //     const batteryValue = Object.values(item)[0] // 提取电池数值（number类型）
    //     const chargeParam = charge(batteryName, batteryValue, dischargeRate, x, y)
    //     solutions.push(chargeParam)
    // })
    // 使用配置数据筛选电池
    const BatteryUse = BATTERY_CONFIG.types.filter((battery) => {
        return battery.value > dischargeRate
    })

    // 判断过滤结果是否为空（length === 0），触发对应提示
    if (BatteryUse.length === 0) {
        alert('单电池无法充能，先增加新热能池')
        return
    }

    const results = document.getElementById('results')
    const result = document.getElementById('result')
    results.innerHTML = ''
    result.innerHTML = ''
    const solutions = []

    BatteryUse.forEach((battery) => {
        const chargeParam = charge(
            battery.id, // batteryId
            battery.name, // batteryName
            battery.value, // batteryValue
            dischargeRate, // dischargeRate
            x, // x
            y // y
        )
        solutions.push(chargeParam)
    })
    displayResultsParam(solutions)

    // // 步骤1：找到最小值
    // const minValue = Math.min(...solutions)

    // // 步骤2：找到最小值对应的索引（返回第一个出现的索引）
    // const minIndex = solutions.indexOf(minValue)

    // displaybestResults()
}
function displayResultsParam(solutions) {
    // 1. 过滤：移除 actualTime <= 40 的解
    const validSolutions = solutions.filter((solution) => {
        const actualTime = solution[9]?.optimal.totalTime
        // 如果 actualTime 存在且大于 40，则保留这个解
        return actualTime > 40
    })

    validSolutions.sort((a, b) => {
        // 获取a、b子数组中第8项的totaltime（注意：数组索引从0开始）
        const actualTimeA = a[9]?.optimal.totalTime || 0 // 加?.避免undefined报错，兜底为0
        const maxChargeA = a[10] || 0
        const dischargeRateA = a[11] || 0

        const actualTimeB = b[9]?.optimal.totalTime || 0
        const maxChargeB = b[10] || 0
        const dischargeRateB = b[11] || 0

        const WasteA = maxChargeA / actualTimeA - dischargeRateA
        const WasteB = maxChargeB / actualTimeB - dischargeRateB

        return WasteA - WasteB // 升序：小的在前；若要降序，改为 timeB - timeA
    })

    validSolutions.forEach((item) => {
        displayResults(...item)
    })
    displayResultsHref(validSolutions)
    displaybestResults(...validSolutions[0])
}
// 计算40秒内充满的电量
function charge(batteryId, batteryName, batteryValue, dischargeRate, x, y) {
    const maxCapacity = 100000
    const chargeRate = batteryValue - dischargeRate
    const maxCharge = batteryValue * 40
    const chargeIn40Seconds = chargeRate * 40
    const fullCharge = Math.min(chargeIn40Seconds, maxCapacity)

    // 计算最佳掉电时间 = 40秒内充满的电量 / 掉电速率
    const dischargeTime = fullCharge / dischargeRate

    // 目标效率 = 放电时间 + 40秒
    const targetEfficiency = dischargeTime + 40

    // 目标速率
    const targetRate = 1 / targetEfficiency

    // 为产线生成可能的分流组合
    const solutions = findBestSplit(targetRate)

    return [
        batteryId,
        batteryName,
        x,
        y,
        batteryValue,
        batteryValue - dischargeRate,
        fullCharge,
        dischargeTime,
        targetEfficiency,
        solutions,
        maxCharge,
        dischargeRate
    ]
}

function findBestSplit(targetRate) {
    // 目标时间 = 1 / 目标速率
    const targetTime = 1 / targetRate

    // 返回两个方案：最佳分流 和 轻量化方案
    return {
        optimal: findOptimalSplitFromTime(targetTime),
        lightweight: findLightweightSplitFromTime(targetTime),
        lastweight: findLastSplitFromTime(targetTime)
    }
}

function findOptimalSplitFromTime(targetTime) {
    // 基础时间是2秒/个
    const baseTime = 2

    // 如果目标时间小于等于基础时间，不需要分流
    if (targetTime <= baseTime) {
        return {
            pipeline: {
                splits: [],
                rate: 1 / baseTime,
                time: baseTime
            },
            totalRate: 1 / baseTime,
            totalTime: baseTime
        }
    }

    // 计算需要的倍数
    const multiplier = targetTime / baseTime

    // 使用贪心算法找到最接近的 2^a × 3^b × (3/2)^c 组合
    const best = findBestMultiplier(multiplier)

    // 构建分流数组
    const splits = []
    for (let i = 0; i < best.count3; i++) splits.push(3)
    for (let i = 0; i < best.count2; i++) splits.push(2)
    for (let i = 0; i < best.count3_2; i++) splits.push(3 / 2)

    const actualTime = baseTime * best.actualMultiplier
    const actualRate = 1 / actualTime

    return {
        pipeline: {
            splits: splits,
            rate: actualRate,
            time: actualTime
        },
        totalRate: actualRate,
        totalTime: actualTime
    }
}

function findBestMultiplier(targetMultiplier) {
    // 找到最接近 targetMultiplier 的 2^a × 3^b × (3/2)^c
    // 策略：先只使用1/3和1/2，如果效率比例低于90%才使用2/3

    const log2 = Math.log(2)
    const log3 = Math.log(3)
    const log3_2 = Math.log(3 / 2)
    const logTarget = Math.log(targetMultiplier)

    let bestDiff = Infinity
    let bestCount2 = 0
    let bestCount3 = 0
    let bestCount3_2 = 0
    let bestMultiplier = 1

    // 扩大搜索范围以确保找到所有可能的组合
    const maxPower = Math.ceil(logTarget / Math.min(log2, log3_2)) + 10
    const maxPower3 = Math.ceil(logTarget / log3) + 5

    // 第一步：只使用1/3和1/2分流器（不使用2/3）
    for (let count3 = 0; count3 <= maxPower3; count3++) {
        for (let count2 = 0; count2 <= maxPower; count2++) {
            const multiplier = Math.pow(2, count2) * Math.pow(3, count3)

            // 跳过太大的倍数
            if (multiplier > targetMultiplier * 1.5) continue

            // 确保实际效率时间必须大于40秒
            const actualTime = 2 * multiplier
            if (multiplier <= targetMultiplier && actualTime > 40) {
                const diff = Math.abs(multiplier - targetMultiplier)

                // 计算分流总数，优先选择分流数量更少的
                const totalSplits = count2 + count3
                const currentBestSplits = bestCount2 + bestCount3 + bestCount3_2
                const epsilon = 1e-10

                if (diff < bestDiff || (Math.abs(diff - bestDiff) < epsilon && totalSplits < currentBestSplits)) {
                    bestDiff = diff
                    bestCount2 = count2
                    bestCount3 = count3
                    bestCount3_2 = 0 // 第一步不使用2/3
                    bestMultiplier = multiplier
                }
            }
        }
    }

    // 检查只使用1/3和1/2的方案的效率比例
    const efficiencyRatio = bestMultiplier / targetMultiplier

    // 如果效率比例低于90%，再使用2/3分流器进行优化
    if (efficiencyRatio < 0.95) {
        // 第二步：包含2/3分流器的完整搜索
        for (let count3 = 0; count3 <= maxPower3; count3++) {
            for (let count2 = 0; count2 <= maxPower; count2++) {
                for (let count3_2 = 0; count3_2 <= maxPower; count3_2++) {
                    const multiplier = Math.pow(2, count2) * Math.pow(3, count3) * Math.pow(3 / 2, count3_2)

                    // 跳过太大的倍数
                    if (multiplier > targetMultiplier * 1.5) continue

                    // 确保实际效率时间必须大于40秒
                    const actualTime = 2 * multiplier
                    if (multiplier <= targetMultiplier && actualTime > 40) {
                        const diff = Math.abs(multiplier - targetMultiplier)

                        // 计算分流总数，对2/3分流器给予更高权重
                        const totalSplits = count2 + count3 + count3_2
                        const currentBestSplits = bestCount2 + bestCount3 + bestCount3_2
                        const weightedSplits = count2 + count3 + count3_2 * 2
                        const currentWeightedSplits = bestCount2 + bestCount3 + bestCount3_2 * 2
                        const epsilon = 1e-10

                        // 优先精度，其次加权分流数量
                        if (
                            diff < bestDiff ||
                            (Math.abs(diff - bestDiff) < epsilon && weightedSplits < currentWeightedSplits)
                        ) {
                            bestDiff = diff
                            bestCount2 = count2
                            bestCount3 = count3
                            bestCount3_2 = count3_2
                            bestMultiplier = multiplier
                        }
                    }
                }
            }
        }
    }

    // 如果没找到小于等于目标的（只有基础情况会出现），返回基础值
    if (bestDiff === Infinity) {
        bestCount2 = 0
        bestCount3 = 0
        bestCount3_2 = 0
        bestMultiplier = 1
    }

    return {
        count2: bestCount2,
        count3: bestCount3,
        count3_2: bestCount3_2,
        actualMultiplier: bestMultiplier
    }
}

// 查找轻量化方案（优先减少分流数量，允许效率降低到80%）
function findLightweightSplitFromTime(targetTime) {
    const baseTime = 2

    if (targetTime <= baseTime) {
        return {
            pipeline: {
                splits: [],
                rate: 1 / baseTime,
                time: baseTime
            },
            totalRate: 1 / baseTime,
            totalTime: baseTime
        }
    }

    const targetMultiplier = targetTime / baseTime
    const minEfficiencyRatio = 0.8 // 允许效率降低到80%
    const minMultiplier = targetMultiplier * minEfficiencyRatio

    let bestSplitCount = Infinity
    let bestCount2 = 0
    let bestCount3 = 0
    let bestCount3_2 = 0
    let bestMultiplier = 1
    let bestDiff = Infinity

    const log2 = Math.log(2)
    const log3 = Math.log(3)
    const log3_2 = Math.log(3 / 2)
    const logTarget = Math.log(targetMultiplier)

    const maxPower = Math.ceil(logTarget / Math.min(log2, log3_2)) + 10
    const maxPower3 = Math.ceil(logTarget / log3) + 5

    // 优先只使用1/3和1/2
    for (let count3 = 0; count3 <= maxPower3; count3++) {
        for (let count2 = 0; count2 <= maxPower; count2++) {
            const multiplier = Math.pow(2, count2) * Math.pow(3, count3)
            const actualTime = 2 * multiplier

            if (multiplier > targetMultiplier * 1.5) continue
            if (multiplier < minMultiplier || actualTime <= 40) continue

            if (multiplier <= targetMultiplier) {
                const splitCount = count2 + count3
                const diff = Math.abs(multiplier - targetMultiplier)

                // 优先选择分流数量少的，如果数量相同则选择更接近目标的
                if (splitCount < bestSplitCount || (splitCount === bestSplitCount && diff < bestDiff)) {
                    bestSplitCount = splitCount
                    bestCount2 = count2
                    bestCount3 = count3
                    bestCount3_2 = 0
                    bestMultiplier = multiplier
                    bestDiff = diff
                }
            }
        }
    }

    // 如果效率太低，可以添加少量2/3
    if (bestMultiplier < minMultiplier * 1.1) {
        for (let count3 = 0; count3 <= maxPower3; count3++) {
            for (let count2 = 0; count2 <= maxPower; count2++) {
                for (let count3_2 = 0; count3_2 <= 3; count3_2++) {
                    // 最多3个2/3
                    const multiplier = Math.pow(2, count2) * Math.pow(3, count3) * Math.pow(3 / 2, count3_2)
                    const actualTime = 2 * multiplier

                    if (multiplier > targetMultiplier * 1.5) continue
                    if (multiplier < minMultiplier || actualTime <= 40) continue

                    if (multiplier <= targetMultiplier) {
                        const splitCount = count2 + count3 + count3_2
                        const diff = Math.abs(multiplier - targetMultiplier)

                        if (splitCount < bestSplitCount || (splitCount === bestSplitCount && diff < bestDiff)) {
                            bestSplitCount = splitCount
                            bestCount2 = count2
                            bestCount3 = count3
                            bestCount3_2 = count3_2
                            bestMultiplier = multiplier
                            bestDiff = diff
                        }
                    }
                }
            }
        }
    }

    const splits = []
    for (let i = 0; i < bestCount3; i++) splits.push(3)
    for (let i = 0; i < bestCount2; i++) splits.push(2)
    for (let i = 0; i < bestCount3_2; i++) splits.push(3 / 2)

    const actualTime = baseTime * bestMultiplier
    const actualRate = 1 / actualTime

    // 如果轻量化方案效率太低（<80%）或找不到有效方案，返回null
    const efficiencyRatio = bestMultiplier / targetMultiplier
    if (bestMultiplier === 1 || efficiencyRatio < minEfficiencyRatio || actualTime <= 40) {
        return null
    }

    return {
        pipeline: {
            splits: splits,
            rate: actualRate,
            time: actualTime
        },
        totalRate: actualRate,
        totalTime: actualTime
    }
}

// 查找轻量化方案只是用1/2,1/3
function findLastSplitFromTime(targetTime) {
    // 基础时间是2秒/个
    const baseTime = 2

    // 如果目标时间小于等于基础时间，不需要分流
    if (targetTime <= baseTime) {
        return {
            pipeline: {
                splits: [],
                rate: 1 / baseTime,
                time: baseTime
            },
            totalRate: 1 / baseTime,
            totalTime: baseTime
        }
    }

    // 计算需要的倍数
    const targetMultiplier = targetTime / baseTime
    // 找到最接近 targetMultiplier 的 2^a × 3^b × (3/2)^c
    // 策略：先只使用1/3和1/2，如果效率比例低于90%才使用2/3

    const log2 = Math.log(2)
    const log3 = Math.log(3)
    const log3_2 = Math.log(3 / 2)
    const logTarget = Math.log(targetMultiplier)

    let bestDiff = Infinity
    let bestCount2 = 0
    let bestCount3 = 0
    let bestCount3_2 = 0
    let bestMultiplier = 1

    // 扩大搜索范围以确保找到所有可能的组合
    const maxPower = Math.ceil(logTarget / Math.min(log2, log3_2)) + 10
    const maxPower3 = Math.ceil(logTarget / log3) + 5

    // 第一步：只使用1/3和1/2分流器（不使用2/3）
    for (let count3 = 0; count3 <= maxPower3; count3++) {
        for (let count2 = 0; count2 <= maxPower; count2++) {
            const multiplier = Math.pow(2, count2) * Math.pow(3, count3)

            // 跳过太大的倍数
            if (multiplier > targetMultiplier * 1.5) continue

            // 确保实际效率时间必须大于40秒
            const actualTime = 2 * multiplier
            if (multiplier <= targetMultiplier && actualTime > 40) {
                const diff = Math.abs(multiplier - targetMultiplier)

                // 计算分流总数，优先选择分流数量更少的
                const totalSplits = count2 + count3
                const currentBestSplits = bestCount2 + bestCount3 + bestCount3_2
                const epsilon = 1e-10

                if (diff < bestDiff || (Math.abs(diff - bestDiff) < epsilon && totalSplits < currentBestSplits)) {
                    bestDiff = diff
                    bestCount2 = count2
                    bestCount3 = count3
                    bestMultiplier = multiplier
                }
            }
        }
    }

    // 如果没找到小于等于目标的（只有基础情况会出现），返回基础值
    if (bestDiff === Infinity) {
        bestCount2 = 0
        bestCount3 = 0
        bestMultiplier = 1
    }

    // 构建分流数组
    const splits = []
    for (let i = 0; i < bestCount3; i++) splits.push(3)
    for (let i = 0; i < bestCount2; i++) splits.push(2)

    const actualTime = baseTime * bestMultiplier
    const actualRate = 1 / actualTime

    return {
        pipeline: {
            splits: splits,
            rate: actualRate,
            time: actualTime
        },
        totalRate: actualRate,
        totalTime: actualTime
    }
}
function displayResultsHref(solutions) {
    const resultSection = document.getElementById('result')

    let html = ` <div ><h2>最优计算结果:`
    solutions.forEach((item, index) => {
        if (index === 0) {
            // 第一个按钮：内联样式实现 error 颜色效果 + span 加粗
            html += `<button class="btn-highlight"  onclick="location.href='#${item[0]}'"><span style="font-weight: bold;">${item[1]}</span></button>`
        } else {
            // 其余按钮：普通样式
            html += `<button  class="btn-normal" onclick="location.href='#${item[0]}'">${item[1]}</button>`
        }
    })
    html += `</h2></div>`
    resultSection.innerHTML += html
}
function displayResultStats(
    batteryId,
    batteryType,
    x,
    y,
    z,
    chargeRate,
    fullCharge,
    dischargeTime,
    targetEfficiency,
    solutions,
    maxCharge,
    dischargeRate
) {
    // 使用最佳方案显示统计信息
    const actualRate = solutions.optimal.totalRate
    const actualTime = solutions.optimal.totalTime

    const efficiency = actualTime > 0 ? ((actualTime / targetEfficiency) * 100).toFixed(2) : '0.00'

    // 计算每天节省的电池数量（个）
    // 实际效率时间包含了充电40秒 + 掉电生产时间
    // 一天能跑多少个周期
    const cyclesPerDay = 86400 / actualTime
    // 每个周期的实际掉电时间 = 实际效率时间 - 充电40秒
    const actualDischargeTime = actualTime - 40
    // 一天掉电总时间（这段时间不需要外接电池！）
    const totalDischargeTime = cyclesPerDay * actualDischargeTime
    // 掉电时间就是省下来的电池数量（每40秒省1个）
    const batterySavedPerDay = totalDischargeTime / 40

    const priceInfo = BATTERY_CONFIG.types.find((b) => b.value === z)
    const priceValue = priceInfo ? priceInfo.price : 0
    const priceUnit = priceInfo ? priceInfo.currency : '券'
    const moneySavedPerDay = batterySavedPerDay * priceValue

    return `<div class="result-stats" id="resultStats">
                                                    <div class="stat-card">
                                                        <div class="stat-label">满电消耗 (x)</div>
                                                        <div class="stat-value">${x.toFixed(0)}</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">目前产出 (y)</div>
                                                        <div class="stat-value">${y.toFixed(0)}</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">电池供电 (z)</div>
                                                        <div class="stat-value">${z.toFixed(0)}</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">电池总电量</div>
                                                        <div class="stat-value">${maxCharge.toFixed(0)}</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">充电速率 (y-x)</div>
                                                        <div class="stat-value">${chargeRate.toFixed(0)}/秒</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">40秒充满电量</div>
                                                        <div class="stat-value">${fullCharge.toFixed(0)}</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">掉电速率 (x-y)</div>
                                                        <div class="stat-value">${dischargeRate.toFixed(0)}/秒</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">最佳掉电时间</div>
                                                        <div class="stat-value">${dischargeTime.toFixed(2)} 秒</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">目标效率</div>
                                                        <div class="stat-value">${targetEfficiency.toFixed(
                                                            2
                                                        )} 秒/个</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">实际效率</div>
                                                        <div class="stat-value" style="color: ${
                                                            actualTime < targetEfficiency ? '#39c5bb' : '#e53935'
                                                        }">${actualTime.toFixed(2)} 秒/个</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">效率比例</div>
                                                        <div class="stat-value" style="color: ${
                                                            parseFloat(efficiency) <= 100 ? '#39c5bb' : '#e53935'
                                                        }">${efficiency}%</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">实际速率</div>
                                                        <div class="stat-value">${actualRate.toFixed(6)} 个/秒</div>
                                                    </div>
                                                    <div class="stat-card">
                                                        <div class="stat-label">浪费电量</div>
                                                        <div class="stat-value">${(
                                                            maxCharge / actualTime -
                                                            dischargeRate
                                                        ).toFixed(2)} /秒</div>
                                                    </div>
                                                    <div class="stat-card" style="border-left-color: #4caf50;">
                                                        <div class="stat-label">每天节省电池</div>
                                                        <div class="stat-value" style="color: #4caf50;">${batterySavedPerDay.toFixed(
                                                            1
                                                        )} 个</div>
                                                    </div>
                                                     <div class="stat-card" style="border-left-color: #4caf50;">
                                                        <div class="stat-label">每天需求电池</div>
                                                        <div class="stat-value" style="color: #4caf50;">${(
                                                            (24 * 60 * 60) /
                                                            actualTime
                                                        ).toFixed(2)} 个</div>
                                                    </div>
                                                    <div class="stat-card" style="border-left-color: #ff9800;">
                                                        <div class="stat-label">每天节省调度券</div>
                                                        <div class="stat-value" style="color: #ff9800;">${moneySavedPerDay.toFixed(
                                                            0
                                                        )} ${priceInfo.currency}</div>
                                                    </div>
                                                   </div>
                                                `
}

function displaybestResults(
    batteryId,
    batteryType,
    x,
    y,
    z,
    chargeRate,
    fullCharge,
    dischargeTime,
    targetEfficiency,
    solutions,
    maxCharge,
    dischargeRate
) {
    const resultSection = document.getElementById('result')

    resultSection.innerHTML += displayResultStats(
        batteryId,
        batteryType,
        x,
        y,
        z,
        chargeRate,
        fullCharge,
        dischargeTime,
        targetEfficiency,
        solutions,
        maxCharge,
        dischargeRate
    )

    // 滚动到结果区域
    resultSection.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    })
}
function displayResults(
    batteryId,
    batteryType,
    x,
    y,
    z,
    chargeRate,
    fullCharge,
    dischargeTime,
    targetEfficiency,
    solutions,
    maxCharge,
    dischargeRate
) {
    const results = document.getElementById('results')
    const pipelineListDiv = document.getElementById('pipelineList')

    if (!solutions.optimal || !solutions.optimal.pipeline) {
        pipelineListDiv.innerHTML = '<div class="no-solution">无法找到合适的分流方案</div>'
        document.getElementById('pipelineSection').style.display = 'block'
        return
    }

    // 检查实际效率是否小于等于40秒
    if (solutions.optimal.totalTime <= 40) {
        return
    }

    results.innerHTML += ` <div class="result-header">
                                <h2 id=${batteryId}>${batteryType}</h2>
                            </div>`
    results.innerHTML += displayResultStats(
        batteryId,
        batteryType,
        x,
        y,
        z,
        chargeRate,
        fullCharge,
        dischargeTime,
        targetEfficiency,
        solutions,
        maxCharge,
        dischargeRate
    )

    // 显示分流方案
    const pipelineSectionDiv = document.getElementById('pipelineSection')

    // 生成分流方案HTML的辅助函数
    function generatePipelineHTML(pipeline, title, description, badgeColor) {
        let splitsText
        if (pipeline.splits.length > 0) {
            const splitCounts = {}
            pipeline.splits.forEach((s) => {
                const key = s === 3 / 2 ? '1.5' : s.toString()
                splitCounts[key] = (splitCounts[key] || 0) + 1
            })

            const splitParts = []
            if (splitCounts['3']) {
                const label = splitCounts['3'] === 1 ? '1/3' : `1/3 × ${splitCounts['3']}`
                splitParts.push(`<span class="split-badge">${label}</span>`)
            }
            if (splitCounts['2']) {
                const label = splitCounts['2'] === 1 ? '1/2' : `1/2 × ${splitCounts['2']}`
                splitParts.push(`<span class="split-badge">${label}</span>`)
            }
            if (splitCounts['1.5']) {
                const label = splitCounts['1.5'] === 1 ? '2/3' : `2/3 × ${splitCounts['1.5']}`
                splitParts.push(`<span class="split-badge">${label}</span>`)
            }

            splitsText = splitParts.join(' → ')
        } else {
            splitsText = '<span class="split-badge">无分流</span>'
        }

        const timeDisplay = pipeline.time ? `${pipeline.time.toFixed(0)}秒/个` : '2秒/个'
        const efficiency = ((pipeline.time / targetEfficiency) * 100).toFixed(2)
        const splitCount = pipeline.splits.length

        return `
                                <div class="pipeline-list" id="pipelineList">
                                                        <div class="pipeline-item">
                                                            <div class="pipeline-header">
                                                                <div class="pipeline-title">
                                                                    <strong style="color: ${badgeColor};">${title}</strong>
                                                                    <div style="font-size: 11px; color: #666; margin-top: 2px;">${description}</div>
                                                                </div>
                                                                <div class="pipeline-efficiency" style="background: ${badgeColor};">${timeDisplay}</div>
                                                            </div>
                                                            <div class="pipeline-splits">
                                                                <strong>分流设置：</strong>${splitsText}
                                                            </div>
                                                            <div class="pipeline-splits">
                                                                <strong>速率：</strong>${pipeline.rate.toFixed(
                                                                    6
                                                                )} 个/秒 |
                                                                <strong>效率：</strong>${pipeline.time.toFixed(
                                                                    2
                                                                )} 秒/个 |
                                                                <strong>效率比例：</strong><span style="color: ${
                                                                    parseFloat(efficiency) >= 80 ? '#4caf50' : '#e53935'
                                                                }">${efficiency}%</span>
                                                                <strong>浪费电量：</strong><span style="color: ${
                                                                    parseFloat(efficiency) >= 80 ? '#4caf50' : '#e53935'
                                                                }">${(maxCharge / pipeline.time - (x - y)).toFixed(
                                                                    2
                                                                )} /秒</span>

                                                            </div>
                                                            <div class="pipeline-splits">
                                                                <strong>分流数量：</strong>${splitCount} 个
                                                            </div>
                                                        </div></div>
                                                    `
    }

    // 生成方案HTML
    let html = ``
    html += generatePipelineHTML(
        solutions.optimal.pipeline,
        '最佳分流方案',
        '最接近目标效率，在效率相同时优先使用最少分流器(当效率低于95%时允许适当增加2/3分流器数量以提高效率)',
        '#39c5bb'
    )

    // 只有轻量化方案有效时才显示
    if (
        solutions.lightweight &&
        solutions.lightweight.pipeline &&
        solutions.optimal.totalTime !== solutions.lightweight.totalTime
    ) {
        html += generatePipelineHTML(
            solutions.lightweight.pipeline,
            '轻量化方案',
            '减少分流器数量，允许适当损失效率（保持80%以上）',
            '#ff9800'
        )
    }
    // 只有最少分流方案有效时才显示
    if (
        solutions.lastweight &&
        solutions.lastweight.pipeline &&
        solutions.optimal.totalTime !== solutions.lastweight.totalTime &&
        solutions.lightweight.totalTime !== solutions.lastweight.totalTime
    ) {
        html += generatePipelineHTML(
            solutions.lastweight.pipeline,
            '最少分流方案',
            '减少分流器数量，只是用 1/2 , 1/3 分流器',
            '#ff3d00'
        )
    }
    results.innerHTML += html
    pipelineSectionDiv.style.display = 'block'
}
