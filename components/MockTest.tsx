
import React, { useState, useEffect, useCallback } from 'react';
import { generateMockTest } from '../services/geminiService';
import { MockQuestion, MockTestResult } from '../types';
import { SUBJECTS } from '../constants';
import Spinner from './Spinner';

interface MockTestProps {
  onTestComplete: (result: MockTestResult) => void;
}

type TestState = 'setup' | 'generating' | 'taking' | 'result';

const MockTest: React.FC<MockTestProps> = ({ onTestComplete }) => {
  const [testState, setTestState] = useState<TestState>('setup');
  const [subject, setSubject] = useState<string>(SUBJECTS[0]);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const startTest = async () => {
    setTestState('generating');
    setError(null);
    try {
      const generatedQuestions = await generateMockTest(subject, numQuestions);
      setQuestions(generatedQuestions);
      setUserAnswers(new Array(generatedQuestions.length).fill(null));
      setCurrentQuestionIndex(0);
      setTimeLeft(generatedQuestions.length * 60); // 60 seconds per question
      setTestState('taking');
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setTestState('setup');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmit = useCallback(() => {
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correctAnswer) {
        score++;
      }
    }
    const result: MockTestResult = {
      subject,
      score,
      totalQuestions: questions.length,
      date: new Date().toLocaleDateString('en-GB'),
    };
    onTestComplete(result);
    // Reset to setup for a new test
    setTestState('setup');
  }, [questions, userAnswers, subject, onTestComplete]);


  useEffect(() => {
    if (testState === 'taking' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
    if(testState === 'taking' && timeLeft === 0){
        setTestState('result');
    }
  }, [timeLeft, testState]);

  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
        return answer === questions[index].correctAnswer ? score + 1 : score;
    }, 0);
  }

  const renderSetup = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-100 space-y-6">
      <h2 className="text-2xl font-bold text-brand-gray-800">Create Mock Test</h2>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg">{error}</div>}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-brand-gray-700 mb-1">Subject</label>
        <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-3 bg-brand-gray-50 border border-brand-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green text-brand-gray-800">
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="numQuestions" className="block text-sm font-medium text-brand-gray-700 mb-1">Number of Questions</label>
        <select id="numQuestions" value={numQuestions} onChange={e => setNumQuestions(Number(e.target.value))} className="w-full p-3 bg-brand-gray-50 border border-brand-gray-300 rounded-lg shadow-sm focus:ring-brand-green focus:border-brand-green text-brand-gray-800">
          <option value={5}>5 Questions</option>
          <option value={10}>10 Questions</option>
          <option value={20}>20 Questions</option>
          <option value={50}>50 Questions</option>
        </select>
      </div>
      <button onClick={startTest} className="w-full bg-brand-green text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-green-dark transition-colors">
        Start Test
      </button>
    </div>
  );

  const renderGenerating = () => (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm border border-brand-gray-100">
      <Spinner size="lg" />
      <p className="mt-4 text-brand-gray-600 font-semibold">Generating your test...</p>
      <p className="text-sm text-brand-gray-500">Please wait, the AI is crafting your questions.</p>
    </div>
  );
  
  const renderTakingTest = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-brand-gray-200">
                <div>
                    <h2 className="text-xl font-bold text-brand-gray-800">{subject} Test</h2>
                    <p className="text-sm text-brand-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
                <div className="text-lg font-semibold bg-brand-green-light text-brand-green-dark py-1 px-3 rounded-full">
                    {minutes}:{seconds < 10 ? '0' : ''}{seconds}
                </div>
            </div>
            
            <p className="text-brand-gray-700 font-medium text-lg leading-relaxed">{currentQuestion.question}</p>

            <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className={`w-full text-left p-3 border rounded-lg transition-all duration-200 ${
                            userAnswers[currentQuestionIndex] === option
                                ? 'bg-brand-green text-white border-brand-green-dark ring-2 ring-brand-green'
                                : 'bg-white text-brand-gray-700 border-brand-gray-300 hover:bg-brand-gray-100 hover:border-brand-gray-400'
                        }`}
                    >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>{option}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={() => setTestState('result')}
                  className="bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors"
                >
                    End Test
                </button>
                {currentQuestionIndex < questions.length - 1 ? (
                    <button 
                        onClick={handleNext} 
                        className="bg-brand-green text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-green-dark transition-colors"
                    >
                        Next
                    </button>
                ) : (
                     <button 
                        onClick={() => setTestState('result')}
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
    const percentage = ((score / questions.length) * 100).toFixed(0);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-gray-100 space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-brand-gray-800">Test Complete!</h2>
                <p className="text-brand-gray-500">Here's how you performed in {subject}.</p>
                <div className="my-4">
                    <p className="text-5xl font-extrabold text-brand-green">{percentage}%</p>
                    <p className="font-semibold text-brand-gray-600">You answered {score} out of {questions.length} questions correctly.</p>
                </div>
            </div>
            
            <div>
                 <h3 className="text-xl font-bold text-brand-gray-700 mb-4">Review Your Answers</h3>
                 <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                     {questions.map((q, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === q.correctAnswer;
                        return (
                            <div key={index} className="border-b border-brand-gray-200 pb-3">
                                <p className="font-semibold text-brand-gray-800 mb-2">{index + 1}. {q.question}</p>
                                <p className={`text-sm p-2 rounded-md ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    Your answer: <span className="font-bold">{userAnswer || "Not answered"}</span> {isCorrect ? '✅' : '❌'}
                                </p>
                                {!isCorrect && (
                                    <p className="text-sm p-2 mt-1 rounded-md bg-brand-green-light text-brand-green-dark">
                                        Correct answer: <span className="font-bold">{q.correctAnswer}</span>
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


  switch (testState) {
    case 'setup': return renderSetup();
    case 'generating': return renderGenerating();
    case 'taking': return renderTakingTest();
    case 'result': return renderResult();
    default: return renderSetup();
  }
};

export default MockTest;