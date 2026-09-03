/**
 * generator.js — Generative Math Question Algorithm
 * Generates dynamic questions based on level, operation, and adaptive weights.
 */

import { getAdaptiveWeight, weightedRandomSelect } from './trainer.js';

const AVAILABLE_OPERATIONS = ['+', '−', '×', '÷'];

/**
 * Generates a random integer within [min, max] inclusive.
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Formats numbers nicely for display.
 */
function formatNumber(num) {
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(2);
}

/**
 * Generates a math question.
 * @param {string} level 'easy' | 'normal' | 'hard' | 'nightmare'
 * @param {string} selectedOp 'acak' | '+' | '−' | '×' | '÷' | 'campur'
 * @param {Array} history User history from IndexedDB
 * @returns {Object} { question: string, answer: number, level: string, operation: string }
 */
export function generateQuestion(level = 'normal', selectedOp = 'acak', history = []) {
  // Determine Operation Type
  let activeOp = selectedOp;

  if (selectedOp === 'acak') {
    // Select an operation weighted adaptively based on history
    const opCandidates = AVAILABLE_OPERATIONS.map(op => ({
      op,
      weight: getAdaptiveWeight(`${level}_${op}`, history)
    }));
    activeOp = weightedRandomSelect(opCandidates, item => item.weight).op;
  } else if (selectedOp === 'campur') {
    // 25% equal probability for each basic operation
    activeOp = AVAILABLE_OPERATIONS[getRandomInt(0, AVAILABLE_OPERATIONS.length - 1)];
  }

  // Level configuration parameters
  let minNum = 1;
  let maxNum = 10;
  let operandCount = 2;
  let allowNegative = false;
  let allowDecimal = false;

  switch (level) {
    case 'easy':
      minNum = 1;
      maxNum = 10;
      operandCount = 2;
      break;
    case 'normal':
      minNum = 1;
      maxNum = 50;
      operandCount = Math.random() < 0.3 ? 3 : 2;
      break;
    case 'hard':
      minNum = 1;
      maxNum = 100;
      operandCount = 3;
      allowNegative = true;
      break;
    case 'nightmare':
      minNum = 1;
      maxNum = 500;
      operandCount = Math.random() < 0.5 ? 4 : 3;
      allowNegative = true;
      allowDecimal = true;
      break;
    default:
      minNum = 1;
      maxNum = 50;
      operandCount = 2;
  }

  // Generate Operands and Question Expression
  let operands = [];
  for (let i = 0; i < operandCount; i++) {
    let val = getRandomInt(minNum, maxNum);
    if (allowNegative && Math.random() < 0.3) {
      val = -val;
    }
    operands.push(val);
  }

  // Special handling for Division to keep it clean and solvable
  if (activeOp === '÷') {
    if (level === 'easy') {
      const b = getRandomInt(1, 10);
      const ans = getRandomInt(1, 10);
      const a = b * ans;
      return {
        question: `${a} ÷ ${b}`,
        answer: ans,
        level,
        operation: activeOp
      };
    } else if (level === 'normal') {
      const b = getRandomInt(1, 12);
      const ans = getRandomInt(1, 20);
      const a = b * ans;
      return {
        question: `${a} ÷ ${b}`,
        answer: ans,
        level,
        operation: activeOp
      };
    } else if (level === 'hard') {
      const b = getRandomInt(2, 25);
      let ans = getRandomInt(1, 30);
      if (allowNegative && Math.random() < 0.3) ans = -ans;
      const a = b * ans;
      return {
        question: `${a} ÷ ${b}`,
        answer: ans,
        level,
        operation: activeOp
      };
    } else { // nightmare division
      let b = getRandomInt(2, 50);
      let a = getRandomInt(1, 200);
      if (allowNegative && Math.random() < 0.3) a = -a;
      let ans = parseFloat((a / b).toFixed(2));
      return {
        question: `${a} ÷ ${b}`,
        answer: ans,
        level,
        operation: activeOp
      };
    }
  }

  // Handle Multi-operand or Basic Multiplication/Addition/Subtraction
  let questionStr = '';
  let answerVal = 0;

  if (activeOp === '+') {
    answerVal = operands.reduce((sum, n) => sum + n, 0);
    questionStr = operands.map(n => n < 0 ? `(${n})` : n).join(' + ');
  } else if (activeOp === '−') {
    answerVal = operands.reduce((acc, n, idx) => idx === 0 ? n : acc - n, 0);
    questionStr = operands.map(n => n < 0 ? `(${n})` : n).join(' − ');
  } else if (activeOp === '×') {
    if (level === 'easy') {
      operands = [getRandomInt(1, 10), getRandomInt(1, 10)];
    } else if (level === 'normal') {
      operands = [getRandomInt(2, 15), getRandomInt(2, 15)];
    } else if (level === 'hard') {
      operands = [getRandomInt(2, 25), getRandomInt(2, 25)];
      if (allowNegative && Math.random() < 0.3) operands[0] = -operands[0];
    } else {
      operands = [getRandomInt(5, 50), getRandomInt(5, 50)];
      if (allowNegative && Math.random() < 0.3) operands[0] = -operands[0];
    }
    answerVal = operands.reduce((acc, n) => acc * n, 1);
    questionStr = operands.map(n => n < 0 ? `(${n})` : n).join(' × ');
  }

  if (allowDecimal && level === 'nightmare' && Math.random() < 0.3) {
    answerVal = parseFloat(answerVal.toFixed(2));
  }

  return {
    question: questionStr,
    answer: answerVal,
    level,
    operation: activeOp
  };
}
