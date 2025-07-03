
import React, { useState, useCallback } from 'react';
import { PAST_QUESTIONS, SUBJECTS } from '../constants';
import { PastQuestion, MockTestResult } from '../types';

interface PastQuestionsProps {
  onTestComplete: (result: MockTestResult) => void;
}

type QuizState = 'setup' | 'taking' | 'result';

const PastQuestions: React.FC<PastQuestionsProps> = ({ onTestComplete }) => {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [selectedSubject, setSelectedSubject] = useState<string>(SUBJECTS[0]);
  const [quizQuestions, setQuizQuestions] = useState<PastQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const startQuiz = () => {
    const questionsForSubject = PAST_QUESTIONS.filter(q => q.subject === selectedSubject);
    if (questionsForSubject.length === 0) {
      alert(`No past questions available for ${selectedSubject} at the moment.`);
      return;
    }
    setQuizQuestions(questionsForSubject);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizState('taking');
  };
  
  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({...prev, [questionId]: answer}));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmit = useCallback(() => {
    let score = 0;
    quizQuestions.forEach(q => {
      if (userAnswers[q.id] === q.answer) {
        score++;
      }
    });
    
    const result: MockTestResult = {
      subject: `Past Qs: ${selectedSubject}`,
      score,
      totalQuestions: quizQuestions.length,
      date: new Date().toLocaleDateString('en-GB'),
    };
    onTestComplete(result);
    setQuizState('setup'); // Reset to setup screen
  }, [quizQuestions, userAnswers, selectedSubject, onTestComplete]);
  
  const calculateScore = () => {
    return quizQuestions.reduce((score, q) => {
        return userAnswers[q.id] === q.answer ? score + 1 : score;
    }, 0);
  }

  const renderSetup = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-brand-gray-800">Past Questions Quiz</h2>
        <p className="text-brand-gray-500">Practice with real questions from previous exams.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-100 space-y-4">
        <label className="block text-lg font-medium text-brand-gray-700 mb-2">1. Select a Subject</label>
        <div className="flex space-x-3 overflow-x-auto pb-2 -m-1 p-1">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-brand-green ${
                selectedSubject === subject
                  ? 'bg-brand-green text-white shadow'
                  : 'bg-brand-gray-100 text-brand-gray-700 hover:bg-brand-gray-200 border border-brand-gray-200'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>
         <label className="block text-lg font-medium text-brand-gray-700 pt-4">2. Start the Quiz</label>
        <button 
          onClick={startQuiz} 
          className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-dark transition-colors"
        >
          Start Quiz for {selectedSubject}
        </button>
      </div>
    </div>
  );

  const renderTakingQuiz = () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-100 space-y-4">
            <div className="pb-3 border-b border-brand-gray-200">
                <h2 className="text-xl font-bold text-brand-gray-800">{selectedSubject} Quiz</h2>
                <p className="text-sm text-brand-gray-500">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
            </div>
            
            <p className="text-brand-gray-700 font-medium text-lg leading-relaxed">{currentQuestion.question}</p>
            <p className="text-xs text-brand-gray-400 font-medium bg-brand-gray-100 py-1 px-2 rounded-full w-fit">{currentQuestion.year} Exam</p>

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                        className={`w-full text-left p-3 border rounded-lg transition-all duration-200 ${
                            userAnswers[currentQuestion.id] === option
                                ? 'bg-brand-green text-white border-brand-green-dark ring-2 ring-brand-green'
                                : 'bg-white text-brand-gray-700 border-brand-gray-300 hover:bg-brand-gray-100 hover:border-brand-gray-400'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4">
                 <button 
                    onClick={handleBack} 
                    disabled={currentQuestionIndex === 0}
                    className="bg-brand-gray-200 text-brand-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-brand-gray-300 transition-colors disabled:opacity-50"
                >
                    Back
                </button>
                {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <button 
                        onClick={handleNext} 
                        className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark transition-colors"
                    >
                        Next
                    </button>
                ) : (
                     <button 
                        onClick={() => setQuizState('result')}
                        className="bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
  };
  
  const renderResult = () => {
    const score = calculateScore();
    const percentage = ((score / quizQuestions.length) * 100).toFixed(0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-100 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-gray-800">Quiz Complete!</h2>
                <p className="text-brand-gray-500">Here's how you performed on {selectedSubject} past questions.</p>
                <div className="my-4">
                    <p className="text-5xl font-extrabold text-brand-green">{percentage}%</p>
                    <p className="font-semibold text-brand-gray-600">You answered {score} out of {quizQuestions.length} questions correctly.</p>
                </div>
            </div>
            
            <div>
                 <h3 className="text-xl font-bold text-brand-gray-700 mb-4">Review Your Answers</h3>
                 <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                     {quizQuestions.map((q, index) => {
                        const userAnswer = userAnswers[q.id];
                        const isCorrect = userAnswer === q.answer;
                        return (
                            <div key={q.id} className="border-b border-brand-gray-200 pb-3">
                                <p className="font-semibold text-brand-gray-800 mb-2">{index + 1}. {q.question}</p>
                                <p className={`text-sm p-2 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    Your answer: <span className="font-bold">{userAnswer || "Not answered"}</span> {isCorrect ? '✅' : '❌'}
                                </p>
                                {!isCorrect && (
                                    <p className="text-sm p-2 mt-1 rounded-md bg-brand-green-light text-brand-green-dark">
                                        Correct answer: <span className="font-bold">{q.answer}</span>
                                    </p>
                                )}
                            </div>
                        );
                     })}
                 </div>
            </div>

            <button
                onClick={handleSubmit}
                className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-dark transition-colors"
            >
                Done! Go to Dashboard
            </button>
        </div>
    );
  };

  switch (quizState) {
    case 'setup': return renderSetup();
    case 'taking': return renderTakingQuiz();
    case 'result': return renderResult();
    default: return renderSetup();
  }
};

export default PastQuestions;
