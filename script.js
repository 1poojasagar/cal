let input = document.getElementById('display-input');

// Add value to the display
function addToDisplay(value) {
  let lastChar = input.value.slice(-1);

  // if (input.value === 'Infinite' && !isNaN(value)) {
  //   return;
  // }

  // // Check if operator comes after the result is "Infinity"
  // if (input.value === 'Infinite' && (value === '+' || value === '-' || value === '*' || value === '/' || value === '.')) 
  // {
  //   return;
  // }

  // Check if only subtraction sign is allowed at the beginning
  if (value === '-' && input.value === '') {
    input.value += '-';

    return;
  }

  // // Check if decimal comes more than once in a number
  // if (value === '.' && input.value.slice(-2) === '..') {
  //   return;
  // }

  // Check if decimal comes in the beginning of the expression
  if (value === '.' && (input.value === '' )) {
    input.value += '0';
  }

  // Check if decimal comes before any operator
  if ((value === '+' || value === '-' || value === '*' || value === '/') && lastChar === '.') {
    return;
  }

  // Check if decimal comes after an operator or a closing parenthesis
  if (value === '.' && (lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/')) {
    input.value += '0.';
  }

  // Check if operator comes between operands
  if ((value === '+' || value === '-' || value === '*' || value === '/') && (lastChar !== '' && lastChar !== '+' && lastChar !== '-' && lastChar !== '*' && lastChar !== '/')) {
    input.value += value;
  }
  else if (value !== '+' && value !== '-' && value !== '*' && value !== '/') {
    if (lastChar === '0' && input.value.length === 1) {
      // Remove the leading zero if the previous input was zero
      input.value = input.value.slice(0, -1);
    }

    if (input.value === 'NaN') {
      // Remove NaN and display the number
      input.value = value;
    } else {
      if (value === '.') {
        // Check if decimal point is already present in the current number
        let lastNumber = input.value.split(/[+\-*/()]/).pop();
        if (lastNumber.includes('.')) {
          return;
        }
      }
      input.value += value;
    }
  }
}

// Clear the display
function clearDisplay() {
  input.value = '';
}

// Remove the last character from the display
// function removeLast() {
//   input.value = input.value.slice(0, -1);
// }

// Calculate the result of the expression
function calculate() {
  let equation = input.value;

  // Check for division by zero
  if (equation.includes('/0')) {
    input.value = 'Infinite';
    return;
  }

  // Check if an operator comes in the beginning
  if (equation[0] === '+' || equation[0] === '*' || equation[0] === '/') {
    input.value = '';
    return;
  }

  let result = evaluateExpression(equation);

  // Check for decimal points after any operator
  if (result % 1 !== 0) {
    input.value = result.toFixed(2);//Fixed() converts a number to a string, rounded to a specified number of decimal
  } else {
    input.value = result;
  }
}


// Evaluate the expression
function evaluateExpression(expression) {
  let operators = [];
  let operands = [];

  let num = '';
  let isNegative = false; // Flag to track negative numbers

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === '+' || char === '-' || char === '*' || char === '/') {
      if (num === '') {
        if (char === '-') {
          isNegative = true; // Set the flag for negative number
        }
        continue;
      }

      // Convert the number to a float and handle negative numbers
      const number = isNegative ? -parseFloat(num) : parseFloat(num);
      operands.push(number);

      num = '';
      isNegative = false;

      while (
        operators.length > 0 &&
        precedence[operators[operators.length - 1]] >= precedence[char]
      ) {
        applyOperator(operators.pop(), operands);
      }
      operators.push(char);
    } else {
      num += char;
    }
  }

  // Handle the last number in the expression
  if (num !== '') {
    const number = isNegative ? -parseFloat(num) : parseFloat(num);
    operands.push(number);
  }

  while (operators.length > 0) {
    applyOperator(operators.pop(), operands);
  }

  return operands[0];
}

// Apply the operator to the operands
function applyOperator(operator, operands) {
  const b = operands.pop();
  const a = operands.pop();

  switch (operator) {
    case '+':
      operands.push(a + b);
      break;
    case '-':
      operands.push(a - b);
      break;
    case '*':
      operands.push(a * b);
      break;
    case '/':
      operands.push(a / b);
      break;
  }
}

// Operator precedence
const precedence = {
  '+': 1,
  '-': 1,
  '*': 2,
  '/': 2,
};