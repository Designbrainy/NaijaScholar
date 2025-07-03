
import { PastQuestion, TutorPersonality } from './types';

export const SUBJECTS = [
    'Mathematics',
    'English Language',
    'Biology',
    'Physics',
    'Chemistry',
    'Economics',
    'Government',
    'Literature in English',
];

export const TUTOR_PERSONALITY_PROMPTS: Record<TutorPersonality, string> = {
  [TutorPersonality.Friendly]: `You are NaijaScholar AI, a friendly and encouraging tutor for Nigerian secondary school students.
    Your tone is warm, patient, and you use simple language.
    You often use positive reinforcement like "Great question!", "You're doing great!", "Keep it up!".
    When explaining concepts, use relatable Nigerian examples (e.g., using Naira for money problems, referencing cities like Lagos or Abuja, using common Nigerian names).
    You are preparing students for WAEC, NECO, and JAMB exams. All your explanations must be accurate and aligned with the Nigerian curriculum.
    You can also explain concepts in Nigerian Pidgin if asked.`,
  [TutorPersonality.Strict]: `You are NaijaScholar AI, a strict and disciplined tutor for Nigerian secondary school students.
    Your tone is formal, direct, and focused on accuracy and results. You get straight to the point.
    You correct mistakes firmly but fairly. Your goal is to build discipline and precision.
    You demand focus and hard work. Use phrases like "Focus.", "That is incorrect. The correct answer is...", "Pay close attention.".
    All explanations must be precise, concise, and directly aligned with the WAEC, NECO, and JAMB syllabi. Avoid fluff.
    When explaining, use formal Nigerian examples.`,
  [TutorPersonality.Motivational]: `You are NaijaScholar AI, a motivational coach and tutor for Nigerian secondary school students.
    Your tone is inspiring, uplifting, and full of energy. You are their biggest cheerleader.
    You aim to build confidence and resilience. Use phrases like "You have the potential to succeed!", "Don't give up, every great journey starts with a single step!", "I believe in you!".
    You frame challenges as opportunities for growth. Remind students of their goals and why they are working so hard.
    Connect concepts to future aspirations (e.g., "Understanding this biology concept is key to becoming a doctor!").
    Ensure all information is accurate and relevant for WAEC, NECO, and JAMB exams.`
};

export const PAST_QUESTIONS: PastQuestion[] = [
    {
        id: 1,
        subject: 'Mathematics',
        year: 2022,
        question: 'If x - 2 is a factor of x³ - 5x² + kx + 4, find the value of k.',
        options: ['A. -2', 'B. 2', 'C. 4', 'D. -4'],
        answer: 'B. 2'
    },
    {
        id: 2,
        subject: 'English Language',
        year: 2021,
        question: 'Choose the option that is nearest in meaning to the word in italics: The boy was very *recalcitrant*.',
        options: ['A. obedient', 'B. stubborn', 'C. intelligent', 'D. lazy'],
        answer: 'B. stubborn'
    },
    {
        id: 3,
        subject: 'Biology',
        year: 2022,
        question: 'Which of the following is NOT a function of the liver?',
        options: ['A. Production of bile', 'B. Deamination of amino acids', 'C. Production of insulin', 'D. Detoxification'],
        answer: 'C. Production of insulin'
    },
    {
        id: 4,
        subject: 'Physics',
        year: 2020,
        question: 'A car accelerates uniformly from rest at 4 m/s². How far does it travel in the 5th second?',
        options: ['A. 18 m', 'B. 32 m', 'C. 50 m', 'D. 100 m'],
        answer: 'A. 18 m'
    },
    {
        id: 5,
        subject: 'Chemistry',
        year: 2021,
        question: 'Which of the following separation techniques is most suitable for separating a mixture of sand, ammonium chloride, and sodium chloride?',
        options: ['A. Sublimation followed by filtration', 'B. Sublimation followed by addition of water and evaporation', 'C. Sublimation followed by addition of water and filtration', 'D. Filtration followed by evaporation'],
        answer: 'C. Sublimation followed by addition of water and filtration'
    },
    {
        id: 6,
        subject: 'Government',
        year: 2019,
        question: 'Who is the head of the judiciary in Nigeria?',
        options: ['A. The President', 'B. The Senate President', 'C. The Chief Justice of Nigeria', 'D. The Attorney General'],
        answer: 'C. The Chief Justice of Nigeria'
    },
    {
        id: 7,
        subject: 'Literature in English',
        year: 2022,
        question: 'The theme of colonialism is central to which of these books by Chinua Achebe?',
        options: ['A. No Longer at Ease', 'B. Things Fall Apart', 'C. Arrow of God', 'D. A Man of the People'],
        answer: 'B. Things Fall Apart'
    },
    {
        id: 8,
        subject: 'Economics',
        year: 2020,
        question: 'An increase in the supply of a commodity, with demand remaining constant, will lead to...',
        options: ['A. a fall in price', 'B. a rise in price', 'C. no change in price', 'D. an initial rise then fall in price'],
        answer: 'A. a fall in price'
    },
    {
        id: 9,
        subject: 'Mathematics',
        year: 2019,
        question: 'Solve for y in the equation 2y + 5 = 15.',
        options: ['A. y = 10', 'B. y = 7.5', 'C. y = 5', 'D. y = 20'],
        answer: 'C. y = 5'
    },
    {
        id: 10,
        subject: 'English Language',
        year: 2022,
        question: 'From the words lettered A to D, choose the word that has the same vowel sound as the one in the word: Seat',
        options: ['A. Sit', 'B. Set', 'C. Key', 'D. Site'],
        answer: 'C. Key'
    },
    {
        id: 11,
        subject: 'Physics',
        year: 2021,
        question: 'What is the standard international (SI) unit of electrical resistance?',
        options: ['A. Ampere', 'B. Volt', 'C. Watt', 'D. Ohm'],
        answer: 'D. Ohm'
    },
    {
        id: 12,
        subject: 'Chemistry',
        year: 2020,
        question: 'The process of coating a metal with a thin layer of another metal using electricity is called?',
        options: ['A. Galvanization', 'B. Electroplating', 'C. Smelting', 'D. Annealing'],
        answer: 'B. Electroplating'
    },
    {
        id: 13,
        subject: 'Biology',
        year: 2021,
        question: 'The part of the cell responsible for generating most of the cell\'s supply of adenosine triphosphate (ATP), used as a source of chemical energy, is the:',
        options: ['A. Nucleus', 'B. Ribosome', 'C. Mitochondrion', 'D. Cell wall'],
        answer: 'C. Mitochondrion'
    },
    {
        id: 14,
        subject: 'Government',
        year: 2020,
        question: 'A system of government where the head of state is also the head of government is known as:',
        options: ['A. Parliamentary System', 'B. Presidential System', 'C. Monarchical System', 'D. Feudal System'],
        answer: 'B. Presidential System'
    },
    {
        id: 15,
        subject: 'Economics',
        year: 2022,
        question: 'The desire for a commodity backed by the ability to pay is known as:',
        options: ['A. Want', 'B. Need', 'C. Effective Demand', 'D. Supply'],
        answer: 'C. Effective Demand'
    }
];