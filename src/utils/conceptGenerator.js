import { seedRandom } from './problemGenerator.js';

// Helper for random int independent of index
function rInt(seed, min, max) {
  return Math.floor(seedRandom(seed) * (max - min + 1)) + min;
}

export function generateConceptProblem(type, seed, region, min, max, attempt) {
  const s = seed + attempt * 29;
  
  // ------------------------------------
  // GEOMETRY (도형)
  // ------------------------------------
  if (type.includes('geo-angle')) {
    const isLine = rInt(s, 1, 2) === 1;
    if (isLine) {
        const given = rInt(s + 1, 30, 150);
        const qKR = `일직선은 180도입니다. 한 각이 ${given}도일 때, 나머지 한 각은 몇 도인가요?`;
        const qUS = `A straight line is 180 degrees. If one angle is ${given} degrees, what is the other angle?`;
        return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: 180 - given, isTextAnswer: false, hint: region === 'KR' ? '180도에서 빼세요' : 'Subtract from 180' };
    } else {
        const a1 = rInt(s + 1, 30, 90);
        const a2 = rInt(s + 2, 30, 90);
        const qKR = `삼각형 세 내각의 합은 180도입니다. 두 각이 ${a1}도, ${a2}도일 때, 나머지 한 각은?`;
        const qUS = `A triangle has 180 degrees. If two angles are ${a1} and ${a2}, what is the third angle?`;
        return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: 180 - a1 - a2, isTextAnswer: false, hint: region === 'KR' ? '180도에서 두 각을 빼세요' : 'Subtract two angles from 180' };
    }
  }
  
  if (type.includes('geo-peri') || type.includes('meas-peri')) {
     const w = rInt(s, 3, 20);
     const h = rInt(s + 1, 3, 20);
     const qKR = `가로가 ${w}cm, 세로가 ${h}cm인 직사각형의 둘레의 길이는 몇 cm인가요?`;
     const qUS = `A rectangle is ${w}cm wide and ${h}cm long. What is the perimeter?`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: (w + h) * 2, isTextAnswer: false, hint: region === 'KR' ? '(가로+세로)*2' : '(W+L)*2' };
  }
  
  if (type.includes('meas-area')) {
     const isTri = rInt(s, 1, 2) === 1;
     const w = rInt(s, 4, 20) * 2; // Ensures even number for division
     const h = rInt(s + 1, 4, 20);
     if (isTri) {
       const qKR = `밑변이 ${w}cm, 높이가 ${h}cm인 삼각형의 넓이는 몇 cm²인가요?`;
       const qUS = `A triangle has base ${w}cm and height ${h}cm. What is the area?`;
       return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: (w * h) / 2, isTextAnswer: false, hint: region === 'KR' ? '(밑변*높이)/2' : '(B*H)/2' };
     } else {
       const qKR = `가로가 ${w}cm, 세로가 ${h}cm인 직사각형의 넓이는 몇 cm²인가요?`;
       const qUS = `A rectangle has width ${w}cm and length ${h}cm. What is the area?`;
       return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: w * h, isTextAnswer: false, hint: region === 'KR' ? '가로*세로' : 'W * L' };
     }
  }
  
  if (type.includes('meas-time')) {
     const h1 = rInt(s, 1, 5);
     const m1 = rInt(s+1, 10, 50);
     const h2 = rInt(s+2, 1, 3);
     const m2 = rInt(s+3, 10, 50);
     
     let minSum = m1 + m2;
     let hrSum = h1 + h2;
     if (minSum >= 60) { minSum -= 60; hrSum += 1; }
     
     const qKR = `지금은 ${h1}시 ${m1}분입니다. ${h2}시간 ${m2}분 뒤는 몇 시 몇 분일까요? (시와 분을 붙여서 4자리 이하 숫자로 적으세요. 예: 4시 5분 -> 405)`;
     const qUS = `It is ${h1}:${m1}. What time will it be in ${h2} hours and ${m2} minutes? (Write as numbers without colon, e.g., 405)`;
     const fmtHr = hrSum > 12 ? hrSum - 12 : hrSum;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: parseInt(`${fmtHr}${minSum.toString().padStart(2, '0')}`), isTextAnswer: false };
  }
  
  if (type.includes('geo-vol') || type.includes('meas-vol')) {
     const w = rInt(s, 2, 10);
     const l = rInt(s+1, 2, 10);
     const h = rInt(s+2, 2, 10);
     const qKR = `가로 ${w}cm, 세로 ${l}cm, 높이 ${h}cm인 직육면체의 부피는 몇 cm³ 입니까?`;
     const qUS = `A cuboid is ${w}cm wide, ${l}cm long, and ${h}cm high. What is its volume?`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: w * l * h, isTextAnswer: false, hint: region === 'KR' ? '가로*세로*높이' : 'W * L * H' };
  }
  
  if (type.includes('data-avg') || type.includes('data')) {
     const n1 = rInt(s, 10, 50);
     const n2 = rInt(s+1, 10, 50);
     const n3 = rInt(s+2, 10, 50);
     const n4 = rInt(s+3, 10, 50);
     const sum = n1 + n2 + n3 + n4;
     const avg = sum / 4;
     
     const rem = sum % 4;
     const adj4 = n4 + (4 - rem); // Ensure perfect division
     const newSum = n1 + n2 + n3 + adj4;
     
     const qKR = `국어 ${n1}점, 수학 ${n2}점, 영어 ${n3}점, 과학 ${adj4}점의 평균은 몇 점인가요?`;
     const qUS = `Math: ${n1}, Eng: ${n2}, Sci: ${n3}, His: ${adj4}. What is the average score?`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: newSum / 4, isTextAnswer: false, hint: '모두 더해서 4로 나누세요' };
  }
  
  if (type.includes('meas-circle')) {
     const r = rInt(s, 2, 10);
     const qKR = `반지름이 ${r}cm인 원의 넓이는 대략 몇 cm² 입니까? (원주율은 3으로 계산)`;
     const qUS = `What is the area of a circle with radius ${r}? (Use pi = 3)`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: r * r * 3, isTextAnswer: false, hint: region === 'KR' ? '반지름 * 반지름 * 3' : 'r * r * 3' };
  }
  
  if (type.includes('pattern')) {
     const diff = rInt(s, 2, 15);
     const start = rInt(s+1, 5, 50);
     const qKR = `다음 규칙에서 빈칸에 알맞은 수는? [ ${start}, ${start+diff}, ${start+diff*2}, ${start+diff*3}, ___ ]`;
     const qUS = `What is next in the pattern? [ ${start}, ${start+diff}, ${start+diff*2}, ${start+diff*3}, ___ ]`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: start+diff*4, isTextAnswer: false, hint: region === 'KR' ? '일정한 수를 더하고 있습니다' : 'Adding a constant number' };
  }
  
  if (type.includes('percent') || type.includes('ratio')) {
     const total = rInt(s, 2, 10) * 100; // 200 to 1000
     const pct = rInt(s+1, 1, 9) * 10; // 10% to 90%
     const qKR = `${total}원의 ${pct}%는 얼마입니까?`;
     const qUS = `What is ${pct}% of ${total}?`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: (total * pct) / 100, isTextAnswer: false, hint: region === 'KR' ? '비율을 곱하세요' : 'Multiply the ratio' };
  }
  
  if (type.includes('algebra') || type.includes('eq-basic-x')) {
     const a = rInt(s, 2, 12);
     const b = rInt(s+1, 10, 50);
     const x = rInt(s+2, 2, 10);
     const c = a * x + b;
     const qKR = `방정식 ${a}x + ${b} = ${c} 에서 미지수 x의 값은?`;
     const qUS = `Solve for x: ${a}x + ${b} = ${c}`;
     return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: x, isTextAnswer: false, hint: region === 'KR' ? '먼저 상수를 넘기고 나누세요' : 'Move the constant, then divide' };
  }

  // Fallback for weakly matched geo/meas combinations
  if (type.includes('geo-') || type.includes('meas-')) {
      const a = rInt(s, 5, 20);
      const b = rInt(s+1, 5, 20);
      const qKR = `가로 ${a}cm, 세로 ${b}cm인 직사각형의 넓이는?`;
      const qUS = `A rectangle has width ${a} and height ${b}. What is the area?`;
      return { type: 'word', question: region === 'KR' ? qKR : qUS, answer: a * b, isTextAnswer: false, hint: '가로 * 세로' };
  }
  
  return null;
}
