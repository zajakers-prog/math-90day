import { CURRICULUM_KR } from '../data/curriculumKR.js';
import { CURRICULUM_US } from '../data/curriculumUS.js';
import { REASONING_BANK } from '../data/reasoning.js';

export function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function seedRandom(index, seed) {
  return seededRandom(seed + index * 12345);
}

export function getSeedForDay(region, grade, day) {
  const str = `${region}_${grade}_${day}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function randInt(index, seed, min, max) {
  return Math.floor(seedRandom(index, seed) * (max - min + 1)) + min;
}

export function generateProblems(region, grade, day) {
  const problems = [];
  const curriculumMap = region === 'KR' ? CURRICULUM_KR : CURRICULUM_US;
  const gradeKey = String(grade);
  
  // Calculate week from day (1~90) -> (1~18)
  const week = Math.min(Math.ceil(day / 5), 18);
  const curriculum = curriculumMap[gradeKey][week - 1];
  
  if (!curriculum) return [];
  const { type, range } = curriculum;
  
  const min = range ? range[0] : 1;
  const max = range ? range[1] : 9;
  
  const seed = getSeedForDay(region, gradeKey, day);

  for (let i = 0; i < 27; i++) {
    const s = seed + i;
    const a = randInt(i, s, min, max);
    let b = randInt(i + 100, s, min, max);
    
    let problem = { type: 'basic', question: 'Error = ?', answer: 0, operation: '+' };

    // A generic generator matching keywords in `type`
    if (type.includes('word-add') || type.includes('word-sub') || type.includes('word-mix')) {
      // Very simple english word problems for US
      const names = ['Tom', 'Jane', 'Sam', 'Lucy', 'Alex'];
      const items = ['apples', 'candies', 'toys', 'books'];
      const n1 = names[randInt(i, s, 0, names.length-1)];
      const i1 = items[randInt(i+1, s, 0, items.length-1)];
      const isAdd = type.includes('word-add') || (type.includes('word-mix') && seedRandom(i, s) > 0.5);
      
      let num1 = a;
      let num2 = randInt(i, s, 1, Math.min(a, 20)); // Keep it simple
      if (isAdd) {
        problem = {
          type: 'word',
          question: `${n1} has ${num1} ${i1}. Gets ${num2} more. Total?`,
          answer: num1 + num2,
          operation: 'word',
          isTextAnswer: false
        };
      } else {
        const big = Math.max(num1, num2);
        const small = Math.min(num1, num2);
        problem = {
          type: 'word',
          question: `${n1} had ${big} ${i1}. Lost ${small}. How many left?`,
          answer: big - small,
          operation: 'word',
          isTextAnswer: false
        };
      }
    } else if (type.includes('div')) {
      // Ensure clean division
      const divisor = Math.max(2, Math.min(b, 15));
      const quotient = Math.max(2, Math.min(Math.floor(a/divisor), 20));
      const dividend = divisor * quotient;
      const isRem = type.includes('rem');
      
      if (isRem) {
        const remainder = randInt(i, s, 1, divisor - 1);
        problem = {
          type: 'basic',
          question: `${dividend + remainder} ÷ ${divisor} = ?`,
          answer: quotient,
          operation: '÷',
          hint: '몫을 입력하세요. (나머지는 제외)'
        };
      } else {
        problem = {
          type: 'basic',
          question: `${dividend} ÷ ${divisor} = ?`,
          answer: quotient,
          operation: '÷'
        };
      }
    } else if (type.includes('mul')) {
      problem = { type: 'basic', question: `${a} × ${b} = ?`, answer: a * b, operation: '×' };
    } else if (type.includes('frac')) {
      // Basic fractions: output as strings
      const denom = randInt(i, s, 2, 9);
      if (type.includes('add-same') || type.includes('sub-same')) {
        const num1 = randInt(i, s, 1, denom - 1);
        const num2 = randInt(i+1, s, 1, denom - 1);
        if (type.includes('add')) {
          problem = { type: 'frac', question: `${num1}/${denom} + ${num2}/${denom} = ?/${denom}`, answer: num1 + num2, operation: '+', hint: '분자만 더하세요' };
        } else {
          const big = Math.max(num1, num2);
          const small = Math.min(num1, num2);
          problem = { type: 'frac', question: `${big}/${denom} - ${small}/${denom} = ?/${denom}`, answer: big - small, operation: '-', hint: '분자끼리 빼세요' };
        }
      } else {
         problem = { type: 'basic', question: `${a} × ${b} = ?`, answer: a * b, operation: '×' }; // fallback
      }
    } else if (type.includes('dec-add') || type.includes('dec-sub')) {
      const d1 = (a / 10).toFixed(1);
      const d2 = (b / 10).toFixed(1);
      if (type.includes('add')) {
        problem = { type: 'basic', question: `${d1} + ${d2} = ?`, answer: ((a+b)/10).toFixed(1), operation: '+', isTextAnswer: true, hint: '소수점도 입력하세요' };
      } else {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        problem = { type: 'basic', question: `${(big/10).toFixed(1)} - ${(small/10).toFixed(1)} = ?`, answer: ((big-small)/10).toFixed(1), operation: '-', isTextAnswer: true, hint: '소수점도 입력하세요' };
      }
    } else if (type.includes('kr-ebs-wrong-calc')) {
      // EBS "어떤 수" 유형 (잘못 계산한 식)
      const isAdd = seedRandom(i, s) > 0.5;
      const num1 = randInt(i, s, 3, 20);
      const wrongAnswer = randInt(i+1, s, 21, 50);
      if (isAdd) {
        // 원래 X + num1 인데, 잘못해서 X - num1 = wrongAnswer가 됨.
        // X = wrongAnswer + num1
        // 바른 계산 = X + num1
        const x = wrongAnswer + num1;
        const correctAnswer = x + num1;
        problem = { type: 'word', question: `[EBS 응용] 어떤 수에서 ${num1}을 더해야 할 것을 잘못하여 빼었더니 ${wrongAnswer}이 되었습니다. 바르게 계산한 값은 얼마입니까?`, answer: correctAnswer, isTextAnswer: false, hint: `어떤 수는 ${wrongAnswer} + ${num1} 입니다.` };
      } else {
        // 원래 X - num1 인데, 잘못해서 X + num1 = wrongAnswer가 됨.
        // X = wrongAnswer - num1
        const x = wrongAnswer - num1;
        const correctAnswer = x - num1;
        problem = { type: 'word', question: `[EBS 응용] 어떤 수에서 ${num1}을 빼야 할 것을 잘못하여 거꾸로 더했더니 ${wrongAnswer}이 되었습니다. 바르게 계산한 값은 얼마입니까?`, answer: correctAnswer, isTextAnswer: false, hint: `어떤 수는 ${wrongAnswer} - ${num1} 입니다.` };
      }
    } else if (type.includes('kr-olympiad-age')) {
       // 올림피아드 나이 차이 문제
       const diff = randInt(i, s, 20, 35);
       const ratio = randInt(i+1, s, 2, 4);
       // 아버지 x, 아들 y -> x - y = diff, x = ratio * y
       // ratio*y - y = diff => y(ratio-1) = diff
       // y = diff / (ratio-1)
       // Make sure diff is divisible by (ratio-1)
       const adjustedDiff = diff - (diff % (ratio - 1));
       const sonAge = adjustedDiff / (ratio - 1);
       const dadAge = sonAge * ratio;
       const sumAge = sonAge + dadAge;
       
       problem = { type: 'word', question: `[경시 기출] 아버지와 아들의 나이 차이는 ${adjustedDiff}살 입니다. 아버지의 나이가 아들 나이의 ${ratio}배일 때, 두 사람의 나이의 합은 얼마입니까?`, answer: sumAge, isTextAnswer: false, hint: `아들의 나이는 ${adjustedDiff} ÷ ${ratio - 1} 입니다.` };
    } else if (type.includes('kr-olympiad-interval')) {
       // 올림피아드 식수 간격 문제
       const distance = randInt(i, s, 3, 15);
       const trees = randInt(i+1, s, 5, 20);
       const isClosed = seedRandom(i, s) > 0.5; // 호수 둘레 vs 직선 도로
       
       if (isClosed) {
         problem = { type: 'word', question: `[경시 기출] 호수 둘레에 ${distance}m 간격으로 나무를 ${trees}그루 심었습니다. 호수의 전체 둘레 길이는 몇 m 입니까?`, answer: distance * trees, isTextAnswer: false, hint: `원형으로 심을 때는 (간격 수) = (나무 수) 입니다.` };
       } else {
         problem = { type: 'word', question: `[경시 기출] 직선 도로 한쪽에 처음부터 끝까지 ${distance}m 간격으로 가로수를 ${trees}그루 심었습니다. 도로의 전체 길이는 몇 m 입니까?`, answer: distance * (trees - 1), isTextAnswer: false, hint: `직선 도로에서는 (간격 수) = (나무 수) - 1 입니다.` };
       }
    } else if (type.includes('add') && type.includes('sub')) { // mixed
      const isAdd = seedRandom(i, s) > 0.5;
      if (isAdd) {
        problem = { type: 'basic', question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
      } else {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        problem = { type: 'basic', question: `${big} - ${small} = ?`, answer: big - small, operation: '-' };
      }
    } else if (type.includes('sub')) {
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      problem = { type: 'basic', question: `${big} - ${small} = ?`, answer: big - small, operation: '-' };
    } else if (type.includes('add')) {
       problem = { type: 'basic', question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
    } else {
      // Fallback mixed Random
      const ops = ['+', '-', '×', '÷'];
      const op = ops[randInt(i+300, s, 0, 3)];
      if (op === '+') {
         problem = { type: 'basic', question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
      } else if (op === '-') {
         const big = Math.max(a, b);
         const small = Math.min(a, b);
         problem = { type: 'basic', question: `${big} - ${small} = ?`, answer: big - small, operation: '-' };
      } else if (op === '×') {
         const x = a % 15 + 2; const y = b % 15 + 2;
         problem = { type: 'basic', question: `${x} × ${y} = ?`, answer: x * y, operation: '×' };
      } else {
         const divisor = (a % 8) + 2;
         const quotient = (b % 8) + 2;
         problem = { type: 'basic', question: `${divisor*quotient} ÷ ${divisor} = ?`, answer: quotient, operation: '÷' };
      }
    }

    problems.push(problem);
  }

  // Insert Reasoning questions
  const bank = REASONING_BANK[region][gradeKey];
  if (bank && bank.length >= 3) {
    const r1 = bank[randInt(1, seed, 0, bank.length-1)];
    const r2 = bank[randInt(2, seed, 0, bank.length-1)];
    const r3 = bank[randInt(3, seed, 0, bank.length-1)];
    problems.splice(29, 0, { ...r3, type: 'reasoning' });
    problems.splice(19, 0, { ...r2, type: 'reasoning' });
    problems.splice(9, 0, { ...r1, type: 'reasoning' });
  }

  return problems;
}
