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
  const originalGradeKey = String(grade);
  let targetGradeKey = originalGradeKey;
  
  // Implement 90-day review concept: downgrade the grade level by 1.
  if (targetGradeKey === '6') targetGradeKey = '5';
  else if (targetGradeKey === '5') targetGradeKey = '4';
  else if (targetGradeKey === '4') targetGradeKey = '3';
  else if (targetGradeKey === '3') targetGradeKey = '2';
  else if (targetGradeKey === '2') targetGradeKey = '1';
  else if (targetGradeKey === '1' && region === 'US') targetGradeKey = 'K';
  
  const gradeKey = targetGradeKey;
  
  // Calculate week from day (1~90) -> (1~18)
  const week = Math.min(Math.ceil(day / 5), 18);
  const curriculum = curriculumMap[gradeKey][week - 1];
  
  if (!curriculum) return [];
  const baseType = curriculum.type;
  const baseMin = curriculum.range ? curriculum.range[0] : 1;
  const baseMax = curriculum.range ? curriculum.range[1] : 9;
  
  const seed = getSeedForDay(region, originalGradeKey, day);
  const usedQuestions = new Set();

  // Scaffolding: Tier 1 (Warm-up), Tier 2 (Core), Tier 3 (Application)
  for (let i = 0; i < 26; i++) {
    let type = baseType;
    let min = baseMin;
    let max = baseMax;
    
    // --- 4-Tier Scaffolding Architecture ---
    if (i < 10) { 
      // Tier 1: Warm-up 
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
      // Tier 3: Application (Increased complexity)
      max = Math.ceil(baseMax * 1.5) + 2;
      if (region === 'KR' && ['basic', 'add', 'sub', 'mul', 'div'].some(t => type.includes(t))) {
         if (i >= 24) type += '-kr-ebs-wrong-calc';
         else type += '-word-mix';
      }
    }
    // ----------------------------------------
    
    // --- Intra-Week Progression (Numeric Range Adjustments) ---
    const dayOfWeek = ((day - 1) % 5) + 1; // 1 to 5
    if (dayOfWeek === 1) { // Introduction
      max = Math.max(min, min + Math.floor((max - min) * 0.6));
    } else if (dayOfWeek === 2) { // Fluency Drill
      min = Math.min(max, min + Math.floor((max - min) * 0.4));
    } else if (dayOfWeek === 5) { // Weekly Test
      max = Math.ceil(max * 1.2);
    }
    
    let problem = null;
    let attempts = 0;
    
    while (attempts < 50) {
      const s = seed + i * 1000 + attempts * 137;
      
      // Check if it's a domain-specific concept (Geometry, Measurement, Data, Pattern, Algebra)
      if (type.includes('geo-') || type.includes('meas-') || type.includes('data-') || type.includes('pattern-') || type.includes('algebra') || type.includes('eq-basic') || type.includes('percent') || type.includes('ratio')) {
         problem = generateConceptProblem(type, s, region, min, max, attempts);
         if (problem && !usedQuestions.has(problem.question)) {
           usedQuestions.add(problem.question);
           break;
         }
         if (problem) { attempts++; continue; }
      }
      
      const a = randInt(i, s, Math.max(2, min), Math.max(2, max));
      let b = randInt(i + 100, s, Math.max(2, min), Math.max(2, max));
      
      problem = { type: 'basic', question: 'Error = ?', answer: 0, operation: '+' };

    // A generic generator matching keywords in `type`
    if (type.includes('word-add') || type.includes('word-sub') || type.includes('word-mix')) {
      const isKR = region === 'KR';
      const names = isKR ? ['철수', '영희', '민수', '지수', '민지'] : ['Tom', 'Jane', 'Sam', 'Lucy', 'Alex'];
      const items = isKR ? ['사과', '사탕', '장난감', '연필'] : ['apples', 'candies', 'toys', 'books'];
      const n1 = names[randInt(i, s, 0, names.length-1)];
      const i1 = items[randInt(i+1, s, 0, items.length-1)];
      const isAdd = type.includes('word-add') || (type.includes('word-mix') && seedRandom(i, s) > 0.5);
      
      let num1 = a;
      let num2 = randInt(i, s, 2, Math.max(2, Math.min(a, 20))); // Keep it simple
      if (isAdd) {
        problem = {
          type: 'word',
          question: isKR 
            ? `${n1}에게 ${i1}가 ${num1}개 있습니다. 친구가 ${num2}개를 더 주었습니다. 모두 몇 개입니까?`
            : `${n1} has ${num1} ${i1}. Gets ${num2} more. Total?`,
          answer: num1 + num2,
          operation: 'word',
          isTextAnswer: false
        };
      } else {
        const big = Math.max(num1, num2);
        const small = Math.min(num1, num2);
        problem = {
          type: 'word',
          question: isKR
            ? `${n1}에게 ${i1}가 ${big}개 있었습니다. 그중 ${small}개를 잃어버렸습니다. 남은 것은 몇 개입니까?`
            : `${n1} had ${big} ${i1}. Lost ${small}. How many left?`,
          answer: big - small,
          operation: 'word',
          isTextAnswer: false
        };
      }
    } else if (type.includes('frac-div')) {
      const denom = randInt(i, s, 3, 9);
      const answerNum = randInt(i+1, s, 2, 9); 
      const natural = randInt(i+2, s, 2, 7); 
      const startNum = answerNum * natural; 
      problem = { type: 'frac', question: `${startNum}/${denom} ÷ ${natural} = ?/${denom}`, answer: answerNum, isTextAnswer: false, hint: `분자를 자연수로 나누세요. (${startNum} ÷ ${natural})` };
    } else if (type.includes('frac-mul')) {
      const denom = randInt(i, s, 3, 9);
      const num = randInt(i+1, s, 1, denom-1);
      const natural = randInt(i+2, s, 2, 7);
      problem = { type: 'frac', question: `${num}/${denom} × ${natural} = ?/${denom}`, answer: num * natural, isTextAnswer: false, hint: `분자와 자연수를 곱하세요.` };
    } else if (type.includes('div') && !type.includes('frac')) {
      // Ensure clean division
      const divisor = Math.max(2, Math.min(b, 15));
      const quotient = randInt(i+200, s, 2, 9);
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
    } else if (type.includes('mul') && !type.includes('frac')) {
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
         problem = { type: 'frac', question: `${a}/10 + ${b}/10 = ?/10`, answer: a + b, operation: '+', hint: '분자끼리 더하세요' }; // safe fallback for unhandled fractions
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
    } // end of massive if-else branch
    
      // --- Intra-Week Progression (Format Shifting) ---
      if (problem && problem.type === 'basic' && problem.question && problem.operation && !problem.isTextAnswer && !problem.question.includes('? /')) {
         const shiftProb = seedRandom(i, s + 999);
         if (dayOfWeek === 3 && shiftProb > 0.6) {
             problem = convertToEquation(problem, s);
         } else if (dayOfWeek === 4 && shiftProb > 0.5) {
             problem = convertToWordProblem(problem, s, region);
         } else if (dayOfWeek === 5 && shiftProb > 0.6) {
             const mode = randInt(i, s+777, 1, 2);
             if (mode === 1) problem = convertToEquation(problem, s);
             else problem = convertToWordProblem(problem, s, region);
         }
      }
      
      if (!usedQuestions.has(problem.question)) {
        usedQuestions.add(problem.question);
        break; // unique problem found
      }
      attempts++;
    } // end of while loop
    
    if (!problem || attempts >= 50) {
       // Emergency fallback if curriculum range is too narrow to provide 27 distinct questions
       problem = { type: 'basic', question: `${min + i} + ${max} = ?`, answer: min + i + max, operation: '+' };
    }
    problems.push(problem);
  }

  // Tier 4: Challenge / Olympiad Reasoning (4 questions strictly at the end)
  const bank = REASONING_BANK[region][gradeKey];
  if (bank && bank.length > 0) {
    const rSet = new Set();
    let rAttempts = 0;
    while(problems.length < 30 && rAttempts < 50) {
      const idx = randInt(100 + rAttempts, seed, 0, bank.length - 1);
      if (!rSet.has(idx)) {
         rSet.add(idx);
         problems.push({ ...bank[idx](seed + rAttempts), type: 'reasoning' });
      }
      rAttempts++;
    }
  }

  // Fallback: fill to exactly 30 if reasoning bank is too small or missing
  while(problems.length < 30) {
    problems.push({ type: 'basic', question: `${baseMax + problems.length} + ${baseMin} = ?`, answer: baseMax + problems.length + baseMin, operation: '+' });
  }

  return problems;
}

// -------------------------------------------------------------------------
// Phase 11: Intelligent Tutoring System - Smart Retry Algorithm
// Generates exactly 10 targeted questions based on the user's weaknesses.
// -------------------------------------------------------------------------
export function generateSmartTen(incorrectProblems, grade, region, day) {
  const problems = [];
  const seed = getSeedForDay(region, String(grade), day) + 9999;
  
  const gradeKey = String(grade);
  const bank = REASONING_BANK[region]?.[gradeKey] || [];
  const usedTypes = new Set();
  
  // Scenario A: Perfect Score! Reward with 10 random reasoning/application problems.
  if (!incorrectProblems || incorrectProblems.length === 0) {
    let rAttempts = 0;
    while(problems.length < 10 && rAttempts < 50) {
      if (bank.length > 0) {
        const idx = randInt(100 + rAttempts, seed, 0, bank.length - 1);
        if (!usedTypes.has(idx)) {
           usedTypes.add(idx);
           problems.push({ ...bank[idx](seed + rAttempts), type: 'reasoning' });
        }
      } else {
        problems.push({ type: 'basic', question: `Challenge ${rAttempts} + 99 = ?`, answer: rAttempts + 99, operation: '+' });
      }
      rAttempts++;
    }
    return problems;
  }

  // Scenario B/C: Calculate weak points frequencies
  const typeFreq = {};
  incorrectProblems.forEach(p => {
     let t = p.type || 'basic';
     if (t === 'reasoning') t = 'reasoning_bank';
     typeFreq[t] = (typeFreq[t] || 0) + 1;
  });

  // Sort weak types by frequency descending
  const sortedTypes = Object.keys(typeFreq).sort((a,b) => typeFreq[b] - typeFreq[a]);
  // Pick Top 5 weak types max
  const targetTypes = sortedTypes.slice(0, 5);
  
  let i = 0;
  // Generate 2 problems per targeted weak type until we hit 10
  while (problems.length < 10) {
     for (const tgt of targetTypes) {
        if (problems.length >= 10) break;
        
        let problem = null;
        if (tgt === 'reasoning_bank' && bank.length > 0) {
           const idx = randInt(500 + problems.length + i, seed, 0, bank.length - 1);
           problem = { ...bank[idx](seed + problems.length + i), type: 'reasoning' };
        } else {
           // Find a sample from the incorrect problems to reuse its scale
           const sample = incorrectProblems.find(p => p.type === tgt);
           if (sample) {
              // Simple mutation logic based on the text question
              let a = randInt(1, seed + problems.length + i, 2, 50);
              let b = randInt(2, seed + problems.length + i, 2, 50);
              
              if (sample.operation === '+') problem = { type: tgt, question: `${a} + ${b} = ?`, answer: a+b, operation: '+' };
              else if (sample.operation === '-') {
                let big = Math.max(a,b); let small = Math.min(a,b);
                problem = { type: tgt, question: `${big} - ${small} = ?`, answer: big-small, operation: '-' };
              }
              else if (sample.operation === '×') problem = { type: tgt, question: `${a%15+2} × ${b%15+2} = ?`, answer: (a%15+2)*(b%15+2), operation: '×' };
              else if (sample.operation === '÷') problem = { type: tgt, question: `${(b%8+2)*(a%8+2)} ÷ ${a%8+2} = ?`, answer: b%8+2, operation: '÷' };
              else problem = { type: tgt, question: `${a} + ${b} = ?`, answer: a+b, operation: '+' };
           } else {
              problem = { type: 'basic', question: `${i+10} + 5 = ?`, answer: i+15, operation: '+' };
           }
        }
        
        // Prevent exact string duplicates in this set
        if (!usedTypes.has(problem.question)) {
           usedTypes.add(problem.question);
           problems.push(problem);
        }
     }
     i++;
  }
  
  return problems;
}

// -------------------------------------------------------------------------
// Intra-Week Format Mutators
// -------------------------------------------------------------------------

function convertToEquation(prob, seed) {
   const match = prob.question.match(/^([0-9]+)\s*([\+\-\×\÷])\s*([0-9]+)\s*=\s*\?$/);
   if (!match) return prob;
   
   const p1 = parseInt(match[1]);
   const op = match[2];
   const p2 = parseInt(match[3]);
   const ans = prob.answer;
   
   const hideFirst = seedRandom(seed, 10) > 0.5;
   if (hideFirst) {
      return { ...prob, question: `□ ${op} ${p2} = ${ans}`, answer: p1, type: 'equation', hint: '식을 만족하는 수를 구하세요' };
   } else {
      return { ...prob, question: `${p1} ${op} □ = ${ans}`, answer: p2, type: 'equation', hint: '식을 만족하는 수를 구하세요' };
   }
}

const WORD_TEMPLATES = {
  KR: {
    '+': [
      "{N1}가 구슬을 {P1}개 가지고 있습니다. {N2}가 {P2}개를 더 주었습니다. 구슬은 모두 몇 개입니까?",
      "책꽂이에 책이 {P1}권 있습니다. 오늘 {P2}권을 새로 샀습니다. 책은 모두 몇 권입니까?"
    ],
    '-': [
      "{N1}가 사과를 {P1}개 가지고 있었습니다. 그 중 {P2}개를 친구에게 주었습니다. 남은 사과는 몇 개입니까?",
      "주차장에 차가 {P1}대 있었습니다. {P2}대가 빠져나갔습니다. 남은 차는 몇 대입니까?"
    ],
    '×': [
       "한 상자에 과자가 {P1}개씩 들어있습니다. 똑같은 상자가 {P2}개 있다면, 과자는 모두 몇 개입니까?",
       "하루에 {P1}쪽씩 책을 읽습니다. {P2}일 동안 읽으면 총 몇 쪽을 읽게 될까요?"
    ],
    '÷': [
       "사탕 {P1}개를 {P2}명에게 똑같이 나누어주려고 합니다. 한 사람당 몇 개씩 받을 수 있나요?",
       "길이가 {P1}cm인 끈을 {P2}cm씩 똑같이 자르려고 합니다. 몇 도막이 될까요?"
    ]
  },
  US: {
    '+': [
      "{N1} has {P1} apples. {N2} gives them {P2} more. How many total?",
      "There are {P1} books on the shelf. We add {P2} more. How many now?"
    ],
    '-': [
      "{N1} picked {P1} flowers, but dropped {P2}. How many are left?",
      "A store had {P1} toys. They sold {P2}. How many toys are left?"
    ],
    '×': [
      "There are {P1} boxes, and each box has {P2} donuts. How many donuts total?",
      "If a spider has {P1} legs, how many legs do {P2} spiders have?"
    ],
    '÷': [
      "{N1} has {P1} cookies to share equally among {P2} friends. How many cookies per friend?",
      "{P1} pencils are packed into boxes of {P2}. How many boxes are needed?"
    ]
  }
};

const NAMES_KR = ['철수', '영희', '민수', '지수', '민지'];
const NAMES_US = ['Tom', 'Emma', 'Alex', 'Sophia', 'Liam'];

function convertToWordProblem(prob, seed, region) {
   const match = prob.question.match(/^([0-9]+)\s*([\+\-\×\÷])\s*([0-9]+)\s*=\s*\?$/);
   if (!match) return prob; 
   
   const p1 = parseInt(match[1]);
   const op = match[2];
   const p2 = parseInt(match[3]);
   
   const templates = WORD_TEMPLATES[region]?.[op];
   if (!templates || templates.length === 0) return prob;
   
   const template = templates[randInt(1, seed, 0, templates.length - 1)];
   const names = region === 'KR' ? NAMES_KR : NAMES_US;
   const n1 = names[randInt(2, seed, 0, names.length - 1)];
   const n2 = names[(randInt(3, seed, 0, names.length - 1) + 1) % names.length];
   
   const big = Math.max(p1, p2);
   const small = Math.min(p1, p2);
   
   let question = template.replace('{N1}', n1).replace('{N2}', n2);
       
   if (op === '-' || op === '÷') {
       question = question.replace('{P1}', big).replace('{P2}', small);
   } else {
       question = question.replace('{P1}', p1).replace('{P2}', p2);
   }

   return { ...prob, question, type: 'word', isTextAnswer: false, hint: region === 'US' ? 'Read carefully!' : '문장제 응용' };
}
