import React, { useMemo } from 'react';

function categorize(type) {
  if (!type) return 'computation';
  if (type.includes('geo-') || type.includes('shape')) return 'geometry';
  if (type.includes('meas-') || type.includes('clock') || type.includes('money')) return 'measurement';
  if (type.includes('data-') || type.includes('probability')) return 'data';
  if (type === 'reasoning') return 'reasoning';
  if (type.includes('frac') || type.includes('dec-') || type.includes('ratio') || type.includes('percent') || type.includes('proportion')) return 'number-sense';
  return 'computation';
}

function loadHistory(region, grade) {
  const categories = { computation: { correct: 0, total: 0 }, geometry: { correct: 0, total: 0 }, measurement: { correct: 0, total: 0 }, data: { correct: 0, total: 0 }, reasoning: { correct: 0, total: 0 }, 'number-sense': { correct: 0, total: 0 } };
  let totalSolved = 0;
  let totalCorrect = 0;
  const weeklyScores = [];

  for (let day = 1; day <= 90; day++) {
    const key = `math90_${region}_${grade}_day${day}`;
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    try {
      const data = JSON.parse(raw);
      const problems = data.problems || [];
      const score = data.score || 0;
      totalSolved += problems.length;
      totalCorrect += score;
      const week = Math.ceil(day / 5);
      if (!weeklyScores[week]) weeklyScores[week] = { correct: 0, total: 0 };
      weeklyScores[week].correct += score;
      weeklyScores[week].total += problems.length;

      problems.forEach(p => {
        const cat = categorize(p.type);
        categories[cat].total += 1;
        if (p.isCorrect) categories[cat].correct += 1;
      });
    } catch (e) { /* skip corrupted */ }
  }
  return { totalSolved, totalCorrect, categories, weeklyScores };
}

export default function Diagnosis({ region, grade, score, totalProblems, incorrectProblems, onExit }) {
  const isUS = region === 'US';

  const stats = useMemo(() => loadHistory(region, grade), [region, grade]);
  const totalSolved = stats.totalSolved || (score != null ? 30 : 0);
  const totalCorrect = stats.totalCorrect || score || 0;

  const catLabels = isUS
    ? { computation: 'Computation', geometry: 'Geometry', measurement: 'Measurement', data: 'Data & Statistics', reasoning: 'Reasoning', 'number-sense': 'Number Sense' }
    : { computation: '기초 연산력', geometry: '도형', measurement: '측정', data: '자료/통계', reasoning: '사고력/추론', 'number-sense': '수 감각/분수' };

  const catEntries = Object.entries(stats.categories).filter(([, v]) => v.total > 0);
  const weakest = catEntries.length > 0
    ? catEntries.reduce((a, b) => (a[1].total > 0 && a[1].correct / a[1].total < b[1].correct / b[1].total ? a : b))
    : null;

  const pct = (c, t) => t > 0 ? Math.round((c / t) * 100) : 0;
  const overallPct = pct(totalCorrect, totalSolved);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-6 font-sans py-12">
      <div className="w-full max-w-4xl mx-auto mb-10 text-center animate-fade-in-up">
        <div className="text-7xl mb-6">📊</div>
        <h1 className="text-5xl md:text-6xl font-black mb-4 text-slate-800 tracking-tight">
          {isUS ? '90-Day Analytics' : '90일 종합 진단 결과'}
        </h1>
        <p className="text-xl font-medium text-slate-500 max-w-2xl mx-auto">
          {isUS
            ? `You solved ${totalSolved} problems with ${overallPct}% accuracy.`
            : `총 ${totalSolved}문제를 풀었고, 정답률은 ${overallPct}%입니다.`}
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span> {isUS ? 'Performance by Area' : '영역별 정답률'}
          </h2>
          <div className="space-y-4">
            {catEntries.map(([key, val]) => {
              const rate = pct(val.correct, val.total);
              const color = rate >= 80 ? 'emerald' : rate >= 60 ? 'blue' : 'orange';
              return (
                <div key={key}>
                  <div className="flex justify-between text-slate-600 font-bold mb-1">
                    <span>{catLabels[key]}</span>
                    <span className={`text-${color}-500`}>{rate}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3">
                    <div className={`bg-${color}-500 h-3 rounded-full`} style={{ width: `${rate}%` }}></div>
                  </div>
                </div>
              );
            })}
            {catEntries.length === 0 && (
              <p className="text-slate-400">{isUS ? 'No data yet. Complete some sessions first!' : '아직 데이터가 없습니다. 학습을 시작해보세요!'}</p>
            )}
          </div>
        </div>

        {/* Weakness Analysis */}
        <div className="bg-slate-800 rounded-[2rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl">🧠</div>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="text-3xl">⚠️</span> {isUS ? 'Focus Area' : '최우선 보완점'}
          </h2>
          {weakest ? (
            <>
              <p className="text-slate-300 font-medium mb-6 leading-relaxed">
                {isUS
                  ? `Your weakest area is "${catLabels[weakest[0]]}" at ${pct(weakest[1].correct, weakest[1].total)}%. Focus practice here for the biggest improvement.`
                  : `"${catLabels[weakest[0]]}" 영역이 ${pct(weakest[1].correct, weakest[1].total)}%로 가장 약합니다. 이 영역을 집중 연습하면 큰 성장이 가능합니다.`}
              </p>
              <div>
                <div className="flex justify-between text-orange-300 font-bold mb-1">
                  <span>{catLabels[weakest[0]]}</span>
                  <span>{pct(weakest[1].correct, weakest[1].total)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div className="bg-orange-400 h-3 rounded-full" style={{ width: `${pct(weakest[1].correct, weakest[1].total)}%` }}></div>
                </div>
              </div>
            </>
          ) : (
            <p className="text-slate-300 font-medium leading-relaxed">
              {isUS ? 'Complete more sessions to unlock weakness analysis.' : '더 많은 학습을 완료하면 약점 분석이 활성화됩니다.'}
            </p>
          )}
        </div>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] p-12 shadow-[0_20px_40px_rgba(79,70,229,0.2)] text-white text-center">
        <div className="text-6xl mb-6">👑</div>
        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
          {isUS ? 'Unlock the 60-Day Master Course' : '최상위권 도약을 위한 60일 심화 코스!'}
        </h2>
        <p className="text-xl text-white/90 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          {isUS
            ? 'Upgrade to Premium for 60 days of curated Olympiad-level content targeting your exact weaknesses.'
            : '90일의 완성은 시작입니다. 약점 영역을 영재원 수준으로 올려줄 프리미엄 60일 심화 코스를 지금 오픈하세요.'}
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center max-w-xl mx-auto">
          <button className="flex-1 bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-5 rounded-2xl font-black text-2xl shadow-xl transform transition active:scale-95 border-b-4 border-indigo-200">
            {isUS ? 'Upgrade Now - $19.99' : '지금 결제하기 (₩19,900)'}
          </button>
        </div>
        <p className="mt-6 text-sm text-indigo-200 font-medium">
          {isUS ? 'One-time payment. Lifetime access.' : '단 1회 결제로 평생 무제한 이용'}
        </p>
      </div>

      <div className="mt-12 text-center">
        <button onClick={onExit} className="text-slate-400 hover:text-slate-600 font-bold text-lg underline underline-offset-4 transition">
          {isUS ? 'No thanks, return to Home' : '다음에 할게요, 홈으로 돌아가기'}
        </button>
      </div>
    </div>
  );
}
