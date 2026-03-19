import React from 'react';

export default function Result({ 
  region, grade, currentDay, score, totalProblems, 
  incorrectProblems, reviewMode, setReviewMode, 
  setSessionComplete, onRetry, onNextDay, onExit, onStartReview 
}) {
  const isUS = region === 'US';
  const percentage = Math.round((score / totalProblems) * 100);

  if (reviewMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-emerald-300 to-teal-300 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-lg">
          <div className="text-7xl mb-6 animate-bounce">✨</div>
          <h1 className="text-5xl font-black mb-6 text-white drop-shadow-xl">
            {isUS ? 'Review Complete!' : '오답 복습 완료!'}
          </h1>
          <div className="bg-white bg-opacity-95 rounded-3xl p-10 shadow-2xl mx-auto">
            <p className="text-2xl font-black text-gray-800 mb-8 leading-relaxed">
              {isUS ? 'You have reviewed all the missed problems.' : '틀렸던 문제를 모두 다시 풀어보았어요.'}
            </p>
            <button
              onClick={() => {
                setReviewMode(false);
                setSessionComplete(true);
              }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-5 rounded-2xl font-black text-2xl shadow-xl w-full transform transition active:scale-95"
            >
              {isUS ? 'Back to Results 🔙' : '결과 화면으로 돌아가기 🔙'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-300 via-emerald-300 to-teal-300 flex items-center justify-center p-4">
      <div className="text-center w-full max-w-lg">
        <div className="text-8xl mb-6 animate-bounce">🏆</div>
        <h1 className="text-5xl font-black mb-6 text-white drop-shadow-xl">
          {isUS ? 'Congratulations!' : '축하합니다!'}
        </h1>
        <div className="bg-white bg-opacity-95 rounded-3xl p-10 shadow-2xl mx-auto">
          <p className="text-xl text-gray-700 mb-4 font-black">
            {isUS ? `Day ${currentDay} of 90 Complete` : `90일 단기완성 - ${currentDay}일차 완료`}
          </p>
          <p className="text-7xl font-black text-blue-600 mb-4 drop-shadow-sm">{percentage}%</p>
          <p className="text-3xl font-black text-gray-800 mb-8 border-b-4 pb-6 border-gray-100">
            {score} / {totalProblems} {isUS ? 'Correct!' : '개 정답!'}
          </p>
          
          <div className="mb-8 text-2xl">
            {percentage === 100 && <p className="text-green-600 font-black">👑 {isUS ? 'Perfect!' : '완벽합니다!'}</p>}
            {percentage >= 90 && percentage < 100 && <p className="text-green-600 font-black">⭐ {isUS ? 'Great Job!' : '정말 잘했어요!'}</p>}
            {percentage >= 70 && percentage < 90 && <p className="text-blue-600 font-black">💪 {isUS ? 'Good Work!' : '고생했어요!'}</p>}
            {percentage < 70 && <p className="text-orange-600 font-black">{isUS ? 'Keep trying!' : '내일 다시! 화이팅!'}</p>}
          </div>

          <div className="flex flex-col gap-4">
            {incorrectProblems.length > 0 && (
              <button
                onClick={onStartReview}
                className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 py-5 rounded-2xl font-black text-2xl shadow-xl transform transition hover:scale-105 active:scale-95"
              >
                {isUS ? 'Review Mistakes 📝' : '오답 노트 풀어보기 📝'} ({incorrectProblems.length})
              </button>
            )}

            {currentDay < 90 && (
              <button
                onClick={onNextDay}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-5 rounded-2xl font-black text-2xl shadow-xl transform transition hover:scale-105 active:scale-95"
              >
                {isUS ? 'Next Day ➡️' : '다음 일차 풀기 ➡️'}
              </button>
            )}

            <button
              onClick={onRetry}
              className="bg-white text-gray-700 hover:bg-gray-100 border-4 border-gray-200 px-8 py-4 rounded-2xl font-black text-xl shadow-md transform transition active:scale-95"
            >
              {isUS ? 'Retry Today 🔄' : '오늘 다시 풀기 🔄'}
            </button>

            <button
              onClick={onExit}
              className="bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-xl shadow-xl transform transition hover:scale-105 active:scale-95 mt-2"
            >
              {isUS ? 'Back to Home 🚀' : '홈으로 나가기 🚀'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
