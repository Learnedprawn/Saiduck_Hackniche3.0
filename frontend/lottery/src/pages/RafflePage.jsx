import React, { useState, useEffect } from 'react';
import { BellRing, Ticket, Trophy, Wallet } from 'lucide-react';
import PiggyBankVisualization from '../components/piggyBank/PiggyBank';
import MoneyWaterfall from '../components/piggyBank/PiggyBank';
import Raffle from "../../../../backend/out/Raffle.sol/Raffle.json";
import { ethers } from 'ethers';
import { getBlockDetails } from 'viem/zksync';

// Mock Web3 connection - in a real app, you'd use ethers.js or web3.js
const mockContractData = {
  entranceFee: "1.01",
  numberOfPlayers: 1200,
  lastWinner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  userTickets: 2,
  rafflState: "OPEN",
  balance: "0.12"
};

const formatAddress = (address) => {
  if (!address) return "No winner yet";
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const RafflePage = () => {
  const [contractData, setContractData] = useState({
    entranceFee: '',
    numberOfPlayers: '',
    lastWinner: '',
    userTickets: '',
    raffleState: '',
    balance: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState("0x123...4567");
  const [txStatus, setTxStatus] = useState(null);
  const [raffleContract, setRaffleContract] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a new contract instance with the signer
      const contractInstance = new ethers.Contract(
        import.meta.env.VITE_RAFFLE_CONTRACT_ADDRESS,
        Raffle.abi,
        signer
      );
      setRaffleContract(contractInstance);
    }
  }, []);

  useEffect(() => {

    const getRaffleDetails = async () => {
      const fee = await raffleContract.getEntranceFee();
      setContractData((prev) => ({ ...prev, entranceFee: ethers.utils.formatEther(fee) }));
      const players = await raffleContract.getNumberOfPlayers();
      setContractData((prev) => ({ ...prev, numberOfPlayers: players.toString() }));
      const winner = await raffleContract.getRecentWinner();
      setContractData((prev) => ({ ...prev, lastWinner: winner }));
      // const tickets = await raffleContract.getUserTickets();
      // setContractData((prev) => ({ ...prev, userTickets: tickets.toString() }));
      const state = await raffleContract.getRaffleState();
      setContractData((prev) => ({ ...prev, raffleState: state }));
      const balance = players * fee;
      setContractData((prev) => ({ ...prev, balance: balance.toString() }));
      console.log(contractData);
    }

    if (raffleContract) {
      getRaffleDetails();
    }
  }, [raffleContract]);


  useEffect(() => {
    console.log(contractData);
  }, [contractData]);

  const handleBuyTicket = async () => {
    setIsLoading(true);
    setTxStatus("Processing your ticket purchase...");

    try {
      // This would be a real contract interaction in production
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update mock data after purchase
      setContractData(prev => ({
        ...prev,
        numberOfPlayers: prev.numberOfPlayers + 1,
        userTickets: prev.userTickets + 1,
        balance: (parseFloat(prev.balance) + parseFloat(prev.entranceFee)).toFixed(2)
      }));

      setTxStatus("Ticket purchased successfully!");
    } catch (error) {
      setTxStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setTxStatus(null), 3000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Trophy className="mr-2" />
            <h1 className="text-xl font-bold">Raffle LotteryX</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Ticket className="mr-1" size={16} />
              <span>{contractData.userTickets} Tickets</span>
            </div>
            <div className="flex items-center">
              <Wallet className="mr-1" size={16} />
              <span>{userAddress}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Status Messages */}
        {txStatus && (
          <div className={`mb-6 p-4 rounded-lg ${txStatus.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
            {txStatus}
          </div>
        )}

        {/* Prize Pool Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* <PiggyBankVisualization price = {contractData.entranceFee} number = {contractData.numberOfPlayers}></PiggyBankVisualization> */}
          {/* <MoneyWaterfall money = {contractData.balance} number = {contractData.numberOfPlayers} price = {contractData.entranceFee}/> */}
          <div className="bg-blue-800 text-white p-4">
            <h2 className="text-xl font-semibold">Current Prize Pool</h2>
            <MoneyWaterfall money={contractData.balance} number={contractData.numberOfPlayers} price={contractData.entranceFee} />

          </div>
          {/* <div className="p-6 text-center">
            <div className="text-4xl font-bold text-blue-800 mb-2">
              {contractData.balance} ETH
            </div>
            <p className="text-gray-600">
              {contractData.numberOfPlayers} players have entered
            </p>
          </div> */}
        </div>

        {/* Buy Ticket & Info Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Buy Ticket Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-800 text-white p-4">
              <h2 className="text-xl font-semibold">Buy Ticket</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-700 font-semibold">Entrance Fee</p>
                  <p className="text-2xl font-bold">{contractData.entranceFee} ETH</p>
                </div>
                <button
                  onClick={handleBuyTicket}
                  disabled={isLoading || contractData.raffleState !== "OPEN"}
                  className={`px-6 py-3 rounded-lg font-semibold ${isLoading || contractData.raffleState !== "OPEN"
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {isLoading ? 'Processing...' : 'Buy Ticket'}
                </button>
              </div>
              {contractData.raffleState !== "OPEN" && (
                <div className="text-yellow-600 text-sm mt-2 flex items-center">
                  <BellRing size={16} className="mr-1" />
                  Raffle is currently in calculation mode. Please wait.
                </div>
              )}
            </div>
          </div>

          {/* Last Winner Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-800 text-white p-4">
              <h2 className="text-xl font-semibold">Last Winner</h2>
            </div>
            <div className="p-6 text-center">
              <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
              <p className="text-gray-600 mb-2">The most recent winner</p>
              <div className="font-mono text-lg font-bold bg-gray-100 py-2 px-4 rounded">
                {formatAddress(contractData.lastWinner)}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2025 LOTTO LOTTERY. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Smart Contract Powered by Chainlink VRF</p>
      </footer>
    </div>
  );
};

export default RafflePage;