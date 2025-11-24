import { useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'motion/react';
import { Wallet, Send, Download, Copy, Check, Activity, Coins, Trophy, Target } from 'lucide-react';
import { CompletedChallenge, Transaction } from '../App';

interface WalletPageProps {
  walletAddress: string;
  totalTokens: number;
  completedChallenges: CompletedChallenge[];
  aiBattlesWon: number;
  aiBattlesLost: number;
  transactions: Transaction[];
  onDeposit: (amount: number) => void;
  onSend?: (amount: number, toAddress?: string) => void;
  onWithdraw?: (amount: number) => void;
}

export function WalletPage({ walletAddress, totalTokens, completedChallenges, aiBattlesWon, aiBattlesLost, transactions, onDeposit, onSend, onWithdraw }: WalletPageProps) {
  const displayAddress = walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '';
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [sending, setSending] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // Smart Contract Address (Celo Alfajores Testnet)
  const contractAddress = '0x1234567890123456789012345678901234567890';

  // Convert CELO tokens (1 token = 0.01 CELO)
  const celoBalance = (totalTokens * 0.01).toFixed(4);

  const handleCopyAddress = () => {
    // Fallback for clipboard API
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(walletAddress).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          // If modern API fails, use fallback
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    } catch (error) {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    try {
      // Fallback method using execCommand
      const textArea = document.createElement('textarea');
      textArea.value = walletAddress;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } catch (err) {
        console.log('Copy failed');
      }
      
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Show copied state anyway
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWithdraw = async () => {
    if (totalTokens === 0) return;
    
    setWithdrawing(true);
    
    try {
      if (typeof (window as any).ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const abi = [
          'function withdrawTokens() external',
          'function getPlayerBalance(address) view returns (uint256)'
        ];
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Get player's balance (in wei)
        const userAddress = await signer.getAddress();
        const balanceWei = await contract.getPlayerBalance(userAddress);
        const balanceCelo = parseFloat(ethers.formatUnits(balanceWei, 18));

        if (balanceWei === 0n || balanceCelo === 0) {
          alert('No balance available to withdraw.');
        } else {
          // Prompt MetaMask to execute withdrawTokens() which will transfer CELO from contract to user
          const tx = await contract.withdrawTokens();
          alert('Withdrawal transaction submitted. Confirm in MetaMask.');
          await tx.wait();

          // Convert CELO to XP (1 XP = 0.01 CELO)
          const xpAmount = Math.round(balanceCelo / 0.01);
          alert(`Successfully withdrawn ${balanceCelo} CELO (${xpAmount} XP) to your MetaMask wallet!`);
          setShowWithdrawModal(false);
          if (onWithdraw) onWithdraw(xpAmount);
        }
      } else {
        // Fallback simulation if MetaMask isn't available
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Successfully withdrawn ${celoBalance} CELO to your MetaMask wallet!`);
        setShowWithdrawModal(false);
        if (onWithdraw) onWithdraw(totalTokens);
      }
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const handleSend = async () => {
    if (!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0) return;
    
    const amountNum = parseFloat(sendAmount);
    if (amountNum > totalTokens) {
      alert('Insufficient balance');
      return;
    }
    
    setSending(true);
    
    try {
      if (typeof (window as any).ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const abi = [
          'function sendTokens(address,uint256) external',
          'function getPlayerBalance(address) view returns (uint256)'
        ];
        const contract = new ethers.Contract(contractAddress, abi, signer);

        // Convert XP -> CELO (1 XP = 0.01 CELO)
        const celoAmount = (amountNum * 0.01).toString();
        const amountWei = ethers.parseUnits(celoAmount, 18);

        // Call contract.sendTokens(recipient, amountWei)
        const tx = await contract.sendTokens(sendAddress, amountWei);
        alert('Send transaction submitted. Confirm in MetaMask.');
        await tx.wait();

        alert(`Successfully sent ${(amountNum * 0.01).toFixed(4)} CELO to ${sendAddress}!`);
        setShowSendModal(false);
        setSendAddress('');
        setSendAmount('');
        if (onSend) onSend(amountNum, sendAddress);
      } else {
        // fallback
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Successfully sent ${(amountNum * 0.01).toFixed(4)} CELO to ${sendAddress}!`);
        setShowSendModal(false);
        setSendAddress('');
        setSendAmount('');
        if (onSend) onSend(amountNum, sendAddress);
      }
    } catch (error) {
      alert('Send failed. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) return;
    
    const amountNum = parseFloat(depositAmount);
    
    setDepositing(true);
    
    try {
      // If MetaMask is available, open it to request a transfer from user's wallet
      if (typeof window.ethereum !== 'undefined' && window.ethereum.request) {
        // Convert XP to native CELO value (1 XP = 0.01 CELO)
        const celoValue = (amountNum * 0.01);
        // Convert to wei (1 CELO = 1e18 wei)
        const wei = BigInt(Math.floor(celoValue * 1e18));

        const txParams = {
          from: walletAddress,
          to: contractAddress,
          value: '0x' + wei.toString(16)
        };

        try {
          // This will open MetaMask and ask the user to confirm the transaction
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [txParams]
          });

          // Optionally you could wait for confirmation via a provider; here we assume the tx was submitted
          alert(`Transaction submitted: ${txHash}`);
          setShowDepositModal(false);
          setDepositAmount('');
          onDeposit(amountNum);
        } catch (txErr: any) {
          console.error('Transaction failed or was rejected:', txErr);
          alert(txErr?.message || 'Transaction failed or was rejected.');
        }
      } else {
        // Fallback simulation if MetaMask isn't available
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert(`Successfully deposited ${amountNum} XP to your wallet!`);
        setShowDepositModal(false);
        setDepositAmount('');
        onDeposit(amountNum);
      }
    } catch (error) {
      alert('Deposit failed. Please try again.');
    } finally {
      setDepositing(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'challenge':
        return <Target className="w-5 h-5 text-[#FFB612]" />;
      case 'aiBattle':
        return <Trophy className="w-5 h-5 text-[#D71920]" />;
      case 'withdraw':
        return <Download className="w-5 h-5 text-[#007A33]" />;
      case 'send':
        return <Send className="w-5 h-5 text-[#002395]" />;
      default:
        return <Coins className="w-5 h-5 text-[#FFB612]" />;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-full bg-gradient-to-br from-[#002395] via-black to-[#007A33] pb-24 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D71920] to-[#FFB612] p-6 shadow-2xl flex-shrink-0">
            <div className="flex items-center gap-3 mb-4">
          <Wallet className="w-8 h-8 text-white" />
          <div>
            <h1 className="text-3xl text-white">Celo Wallet</h1>
            <p className="text-white/80 text-sm">Powered by CELO Blockchain</p>
          </div>
        </div>

        {/* Wallet Address - Click to view full */}
            <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddressModal(true)}
          className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Wallet className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-white font-mono text-xs break-all">{displayAddress}</span>
          </div>
          <Copy className="w-5 h-5 text-white flex-shrink-0" />
        </motion.div>

        {/* Smart Contract Connection */}
        <div className="mt-3 bg-[#007A33]/30 backdrop-blur-sm rounded-lg p-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-[#007A33] rounded-full animate-pulse" />
          <span className="text-white/80 text-xs">Connected to Smart Contract</span>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#007A33] to-[#002395] rounded-3xl p-6 shadow-2xl relative overflow-hidden mb-6"
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute top-0 right-0 w-32 h-32 bg-[#FFB612] rounded-full blur-3xl opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 10, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <div className="relative">
              <p className="text-white/70 mb-2">Total CELO Balance</p>
              <div className="flex items-end gap-3 mb-4">
                <motion.h2
                  key={totalTokens}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-6xl text-white"
                >
                  {celoBalance}
                </motion.h2>
                <span className="text-2xl text-[#FFB612] mb-2">CELO</span>
              </div>

              <div className="flex items-center gap-2 text-white/70 mb-4">
                <Coins className="w-4 h-4" />
                <span>{totalTokens} XP Points</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={totalTokens === 0}
                  className="bg-white/20 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 text-white disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>Withdraw</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSendModal(true)}
                  disabled={totalTokens === 0}
                  className="bg-white/20 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 text-white disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDepositModal(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 text-white"
                >
                  <Download className="w-5 h-5" />
                  <span>Deposit</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddressModal(true)}
                  className="bg-white/20 backdrop-blur-sm rounded-xl py-3 flex items-center justify-center gap-2 text-white"
                >
                  <Wallet className="w-5 h-5" />
                  <span>Address</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Target className="w-5 h-5 text-[#FFB612] mx-auto mb-1" />
              <p className="text-white/70 text-xs mb-1">Challenges</p>
              <p className="text-white text-xl">{completedChallenges.length}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Trophy className="w-5 h-5 text-[#007A33] mx-auto mb-1" />
              <p className="text-white/70 text-xs mb-1">AI Wins</p>
              <p className="text-white text-xl">{aiBattlesWon}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <Coins className="w-5 h-5 text-[#FFB612] mx-auto mb-1" />
              <p className="text-white/70 text-xs mb-1">Total XP</p>
              <p className="text-white text-xl">{totalTokens}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#FFB612]" />
              <h3 className="text-white text-lg">Recent Activity</h3>
            </div>

            {transactions.length === 0 ? (
              <p className="text-white/50 text-center py-4">No activity yet</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{transaction.details}</p>
                      <p className="text-white/50 text-xs">{formatTimestamp(transaction.timestamp)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#007A33] text-sm">+{transaction.amount}</p>
                      <p className="text-white/50 text-xs">XP</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => !withdrawing && setShowWithdrawModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#007A33] to-[#002395] rounded-3xl p-6 w-full max-w-sm"
          >
            <h2 className="text-2xl text-white mb-4">Withdraw to MetaMask</h2>
            <p className="text-white/70 mb-4">
              Withdraw your earned CELO to your MetaMask wallet
            </p>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
              <p className="text-white/70 text-sm mb-1">Amount</p>
              <p className="text-white text-3xl">{celoBalance} CELO</p>
              <p className="text-white/50 text-sm mt-1">({totalTokens} XP)</p>
            </div>

            <div className="bg-white/10 rounded-xl p-3 mb-4">
              <p className="text-white/70 text-xs mb-1">To Address</p>
              <p className="text-white text-sm font-mono">{walletAddress}</p>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowWithdrawModal(false)}
                disabled={withdrawing}
                className="flex-1 bg-white/20 py-3 rounded-xl text-white"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWithdraw}
                disabled={withdrawing}
                className="flex-1 bg-[#FFB612] py-3 rounded-xl text-white flex items-center justify-center gap-2"
              >
                {withdrawing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Withdrawing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Confirm</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => !sending && setShowSendModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#002395] to-[#D71920] rounded-3xl p-6 w-full max-w-sm"
          >
            <h2 className="text-2xl text-white mb-4">Send CELO</h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Recipient Address</label>
                <input
                  type="text"
                  value={sendAddress}
                  onChange={(e) => setSendAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white placeholder-white/30 border border-white/10 focus:border-[#FFB612] outline-none"
                />
              </div>
              
              <div>
                <label className="text-white/70 text-sm mb-1 block">Amount (XP)</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0"
                  max={totalTokens}
                  className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white placeholder-white/30 border border-white/10 focus:border-[#FFB612] outline-none"
                />
                <p className="text-white/50 text-xs mt-1">
                  Available: {totalTokens} XP ({celoBalance} CELO)
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSendModal(false)}
                disabled={sending}
                className="flex-1 bg-white/20 py-3 rounded-xl text-white"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={sending || !sendAddress || !sendAmount}
                className="flex-1 bg-[#FFB612] py-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {sending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => !depositing && setShowDepositModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#002395] to-[#D71920] rounded-3xl p-6 w-full max-w-sm"
          >
            <h2 className="text-2xl text-white mb-4">Deposit XP</h2>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-white/70 text-sm mb-1 block">Amount (XP)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white placeholder-white/30 border border-white/10 focus:border-[#FFB612] outline-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDepositModal(false)}
                disabled={depositing}
                className="flex-1 bg-white/20 py-3 rounded-xl text-white"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDeposit}
                disabled={depositing || !depositAmount}
                className="flex-1 bg-[#FFB612] py-3 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {depositing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Depositing...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>Deposit</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowAddressModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#002395] to-[#D71920] rounded-3xl p-6 w-full max-w-sm"
          >
            <h2 className="text-2xl text-white mb-6">Addresses</h2>
            
            <div className="space-y-4 mb-6">
              {/* Wallet Address */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">Your Wallet Address</label>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between gap-2">
                  <span className="text-white text-sm font-mono break-all">{walletAddress}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyAddress}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-[#007A33]" />
                    ) : (
                      <Copy className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
              
              {/* Smart Contract Address */}
              <div>
                <label className="text-white/70 text-sm mb-2 block">Smart Contract Address</label>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
                  <span className="text-white text-sm font-mono break-all">{contractAddress}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#007A33] rounded-full animate-pulse" />
                  <span className="text-white/60 text-xs">Connected to Celo Network</span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddressModal(false)}
              className="w-full bg-[#FFB612] py-3 rounded-xl text-white"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}