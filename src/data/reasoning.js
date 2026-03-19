export const REASONING_BANK = {
  KR: {
    '1': [
      { question: '[EBS 기초] 1, 2, 3, 4, __는 무엇인가요?', answer: 5, hint: '1씩 커집니다!' },
      { question: '[교과서 응용] 네모 안에 알맞은 수는? 4 + □ = 9', answer: 5, hint: '9에서 4를 빼보세요!' },
      { question: '[창의수학] 10 - 3 = 7, 10 - 4 = 6, 10 - 5 = ?', answer: 5, hint: '규칙을 찾아보세요!' },
      { question: '[올림피아드 기초] 첫 번째: 1개, 두 번째: 3개, 세 번째: 5개, 네 번째: ?개', answer: 7, hint: '2개씩 늘어납니다!' },
      { question: '[HME 대비] ■ + ■ = 10일 때, ■는 무엇인가요?', answer: 5, hint: '같은 수 두 번 더하기!' },
    ],
    '2': [
      { question: '[성대경시 기초] 2, 4, 6, 8, __는 무엇인가요?', answer: 10, hint: '2씩 커집니다!' },
      { question: '[교과서 심화] 10 = 5 + 5 = 7 + 3 = 6 + 4 = 2 + ?', answer: 8, hint: '10을 만드는 수를 찾으세요!' },
      { question: '[EBS 응용] ■ + 15 = 40일 때, ■는 무엇인가요?', answer: 25, hint: '40에서 15를 빼보세요!' },
      { question: '[올림피아드] 규칙 찾기: 50, 45, 40, 35, __', answer: 30, hint: '5씩 작아집니다!' },
    ],
    '3': [
      { question: '3, 6, 9, 12, __는 무엇인가요?', answer: 15, hint: '3씩 커지는 규칙을 찾으세요!' },
      { question: '□ × 4 = 20일 때, □는 무엇인가요?', answer: 5, hint: '곱셈의 반대로 생각해보세요!' },
      { question: '□ ÷ 3 = 6일 때, □는 무엇인가요?', answer: 18, hint: '나눗셈의 반대로 생각하세요!' },
      { question: '3 × ■ = 24일 때, ■는 무엇인가요?', answer: 8, hint: '구구단 3단을 외워보세요!' },
      { question: '100, 90, 80, 70, __는?', answer: 60, hint: '10씩 작아집니다!' },
    ],
    '4': [
      { question: '2, 4, 8, 16, __는 무엇인가요?', answer: 32, hint: '2배씩 커집니다!' },
      { question: '1, 4, 9, 16, __는 무엇인가요?', answer: 25, hint: '1², 2², 3², 4², ...의 패턴입니다!' },
      { question: '10, 20, 30, 40, __는 무엇인가요?', answer: 50, hint: '10씩 커집니다!' },
      { question: '1/2 = ?/4 요 안에 들어갈 숫자는?', answer: 2, hint: '분모와 분자에 2를 곱해보세요.' },
      { question: '0.1, 0.2, 0.3, __는 무엇인가요?', answer: 0.4, hint: '0.1씩 커집니다!', isTextAnswer: true },
    ],
    '5': [
      { question: '[시도경시대회] 1, 3, 6, 10, __ (더해지는 수가 커져요)', answer: 15, hint: '+2, +3, +4, ... 다음은?' },
      { question: '[EBS 교과 심화] 2/4 = 1/2 라고 할때, 6/8 = ?/4 의 ?는?', answer: 3, hint: '약분해보세요!' },
      { question: '[최상위 수학] □ × 0.5 = 10 일 때, □는?', answer: 20, hint: '반으로 나누어 10이 되는 수는?' },
      { question: '[올림피아드] 1, 1, 2, 3, 5, 8, __ (피보나치 수열)', answer: 13, hint: '앞의 두 수를 더해보세요.' },
      { question: '[거꾸로 풀기 기출] 어떤 수의 3배에서 5를 빼면 16입니다. 어떤 수는?', answer: 7, hint: '거꾸로 16에 5를 더하고 3으로 나누세요.' },
    ],
    '6': [
      { question: '[EBS 비율 응용] 20%가 40명이라면, 전체 100%는 몇 명인가요?', answer: 200, hint: '40에 5를 곱해보세요.' },
      { question: '[최상위 수학] 3 : 4 = 15 : x 일 때, x는?', answer: 20, hint: '전항에 5를 곱했으니 후항에도 5를 곱하세요.' },
      { question: '[올림피아드 도형] 원주율을 3으로 계산할 때, 지름이 10인 원의 둘레는?', answer: 30, hint: '원주 = 지름 × 원주율' },
      { question: '[KMO 기초] 3x - 5 = 10, x는 무엇일까요?', answer: 5, hint: '양변에 5를 더하고 3으로 나누세요.' },
      { question: '[KMO 대수] x + 2x = 18, x는?', answer: 6, hint: '3x = 18 입니다.' },
    ]
  },
  US: {
    'K': [
      { question: '1, 2, 3, __?', answer: 4, hint: 'Count up!' },
      { question: 'What is 1 + 1?', answer: 2, hint: 'Add them together.' },
      { question: 'Count: 5, 4, 3, __?', answer: 2, hint: 'Count backwards.' },
      { question: 'Two cats and one dog. How many animals?', answer: 3, hint: 'Count them all.' },
      { question: '10, 20, __?', answer: 30, hint: 'Count by 10s!' },
    ],
    '1': [
      { question: '1, 2, 3, 4, What comes next?', answer: 5, hint: 'It grows by 1!' },
      { question: '4 + ? = 10', answer: 6, hint: 'Count up from 4 to 10.' },
      { question: '10 - 3 = 7, 10 - 4 = 6, 10 - 5 = ?', answer: 5, hint: 'Find the pattern!' },
      { question: 'Mary has 3 apples. She gets 2 more. How many?', answer: 5, hint: 'Add 3 and 2.' },
      { question: '? + ? = 8 (The numbers are the same)', answer: 4, hint: 'Double a number to get 8.' },
    ],
    '2': [
      { question: '2, 4, 6, 8, What comes next?', answer: 10, hint: 'Count by 2s!' },
      { question: '10 = 5 + 5 = 7 + 3 = 6 + 4 = 2 + ?', answer: 8, hint: 'Friends of 10!' },
      { question: '? + 15 = 40. What is ?', answer: 25, hint: 'Subtract 15 from 40.' },
      { question: '50, 45, 40, 35, Next is?', answer: 30, hint: 'Count back by 5s.' },
      { question: 'John has 10 cents. He buys a candy for 4 cents. Left?', answer: 6, hint: 'Subtract 4 from 10.' },
    ],
    '3': [
      { question: '3, 6, 9, 12, What is next?', answer: 15, hint: 'Count by 3s!' },
      { question: '? × 4 = 20. Find ?', answer: 5, hint: 'Think of 4 times what equals 20.' },
      { question: '? ÷ 3 = 6. Find ?', answer: 18, hint: 'Inverse is multiplication!' },
      { question: 'A square has side of 3 inches. Perimeter?', answer: 12, hint: 'Add 3 four times.' },
      { question: '100, 90, 80, 70, __?', answer: 60, hint: 'Minus 10.' },
    ],
    '4': [
      { question: '2, 4, 8, 16, What is next?', answer: 32, hint: 'Multiply by 2!' },
      { question: '1, 4, 9, 16, What is next?', answer: 25, hint: '1x1, 2x2, 3x3, 4x4, ...' },
      { question: '1/2 is equal to ?/4. Find ?', answer: 2, hint: 'Equivalent fractions.' },
      { question: '0.1, 0.2, 0.3, Next is?', answer: 0.4, hint: 'Add 0.1!', isTextAnswer: true },
      { question: 'Area of a rectangle: length 5, width 4?', answer: 20, hint: 'Length times width.' },
    ],
    '5': [
      { question: '1, 3, 6, 10, What is next? (Adds +2, +3, +4...)', answer: 15, hint: 'Next add +5.' },
      { question: 'Reduce 6/8 to simplest form. Numerator?', answer: 3, hint: 'Divide by 2.' },
      { question: '? × 0.5 = 10. Find ?', answer: 20, hint: 'What number cut in half is 10?' },
      { question: 'Volume of cube with side 3? (3x3x3)', answer: 27, hint: 'Multiply 3 by itself 3 times.' },
      { question: 'A shirt is $20. 10% discount. Final price?', answer: 18, hint: '10% of 20 is 2. Then subtract.' },
    ],
    '6': [
      { question: 'If 20% is 40 people, what is 100%?', answer: 200, hint: 'Multiply 40 by 5.' },
      { question: '3 : 4 = 15 : x. What is x?', answer: 20, hint: '3 times 5 is 15. So 4 times 5 is?' },
      { question: 'If Pi is 3, circumference of circle with diameter 10?', answer: 30, hint: 'C = Pi × d' },
      { question: '3x - 5 = 10, what is x?', answer: 5, hint: 'Add 5 to both sides, then divide by 3.' },
      { question: 'Mean of 2, 4, 6, 8?', answer: 5, hint: 'Add them all and divide by 4.' },
    ]
  }
};
