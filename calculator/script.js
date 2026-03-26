class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
            this.currentOperand = '0';
            return;
        }
        if (this.shouldResetScreen) return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && operation !== 'subtract') return;
        
        // Handle negative numbers if operator is pressed first
        if (this.currentOperand === '0' && this.previousOperand === '' && operation === 'subtract') {
            this.currentOperand = '-';
            return;
        }

        if (this.currentOperand === '-' && operation !== 'subtract') return;

        if (this.previousOperand !== '') {
            this.compute();
        }
        
        let opSymbol = '';
        switch (operation) {
            case 'add': opSymbol = '+'; break;
            case 'subtract': opSymbol = '−'; break;
            case 'multiply': opSymbol = '×'; break;
            case 'divide': opSymbol = '÷'; break;
        }

        this.operation = opSymbol;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert("Error: Division by zero");
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }

        // Fix floating point precision issues (e.g. 0.1 + 0.2)
        computation = Math.round(computation * 10000000000) / 10000000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    computePercent() {
        if (this.currentOperand === '' || this.currentOperand === '-') return;
        const current = parseFloat(this.currentOperand);
        this.currentOperand = (current / 100).toString();
    }

    computeSqrt() {
        if (this.currentOperand === '' || this.currentOperand === '-') return;
        const current = parseFloat(this.currentOperand);
        if (current < 0) {
            alert("Error: Square root of negative number is invalid");
            this.clear();
            return;
        }
        let result = Math.sqrt(current);
        result = Math.round(result * 10000000000) / 10000000000;
        this.currentOperand = result.toString();
        this.shouldResetScreen = true;
    }

    getDisplayNumber(number) {
        if (number === '-') return '-';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('.btn-operator');
const actionButtons = document.querySelectorAll('.btn-action');
const equalsButton = document.querySelector('[data-action="equals"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.action);
        calculator.updateDisplay();
    });
});

actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'delete') {
            calculator.delete();
        } else if (action === 'percent') {
            calculator.computePercent();
        } else if (action === 'sqrt') {
            calculator.computeSqrt();
        }
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

// Keyboard support
document.addEventListener('keydown', e => {
    if (e.key >= '0' && e.key <= '9' || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
    if (e.key === '+') {
        calculator.chooseOperation('add');
        calculator.updateDisplay();
    }
    if (e.key === '-') {
        calculator.chooseOperation('subtract');
        calculator.updateDisplay();
    }
    if (e.key === '*' || e.key === 'x') {
        calculator.chooseOperation('multiply');
        calculator.updateDisplay();
    }
    if (e.key === '/') {
        e.preventDefault(); 
        calculator.chooseOperation('divide');
        calculator.updateDisplay();
    }
    if (e.key === '%') {
        calculator.computePercent();
        calculator.updateDisplay();
    }
});
