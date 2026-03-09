// function declaration
function sum(a, b) {
  return a + b;
}

// function expression, anonymous function
const subtract = function (a, b) {
  return a - b;
}

// arrow function
const multiply = (a, b) => {
  return a * b;
}

// arrow function with implicit return
const divide = (a, b) => a / b;

module.exports = {
  sum,
  subtract,
  multiply,
  divide
};
