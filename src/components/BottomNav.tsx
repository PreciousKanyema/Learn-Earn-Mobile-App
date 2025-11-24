import { motion } from 'motion/react';
import { Home, BookOpen, Swords, Trophy, Wallet } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'learn' as Screen, icon: BookOpen, label: 'Learn' },
    { id: 'aiBattle' as Screen, icon: Swords, label: 'Battle' },
    { id: 'leaderboard' as Screen, icon: Trophy, label: 'Rank' },
    { id: 'wallet' as Screen, icon: Wallet, label: 'Wallet' },
  ];

  const getActiveColor = (screen: Screen) => {
    const isActive = currentScreen === screen;
    if (isActive) {
      return 'text-[#FFB612]';
    }
    return 'text-white/50';
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-gradient-to-t from-black via-[#002395] to-transparent backdrop-blur-xl border-t border-white/10">
      <div className="flex items-center justify-around p-4">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 relative"
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#FFB612] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}

              {/* Icon with glow effect */}
              <motion.div
                animate={{
                  scale: isActive ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-[#FFB612] rounded-full blur-lg opacity-50"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.3, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
                <Icon className={`w-6 h-6 relative z-10 ${getActiveColor(item.id)}`} />
              </motion.div>

              {/* Label */}
              <span className={`text-xs ${getActiveColor(item.id)} transition-colors`}>
                {item.label}
              </span>

              {/* Special effect for active item */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 border-2 border-[#FFB612] rounded-full opacity-50"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}