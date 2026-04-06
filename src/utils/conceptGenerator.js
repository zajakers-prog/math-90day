import { seedRandom } from './problemGenerator.js';

function rInt(seed, min, max) {
  return Math.floor(seedRandom(seed) * (max - min + 1)) + min;
}
function pick(seed, arr) { return arr[rInt(seed, 0, arr.length - 1)]; }

// ─── TYPE_HANDLERS map ───
const TYPE_HANDLERS = {
  'number-sense':       generateNumberSense,
  'number-sense-50':    generateNumberSense50,
  'number-sense-100':   generateNumberSense100,
  'place-value':        generatePlaceValue,
  'big-number':         generateBigNumber,
  'estimation':         generateEstimation,
  'geo-shape-3d':       generateShape3D,
  'geo-shape-2d':       generateShape2D,
  'geo-sides-vertices': generateSidesVertices,
  'geo-angle':          generateAngle,
  'geo-peri':           generatePerimeter,
  'geo-area':           generateArea,
  'geo-vol':            generateVolume,
  'geo-triangle-type':  generateTriangleType,
  'geo-quad-type':      generateQuadType,
  'geo-perpendicular-parallel': generatePerpParallel,
  'geo-symmetry':       generateSymmetry,
  'geo-net':            generateNet,
  'geo-circle':         generateCircle,
  'geo-prism-pyramid':  generatePrismPyramid,
  'meas-compare':       generateMeasCompare,
  'meas-length-convert': generateLengthConvert,
  'meas-weight-convert': generateWeightConvert,
  'meas-capacity-convert': generateCapacityConvert,
  'meas-time':          generateMeasTime,
  'meas-clock':         generateClock,
  'meas-money':         generateMoney,
  'meas-circle':        generateMeasCircle,
  'data-classify':      generateDataClassify,
  'data-table-read':    generateTableRead,
  'data-graph-read':    generateGraphRead,
  'data-average':       generateAverage,
  'data-probability':   generateProbability,
  'pattern-repeat':     generatePatternRepeat,
  'pattern-number':     generatePatternNumber,
  'pattern-growth':     generatePatternGrowth,
  'pattern-correspondence': generateCorrespondence,
  'frac-concept':       generateFracConcept,
  'frac-add-same':      generateFracAddSame,
  'frac-sub-same':      generateFracSubSame,
  'frac-add-diff':      generateFracAddDiff,
  'frac-sub-diff':      generateFracSubDiff,
  'frac-mixed-add':     generateFracMixedAdd,
  'frac-mul':           generateFracMul,
  'frac-div':           generateFracDiv,
  'dec-mul':            generateDecMul,
  'dec-div':            generateDecDiv,
  'frac-dec-convert':   generateFracDecConvert,
  'frac-dec-mixed':     generateFracDecMixed,
  'gcd-lcm':            generateGcdLcm,
  'factor-multiple':    generateFactorMultiple,
  'ratio-basic':        generateRatioBasic,
  'percent':            generatePercent,
  'proportion':         generateProportion,
  'ratio-word':         generateRatioWord,
  'equation-basic':     generateEquationBasic,
  'equation-x':         generateEquationX,
  'mixed-operations':   generateMixedOperations,
  'dec-add-sub':        generateDecAddSub,
};

export function generateConceptProblem(type, seed, region, min, max, attempt) {
  const s = seed + attempt * 29;
  const kr = region === 'KR';

  // Exact match first
  if (TYPE_HANDLERS[type]) {
    return TYPE_HANDLERS[type](s, kr, min, max);
  }

  // Prefix match fallback
  for (const key of Object.keys(TYPE_HANDLERS)) {
    if (type.includes(key)) {
      return TYPE_HANDLERS[key](s, kr, min, max);
    }
  }

  return null;
}

// ═══════════════════════════════════════
//  NUMBER SENSE
// ═══════════════════════════════════════

function generateNumberSense(s, kr, min, max) {
  const n = rInt(s, Math.max(1, min), Math.min(9, max));
  const variant = rInt(s + 1, 1, 3);
  if (variant === 1) {
    const q = kr ? `${n} 다음 수는 무엇인가요?` : `What number comes after ${n}?`;
    return w(q, n + 1, kr ? '1을 더하세요' : 'Add 1');
  }
  if (variant === 2) {
    const q = kr ? `${n + 1} 바로 앞의 수는?` : `What number comes just before ${n + 1}?`;
    return w(q, n, kr ? '1을 빼세요' : 'Subtract 1');
  }
  const a = rInt(s + 2, 1, Math.max(2, n)); const b = n - a;
  const q = kr ? `${a}와 합이 ${n}이 되는 수는?` : `What number added to ${a} makes ${n}?`;
  return w(q, b, kr ? `${n}에서 ${a}를 빼세요` : `Subtract ${a} from ${n}`);
}

function generateNumberSense50(s, kr) {
  const n = rInt(s, 10, 49);
  const tens = Math.floor(n / 10); const ones = n % 10;
  const variant = rInt(s + 1, 1, 2);
  if (variant === 1) {
    const q = kr ? `${n}에서 십의 자리 숫자는?` : `What is the tens digit of ${n}?`;
    return w(q, tens, kr ? '왼쪽 숫자입니다' : 'The left digit');
  }
  const q = kr ? `${tens}0보다 ${ones}만큼 큰 수는?` : `What is ${ones} more than ${tens}0?`;
  return w(q, n, kr ? '십의 자리와 일의 자리를 합치세요' : 'Combine tens and ones');
}

function generateNumberSense100(s, kr) {
  const n = rInt(s, 50, 99);
  const variant = rInt(s + 1, 1, 3);
  if (variant === 1) {
    const q = kr ? `${n}보다 10 큰 수는?` : `What is 10 more than ${n}?`;
    return w(q, n + 10, kr ? '10을 더하세요' : 'Add 10');
  }
  if (variant === 2) {
    const q = kr ? `${n}보다 10 작은 수는?` : `What is 10 less than ${n}?`;
    return w(q, n - 10, kr ? '10을 빼세요' : 'Subtract 10');
  }
  const a = rInt(s + 2, 51, 98); const b = a + 1;
  const q = kr ? `${a}과 ${b + 1} 사이의 수는?` : `What number is between ${a} and ${b + 1}?`;
  return w(q, b, kr ? '사이의 수를 찾으세요' : 'Find the number in between');
}

function generatePlaceValue(s, kr, min, max) {
  const n = rInt(s, Math.max(10, min), Math.min(9999, max));
  const digits = String(n);
  const places = kr ? ['일', '십', '백', '천'] : ['ones', 'tens', 'hundreds', 'thousands'];
  const placeIdx = rInt(s + 1, 0, Math.min(digits.length - 1, 3));
  const digitVal = parseInt(digits[digits.length - 1 - placeIdx]);
  const q = kr ? `${n}에서 ${places[placeIdx]}의 자리 숫자는?` : `What is the ${places[placeIdx]} digit of ${n}?`;
  return w(q, digitVal, kr ? '자릿값을 확인하세요' : 'Check the place value');
}

function generateBigNumber(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) {
    const n = rInt(s + 1, 1, 9); const unit = rInt(s + 2, 1, 3);
    const units = kr ? ['만', '억', '조'] : ['ten-thousand', 'hundred-million', 'trillion'];
    const vals = [10000, 100000000, 1000000000000];
    const q = kr ? `${n}${units[unit - 1]}은 ${units[Math.max(0, unit - 2)]}이 몇 개인가요?`
      : `How many ${units[Math.max(0, unit - 2)]}s are in ${n} ${units[unit - 1]}?`;
    const ratio = vals[unit - 1] / vals[Math.max(0, unit - 2)];
    return w(q, n * ratio, kr ? '단위 사이의 관계를 생각하세요' : 'Think about unit relationships');
  }
  if (variant === 2) {
    const a = rInt(s + 1, 10000, 50000); const b = rInt(s + 2, 10000, 50000);
    const bigger = Math.max(a, b);
    const q = kr ? `${a}과 ${b} 중 더 큰 수는?` : `Which is larger: ${a} or ${b}?`;
    return w(q, bigger, kr ? '자릿값을 비교하세요' : 'Compare digit by digit');
  }
  const n = rInt(s + 1, 2, 9) * 10000;
  const q = kr ? `${n.toLocaleString()}을 만의 자리 단위로 읽으면 몇 만인가요?` : `${n.toLocaleString()} is how many ten-thousands?`;
  return w(q, n / 10000, kr ? '만으로 나누세요' : 'Divide by 10,000');
}

function generateEstimation(s, kr) {
  const n = rInt(s, 100, 9999);
  const method = rInt(s + 1, 1, 3); // 1=올림, 2=버림, 3=반올림
  const place = rInt(s + 2, 1, 2); // 1=십, 2=백
  const divisor = place === 1 ? 10 : 100;
  const placeKR = place === 1 ? '십' : '백';
  const placeUS = place === 1 ? "ten's" : "hundred's";
  let answer;
  if (method === 1) { // 올림
    answer = Math.ceil(n / divisor) * divisor;
    const q = kr ? `${n}을 ${placeKR}의 자리에서 올림하면?` : `Round up ${n} to the nearest ${divisor}?`;
    return w(q, answer, kr ? '올림: 무조건 올립니다' : 'Round up');
  }
  if (method === 2) { // 버림
    answer = Math.floor(n / divisor) * divisor;
    const q = kr ? `${n}을 ${placeKR}의 자리에서 버림하면?` : `Round down ${n} to the nearest ${divisor}?`;
    return w(q, answer, kr ? '버림: 무조건 버립니다' : 'Round down');
  }
  answer = Math.round(n / divisor) * divisor;
  const q = kr ? `${n}을 ${placeKR}의 자리에서 반올림하면?` : `Round ${n} to the nearest ${divisor}?`;
  return w(q, answer, kr ? '5 이상이면 올림, 미만이면 버림' : '5 or more rounds up, less rounds down');
}

// ═══════════════════════════════════════
//  GEOMETRY
// ═══════════════════════════════════════

function generateShape3D(s, kr) {
  const shapes = kr
    ? [{ name: '구', f: 0, e: 0, v: 0 }, { name: '원기둥', f: 3, e: 2, v: 0 }, { name: '원뿔', f: 2, e: 1, v: 1 }, { name: '직육면체', f: 6, e: 12, v: 8 }, { name: '정육면체', f: 6, e: 12, v: 8 }]
    : [{ name: 'Sphere', f: 0, e: 0, v: 0 }, { name: 'Cylinder', f: 3, e: 2, v: 0 }, { name: 'Cone', f: 2, e: 1, v: 1 }, { name: 'Cuboid', f: 6, e: 12, v: 8 }, { name: 'Cube', f: 6, e: 12, v: 8 }];
  const shape = pick(s, shapes);
  const prop = rInt(s + 1, 1, 2);
  if (prop === 1 && shape.f > 0) {
    const q = kr ? `${shape.name}의 면은 몇 개인가요?` : `How many faces does a ${shape.name} have?`;
    return w(q, shape.f, kr ? '입체도형의 면을 세어보세요' : 'Count the faces');
  }
  const q = kr ? `${shape.name}의 모서리는 몇 개인가요?` : `How many edges does a ${shape.name} have?`;
  return w(q, shape.e, kr ? '입체도형의 모서리를 세어보세요' : 'Count the edges');
}

function generateShape2D(s, kr) {
  const shapes = kr
    ? [{ name: '삼각형', sides: 3 }, { name: '사각형', sides: 4 }, { name: '오각형', sides: 5 }, { name: '육각형', sides: 6 }]
    : [{ name: 'Triangle', sides: 3 }, { name: 'Square', sides: 4 }, { name: 'Pentagon', sides: 5 }, { name: 'Hexagon', sides: 6 }];
  const shape = pick(s, shapes);
  const q = kr ? `${shape.name}의 변은 몇 개인가요?` : `How many sides does a ${shape.name} have?`;
  return w(q, shape.sides, kr ? '변의 수를 세어보세요' : 'Count the sides');
}

function generateSidesVertices(s, kr) {
  const n = rInt(s, 3, 8);
  const names_kr = { 3: '삼각형', 4: '사각형', 5: '오각형', 6: '육각형', 7: '칠각형', 8: '팔각형' };
  const names_us = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' };
  const prop = rInt(s + 1, 1, 2);
  const name = kr ? names_kr[n] : names_us[n];
  if (prop === 1) {
    const q = kr ? `${name}의 꼭짓점은 몇 개인가요?` : `How many vertices does a ${name} have?`;
    return w(q, n, kr ? '꼭짓점의 수 = 변의 수' : 'Vertices = sides');
  }
  const diag = n * (n - 3) / 2;
  const q = kr ? `${name}의 대각선은 몇 개인가요?` : `How many diagonals does a ${name} have?`;
  return w(q, diag, kr ? 'n(n-3)/2' : 'n(n-3)/2');
}

function generateAngle(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) {
    const given = rInt(s + 1, 30, 150);
    const q = kr ? `일직선은 180°입니다. 한 각이 ${given}°일 때 나머지 각은?` : `A straight angle is 180°. If one angle is ${given}°, what is the other?`;
    return w(q, 180 - given, kr ? '180에서 빼세요' : 'Subtract from 180');
  }
  if (variant === 2) {
    const a1 = rInt(s + 1, 30, 80); const a2 = rInt(s + 2, 30, 80);
    const q = kr ? `삼각형의 두 각이 ${a1}°, ${a2}°일 때 나머지 각은?` : `Triangle angles: ${a1}° and ${a2}°. Third angle?`;
    return w(q, 180 - a1 - a2, kr ? '180에서 두 각을 빼세요' : 'Subtract from 180');
  }
  const a1 = rInt(s + 1, 60, 120); const a2 = rInt(s + 2, 60, 120); const a3 = rInt(s + 3, 40, 100);
  const q = kr ? `사각형의 세 각이 ${a1}°, ${a2}°, ${a3}°일 때 나머지 각은?` : `Quadrilateral: 3 angles are ${a1}°, ${a2}°, ${a3}°. Fourth angle?`;
  return w(q, 360 - a1 - a2 - a3, kr ? '360에서 세 각을 빼세요' : 'Subtract from 360');
}

function generatePerimeter(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) {
    const side = rInt(s + 1, 3, 20);
    const q = kr ? `한 변이 ${side}cm인 정사각형의 둘레는?` : `Perimeter of a square with side ${side}cm?`;
    return w(q, side * 4, kr ? '변×4' : 'Side × 4');
  }
  if (variant === 2) {
    const w_ = rInt(s + 1, 3, 20); const h = rInt(s + 2, 3, 20);
    const q = kr ? `가로 ${w_}cm, 세로 ${h}cm인 직사각형의 둘레는?` : `Rectangle: ${w_}cm × ${h}cm. Perimeter?`;
    return w(q, (w_ + h) * 2, kr ? '(가로+세로)×2' : '(W+H)×2');
  }
  const a = rInt(s + 1, 3, 15); const b = rInt(s + 2, 4, 15); const c = rInt(s + 3, 5, 15);
  const q = kr ? `세 변이 ${a}cm, ${b}cm, ${c}cm인 삼각형의 둘레는?` : `Triangle sides: ${a}, ${b}, ${c}cm. Perimeter?`;
  return w(q, a + b + c, kr ? '세 변을 모두 더하세요' : 'Add all three sides');
}

function generateArea(s, kr) {
  const variant = rInt(s, 1, 4);
  if (variant === 1) {
    const w_ = rInt(s + 1, 3, 20); const h = rInt(s + 2, 3, 20);
    const q = kr ? `가로 ${w_}cm, 세로 ${h}cm인 직사각형의 넓이는?` : `Rectangle: ${w_}cm × ${h}cm. Area?`;
    return w(q, w_ * h, kr ? '가로×세로' : 'W × H');
  }
  if (variant === 2) {
    const b = rInt(s + 1, 4, 20) * 2; const h = rInt(s + 2, 3, 15);
    const q = kr ? `밑변 ${b}cm, 높이 ${h}cm인 삼각형의 넓이는?` : `Triangle: base ${b}cm, height ${h}cm. Area?`;
    return w(q, (b * h) / 2, kr ? '(밑변×높이)÷2' : '(B×H)÷2');
  }
  if (variant === 3) {
    const b = rInt(s + 1, 4, 15); const h = rInt(s + 2, 3, 12);
    const q = kr ? `밑변 ${b}cm, 높이 ${h}cm인 평행사변형의 넓이는?` : `Parallelogram: base ${b}cm, height ${h}cm. Area?`;
    return w(q, b * h, kr ? '밑변×높이' : 'B × H');
  }
  const a = rInt(s + 1, 4, 12); const b = rInt(s + 2, 6, 16); const h = rInt(s + 3, 3, 10);
  const sum = a + b;
  const q = kr ? `윗변 ${a}cm, 아랫변 ${b}cm, 높이 ${h}cm인 사다리꼴의 넓이는?` : `Trapezoid: top ${a}, bottom ${b}, height ${h}cm. Area?`;
  return w(q, (sum * h) / 2, kr ? '(윗변+아랫변)×높이÷2' : '(Top+Bottom)×H÷2');
}

function generateVolume(s, kr) {
  const w_ = rInt(s, 2, 10); const l = rInt(s + 1, 2, 10); const h = rInt(s + 2, 2, 10);
  const q = kr ? `가로 ${w_}cm, 세로 ${l}cm, 높이 ${h}cm인 직육면체의 부피는?` : `Cuboid: ${w_} × ${l} × ${h}cm. Volume?`;
  return w(q, w_ * l * h, kr ? '가로×세로×높이' : 'W × L × H');
}

function generateTriangleType(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) {
    const q = kr ? '세 변의 길이가 모두 같은 삼각형을 무엇이라 하나요? (정삼각형→3, 이등변삼각형→2, 직각삼각형→1)' : 'A triangle with all equal sides is called? (equilateral→3, isosceles→2, right→1)';
    return w(q, 3, kr ? '정삼각형입니다' : 'Equilateral triangle');
  }
  if (variant === 2) {
    const a = 60;
    const q = kr ? `정삼각형의 한 각의 크기는 몇 도인가요?` : `What is each angle of an equilateral triangle?`;
    return w(q, a, kr ? '180÷3' : '180÷3');
  }
  const a = rInt(s + 1, 20, 70); const b = rInt(s + 2, 20, 70);
  const c = 180 - a - b;
  const q = kr ? `삼각형의 세 각이 ${a}°, ${b}°, ${c}°입니다. 직각삼각형인가요? (예→1, 아니오→0)` : `Triangle angles: ${a}°, ${b}°, ${c}°. Is it a right triangle? (Yes→1, No→0)`;
  const ans = (a === 90 || b === 90 || c === 90) ? 1 : 0;
  return w(q, ans, kr ? '한 각이 90°이면 직각삼각형' : 'Has a 90° angle?');
}

function generateQuadType(s, kr) {
  const shapes = kr
    ? ['정사각형', '직사각형', '마름모', '평행사변형', '사다리꼴']
    : ['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid'];
  const angles = [90, 90, -1, -1, -1]; // -1 means varies
  const idx = rInt(s, 0, 1); // 정사각형 or 직사각형 for angle questions
  const q = kr ? `${shapes[idx]}의 네 각은 모두 몇 도인가요?` : `All angles of a ${shapes[idx]} are how many degrees?`;
  return w(q, 90, kr ? '직각(90°)입니다' : 'Each is 90°');
}

function generatePerpParallel(s, kr) {
  const variant = rInt(s, 1, 2);
  if (variant === 1) {
    const q = kr ? '두 직선이 만나서 이루는 각이 90°일 때 이를 무엇이라 하나요? (수직→1, 평행→2)' : 'Two lines meet at 90°. This is called? (Perpendicular→1, Parallel→2)';
    return w(q, 1, kr ? '수직입니다' : 'Perpendicular');
  }
  const q = kr ? '서로 만나지 않는 두 직선의 관계는? (수직→1, 평행→2)' : 'Two lines that never meet are? (Perpendicular→1, Parallel→2)';
  return w(q, 2, kr ? '평행입니다' : 'Parallel');
}

function generateSymmetry(s, kr) {
  const shapes = kr
    ? [{ name: '정사각형', axes: 4 }, { name: '정삼각형', axes: 3 }, { name: '원', axes: 99 }, { name: '직사각형', axes: 2 }, { name: '이등변삼각형', axes: 1 }]
    : [{ name: 'Square', axes: 4 }, { name: 'Equilateral triangle', axes: 3 }, { name: 'Circle', axes: 99 }, { name: 'Rectangle', axes: 2 }, { name: 'Isosceles triangle', axes: 1 }];
  const shape = pick(s, shapes.filter(sh => sh.axes < 99));
  const q = kr ? `${shape.name}의 대칭축은 몇 개인가요?` : `How many lines of symmetry does a ${shape.name} have?`;
  return w(q, shape.axes, kr ? '대칭축을 세어보세요' : 'Count the axes of symmetry');
}

function generateNet(s, kr) {
  const solids = kr
    ? [{ name: '정육면체', f: 6, e: 12, v: 8 }, { name: '삼각기둥', f: 5, e: 9, v: 6 }, { name: '사각뿔', f: 5, e: 8, v: 5 }]
    : [{ name: 'Cube', f: 6, e: 12, v: 8 }, { name: 'Triangular prism', f: 5, e: 9, v: 6 }, { name: 'Square pyramid', f: 5, e: 8, v: 5 }];
  const solid = pick(s, solids);
  const prop = rInt(s + 1, 1, 3);
  if (prop === 1) {
    const q = kr ? `${solid.name}의 면은 몇 개인가요?` : `How many faces does a ${solid.name} have?`;
    return w(q, solid.f, kr ? '면을 세어보세요' : 'Count the faces');
  }
  if (prop === 2) {
    const q = kr ? `${solid.name}의 모서리는 몇 개인가요?` : `How many edges does a ${solid.name} have?`;
    return w(q, solid.e, kr ? '모서리를 세어보세요' : 'Count the edges');
  }
  const q = kr ? `${solid.name}의 꼭짓점은 몇 개인가요?` : `How many vertices does a ${solid.name} have?`;
  return w(q, solid.v, kr ? '꼭짓점을 세어보세요' : 'Count the vertices');
}

function generateCircle(s, kr) {
  const r = rInt(s, 2, 15);
  const variant = rInt(s + 1, 1, 3);
  if (variant === 1) {
    const q = kr ? `반지름이 ${r}cm인 원의 지름은?` : `Diameter of a circle with radius ${r}cm?`;
    return w(q, r * 2, kr ? '지름=반지름×2' : 'Diameter = 2 × radius');
  }
  if (variant === 2) {
    const d = r * 2;
    const q = kr ? `지름이 ${d}cm인 원의 반지름은?` : `Radius of a circle with diameter ${d}cm?`;
    return w(q, r, kr ? '반지름=지름÷2' : 'Radius = diameter ÷ 2');
  }
  const q = kr ? `반지름이 ${r}cm인 원의 둘레는? (원주율=3)` : `Circumference of circle with radius ${r}cm? (Use π=3)`;
  return w(q, r * 2 * 3, kr ? '둘레=지름×원주율' : 'C = diameter × π');
}

function generatePrismPyramid(s, kr) {
  const n = rInt(s, 3, 6); // 삼~육
  const isPrism = rInt(s + 1, 1, 2) === 1;
  const names_kr = { 3: '삼', 4: '사', 5: '오', 6: '육' };
  const names_us = { 3: 'Triangular', 4: 'Rectangular', 5: 'Pentagonal', 6: 'Hexagonal' };
  if (isPrism) {
    // 각기둥: 면=n+2, 모서리=3n, 꼭짓점=2n
    const f = n + 2; const e = 3 * n; const v = 2 * n;
    const prop = rInt(s + 2, 1, 3);
    const name = kr ? `${names_kr[n]}각기둥` : `${names_us[n]} prism`;
    if (prop === 1) return w(kr ? `${name}의 면은 몇 개?` : `Faces of a ${name}?`, f, kr ? '밑면2+옆면n' : 'n+2');
    if (prop === 2) return w(kr ? `${name}의 모서리는 몇 개?` : `Edges of a ${name}?`, e, kr ? '3×n' : '3n');
    return w(kr ? `${name}의 꼭짓점은 몇 개?` : `Vertices of a ${name}?`, v, kr ? '2×n' : '2n');
  }
  // 각뿔: 면=n+1, 모서리=2n, 꼭짓점=n+1
  const f = n + 1; const e = 2 * n; const v = n + 1;
  const prop = rInt(s + 2, 1, 3);
  const name = kr ? `${names_kr[n]}각뿔` : `${names_us[n]} pyramid`;
  if (prop === 1) return w(kr ? `${name}의 면은 몇 개?` : `Faces of a ${name}?`, f, kr ? '밑면1+옆면n' : 'n+1');
  if (prop === 2) return w(kr ? `${name}의 모서리는 몇 개?` : `Edges of a ${name}?`, e, kr ? '2×n' : '2n');
  return w(kr ? `${name}의 꼭짓점은 몇 개?` : `Vertices of a ${name}?`, v, kr ? 'n+1' : 'n+1');
}

// ═══════════════════════════════════════
//  MEASUREMENT
// ═══════════════════════════════════════

function generateMeasCompare(s, kr) {
  const a = rInt(s, 5, 30); const b = rInt(s + 1, 5, 30);
  while (a === b) return generateMeasCompare(s + 10, kr);
  const items = kr ? ['연필', '지우개'] : ['pencil', 'eraser'];
  const bigger = Math.max(a, b);
  const q = kr ? `${items[0]}은 ${a}cm, ${items[1]}은 ${b}cm입니다. 더 긴 것은 몇 cm인가요?` : `${items[0]}: ${a}cm, ${items[1]}: ${b}cm. How long is the longer one?`;
  return w(q, bigger, kr ? '더 큰 수를 고르세요' : 'Pick the bigger number');
}

function generateLengthConvert(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) {
    const m = rInt(s + 1, 1, 20);
    const q = kr ? `${m}m는 몇 cm인가요?` : `How many cm is ${m}m?`;
    return w(q, m * 100, kr ? '1m=100cm' : '1m = 100cm');
  }
  if (variant === 2) {
    const cm = rInt(s + 1, 1, 90) * 10;
    const q = kr ? `${cm}cm는 몇 m인가요?` : `How many meters is ${cm}cm?`;
    return w(q, cm / 100, kr ? '100cm=1m' : '100cm = 1m');
  }
  const km = rInt(s + 1, 1, 10);
  const q = kr ? `${km}km는 몇 m인가요?` : `How many meters is ${km}km?`;
  return w(q, km * 1000, kr ? '1km=1000m' : '1km = 1000m');
}

function generateWeightConvert(s, kr) {
  const variant = rInt(s, 1, 2);
  if (variant === 1) {
    const kg = rInt(s + 1, 1, 10);
    const q = kr ? `${kg}kg은 몇 g인가요?` : `How many grams is ${kg}kg?`;
    return w(q, kg * 1000, kr ? '1kg=1000g' : '1kg = 1000g');
  }
  const g = rInt(s + 1, 1, 9) * 1000;
  const q = kr ? `${g}g은 몇 kg인가요?` : `How many kg is ${g}g?`;
  return w(q, g / 1000, kr ? '1000g=1kg' : '1000g = 1kg');
}

function generateCapacityConvert(s, kr) {
  const variant = rInt(s, 1, 2);
  if (variant === 1) {
    const L = rInt(s + 1, 1, 10);
    const q = kr ? `${L}L는 몇 mL인가요?` : `How many mL is ${L}L?`;
    return w(q, L * 1000, kr ? '1L=1000mL' : '1L = 1000mL');
  }
  const mL = rInt(s + 1, 1, 9) * 1000;
  const q = kr ? `${mL}mL는 몇 L인가요?` : `How many liters is ${mL}mL?`;
  return w(q, mL / 1000, kr ? '1000mL=1L' : '1000mL = 1L');
}

function generateMeasTime(s, kr) {
  const h1 = rInt(s, 1, 10); const m1 = rInt(s + 1, 0, 50);
  const addH = rInt(s + 2, 0, 3); const addM = rInt(s + 3, 10, 50);
  let totalM = m1 + addM; let totalH = h1 + addH;
  if (totalM >= 60) { totalM -= 60; totalH += 1; }
  if (totalH > 12) totalH -= 12;
  const q = kr
    ? `${h1}시 ${m1}분에서 ${addH}시간 ${addM}분 후는 몇 시 몇 분? (예: 3시 5분 → 305)`
    : `${h1}:${String(m1).padStart(2, '0')} plus ${addH}h ${addM}min = ? (e.g. 3:05 → 305)`;
  const ans = parseInt(`${totalH}${String(totalM).padStart(2, '0')}`);
  return w(q, ans, kr ? '시간끼리, 분끼리 더하세요' : 'Add hours and minutes separately');
}

function generateClock(s, kr) {
  const h = rInt(s, 1, 12);
  const mType = rInt(s + 1, 1, 3);
  const m = mType === 1 ? 0 : mType === 2 ? 30 : rInt(s + 2, 1, 11) * 5;
  const q = kr
    ? `시계의 짧은 바늘이 ${h}을 가리키고, 긴 바늘이 ${m === 0 ? 12 : m / 5}을 가리킵니다. 몇 시 몇 분? (예: 305)`
    : `The hour hand points to ${h}, the minute hand points to ${m === 0 ? 12 : m / 5}. What time? (e.g. 305)`;
  const ans = parseInt(`${h}${String(m).padStart(2, '0')}`);
  return w(q, ans, kr ? '짧은 바늘=시, 긴 바늘=분' : 'Short hand = hour, long hand = minutes');
}

function generateMoney(s, kr) {
  if (kr) {
    const items = [{ name: '사과', price: rInt(s, 5, 20) * 100 }, { name: '우유', price: rInt(s + 1, 5, 15) * 100 }];
    const total = items[0].price + items[1].price;
    const q = `${items[0].name} ${items[0].price}원과 ${items[1].name} ${items[1].price}원을 사면 모두 얼마?`;
    return w(q, total, '두 가격을 더하세요');
  }
  const coins = [25, 10, 5, 1];
  const coinNames = ['quarters', 'dimes', 'nickels', 'pennies'];
  const idx = rInt(s, 0, 3); const count = rInt(s + 1, 2, 8);
  const q = `You have ${count} ${coinNames[idx]}. How many cents total?`;
  return w(q, coins[idx] * count, 'Multiply the coin value by count');
}

function generateMeasCircle(s, kr) {
  const r = rInt(s, 2, 10);
  const variant = rInt(s + 1, 1, 2);
  if (variant === 1) {
    const q = kr ? `반지름 ${r}cm인 원의 넓이는? (원주율=3)` : `Area of circle with radius ${r}cm? (π=3)`;
    return w(q, r * r * 3, kr ? '반지름×반지름×원주율' : 'r²×π');
  }
  const q = kr ? `반지름 ${r}cm인 원의 둘레는? (원주율=3)` : `Circumference with radius ${r}cm? (π=3)`;
  return w(q, r * 2 * 3, kr ? '지름×원주율' : 'diameter × π');
}

// ═══════════════════════════════════════
//  DATA & STATISTICS
// ═══════════════════════════════════════

function generateDataClassify(s, kr) {
  const a = rInt(s, 2, 8); const b = rInt(s + 1, 2, 8); const c = rInt(s + 2, 2, 8);
  const total = a + b + c;
  if (kr) {
    const q = `사과 ${a}개, 배 ${b}개, 귤 ${c}개가 있습니다. 과일은 모두 몇 개?`;
    return w(q, total, '모두 더하세요');
  }
  const q = `There are ${a} apples, ${b} pears, and ${c} oranges. Total fruit?`;
  return w(q, total, 'Add them all');
}

function generateTableRead(s, kr) {
  const a = rInt(s, 5, 20); const b = rInt(s + 1, 5, 20); const c = rInt(s + 2, 5, 20);
  const biggest = Math.max(a, b, c);
  const variant = rInt(s + 3, 1, 2);
  const names = kr ? ['축구', '야구', '농구'] : ['Soccer', 'Baseball', 'Basketball'];
  if (variant === 1) {
    const q = kr
      ? `좋아하는 운동 조사: ${names[0]} ${a}명, ${names[1]} ${b}명, ${names[2]} ${c}명. 가장 많은 운동의 학생 수는?`
      : `Sport survey: ${names[0]} ${a}, ${names[1]} ${b}, ${names[2]} ${c}. Most popular sport had how many votes?`;
    return w(q, biggest, kr ? '가장 큰 수를 찾으세요' : 'Find the biggest number');
  }
  const q = kr
    ? `조사 결과: ${names[0]} ${a}명, ${names[1]} ${b}명, ${names[2]} ${c}명. 전체 학생 수는?`
    : `Survey: ${names[0]} ${a}, ${names[1]} ${b}, ${names[2]} ${c}. Total students?`;
  return w(q, a + b + c, kr ? '모두 더하세요' : 'Add them all');
}

function generateGraphRead(s, kr) {
  const vals = [rInt(s, 5, 30), rInt(s + 1, 5, 30), rInt(s + 2, 5, 30), rInt(s + 3, 5, 30)];
  const months = kr ? ['1월', '2월', '3월', '4월'] : ['Jan', 'Feb', 'Mar', 'Apr'];
  const diff = vals[3] - vals[0];
  const q = kr
    ? `막대그래프: ${months[0]} ${vals[0]}개, ${months[1]} ${vals[1]}개, ${months[2]} ${vals[2]}개, ${months[3]} ${vals[3]}개. ${months[0]}과 ${months[3]}의 차이는?`
    : `Bar graph: ${months[0]}=${vals[0]}, ${months[1]}=${vals[1]}, ${months[2]}=${vals[2]}, ${months[3]}=${vals[3]}. Difference between ${months[0]} and ${months[3]}?`;
  return w(q, Math.abs(diff), kr ? '큰 수에서 작은 수를 빼세요' : 'Subtract the smaller from larger');
}

function generateAverage(s, kr) {
  const n1 = rInt(s, 10, 50); const n2 = rInt(s + 1, 10, 50);
  const n3 = rInt(s + 2, 10, 50); const n4 = rInt(s + 3, 10, 50);
  const sum = n1 + n2 + n3 + n4;
  const rem = sum % 4;
  const adj = n4 + (rem === 0 ? 0 : 4 - rem);
  const newSum = n1 + n2 + n3 + adj;
  const q = kr
    ? `네 과목 점수: ${n1}, ${n2}, ${n3}, ${adj}. 평균은?`
    : `Four test scores: ${n1}, ${n2}, ${n3}, ${adj}. Average?`;
  return w(q, newSum / 4, kr ? '합÷4' : 'Sum ÷ 4');
}

function generateProbability(s, kr) {
  const variant = rInt(s, 1, 2);
  if (variant === 1) {
    const target = rInt(s + 1, 1, 6);
    const q = kr
      ? `주사위를 1번 굴릴 때 나올 수 있는 모든 경우의 수는?`
      : `How many possible outcomes when rolling a die once?`;
    return w(q, 6, kr ? '주사위 면은 6개' : 'A die has 6 faces');
  }
  const q = kr
    ? `동전 2개를 던질 때 나올 수 있는 모든 경우의 수는?`
    : `How many outcomes when flipping 2 coins?`;
  return w(q, 4, kr ? '2×2=4' : '2×2=4');
}

// ═══════════════════════════════════════
//  PATTERNS
// ═══════════════════════════════════════

function generatePatternRepeat(s, kr) {
  const symbols = ['○', '△', '□'];
  const len = rInt(s, 2, 3); // pattern unit length
  const pattern = [];
  for (let i = 0; i < len; i++) pattern.push(symbols[i % 3]);
  const seq = [...pattern, ...pattern, ...pattern];
  const ansIdx = seq.length; // next in sequence
  const ans = pattern[ansIdx % len];
  // Since answer must be numeric, map to index
  const ansNum = symbols.indexOf(ans) + 1;
  const display = seq.join('') + '_';
  const legend = `(${symbols.map((s, i) => `${s}→${i + 1}`).join(', ')})`;
  const q = kr ? `규칙: ${display} 빈칸에 올 모양은? ${legend}` : `Pattern: ${display} What comes next? ${legend}`;
  return w(q, ansNum, kr ? '반복 규칙을 찾으세요' : 'Find the repeating pattern');
}

function generatePatternNumber(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) { // 등차
    const start = rInt(s + 1, 2, 20); const diff = rInt(s + 2, 2, 10);
    const seq = [start, start + diff, start + diff * 2, start + diff * 3];
    const q = kr ? `${seq.join(', ')}, ___` : `${seq.join(', ')}, ___`;
    return w(q, start + diff * 4, kr ? `${diff}씩 커집니다` : `Adding ${diff} each time`);
  }
  if (variant === 2) { // 등비
    const start = rInt(s + 1, 2, 4); const ratio = rInt(s + 2, 2, 3);
    const seq = [start, start * ratio, start * ratio ** 2, start * ratio ** 3];
    const q = kr ? `${seq.join(', ')}, ___` : `${seq.join(', ')}, ___`;
    return w(q, start * ratio ** 4, kr ? `${ratio}배씩 커집니다` : `Multiplying by ${ratio}`);
  }
  // 제곱수
  const n = rInt(s + 1, 1, 5);
  const seq = [n * n, (n + 1) ** 2, (n + 2) ** 2, (n + 3) ** 2];
  const q = kr ? `${seq.join(', ')}, ___` : `${seq.join(', ')}, ___`;
  return w(q, (n + 4) ** 2, kr ? '제곱수 규칙입니다' : 'Square numbers');
}

function generatePatternGrowth(s, kr) {
  const start = rInt(s, 2, 10); const step = rInt(s + 1, 1, 5);
  const seq = [start, start + step, start + step + (step + 1), start + step + (step + 1) + (step + 2)];
  const ans = seq[3] + (step + 3);
  const q = kr ? `${seq.join(', ')}, ___ (더하는 수가 커져요)` : `${seq.join(', ')}, ___ (the added number grows)`;
  return w(q, ans, kr ? '더해지는 수가 1씩 커집니다' : 'The added number increases by 1');
}

function generateCorrespondence(s, kr) {
  const a = rInt(s, 1, 5); const b = rInt(s + 1, 1, 10);
  // y = a*x + b pattern
  const x1 = 1; const x2 = 2; const x3 = 3;
  const y1 = a * x1 + b; const y2 = a * x2 + b; const y3 = a * x3 + b;
  const q = kr
    ? `x가 ${x1}일 때 y는 ${y1}, x가 ${x2}일 때 y는 ${y2}, x가 ${x3}일 때 y는?`
    : `When x=${x1}, y=${y1}. When x=${x2}, y=${y2}. When x=${x3}, y=?`;
  return w(q, y3, kr ? '규칙을 찾으세요' : 'Find the rule');
}

// ═══════════════════════════════════════
//  FRACTIONS & DECIMALS
// ═══════════════════════════════════════

function generateFracConcept(s, kr) {
  const total = rInt(s, 4, 12); const part = rInt(s + 1, 1, total - 1);
  const q = kr
    ? `피자를 ${total}조각으로 나누어 ${part}조각을 먹었습니다. 남은 것은 몇 조각?`
    : `A pizza is cut into ${total} slices. ${part} slices eaten. How many left?`;
  return w(q, total - part, kr ? '전체에서 빼세요' : 'Subtract from total');
}

function generateFracAddSame(s, kr) {
  const d = rInt(s, 3, 12);
  const n1 = rInt(s + 1, 1, d - 1);
  const n2 = rInt(s + 2, 1, d - 1);
  const q = `${n1}/${d} + ${n2}/${d} = ?/${d}`;
  return { type: 'frac', question: q, answer: n1 + n2, isTextAnswer: false, hint: kr ? '분자끼리 더하세요' : 'Add the numerators' };
}

function generateFracSubSame(s, kr) {
  const d = rInt(s, 3, 12);
  const n1 = rInt(s + 1, 2, d); const n2 = rInt(s + 2, 1, n1 - 1);
  const q = `${n1}/${d} - ${n2}/${d} = ?/${d}`;
  return { type: 'frac', question: q, answer: n1 - n2, isTextAnswer: false, hint: kr ? '분자끼리 빼세요' : 'Subtract numerators' };
}

function generateFracAddDiff(s, kr) {
  const d1 = rInt(s, 2, 6); const d2 = rInt(s + 1, 2, 6);
  const lcd = lcm(d1, d2);
  const n1 = rInt(s + 2, 1, d1 - 1); const n2 = rInt(s + 3, 1, d2 - 1);
  const result = n1 * (lcd / d1) + n2 * (lcd / d2);
  const q = `${n1}/${d1} + ${n2}/${d2} = ?/${lcd}`;
  return { type: 'frac', question: q, answer: result, isTextAnswer: false, hint: kr ? '통분하여 분자를 더하세요' : 'Find LCD, then add numerators' };
}

function generateFracSubDiff(s, kr) {
  const d1 = rInt(s, 2, 6); const d2 = rInt(s + 1, 2, 6);
  const lcd = lcm(d1, d2);
  let n1 = rInt(s + 2, 1, d1 - 1); let n2 = rInt(s + 3, 1, d2 - 1);
  let v1 = n1 * (lcd / d1); let v2 = n2 * (lcd / d2);
  if (v1 < v2) { [n1, n2] = [n2, n1]; [d1, d2] = [d2, d1]; v1 = n1 * (lcd / d1); v2 = n2 * (lcd / d2); }
  // Actually need to swap d1/d2 properly - let's just ensure v1 >= v2
  const big = Math.max(v1, v2); const small = Math.min(v1, v2);
  const q = kr ? `통분 후 빼기: ?/${lcd} (${n1}/${d1} - ${n2}/${d2}의 분자)` : `${n1}/${d1} - ${n2}/${d2} = ?/${lcd}`;
  return { type: 'frac', question: q, answer: big - small, isTextAnswer: false, hint: kr ? '통분 후 분자를 빼세요' : 'Find LCD, subtract numerators' };
}

function generateFracMixedAdd(s, kr) {
  const d = rInt(s, 3, 8);
  const w1 = rInt(s + 1, 1, 5); const n1 = rInt(s + 2, 1, d - 1);
  const w2 = rInt(s + 3, 1, 3); const n2 = rInt(s + 4, 1, d - 1);
  const totalN = n1 + n2;
  const extraW = Math.floor(totalN / d);
  const remN = totalN % d;
  const ans = w1 + w2 + extraW;
  const q = kr
    ? `${w1}과 ${n1}/${d} + ${w2}과 ${n2}/${d}의 자연수 부분은? (분수 부분: ${remN}/${d})`
    : `${w1} ${n1}/${d} + ${w2} ${n2}/${d}. Whole number part? (fraction part: ${remN}/${d})`;
  return w(q, ans, kr ? '자연수끼리, 분수끼리 더하세요' : 'Add whole numbers, then fractions');
}

function generateFracMul(s, kr) {
  const d = rInt(s, 3, 9);
  const n = rInt(s + 1, 1, d - 1);
  const natural = rInt(s + 2, 2, 7);
  const q = `${n}/${d} × ${natural} = ?/${d}`;
  return { type: 'frac', question: q, answer: n * natural, isTextAnswer: false, hint: kr ? '분자×자연수' : 'Numerator × whole number' };
}

function generateFracDiv(s, kr) {
  const d = rInt(s, 3, 9);
  const natural = rInt(s + 1, 2, 6);
  const ansN = rInt(s + 2, 1, 8);
  const startN = ansN * natural;
  const q = `${startN}/${d} ÷ ${natural} = ?/${d}`;
  return { type: 'frac', question: q, answer: ansN, isTextAnswer: false, hint: kr ? '분자÷자연수' : 'Numerator ÷ whole number' };
}

function generateDecMul(s, kr) {
  const a = rInt(s, 2, 9); const b = rInt(s + 1, 2, 9);
  const d1 = a / 10; const result = (a * b / 10).toFixed(1);
  const q = kr ? `${d1} × ${b} = ?` : `${d1} × ${b} = ?`;
  return { type: 'word', question: q, answer: result, isTextAnswer: true, hint: kr ? '소수×자연수' : 'Decimal × whole number' };
}

function generateDecDiv(s, kr) {
  const divisor = rInt(s, 2, 5);
  const quotient = rInt(s + 1, 1, 9);
  const dividend = (divisor * quotient / 10).toFixed(1);
  const q = kr ? `${dividend} ÷ ${divisor} = ?` : `${dividend} ÷ ${divisor} = ?`;
  return { type: 'word', question: q, answer: (quotient / 10).toFixed(1), isTextAnswer: true, hint: kr ? '소수÷자연수' : 'Decimal ÷ whole number' };
}

function generateFracDecConvert(s, kr) {
  const pairs = [[1, 2, '0.5'], [1, 4, '0.25'], [3, 4, '0.75'], [1, 5, '0.2'], [2, 5, '0.4']];
  const [n, d, dec] = pick(s, pairs);
  const variant = rInt(s + 1, 1, 2);
  if (variant === 1) {
    const q = kr ? `${n}/${d}을 소수로 나타내면?` : `Convert ${n}/${d} to a decimal?`;
    return { type: 'word', question: q, answer: dec, isTextAnswer: true, hint: kr ? '분자÷분모' : 'Numerator ÷ denominator' };
  }
  const q = kr ? `${dec}을 기약분수로 나타낼 때 분자는? (분모: ${d})` : `${dec} as a fraction: ?/${d}`;
  return w(q, n, kr ? '소수를 분수로 바꾸세요' : 'Convert decimal to fraction');
}

function generateFracDecMixed(s, kr) {
  const a = rInt(s, 1, 5); const b = rInt(s + 1, 1, 9);
  const dec = (b / 10).toFixed(1);
  const sum = a + b / 10;
  const q = kr ? `${a} + ${dec} = ?` : `${a} + ${dec} = ?`;
  return { type: 'word', question: q, answer: sum.toFixed(1), isTextAnswer: true, hint: kr ? '자연수+소수' : 'Whole number + decimal' };
}

function generateDecAddSub(s, kr) {
  const a = rInt(s, 10, 90); const b = rInt(s + 1, 10, 90);
  const d1 = (a / 10).toFixed(1); const d2 = (b / 10).toFixed(1);
  const isAdd = rInt(s + 2, 1, 2) === 1;
  if (isAdd) {
    const q = `${d1} + ${d2} = ?`;
    return { type: 'word', question: q, answer: ((a + b) / 10).toFixed(1), isTextAnswer: true, hint: kr ? '소수점을 맞추어 더하세요' : 'Align decimals, then add' };
  }
  const big = Math.max(a, b); const small = Math.min(a, b);
  const q = `${(big / 10).toFixed(1)} - ${(small / 10).toFixed(1)} = ?`;
  return { type: 'word', question: q, answer: ((big - small) / 10).toFixed(1), isTextAnswer: true, hint: kr ? '소수점을 맞추어 빼세요' : 'Align decimals, then subtract' };
}

// ═══════════════════════════════════════
//  NUMBER THEORY
// ═══════════════════════════════════════

function generateGcdLcm(s, kr) {
  const a = rInt(s, 4, 30); const b = rInt(s + 1, 4, 30);
  const g = gcd(a, b); const l = (a * b) / g;
  const variant = rInt(s + 2, 1, 2);
  if (variant === 1) {
    const q = kr ? `${a}와 ${b}의 최대공약수는?` : `GCD of ${a} and ${b}?`;
    return w(q, g, kr ? '공통으로 나눌 수 있는 가장 큰 수' : 'Largest number that divides both');
  }
  const q = kr ? `${a}와 ${b}의 최소공배수는?` : `LCM of ${a} and ${b}?`;
  return w(q, l, kr ? '공통 배수 중 가장 작은 수' : 'Smallest common multiple');
}

function generateFactorMultiple(s, kr) {
  const n = rInt(s, 6, 36);
  const variant = rInt(s + 1, 1, 2);
  if (variant === 1) {
    let count = 0;
    for (let i = 1; i <= n; i++) { if (n % i === 0) count++; }
    const q = kr ? `${n}의 약수는 모두 몇 개인가요?` : `How many factors does ${n} have?`;
    return w(q, count, kr ? '1부터 나누어 떨어지는 수를 세세요' : 'Count numbers that divide evenly');
  }
  const m = rInt(s + 2, 2, 9);
  const q = kr ? `${m}의 배수 중 ${n}보다 작거나 같은 것은 몇 개?` : `How many multiples of ${m} are ≤ ${n}?`;
  return w(q, Math.floor(n / m), kr ? '나누기의 몫입니다' : 'Divide and take the quotient');
}

// ═══════════════════════════════════════
//  RATIO & PERCENT
// ═══════════════════════════════════════

function generateRatioBasic(s, kr) {
  const a = rInt(s, 2, 8); const b = rInt(s + 1, 2, 8);
  const variant = rInt(s + 2, 1, 2);
  if (variant === 1) {
    const q = kr ? `${a} : ${b}에서 전항은?` : `In the ratio ${a}:${b}, what is the antecedent?`;
    return w(q, a, kr ? '앞의 수가 전항입니다' : 'The first number');
  }
  const q = kr ? `${a} : ${b}에서 비의 값은? (소수 둘째자리에서 반올림, 단 나누어 떨어지면 자연수)` : `Ratio value of ${a}:${b}? (as a number)`;
  const val = a / b;
  if (Number.isInteger(val)) return w(q, val, kr ? '전항÷후항' : 'Antecedent ÷ consequent');
  return w(q, a, kr ? '전항을 구하세요' : 'Find the antecedent'); // simplify to just ask antecedent
}

function generatePercent(s, kr) {
  const total = rInt(s, 2, 10) * 100;
  const pct = rInt(s + 1, 1, 9) * 10;
  const q = kr ? `${total}원의 ${pct}%는 얼마?` : `What is ${pct}% of ${total}?`;
  return w(q, (total * pct) / 100, kr ? '비율을 곱하세요' : 'Multiply by the percent');
}

function generateProportion(s, kr) {
  const a = rInt(s, 2, 8); const b = rInt(s + 1, 2, 8);
  const m = rInt(s + 2, 2, 5);
  const q = kr ? `${a} : ${b} = ${a * m} : x. x는?` : `${a}:${b} = ${a * m}:x. Find x.`;
  return w(q, b * m, kr ? '외항의 곱=내항의 곱' : 'Cross multiply');
}

function generateRatioWord(s, kr) {
  const variant = rInt(s, 1, 3);
  if (variant === 1) { // 속력
    const speed = rInt(s + 1, 40, 80); const time = rInt(s + 2, 2, 5);
    const q = kr ? `시속 ${speed}km로 ${time}시간 달리면 몇 km?` : `Traveling at ${speed}km/h for ${time} hours. Distance?`;
    return w(q, speed * time, kr ? '속력×시간=거리' : 'Speed × Time = Distance');
  }
  if (variant === 2) { // 할인
    const price = rInt(s + 1, 2, 10) * 1000; const discount = rInt(s + 2, 1, 4) * 10;
    const q = kr ? `${price}원짜리 물건을 ${discount}% 할인하면?` : `$${price / 100} item, ${discount}% off. Final price?`;
    const ans = kr ? price - (price * discount / 100) : (price / 100) - ((price / 100) * discount / 100);
    return w(q, kr ? price - (price * discount / 100) : Math.round(ans), kr ? '원래 가격 - 할인액' : 'Original - discount');
  }
  // 농도 (간단)
  const sugar = rInt(s + 1, 10, 50); const water = rInt(s + 2, 100, 300);
  const total = sugar + water;
  const q = kr ? `설탕 ${sugar}g을 물 ${water}g에 녹이면 설탕물은 모두 몇 g?` : `${sugar}g sugar dissolved in ${water}g water. Total weight?`;
  return w(q, total, kr ? '설탕+물' : 'Sugar + water');
}

// ═══════════════════════════════════════
//  EQUATIONS
// ═══════════════════════════════════════

function generateEquationBasic(s, kr) {
  const a = rInt(s, 2, 20); const b = rInt(s + 1, 3, 30);
  const op = rInt(s + 2, 1, 2);
  if (op === 1) {
    const q = kr ? `□ + ${a} = ${a + b}. □는?` : `□ + ${a} = ${a + b}. □ = ?`;
    return w(q, b, kr ? '양변에서 빼세요' : 'Subtract from both sides');
  }
  const q = kr ? `${a + b} - □ = ${a}. □는?` : `${a + b} - □ = ${a}. □ = ?`;
  return w(q, b, kr ? '빈칸을 구하세요' : 'Find the missing number');
}

function generateEquationX(s, kr) {
  const x = rInt(s, 2, 12); const a = rInt(s + 1, 2, 8); const b = rInt(s + 2, 5, 30);
  const c = a * x + b;
  const q = kr ? `${a}x + ${b} = ${c}일 때, x는?` : `${a}x + ${b} = ${c}. x = ?`;
  return w(q, x, kr ? '상수를 이항하고 나누세요' : 'Isolate x');
}

function generateMixedOperations(s, kr) {
  const a = rInt(s, 2, 10); const b = rInt(s + 1, 2, 10); const c = rInt(s + 2, 1, 5);
  const variant = rInt(s + 3, 1, 2);
  if (variant === 1) {
    const ans = a + b * c;
    const q = kr ? `${a} + ${b} × ${c} = ?` : `${a} + ${b} × ${c} = ?`;
    return w(q, ans, kr ? '곱셈을 먼저 계산하세요' : 'Multiply first');
  }
  const ans = a * b - c;
  const q = kr ? `${a} × ${b} - ${c} = ?` : `${a} × ${b} - ${c} = ?`;
  return w(q, ans, kr ? '곱셈을 먼저 계산하세요' : 'Multiply first');
}

// ═══════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════

function w(question, answer, hint) {
  return { type: 'word', question, answer, isTextAnswer: false, hint };
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
function lcm(a, b) { return (a * b) / gcd(a, b); }
