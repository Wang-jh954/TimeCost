// DOM元素引用
const calculateBtn = document.getElementById('calculateBtn');
const shareBtn = document.getElementById('shareBtn');
const resultDiv = document.getElementById('result');

// 情感化对比文案库
const COMPARISONS = [
    hours => `相当于：${Math.round(hours / 2)} 顿火锅`,
    hours => `相当于：${Math.round(hours * 60)} 分钟的通勤时间`,
    days => `相当于：${Math.round(days)} 次周末加班`,
    hours => `相当于：你手机${Math.round(hours * 10)} 天的屏幕使用时间`
];

// 计算生命成本
function calculateLifeCost() {
    // 获取输入值
    const income = parseFloat(document.getElementById('income').value);
    const workDays = parseFloat(document.getElementById('workDays').value);
    const hoursPerDay = parseFloat(document.getElementById('hoursPerDay').value);
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);
    
    // 验证输入
    if ([income, workDays, hoursPerDay, itemPrice].some(isNaN)) {
        alert('请填写有效的数字！');
        return;
    }

    // 计算
    const monthlyHours = workDays * hoursPerDay;
    const hourlyWage = income / monthlyHours;
    const hoursNeeded = itemPrice / hourlyWage;
    const daysNeeded = hoursNeeded / hoursPerDay;
    
    // 显示结果
    document.getElementById('timeCost').innerHTML = 
        `你需要工作 <strong>${hoursNeeded.toFixed(1)} 小时</strong>（约 ${daysNeeded.toFixed(1)} 个工作日）才能购买这个商品。`;
    
    // 随机选择对比文案
    const randomComparison = COMPARISONS[Math.floor(Math.random() * COMPARISONS.length)];
    document.getElementById('comparison').innerHTML = randomComparison(hoursNeeded);
    
    // 显示结果区域
    resultDiv.style.display = 'block';
}

// 分享结果
function shareResult() {
    const timeCostText = document.getElementById('timeCost').innerText;
    const comparisonText = document.getElementById('comparison').innerText;
    const shareText = `我刚用TimeCost算了一笔账：${timeCostText} ${comparisonText} 你的消费值多少生命时间？`;
    
    // 尝试使用Web Share API（支持现代浏览器）
    if (navigator.share) {
        navigator.share({
            title: 'TimeCost计算结果',
            text: shareText
        }).catch(err => {
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

// 兼容性分享方案
function fallbackShare(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('结果已复制到剪贴板，快去分享吧！');
        });
    } else {
        prompt('请手动复制以下内容：', text);
    }
}

// 事件监听
calculateBtn.addEventListener('click', calculateLifeCost);
shareBtn.addEventListener('click', shareResult);

// 初始化输入框校验
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9.]/g, '');
    });
});