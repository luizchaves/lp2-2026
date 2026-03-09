// ESM module
import { sum, subtract, multiply, divide } from './lib.js';
import MathUtil from './lib.js';

console.log(MathUtil.sum(2, 1)); // 3
console.log(MathUtil.subtract(2, 1)); // 1
console.log(MathUtil.multiply(2, 1)); // 2
console.log(MathUtil.divide(2, 1)); // 2

console.log(sum(2, 1)); // 3
console.log(subtract(2, 1)); // 1
console.log(multiply(2, 1)); // 2
console.log(divide(2, 1)); // 2
