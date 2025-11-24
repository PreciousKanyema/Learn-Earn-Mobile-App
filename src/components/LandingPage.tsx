import { motion } from 'motion/react';
import { Sparkles, Zap, Trophy } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="h-full relative overflow-hidden bg-gradient-to-br from-[#007A33] via-[#002395] to-[#D71920] flex flex-col items-center justify-center p-8">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#FFB612] opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[#007A33] opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.5, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Icons */}
      <motion.div
        className="absolute top-32 right-16"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Sparkles className="w-8 h-8 text-[#FFB612]" />
      </motion.div>

      <motion.div
        className="absolute bottom-40 left-12"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Zap className="w-10 h-10 text-[#FFB612]" />
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-8"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Trophy className="w-6 h-6 text-[#FFB612]" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          duration: 1
        }}
        className="relative z-10"
      >
        <div className="relative mb-6">
          <motion.div
            className="absolute inset-0 bg-[#FFB612] rounded-full blur-2xl opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <h1 className="relative text-7xl font-black text-white text-center drop-shadow-2xl">
            Learn<span className="text-[#FFB612]">&</span>Earn
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="relative z-10 mb-12"
      >
        <p className="text-3xl text-white text-center drop-shadow-lg">
          Play. Learn. Earn.
        </p>
      </motion.div>

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex gap-4 mb-16"
      >
        <div className="w-3 h-3 rounded-full bg-[#007A33]"></div>
        <div className="w-3 h-3 rounded-full bg-[#FFB612]"></div>
        <div className="w-3 h-3 rounded-full bg-[#D71920]"></div>
        <div className="w-3 h-3 rounded-full bg-[#002395]"></div>
      </motion.div>

      {/* Start Button */}
      <motion.button
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="relative z-10 px-12 py-5 bg-gradient-to-r from-[#FFB612] to-[#D71920] rounded-full text-white text-2xl shadow-2xl"
      >
        <motion.div
          className="absolute inset-0 bg-white rounded-full opacity-0"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <span className="relative z-10 drop-shadow-lg">Start Journey</span>
      </motion.button>

      {/* Bottom Accent */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "80%" }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 h-1 bg-gradient-to-r from-transparent via-[#FFB612] to-transparent"
      />
    </div>
  );
}
