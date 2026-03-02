export interface Question {
  question: string;
  options: string[];
  correct: number;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { id: "nollywood", label: "Nollywood", emoji: "🎬", description: "Nigerian movies & actors" },
  { id: "afrobeats", label: "Afrobeats", emoji: "🎵", description: "Nigerian music & artists" },
  { id: "pidgin", label: "Naija Pidgin", emoji: "🗣️", description: "Nigerian Pidgin English" },
  { id: "geography", label: "Naija Geography", emoji: "🗺️", description: "States, cities & landmarks" },
  { id: "football", label: "Super Eagles", emoji: "⚽", description: "Nigerian football history" },
];

export const CATEGORY_QUESTIONS: Record<string, Question[]> = {
  nollywood: [
    {
      question: "Which Nollywood actor played 'Chief' in The Wedding Party?",
      options: ["Richard Mofe-Damijo", "Femi Adebayo", "Ali Nuhu", "Ramsey Nouah"],
      correct: 0,
    },
    {
      question: "Who directed the 2014 Nollywood hit 'Half of a Yellow Sun'?",
      options: ["Kunle Afolayan", "Biyi Bandele", "Tunde Kelani", "Femi Odugbemi"],
      correct: 1,
    },
    {
      question: "In which year was the Nollywood film 'Living in Bondage' released?",
      options: ["1990", "1992", "1995", "1998"],
      correct: 1,
    },
    {
      question: "Which actress is known as 'Mama G' in Nollywood?",
      options: ["Patience Ozokwor", "Ngozi Ezeonu", "Genevieve Nnaji", "Omotola Jalade"],
      correct: 0,
    },
    {
      question: "Genevieve Nnaji starred in which popular 2018 film she also directed?",
      options: ["The Wedding Party", "Lionheart", "October 1", "The CEO"],
      correct: 1,
    },
    {
      question: "Which Nollywood movie was Nigeria's first submission to the Oscars?",
      options: ["October 1", "Lionheart", "76", "The Figurine"],
      correct: 1,
    },
    {
      question: "Pete Edochie is famous for playing which role in a Nigerian TV series?",
      options: ["Chike", "Okonkwo", "Sango", "Jide"],
      correct: 1,
    },
    {
      question: "Which city is often called the hub of Nollywood production?",
      options: ["Abuja", "Port Harcourt", "Asaba", "Kano"],
      correct: 2,
    },
    {
      question: "Which streaming platform has invested heavily in Nollywood originals?",
      options: ["HBO Max", "Netflix", "Disney+", "Apple TV+"],
      correct: 1,
    },
    {
      question: "Funke Akindele is known for which popular Nollywood comedy franchise?",
      options: ["Omo Ghetto", "Jenifa's Diary", "A Trip to Jamaica", "Chief Daddy"],
      correct: 1,
    },
  ],
  afrobeats: [
    {
      question: "'Joro' was a hit song by which artist?",
      options: ["Wizkid", "Davido", "Burna Boy", "Olamide"],
      correct: 0,
    },
    {
      question: "Who sang the hit song 'Fall'?",
      options: ["Wizkid", "Burna Boy", "Davido", "Tekno"],
      correct: 2,
    },
    {
      question: "Burna Boy won a Grammy for which album?",
      options: ["African Giant", "Outside", "Twice as Tall", "Love, Damini"],
      correct: 2,
    },
    {
      question: "Which artist is known as the 'Afrobeats to the World' pioneer?",
      options: ["Davido", "Wizkid", "Burna Boy", "Fela Kuti"],
      correct: 2,
    },
    {
      question: "Tiwa Savage was signed to which international music label?",
      options: ["Sony Music", "Universal Music", "Warner Music", "Interscope"],
      correct: 1,
    },
    {
      question: "Who is known as 'Baddest' in Nigerian music?",
      options: ["Wizkid", "Olamide", "Davido", "Burna Boy"],
      correct: 2,
    },
    {
      question: "What year did Afrobeats pioneer Fela Kuti pass away?",
      options: ["1995", "1997", "2000", "2003"],
      correct: 1,
    },
    {
      question: "Which Nigerian artist collaborated with Beyoncé on 'Brown Skin Girl'?",
      options: ["Tiwa Savage", "Yemi Alade", "Wizkid", "Mr Eazi"],
      correct: 2,
    },
    {
      question: "YBNL Nation is a record label owned by which Nigerian artist?",
      options: ["Davido", "Don Jazzy", "Olamide", "Wizkid"],
      correct: 2,
    },
    {
      question: "Which artist released the album 'Made in Lagos'?",
      options: ["Davido", "Wizkid", "Burna Boy", "Fireboy DML"],
      correct: 1,
    },
  ],
  pidgin: [
    {
      question: "What does 'Ajebutter' mean in Nigerian Pidgin?",
      options: ["Rich person", "Someone who grew up privileged", "Type of food", "Lazy person"],
      correct: 1,
    },
    {
      question: "What does 'Abi' mean in Nigerian Pidgin?",
      options: ["No", "Maybe", "Right? / Isn't it?", "Please"],
      correct: 2,
    },
    {
      question: "What does 'Chop' mean in Nigerian Pidgin?",
      options: ["Cut", "Eat / Food", "Run", "Fight"],
      correct: 1,
    },
    {
      question: "What does 'E don do' mean in Pidgin?",
      options: ["It's done / Over", "He's angry", "Let's go", "It's good"],
      correct: 0,
    },
    {
      question: "What is a 'danfo' in Lagos?",
      options: ["A type of food", "A yellow commercial bus", "A market", "A police officer"],
      correct: 1,
    },
    {
      question: "What does 'Oga' mean in Nigerian Pidgin?",
      options: ["Friend", "Boss / Superior", "Enemy", "Child"],
      correct: 1,
    },
    {
      question: "What does 'Shakara' mean?",
      options: ["Dancing", "Showing off / Acting proud", "Fighting", "Sleeping"],
      correct: 1,
    },
    {
      question: "What does 'Ginger' mean in Nigerian slang?",
      options: ["Spice", "To motivate / hype up", "To be afraid", "A type of music"],
      correct: 1,
    },
    {
      question: "What does 'Wayo' mean in Nigerian Pidgin?",
      options: ["Happiness", "Trickery / Deceit", "Hard work", "Celebration"],
      correct: 1,
    },
    {
      question: "What does 'Ehen' mean in Nigerian Pidgin?",
      options: ["No way", "I see / Continue / Exactly", "Let's go", "Goodbye"],
      correct: 1,
    },
  ],
  geography: [
    {
      question: "Which Nigerian city is known as the 'Centre of Excellence'?",
      options: ["Abuja", "Lagos", "Port Harcourt", "Ibadan"],
      correct: 1,
    },
    {
      question: "What is the capital city of Nigeria?",
      options: ["Lagos", "Kano", "Abuja", "Ibadan"],
      correct: 2,
    },
    {
      question: "Which state is known as the 'Oil Rivers State'?",
      options: ["Delta State", "Rivers State", "Bayelsa State", "Akwa Ibom State"],
      correct: 1,
    },
    {
      question: "Nigeria gained independence from Britain in which year?",
      options: ["1957", "1960", "1963", "1966"],
      correct: 1,
    },
    {
      question: "How many states does Nigeria have?",
      options: ["30", "34", "36", "40"],
      correct: 2,
    },
    {
      question: "Which is the largest state in Nigeria by land area?",
      options: ["Niger State", "Borno State", "Taraba State", "Kwara State"],
      correct: 1,
    },
    {
      question: "What is the longest river in Nigeria?",
      options: ["Benue River", "Niger River", "Cross River", "Kaduna River"],
      correct: 1,
    },
    {
      question: "Aso Rock is located in which Nigerian city?",
      options: ["Lagos", "Kano", "Abuja", "Kaduna"],
      correct: 2,
    },
    {
      question: "Which Nigerian state is known for producing the most cocoa?",
      options: ["Ogun State", "Ondo State", "Osun State", "Ekiti State"],
      correct: 1,
    },
    {
      question: "The famous Yankari Game Reserve is located in which state?",
      options: ["Plateau State", "Taraba State", "Bauchi State", "Gombe State"],
      correct: 2,
    },
  ],
  football: [
    {
      question: "In what year did Nigeria first qualify for the FIFA World Cup?",
      options: ["1990", "1994", "1998", "2002"],
      correct: 1,
    },
    {
      question: "Who is Nigeria's all-time top scorer in World Cup history?",
      options: ["Rashidi Yekini", "Jay-Jay Okocha", "Nwankwo Kanu", "Sunday Oliseh"],
      correct: 0,
    },
    {
      question: "Nigeria won the African Cup of Nations in 2013. Who was the coach?",
      options: ["Samson Siasia", "Stephen Keshi", "Sunday Oliseh", "Gernot Rohr"],
      correct: 1,
    },
    {
      question: "Jay-Jay Okocha played for which French club?",
      options: ["PSG", "Lyon", "Marseille", "Monaco"],
      correct: 0,
    },
    {
      question: "Nigeria's national football team is nicknamed what?",
      options: ["The Falcons", "The Lions", "The Super Eagles", "The Warriors"],
      correct: 2,
    },
    {
      question: "Nwankwo Kanu won the Champions League with which club?",
      options: ["Arsenal", "Ajax", "Inter Milan", "Barcelona"],
      correct: 1,
    },
    {
      question: "How many times has Nigeria won the Africa Cup of Nations?",
      options: ["2", "3", "4", "5"],
      correct: 1,
    },
    {
      question: "Which Nigerian player was known as 'The Wizard of Oz'?",
      options: ["Nwankwo Kanu", "Jay-Jay Okocha", "Rashidi Yekini", "Taribo West"],
      correct: 1,
    },
    {
      question: "Victor Osimhen plays club football for which team?",
      options: ["AC Milan", "Napoli", "PSG", "Chelsea"],
      correct: 2,
    },
    {
      question: "Nigeria beat which country 3-0 in their first-ever World Cup game in 1994?",
      options: ["Greece", "Bulgaria", "Bulgaria", "Argentina"],
      correct: 0,
    },
  ],
};

// Legacy export for backward compatibility — defaults to nollywood
export const QUESTIONS = CATEGORY_QUESTIONS["nollywood"];

export const OPTION_LABELS = ["A", "B", "C", "D"];
export const OPTION_COLORS = ["option-a", "option-b", "option-c", "option-d"];
export const QUESTION_TIME = 15;
export const BASE_POINTS = 100;
