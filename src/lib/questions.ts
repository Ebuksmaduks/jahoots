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
  { id: "geography", label: "Naija Geography", emoji: "🗺️", description: "Nigerian states, cities & landmarks" },
  { id: "supereagles", label: "Super Eagles", emoji: "🦅", description: "Nigerian football legends" },
];

export const CATEGORY_QUESTIONS: Record<string, Question[]> = {
  nollywood: [
    { question: "Which Nollywood actor played 'Chief' in The Wedding Party?", options: ["Richard Mofe-Damijo", "Femi Adebayo", "Ali Nuhu", "Ramsey Nouah"], correct: 0 },
    { question: "Who directed the Nollywood blockbuster 'King of Boys'?", options: ["Kunle Afolayan", "Kemi Adetiba", "Tunde Kelani", "Mo Abudu"], correct: 1 },
    { question: "Which actress starred in 'Isoken' (2017)?", options: ["Genevieve Nnaji", "Osas Ighodaro", "Funke Akindele", "Toyin Abraham"], correct: 1 },
    { question: "Genevieve Nnaji directed which Netflix Nollywood film?", options: ["Chief Daddy", "Lion Heart", "The Wedding Party", "Merry Men"], correct: 1 },
    { question: "Which Nollywood film was Nigeria's first submission for Oscar consideration?", options: ["Half of a Yellow Sun", "Lion Heart", "76", "October 1"], correct: 1 },
    { question: "Who plays 'Sola' in the Yoruba film series 'Jenifa'?", options: ["Mercy Johnson", "Toyin Abraham", "Funke Akindele", "Omotola Jalade"], correct: 2 },
    { question: "Which actor is nicknamed 'Mr. Nollywood'?", options: ["Ramsey Nouah", "Pete Edochie", "Jim Iyke", "John Okafor"], correct: 0 },
    { question: "In which year was Nollywood officially recognized as the world's second-largest film industry?", options: ["2005", "2009", "2014", "2019"], correct: 1 },
    { question: "Who starred in the 2015 hit 'The Arbitration'?", options: ["Osas Ighodaro", "Damilola Adegbite", "Kate Henshaw", "Bimbo Ademoye"], correct: 1 },
    { question: "Which Nollywood veteran is known for the role of 'Okonkwo' in Things Fall Apart (TV)?", options: ["Pete Edochie", "Sam Loco Efe", "Zack Orji", "Kanayo O. Kanayo"], correct: 0 },
  ],
  afrobeats: [
    { question: "'Joro' was a hit song by which artist?", options: ["Wizkid", "Davido", "Burna Boy", "Olamide"], correct: 0 },
    { question: "Burna Boy's Grammy-winning album was called?", options: ["African Giant", "Twice as Tall", "Outside", "On a Spaceship"], correct: 1 },
    { question: "Which artist is known as 'Omo Baba Olowo'?", options: ["Wizkid", "Davido", "Tekno", "Tiwa Savage"], correct: 1 },
    { question: "Who sang 'Ye' — one of Nigeria's biggest street anthems?", options: ["Olamide", "Burna Boy", "Wizkid", "Phyno"], correct: 1 },
    { question: "Tiwa Savage's debut album was titled?", options: ["R.E.D", "Celia", "Sugar Cane", "Still Revealing"], correct: 0 },
    { question: "Which artist released 'Essence' featuring Tems?", options: ["Davido", "Wizkid", "Burna Boy", "Rema"], correct: 1 },
    { question: "Rema's international breakthrough song was called?", options: ["Iron Man", "Calm Down", "Dumebi", "Bad Commando"], correct: 1 },
    { question: "Who is known as 'Odogwu' in Afrobeats?", options: ["Davido", "Wizkid", "Burna Boy", "Olamide"], correct: 2 },
    { question: "D'banj's classic hit 'Oliver Twist' was released in which year?", options: ["2010", "2012", "2014", "2008"], correct: 1 },
    { question: "Fela Kuti's genre of music is called?", options: ["Afropop", "Afrobeats", "Afrobeat", "Afrojuju"], correct: 2 },
  ],
  pidgin: [
    { question: "What does 'Ajebutter' mean in Nigerian Pidgin?", options: ["Rich person", "Someone who grew up privileged", "Type of food", "Lazy person"], correct: 1 },
    { question: "What does 'E don do' mean?", options: ["It is finished/over", "He is done working", "The food is ready", "Time is up"], correct: 0 },
    { question: "'Abi' is used in Pidgin to mean?", options: ["Maybe", "Right? / Isn't it?", "Never", "Always"], correct: 1 },
    { question: "What does 'Shine your eye' mean?", options: ["Look good", "Be smart/alert", "Cry", "Wear glasses"], correct: 1 },
    { question: "What does 'Gbege' mean?", options: ["Dance move", "Trouble/chaos", "Money", "Big celebration"], correct: 1 },
    { question: "'Oya' in Pidgin is used to mean?", options: ["Stop", "Come on / Let's go", "Goodbye", "Thank you"], correct: 1 },
    { question: "What does 'Sapa' mean in Nigerian slang?", options: ["Cool person", "Being extremely broke", "A tasty meal", "Dance style"], correct: 1 },
    { question: "What does 'Abeg' mean?", options: ["Excuse me", "Please", "Why", "Hurry up"], correct: 1 },
    { question: "What is a 'Maga' in Nigerian Pidgin?", options: ["A strong person", "A gullible victim", "A rich man", "A policeman"], correct: 1 },
    { question: "'No wahala' means?", options: ["Big problem", "No problem", "Come here", "Be careful"], correct: 1 },
  ],
  geography: [
    { question: "Which Nigerian city is known as the 'Centre of Excellence'?", options: ["Abuja", "Lagos", "Port Harcourt", "Ibadan"], correct: 1 },
    { question: "How many states does Nigeria have?", options: ["30", "34", "36", "38"], correct: 2 },
    { question: "What is the capital city of Oyo State?", options: ["Ogbomosho", "Ibadan", "Osogbo", "Ile-Ife"], correct: 1 },
    { question: "Which river is the longest in Nigeria?", options: ["River Benue", "River Niger", "River Kaduna", "Cross River"], correct: 1 },
    { question: "Aso Rock is located in which city?", options: ["Lagos", "Ibadan", "Abuja", "Kaduna"], correct: 2 },
    { question: "Which state is called the 'Sunshine State'?", options: ["Ondo", "Ogun", "Ekiti", "Osun"], correct: 0 },
    { question: "What is the capital of Cross River State?", options: ["Uyo", "Calabar", "Owerri", "Port Harcourt"], correct: 1 },
    { question: "Nigeria shares a border with how many countries?", options: ["3", "4", "5", "6"], correct: 1 },
    { question: "Which is the largest state by land area in Nigeria?", options: ["Borno", "Niger", "Taraba", "Zamfara"], correct: 1 },
    { question: "The Zuma Rock is located in which state?", options: ["Abuja FCT", "Niger State", "Kaduna State", "Kogi State"], correct: 1 },
  ],
  supereagles: [
    { question: "Who scored Nigeria's first-ever World Cup goal?", options: ["Rashidi Yekini", "Jay-Jay Okocha", "Sunday Oliseh", "Finidi George"], correct: 0 },
    { question: "Nigeria won the Africa Cup of Nations in which year most recently?", options: ["2010", "2013", "2015", "2019"], correct: 1 },
    { question: "Which Nigerian player was known as 'The Magic Carpet'?", options: ["Nwankwo Kanu", "Jay-Jay Okocha", "Sunday Oliseh", "Taribo West"], correct: 1 },
    { question: "Nwankwo Kanu won the UEFA Champions League with which club?", options: ["Arsenal", "Inter Milan", "Ajax", "AC Milan"], correct: 2 },
    { question: "Which Nigerian won the Premier League's PFA Young Player of the Year in 2019?", options: ["Alex Iwobi", "Kelechi Iheanacho", "Wilfred Ndidi", "Ahmed Musa"], correct: 1 },
    { question: "Nigeria's 1994 AFCON was held in which country?", options: ["Nigeria", "Tunisia", "South Africa", "Senegal"], correct: 0 },
    { question: "Who is Nigeria's all-time top scorer?", options: ["Rashidi Yekini", "Emmanuel Amuneke", "Victor Moses", "Jay-Jay Okocha"], correct: 0 },
    { question: "Which Super Eagles coach led Nigeria to the 2013 AFCON title?", options: ["Samson Siasia", "Stephen Keshi", "Gernot Rohr", "Lars Lagerbäck"], correct: 1 },
    { question: "Taribo West was famous for playing in which position?", options: ["Forward", "Midfielder", "Centre-back", "Goalkeeper"], correct: 2 },
    { question: "Nigeria first qualified for the FIFA World Cup in which year?", options: ["1990", "1994", "1998", "2002"], correct: 1 },
  ],
};
// Legacy export for backward compatibility
export const QUESTIONS: Question[] = CATEGORY_QUESTIONS["nollywood"];

export const OPTION_LABELS = ["A", "B", "C", "D"];
export const OPTION_COLORS = ["option-a", "option-b", "option-c", "option-d"];
export const QUESTION_TIME = 15;
export const BASE_POINTS = 100;
