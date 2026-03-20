import React, { useState } from 'react';

export default function Lobby({ setRegion, setGrade, onEnableAudit }) {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const handleGradeSelect = (grade) => {
    setRegion(selectedRegion);
    setGrade(grade);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="text-center w-full max-w-5xl">
        <h1 className="text-5xl md:text-7xl font-black mb-4 text-slate-800 tracking-tight">
          Math 90-Day
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-16 font-medium tracking-wide">
           글로벌 수학 완성 프로젝트
        </p>

        {!selectedRegion ? (
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-stretch max-w-3xl mx-auto">
            <button
              onClick={() => handleRegionSelect('KR')}
              className="flex-1 w-full bg-white text-slate-800 px-8 py-16 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transform transition-all duration-300 hover:-translate-y-2 border border-slate-100 flex flex-col items-center justify-center group"
            >
              <div className="text-7xl mb-6 transform transition-transform group-hover:scale-110">🇰🇷</div>
              <div className="font-black text-3xl mb-2">한국 수학 과정</div>
              <div className="text-slate-400 font-medium tracking-wide">초등 1학년 ~ 6학년</div>
            </button>

            <button
              onClick={() => handleRegionSelect('US')}
              className="flex-1 w-full bg-white text-slate-800 px-8 py-16 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transform transition-all duration-300 hover:-translate-y-2 border border-slate-100 flex flex-col items-center justify-center group"
            >
              <div className="text-7xl mb-6 transform transition-transform group-hover:scale-110">🇺🇸</div>
              <div className="font-black text-3xl mb-2">US Curriculum</div>
              <div className="text-slate-400 font-medium tracking-wide">Common Core G1 ~ G6</div>
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <div className="mb-12 flex flex-col md:flex-row justify-center items-center gap-6">
              <span className="text-2xl font-black text-slate-700 bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-100">
                {selectedRegion === 'KR' ? '🇰🇷 한국 교육과정' : '🇺🇸 US Curriculum'}
              </span>
              <button 
                onClick={() => setSelectedRegion(null)}
                className="text-slate-400 hover:text-slate-600 font-bold transition px-6 py-4 rounded-2xl hover:bg-slate-200 active:bg-slate-300"
              >
                지역 변경 (Change)
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {(selectedRegion === 'KR' ? [1, 2, 3, 4, 5, 6] : ['K', 1, 2, 3, 4, 5, 6]).map(g => (
                <button
                  key={g}
                  onClick={() => handleGradeSelect(g)}
                  className="bg-white text-slate-800 p-8 rounded-[2rem] font-black text-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgb(0,0,0,0.08)] transform transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-slate-300 group"
                >
                  <span className="text-5xl block mb-4 transform transition-transform group-hover:scale-110">
                    {['🌱','🌿','🌳','🍎','🚀','👑','🎓'][g==='K'?0:g]}
                  </span>
                  <span className="text-xl text-slate-500 block">
                    {selectedRegion === 'KR' ? `${g} 학년` : (g === 'K' ? 'Kindergarten' : `Grade ${g}`)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={onEnableAudit}
        className="opacity-20 hover:opacity-100 text-xs text-slate-400 font-bold mt-12 transition-opacity underline underline-offset-4"
      >
        🔍 Curriculum Audit Mode
      </button>

    </div>
  );
}
