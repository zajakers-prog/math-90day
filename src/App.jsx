import React, { useState, useEffect } from 'react';
import Lobby from './components/Lobby';
import Session from './components/Session';
import Result from './components/Result';
import Diagnosis from './components/Diagnosis';
import { generateProblems, generateSmartTen } from './utils/problemGenerator';

export default function MathDaily90() {
  const [region, setRegion] = useState(null); 
  const [grade, setGrade] = useState(null);   
  
  const [currentDay, setCurrentDay] = useState(1);
  const [problems, setProblems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectProblems, setIncorrectProblems] = useState([]);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const getStorageKey = () => `math_progress_${region}_${grade}`;

  useEffect(() => {
    if (region && grade) {
      const savedStr = localStorage.getItem(getStorageKey());
      const saved = savedStr ? JSON.parse(savedStr) : null;
      
      const targetDay = saved ? saved.currentDay || 1 : 1;
      const initial = generateProblems(region, grade, targetDay);
      
      setProblems(initial);
      setCurrentDay(targetDay);
      
      if (saved && saved.currentDay === targetDay) {
         setCurrentIndex(saved.currentIndex || 0);
         setScore(saved.score || 0);
         setIncorrectProblems(saved.incorrectProblems || []);
         setSessionComplete(saved.sessionComplete || false);
         setRetryCount(saved.retryCount || 0);
      } else {
         setCurrentIndex(0);
         setScore(0);
         setIncorrectProblems([]);
         setSessionComplete(false);
         setRetryCount(0);
      }
      setReviewMode(false);
    }
  }, [region, grade]);

  useEffect(() => {
    if (region && grade && problems.length > 0 && !reviewMode) {
      localStorage.setItem(getStorageKey(), JSON.stringify({
        currentDay, currentIndex, score, incorrectProblems, sessionComplete, retryCount
      }));
    }
  }, [currentDay, currentIndex, score, incorrectProblems, sessionComplete, retryCount, region, grade, reviewMode]);

  const handleNextDay = () => {
    const nextDay = Math.min(currentDay + 1, 90);
    setProblems(generateProblems(region, grade, nextDay));
    setCurrentDay(nextDay);
    setCurrentIndex(0);
    setScore(0);
    setIncorrectProblems([]);
    setSessionComplete(false);
    setReviewMode(false);
    setRetryCount(0);
  };

  const handleRetry = () => {
    setProblems(generateProblems(region, grade, currentDay));
    setCurrentIndex(0);
    setScore(0);
    setIncorrectProblems([]);
    setSessionComplete(false);
    setReviewMode(false);
  };

  const handleSmartRetry = () => {
    if (retryCount >= 3) return;
    setProblems(generateSmartTen(incorrectProblems, grade, region, currentDay));
    setCurrentIndex(0);
    setScore(0);
    setIncorrectProblems([]);
    setSessionComplete(false);
    setReviewMode(false);
    setRetryCount(prev => prev + 1);
  };

  const startReview = () => {
    setProblems(incorrectProblems);
    setCurrentIndex(0);
    setScore(0);
    setSessionComplete(false);
    setReviewMode(true);
  };

  const handleExit = () => {
    setRegion(null);
    setGrade(null);
  };

  if (!region || !grade) {
    return <Lobby setRegion={setRegion} setGrade={setGrade} />;
  }

  if (sessionComplete) {
    if (currentDay === 90 && !reviewMode) {
      return (
        <Diagnosis 
          region={region} grade={grade} 
          score={score} totalProblems={problems.length}
          incorrectProblems={incorrectProblems}
          onExit={handleExit}
        />
      );
    }

    return (
      <Result 
        region={region} grade={grade} currentDay={currentDay}
        score={score} totalProblems={problems.length}
        incorrectProblems={incorrectProblems}
        reviewMode={reviewMode} setReviewMode={setReviewMode}
        setSessionComplete={setSessionComplete}
        onRetry={handleRetry} onNextDay={handleNextDay} onExit={handleExit} onStartReview={startReview}
        retryCount={retryCount} onSmartRetry={handleSmartRetry}
      />
    );
  }

  return (
    <Session 
      region={region} grade={grade} currentDay={currentDay}
      problems={problems}
      currentIndex={currentIndex} setCurrentIndex={setCurrentIndex}
      score={score} setScore={setScore}
      incorrectProblems={incorrectProblems} setIncorrectProblems={setIncorrectProblems}
      reviewMode={reviewMode} setReviewMode={setReviewMode}
      setSessionComplete={setSessionComplete}
      onExit={handleExit}
    />
  );
}
