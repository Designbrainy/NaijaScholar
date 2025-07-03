
import React, { useState, useCallback } from 'react';
import { DashboardIcon, TutorIcon, TestIcon, PastQuestionsIcon } from './components/icons';
import Dashboard from './components/Dashboard';
import TutorChat from './components/TutorChat';
import MockTest from './components/MockTest';
import PastQuestions from './components/PastQuestions';
import { AppView, MockTestResult } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.Dashboard);
  const [mockTestResults, setMockTestResults] = useState<MockTestResult[]>([]);

  const addMockTestResult = useCallback((result: MockTestResult) => {
    setMockTestResults(prevResults => [...prevResults, result]);
    setCurrentView(AppView.Dashboard);
  }, []);

  const renderView = () => {
    switch (currentView) {
      case AppView.Dashboard:
        return <Dashboard results={mockTestResults} />;
      case AppView.Tutor:
        return <TutorChat />;
      case AppView.MockTest:
        return <MockTest onTestComplete={addMockTestResult} />;
      case AppView.PastQuestions:
        return <PastQuestions onTestComplete={addMockTestResult} />;
      default:
        return <Dashboard results={mockTestResults} />;
    }
  };

  const NavItem: React.FC<{
    view: AppView;
    label: string;
    icon: React.ReactNode;
  }> = ({ view, label, icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        currentView === view ? 'text-brand-green' : 'text-brand-gray-500 hover:text-brand-green'
      }`}
    >
      {icon}
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="w-full max-w-lg mx-auto h-screen font-sans bg-brand-gray-50 flex flex-col">
      <header className="bg-brand-green text-white p-4 shadow-md z-10">
          <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-brand-green">N</span>
              </div>
              <h1 className="text-xl font-bold">NaijaScholar AI</h1>
          </div>
      </header>
      
      <main className="flex-grow overflow-y-auto pb-20">
        <div className="p-4">
            {renderView()}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 w-full max-w-lg mx-auto bg-white border-t border-brand-gray-200 shadow-t-md">
        <div className="flex justify-around items-center h-16">
          <NavItem view={AppView.Dashboard} label="Dashboard" icon={<DashboardIcon />} />
          <NavItem view={AppView.Tutor} label="AI Tutor" icon={<TutorIcon />} />
          <NavItem view={AppView.MockTest} label="Mock Test" icon={<TestIcon />} />
          <NavItem view={AppView.PastQuestions} label="Questions" icon={<PastQuestionsIcon />} />
        </div>
      </footer>
    </div>
  );
};

export default App;