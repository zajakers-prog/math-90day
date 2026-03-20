import { seededRandom } from '../utils/problemGenerator.js';

function randInt(seed, min, max) {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

export const REASONING_BANK = {
  KR: {
    '1': [
      (s) => { const st = randInt(s, 1, 5); const sp = randInt(s+1, 1, 3); return { question: `[EBS 기초] ${st}, ${st+sp}, ${st+sp*2}, ${st+sp*3}, __는 무엇인가요?`, answer: st+sp*4, hint: `${sp}씩 커집니다!` }; },
      (s) => { const a = randInt(s, 2, 8); const ans = randInt(s+1, a+1, 15); return { question: `[교과서 응용] 네모 안에 알맞은 수는? ${a} + □ = ${ans}`, answer: ans-a, hint: `${ans}에서 ${a}를 빼보세요!` }; },
      (s) => { const t = randInt(s, 10, 15); const sub = randInt(s+1, 2, 5); return { question: `[창의수학] ${t} - ${sub} = ${t-sub}, ${t} - ${sub+1} = ${t-sub-1}, ${t} - ${sub+2} = ?`, answer: t-sub-2, hint: '규칙을 찾아보세요!' }; },
      (s) => { const start = randInt(s, 1, 3); const step = randInt(s+1, 2, 4); return { question: `[올림피아드 기초] 첫 번째: ${start}개, 두 번째: ${start+step}개, 세 번째: ${start+step*2}개, 네 번째: ?개`, answer: start+step*3, hint: `${step}개씩 늘어납니다!` }; }
    ],
    '2': [
      (s) => { const st = randInt(s, 2, 10); const sp = randInt(s+1, 2, 5); return { question: `[성대경시 기초] ${st}, ${st+sp}, ${st+sp*2}, ${st+sp*3}, __는 무엇인가요?`, answer: st+sp*4, hint: `${sp}씩 커집니다!` }; },
      (s) => { const target = randInt(s, 10, 20); const n1 = randInt(s+1, 2, target-2); const n2 = randInt(s+2, 2, target-2); const n3 = randInt(s+3, 2, target-2); return { question: `[교과서 심화] ${target} = ${n1} + ${target-n1} = ${n2} + ${target-n2} = ${n3} + ?`, answer: target-n3, hint: `${target}을 만드는 수를 찾으세요!` }; },
      (s) => { const ans = randInt(s, 15, 40); const sub = randInt(s+1, 10, ans-5); return { question: `[EBS 응용] ■ + ${sub} = ${ans}일 때, ■는 무엇인가요?`, answer: ans-sub, hint: `${ans}에서 ${sub}를 빼보세요!` }; },
      (s) => { const st = randInt(s, 40, 90); const sp = randInt(s+1, 2, 6); return { question: `[올림피아드] 규칙 찾기: ${st}, ${st-sp}, ${st-sp*2}, ${st-sp*3}, __`, answer: st-sp*4, hint: `${sp}씩 작아집니다!` }; }
    ],
    '3': [
      (s) => { const st = randInt(s, 3, 12); const sp = randInt(s+1, 3, 7); return { question: `${st}, ${st+sp}, ${st+sp*2}, ${st+sp*3}, __는 무엇인가요?`, answer: st+sp*4, hint: `${sp}씩 커지는 규칙을 찾으세요!` }; },
      (s) => { const ans = randInt(s, 3, 9); const mul = randInt(s+1, 4, 9); return { question: `□ × ${mul} = ${ans*mul}일 때, □는 무엇인가요?`, answer: ans, hint: '곱셈의 반대로 생각해보세요!' }; },
      (s) => { const ans = randInt(s, 11, 25); const div = randInt(s+1, 3, 7); return { question: `□ ÷ ${div} = ${ans}일 때, □는 무엇인가요?`, answer: ans*div, hint: '나눗셈의 반대로 생각하세요!' }; },
      (s) => { const start = randInt(s, 100, 300); const step = randInt(s+1, 10, 30); return { question: `${start}, ${start-step}, ${start-step*2}, ${start-step*3}, __는?`, answer: start-step*4, hint: `${step}씩 작아집니다!` }; }
    ],
    '4': [
      (s) => { const start = randInt(s, 2, 5); const mul = randInt(s+1, 2, 3); return { question: `${start}, ${start*mul}, ${start*mul*mul}, ${start*Math.pow(mul,3)}, __는 무엇인가요?`, answer: start*Math.pow(mul,4), hint: `${mul}배씩 커집니다!` }; },
      (s) => { const n = randInt(s, 1, 4); return { question: `${n*n}, ${(n+1)*(n+1)}, ${(n+2)*(n+2)}, ${(n+3)*(n+3)}, __는 무엇인가요?`, answer: (n+4)*(n+4), hint: '어떤 수를 두 번 곱한 패턴입니다!' }; },
      (s) => { const num = randInt(s, 1, 5); const den = randInt(s+1, 2, 6); const mult = randInt(s+2, 2, 5); return { question: `${num}/${den} 과 크기가 같은 분수 ?/${den*mult} 의 ?는?`, answer: num*mult, hint: '분모와 분자에 똑같이 곱하세요.' }; },
      (s) => { const dec = randInt(s, 1, 5); const step = randInt(s+1, 1, 3); return { question: `0.${dec}, 0.${dec+step}, 0.${dec+step*2}, __는 무엇인가요?`, answer: (dec+step*3)/10, hint: `0.${step}씩 커집니다!`, isTextAnswer: true }; }
    ],
    '5': [
      (s) => { const st = randInt(s, 1, 5); const sp = randInt(s+1, 2, 4); return { question: `[시도경시대회] ${st}, ${st+sp}, ${st+sp+(sp+1)}, ${st+sp+(sp+1)+(sp+2)}, __ (더해지는 수가 커져요)`, answer: st+sp+(sp+1)+(sp+2)+(sp+3), hint: '갈수록 더 큰 수를 더해보세요.' }; },
      (s) => { const half = randInt(s, 2, 6) * 2; return { question: `[최상위 수학] □ × 0.5 = ${half} 일 때, □는?`, answer: half*2, hint: '반으로 나누어 값이 되는 수는?' }; },
      (s) => { const start = randInt(s, 2, 4); return { question: `[올림피아드] ${start}, ${start}, ${start*2}, ${start*3}, ${start*5}, __ (두 수의 합)`, answer: start*8, hint: '앞의 두 수를 더해보세요.' }; },
      (s) => { const ans = randInt(s, 5, 12); const mul = randInt(s+1, 2, 4); const sub = randInt(s+2, 3, 10); return { question: `[거꾸로 풀기 기출] 어떤 수의 ${mul}배에서 ${sub}를 빼면 ${ans*mul-sub}입니다. 어떤 수는?`, answer: ans, hint: `거꾸로 ${sub}를 더하고 ${mul}로 나누세요.` }; }
    ],
    '6': [
      (s) => { const pct = randInt(s, 2, 5)*10; const val = randInt(s+1, 20, 50); return { question: `[EBS 비율 응용] ${pct}%가 ${val}명이라면, 전체 100%는 몇 명인가요?`, answer: (val * 100)/pct, hint: '비율만큼 곱해보세요.' }; },
      (s) => { const a = randInt(s, 2, 5); const b = randInt(s+1, 3, 7); const mult = randInt(s+2, 3, 6); return { question: `[최상위 수학] ${a} : ${b} = ${a*mult} : x 일 때, x는?`, answer: b*mult, hint: `전항에 곱을 확인하세요.` }; },
      (s) => { const d = randInt(s, 4, 12); return { question: `[올림피아드 도형] 원주율을 3으로 계산할 때, 지름이 ${d}인 원의 둘레는?`, answer: d*3, hint: '원주 = 지름 × 원주율' }; },
      (s) => { const x = randInt(s, 4, 10); const mul = randInt(s+1, 2, 5); const sub = randInt(s+2, 2, 8); return { question: `[KMO 대수 기초] ${mul}x - ${sub} = ${x*mul-sub}, x는 무엇일까요?`, answer: x, hint: '양변을 이항해보세요.' }; },
      (s) => { const x = randInt(s, 2, 8); const add = randInt(s+1, 2, 4); return { question: `[KMO 방정식] x + ${add}x = ${x*(add+1)}, x는?`, answer: x, hint: `${add+1}x 입니다.` }; }
    ]
  },
  US: {
    'K': [
      (s) => { const st = randInt(s, 1, 5); return { question: `${st}, ${st+1}, ${st+2}, __?`, answer: st+3, hint: 'Count up!' }; },
      (s) => { const a = randInt(s, 1, 4); const b = randInt(s+1, 1, 4); return { question: `What is ${a} + ${b}?`, answer: a+b, hint: 'Add them together.' }; },
      (s) => { const st = randInt(s, 5, 10); return { question: `Count: ${st}, ${st-1}, ${st-2}, __?`, answer: st-3, hint: 'Count backwards.' }; },
      (s) => { const a = randInt(s, 2, 5); const b = randInt(s+1, 1, 3); return { question: `${a} cats and ${b} dogs. How many animals?`, answer: a+b, hint: 'Count them all.' }; }
    ],
    '1': [
      (s) => { const st = randInt(s, 5, 15); return { question: `${st}, ${st+1}, ${st+2}, ${st+3}, What comes next?`, answer: st+4, hint: 'It grows by 1!' }; },
      (s) => { const ans = randInt(s, 5, 10); const p = randInt(s+1, 1, ans-1); return { question: `${p} + ? = ${ans}`, answer: ans-p, hint: `Count up from ${p} to ${ans}.` }; },
      (s) => { const t = randInt(s, 10, 15); const sub = randInt(s+1, 2, 4); return { question: `${t} - ${sub} = ${t-sub}, ${t} - ${sub+1} = ${t-sub-1}, ${t} - ${sub+2} = ?`, answer: t-sub-2, hint: 'Find the pattern!' }; },
      (s) => { const a = randInt(s, 3, 8); const b = randInt(s+1, 2, 6); return { question: `Mary has ${a} apples. Gets ${b} more. How many?`, answer: a+b, hint: `Add ${a} and ${b}.` }; }
    ],
    '2': [
      (s) => { const st = randInt(s, 2, 10); const sp = randInt(s+1, 2, 4); return { question: `${st}, ${st+sp}, ${st+sp*2}, ${st+sp*3}, What comes next?`, answer: st+sp*4, hint: `Count by ${sp}s!` }; },
      (s) => { const target = randInt(s, 10, 20); const n1 = randInt(s+1, 2, target-2); const n2 = randInt(s+2, 2, target-2); const n3 = randInt(s+3, 2, target-2); return { question: `${target} = ${n1} + ${target-n1} = ${n2} + ${target-n2} = ${n3} + ?`, answer: target-n3, hint: `Friends of ${target}!` }; },
      (s) => { const ans = randInt(s, 20, 50); const sub = randInt(s+1, 10, ans-5); return { question: `? + ${sub} = ${ans}. What is ?`, answer: ans-sub, hint: `Subtract ${sub} from ${ans}.` }; },
      (s) => { const st = randInt(s, 40, 60); const sp = randInt(s+1, 3, 6); return { question: `${st}, ${st-sp}, ${st-sp*2}, ${st-sp*3}, Next is?`, answer: st-sp*4, hint: `Count back by ${sp}s.` }; }
    ],
    '3': [
      (s) => { const st = randInt(s, 6, 18); const sp = randInt(s+1, 3, 6); return { question: `${st}, ${st+sp}, ${st+sp*2}, ${st+sp*3}, What is next?`, answer: st+sp*4, hint: `Count by ${sp}s!` }; },
      (s) => { const ans = randInt(s, 4, 9); const mul = randInt(s+1, 3, 8); return { question: `? × ${mul} = ${ans*mul}. Find ?`, answer: ans, hint: `Think of ${mul} times what equals ${ans*mul}.` }; },
      (s) => { const ans = randInt(s, 12, 24); const div = randInt(s+1, 3, 6); return { question: `? ÷ ${div} = ${ans}. Find ?`, answer: ans*div, hint: 'Inverse is multiplication!' }; },
      (s) => { const side = randInt(s, 3, 10); return { question: `A square has side of ${side} inches. Perimeter?`, answer: side*4, hint: 'Add all four sides.' }; }
    ],
    '4': [
      (s) => { const st = randInt(s, 2, 4); const mul = randInt(s+1, 2, 3); return { question: `${st}, ${st*mul}, ${st*mul*mul}, ${st*Math.pow(mul,3)}, What is next?`, answer: st*Math.pow(mul,4), hint: `Multiply by ${mul}!` }; },
      (s) => { const n = randInt(s, 2, 5); return { question: `${n*n}, ${(n+1)*(n+1)}, ${(n+2)*(n+2)}, ${(n+3)*(n+3)}, What is next?`, answer: (n+4)*(n+4), hint: 'Square numbers.' }; },
      (s) => { const n = randInt(s, 1, 4); const d = randInt(s+1, 2, 5); const m = randInt(s+2, 2, 4); return { question: `${n}/${d} is equal to ?/${d*m}. Find ?`, answer: n*m, hint: 'Equivalent fractions.' }; },
      (s) => { const l = randInt(s, 5, 12); const w = randInt(s+1, 4, l-1); return { question: `Area of a rectangle: length ${l}, width ${w}?`, answer: l*w, hint: 'Length times width.' }; }
    ],
    '5': [
      (s) => { const st = randInt(s, 2, 6); const sp = randInt(s+1, 2, 4); return { question: `${st}, ${st+sp}, ${st+sp+(sp+1)}, ${st+sp+(sp+1)+(sp+2)}, What is next?`, answer: st+sp+(sp+1)+(sp+2)+(sp+3), hint: 'Adds a growing number.' }; },
      (s) => { const n = randInt(s, 2, 5); const d = n + randInt(s+1, 1, 4); const m = randInt(s+2, 2, 4); return { question: `Reduce ${n*m}/${d*m} to simplest form. Numerator?`, answer: n, hint: `Divide by ${m}.` }; },
      (s) => { const ans = randInt(s, 12, 30); return { question: `? × 0.5 = ${ans}. Find ?`, answer: ans*2, hint: `What number cut in half is ${ans}?` }; },
      (s) => { const pr = randInt(s, 20, 60); const dc = randInt(s+1, 1, 3)*10; return { question: `A shirt is $${pr}. ${dc}% discount. Final price?`, answer: pr - (pr*dc)/100, hint: 'Subtract the discount.' }; }
    ],
    '6': [
      (s) => { const pct = randInt(s, 2, 4)*10; const val = randInt(s+1, 20, 50); return { question: `If ${pct}% is ${val} people, what is 100%?`, answer: (val * 100)/pct, hint: 'Multiply ratio.' }; },
      (s) => { const a = randInt(s, 2, 5); const b = randInt(s+1, 3, 7); const m = randInt(s+2, 2, 6); return { question: `${a} : ${b} = ${a*m} : x. What is x?`, answer: b*m, hint: 'Match the proportion.' }; },
      (s) => { const x = randInt(s, 4, 12); const mul = randInt(s+1, 2, 4); const sub = randInt(s+2, 2, 8); return { question: `${mul}x - ${sub} = ${x*mul-sub}, what is x?`, answer: x, hint: 'Isolate x.' }; },
      (s) => { const n1=randInt(s, 2, 6); const n2=n1+2; const n3=n2+2; const n4=n3+2; return { question: `Mean of ${n1}, ${n2}, ${n3}, ${n4}?`, answer: (n1+n2+n3+n4)/4, hint: 'Add all and divide by 4.' }; }
    ]
  }
};
