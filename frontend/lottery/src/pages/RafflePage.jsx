import React, { useState, useEffect } from "react";
import {
  BellRing,
  Ticket,
  Trophy,
  Wallet,
  Clock,
  CheckCircle,
  UserPlus,
} from "lucide-react";
import PiggyBankVisualization from "../components/piggyBank/PiggyBank";
import MoneyWaterfall from "../components/piggyBank/PiggyBank";
import Raffle from "../../../../backend/out/Raffle.sol/Raffle.json";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import WinnerAlert from "../components/winner/winnerAlert";
import Winner from "../components/winner/winner";

// Mock Web3 connection - in a real app, you'd use ethers.js or web3.js
// const mockContractData = {
//   entranceFee: "1.01",
//   numberOfPlayers: 1200,
//   lastWinner: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
//   userTickets: 2,
//   raffleState: "OPEN",
//   balance: "0.12",
// };

const formatAddress = (address) => {
  if (!address) return "No winner yet";
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;
};

const RafflePage = () => {
  const { address } = useAccount();
  const [contractData, setContractData] = useState({
    entranceFee: '',
    numberOfPlayers: '',
    lastWinner: '',
    userTickets: '',
    raffleState: '',
    balance: '',
    remaining_time: '',
    interval_var: '',
    last_timestamp: '',
    block_timestamp: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [userAddress, setUserAddress] = useState(address);
  const [txStatus, setTxStatus] = useState(null);
  const [raffleContract, setRaffleContract] = useState(null);
  // const [remainingTime, setRemainingTime] = useState(null);
  // const [interval, setIntervalTime] = useState(null);
  // const [lastTimeStamp, setLastTimeStamp] = useState(null);

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (address === contractData.lastWinner) {
      setShowModal(true);
    }
  }, [contractData.lastWinner, address]);

  // Add this useEffect to update the timer every second
  useEffect(() => {
    // Only start the timer if we have valid data and the raffle is open
    if (contractData.remaining_time && contractData.raffleState == '0') {
      // Initialize the timer with the contract data
      setTimeRemaining(parseInt(contractData.remaining_time));

      // Set up interval to count down every second
      const timerInterval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timerInterval);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Clean up interval on component unmount or when raffle state changes
      return () => clearInterval(timerInterval);
    } else {
      setTimeRemaining(0);
    }
  }, [contractData.remaining_time, contractData.raffleState]);

  useEffect(() => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create a new contract instance with the signer
      const contractInstance = new ethers.Contract(
        // import.meta.env.VITE_RAFFLE_CONTRACT_ADDRESS,
        "0x5E97EaD8149761585a7176E59b18786063e63be5",
        Raffle.abi,
        signer
      );
      setRaffleContract(contractInstance);
      console.log(contractInstance);
    }
  }, []);

  useEffect(() => {
    const getRaffleDetails = async () => {
      const fee = await raffleContract.getEntranceFee();
      setContractData((prev) => ({
        ...prev,
        entranceFee: ethers.utils.formatEther(fee),
      }));
      const players = await raffleContract.getNumberOfPlayers();
      setContractData((prev) => ({
        ...prev,
        numberOfPlayers: players.toString(),
      }));
      const last_winner = await raffleContract.getRecentWinner();
      setContractData((prev) => ({ ...prev, lastWinner: last_winner }));

      const tickets = await raffleContract.getPlayerEntries(address);
      setContractData((prev) => ({ ...prev, userTickets: tickets.toString() }));

      const state = await raffleContract.getRaffleState();
      setContractData((prev) => ({ ...prev, raffleState: state }));

      const interval = await raffleContract.getInterval();
      setContractData((prev) => ({ ...prev, interval_var: interval }));

      const last_ts = await raffleContract.getLastTimeStamp();
      setContractData((prev) => ({ ...prev, last_timestamp: last_ts }));

      // const block_ts = await raffleContract.getBlockTimeStamp();
      // setContractData((prev) => ({ ...prev, block_timestamp: block_ts }));

      // const rem_time_var = await raffleContract.getTimeRemaining();
      // setContractData((prev) => ({ ...prev, remaining_time: rem_time_var }));

      // console.log("remaining_time: " + rem_time_var);

      const currentTime = Math.floor(Date.now() / 1000); // Get current timestamp in seconds
      const blockTime = Number(currentTime); // Get current timestamp in seconds
      const intervalNum = Number(interval); // Ensure it's a number
      const lastTsNum = Number(last_ts); // Ensure it's a number

      // const rem_time = intervalNum - (currentTime - lastTsNum);
      // Calculate remaining time using modulo
      const rem_time = intervalNum - ((blockTime - lastTsNum) % intervalNum);

      console.log("BLOCK TIME: " + blockTime);
      console.log("INTERVAL TIME: " + interval);
      console.log("LAST TS: " + last_ts);
      console.log("REMAINING TIME: " + rem_time);

      // setContractData((prev) => ({ ...prev, remaining_time: rem_time > 0 ? rem_time : 0 }));
      setContractData((prev) => ({
        ...prev,
        interval_var: intervalNum,
        last_timestamp: lastTsNum,
        remaining_time: Math.max(rem_time, 0) // Ensure it doesn't go negative 
      }));


      // const balance = Number(players) * Number(fee);
      const balance = Number(players) * Number(ethers.utils.formatEther(fee));

      console.log("BALANCE: " + balance);

      setContractData((prev) => ({ ...prev, balance: balance.toString() }));
      // console.log(contractData);
    };

    if (raffleContract) {
      getRaffleDetails();
    }
  }, [raffleContract]);


  // Replace your existing timeRemaining useEffect with this one
  useEffect(() => {
    // Only start the timer if we have valid data and the raffle is open
    if (contractData.raffleState == '0') {
      // Initialize the timer with the contract data when it first loads
      if (contractData.remaining_time) {
        setTimeRemaining(parseInt(contractData.remaining_time));
      }

      // Set up interval to count down every second
      const timerInterval = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 0) {
            // When timer reaches zero, calculate the new remaining time
            const currentTime = Math.floor(Date.now() / 1000);
            const intervalNum = Number(contractData.interval_var);
            const lastTsNum = Number(contractData.last_timestamp);
            const newRemTime = intervalNum - ((currentTime - lastTsNum) % intervalNum);

            // Return the new calculated time
            return Math.max(newRemTime, 0);
          }
          // Otherwise just decrement by 1 second
          return prevTime - 1;
        });
      }, 1000);

      // Clean up interval on component unmount or when raffle state changes
      return () => clearInterval(timerInterval);
    }
  }, [contractData.raffleState, contractData.remaining_time, contractData.interval_var, contractData.last_timestamp]);

  useEffect(() => {
    console.log(contractData);
  }, [contractData]);

  const handleBuyTicket = async () => {
    setIsLoading(true);
    setTxStatus("Processing your ticket purchase...");

    try {
      // This would be a real contract interaction in production
      const tx = await raffleContract.enterRaffle({
        value: ethers.utils.parseEther(contractData.entranceFee),
      });
      await tx.wait();
      // Update mock data after purchase
      setContractData((prev) => ({
        ...prev,
        numberOfPlayers: Number(prev.numberOfPlayers) + 1,
        userTickets: Number(prev.userTickets) + 1,
        balance: (
          parseFloat(prev.balance) + parseFloat(prev.entranceFee)
        ).toFixed(2),
      }));

      setTxStatus("Ticket purchased successfully!");
    } catch (error) {
      setTxStatus(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setTxStatus(null), 3000);
    }
  };

  // Function to get status badge styling based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 0:
        return "bg-green-100 text-green-800";
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 0:
        return <UserPlus className="mr-2" size={20} />;
      case 1:
        return <Clock className="mr-2" size={20} />;
      case 2:
        return <CheckCircle className="mr-2" size={20} />;
      default:
        return <BellRing className="mr-2" size={20} />;
    }
  };

  // Function to get status description based on status
  const getStatusDescription = (status) => {
    switch (status) {
      case 0:
        return "The lottery is open for entries. Buy your tickets now!";
      case 1:
        return "Calculating the winner. Please wait while we process the results.";
      case 2:
        return "Voting period is open. Cast your vote for the next lottery parameters.";
      default:
        return "Lottery status unavailable.";
    }
  };

  const simulateUpKeep = async () => {
    try {
      if (!raffleContract) {
        console.log("Raffle contract not initialized");
        return;
      }

      const tx = await raffleContract.performUpkeep("0x");
      await tx.wait();

      // Listen for WinnerPicked event
      raffleContract.once("WinnerPicked", async (winner) => {
        console.log("Winner selected:", winner);

        // Fetch and update the winner in UI
        const updatedWinner = await raffleContract.getRecentWinner();
        setContractData((prev) => ({ ...prev, lastWinner: updatedWinner }));
      });

    } catch (error) {
      console.error("Error performing upkeep:", error);
    }
  }
  const handleModalClose = () => {
    setShowModal(false);
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

      {/* <div className="relative">
            <WinnerAlert show={showModal} onClose={() => setShowModal(false)} />
            <h1 className="text-3xl font-bold">Welcome to the Raffle!</h1>
          </div> */}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Status Messages */}
        {txStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${txStatus.includes("Error")
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
              }`}
          >
            {txStatus}
          </div>
        )}



        {/* Raffle Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-lg flex items-center ${getStatusBadgeClass(contractData.raffleState)}`}>
            {getStatusIcon(contractData.raffleState)}
            <div>
              <h3 className="font-bold text-lg">Lottery Status: {contractData.raffleState == '0' ? "OPEN" : (contractData.raffleState == 1 ? "CALCULATING" : "VOTING")}</h3>
              <p>{getStatusDescription(contractData.raffleState)}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold text-lg mb-2">Time Remaining</h3>
            {contractData.raffleState == '0' ? (
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-blue-800">
                    {Math.floor(timeRemaining / 86400)}
                  </span>
                  <span className="text-gray-600 text-sm">Days</span>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-blue-800">
                    {Math.floor((timeRemaining % 86400) / 3600)}
                  </span>
                  <span className="text-gray-600 text-sm">Hours</span>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-blue-800">
                    {Math.floor((timeRemaining % 3600) / 60)}
                  </span>
                  <span className="text-gray-600 text-sm">Minutes</span>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <span className="block text-2xl font-bold text-blue-800">
                    {Math.floor(timeRemaining % 60)}
                  </span>
                  <span className="text-gray-600 text-sm">Seconds</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Timer paused - Raffle is {contractData.raffleState == '1' ? "CALCULATING" : "in VOTING stage"}</p>
            )}
          </div>
        </div>


        <div className="mb-6 rounded-lg flex items-center ">
          <MoneyWaterfall money={contractData.balance} number={contractData.numberOfPlayers} price={contractData.entranceFee} />
        </div>
        {/* Prize Pool Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">

          <div className="bg-blue-800 text-white p-4">
            <h2 className="text-xl font-semibold">Current Prize Pool</h2>
          </div>
          <div className="p-6 text-center">
            <div className="text-4xl font-bold text-blue-800 mb-2">
              {contractData.balance} ETH
            </div>
            <p className="text-gray-600">
              {contractData.numberOfPlayers} players have entered
            </p>
          </div>
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
                  <p className="text-2xl font-bold">
                    {contractData.entranceFee} ETH
                  </p>
                </div>
                <button
                  onClick={handleBuyTicket}
                  disabled={isLoading || contractData.raffleState != "0"}
                  className={`px-6 py-3 rounded-lg font-semibold ${isLoading || contractData.raffleState != "0"
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                >
                  {isLoading ? "Processing..." : "Buy Ticket"}
                </button>
              </div>
              {contractData.raffleState !== "OPEN" && (
                <div className="text-yellow-600 text-sm mt-2 flex items-center">
                  <BellRing size={16} className="mr-1" />
                  {getStatusDescription(contractData.raffleState)}
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
        <button className="bg-blue-800 text-white py-2 px-4 rounded-lg font-semibold" onClick={() => simulateUpKeep()}>
          upkeep
        </button>
      </main>

      {/* Footer */}
      < footer className="bg-gray-800 text-white py-4 text-center" >
        <p>© 2025 LOTTO LOTTERY. All rights reserved.</p>
        <p className="text-sm text-gray-400 mt-1">Smart Contract Powered by Chainlink VRF</p>
      </ footer>

      {showModal && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50"
          onClick={handleModalClose}
        >
          <Winner />
          <div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold">You Won the Lottery!</h2>
            <p className="text-lg">Congratulations! You are the lucky winner.</p>

            <button
              className="bg-blue-800 text-white py-2 px-4 rounded-lg font-semibold"
              onClick={handleModalClose}
            >
              <BellRing size={16} className="mr-1" />
              Close
            </button>
          </div>
        </div>
      )}
    </div >
  );
};

export default RafflePage;
