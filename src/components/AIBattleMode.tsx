import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, ArrowLeft, Trophy, Zap, Bot, User, Crown, Play, Coins } from 'lucide-react';
import { Avatar } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AIBattleModeProps {
  avatar: Avatar | null;
  onComplete: (won: boolean, tokensEarned: number) => void;
  onBack: () => void;
}

const battleQuestions = [
  { question: 'What is the capital of South Africa?', options: ['Johannesburg', 'Pretoria', 'Cape Town', 'All three'], correctAnswer: 3 },
  { question: 'How many official languages in SA?', options: ['5', '9', '11', '15'], correctAnswer: 2 },
  { question: 'Table Mountain is in:', options: ['Durban', 'Cape Town', 'Pretoria', 'PE'], correctAnswer: 1 },
  { question: 'Largest city in SA:', options: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria'], correctAnswer: 0 },
  { question: 'SA is known as the ___ nation', options: ['Golden', 'Rainbow', 'Diamond', 'Sunshine'], correctAnswer: 1 },
  { question: 'Madiba refers to:', options: ['Tutu', 'Mandela', 'Ramaphosa', 'Zuma'], correctAnswer: 1 },
  { question: 'The Big 5 includes:', options: ['Lion', 'Elephant', 'Buffalo', 'All'], correctAnswer: 3 },
  { question: 'Kruger National Park is in:', options: ['Western Cape', 'KZN', 'Mpumalanga', 'Free State'], correctAnswer: 2 },
  { question: 'isiZulu word for King:', options: ['Inkosi', 'Morena', 'Rra', 'Hosi'], correctAnswer: 0 },
  { question: 'Ubuntu means:', options: ['Water', 'Humanity', 'Hello', 'Thank you'], correctAnswer: 1 },
  { question: 'Click sounds are in:', options: ['English only', 'isiZulu, isiXhosa', 'Afrikaans', 'None'], correctAnswer: 1 },
  { question: 'Most spoken home language:', options: ['English', 'isiZulu', 'Afrikaans', 'isiXhosa'], correctAnswer: 1 },
  { question: 'Robben Island is near:', options: ['Durban', 'Cape Town', 'PE', 'Joburg'], correctAnswer: 1 },
  { question: 'SA gained democracy in:', options: ['1990', '1992', '1994', '1996'], correctAnswer: 2 },
  { question: 'Gold reef city is in:', options: ['Johannesburg', 'Pretoria', 'Durban', 'Cape Town'], correctAnswer: 0 },
  { question: 'Drakensberg mountains are in:', options: ['Western Cape', 'KZN', 'Limpopo', 'Gauteng'], correctAnswer: 1 },
  { question: 'Mandela\'s first name:', options: ['Rolihlahla', 'Nelson', 'Both', 'Neither'], correctAnswer: 2 },
  { question: 'Smallest official language:', options: ['Tshivenda', 'Xitsonga', 'Sepedi', 'English'], correctAnswer: 0 },
  { question: 'Afrikaans evolved from:', options: ['German', 'Dutch', 'French', 'English'], correctAnswer: 1 },
  { question: 'Venda python dance is called:', options: ['Xibelani', 'Domba', 'Kiba', 'Tshikona'], correctAnswer: 1 },
  { question: 'Sesotho is also official in:', options: ['Zimbabwe', 'Lesotho', 'Botswana', 'Namibia'], correctAnswer: 1 },
  { question: 'Xitsonga Xibelani is a:', options: ['Food', 'Dance', 'Place', 'Greeting'], correctAnswer: 1 },
  { question: 'Setswana "Dumela" means:', options: ['Water', 'I greet you', 'Thank you', 'Goodbye'], correctAnswer: 1 },
  { question: 'Garden Route is in:', options: ['Eastern Cape', 'Western Cape', 'Both', 'KZN'], correctAnswer: 2 },
  { question: 'SA currency is:', options: ['Dollar', 'Pound', 'Rand', 'Peso'], correctAnswer: 2 }
];

export function AIBattleMode({ avatar, onComplete, onBack }: AIBattleModeProps) {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5); // 5 seconds per question
  const [userScore, setUserScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [aiAnswer, setAiAnswer] = useState<number | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof battleQuestions>([]);

  const totalQuestions = 20;

  // Initialize shuffled questions
  useEffect(() => {
    const shuffled = [...battleQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalQuestions);
    setShuffledQuestions(shuffled);
  }, []);

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft === 0) {
      handleTimeout();
    }
  }, [timeLeft, gameState]);

  useEffect(() => {
    // AI answers after random delay (1-3 seconds)
    if (gameState === 'playing' && selectedAnswer === null && currentQuestion) {
      const aiDelay = Math.random() * 2000 + 1000; // 1-3 seconds
      const timer = setTimeout(() => {
        if (selectedAnswer === null && gameState === 'playing') {
          const aiAnswerIndex = Math.random() < 0.75 ? currentQuestion.correctAnswer : Math.floor(Math.random() * 4);
          setAiAnswer(aiAnswerIndex);
          
          if (aiAnswerIndex === currentQuestion.correctAnswer) {
            setAiScore(prev => prev + (10 + timeLeft));
          }
        }
      }, aiDelay);
      return () => clearTimeout(timer);
    }
  }, [currentQuestionIndex, selectedAnswer, gameState, currentQuestion]);

  const handleTimeout = () => {
    if (selectedAnswer === null) {
      // User didn't answer, let AI get points if it answered correctly
      proceedToNext();
    } else {
      proceedToNext();
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(index);
    
    if (index === currentQuestion.correctAnswer) {
      const points = 10 + timeLeft;
      setUserScore(prev => prev + points);
    }

    setTimeout(() => {
      proceedToNext();
    }, 1500);
  };

  const proceedToNext = () => {
    if (currentQuestionIndex + 1 >= totalQuestions) {
      // Battle ended
      setGameState('result');
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAiAnswer(null);
      setTimeLeft(5);
    }
  };

  const handleStart = () => {
    setGameState('playing');
  };

  const handleClaimTokens = () => {
    const won = userScore > aiScore;
    const tokensEarned = won ? 50 : 10;
    onComplete(won, tokensEarned);
    onBack();
  };

  const getAnswerStatus = (index: number, isUser: boolean) => {
    const answer = isUser ? selectedAnswer : aiAnswer;
    if (answer === null) return '';
    if (index === currentQuestion.correctAnswer) return 'correct';
    if (index === answer) return 'incorrect';
    return '';
  };

  // Start Screen
  if (gameState === 'start') {
    return (
      <div className="h-full bg-gradient-to-br from-[#D71920] via-[#002395] to-black flex flex-col items-center justify-center p-6">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="mb-8"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-[#FFB612] to-[#D71920] rounded-full flex items-center justify-center shadow-2xl">
            <Bot className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl text-white mb-4 text-center"
        >
          AI Battle Mode
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-white/70 text-center mb-8"
        >
          Compete against AI in a fast-paced challenge!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 mb-12 w-full max-w-sm"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Timer className="w-6 h-6 text-[#FFB612]" />
              <div>
                <p className="text-white">5 seconds per question</p>
                <p className="text-white/60 text-sm">Answer quickly to earn more points</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-[#FFB612]" />
              <div>
                <p className="text-white">20 questions total</p>
                <p className="text-white/60 text-sm">Beat the AI to win 50 tokens</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="bg-gradient-to-r from-[#FFB612] to-[#D71920] text-white px-16 py-5 rounded-2xl text-2xl shadow-2xl flex items-center gap-3"
        >
          <Play className="w-6 h-6" />
          Start Battle
        </motion.button>
      </div>
    );
  }

  // Result Screen
  if (gameState === 'result') {
    const won = userScore > aiScore;
    const tokensEarned = won ? 50 : 10;

    return (
      <div className="h-full bg-gradient-to-br from-[#D71920] via-[#002395] to-black flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          className={`w-full max-w-sm rounded-3xl p-8 text-center ${
            won
              ? 'bg-gradient-to-br from-[#007A33] to-[#FFB612]'
              : 'bg-gradient-to-br from-[#D71920] to-[#002395]'
          }`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-4"
          >
            <Trophy className="w-full h-full text-white" />
          </motion.div>
          
          <h2 className="text-5xl text-white mb-6">
            {won ? 'Victory!' : userScore === aiScore ? 'Draw!' : 'Defeated!'}
          </h2>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {avatar?.image && (
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <ImageWithFallback src={avatar.image} alt="You" className="w-full h-full object-cover" />
                  </div>
                )}
                <span className="text-white">You</span>
              </div>
              <span className="text-3xl text-white">{userScore}</span>
            </div>
            <div className="h-1 bg-white/20 rounded-full mb-4" />
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-white">AI</span>
              </div>
              <span className="text-3xl text-white">{aiScore}</span>
            </div>
          </div>
          
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-6"
          >
            <div className="flex items-center justify-center gap-2">
              <Coins className="w-6 h-6 text-[#FFB612]" />
              <span className="text-white text-2xl">+{tokensEarned} Tokens</span>
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClaimTokens}
            className="w-full bg-white text-[#002395] py-4 rounded-2xl text-xl shadow-2xl"
          >
            Claim Tokens
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  // Playing Screen
  return (
    <div className="h-full bg-gradient-to-br from-[#D71920] via-[#002395] to-black pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FFB612] to-[#D71920] p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-white">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-white">AI Battle Mode</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white">{currentQuestionIndex + 1}</span>
            <span className="text-white/70">/{totalQuestions}</span>
          </div>
        </div>

        {/* Timer */}
        <motion.div
          animate={{ scale: timeLeft <= 2 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.3, repeat: timeLeft <= 2 ? Infinity : 0 }}
          className="bg-white/20 backdrop-blur-sm rounded-2xl p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <Timer className={`w-6 h-6 ${timeLeft <= 2 ? 'text-[#D71920]' : 'text-white'}`} />
            <span className={`text-3xl ${timeLeft <= 2 ? 'text-[#D71920]' : 'text-white'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${timeLeft <= 2 ? 'bg-[#D71920]' : 'bg-white'}`}
              animate={{ width: `${(timeLeft / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Battle Arena */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* User */}
          <motion.div
            animate={{ scale: selectedAnswer !== null && selectedAnswer === currentQuestion.correctAnswer ? [1, 1.1, 1] : 1 }}
            className="bg-gradient-to-br from-[#007A33] to-[#002395] rounded-2xl p-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                {avatar?.image ? (
                  <ImageWithFallback src={avatar.image} alt="You" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 p-2 text-white" />
                )}
              </div>
              <span className="text-white">You</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/70 text-sm">Score</p>
                <p className="text-3xl text-white">{userScore}</p>
              </div>
            </div>
            {userScore > aiScore && (
              <Crown className="absolute top-2 right-2 w-6 h-6 text-[#FFB612]" />
            )}
          </motion.div>

          {/* AI */}
          <motion.div
            animate={{ scale: aiAnswer !== null && aiAnswer === currentQuestion.correctAnswer ? [1, 1.1, 1] : 1 }}
            className="bg-gradient-to-br from-[#D71920] to-[#FFB612] rounded-2xl p-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="text-white">AI</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/70 text-sm">Score</p>
                <p className="text-3xl text-white">{aiScore}</p>
              </div>
            </div>
            {aiScore > userScore && (
              <Crown className="absolute top-2 right-2 w-6 h-6 text-white" />
            )}
          </motion.div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-4">
              <h2 className="text-xl text-white">{currentQuestion.question}</h2>
            </div>

            {/* Split View - User vs AI */}
            <div className="grid grid-cols-2 gap-2">
              {currentQuestion.options.map((option, index) => {
                const userStatus = getAnswerStatus(index, true);
                const aiStatus = getAnswerStatus(index, false);
                
                return (
                  <motion.button
                    key={index}
                    whileTap={{ scale: selectedAnswer === null ? 0.95 : 1 }}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-3 rounded-xl transition-all relative overflow-hidden ${
                      userStatus === 'correct' || aiStatus === 'correct'
                        ? 'bg-[#007A33] ring-2 ring-[#007A33]'
                        : userStatus === 'incorrect' || aiStatus === 'incorrect'
                        ? 'bg-[#D71920] ring-2 ring-[#D71920]'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <span className="text-white text-sm block mb-2">{option}</span>
                    
                    {/* Indicators */}
                    <div className="flex justify-between items-center">
                      {selectedAnswer === index && (
                        <div className="w-6 h-6 rounded-full bg-[#002395] flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1"></div>
                      {aiAnswer === index && (
                        <div className="w-6 h-6 rounded-full bg-[#FFB612] flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}