import React, { useState } from 'react';
import { HelpCircle, Check, X, RotateCcw, ArrowLeft, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameComponentProps } from '../types';
import { INDIAN_CAFE_QUIZ_QUESTIONS } from '../../../data/initialData';

export const CafeQuizGame: React.FC<GameComponentProps> = ({ onBackToHub }) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const q = INDIAN_CAFE_QUIZ_QUESTIONS[currentQuizIdx] || INDIAN_CAFE_QUIZ_QUESTIONS[0];

  const handleSelectQuizOption = (optIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optIdx);
    setIsAnswered(true);
    if (optIdx === q.correctIndex) {
      setQuizScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIdx + 1 < INDIAN_CAFE_QUIZ_QUESTIONS.length) {
      setCurrentQuizIdx((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch (e) {}
    }
  };

  const restartQuiz = () => {
    setCurrentQuizIdx(0);
    setQuizScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizFinished(false);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 max-w-lg mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-3">
          {onBackToHub && (
            <button
              onClick={onBackToHub}
              className="p-2 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-stone-200 transition"
              title="Back to Lounge Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              Culinary & Spice Trivia
            </h3>
            <p className="text-xs text-stone-400">
              Question {currentQuizIdx + 1} of {INDIAN_CAFE_QUIZ_QUESTIONS.length}
            </p>
          </div>
        </div>

        <div className="bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-700/60 text-center">
          <span className="text-[10px] text-stone-400 uppercase font-bold block">Score</span>
          <span className="text-amber-400 font-mono font-bold text-sm">
            {quizScore}/{INDIAN_CAFE_QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {!quizFinished ? (
        <div>
          {/* Question Box */}
          <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 mb-6">
            <h4 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {q.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {q.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === q.correctIndex;

              let btnStyle =
                'bg-stone-800 hover:bg-stone-750 border-stone-700/80 text-stone-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                } else if (isSelected) {
                  btnStyle = 'bg-red-500/20 border-red-500 text-red-300';
                } else {
                  btnStyle = 'bg-stone-900 border-stone-800 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && isCorrect && <Check className="w-5 h-5 text-emerald-400" />}
                  {isAnswered && isSelected && !isCorrect && <X className="w-5 h-5 text-red-400" />}
                </button>
              );
            })}
          </div>

          {/* Fun Fact Callout */}
          {isAnswered && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl mb-6 text-xs text-amber-200 leading-relaxed">
              <strong className="block text-amber-400 font-bold mb-1">💡 Foodie Fun Fact:</strong>
              {q.funFact}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition"
            >
              {currentQuizIdx + 1 === INDIAN_CAFE_QUIZ_QUESTIONS.length
                ? 'Finish Quiz'
                : 'Next Question'}
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl text-center">
          <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2 animate-bounce" />
          <h4 className="text-xl font-black text-white">QUIZ COMPLETED!</h4>
          <p className="text-stone-300 text-sm mt-1">
            You scored <strong className="text-amber-400">{quizScore}</strong> out of{' '}
            {INDIAN_CAFE_QUIZ_QUESTIONS.length}!
          </p>
          <p className="text-xs text-stone-400 mt-2 mb-6">
            {quizScore >= 3
              ? '🌟 True Culinary Connoisseur! Enjoy your meal.'
              : 'Great try! Brush up on your spices with another round.'}
          </p>
          <button
            onClick={restartQuiz}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm rounded-xl transition inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        </div>
      )}
    </div>
  );
};
