import React, { useState } from 'react';

export default function Lobby({ setRegion, setGrade }) {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
  };

  const handleGradeSelect = (grade) => {
    setRegion(selectedRegion);
    setGrade(grade);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex items-center justify-center p-4">
      <div className="text-center w-full max-w-4xl">
        <h1 className="text-6xl font-black mb-4 text-white drop-shadow-xl">🌍 Math 90-Day</h1>
        <p className="text-xl text-white mb-12 drop-shadow-md font-bold bg-black bg-opacity-20 inline-block px-8 py-3 rounded-full">
           글로벌 수학 완성 프로젝트
        </p>

        {!selectedRegion ? (
          <div className="flex gap-8 justify-center flex-wrap">
            <button
              onClick={() => handleRegionSelect('KR')}
              className="bg-gradient-to-br from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-12 py-10 rounded-3xl font-black text-4xl shadow-2xl transform transition hover:scale-105 active:scale-95 border-4 border-blue-300"
            >
              <div className="text-6xl mb-4">🇰🇷</div>
              한국 수학 과정
              <div className="text-lg mt-3 font-medium opacity-90">초등 1학년 ~ 6학년</div>
            </button>

            <button
              onClick={() => handleRegionSelect('US')}
              className="bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-12 py-10 rounded-3xl font-black text-4xl shadow-2xl transform transition hover:scale-105 active:scale-95 border-4 border-red-300"
            >
              <div className="text-6xl mb-4">🇺🇸</div>
              US Curriculum
              <div className="text-lg mt-3 font-medium opacity-90">Common Core G1 ~ G6</div>
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-8 flex justify-center items-center gap-4">
              <span className="text-4xl">{selectedRegion === 'KR' ? '🇰🇷 한국 교육과정' : '🇺🇸 US Curriculum'}</span>
              <button 
                onClick={() => setSelectedRegion(null)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-xl text-sm font-bold transition"
              >
                지역 변경 (Change Region)
              </button>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {(selectedRegion === 'KR' ? [1, 2, 3, 4, 5, 6] : ['K', 1, 2, 3, 4, 5, 6]).map(g => (
                <button
                  key={g}
                  onClick={() => handleGradeSelect(g)}
                  className="bg-white hover:bg-blue-50 text-gray-800 p-8 rounded-3xl font-black text-3xl shadow-xl transform transition hover:scale-105 active:scale-95 border-4 border-transparent hover:border-blue-300"
                >
                  <span className="text-5xl block mb-2">{['🌱','🌿','🌳','🍎','🚀','👑','🎓'][g==='K'?0:g]}</span>
                  {selectedRegion === 'KR' ? `${g} 학년` : (g === 'K' ? 'Kindergarten' : `Grade ${g}`)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
