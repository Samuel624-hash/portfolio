const exprDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelector(".buttons");

let expression = "";
let angleMode = "DEG";
let memory = 0;

/* ---------- DISPLAY ---------- */
function updateDisplay() {
    exprDisplay.textContent = expression || "0";
}

function append(value) {
    expression += value;
    updateDisplay();
}

function clearAll() {
    expression = "";
    resultDisplay.textContent = "0";
    updateDisplay();
}

/* ---------- DELETE ---------- */
function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

/* ---------- ANGLE ---------- */
function toRadians(x) {
    return angleMode === "DEG" ? x * Math.PI / 180 : x;
}

/* ---------- FACTORIAL ---------- */
function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0) return 1;
    return n * factorial(n - 1);
}

/* ---------- CALCULATE ---------- */
function calculate() {
    try {
        let exp = expression
            .replace(/π/g, Math.PI)
            .replace(/√\(/g, "Math.sqrt(")
            .replace(/sin\(([^)]+)\)/g, (_, x) => Math.sin(toRadians(eval(x))))
            .replace(/cos\(([^)]+)\)/g, (_, x) => Math.cos(toRadians(eval(x))))
            .replace(/tan\(([^)]+)\)/g, (_, x) => Math.tan(toRadians(eval(x))))
            .replace(/log\(([^)]+)\)/g, (_, x) => Math.log10(eval(x)))
            .replace(/ln\(([^)]+)\)/g, (_, x) => Math.log(eval(x)))
            .replace(/(\d+)!/g, (_, x) => factorial(Number(x)));

        let result = eval(exp);

        result = Number(result.toFixed(8));
        resultDisplay.textContent = result;
    } catch {
        resultDisplay.textContent = "Math Error";
    }
}

/* ---------- ACTION HANDLER ---------- */
function handleAction(action) {
    switch (action) {
        case "clear":
            clearAll();
            break;

        case "delete":
            deleteLast();
            break;

        case "equals":
            calculate();
            break;

        case "toggle-angle":
            angleMode = angleMode === "DEG" ? "RAD" : "DEG";
            document.querySelector('[data-action="toggle-angle"]').textContent = angleMode;
            break;

        case "sin":
        case "cos":
        case "tan":
        case "log":
        case "ln":
            append(action + "(");
            break;

        case "sqrt":
            append("√(");
            break;

        case "pow":
            append("**2");
            break;

        case "pi":
            append("π");
            break;

        case "factorial":
            append("!");
            break;

        case "mc":
            memory = 0;
            break;

        case "mr":
            append(memory.toString());
            break;

        case "mplus":
            memory += Number(resultDisplay.textContent) || 0;
            break;

        case "mminus":
            memory -= Number(resultDisplay.textContent) || 0;
            break;
    }
}

/* ---------- BUTTON EVENTS ---------- */
buttons.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    if (btn.dataset.key) {
        append(btn.dataset.key);
    } 
    else if (btn.dataset.action) {
        handleAction(btn.dataset.action);
    }
});

/* ---------- KEYBOARD ---------- */
document.addEventListener("keydown", (e) => {
    if ("0123456789+-*/().".includes(e.key)) append(e.key);
    else if (e.key === "Enter") calculate();
    else if (e.key === "Backspace") deleteLast();
    else if (e.key.toLowerCase() === "c") clearAll();
});