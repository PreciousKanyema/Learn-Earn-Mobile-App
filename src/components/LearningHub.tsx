import { motion } from 'motion/react';
import { Timer, BookOpen, Sparkles } from 'lucide-react';

interface LearningHubProps {
  onStartChallenge: (language: string) => void;
}

const languages = [
  { name: 'isiZulu', flag: '🇿🇦', color: 'from-[#007A33] to-[#002395]' },
  { name: 'isiXhosa', flag: '🇿🇦', color: 'from-[#FFB612] to-[#D71920]' },
  { name: 'Sesotho', flag: '🇿🇦', color: 'from-[#D71920] to-[#007A33]' },
  { name: 'Setswana', flag: '🇿🇦', color: 'from-[#002395] to-[#FFB612]' },
  { name: 'Sepedi', flag: '🇿🇦', color: 'from-[#007A33] to-[#FFB612]' },
  { name: 'Tshivenda', flag: '🇿🇦', color: 'from-[#D71920] to-[#002395]' },
  { name: 'Xitsonga', flag: '🇿🇦', color: 'from-[#FFB612] to-[#007A33]' },
  { name: 'Afrikaans', flag: '🇿🇦', color: 'from-[#002395] to-[#D71920]' },
  { name: 'English', flag: '🇿🇦', color: 'from-[#007A33] to-[#D71920]' }
];

export function LearningHub({ onStartChallenge }: LearningHubProps) {
  return (
    <div className="h-full bg-gradient-to-br from-black via-[#002395] to-[#007A33] pb-24 overflow-y-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#007A33] to-[#002395] p-6 sticky top-0 z-10 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-2"
        >
          <Sparkles className="w-8 h-8 text-[#FFB612]" />
          <h1 className="text-3xl text-white">Learning Hub</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/80"
        >
          Choose a language to start your challenge
        </motion.p>
      </div>

      {/* Language Cards */}
      <div className="p-6 space-y-4">
        {languages.map((language, index) => (
          <motion.div
            key={language.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`bg-gradient-to-r ${language.color} rounded-2xl p-5 shadow-xl cursor-pointer relative overflow-hidden`}
            onClick={() => onStartChallenge(language.name)}
          >
            {/* Animated background shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2
              }}
            />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-3xl">
                  {language.flag}
                </div>
                <div>
                  <h3 className="text-2xl text-white mb-1">{language.name}</h3>
                  <div className="flex items-center gap-2 text-white/80">
                    <BookOpen className="w-4 h-4" />
                    <span>Unlimited Challenges</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <Timer className="w-4 h-4 text-[#FFB612]" />
                  <span className="text-white text-sm">Timed</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white text-[#002395] px-5 py-2 rounded-full shadow-lg"
                >
                  Play
                </motion.button>
              </div>
            </div>

            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-black/10 rounded-tr-full"></div>
          </motion.div>
        ))}
      </div>

      {/* Fun fact section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-6 mb-6 bg-gradient-to-r from-[#FFB612] to-[#D71920] rounded-2xl p-5 shadow-xl"
      >
        <div className="flex items-start gap-3">
          <Sparkles className="w-6 h-6 text-white flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-white mb-2">Did you know?</h4>
            <p className="text-white/90 text-sm">
              South Africa has 11 official languages, making it one of the most linguistically diverse countries in the world! 🌍
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
