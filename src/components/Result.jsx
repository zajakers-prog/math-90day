import React from 'react';
import AdBanner from './AdBanner';

export default function Result({ 
  region, grade, currentDay, score, totalProblems, 
  incorrectProblems, reviewMode, setReviewMode, 
  setSessionComplete, onRetry, onNextDay, onExit, onStartReview,
  retryCount, onSmartRetry
}) {
  const isUS = region === 'US';
  const percentage = Math.round((score / totalProblems) * 100);

  if (reviewMode) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="text-center w-full max-w-xl">
          <div className="text-6xl mb-8 animate-bounce">✨</div>
          <h1 className="text-4xl md:text-5xl font-black mb-8 text-slate-800 tracking-tight">
            {isUS ? 'Review Complete!' : '오답 복습 완료!'}
          </h1>
          <div className="bg-white rounded-[2rem] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 mx-auto">
            <p className="text-xl font-bold text-slate-500 mb-10 leading-relaxed">
              {isUS ? 'You have reviewed all the missed problems.' : '틀렸던 문제를 모두 다시 풀어보았어요.'}
            </p>
            <button
              onClick={() => {
                setReviewMode(false);
                setSessionComplete(true);
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-sm w-full transform transition active:scale-95"
            >
              {isUS ? 'Back to Results 🔙' : '결과 화면으로 🔙'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans py-12">
      <div className="text-center w-full max-w-xl mb-10">
        <div className="text-7xl mb-6 animate-bounce">🏆</div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 tracking-tight">
          {isUS ? 'Congratulations!' : '축하합니다!'}
        </h1>
        <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">
          {isUS ? `Day ${currentDay} of 90 Complete` : `90일 단기완성 - ${currentDay}일차 완료`}
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
        <div className="flex flex-col items-center border-b border-slate-100 pb-8 mb-8">
          <p className="text-[5rem] leading-none font-black text-slate-800 mb-4 tracking-tighter">
            {percentage}<span className="text-4xl text-slate-300 ml-1">%</span>
          </p>
          <p className="text-2xl font-bold text-slate-400 mb-6">
            {score} <span className="text-slate-300 mx-1">/</span> {totalProblems} {isUS ? 'Correct' : '정답'}
          </p>
          
          <div className="text-xl">
            {percentage === 100 && <p className="text-blue-500 font-black tracking-wide">👑 {isUS ? 'Perfect!' : '완벽합니다!'}</p>}
            {percentage >= 90 && percentage < 100 && <p className="text-emerald-500 font-black tracking-wide">⭐ {isUS ? 'Great Job!' : '정말 잘했어요!'}</p>}
            {percentage >= 70 && percentage < 90 && <p className="text-blue-400 font-black tracking-wide">💪 {isUS ? 'Good Work!' : '고생했어요!'}</p>}
            {percentage < 70 && <p className="text-orange-400 font-black tracking-wide">{isUS ? 'Keep trying!' : '내일 다시! 화이팅!'}</p>}
          </div>
        </div>
        
        <div className="mb-8">
           <AdBanner dataAdSlot="result-screen-ad" />
        </div>

        <div className="flex flex-col gap-4">
          {incorrectProblems.length > 0 && (
            <button
              onClick={onStartReview}
              className="bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200 px-8 py-5 rounded-2xl font-bold text-xl transition transform active:scale-95"
            >
              {isUS ? 'Review Mistakes 📝' : '오답 노트 풀어보기 📝'} ({incorrectProblems.length})
            </button>
          )}

          {currentDay < 90 && (
            <button
              onClick={onNextDay}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-5 rounded-2xl font-bold text-xl shadow-sm transition transform active:scale-95"
            >
              {isUS ? 'Next Day ➡️' : '다음 일차 ➡️'}
            </button>
          )}

          {currentDay < 90 && retryCount < 3 && (
            <button
              onClick={onSmartRetry}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-5 rounded-2xl font-black text-xl shadow-md transition transform active:scale-95"
            >
              {isUS ? `+10 Extra Practice (${3 - retryCount} left) 🔥` : `+10 오답 맞춤형 집중훈련 (${3 - retryCount}회 남음) 🔥`}
            </button>
          )}

          <div className="grid grid-cols-2 gap-4 mt-2">
            <button
              onClick={onRetry}
              className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl font-bold text-lg transition transform active:scale-95"
            >
              {isUS ? 'Retry 🔄' : '오늘 다시 🔄'}
            </button>

            <button
              onClick={onExit}
              className="bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 px-4 py-4 rounded-2xl font-bold text-lg transition transform active:scale-95"
            >
              {isUS ? 'Home 🚀' : '홈화면 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
