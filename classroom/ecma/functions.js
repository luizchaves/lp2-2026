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

// calling the functions
console.log(sum(2, 1)); // 3
console.log(subtract(2, 1)); // 1
console.log(multiply(2, 1)); // 2
console.log(divide(2, 1)); // 2

// default parameters
function pow(base, exponent = 1) {
  return base ** exponent;
}

console.log(pow(2, 3)); // 8
console.log(pow(2)); // 2

// function with callback
function calc(a, b, operation) {
  return operation(a, b);
}

console.log(calc(2, 1, sum)); // 3
console.log(calc(2, 1, subtract)); // 1
console.log(calc(2, 1, multiply)); // 2
console.log(calc(2, 1, divide)); // 2
console.log(calc(2, 1, (x, y) => x ** y)); // 2

// rest parameters
function sumAll(...numbers) {
  // return numbers.reduce((acc, num) => acc + num, 0);

  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

console.log(sumAll(1, 2, 3)); // 6
console.log(sumAll(4, 5)); // 9
