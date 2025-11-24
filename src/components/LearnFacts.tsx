import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Sparkles, Globe, Users, Heart, TrendingUp } from 'lucide-react';

interface LearnFactsProps {
  onBack: () => void;
}

const languageFacts = {
  'isiZulu': [
    {
      icon: Users,
      title: 'Most Spoken',
      fact: 'isiZulu is the most widely spoken home language in South Africa, with about 12 million native speakers.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Heart,
      title: 'Click Language',
      fact: 'Like other Nguni languages, isiZulu contains distinctive click consonants borrowed from Khoisan languages.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Globe,
      title: 'Ubuntu Philosophy',
      fact: 'The famous word "Ubuntu" (humanity towards others) comes from isiZulu and represents core African values.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: Sparkles,
      title: 'Tone Language',
      fact: 'isiZulu is a tonal language where pitch can change the meaning of words completely.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: BookOpen,
      title: 'Rich Literature',
      fact: 'isiZulu has a rich oral tradition and written literature dating back to the 19th century.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'isiXhosa': [
    {
      icon: Users,
      title: 'Nelson Mandela\'s Language',
      fact: 'isiXhosa was the mother tongue of Nelson Mandela and Desmond Tutu, two of SA\'s most famous icons.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Sparkles,
      title: 'Three Click Sounds',
      fact: 'isiXhosa has three types of click sounds: dental, lateral, and palatal clicks.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Globe,
      title: '8 Million Speakers',
      fact: 'Over 8 million South Africans speak isiXhosa as their first language, mainly in the Eastern Cape.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: Heart,
      title: 'Musical Language',
      fact: 'The click sounds in isiXhosa create a distinctive musical quality that\'s unique among world languages.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: TrendingUp,
      title: 'Growing Influence',
      fact: 'isiXhosa is increasingly used in business, education, and media across South Africa.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'Afrikaans': [
    {
      icon: Globe,
      title: 'Youngest Language',
      fact: 'Afrikaans is one of the youngest official languages in the world, evolving from 17th century Dutch.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Users,
      title: '7 Million Speakers',
      fact: 'About 7 million people in SA speak Afrikaans, making it the third most spoken home language.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Sparkles,
      title: 'Simplified Grammar',
      fact: 'Afrikaans has a simpler grammar structure than Dutch, with no verb conjugations and simplified tenses.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: BookOpen,
      title: 'Rich Poetry',
      fact: 'Afrikaans has a vibrant literary tradition, especially in poetry, with many award-winning poets.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: Heart,
      title: 'Cultural Blend',
      fact: 'Afrikaans evolved from interactions between Dutch, Malay, Khoisan, Bantu, and other languages.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'Sesotho': [
    {
      icon: Globe,
      title: 'Mountain Kingdom',
      fact: 'Sesotho is also the national language of Lesotho, the mountain kingdom surrounded by South Africa.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Users,
      title: 'Wide Reach',
      fact: 'Over 5 million people in South Africa speak Sesotho, particularly in the Free State province.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Sparkles,
      title: 'Oral Tradition',
      fact: 'Sesotho has a rich oral tradition of proverbs, riddles, and praise poetry called "lithoko".',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: BookOpen,
      title: 'Written History',
      fact: 'Sesotho was one of the first African languages to be written down, with texts dating to the 1830s.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: Heart,
      title: 'Musical Tones',
      fact: 'Sesotho is a tonal language where high and low tones can completely change word meanings.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'Setswana': [
    {
      icon: Globe,
      title: 'Cross-Border Language',
      fact: 'Setswana is spoken in both South Africa and Botswana, where it\'s the national language.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Users,
      title: 'Historical Importance',
      fact: 'Setswana has been used in South African literature and education for over 150 years.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Sparkles,
      title: 'Proverb Rich',
      fact: 'Setswana culture places great value on proverbs (diane) which are used to teach wisdom.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: Heart,
      title: 'Community Values',
      fact: 'The Setswana greeting "Dumela" literally means "I respect/greet you" showing cultural values.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: TrendingUp,
      title: 'Growing Media',
      fact: 'Setswana is increasingly used in radio, TV, and digital media across Southern Africa.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'Sepedi': [
    {
      icon: Users,
      title: 'Northern Sotho',
      fact: 'Sepedi, also called Northern Sotho, is spoken by over 4.6 million people in Limpopo province.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Sparkles,
      title: 'Kiba Dance',
      fact: 'Sepedi culture is famous for the energetic Kiba dance, often performed at celebrations.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: BookOpen,
      title: 'Literary Tradition',
      fact: 'Sepedi has a strong literary tradition with many published novels, poems, and educational texts.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: Globe,
      title: 'Dialect Diversity',
      fact: 'Sepedi has numerous dialects across Limpopo, each with unique expressions and vocabulary.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: Heart,
      title: 'Respect Culture',
      fact: 'Sepedi culture emphasizes respect for elders, reflected in special honorific language forms.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'Tshivenda': [
    {
      icon: Sparkles,
      title: 'Sacred Lake',
      fact: 'Tshivenda culture revolves around Lake Fundudzi, considered sacred by the Venda people.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Users,
      title: 'Smallest Official',
      fact: 'Tshivenda is spoken by about 1.2 million people, making it one of SA\'s smaller official languages.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Heart,
      title: 'Python Dance',
      fact: 'The famous Domba (Python) dance is a Venda initiation dance where girls dance in a python formation.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: Globe,
      title: 'Musical Heritage',
      fact: 'Tshivenda culture has a rich musical tradition including the distinctive tshikona pipe dance.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: BookOpen,
      title: 'Unique Sounds',
      fact: 'Tshivenda has unique phonetic features not found in other South African languages.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'Xitsonga': [
    {
      icon: Globe,
      title: 'Cross-Border Reach',
      fact: 'Xitsonga is spoken across South Africa, Mozambique, Zimbabwe, and Swaziland.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Sparkles,
      title: 'Ancient Origins',
      fact: 'The Tsonga people have a rich history dating back over 1,000 years in Southern Africa.',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Heart,
      title: 'Xibelani Dance',
      fact: 'The Xibelani dance, where women wear colorful skirts and shake their hips, is world-famous.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: Users,
      title: 'Growing Population',
      fact: 'Over 2.4 million South Africans speak Xitsonga, primarily in Limpopo and Mpumalanga.',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: TrendingUp,
      title: 'Modern Revival',
      fact: 'Xitsonga is experiencing a cultural revival with increased use in music and media.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ],
  'English': [
    {
      icon: Globe,
      title: 'Global Connection',
      fact: 'English connects South Africa to the global community and is widely used in business and education.',
      color: 'from-[#007A33] to-[#FFB612]'
    },
    {
      icon: Sparkles,
      title: 'South African English',
      fact: 'SA English has unique words like "robot" (traffic light), "braai" (barbecue), and "just now" (later).',
      color: 'from-[#D71920] to-[#002395]'
    },
    {
      icon: Users,
      title: 'Fourth Language',
      fact: 'English is the fourth most common home language in SA, but widely spoken as a second language.',
      color: 'from-[#FFB612] to-[#007A33]'
    },
    {
      icon: BookOpen,
      title: 'Literary Giants',
      fact: 'SA has produced world-renowned English writers like JM Coetzee and Nadine Gordimer (both Nobel winners).',
      color: 'from-[#002395] to-[#D71920]'
    },
    {
      icon: Heart,
      title: 'Multicultural Blend',
      fact: 'SA English incorporates words from Afrikaans, Zulu, Xhosa, and other local languages.',
      color: 'from-[#007A33] to-[#002395]'
    }
  ]
};

export function LearnFacts({ onBack }: LearnFactsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const languages = [
    { name: 'isiZulu', color: 'from-[#007A33] to-[#FFB612]' },
    { name: 'isiXhosa', color: 'from-[#D71920] to-[#002395]' },
    { name: 'Sesotho', color: 'from-[#FFB612] to-[#007A33]' },
    { name: 'Setswana', color: 'from-[#002395] to-[#D71920]' },
    { name: 'Sepedi', color: 'from-[#007A33] to-[#002395]' },
    { name: 'Tshivenda', color: 'from-[#FFB612] to-[#D71920]' },
    { name: 'Xitsonga', color: 'from-[#007A33] to-[#FFB612]' },
    { name: 'Afrikaans', color: 'from-[#D71920] to-[#007A33]' },
    { name: 'English', color: 'from-[#002395] to-[#FFB612]' }
  ];

  const currentFacts = selectedLanguage ? languageFacts[selectedLanguage as keyof typeof languageFacts] : [];

  return (
    <div className="h-full min-h-0 bg-gradient-to-br from-[#002395] via-black to-[#007A33] pb-24 flex flex-col">
      <AnimatePresence mode="wait">
        {!selectedLanguage ? (
          <motion.div
            key="language-selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#FFB612] to-[#D71920] p-6 shadow-2xl">
              <button onClick={onBack} className="text-white mb-4">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-3xl text-white">Learn</h1>
                  <p className="text-white/80 text-sm">Discover fascinating language facts</p>
                </div>
              </div>
            </div>

            {/* Language Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang, index) => (
                  <motion.button
                    key={lang.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedLanguage(lang.name);
                      setCurrentFactIndex(0);
                    }}
                    className={`bg-gradient-to-br ${lang.color} rounded-2xl p-6 shadow-xl relative overflow-hidden`}
                  >
                    <motion.div
                      className="absolute -top-10 -right-10 w-24 h-24 bg-white/10 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    />
                    <BookOpen className="w-8 h-8 text-white mb-2" />
                    <p className="text-white text-xl">{lang.name}</p>
                    <p className="text-white/70 text-sm mt-1">5 Fun Facts</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="facts-view"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${currentFacts[currentFactIndex]?.color || 'from-[#FFB612] to-[#D71920]'} p-6 shadow-2xl`}>
              <button 
                onClick={() => setSelectedLanguage(null)} 
                className="text-white mb-4"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl text-white">{selectedLanguage}</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white">
                    {currentFactIndex + 1} / {currentFacts.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Facts Carousel */}
            <div className="flex-1 p-6 flex flex-col overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFactIndex}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex-1 min-h-0 flex flex-col"
                >
                  <motion.div
                    className={`bg-gradient-to-br ${currentFacts[currentFactIndex].color} rounded-3xl p-8 shadow-2xl flex-1 flex flex-col justify-center relative overflow-hidden`}
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 20, 0],
                        y: [0, -20, 0]
                      }}
                      transition={{ duration: 5, repeat: Infinity }}
                    />

                    {/* Icon */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="mb-6"
                    >
                      {(() => {
                        const Icon = currentFacts[currentFactIndex].icon;
                        return <Icon className="w-16 h-16 text-white" />;
                      })()}
                    </motion.div>

                    {/* Title */}
                    <h2 className="text-3xl text-white mb-4">
                      {currentFacts[currentFactIndex].title}
                    </h2>

                    {/* Fact */}
                    <p className="text-xl text-white/90 leading-relaxed">
                      {currentFacts[currentFactIndex].fact}
                    </p>

                    {/* Sparkles animation */}
                    <motion.div
                      className="absolute bottom-4 right-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-8 h-8 text-white/30" />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {currentFacts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFactIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentFactIndex === index
                        ? 'bg-[#FFB612] w-8'
                        : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentFactIndex(Math.max(0, currentFactIndex - 1))}
                  disabled={currentFactIndex === 0}
                  className="flex-1 bg-white/10 backdrop-blur-sm py-4 rounded-2xl text-white disabled:opacity-30"
                >
                  Previous
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentFactIndex(Math.min(currentFacts.length - 1, currentFactIndex + 1))}
                  disabled={currentFactIndex === currentFacts.length - 1}
                  className="flex-1 bg-gradient-to-r from-[#FFB612] to-[#D71920] py-4 rounded-2xl text-white disabled:opacity-30"
                >
                  Next
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
