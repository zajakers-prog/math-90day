import { CURRICULUM_KR } from '../data/curriculumKR.js';
import { CURRICULUM_US } from '../data/curriculumUS.js';
import { REASONING_BANK } from '../data/reasoning.js';
import { generateConceptProblem } from './conceptGenerator.js';

// Mulberry32 PRNG (Fast, deterministic, safe)
export function seededRandom(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export function seedRandom(seed, attempt = 0) {
   const prng = seededRandom(seed + attempt * 17);
   return prng();
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

  // NO grade downgrade - use selected grade directly

  const week = Math.min(Math.ceil(day / 5), 18);
  const curriculum = curriculumMap[gradeKey]?.[week - 1];

  if (!curriculum) return [];
  const baseType = curriculum.type;
  const baseMin = curriculum.range ? curriculum.range[0] : 1;
  const baseMax = curriculum.range ? curriculum.range[1] : 9;

  const seed = getSeedForDay(region, gradeKey, day);
  const dayOfWeek = ((day - 1) % 5) + 1; // 1~5
  const usedQuestions = new Set();

  // Scaffolding: Tier 1 (Warm-up 10), Tier 2 (Core 10), Tier 3 (Application 6)
  for (let i = 0; i < 26; i++) {
    let type = baseType;
    let min = baseMin;
    let max = baseMax;

    if (i < 10) {
      // Tier 1: Warm-up (previous week's topic, easier range)
      const prevWeek = Math.max(1, week - 1);
      const prevCurr = curriculumMap[gradeKey][prevWeek - 1] || curriculumMap[gradeKey][0];
      if (prevCurr) {
        type = prevCurr.type || baseType;
        min = prevCurr.range ? prevCurr.range[0] : 1;
        max = prevCurr.range ? Math.max(min + 1, Math.floor(prevCurr.range[1] * 0.7)) : 9;
      }
    } else if (i < 20) {
      // Tier 2: Core (Current week, unchanged)
    } else {
      // Tier 3: Application (keep same type, increase range)
      max = Math.ceil(baseMax * 1.5) + 2;
    }

    // Intra-Week Progression (Range Adjustments)
    if (dayOfWeek === 1) {
      max = Math.max(min, min + Math.floor((max - min) * 0.6));
    } else if (dayOfWeek === 2) {
      min = Math.min(max, min + Math.floor((max - min) * 0.4));
    } else if (dayOfWeek === 5) {
      max = Math.ceil(max * 1.2);
    }

    let problem = null;
    let attempts = 0;

    while (attempts < 50) {
      // Use dayOfWeek in seed for daily variation within same week
      const s = seed + i * 1000 + attempts * 137 + dayOfWeek * 7;

      // Try conceptGenerator first (handles all concept types)
      problem = generateConceptProblem(type, s, region, min, max, attempts);
      if (problem && !usedQuestions.has(problem.question)) {
        usedQuestions.add(problem.question);
        break;
      }
      if (problem) { attempts++; continue; }

      // Arithmetic fallback (basic operations handled here)
      const a = randInt(i, s, Math.max(2, min), Math.max(2, max));
      let b = randInt(i + 100, s, Math.max(2, min), Math.max(2, max));

      problem = generateArithmeticProblem(type, a, b, i, s, seed, region, min, max);

      // Intra-Week Format Shifting
      if (problem && problem.type === 'basic' && problem.operation && !problem.isTextAnswer) {
        const shiftProb = seedRandom(i, s + 999);
        if (dayOfWeek === 3 && shiftProb > 0.6) {
          problem = convertToEquation(problem, s);
        } else if (dayOfWeek === 4 && shiftProb > 0.5) {
          problem = convertToWordProblem(problem, s, region);
        } else if (dayOfWeek === 5 && shiftProb > 0.6) {
          const mode = randInt(i, s + 777, 1, 2);
          if (mode === 1) problem = convertToEquation(problem, s);
          else problem = convertToWordProblem(problem, s, region);
        }
      }

      if (problem && !usedQuestions.has(problem.question)) {
        usedQuestions.add(problem.question);
        break;
      }
      attempts++;
    }

    if (!problem || attempts >= 50) {
      problem = { type: 'basic', question: `${min + i} + ${max} = ?`, answer: min + i + max, operation: '+' };
    }
    problems.push(problem);
  }

  // Tier 4: Challenge / Olympiad Reasoning (4 questions)
  const bank = REASONING_BANK[region]?.[gradeKey];
  if (bank && bank.length > 0) {
    const rSet = new Set();
    let rAttempts = 0;
    while (problems.length < 30 && rAttempts < 50) {
      const idx = randInt(100 + rAttempts, seed, 0, bank.length - 1);
      if (!rSet.has(idx)) {
        rSet.add(idx);
        problems.push({ ...bank[idx](seed + rAttempts), type: 'reasoning' });
      }
      rAttempts++;
    }
  }

  // Fill to exactly 30
  while (problems.length < 30) {
    problems.push({ type: 'basic', question: `${baseMax + problems.length} + ${baseMin} = ?`, answer: baseMax + problems.length + baseMin, operation: '+' });
  }

  return problems;
}

// ─── Arithmetic Problem Generator ───
function generateArithmeticProblem(type, a, b, i, s, seed, region, min, max) {
  const kr = region === 'KR';

  if (type.includes('frac-div')) {
    const denom = randInt(i, s, 3, 9);
    const answerNum = randInt(i + 1, s, 2, 9);
    const natural = randInt(i + 2, s, 2, 7);
    const startNum = answerNum * natural;
    return { type: 'frac', question: `${startNum}/${denom} ÷ ${natural} = ?/${denom}`, answer: answerNum, isTextAnswer: false, hint: kr ? '분자를 자연수로 나누세요' : 'Divide numerator by whole number' };
  }

  if (type.includes('frac-mul')) {
    const denom = randInt(i, s, 3, 9);
    const num = randInt(i + 1, s, 1, denom - 1);
    const natural = randInt(i + 2, s, 2, 7);
    return { type: 'frac', question: `${num}/${denom} × ${natural} = ?/${denom}`, answer: num * natural, isTextAnswer: false, hint: kr ? '분자와 자연수를 곱하세요' : 'Multiply numerator by whole number' };
  }

  if (type.includes('frac')) {
    const denom = randInt(i, s, 2, 9);
    if (type.includes('add-same') || type.includes('sub-same')) {
      const num1 = randInt(i, s, 1, denom - 1);
      const num2 = randInt(i + 1, s, 1, denom - 1);
      if (type.includes('add')) {
        return { type: 'frac', question: `${num1}/${denom} + ${num2}/${denom} = ?/${denom}`, answer: num1 + num2, operation: '+', hint: kr ? '분자만 더하세요' : 'Add numerators' };
      }
      const big = Math.max(num1, num2); const small = Math.min(num1, num2);
      return { type: 'frac', question: `${big}/${denom} - ${small}/${denom} = ?/${denom}`, answer: big - small, operation: '-', hint: kr ? '분자끼리 빼세요' : 'Subtract numerators' };
    }
    return { type: 'frac', question: `${a}/10 + ${b}/10 = ?/10`, answer: a + b, operation: '+', hint: kr ? '분자끼리 더하세요' : 'Add numerators' };
  }

  if (type.includes('dec-add') || type.includes('dec-sub')) {
    const d1 = (a / 10).toFixed(1); const d2 = (b / 10).toFixed(1);
    if (type.includes('add') || (!type.includes('sub'))) {
      return { type: 'basic', question: `${d1} + ${d2} = ?`, answer: ((a + b) / 10).toFixed(1), operation: '+', isTextAnswer: true, hint: kr ? '소수점도 입력하세요' : 'Include the decimal point' };
    }
    const big = Math.max(a, b); const small = Math.min(a, b);
    return { type: 'basic', question: `${(big / 10).toFixed(1)} - ${(small / 10).toFixed(1)} = ?`, answer: ((big - small) / 10).toFixed(1), operation: '-', isTextAnswer: true, hint: kr ? '소수점도 입력하세요' : 'Include the decimal point' };
  }

  if (type.includes('div') && !type.includes('frac')) {
    const divisor = Math.max(2, Math.min(b, 15));
    const quotient = randInt(i + 200, s, 2, 9);
    const dividend = divisor * quotient;
    const isRem = type.includes('rem');
    if (isRem) {
      const remainder = randInt(i, s, 1, divisor - 1);
      return { type: 'basic', question: `${dividend + remainder} ÷ ${divisor} = ?`, answer: quotient, operation: '÷', hint: kr ? '몫을 입력하세요 (나머지 제외)' : 'Enter quotient only' };
    }
    return { type: 'basic', question: `${dividend} ÷ ${divisor} = ?`, answer: quotient, operation: '÷' };
  }

  if (type.includes('mul') && !type.includes('frac')) {
    return { type: 'basic', question: `${a} × ${b} = ?`, answer: a * b, operation: '×' };
  }

  if (type.includes('kr-ebs-wrong-calc') || type.includes('equation-basic')) {
    const isAdd = seedRandom(i, s) > 0.5;
    const num1 = randInt(i, s, 3, 20);
    const wrongAnswer = randInt(i + 1, s, 21, 50);
    if (isAdd) {
      const x = wrongAnswer + num1;
      return { type: 'word', question: kr ? `어떤 수에서 ${num1}을 더해야 할 것을 빼었더니 ${wrongAnswer}이 되었습니다. 바른 값은?` : `Should have added ${num1} but subtracted. Got ${wrongAnswer}. Correct answer?`, answer: x + num1, isTextAnswer: false, hint: kr ? `어떤 수: ${wrongAnswer}+${num1}` : `The number is ${wrongAnswer}+${num1}` };
    }
    const x = wrongAnswer - num1;
    return { type: 'word', question: kr ? `어떤 수에서 ${num1}을 빼야 할 것을 더했더니 ${wrongAnswer}이 되었습니다. 바른 값은?` : `Should have subtracted ${num1} but added. Got ${wrongAnswer}. Correct answer?`, answer: x - num1, isTextAnswer: false, hint: kr ? `어떤 수: ${wrongAnswer}-${num1}` : `The number is ${wrongAnswer}-${num1}` };
  }

  if (type.includes('kr-olympiad-age')) {
    const diff = randInt(i, s, 20, 35);
    const ratio = randInt(i + 1, s, 2, 4);
    const adjustedDiff = diff - (diff % (ratio - 1));
    const sonAge = adjustedDiff / (ratio - 1);
    const dadAge = sonAge * ratio;
    return { type: 'word', question: kr ? `아버지와 아들 나이 차이 ${adjustedDiff}살, 아버지=아들×${ratio}배. 나이 합은?` : `Father-son age diff: ${adjustedDiff}. Father is ${ratio}× son's age. Sum?`, answer: sonAge + dadAge, isTextAnswer: false, hint: kr ? `아들 나이: ${adjustedDiff}÷${ratio - 1}` : `Son's age: ${adjustedDiff}÷${ratio - 1}` };
  }

  if (type.includes('kr-olympiad-interval')) {
    const distance = randInt(i, s, 3, 15);
    const trees = randInt(i + 1, s, 5, 20);
    const isClosed = seedRandom(i, s) > 0.5;
    if (isClosed) {
      return { type: 'word', question: kr ? `호수 둘레에 ${distance}m 간격으로 나무 ${trees}그루. 둘레=?m` : `Trees planted ${distance}m apart around a lake. ${trees} trees. Perimeter?`, answer: distance * trees, isTextAnswer: false, hint: kr ? '원형: 간격수=나무수' : 'Circle: gaps = trees' };
    }
    return { type: 'word', question: kr ? `직선 도로에 ${distance}m 간격으로 ${trees}그루. 도로 길이=?m` : `${trees} trees, ${distance}m apart on a road. Length?`, answer: distance * (trees - 1), isTextAnswer: false, hint: kr ? '직선: 간격수=나무수-1' : 'Line: gaps = trees - 1' };
  }

  // Basic arithmetic fallback
  if (type.includes('add') && type.includes('sub')) {
    const isAdd = seedRandom(i, s) > 0.5;
    if (isAdd) return { type: 'basic', question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
    const big = Math.max(a, b); const small = Math.min(a, b);
    return { type: 'basic', question: `${big} - ${small} = ?`, answer: big - small, operation: '-' };
  }

  if (type.includes('sub')) {
    const big = Math.max(a, b); const small = Math.min(a, b);
    return { type: 'basic', question: `${big} - ${small} = ?`, answer: big - small, operation: '-' };
  }

  if (type.includes('add')) {
    return { type: 'basic', question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
  }

  // Mixed operation fallback
  const ops = ['+', '-', '×', '÷'];
  const op = ops[randInt(i + 300, s, 0, 3)];
  if (op === '+') return { type: 'basic', question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
  if (op === '-') { const big = Math.max(a, b); const small = Math.min(a, b); return { type: 'basic', question: `${big} - ${small} = ?`, answer: big - small, operation: '-' }; }
  if (op === '×') { const x = a % 15 + 2; const y = b % 15 + 2; return { type: 'basic', question: `${x} × ${y} = ?`, answer: x * y, operation: '×' }; }
  const divisor = (a % 8) + 2; const quotient = (b % 8) + 2;
  return { type: 'basic', question: `${divisor * quotient} ÷ ${divisor} = ?`, answer: quotient, operation: '÷' };
}

// ─── Smart Retry (unchanged logic, improved) ───
export function generateSmartTen(incorrectProblems, grade, region, day) {
  const problems = [];
  const seed = getSeedForDay(region, String(grade), day) + 9999;
  const gradeKey = String(grade);
  const bank = REASONING_BANK[region]?.[gradeKey] || [];
  const usedTypes = new Set();

  if (!incorrectProblems || incorrectProblems.length === 0) {
    let rAttempts = 0;
    while (problems.length < 10 && rAttempts < 50) {
      if (bank.length > 0) {
        const idx = randInt(100 + rAttempts, seed, 0, bank.length - 1);
        if (!usedTypes.has(idx)) {
          usedTypes.add(idx);
          problems.push({ ...bank[idx](seed + rAttempts), type: 'reasoning' });
        }
      } else {
        problems.push({ type: 'basic', question: `${rAttempts + 10} + 99 = ?`, answer: rAttempts + 109, operation: '+' });
      }
      rAttempts++;
    }
    return problems;
  }

  const typeFreq = {};
  incorrectProblems.forEach(p => {
    let t = p.type || 'basic';
    if (t === 'reasoning') t = 'reasoning_bank';
    typeFreq[t] = (typeFreq[t] || 0) + 1;
  });

  const sortedTypes = Object.keys(typeFreq).sort((a, b) => typeFreq[b] - typeFreq[a]);
  const targetTypes = sortedTypes.slice(0, 5);

  let i = 0;
  while (problems.length < 10) {
    for (const tgt of targetTypes) {
      if (problems.length >= 10) break;
      let problem = null;
      if (tgt === 'reasoning_bank' && bank.length > 0) {
        const idx = randInt(500 + problems.length + i, seed, 0, bank.length - 1);
        problem = { ...bank[idx](seed + problems.length + i), type: 'reasoning' };
      } else {
        const sample = incorrectProblems.find(p => p.type === tgt);
        if (sample) {
          let a = randInt(1, seed + problems.length + i, 2, 50);
          let b = randInt(2, seed + problems.length + i, 2, 50);
          if (sample.operation === '+') problem = { type: tgt, question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
          else if (sample.operation === '-') { let big = Math.max(a, b); let small = Math.min(a, b); problem = { type: tgt, question: `${big} - ${small} = ?`, answer: big - small, operation: '-' }; }
          else if (sample.operation === '×') problem = { type: tgt, question: `${a % 15 + 2} × ${b % 15 + 2} = ?`, answer: (a % 15 + 2) * (b % 15 + 2), operation: '×' };
          else if (sample.operation === '÷') problem = { type: tgt, question: `${(b % 8 + 2) * (a % 8 + 2)} ÷ ${a % 8 + 2} = ?`, answer: b % 8 + 2, operation: '÷' };
          else problem = { type: tgt, question: `${a} + ${b} = ?`, answer: a + b, operation: '+' };
        } else {
          problem = { type: 'basic', question: `${i + 10} + 5 = ?`, answer: i + 15, operation: '+' };
        }
      }
      if (!usedTypes.has(problem.question)) {
        usedTypes.add(problem.question);
        problems.push(problem);
      }
    }
    i++;
  }
  return problems;
}

// ─── Format Mutators ───

function convertToEquation(prob, seed) {
  // Extended regex: supports ×, x, *, ÷, /
  const match = prob.question.match(/^(\d+)\s*([+\-×x*÷/])\s*(\d+)\s*=\s*\?$/);
  if (!match) return prob;

  const p1 = parseInt(match[1]);
  const op = match[2].replace('x', '×').replace('*', '×').replace('/', '÷');
  const p2 = parseInt(match[3]);
  const ans = prob.answer;

  const hideFirst = seedRandom(seed, 10) > 0.5;
  if (hideFirst) {
    return { ...prob, question: `□ ${op} ${p2} = ${ans}`, answer: p1, type: 'equation', hint: '□를 구하세요' };
  }
  return { ...prob, question: `${p1} ${op} □ = ${ans}`, answer: p2, type: 'equation', hint: '□를 구하세요' };
}

const WORD_TEMPLATES = {
  KR: {
    '+': [
      "{N1}가 구슬을 {P1}개 가지고 있습니다. {N2}가 {P2}개를 더 주었습니다. 모두 몇 개?",
      "책꽂이에 책이 {P1}권 있습니다. 오늘 {P2}권 새로 샀습니다. 모두 몇 권?"
    ],
    '-': [
      "{N1}가 사과 {P1}개 중 {P2}개를 친구에게 주었습니다. 남은 사과는?",
      "주차장에 차 {P1}대 중 {P2}대가 나갔습니다. 남은 차는?"
    ],
    '×': [
      "한 상자에 과자가 {P1}개씩, {P2}상자면 과자는 모두 몇 개?",
      "하루에 {P1}쪽씩, {P2}일 동안 읽으면 총 몇 쪽?"
    ],
    '÷': [
      "사탕 {P1}개를 {P2}명이 똑같이 나누면 한 사람당 몇 개?",
      "길이 {P1}cm 끈을 {P2}cm씩 자르면 몇 도막?"
    ]
  },
  US: {
    '+': [
      "{N1} has {P1} apples. {N2} gives {P2} more. Total?",
      "There are {P1} books. We add {P2}. How many now?"
    ],
    '-': [
      "{N1} had {P1} toys. Gave away {P2}. How many left?",
      "A store had {P1} items. Sold {P2}. How many remain?"
    ],
    '×': [
      "{P1} boxes with {P2} items each. Total items?",
      "A spider has {P1} legs. {P2} spiders have how many legs?"
    ],
    '÷': [
      "{P1} cookies shared among {P2} friends equally. Each gets?",
      "{P1} pencils in boxes of {P2}. How many boxes?"
    ]
  }
};

const NAMES_KR = ['철수', '영희', '민수', '지수', '민지'];
const NAMES_US = ['Tom', 'Emma', 'Alex', 'Sophia', 'Liam'];

function convertToWordProblem(prob, seed, region) {
  const match = prob.question.match(/^(\d+)\s*([+\-×x*÷/])\s*(\d+)\s*=\s*\?$/);
  if (!match) return prob;

  const p1 = parseInt(match[1]);
  const op = match[2].replace('x', '×').replace('*', '×').replace('/', '÷');
  const p2 = parseInt(match[3]);

  const templates = WORD_TEMPLATES[region]?.[op];
  if (!templates || templates.length === 0) return prob;

  const template = templates[randInt(1, seed, 0, templates.length - 1)];
  const names = region === 'KR' ? NAMES_KR : NAMES_US;
  const n1 = names[randInt(2, seed, 0, names.length - 1)];
  const n2 = names[(randInt(3, seed, 0, names.length - 1) + 1) % names.length];

  const big = Math.max(p1, p2); const small = Math.min(p1, p2);

  let question = template.replace('{N1}', n1).replace('{N2}', n2);
  if (op === '-' || op === '÷') {
    question = question.replace('{P1}', big).replace('{P2}', small);
  } else {
    question = question.replace('{P1}', p1).replace('{P2}', p2);
  }

  return { ...prob, question, type: 'word', isTextAnswer: false, hint: region === 'US' ? 'Read carefully!' : '문장을 잘 읽으세요' };
}
