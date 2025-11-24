import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Crown, TrendingUp, Zap } from 'lucide-react';
import { Avatar } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LeaderboardProps {
  userAddress: string;
  userChallengesCompleted: number;
  userAvatar: Avatar | null;
}

interface LeaderboardEntry {
  rank: number;
  address: string;
  avatar: string;
  challengesCompleted: number;
  tokensEarned: number;
  isUser: boolean;
}

const LEADERBOARD_KEY = 'learnandearn_leaderboard';

export function Leaderboard({ userAddress, userChallengesCompleted, userAvatar }: LeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'language' | 'aiBattle'>('global');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const loadLeaderboard = () => {
      const stored = localStorage.getItem(LEADERBOARD_KEY);
      const users = stored ? JSON.parse(stored) : [];
      
      // Sort by tokens earned (descending)
      const sorted = users.sort((a: any, b: any) => b.tokensEarned - a.tokensEarned);
      
      // Map to leaderboard entries with ranks
      const entries: LeaderboardEntry[] = sorted.map((user: any, index: number) => ({
        rank: index + 1,
        address: user.address,
        avatar: user.avatar,
        challengesCompleted: user.challengesCompleted,
        tokensEarned: user.tokensEarned,
        isUser: user.address === userAddress
      }));
      
      setLeaderboardData(entries);
    };

    loadLeaderboard();
    
    // Update leaderboard periodically
    const interval = setInterval(loadLeaderboard, 3000);
    return () => clearInterval(interval);
  }, [userAddress]);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-[#FFB612] to-[#D71920]';
    if (rank === 2) return 'from-gray-400 to-gray-600';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-[#002395] to-[#007A33]';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-6 h-6 text-[#FFB612]" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-orange-400" />;
    return <span className="text-white">{rank}</span>;
  };

  const userRank = leaderboardData.find(e => e.isUser)?.rank || '-';

  return (
    <div className="h-full bg-gradient-to-br from-[#002395] via-black to-[#007A33] pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D71920] to-[#FFB612] p-6 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-4"
        >
          <Trophy className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-3xl text-white">Leaderboard</h1>
            <p className="text-white/80 text-sm">Top Learners - Real-Time Ranking</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['global', 'language', 'aiBattle'] as const).map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-xl transition-all text-sm ${
                activeTab === tab
                  ? 'bg-white text-[#002395]'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tab === 'global' ? 'Global' : tab === 'language' ? 'Language' : 'AI Battles'}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-white/5 backdrop-blur-sm"
      >
        <div className="flex gap-3">
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#FFB612]" />
              <span className="text-white/70 text-xs">Active Players</span>
            </div>
            <p className="text-white text-xl">{leaderboardData.length}</p>
          </div>
          <div className="flex-1 bg-white/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-[#FFB612]" />
              <span className="text-white/70 text-xs">Your Rank</span>
            </div>
            <p className="text-white text-xl">#{userRank}</p>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="flex-1 overflow-y-auto p-4">
        {leaderboardData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Trophy className="w-20 h-20 text-white/30 mb-4" />
            <p className="text-white/50 text-center">No players yet</p>
            <p className="text-white/30 text-sm text-center mt-2">Be the first to complete challenges!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <motion.div
                key={entry.address + index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`rounded-2xl p-4 ${
                  entry.isUser
                    ? 'bg-gradient-to-r from-[#FFB612] to-[#D71920] ring-4 ring-white/50'
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/15'
                } transition-all`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRankColor(entry.rank)} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-white/20">
                    <ImageWithFallback
                      src={entry.avatar}
                      alt={`Avatar ${entry.rank}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white truncate font-mono text-sm">
                        {entry.address}
                      </p>
                      {entry.isUser && (
                        <span className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full text-white text-xs flex-shrink-0">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Trophy className="w-3 h-3 text-[#FFB612]" />
                      <span className="text-white/70 text-sm">
                        {entry.challengesCompleted} challenges
                      </span>
                    </div>
                  </div>

                  {/* Tokens */}
                  <div className="text-right">
                    <p className="text-white text-xl">{entry.tokensEarned}</p>
                    <p className="text-white/70 text-xs">XP</p>
                  </div>
                </div>

                {/* Top 3 Special Effects */}
                {entry.rank <= 3 && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 182, 18, 0.3)',
                        '0 0 30px rgba(255, 182, 18, 0.5)',
                        '0 0 20px rgba(255, 182, 18, 0.3)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Live indicator */}
        {leaderboardData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center justify-center gap-2 text-white/50"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-[#FFB612]"
            />
            <span className="text-sm">Live Rankings</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
