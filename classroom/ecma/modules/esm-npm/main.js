import MathUtil, { sum, subtract } from './lib.js';
import { sqrt } from 'mathjs';

console.log(MathUtil.sum(2, 1)); // 3
console.log(sum(2, 1)); // 3
console.log(MathUtil.subtract(2, 1)); // 1
console.log(subtract(2, 1)); // 1
console.log(MathUtil.multiply(2, 1)); // 2
console.log(MathUtil.divide(2, 1)); // 2
console.log(sqrt(4)); // 2
console.log(Math.sqrt(4)); // 2
console.log(Math.pow(4, 1 / 2)); // 2
console.log(4 ** 1 / 2); // 2
