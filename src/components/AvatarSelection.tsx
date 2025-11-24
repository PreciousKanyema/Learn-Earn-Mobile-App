import { useState } from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { Avatar } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AvatarSelectionProps {
  onSelect: (avatar: Avatar) => void;
}

const avatars: Avatar[] = [
  {
    id: '1',
    name: 'Avatar 1',
    image: 'https://images.unsplash.com/photo-1699524826369-57870e627c43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '2',
    name: 'Avatar 2',
    image: 'https://images.unsplash.com/photo-1762895158802-507fb6d7aa7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '3',
    name: 'Avatar 3',
    image: 'https://images.unsplash.com/photo-1758862493208-2046897d09d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '4',
    name: 'Avatar 4',
    image: 'https://images.unsplash.com/photo-1759663174515-9057d83c8b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '5',
    name: 'Avatar 5',
    image: 'https://images.unsplash.com/photo-1638012107344-3ed0f994d8d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '6',
    name: 'Avatar 6',
    image: 'https://images.unsplash.com/photo-1585826728922-fe44c53a2f59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '7',
    name: 'Avatar 7',
    image: 'https://images.unsplash.com/photo-1759663174086-941229ec510f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  },
  {
    id: '8',
    name: 'Avatar 8',
    image: 'https://images.unsplash.com/photo-1763220351708-2a9256c91536?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
  }
];

export function AvatarSelection({ onSelect }: AvatarSelectionProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (avatar: Avatar) => {
    setSelected(avatar.id);
  };

  const handleContinue = () => {
    const avatar = avatars.find(a => a.id === selected);
    if (avatar) {
      onSelect(avatar);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#002395] via-[#007A33] to-[#D71920] p-6 flex flex-col overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 mt-8"
      >
        <h1 className="text-5xl text-white mb-3">Choose Your Avatar</h1>
        <p className="text-xl text-[#FFB612]">Pick your learning companion!</p>
      </motion.div>

      {/* Avatar Grid */}
      <div className="grid grid-cols-2 gap-4 flex-1 mb-6">
        {avatars.map((avatar, index) => (
          <motion.div
            key={avatar.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(avatar)}
            className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all ${
              selected === avatar.id
                ? 'ring-4 ring-[#FFB612] shadow-2xl'
                : 'ring-2 ring-white/20 hover:ring-white/40'
            }`}
          >
            <div className="aspect-square bg-white/20">
              <ImageWithFallback
                src={avatar.image}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {selected === avatar.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-10 h-10 bg-[#FFB612] rounded-full flex items-center justify-center shadow-lg"
              >
                <Check className="w-6 h-6 text-white" />
              </motion.div>
            )}

            {/* Decorative corner */}
            {selected === avatar.id && (
              <>
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute top-2 left-2 w-8 h-8 border-4 border-[#FFB612] border-t-white border-l-white rounded-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFB612]/30 to-transparent pointer-events-none" />
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: selected ? 1 : 0.5, y: 0 }}
        whileHover={selected ? { scale: 1.05 } : {}}
        whileTap={selected ? { scale: 0.95 } : {}}
        disabled={!selected}
        onClick={handleContinue}
        className={`w-full py-5 rounded-2xl text-white text-2xl shadow-xl mb-8 transition-all ${
          selected
            ? 'bg-gradient-to-r from-[#FFB612] to-[#D71920]'
            : 'bg-gray-600 cursor-not-allowed'
        }`}
      >
        Continue
      </motion.button>
    </div>
  );
}