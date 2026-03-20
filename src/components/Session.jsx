import React, { useState, useEffect } from 'react';
import { seedRandom, getSeedForDay } from '../utils/problemGenerator';
import AdBanner from './AdBanner';

export default function Session({ 
  region, grade, currentDay,
  problems, currentIndex, setCurrentIndex, score, setScore, 
  reviewMode, setReviewMode, incorrectProblems, setIncorrectProblems,
  setSessionComplete, onExit 
}) {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // i18n
  const isUS = region === 'US';
  const gradeLabel = grade === 'K' ? 'Kindergarten' : `Grade ${grade}`;
  const tTitle = isUS ? `${gradeLabel} | Day ${currentDay} of 90` : `${grade}학년 | ${currentDay}일차 / 90일`;
  const tExit = isUS ? 'Exit' : '나가기';
  const tScore = isUS ? 'Score' : '점수';
  const tPlaceholder = isUS ? 'Your answer?' : '정답은?';
  const tSubmit = isUS ? 'Submit' : '입력';

  const renderQuestion = (current) => {
    if (!current) return null;
    
    // Vertical Layout
    if (current.type === 'basic' && ['+', '-', '×'].includes(current.operation)) {
      const match = current.question.match(/^(\d+)\s+([+\-×])\s+(\d+)\s+=\s+\?$/);
      if (match) {
        return (
          <div className="flex flex-col items-end text-7xl md:text-8xl font-black font-mono w-fit mx-auto text-gray-800 tracking-wider">
            <div className="pr-2">{match[1]}</div>
            <div className="flex w-full min-w-[3em] justify-between items-end mt-2 border-b-8 border-gray-800 pb-4">
              <span className="text-blue-500 pr-6">{match[2]}</span>
              <span className="pr-2">{match[3]}</span>
            </div>
          </div>
        );
      }
    }
    
    // Fraction Layout
    if (current.type === 'frac') {
      const tokens = current.question.split(' ');
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 text-5xl md:text-6xl font-black text-gray-800 p-8 bg-white rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] border-4 border-blue-100">
          {tokens.map((token, i) => {
            if (token.includes('/')) {
              const [num, den] = token.split('/');
              return (
                <div key={i} className="flex flex-col items-center justify-center mx-1">
                  <span className={`leading-none ${num === '?' ? 'text-blue-500' : ''}`}>{num}</span>
                  <span className="w-[110%] h-[4px] md:h-[6px] bg-gray-800 my-1 md:my-2 rounded-full"></span>
                  <span className="leading-none">{den}</span>
                </div>
              );
            }
            return <div key={i} className="mx-1 pt-2">{token}</div>;
          })}
        </div>
      );
    }

    // Default Layout
    return (
      <div className="text-4xl md:text-6xl font-black text-gray-800 p-10 bg-white rounded-3xl shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] border-4 border-blue-100 break-keep leading-tight">
        {current.question}
      </div>
    );
  };

  const handleAnswer = () => {
    if (!userAnswer.trim()) return;

    const current = problems[currentIndex];
    
    let isCorrect = false;
    if (current.isTextAnswer || current.type === 'word' || current.type === 'frac') {
      isCorrect = userAnswer.replace(/\s/g,'').toLowerCase() === String(current.answer).replace(/\s/g,'').toLowerCase();
    } else {
      isCorrect = (parseFloat(userAnswer) || 0) === parseFloat(current.answer);
    } // Handle fractions/decimals properly

    if (isCorrect) {
      if (!reviewMode) setScore((prev) => prev + 1);
      let msgsKR = ['🎉 정답!', '⭐ 완벽해요!', '🌟 천재!', '💪 대단해요!', '✨ 최고!', '🔥 훌륭해요!'];
      let msgsUS = ['🎉 Correct!', '⭐ Perfect!', '🌟 Genius!', '💪 Great!', '✨ Awesome!', '🔥 Excellent!'];
      
      // Anti-dropout dynamic morale boosting for higher tiers
      if (currentIndex >= 26) {
        msgsKR = ['🔥 말도 안 돼! 이 어려운 걸 풀다니!', '👑 수학 올림피아드 나가도 되겠어요!', '🤯 천재적인 논리력이네요!', '🌟 최고 난이도 정답!'];
        msgsUS = ['🔥 Unbelievable! You solved it!', '👑 Ready for Math Olympiad!', '🤯 Pure Genius Logic!', '🌟 Ultimate Challenge Solved!'];
      } else if (currentIndex >= 20) {
        msgsKR = ['💪 까다로운 응용문제도 거뜬히 푸네요!', '✨ 원리를 완벽하게 이해했어요!', '🌟 대단한 집중력이에요!'];
        msgsUS = ['💪 Mastering the applications!', '✨ Perfect understanding!', '🌟 Amazing focus!'];
      }

      const msgs = isUS ? msgsUS : msgsKR;
      const seed = getSeedForDay(region, grade, currentDay);
      setFeedback(msgs[Math.floor(seedRandom(currentIndex, seed) * msgs.length)]);
    } else {
      if (!reviewMode) {
        setIncorrectProblems((prev) => {
          if (!prev.find(p => p.question === current.question)) {
            return [...prev, { ...current, wrongAnswer: userAnswer }];
          }
          return prev;
        });
      }
      setFeedback(isUS ? `Oops! Answer is ${current.answer}` : `아쉬워요! 정답은 ${current.answer}입니다.`);
    }

    setShowFeedback(true);

    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setShowFeedback(false);
      } else {
        setSessionComplete(true);
        setUserAnswer('');
        setShowFeedback(false);
      }
    }, 1500);
  };

  useEffect(() => {
    setUserAnswer('');
    setShowFeedback(false);
    setShowHint(false);
  }, [currentIndex]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAnswer();
  };

  const current = problems[currentIndex];
  const progress = Math.round(((currentIndex + 1) / problems.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-[1.5rem] shadow-sm border border-slate-100">
            <span className="text-3xl">🎯</span>
            <span className="text-2xl font-black text-slate-800">{score} <span className="text-lg text-slate-400">{tScore}</span></span>
          </div>
          
          <div className="text-center bg-white px-8 py-3 rounded-[1.5rem] shadow-sm border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{tTitle}</div>
            <div className="text-xl font-black text-slate-800 tracking-tight">{currentIndex + 1} <span className="text-slate-300 mx-1">/</span> {problems.length}</div>
          </div>

          <button onClick={onExit} className="bg-white hover:bg-red-50 text-red-500 px-6 py-3 rounded-[1.5rem] font-bold shadow-sm transition border border-slate-100 hover:border-red-200">
            {tExit}
          </button>
        </div>

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-2">
          <div className="h-full bg-slate-800 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto flex-1 flex flex-col">
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-14 flex flex-col justify-between relative overflow-hidden flex-1">
          
          {reviewMode && (
             <div className="absolute top-4 right-4 bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-sm">
                오답 복습 모드 📝
             </div>
          )}

          {current?.type === 'reasoning' && (
            <div className="mb-6 inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-black text-xl shadow-md animate-pulse self-start">
              {isUS ? '🧠 Brain Training!' : '🧠 두뇌 트레이닝!'}
            </div>
          )}

          <div className="text-center mb-10 flex-1 flex flex-col justify-center">
            {renderQuestion(current)}
            
            {current?.hint && (
              <div className="mt-8 mx-auto w-fit max-w-full">
                {!showHint ? (
                  <button 
                    onClick={() => setShowHint(true)}
                    className="text-orange-500 font-bold hover:text-orange-600 bg-orange-50 px-6 py-3 rounded-full text-lg shadow-sm transition-all border-2 border-orange-200 active:scale-95"
                  >
                    💡 {isUS ? 'Show Hint' : '힌트 보기'}
                  </button>
                ) : (
                  <div className="text-xl md:text-2xl text-gray-800 font-bold p-6 bg-yellow-100 rounded-2xl border-4 border-yellow-400 shadow-sm break-keep">
                    💡 {isUS ? 'Hint: ' : '힌트: '}{current.hint.replace('💡', '').trim()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <input
                type={current?.isTextAnswer || current?.type === 'frac' ? "text" : "tel"}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={tPlaceholder}
                disabled={showFeedback}
                className="w-full min-w-0 px-6 py-5 text-4xl text-center font-black text-blue-800 rounded-2xl border-4 border-blue-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-200 outline-none disabled:bg-gray-100 transition-all placeholder:text-gray-300 shadow-inner"
                autoFocus
              />
              <button
                onClick={handleAnswer}
                disabled={showFeedback || !userAnswer.trim()}
                className="shrink-0 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-500 text-white px-8 py-5 rounded-2xl font-black text-3xl shadow-md transform transition active:scale-95 border-b-8 border-green-700 active:border-b-0 disabled:border-b-4 disabled:border-gray-400 disabled:active:scale-100"
              >
                {tSubmit}
              </button>
            </div>

            {showFeedback && (
              <div className={`text-center p-6 rounded-2xl text-4xl font-black animate-pulse shadow-xl mt-4 border-4 ${
                feedback.includes('정답') || feedback.includes('!') ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'
              }`}>
                {feedback}
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <AdBanner dataAdSlot="session-screen-ad" />
          </div>
        </div>
      </div>
    </div>
  );
}
