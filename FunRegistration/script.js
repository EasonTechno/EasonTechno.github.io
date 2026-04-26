let currentStep = 1;
let selectedPhone = '13800138000';
let selectedGender = '';
let password = '';
let passwordValid = false;
let passwordVisible = false;

// 初始化
window.onload = function() {
    updatePhoneDisplay();
};

// 更新手机号显示
function updatePhoneDisplay() {
    const slider = document.getElementById('phoneSlider');
    const output = document.getElementById('phoneOutput');
    // 格式化为11位，前面补零
    selectedPhone = slider.value.padStart(11, '0');
    output.textContent = formatPhone(selectedPhone);
}

// 格式化手机号显示（增加空格分隔更易读）
function formatPhone(num) {
    const str = num.toString().padStart(11, '0');
    return str;
}

// 切换步骤
function goToStep(step) {
    // 隐藏所有步骤
    document.querySelectorAll('.step-content').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });
    
    // 显示当前步骤
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById(`step-${step}-indicator`).classList.add('active');
    currentStep = step;
}

function nextStep() {
    if (currentStep === 1) {
        goToStep(2);
    } else if (currentStep === 2 && passwordValid) {
        // 填充摘要
        document.getElementById('summaryPhone').textContent = selectedPhone;
        document.getElementById('summaryGender').textContent = selectedGender;
        document.getElementById('summaryPassword').textContent = '●'.repeat(password.length);
        goToStep(3);
    }
}

function prevStep() {
    if (currentStep > 1) {
        goToStep(currentStep - 1);
    }
}

// 选择性别
function selectGender(gender) {
    selectedGender = gender;
    const messageEl = document.getElementById('genderMessage');
    messageEl.textContent = `${gender} 该性别已被占用`;
    messageEl.classList.add('show');
    
    // 高亮选中按钮
    document.querySelectorAll('.gender-btn').forEach(btn => {
        btn.style.borderColor = '#ddd';
        btn.style.background = 'white';
    });
    event.target.style.borderColor = '#667eea';
    event.target.style.background = '#f8f9ff';
}

// 判断是否是素数
function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    let i = 5;
    while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

// 获取字符类型
function getCharType(c) {
    if (/[0-9]/.test(c)) return 'digit';
    if (/[a-z]/.test(c)) return 'lower';
    if (/[A-Z]/.test(c)) return 'upper';
    if (/[\u4e00-\u9fa5]/.test(c)) return 'chinese';
    return 'special'; // 其他都是特殊符号
}

// 检查是否有连续3个同类字符
function hasConsecutiveSameType(str) {
    if (str.length < 3) return false;
    
    for (let i = 0; i <= str.length - 3; i++) {
        const t1 = getCharType(str[i]);
        const t2 = getCharType(str[i+1]);
        const t3 = getCharType(str[i+2]);
        if (t1 === t2 && t2 === t3) {
            return true;
        }
    }
    return false;
}

// 密码验证规则
const validationRules = [
    {
        test: (pwd) => /[0-9]/.test(pwd),
        message: '需包含数字'
    },
    {
        test: (pwd) => /[a-z]/.test(pwd),
        message: '需要包含小写字母'
    },
    {
        test: (pwd) => /[A-Z]/.test(pwd),
        message: '需要包含大写字母'
    },
    {
        test: (pwd) => /[^a-zA-Z0-9\u4e00-\u9fa5]/.test(pwd),
        message: '需要包含特殊符号'
    },
    {
        test: (pwd) => /[\u4e00-\u9fa5]/.test(pwd),
        message: '需要包含汉字'
    },
    {
        test: (pwd) => {
            const digits = pwd.match(/[0-9]/g) || [];
            const sum = digits.reduce((acc, d) => acc + parseInt(d), 0);
            return isPrime(sum);
        },
        message: '密码中所有数字之和应为素数'
    },
    {
        test: (pwd) => !hasConsecutiveSameType(pwd),
        message: '密码中不能连续出现3个及以上的同类字符'
    }
];

// 验证密码
function validatePassword() {
    password = document.getElementById('password').value;
    const hintEl = document.getElementById('passwordHint');
    const listEl = document.getElementById('validationList');
    const nextBtn = document.getElementById('nextBtn');
    
    // 清空
    listEl.innerHTML = '';
    
    let allPass = true;
    let firstFailIndex = -1;
    
    // 按顺序验证
    for (let i = 0; i < validationRules.length; i++) {
        const rule = validationRules[i];
        const passed = rule.test(password);
        
        const item = document.createElement('div');
        item.className = `validation-item ${passed ? 'pass' : 'fail'}`;
        item.textContent = rule.message;
        listEl.appendChild(item);
        
        if (!passed && firstFailIndex === -1) {
            firstFailIndex = i;
            allPass = false;
        }
    }
    
    passwordValid = allPass;
    nextBtn.disabled = !allPass;
    
    // 更新提示
    if (allPass) {
        hintEl.className = 'password-hint success';
        hintEl.textContent = '✅ 密码满足所有要求！';
    } else {
        hintEl.className = 'password-hint error';
        hintEl.textContent = `❌ ${validationRules[firstFailIndex].message}`;
    }
    
    return allPass;
}

// 提交表单
function submitForm() {
    const messages = [
        "密码中包含未经验证的信息，请核实并修正后重试",
        "密码中包含敏感信息，请尝试重新输入"
    ];
    // 随机选一个
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    
    const messageEl = document.getElementById('submitMessage');
    messageEl.textContent = randomMsg;
    messageEl.classList.add('show');
}

// 切换密码显示/隐藏
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    passwordVisible = !passwordVisible;
    
    if (passwordVisible) {
        passwordInput.type = 'text';
        toggleBtn.textContent = '隐藏';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '显示';
    }
}
