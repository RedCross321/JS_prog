const display = document.getElementById('result')

let currentValue = '0'
let previousValue = null
let operator = null
let waitingForNewValue = false
let memory = parseFloat(localStorage.getItem('calculatorMemory')) || 0;

document.querySelector('.buttons').addEventListener('click', function(event) {
  const button = event.target.closest('.round-button')
  if (!button) return

  if (button.classList.contains('number')) {
    const span = button.querySelector('.button-text')
    if (span) {
      inputDigit(span.textContent.trim())
    }
    return
  }

  if (button.dataset.special) {
    handleSpecial(button.dataset.special)
    return
  }

  const span = button.querySelector('.button-text')
  if (span) {
    const text = span.textContent.trim()
    handleMemoryAndClear(text)
  }
});

function inputDigit(value) {
  if (value === ',') {
    if (!currentValue.includes('.')) {
      currentValue += '.'
    }
    waitingForNewValue = false
  } else {
    if (waitingForNewValue) {
      currentValue = value
      waitingForNewValue = false
    } else {
      currentValue = currentValue === '0' ? value : currentValue + value
    }
  }
  updateDisplay()
}

function handleSpecial(action) {
  switch (action) {
    case 'plus':
    case 'minus':
    case 'mult':
    case 'percent':
    case 'del':
      handleOperator(action)
      break
    case 'equal':
      calculate()
      break
    case 'comma':
      inputDigit(',')
      break
  }
}

function handleOperator(nextOperator) {
  const inputValue = parseFloat(currentValue)

  if (previousValue === null) {
    previousValue = inputValue
  } else if (operator) {

    const result = performCalculation(previousValue, inputValue, operator)
    currentValue = String(result)
    previousValue = result
    updateDisplay()
  }

  waitingForNewValue = true
  operator = nextOperator
}

function performCalculation(a, b, op) {
  switch (op) {
    case 'plus': return a + b
    case 'minus': return a - b
    case 'mult': return a * b
    case 'percent': return a * (b / 100)
    case 'del': return a / b
    default: return b
  }
}

function calculate() {
  if (operator && previousValue !== null) {
    const inputValue = parseFloat(currentValue)
    const result = performCalculation(previousValue, inputValue, operator)
    currentValue = String(result)
    previousValue = null
    operator = null
    waitingForNewValue = true
    updateDisplay()
  }
}

function handleMemoryAndClear(text) {
  const currentValueNum = parseFloat(currentValue)

  switch (text) {
    case 'AC':
      currentValue = '0'
      previousValue = null
      operator = null
      waitingForNewValue = false
      break

    case 'MS':
      memory = currentValueNum
      localStorage.setItem('calculatorMemory', memory)
      waitingForNewValue = true
      break

    case 'MC':
      memory = 0
      localStorage.removeItem('calculatorMemory')
      break

    case 'MR':
      currentValue = String(memory)
      waitingForNewValue = true
      break

    case 'M+':
      memory += currentValueNum
      localStorage.setItem('calculatorMemory', memory)
      waitingForNewValue = true
      break

    case 'M-':
      memory -= currentValueNum
      localStorage.setItem('calculatorMemory', memory)
      waitingForNewValue = true
      break
  }
  updateDisplay();
}

function updateDisplay() {
  display.textContent = currentValue.replace('.', ',')
}