import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowLeft, Trophy, Zap, X, Check } from 'lucide-react';
import { sounds } from '../utils/sounds';

interface ChallengeScreenProps {
  language: string;
  onComplete: (correct: boolean, tokensEarned: number, language: string) => void;
  onBack: () => void;
}

const challengesByLanguage: Record<string, Array<{
  question: string;
  options: string[];
  correctAnswer: number;
}>> = {
  'isiZulu': [
    { question: 'How do you say "Hello" in isiZulu?', options: ['Sawubona', 'Dumela', 'Molo', 'Avuxeni'], correctAnswer: 0 },
    { question: 'What does "Ngiyabonga" mean?', options: ['Goodbye', 'Thank you', 'Please', 'Welcome'], correctAnswer: 1 },
    { question: 'How do you say "Water" in isiZulu?', options: ['Metsi', 'Amanzi', 'Mati', 'Wata'], correctAnswer: 1 },
    { question: '"Unjani?" means:', options: ['How are you?', 'What is your name?', 'Where are you?', 'See you later'], correctAnswer: 0 },
    { question: 'The word "Inkosi" means:', options: ['Teacher', 'Child', 'King/Chief', 'Friend'], correctAnswer: 2 }
  ],
  'isiXhosa': [
    { question: 'How do you greet someone in isiXhosa?', options: ['Sawubona', 'Molo', 'Dumela', 'Halala'], correctAnswer: 1 },
    { question: '"Enkosi" means:', options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'], correctAnswer: 2 },
    { question: 'What is "Ubuntu"?', options: ['A food', 'Humanity/togetherness', 'A place', 'A dance'], correctAnswer: 1 },
    { question: 'How do you say "Yes" in isiXhosa?', options: ['Yebo', 'Ewe', 'Ee', 'Ja'], correctAnswer: 1 },
    { question: '"Hamba kahle" means:', options: ['Welcome', 'Go well/Goodbye', 'Good morning', 'Thank you'], correctAnswer: 1 }
  ],
  'Sesotho': [
    { question: 'How do you say "Hello" in Sesotho?', options: ['Dumela', 'Sawubona', 'Molo', 'Hello'], correctAnswer: 0 },
    { question: '"Kea leboha" means:', options: ['Welcome', 'Please', 'Thank you', 'Goodbye'], correctAnswer: 2 },
    { question: 'What is "Metsi" in English?', options: ['Food', 'Water', 'Air', 'Fire'], correctAnswer: 1 },
    { question: 'How do you say "Friend" in Sesotho?', options: ['Motswalle', 'Ngwana', 'Mora', 'Morena'], correctAnswer: 0 },
    { question: '"O kae?" means:', options: ['Who are you?', 'Where are you?', 'How are you?', 'Why?'], correctAnswer: 1 }
  ],
  'Setswana': [
    { question: 'How do you greet in Setswana?', options: ['Dumelang', 'Sawubona', 'Molo', 'Thobela'], correctAnswer: 0 },
    { question: '"Ke a leboga" means:', options: ['Hello', 'Goodbye', 'Thank you', 'Please'], correctAnswer: 2 },
    { question: 'What does "Rra" mean?', options: ['Sir/Father', 'Child', 'Mother', 'Teacher'], correctAnswer: 0 },
    { question: 'How do you say "Good" in Setswana?', options: ['Sentle', 'Bontle', 'Molemo', 'Botoka'], correctAnswer: 0 },
    { question: '"O tsogile jang?" means:', options: ['Where are you?', 'How did you wake up?', 'What is your name?', 'See you later'], correctAnswer: 1 }
  ],
  'Sepedi': [
    { question: 'How do you say "Hello" in Sepedi?', options: ['Thobela', 'Dumela', 'Molo', 'Sawubona'], correctAnswer: 0 },
    { question: '"Ke a leboga" means:', options: ['Welcome', 'Thank you', 'Goodbye', 'Please'], correctAnswer: 1 },
    { question: 'What is "Meetse" in English?', options: ['Food', 'Fire', 'Water', 'Wind'], correctAnswer: 2 },
    { question: 'How do you say "Mother" in Sepedi?', options: ['Mma', 'Malome', 'Rakgadi', 'Koko'], correctAnswer: 0 },
    { question: '"O kae?" means:', options: ['How are you?', 'Where are you?', 'Who are you?', 'When?'], correctAnswer: 1 }
  ],
  'Tshivenda': [
    { question: 'How do you greet in Tshivenda?', options: ['Ndaa', 'Avuxeni', 'Dumela', 'Molo'], correctAnswer: 1 },
    { question: '"Ndo livhuwa" means:', options: ['Hello', 'Thank you', 'Goodbye', 'Please'], correctAnswer: 1 },
    { question: 'What does "Madi" mean?', options: ['Water', 'Food', 'Money', 'House'], correctAnswer: 0 },
    { question: 'How do you say "Yes" in Tshivenda?', options: ['Yebo', 'Ee', 'Ndi', 'Iya'], correctAnswer: 2 },
    { question: '"Vha khou ita hani?" means:', options: ['What is your name?', 'How are you doing?', 'Where are you?', 'Goodbye'], correctAnswer: 1 }
  ],
  'Xitsonga': [
    { question: 'How do you say "Hello" in Xitsonga?', options: ['Avuxeni', 'Dumela', 'Molo', 'Sawubona'], correctAnswer: 0 },
    { question: '"Ndza khensa" means:', options: ['Goodbye', 'Thank you', 'Welcome', 'Please'], correctAnswer: 1 },
    { question: 'What is "Mati" in English?', options: ['Fire', 'Water', 'Food', 'Air'], correctAnswer: 1 },
    { question: 'How do you say "Friend" in Xitsonga?', options: ['Mhani', 'Nwana', 'Tate', 'Mama'], correctAnswer: 0 },
    { question: '"U kwihi?" means:', options: ['How are you?', 'Where are you?', 'Who are you?', 'What time?'], correctAnswer: 1 }
  ],
  'Afrikaans': [
    { question: 'How do you say "Hello" in Afrikaans?', options: ['Hallo', 'Goeie dag', 'Both are correct', 'Totsiens'], correctAnswer: 2 },
    { question: '"Dankie" means:', options: ['Please', 'Thank you', 'Sorry', 'Welcome'], correctAnswer: 1 },
    { question: 'What is "Water" in Afrikaans?', options: ['Wasser', 'Water', 'Vloei', 'Nat'], correctAnswer: 1 },
    { question: 'How do you say "Goodbye" in Afrikaans?', options: ['Hallo', 'Dankie', 'Totsiens', 'Asseblief'], correctAnswer: 2 },
    { question: '"Hoe gaan dit?" means:', options: ['Where are you?', 'How are you?', 'What is your name?', 'See you later'], correctAnswer: 1 }
  ],
  'English': [
    { question: 'South Africa is known as the ___ nation', options: ['Colorful', 'Rainbow', 'Diverse', 'Beautiful'], correctAnswer: 1 },
    { question: 'How many official languages does SA have?', options: ['5', '9', '11', '7'], correctAnswer: 2 },
    { question: 'The capital city of South Africa is:', options: ['Johannesburg', 'Pretoria', 'Cape Town', 'All three'], correctAnswer: 3 },
    { question: 'Table Mountain is located in:', options: ['Durban', 'Pretoria', 'Cape Town', 'Port Elizabeth'], correctAnswer: 2 },
    { question: 'Nelson Mandela\'s clan name was:', options: ['Madiba', 'Ubuntu', 'Tata', 'Khulu'], correctAnswer: 0 }
  ]
};

export function ChallengeScreen({ language, onComplete, onBack }: ChallengeScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(30); // Changed to 30 seconds
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());
  const [shuffledQuestions, setShuffledQuestions] = useState<Array<typeof challenges[0]>>([]);

  const challenges = challengesByLanguage[language] || challengesByLanguage['English'];

  // Initialize shuffled questions on mount
  useEffect(() => {
    const shuffled = [...challenges].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
  }, [language]);

  const currentChallenge = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, showResult]);

  const handleTimeout = () => {
    setShowResult(true);
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null || !currentChallenge) return;
    
    setSelectedAnswer(index);
    const correct = index === currentChallenge.correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      const tokensEarned = 10; // Fixed tokens per correct answer
      setScore(score + tokensEarned);
      onComplete(true, tokensEarned, language);
      sounds.success();
      sounds.coin();
    } else {
      onComplete(false, 0, language);
      sounds.error();
    }

    setQuestionsAnswered(questionsAnswered + 1);

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      
      // Move to next question, cycling through available questions
      const nextIndex = (currentQuestionIndex + 1) % shuffledQuestions.length;
      setCurrentQuestionIndex(nextIndex);
      
      // If we've gone through all questions, reshuffle
      if (nextIndex === 0) {
        const reshuffled = [...challenges].sort(() => Math.random() - 0.5);
        setShuffledQuestions(reshuffled);
      }
    }, 1500);
  };

  if (!currentChallenge) {
    return null;
  }

  const getAnswerColor = (index: number) => {
    if (selectedAnswer === null) return 'bg-white/10 hover:bg-white/20';
    if (index === currentChallenge.correctAnswer) return 'bg-[#007A33] ring-4 ring-[#007A33]/50';
    if (index === selectedAnswer && !isCorrect) return 'bg-[#D71920] ring-4 ring-[#D71920]/50';
    return 'bg-white/5';
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#002395] via-[#007A33] to-black pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D71920] to-[#FFB612] p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-white" />
            <span className="text-white">{score} tokens</span>
          </div>
        </div>

        {/* Timer */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: timeLeft < 10 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft < 10 ? Infinity : 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-[#D71920]' : 'text-white'}`} />
              <span className="text-white">{language}</span>
            </div>
            <span className={`text-3xl ${timeLeft < 10 ? 'text-[#D71920]' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft < 10 ? 'bg-[#D71920]' : 'bg-[#FFB612]'}`}
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 30) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Question Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="mb-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-2">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-8 h-8 bg-[#FFB612] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white">{(currentQuestionIndex % challenges.length) + 1}</span>
                </div>
                <h2 className="text-2xl text-white flex-1">{currentChallenge.question}</h2>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                <Zap className="w-5 h-5 text-[#FFB612] mx-auto mb-1" />
                <p className="text-white/70 text-sm">Questions</p>
                <p className="text-white text-xl">{questionsAnswered}</p>
              </div>
              <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center">
                <Trophy className="w-5 h-5 text-[#FFB612] mx-auto mb-1" />
                <p className="text-white/70 text-sm">Score</p>
                <p className="text-white text-xl">{score}</p>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentChallenge.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={selectedAnswer === null ? { scale: 1.02 } : {}}
                  whileTap={selectedAnswer === null ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-xl ${getAnswerColor(index)} backdrop-blur-sm transition-all text-left flex items-center justify-between group`}
                >
                  <span className="text-white text-lg">{option}</span>
                  {selectedAnswer !== null && index === currentChallenge.correctAnswer && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 text-[#007A33]" />
                    </motion.div>
                  )}
                  {selectedAnswer === index && !isCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                    >
                      <X className="w-5 h-5 text-[#D71920]" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-br from-[#D71920] to-[#002395] rounded-3xl p-8 mx-6 text-center"
            >
              <h2 className="text-4xl text-white mb-4">Time's Up!</h2>
              <p className="text-white/80 text-xl">Final Score: {score} tokens</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}