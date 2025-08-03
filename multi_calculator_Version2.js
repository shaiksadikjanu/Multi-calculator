// Tab navigation
function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = '';
}

// Show/hide math evaluation/conversion
document.querySelectorAll('input[name="mathMode"]').forEach(radio => {
    radio.onchange = function() {
        document.getElementById('mathEval').style.display = radio.value === 'eval' ? '' : 'none';
        document.getElementById('mathConv').style.display = radio.value === 'conv' ? '' : 'none';
    }
});

// -------- Basic Mathematics --------
// Multi-digit and parenthesis support for infix
function tokenize(expr) {
    const regex = /\d+(\.\d+)?|[()+\-*/]/g;
    return expr.match(regex) || [];
}
function precedence(op) {
    if (op === '+' || op === '-') return 1;
    if (op === '*' || op === '/') return 2;
    return 0;
}
function isOperator(ch) {
    return "+-*/".includes(ch);
}
// Infix to Postfix (Shunting Yard, multi-digit)
function infixToPostfix(infix) {
    let tokens = tokenize(infix);
    let output = [];
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) output.push(token);
        else if (token === "(") stack.push(token);
        else if (token === ")") {
            while (stack.length && stack[stack.length-1] !== "(")
                output.push(stack.pop());
            stack.pop();
        } else if (isOperator(token)) {
            while (stack.length && isOperator(stack[stack.length-1]) && precedence(stack[stack.length-1]) >= precedence(token))
                output.push(stack.pop());
            stack.push(token);
        }
    }
    while (stack.length) output.push(stack.pop());
    return output.join(" ");
}
// Infix to Prefix
function infixToPrefix(infix) {
    let tokens = tokenize(infix).reverse();
    let output = [];
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) output.push(token);
        else if (token === ")") stack.push(token);
        else if (token === "(") {
            while (stack.length && stack[stack.length-1] !== ")")
                output.push(stack.pop());
            stack.pop();
        } else if (isOperator(token)) {
            while (stack.length && isOperator(stack[stack.length-1]) && precedence(stack[stack.length-1]) > precedence(token))
                output.push(stack.pop());
            stack.push(token);
        }
    }
    while (stack.length) output.push(stack.pop());
    return output.reverse().join(" ");
}
// Postfix to Infix
function postfixToInfix(expr) {
    let tokens = expr.split(/\s+/).filter(Boolean);
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) stack.push(token);
        else if (isOperator(token)) {
            let b = stack.pop(), a = stack.pop();
            stack.push(`(${a}${token}${b})`);
        }
    }
    return stack.pop();
}
// Prefix to Infix
function prefixToInfix(expr) {
    let tokens = expr.split(/\s+/).filter(Boolean).reverse();
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) stack.push(token);
        else if (isOperator(token)) {
            let a = stack.pop(), b = stack.pop();
            stack.push(`(${a}${token}${b})`);
        }
    }
    return stack.pop();
}
// Postfix to Prefix
function postfixToPrefix(expr) {
    let tokens = expr.split(/\s+/).filter(Boolean);
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) stack.push(token);
        else if (isOperator(token)) {
            let b = stack.pop(), a = stack.pop();
            stack.push(`${token} ${a} ${b}`);
        }
    }
    return stack.pop();
}
// Prefix to Postfix
function prefixToPostfix(expr) {
    let tokens = expr.split(/\s+/).filter(Boolean).reverse();
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) stack.push(token);
        else if (isOperator(token)) {
            let a = stack.pop(), b = stack.pop();
            stack.push(`${a} ${b} ${token}`);
        }
    }
    return stack.pop();
}

// Evaluation (multi-digit numbers, postfix/prefix/infix)
function evaluatePostfix(expr) {
    let tokens = expr.split(/\s+/).filter(Boolean);
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) stack.push(parseFloat(token));
        else if (isOperator(token)) {
            let b = stack.pop(), a = stack.pop();
            if (token === '+') stack.push(a + b);
            else if (token === '-') stack.push(a - b);
            else if (token === '*') stack.push(a * b);
            else if (token === '/') stack.push(a / b);
        }
    }
    return stack.length === 1 ? stack[0] : NaN;
}
function evaluatePrefix(expr) {
    let tokens = expr.split(/\s+/).filter(Boolean).reverse();
    let stack = [];
    for (let token of tokens) {
        if (/^\d+(\.\d+)?$/.test(token)) stack.push(parseFloat(token));
        else if (isOperator(token)) {
            let a = stack.pop(), b = stack.pop();
            if (token === '+') stack.push(a + b);
            else if (token === '-') stack.push(a - b);
            else if (token === '*') stack.push(a * b);
            else if (token === '/') stack.push(a / b);
        }
    }
    return stack.length === 1 ? stack[0] : NaN;
}
function evaluateInfix(expr) {
    // Convert to postfix and evaluate
    let postfix = infixToPostfix(expr);
    return evaluatePostfix(postfix);
}

// UI functions
function evaluateMath() {
    let type = document.getElementById('evalType').value;
    let expr = document.getElementById('mathExpr').value;
    let res;
    try {
        if (type === 'infix') res = evaluateInfix(expr);
        else if (type === 'postfix') res = evaluatePostfix(expr);
        else if (type === 'prefix') res = evaluatePrefix(expr);
        document.getElementById('mathResult').innerText = isNaN(res) ? "Error: Invalid expression" : "Result: " + res;
    } catch (e) {
        document.getElementById('mathResult').innerText = "Error: Invalid expression";
    }
}
function convertMath() {
    let from = document.getElementById('convFrom').value;
    let to = document.getElementById('convTo').value;
    let expr = document.getElementById('convExpr').value;
    let result = expr;
    try {
        if (from === 'infix' && to === 'postfix') result = infixToPostfix(expr);
        else if (from === 'infix' && to === 'prefix') result = infixToPrefix(expr);
        else if (from === 'postfix' && to === 'infix') result = postfixToInfix(expr);
        else if (from === 'postfix' && to === 'prefix') result = postfixToPrefix(expr);
        else if (from === 'prefix' && to === 'infix') result = prefixToInfix(expr);
        else if (from === 'prefix' && to === 'postfix') result = prefixToPostfix(expr);
        document.getElementById('convResult').innerText = "Converted Result: " + result;
    } catch (e) {
        document.getElementById('convResult').innerText = "Error: Invalid expression";
    }
}

// -------- Number System --------
function binaryToDecimal(bin) {
    if (!/^[01]+$/.test(bin)) return NaN;
    return parseInt(bin, 2);
}
function octalToDecimal(oct) {
    if (!/^[0-7]+$/.test(oct)) return NaN;
    return parseInt(oct, 8);
}
function hexToDecimal(hex) {
    if (!/^[0-9A-Fa-f]+$/.test(hex)) return NaN;
    return parseInt(hex, 16);
}
function decimalToBinary(n) {
    if (isNaN(n)) return "Invalid";
    return n === 0 ? "0" : Math.floor(n).toString(2);
}
function decimalToOctal(n) {
    if (isNaN(n)) return "Invalid";
    return Math.floor(n).toString(8);
}
function decimalToHex(n) {
    if (isNaN(n)) return "Invalid";
    return Math.floor(n).toString(16).toUpperCase();
}
function decimalToBCD(n) {
    if (isNaN(n)) return "Invalid";
    n = Math.abs(Math.floor(n));
    if (n === 0) return "0000";
    let out = [];
    while (n > 0) {
        let digit = n % 10;
        let bin = digit.toString(2).padStart(4, '0');
        out.unshift(bin);
        n = Math.floor(n/10);
    }
    return out.join(' ');
}
function decimalTo2421(n) {
    if (isNaN(n)) return "Invalid";
    let table = [
        "0000", "0001", "0010", "0011", "0100",
        "1011", "1100", "1101", "1110", "1111"
    ];
    n = Math.abs(Math.floor(n));
    if (n === 0) return table[0];
    let out = [];
    while (n > 0) {
        let digit = n % 10;
        out.unshift(table[digit] ?? "Invalid");
        n = Math.floor(n/10);
    }
    return out.join(' ');
}

function convertNumberSystem() {
    let from = document.getElementById('numFrom').value;
    let to = document.getElementById('numTo').value;
    let input = document.getElementById('numInput').value.trim();
    let decimal;
    if (from === 'decimal') decimal = parseInt(input);
    else if (from === 'binary') decimal = binaryToDecimal(input);
    else if (from === 'octal') decimal = octalToDecimal(input);
    else if (from === 'hex') decimal = hexToDecimal(input);
    else decimal = NaN;

    if (isNaN(decimal)) {
        document.getElementById('numResult').innerText = "Invalid input number format.";
        return;
    }

    let result = "";
    if (to === 'decimal') result = decimal.toString();
    else if (to === 'binary') result = decimalToBinary(decimal);
    else if (to === 'octal') result = decimalToOctal(decimal);
    else if (to === 'hex') result = decimalToHex(decimal);
    else if (to === 'bcd' || to === '8421') result = decimalToBCD(decimal);
    else if (to === '2421') result = decimalTo2421(decimal);
    else result = "Invalid output type.";
    document.getElementById('numResult').innerText = "Result: " + result;
}

// -------- Metric Conversion --------
function renderMetricForm() {
    let type = document.getElementById('metricType').value;
    let html = '';
    let units = [], rates = [];
    switch(type) {
        case 'currency':
            units = ["INR", "USD", "EUR", "JPY", "GBP", "DZD", "BHD"];
            rates = [1.0, 0.012, 0.011, 1.75, 0.0094, 1.0, 0.0028];
            html = `
            <label for="currFrom">From:</label> <select id="currFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="currTo">To:</label> <select id="currTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="currAmt">Amount:</label>
            <input type="text" id="currAmt" placeholder="Amount">
            <button onclick="convertCurrency()">Convert</button>
            `;
            break;
        case 'length':
            units = ["Meters", "Kilometers", "Miles"];
            rates = [1.0, 0.001, 0.000621371];
            html = `
            <label for="lenFrom">From:</label> <select id="lenFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="lenTo">To:</label> <select id="lenTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="lenVal">Value:</label>
            <input type="text" id="lenVal" placeholder="Value">
            <button onclick="convertLength()">Convert</button>
            `;
            break;
        case 'area':
            units = ["Sq.m", "Sq.km", "Acres"];
            rates = [1.0, 0.000001, 0.000247105];
            html = `
            <label for="areaFrom">From:</label> <select id="areaFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="areaTo">To:</label> <select id="areaTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="areaVal">Value:</label>
            <input type="text" id="areaVal" placeholder="Value">
            <button onclick="convertArea()">Convert</button>
            `;
            break;
        case 'volume':
            units = ["Liters", "Milliliters", "Gallons"];
            rates = [1.0, 1000.0, 0.264172];
            html = `
            <label for="volFrom">From:</label> <select id="volFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="volTo">To:</label> <select id="volTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="volVal">Value:</label>
            <input type="text" id="volVal" placeholder="Value">
            <button onclick="convertVolume()">Convert</button>
            `;
            break;
        case 'weight':
            units = ["Kg", "Grams", "Pounds"];
            rates = [1.0, 1000.0, 2.20462];
            html = `
            <label for="wtFrom">From:</label> <select id="wtFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="wtTo">To:</label> <select id="wtTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="wtVal">Value:</label>
            <input type="text" id="wtVal" placeholder="Value">
            <button onclick="convertWeight()">Convert</button>
            `;
            break;
        case 'temperature':
            units = ["Celsius", "Fahrenheit", "Kelvin"];
            html = `
            <label for="tempFrom">From:</label> <select id="tempFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="tempTo">To:</label> <select id="tempTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="tempVal">Temperature:</label>
            <input type="text" id="tempVal" placeholder="Temperature">
            <button onclick="convertTemperature()">Convert</button>
            `;
            break;
        case 'speed':
            units = ["Km/h", "m/s", "mph"];
            rates = [1.0, 0.277778, 0.621371];
            html = `
            <label for="speedFrom">From:</label> <select id="speedFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="speedTo">To:</label> <select id="speedTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="speedVal">Value:</label>
            <input type="text" id="speedVal" placeholder="Value">
            <button onclick="convertSpeed()">Convert</button>
            `;
            break;
        case 'pressure':
            units = ["Pascal", "atm", "bar"];
            rates = [1.0, 9.8692e-6, 1e-5];
            html = `
            <label for="pressFrom">From:</label> <select id="pressFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="pressTo">To:</label> <select id="pressTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="pressVal">Value:</label>
            <input type="text" id="pressVal" placeholder="Value">
            <button onclick="convertPressure()">Convert</button>
            `;
            break;
        case 'power':
            units = ["Watt", "Kilowatt", "Horsepower"];
            rates = [1.0, 0.001, 0.001341];
            html = `
            <label for="powFrom">From:</label> <select id="powFrom">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="powTo">To:</label> <select id="powTo">
                ${units.map((u,i)=>`<option value="${i}">${u}</option>`).join('')}
            </select>
            <label for="powVal">Value:</label>
            <input type="text" id="powVal" placeholder="Value">
            <button onclick="convertPower()">Convert</button>
            `;
            break;
        case 'cost':
            html = `
            <label for="costGrams">Weight (grams):</label>
            <input type="text" id="costGrams" placeholder="Weight (grams)">
            <label for="costRate">Cost per kg (INR):</label>
            <input type="text" id="costRate" placeholder="Cost per kg (INR)">
            <button onclick="convertCost()">Calculate Cost</button>
            `;
            break;
    }
    document.getElementById('metricForm').innerHTML = html;
    document.getElementById('metricResult').innerText = '';
}

function convertCurrency() {
    let units = ["INR", "USD", "EUR", "JPY", "GBP", "DZD", "BHD"];
    let rates = [1.0, 0.012, 0.011, 1.75, 0.0094, 1.0, 0.0028];
    let from = Number(document.getElementById('currFrom').value);
    let to = Number(document.getElementById('currTo').value);
    let amt = parseFloat(document.getElementById('currAmt').value);
    if (isNaN(amt)) { document.getElementById('metricResult').innerText = "Invalid amount."; return; }
    let inr_amt = amt / rates[from];
    let result = inr_amt * rates[to];
    document.getElementById('metricResult').innerText =
        `${amt} ${units[from]} = ${result.toFixed(2)} ${units[to]}`;
}
function convertLength() {
    let units = ["Meters", "Kilometers", "Miles"];
    let rates = [1.0, 0.001, 0.000621371];
    let from = Number(document.getElementById('lenFrom').value);
    let to = Number(document.getElementById('lenTo').value);
    let val = parseFloat(document.getElementById('lenVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let meters = val / rates[from];
    let result = meters * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(4)} ${units[to]}`;
}
function convertArea() {
    let units = ["Sq.m", "Sq.km", "Acres"];
    let rates = [1.0, 0.000001, 0.000247105];
    let from = Number(document.getElementById('areaFrom').value);
    let to = Number(document.getElementById('areaTo').value);
    let val = parseFloat(document.getElementById('areaVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let sqm = val / rates[from];
    let result = sqm * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(4)} ${units[to]}`;
}
function convertVolume() {
    let units = ["Liters", "Milliliters", "Gallons"];
    let rates = [1.0, 1000.0, 0.264172];
    let from = Number(document.getElementById('volFrom').value);
    let to = Number(document.getElementById('volTo').value);
    let val = parseFloat(document.getElementById('volVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let liters = val / rates[from];
    let result = liters * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(4)} ${units[to]}`;
}
function convertWeight() {
    let units = ["Kg", "Grams", "Pounds"];
    let rates = [1.0, 1000.0, 2.20462];
    let from = Number(document.getElementById('wtFrom').value);
    let to = Number(document.getElementById('wtTo').value);
    let val = parseFloat(document.getElementById('wtVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let kg = val / rates[from];
    let result = kg * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(4)} ${units[to]}`;
}
function convertTemperature() {
    let units = ["Celsius", "Fahrenheit", "Kelvin"];
    let from = Number(document.getElementById('tempFrom').value);
    let to = Number(document.getElementById('tempTo').value);
    let temp = parseFloat(document.getElementById('tempVal').value);
    if (isNaN(temp)) { document.getElementById('metricResult').innerText = "Invalid temperature."; return; }
    let result;
    if (from === to) result = temp;
    else if (from === 0 && to === 1) result = temp * 9 / 5 + 32;
    else if (from === 0 && to === 2) result = temp + 273.15;
    else if (from === 1 && to === 0) result = (temp - 32) * 5 / 9;
    else if (from === 1 && to === 2) result = (temp - 32) * 5 / 9 + 273.15;
    else if (from === 2 && to === 0) result = temp - 273.15;
    else if (from === 2 && to === 1) result = (temp - 273.15) * 9 / 5 + 32;
    else { document.getElementById('metricResult').innerText = "Invalid conversion."; return; }
    document.getElementById('metricResult').innerText =
        `${temp} ${units[from]} = ${result.toFixed(2)} ${units[to]}`;
}
function convertSpeed() {
    let units = ["Km/h", "m/s", "mph"];
    let rates = [1.0, 0.277778, 0.621371];
    let from = Number(document.getElementById('speedFrom').value);
    let to = Number(document.getElementById('speedTo').value);
    let val = parseFloat(document.getElementById('speedVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let kmh = val / rates[from];
    let result = kmh * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(2)} ${units[to]}`;
}
function convertPressure() {
    let units = ["Pascal", "atm", "bar"];
    let rates = [1.0, 9.8692e-6, 1e-5];
    let from = Number(document.getElementById('pressFrom').value);
    let to = Number(document.getElementById('pressTo').value);
    let val = parseFloat(document.getElementById('pressVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let pascal = val / rates[from];
    let result = pascal * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(6)} ${units[to]}`;
}
function convertPower() {
    let units = ["Watt", "Kilowatt", "Horsepower"];
    let rates = [1.0, 0.001, 0.001341];
    let from = Number(document.getElementById('powFrom').value);
    let to = Number(document.getElementById('powTo').value);
    let val = parseFloat(document.getElementById('powVal').value);
    if (isNaN(val)) { document.getElementById('metricResult').innerText = "Invalid value."; return; }
    let watt = val / rates[from];
    let result = watt * rates[to];
    document.getElementById('metricResult').innerText =
        `${val} ${units[from]} = ${result.toFixed(4)} ${units[to]}`;
}
function convertCost() {
    let grams = parseFloat(document.getElementById('costGrams').value);
    let rate = parseFloat(document.getElementById('costRate').value);
    if (isNaN(grams) || isNaN(rate)) { document.getElementById('metricResult').innerText = "Invalid input."; return; }
    let cost = (grams / 1000.0) * rate;
    document.getElementById('metricResult').innerText =
        `Total cost: ₹${cost.toFixed(2)} for ${grams} grams`;
}

// Render initial metric form
renderMetricForm();