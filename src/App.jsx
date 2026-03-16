import React, { useState, useEffect } from 'react';
import { ChevronRight, Star, Zap, Trophy } from 'lucide-react';

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

const CURRICULUM = {
  '4': [
    { week: 1, topic: '덧셈과 뺄셈 기초', type: 'addition-subtraction', range: [1, 100] },
    { week: 2, topic: '3자리 수 덧셈(받아올림)', type: 'addition-advanced', range: [100, 999] },
    { week: 3, topic: '나눗셈의 개념', type: 'division-basic', range: [2, 9] },
    { week: 4, topic: '나눗셈 문제해결', type: 'division-advanced', range: [2, 9] },
    { week: 5, topic: '곱셈(한자리수)', type: 'multiplication-basic', range: [2, 9] },
    { week: 6, topic: '곱셈(받아올림)', type: 'multiplication-middle', range: [10, 99] },
    { week: 7, topic: '두자리수 곱셈', type: 'multiplication-advanced', range: [10, 99] },
    { week: 8, topic: '사칙연산 혼합 1', type: 'mixed-1', range: [1, 999] },
    { week: 9, topic: '사칙연산 혼합 2', type: 'mixed-2', range: [1, 999] },
    { week: 10, topic: '사칙연산 혼합 3', type: 'mixed-3', range: [1, 999] },
    { week: 11, topic: '1-5주 복습', type: 'review-1', range: [1, 999] },
    { week: 12, topic: '6-10주 복습', type: 'review-2', range: [1, 999] },
    { week: 13, topic: '전체 최종복습 1', type: 'final-1', range: [1, 999] },
    { week: 14, topic: '전체 최종복습 2', type: 'final-2', range: [1, 999] },
    { week: 15, topic: '전체 최종복습 3', type: 'final-3', range: [1, 999] },
    { week: 16, topic: '전체 최종복습 4', type: 'final-4', range: [1, 999] },
    { week: 17, topic: '전체 최종복습 5', type: 'final-5', range: [1, 999] },
    { week: 18, topic: '전체 최종복습 6', type: 'final-6', range: [1, 999] },
  ],
  '2': [
    { week: 1, topic: '덧셈(10 이내)', type: 'addition-basic', range: [1, 10] },
    { week: 2, topic: '덧셈(20 이내)', type: 'addition-middle', range: [1, 20] },
    { week: 3, topic: '뺄셈(10 이내)', type: 'subtraction-basic', range: [1, 10] },
    { week: 4, topic: '뺄셈(20 이내)', type: 'subtraction-middle', range: [1, 20] },
    { week: 5, topic: '덧셈/뺄셈 혼합 1', type: 'mixed-1', range: [1, 20] },
    { week: 6, topic: '덧셈/뺄셈 혼합 2', type: 'mixed-2', range: [1, 20] },
    { week: 7, topic: '덧셈/뺄셈 혼합 3', type: 'mixed-3', range: [1, 20] },
    { week: 8, topic: '덧셈/뺄셈 혼합 4', type: 'mixed-4', range: [1, 20] },
    { week: 9, topic: '1-4주 복습', type: 'review-1', range: [1, 20] },
    { week: 10, topic: '5-8주 복습', type: 'review-2', range: [1, 20] },
    { week: 11, topic: '전체복습 1', type: 'final-1', range: [1, 20] },
    { week: 12, topic: '전체복습 2', type: 'final-2', range: [1, 20] },
    { week: 13, topic: '전체복습 3', type: 'final-3', range: [1, 20] },
    { week: 14, topic: '전체복습 4', type: 'final-4', range: [1, 20] },
    { week: 15, topic: '전체복습 5', type: 'final-5', range: [1, 20] },
    { week: 16, topic: '전체복습 6', type: 'final-6', range: [1, 20] },
    { week: 17, topic: '전체복습 7', type: 'final-7', range: [1, 20] },
    { week: 18, topic: '전체복습 8', type: 'final-8', range: [1, 20] },
  ]
};

const REASONING_BANK = [
  { question: '3, 6, 9, 12, __는 무엇인가요?', answer: 15, hint: '3씩 커지는 규칙을 찾으세요!' },
  { question: '□ × 4 = 20일 때, □는 무엇인가요?', answer: 5, hint: '곱셈의 반대로 생각해보세요!' },
  { question: '2, 4, 8, 16, __는 무엇인가요?', answer: 32, hint: '2배씩 커집니다!' },
  { question: '10 = 5 + 5 = 3 + 7 = 4 + 6 = 2 + ?', answer: 8, hint: '10을 만드는 수를 찾으세요!' },
  { question: '1, 4, 9, 16, __는 무엇인가요?', answer: 25, hint: '1², 2², 3², 4², ...의 패턴입니다!' },
  { question: '첫 번째: 1개, 두 번째: 3개, 세 번째: 5개, 네 번째: ?개', answer: 7, hint: '2씩 증가합니다!' },
  { question: '□ ÷ 3 = 6일 때, □는 무엇인가요?', answer: 18, hint: '나눗셈의 반대로 생각하세요!' },
  { question: '10, 20, 30, 40, __는 무엇인가요?', answer: 50, hint: '10씩 커집니다!' },
  { question: '■ + ■ = 14일 때, ■는 무엇인가요?', answer: 7, hint: '같은 수 2개를 더하면 14입니다!' },
  { question: '5 + ? = 12일 때, ?는 무엇인가요?', answer: 7, hint: '역으로 계산해보세요!' }
];

export default function MathDaily90() {
  const [mode, setMode] = useState(null);
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const getWeekInfo = () => {
    const today = new Date();
    const startDate = new Date(2026, 2, 9);
    let businessDay = 0;
    let currentDate = new Date(startDate);
    
    while (currentDate <= today && businessDay < 90) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        businessDay++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const week = Math.min(Math.ceil(businessDay / 5), 18);
    const dayOfWeek = businessDay % 5 || 5;
    
    return { week, dayOfWeek, businessDay: Math.min(businessDay, 90) };
  };

  const getTodaySeed = () => {
    const today = new Date();
    return today.getFullYear() * 10000 + 
           (today.getMonth() + 1) * 100 + 
           today.getDate();
  };

  const seedRandom = (index, seed) => {
    return seededRandom(seed + index * 12345);
  };

  const generateProblems = (gradeMode) => {
    const problems = [];
    const { week } = getWeekInfo();
    const today = getTodaySeed();
    const isGrade4 = gradeMode === '4';
    
    const curriculum = CURRICULUM[gradeMode][week - 1];
    const { type, range } = curriculum;

    for (let i = 0; i < 27; i++) {
      let problem;
      const seed = today + i;
      const rand1 = Math.floor(seedRandom(i, seed) * (range[1] - range[0])) + range[0];
      const rand2 = Math.floor(seedRandom(i + 100, seed) * (range[1] - range[0])) + range[0];

      if (isGrade4) {
        if (type.includes('addition')) {
          problem = {
            type: 'basic',
            question: `${rand1} + ${rand2} = ?`,
            answer: rand1 + rand2,
            operation: '+'
          };
        } else if (type.includes('subtraction')) {
          const a = Math.max(rand1, rand2);
          const b = Math.min(rand1, rand2);
          problem = {
            type: 'basic',
            question: `${a} - ${b} = ?`,
            answer: a - b,
            operation: '-'
          };
        } else if (type.includes('multiplication')) {
          problem = {
            type: 'basic',
            question: `${rand1 % 10 || 2} × ${rand2 % 10 || 2} = ?`,
            answer: (rand1 % 10 || 2) * (rand2 % 10 || 2),
            operation: '×'
          };
        } else if (type.includes('division')) {
          const divisor = (rand1 % 8) + 2;
          const quotient = (rand2 % 8) + 2;
          problem = {
            type: 'basic',
            question: `${divisor * quotient} ÷ ${divisor} = ?`,
            answer: quotient,
            operation: '÷'
          };
        } else {
          const ops = ['+', '-', '×', '÷'];
          const op = ops[Math.floor(seedRandom(i + 200, seed) * 4)];
          
          if (op === '+') {
            problem = {
              type: 'basic',
              question: `${rand1} + ${rand2} = ?`,
              answer: rand1 + rand2,
              operation: '+'
            };
          } else if (op === '-') {
            const a = Math.max(rand1, rand2);
            const b = Math.min(rand1, rand2);
            problem = {
              type: 'basic',
              question: `${a} - ${b} = ?`,
              answer: a - b,
              operation: '-'
            };
          } else if (op === '×') {
            const x = (rand1 % 9) + 2;
            const y = (rand2 % 9) + 2;
            problem = {
              type: 'basic',
              question: `${x} × ${y} = ?`,
              answer: x * y,
              operation: '×'
            };
          } else {
            const divisor = (rand1 % 8) + 2;
            const quotient = (rand2 % 8) + 2;
            problem = {
              type: 'basic',
              question: `${divisor * quotient} ÷ ${divisor} = ?`,
              answer: quotient,
              operation: '÷'
            };
          }
        }
      } else {
        if (type.includes('addition')) {
          problem = {
            type: 'basic',
            question: `${rand1 % 10} + ${rand2 % 10} = ?`,
            answer: (rand1 % 10) + (rand2 % 10),
            operation: '+'
          };
        } else {
          const a = rand1 % 15;
          const b = Math.min(a, rand2 % 15);
          problem = {
            type: 'basic',
            question: `${a} - ${b} = ?`,
            answer: a - b,
            operation: '-'
          };
        }
      }

      problems.push(problem);
    }

    const reasoning1 = REASONING_BANK[Math.floor(seedRandom(0, today) * REASONING_BANK.length)];
    const reasoning2 = REASONING_BANK[Math.floor(seedRandom(1, today) * REASONING_BANK.length)];
    const reasoning3 = REASONING_BANK[Math.floor(seedRandom(2, today) * REASONING_BANK.length)];

    problems.splice(29, 0, { ...reasoning3, type: 'reasoning' });
    problems.splice(19, 0, { ...reasoning2, type: 'reasoning' });
    problems.splice(9, 0, { ...reasoning1, type: 'reasoning' });

    return problems;
  };

  useEffect(() => {
    if (mode) {
      setProblems(generateProblems(mode));
      setCurrentIndex(0);
      setScore(0);
      setUserAnswer('');
      setFeedback('');
      setShowFeedback(false);
      setSessionComplete(false);
    }
  }, [mode]);

  const handleAnswer = () => {
    if (!userAnswer.trim()) return;

    const current = problems[currentIndex];
    const userNum = parseInt(userAnswer) || 0;

    const isCorrect = userNum === current.answer;

    if (isCorrect) {
      setScore(score + 1);
      const msgs = ['🎉 정답!', '⭐ 완벽!', '🌟 천재!', '💪 대단!', '✨ 최고!', '🔥 훌륭!'];
      setFeedback(msgs[Math.floor(seedRandom(currentIndex, getTodaySeed()) * msgs.length)]);
    } else {
      setFeedback(`아쉬워요! 정답은 ${current.answer}입니다.`);
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setShowFeedback(false);
      } else {
        setSessionComplete(true);
      }
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  if (!mode) {
    const { week, dayOfWeek, businessDay } = getWeekInfo();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-yellow-300 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-5xl font-black mb-2 text-white drop-shadow-lg">🧮 90일 수학 완성!</h1>
          <p className="text-sm text-white mb-8 drop-shadow-md font-bold">
            📅 Day {businessDay} / 90 | 📆 {week}주차 {dayOfWeek}일차
          </p>
          
          <div className="bg-white bg-opacity-20 rounded-3xl p-6 mb-8 backdrop-blur-sm">
            <p className="text-lg text-white font-bold mb-2">💡 90일 코스란?</p>
            <p className="text-white text-sm">월~금 매일 30문제, 3개월 동안</p>
            <p className="text-white text-sm">기초부터 심화까지 체계적으로 배워요!</p>
          </div>

          <div className="flex gap-8 justify-center flex-wrap">
            <button
              onClick={() => setMode('4')}
              className="bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-12 py-8 rounded-3xl font-bold text-3xl shadow-xl transform transition hover:scale-105 active:scale-95"
            >
              <div className="mb-2">🎒</div>
              4학년 과정
              <div className="text-sm mt-2">(3학년 복습)</div>
            </button>

            <button
              onClick={() => setMode('2')}
              className="bg-gradient-to-br from-pink-400 to-red-400 hover:from-pink-500 hover:to-red-500 text-white px-12 py-8 rounded-3xl font-bold text-3xl shadow-xl transform transition hover:scale-105 active:scale-95"
            >
              <div className="mb-2">🌸</div>
              2학년 과정
              <div className="text-sm mt-2">(1학년 복습)</div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (problems.length === 0) {
    return <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-200 to-lime-200 flex items-center justify-center"><div className="text-4xl font-black">📚 준비 중...</div></div>;
  }

  if (sessionComplete) {
    const percentage = Math.round((score / problems.length) * 100);
    const { week, dayOfWeek } = getWeekInfo();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-emerald-300 to-teal-300 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-7xl mb-6 animate-bounce">🏆</div>
          <h1 className="text-4xl font-black mb-4 text-white drop-shadow-lg">축하합니다!</h1>
          <div className="bg-white bg-opacity-90 rounded-3xl p-8 shadow-2xl max-w-md mx-auto">
            <p className="text-xl text-gray-700 mb-4 font-bold">{week}주차 {dayOfWeek}일차 완료</p>
            <p className="text-6xl font-black text-blue-600 mb-4">{percentage}%</p>
            <p className="text-2xl font-bold text-gray-800 mb-6">{score} / {problems.length}개 정답!</p>
            
            <div className="mb-8 text-lg">
              {percentage === 100 && <p className="text-green-600 font-bold text-xl">👑 완벽합니다!</p>}
              {percentage >= 90 && percentage < 100 && <p className="text-green-600 font-bold">⭐ 정말 잘했어요!</p>}
              {percentage >= 70 && percentage < 90 && <p className="text-blue-600 font-bold">💪 고생했어요!</p>}
              {percentage < 70 && <p className="text-orange-600 font-bold">내일 다시! 화이팅!</p>}
            </div>

            <button
              onClick={() => setMode(null)}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-lg w-full"
            >
              나가기 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = problems[currentIndex];
  const progress = Math.round(((currentIndex + 1) / problems.length) * 100);
  const { week, dayOfWeek } = getWeekInfo();
  const curriculum = CURRICULUM[mode][week - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-yellow-200 to-lime-200 p-4">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">⭐</span>
            <span className="text-2xl font-bold text-blue-700">{score}점</span>
          </div>
          
          <div className="text-center">
            <div className="text-sm font-bold text-gray-700">{week}주차 {dayOfWeek}일차</div>
            <div className="text-xl font-black text-purple-700">{currentIndex + 1} / {problems.length}</div>
          </div>

          <button onClick={() => setMode(null)} className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold">
            나가기
          </button>
        </div>

        <div className="w-full bg-white rounded-full h-6 shadow-md overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-center text-sm font-bold text-gray-700 mt-2">{progress}% | {curriculum.topic}</div>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 min-h-96 flex flex-col justify-between">
          
          {current?.type === 'reasoning' && (
            <div className="mb-4 inline-block bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-2 rounded-full font-bold text-sm">
              🧠 뇌 깨우기!
            </div>
          )}

          <div className="text-center mb-8">
            <div className="text-6xl font-black text-blue-600 mb-6 p-8 bg-blue-50 rounded-2xl">
              {current?.question}
            </div>
            
            {current?.hint && (
              <div className="text-lg text-gray-600 italic mt-4 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
                💡 {current.hint}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="답을 입력하세요"
                disabled={showFeedback}
                className="flex-1 px-6 py-4 text-2xl font-bold rounded-2xl border-4 border-blue-400 focus:outline-none disabled:bg-gray-100"
                autoFocus
              />
              <button
                onClick={() => handleAnswer()}
                disabled={showFeedback || !userAnswer.trim()}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-4 rounded-2xl font-bold text-2xl"
              >
                확인 ✓
              </button>
            </div>

            {showFeedback && (
              <div className={`text-center p-6 rounded-2xl text-2xl font-bold animate-pulse ${
                feedback.includes('정답') ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'
              }`}>
                {feedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
