export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export const QUESTIONS: Question[] = [
  {
    question: "Which Nollywood actor played 'Chief' in The Wedding Party?",
    options: ["Richard Mofe-Damijo", "Femi Adebayo", "Ali Nuhu", "Ramsey Nouah"],
    correct: 0,
  },
  {
    question: "'Joro' was a hit song by which artist?",
    options: ["Wizkid", "Davido", "Burna Boy", "Olamide"],
    correct: 1,
  },
  {
    question: "What does 'Ajebutter' mean in Nigerian Pidgin?",
    options: ["Rich person", "Someone who grew up privileged", "Type of food", "Lazy person"],
    correct: 1,
  },
  {
    question: "Which Nigerian city is known as the 'Centre of Excellence'?",
    options: ["Abuja", "Lagos", "Port Harcourt", "Ibadan"],
    correct: 1,
  },
  {
    question: "Who sang the hit song 'Fall'?",
    options: ["Davido", "Wizkid", "Burna Boy", "Tekno"],
    correct: 0,
  },
];

export const OPTION_LABELS = ["A", "B", "C", "D"];
export const OPTION_COLORS = ["option-a", "option-b", "option-c", "option-d"];
export const QUESTION_TIME = 15;
export const BASE_POINTS = 100;
