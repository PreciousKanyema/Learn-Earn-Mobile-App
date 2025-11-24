import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AvatarSelection } from './components/AvatarSelection';
import { MetaMaskConnect } from './components/MetaMaskConnect';
import { LearningHub } from './components/LearningHub';
import { LearnFacts } from './components/LearnFacts';
import { ChallengeScreen } from './components/ChallengeScreen';
import { AIBattleMode } from './components/AIBattleMode';
import { Leaderboard } from './components/Leaderboard';
import { WalletPage } from './components/WalletPage';
import { BottomNav } from './components/BottomNav';

export type Screen = 
  | 'landing' 
  | 'avatar' 
  | 'metamask' 
  | 'home' 
  | 'learn'
  | 'challenge' 
  | 'aiBattle' 
  | 'leaderboard' 
  | 'wallet';

export interface Avatar {
  id: string;
  name: string;
  image: string;
}

export interface Challenge {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  language: string;
}

export interface CompletedChallenge {
  id: string;
  language: string;
  timestamp: number;
  tokensEarned: number;
  correct: boolean;
}

export interface Transaction {
  id: string;
  type: 'challenge' | 'aiBattle' | 'withdraw' | 'send' | 'deposit';
  amount: number;
  timestamp: number;
  status: 'completed';
  details: string;
}

export interface LeaderboardUser {
  address: string;
  avatar: string;
  challengesCompleted: number;
  tokensEarned: number;
}

// Global leaderboard stored in localStorage
const LEADERBOARD_KEY = 'learnandearn_leaderboard';

function getLeaderboard(): LeaderboardUser[] {
  const stored = localStorage.getItem(LEADERBOARD_KEY);
  return stored ? JSON.parse(stored) : [];
}

function updateLeaderboard(address: string, avatar: string, challengesCompleted: number, tokensEarned: number) {
  const leaderboard = getLeaderboard();
  const existingIndex = leaderboard.findIndex(u => u.address === address);
  
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = {
      address,
      avatar,
      challengesCompleted,
      tokensEarned
    };
  } else {
    leaderboard.push({
      address,
      avatar,
      challengesCompleted,
      tokensEarned
    });
  }
  
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [totalTokens, setTotalTokens] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<CompletedChallenge[]>([]);
  const [aiBattlesWon, setAiBattlesWon] = useState(0);
  const [aiBattlesLost, setAiBattlesLost] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Update leaderboard whenever tokens or challenges change
  useEffect(() => {
    if (walletAddress && selectedAvatar) {
      updateLeaderboard(
        walletAddress, 
        selectedAvatar.image, 
        completedChallenges.length,
        totalTokens
      );
    }
  }, [walletAddress, selectedAvatar, completedChallenges.length, totalTokens]);

  const handleAvatarSelect = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
    setScreen('metamask');
  };

  const handleWalletConnect = (address: string) => {
    setWalletConnected(true);
    setWalletAddress(address);
    setScreen('home');
  };

  const handleStartChallenge = (language: string) => {
    setSelectedLanguage(language);
    setScreen('challenge');
  };

  const handleChallengeComplete = (correct: boolean, tokensEarned: number, language: string) => {
    const newChallenge: CompletedChallenge = {
      id: Math.random().toString(36).substr(2, 9),
      language,
      timestamp: Date.now(),
      tokensEarned,
      correct
    };
    setCompletedChallenges(prev => [...prev, newChallenge]);
    setTotalTokens(prev => prev + tokensEarned);
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'challenge',
      amount: tokensEarned,
      timestamp: Date.now(),
      status: 'completed',
      details: `Completed ${language} challenge ${correct ? '(correct)' : '(incorrect)'}`
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleAIBattleComplete = (won: boolean, tokensEarned: number) => {
    if (won) {
      setAiBattlesWon(prev => prev + 1);
    } else {
      setAiBattlesLost(prev => prev + 1);
    }
    setTotalTokens(prev => prev + tokensEarned);
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'aiBattle',
      amount: tokensEarned,
      timestamp: Date.now(),
      status: 'completed',
      details: `AI Battle ${won ? 'win' : 'loss'}`
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleDeposit = (amount: number) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'deposit',
      amount,
      timestamp: Date.now(),
      status: 'completed',
      details: 'Deposited from MetaMask'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setTotalTokens(prev => prev + amount);
  };

  const handleSend = (amount: number, toAddress?: string) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'send',
      amount,
      timestamp: Date.now(),
      status: 'completed',
      details: `Sent to ${toAddress || 'external address'}`
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setTotalTokens(prev => prev - amount);
  };

  const handleWithdraw = (amount: number) => {
    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'withdraw',
      amount,
      timestamp: Date.now(),
      status: 'completed',
      details: 'Withdrawn to MetaMask'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setTotalTokens(prev => Math.max(0, prev - amount));
  };

  const handleNavigation = (newScreen: Screen) => {
    setScreen(newScreen);
  };

  const showBottomNav = ['home', 'learn', 'challenge', 'aiBattle', 'leaderboard', 'wallet'].includes(screen);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-[430px] h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-y-auto">
        {screen === 'landing' && (
          <LandingPage onStart={() => setScreen('avatar')} />
        )}
        
        {screen === 'avatar' && (
          <AvatarSelection onSelect={handleAvatarSelect} />
        )}
        
        {screen === 'metamask' && (
          <MetaMaskConnect 
            onConnect={handleWalletConnect}
            onCancel={() => setScreen('avatar')}
          />
        )}
        
        {screen === 'home' && (
          <LearningHub onStartChallenge={handleStartChallenge} />
        )}
        
        {screen === 'learn' && (
          <LearnFacts onBack={() => setScreen('home')} />
        )}
        
        {screen === 'challenge' && (
          <ChallengeScreen 
            language={selectedLanguage}
            onComplete={handleChallengeComplete}
            onBack={() => setScreen('home')}
          />
        )}
        
        {screen === 'aiBattle' && (
          <AIBattleMode 
            avatar={selectedAvatar}
            onComplete={handleAIBattleComplete}
            onBack={() => setScreen('home')}
          />
        )}
        
        {screen === 'leaderboard' && (
          <Leaderboard 
            userAddress={walletAddress}
            userChallengesCompleted={completedChallenges.length}
            userAvatar={selectedAvatar}
          />
        )}
        
        {screen === 'wallet' && (
          <WalletPage 
            walletAddress={walletAddress}
            totalTokens={totalTokens}
            completedChallenges={completedChallenges}
            aiBattlesWon={aiBattlesWon}
            aiBattlesLost={aiBattlesLost}
            transactions={transactions}
            onDeposit={handleDeposit}
            onSend={handleSend}
            onWithdraw={handleWithdraw}
          />
        )}
        
        {showBottomNav && (
          <BottomNav 
            currentScreen={screen} 
            onNavigate={handleNavigation}
          />
        )}
      </div>
    </div>
  );
}