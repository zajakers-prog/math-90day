import React, { useState, useMemo } from 'react';
import { generateProblems } from '../utils/problemGenerator';
import { CURRICULUM_US } from '../data/curriculumUS';
import { CURRICULUM_KR } from '../data/curriculumKR';

export default function CurriculumAudit({ onExit }) {
  const [region, setRegion] = useState('KR');
  const [grade, setGrade] = useState('1');

  const daysData = useMemo(() => {
    return Array.from({ length: 90 }, (_, i) => i + 1).map(day => {
      // Get topic explicitly
      const currentCurriculum = region === 'US' ? CURRICULUM_US[grade] : CURRICULUM_KR[grade];
      const targetWeek = Math.ceil(day / 5);
      const weekData = currentCurriculum.find(c => c.week === targetWeek) || currentCurriculum[currentCurriculum.length - 1];
      
      const problems = generateProblems(region, grade, day);
      // Sample 3 problems to keep the UI manageable: First, Middle, Last
      const samples = [
        problems[0], 
        problems[Math.floor(problems.length / 2)], 
        problems[problems.length - 1]
      ].filter(Boolean);

      return {
        day,
        week: targetWeek,
        topic: weekData.topic,
        typeLabel: weekData.type,
        samples
      };
    });
  }, [region, grade]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-slate-200 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <span>🔬</span> Curriculum Audit Dashboard
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Preview problem generation distributions for all 90 days at once.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <select 
              className="bg-white border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm outline-none"
              value={region} onChange={(e) => setRegion(e.target.value)}
            >
              <option value="KR">Korea (KR)</option>
              <option value="US">United States (US)</option>
            </select>
            
            <select 
              className="bg-white border border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl shadow-sm outline-none"
              value={grade} onChange={(e) => setGrade(e.target.value)}
            >
              {region === 'US' && <option value="K">K</option>}
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
            </select>

            <button 
              onClick={onExit}
              className="bg-slate-800 text-white font-bold px-6 py-2 rounded-xl hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {daysData.map(data => (
            <div key={data.day} className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition">
              <div className="md:w-1/4 min-w-[200px] border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-6">
                <span className="inline-block bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-lg text-sm mb-3">
                  Week {data.week} • Day {data.day}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mb-1 leading-snug">{data.topic}</h3>
                <p className="text-sm font-mono text-slate-400 bg-slate-50 p-2 rounded truncate" title={data.typeLabel}>
                  {data.typeLabel}
                </p>
              </div>
              
              <div className="md:w-3/4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {data.samples.map((prob, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-xl p-4 flex flex-col justify-center items-center text-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Sample {idx + 1} ({prob.type})</span>
                    <p className="text-xl font-bold text-slate-700 break-words w-full px-2" style={{wordBreak: "keep-all"}}>
                      {prob.question}
                    </p>
                    <span className="mt-3 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Ans: {prob.answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
