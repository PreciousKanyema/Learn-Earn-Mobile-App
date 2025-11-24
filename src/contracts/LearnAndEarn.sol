// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title LearnAndEarn
 * @dev Educational gaming platform on Celo blockchain
 * @notice This contract manages rewards for completing language learning challenges
 */
contract LearnAndEarn {
    // Token reward in CELO (in wei)
    uint256 public constant CHALLENGE_REWARD = 0.01 ether; // 0.01 CELO per challenge
    uint256 public constant AI_BATTLE_WIN_REWARD = 0.05 ether; // 0.05 CELO for AI battle win
    uint256 public constant AI_BATTLE_LOSS_REWARD = 0.01 ether; // 0.01 CELO for AI battle participation
    
    address public owner;
    
    struct Player {
        address playerAddress;
        uint256 totalChallengesCompleted;
        uint256 totalTokensEarned;
        uint256 aiBattlesWon;
        uint256 aiBattlesLost;
        bool isRegistered;
    }
    
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        string transactionType; // "reward", "withdraw", "send"
        uint256 timestamp;
    }
    
    mapping(address => Player) public players;
    mapping(address => Transaction[]) public playerTransactions;
    mapping(address => uint256) public playerBalances;
    
    address[] public registeredPlayers;
    
    event PlayerRegistered(address indexed player, uint256 timestamp);
    event ChallengeCompleted(address indexed player, string language, uint256 reward, uint256 timestamp);
    event AIBattleCompleted(address indexed player, bool won, uint256 reward, uint256 timestamp);
    event TokensWithdrawn(address indexed player, uint256 amount, uint256 timestamp);
    event TokensSent(address indexed from, address indexed to, uint256 amount, uint256 timestamp);
    event FundsDeposited(address indexed depositor, uint256 amount, uint256 timestamp);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Player not registered");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev Register a new player
     */
    function registerPlayer() external {
        require(!players[msg.sender].isRegistered, "Player already registered");
        
        players[msg.sender] = Player({
            playerAddress: msg.sender,
            totalChallengesCompleted: 0,
            totalTokensEarned: 0,
            aiBattlesWon: 0,
            aiBattlesLost: 0,
            isRegistered: true
        });
        
        registeredPlayers.push(msg.sender);
        
        emit PlayerRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Record a completed challenge and reward the player
     * @param language The language of the challenge
     */
    function completeChallengeReward(string memory language) external onlyRegistered {
        require(address(this).balance >= CHALLENGE_REWARD, "Insufficient contract balance");
        
        players[msg.sender].totalChallengesCompleted++;
        players[msg.sender].totalTokensEarned += CHALLENGE_REWARD;
        playerBalances[msg.sender] += CHALLENGE_REWARD;
        
        // Record transaction
        playerTransactions[msg.sender].push(Transaction({
            from: address(this),
            to: msg.sender,
            amount: CHALLENGE_REWARD,
            transactionType: "reward",
            timestamp: block.timestamp
        }));
        
        emit ChallengeCompleted(msg.sender, language, CHALLENGE_REWARD, block.timestamp);
    }
    
    /**
     * @dev Record AI battle result and reward the player
     * @param won Whether the player won the battle
     */
    function completeAIBattle(bool won) external onlyRegistered {
        uint256 reward = won ? AI_BATTLE_WIN_REWARD : AI_BATTLE_LOSS_REWARD;
        require(address(this).balance >= reward, "Insufficient contract balance");
        
        if (won) {
            players[msg.sender].aiBattlesWon++;
        } else {
            players[msg.sender].aiBattlesLost++;
        }
        
        players[msg.sender].totalTokensEarned += reward;
        playerBalances[msg.sender] += reward;
        
        // Record transaction
        playerTransactions[msg.sender].push(Transaction({
            from: address(this),
            to: msg.sender,
            amount: reward,
            transactionType: "reward",
            timestamp: block.timestamp
        }));
        
        emit AIBattleCompleted(msg.sender, won, reward, block.timestamp);
    }
    
    /**
     * @dev Withdraw earned CELO to player's wallet
     */
    function withdrawTokens() external onlyRegistered {
        uint256 balance = playerBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        require(address(this).balance >= balance, "Insufficient contract balance");
        
        playerBalances[msg.sender] = 0;
        
        // Record transaction
        playerTransactions[msg.sender].push(Transaction({
            from: address(this),
            to: msg.sender,
            amount: balance,
            transactionType: "withdraw",
            timestamp: block.timestamp
        }));
        
        payable(msg.sender).transfer(balance);
        
        emit TokensWithdrawn(msg.sender, balance, block.timestamp);
    }
    
    /**
     * @dev Send CELO from player balance to another address
     * @param recipient The address to send CELO to
     * @param amount The amount to send
     */
    function sendTokens(address recipient, uint256 amount) external onlyRegistered {
        require(playerBalances[msg.sender] >= amount, "Insufficient balance");
        require(recipient != address(0), "Invalid recipient");
        
        playerBalances[msg.sender] -= amount;
        
        // Record transaction for sender
        playerTransactions[msg.sender].push(Transaction({
            from: msg.sender,
            to: recipient,
            amount: amount,
            transactionType: "send",
            timestamp: block.timestamp
        }));
        
        payable(recipient).transfer(amount);
        
        emit TokensSent(msg.sender, recipient, amount, block.timestamp);
    }
    
    /**
     * @dev Get player information
     * @param playerAddress The address of the player
     */
    function getPlayer(address playerAddress) external view returns (Player memory) {
        return players[playerAddress];
    }
    
    /**
     * @dev Get player balance
     * @param playerAddress The address of the player
     */
    function getPlayerBalance(address playerAddress) external view returns (uint256) {
        return playerBalances[playerAddress];
    }
    
    /**
     * @dev Get player transactions
     * @param playerAddress The address of the player
     */
    function getPlayerTransactions(address playerAddress) external view returns (Transaction[] memory) {
        return playerTransactions[playerAddress];
    }
    
    /**
     * @dev Get all registered players (for leaderboard)
     */
    function getAllPlayers() external view returns (address[] memory) {
        return registeredPlayers;
    }
    
    /**
     * @dev Get leaderboard data
     */
    function getLeaderboard() external view returns (
        address[] memory addresses,
        uint256[] memory challengesCompleted,
        uint256[] memory tokensEarned
    ) {
        uint256 length = registeredPlayers.length;
        addresses = new address[](length);
        challengesCompleted = new uint256[](length);
        tokensEarned = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            address playerAddr = registeredPlayers[i];
            addresses[i] = playerAddr;
            challengesCompleted[i] = players[playerAddr].totalChallengesCompleted;
            tokensEarned[i] = players[playerAddr].totalTokensEarned;
        }
        
        return (addresses, challengesCompleted, tokensEarned);
    }
    
    /**
     * @dev Deposit CELO to contract for rewards (only owner)
     */
    function depositFunds() external payable onlyOwner {
        require(msg.value > 0, "Must send CELO");
        emit FundsDeposited(msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev Get contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    /**
     * @dev Fallback function to receive CELO
     */
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value, block.timestamp);
    }
}
