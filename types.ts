
export enum AppView {
  Dashboard = 'DASHBOARD',
  Tutor = 'TUTOR',
  MockTest = 'MOCK_TEST',
  PastQuestions = 'PAST_QUESTIONS'
}

export enum TutorPersonality {
  Friendly = 'Friendly',
  Strict = 'Strict',
  Motivational = 'Motivational'
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export interface PastQuestion {
  id: number;
  subject: string;
  year: number;
  question: string;
  options: string[];
  answer: string;
}

export interface MockQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface MockTestResult {
  subject: string;
  score: number;
  totalQuestions: number;
  date: string;
}
