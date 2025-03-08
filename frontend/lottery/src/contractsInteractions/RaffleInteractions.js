
// import { ethers } from "ethers";
// import Raffle from "../../../../backend/out/Raffle.sol/Raffle.json";
// import { useEffect,useState } from "react";

// // Raffle contract address from environment variables
// const [contract, setContract] = useState(null);

// export const useRaffleContract = () => {

  
//   const contract = new ethers.Contract({ import.meta.env.VITE_RAFFLE_CONTRACT_ADDRESS, Raffle.abi, address });

//   setContract(contract);
// };

// export const buyTicket = async (value) => {
//   if (!contract) throw new Error("Contract not initialized");
//   const tx = await contract.enterRaffle({ value: ethers.utils.parseEther(value) });
//   await tx.wait();
//   return tx;
// };

// export const getFee = async () => {
//   if (!contract) throw new Error("Contract not initialized");
//   const fee = await contract.getEntranceFee();
//   return ethers.utils.formatEther(fee);
// };



// export const getAllEntries = async () => {
//   const entries = await contract.getNumberOfPlayers();
//   return entries;
// }

// export const getInterval = async () => {
//   const interval = await contract.getInterval();
//   return interval;
// }

// export const getLastTime = async () => {
//   const lastTime = await contract.getLastTimeStamp();
//   return lastTime;
// }

// export const getLastWinner = async () => {
//   const lastWinner = await contract.getRecentWinner();
//   return lastWinner;
// }

// export const getState = async () => {
//   const state = await contract.getRaffleState();
//   return state;
// }


