import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, X, Loader2, AlertCircle } from 'lucide-react';

interface MetaMaskConnectProps {
  onConnect: (address: string) => void;
  onCancel: () => void;
}

export function MetaMaskConnect({ onConnect, onCancel }: MetaMaskConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        
        if (accounts.length > 0) {
          const fullAddress = accounts[0];
          // Pass full address to the app (UI can shorten when displaying)
          onConnect(fullAddress);
        }
      } else {
        setError('MetaMask is not installed. Please install MetaMask extension.');
        setIsConnecting(false);
      }
      } catch (err: any) {
      console.error('Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#002395] via-black to-[#007A33] flex items-center justify-center p-6">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl relative"
        >
          {/* Close Button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* MetaMask Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-[#FFB612] to-[#D71920] rounded-3xl flex items-center justify-center shadow-2xl">
              <Wallet className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl text-white text-center mb-3"
          >
            Connect Your Wallet
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-center mb-8"
          >
            Connect your MetaMask wallet to start playing and earning tokens!
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3 mb-8"
          >
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <div className="w-2 h-2 rounded-full bg-[#007A33]"></div>
              <p className="text-white/90">Earn tokens for each challenge</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <div className="w-2 h-2 rounded-full bg-[#FFB612]"></div>
              <p className="text-white/90">Track your progress securely</p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-xl p-3">
              <div className="w-2 h-2 rounded-full bg-[#D71920]"></div>
              <p className="text-white/90">Compete on the leaderboard</p>
            </div>
          </motion.div>

          {/* Connect Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: isConnecting ? 1 : 1.05 }}
            whileTap={{ scale: isConnecting ? 1 : 0.95 }}
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full py-4 bg-gradient-to-r from-[#FFB612] to-[#D71920] rounded-2xl text-white text-xl shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Wallet className="w-6 h-6" />
                <span>Connect MetaMask</span>
              </>
            )}
          </motion.button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-[#D71920]/20 border border-[#D71920]/50 rounded-xl flex items-start gap-2"
            >
              <AlertCircle className="w-5 h-5 text-[#D71920] flex-shrink-0 mt-0.5" />
              <p className="text-white/90 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Cancel Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            onClick={onCancel}
            className="w-full py-3 mt-3 text-white/70 hover:text-white transition-colors"
          >
            Go Back
          </motion.button>

          {/* Loading Animation */}
          {isConnecting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-3xl flex items-center justify-center"
            >
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                  className="w-3 h-3 rounded-full bg-[#FFB612]"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                  className="w-3 h-3 rounded-full bg-[#007A33]"
                />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                  className="w-3 h-3 rounded-full bg-[#D71920]"
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}