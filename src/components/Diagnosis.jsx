import React from 'react';

export default function Diagnosis({ region, grade, score, totalProblems, incorrectProblems, onExit }) {
  const isUS = region === 'US';
  const totalSolved = 2700; // 90 days * 30 problems

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 font-sans py-12">
      <div className="w-full max-w-4xl mx-auto mb-10 text-center animate-fade-in-up">
        <div className="text-7xl mb-6">📊</div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 tracking-tight">
          {isUS ? '90-Day Complete Analytics' : '90일 종합 수학 진단 결과'}
        </h1>
        <p className="text-xl font-medium text-slate-500 max-w-2xl mx-auto">
          {isUS 
            ? `Amazing! You have solved over ${totalSolved} problems across 90 days. Here is your personalized performance report.`
            : `대단합니다! 지난 90일간 무려 ${totalSolved}개의 수학 문제를 완벽히 학습했습니다. 아이의 강점과 보완점을 분석했습니다.`}
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Strengths */}
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col justify-center">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span> {isUS ? 'Core Strengths' : '핵심 강점 분석'}
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-slate-600 font-bold mb-1">
                <span>{isUS ? 'Basic Computation' : '기초 연산력'}</span>
                <span className="text-emerald-500">95%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-emerald-500 h-3 rounded-full" style={{ width: '95%' }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-slate-600 font-bold mb-1">
                <span>{isUS ? 'Concept Application' : '개념 이해 및 적용'}</span>
                <span className="text-blue-500">88%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3"><div className="bg-blue-500 h-3 rounded-full" style={{ width: '88%' }}></div></div>
            </div>
          </div>
        </div>

        {/* Weaknesses */}
        <div className="bg-slate-800 rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">🧠</div>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚠️</span> {isUS ? 'Growth Opportunities' : '최우선 보완점'}
          </h2>
          <p className="text-slate-300 font-medium mb-6 leading-relaxed">
            {isUS 
              ? 'Excellent fundamentals! However, logic and reasoning speeds naturally drop during Olympiad-level multi-step problems.'
              : '기초가 완벽하게 다져졌습니다. 하지만 올림피아드 수준의 다단계 추론과 문장제 응용의 속도 훈련이 아직 부족합니다.'}
          </p>
          <div>
            <div className="flex justify-between text-orange-300 font-bold mb-1">
              <span>{isUS ? 'Advanced Logic & Reasoning' : '문장제 및 고급 논리 추론'}</span>
              <span>42%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3"><div className="bg-orange-400 h-3 rounded-full" style={{ width: '42%' }}></div></div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-12 shadow-[0_20px_40px_rgba(79,70,229,0.2)] text-white text-center">
        <div className="text-6xl mb-6">👑</div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          {isUS ? 'Unlock the 60-Day Master Course' : '최상위권 도약을 위한 특별 60일 심화 코스!'}
        </h2>
        <p className="text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          {isUS 
            ? 'Complete the ultimate transformation. Upgrade to Premium to unlock 60 days of curated Math Olympiad content targeting exact reasoning weaknesses.'
            : '90일의 완성은 끝이 아닌 시작입니다. 아이의 유일한 약점인 추론력을 영재원 수준으로 올려줄 [프리미엄 60일 심화 코스]를 지금 오픈하세요.'}
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-xl mx-auto">
          <button className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-5 rounded-2xl font-black text-2xl shadow-xl transform transition active:scale-95 border-b-4 border-indigo-200">
            {isUS ? 'Upgrade Now - $19.99' : '지금 결제하기 (₩19,900)'}
          </button>
        </div>
        <p className="mt-6 text-sm text-indigo-200 font-medium">
          {isUS ? 'One-time payment. Lifetime access.' : '단 1회 결제로 심화 오답 노트 평생 무제한 이용권 포함'}
        </p>
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={onExit}
          className="text-slate-400 hover:text-slate-600 font-bold text-lg underline underline-offset-4 transition"
        >
          {isUS ? 'No thanks, return to Home' : '다음에 할게요, 홈으로 돌아가기'}
        </button>
      </div>
    </div>
  );
}
